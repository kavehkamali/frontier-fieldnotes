// Run: node /tmp/fieldnotes-simulation-test.mjs /absolute/path/to/dist/simulation.mjs
// If placed in repo/tests, run from repo root: node tests/simulation.test.mjs ./dist/simulation.mjs
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const modulePath = resolve(process.argv[2] || process.env.SIMULATION_MODULE ||
  './dist/simulation.mjs');
const S = await import(pathToFileURL(modulePath).href);
const {TAU, SOURCE_SCALE, QMAX, TARGETS, score, field, varianceAt, simulate,
  sampleFrame, endpointRMS, moments} = S;
const tau2 = TAU ** 2, L = Math.log((tau2 + QMAX) / tau2);
const names = Object.keys(TARGETS), stepCounts = [4, 8, 16, 32, 64, 128];
const end = s => s.frames.at(-1);
const report = {};

function logDensity(x, y, means, q) {
  const v = tau2 + q;
  const logs = means.map(([mx, my]) => -((x-mx)**2 + (y-my)**2)/(2*v));
  const m = Math.max(...logs);
  return m + Math.log(logs.reduce((z, a) => z + Math.exp(a-m), 0))
    - Math.log(means.length) - Math.log(2*Math.PI*v);
}

// Independent central differences catch a wrong sign, missing variance,
// incorrect posterior temperature, or failure to aggregate mixture modes.
let maxScoreError = 0;
for (const target of names) for (const q of [0, .0001, .1, 1, QMAX]) {
  const means = TARGETS[target].means;
  for (const [x,y] of [[0,0], [.5,-.7], [1.3,1.4], [-4.2,3.1]]) {
    const e = 1e-5, actual = score(x,y,means,q);
    const expected = [
      (logDensity(x+e,y,means,q)-logDensity(x-e,y,means,q))/(2*e),
      (logDensity(x,y+e,means,q)-logDensity(x,y-e,means,q))/(2*e)
    ];
    for(let k=0;k<2;k++) {
      const error = Math.abs(actual[k]-expected[k]);
      maxScoreError = Math.max(maxScoreError,error);
      assert(error < 2e-6, `score gradient mismatch ${target} q=${q}: ${error}`);
    }
  }
}
report.scoreFiniteDifferenceMaxAbsError = maxScoreError;
assert(Math.abs(varianceAt(0)-(tau2+QMAX)) < 1e-12);
assert(Math.abs(varianceAt(1)-tau2) < 1e-12);

// Analytic one-Gaussian solutions, independent of field implementation.
const singleMean = [1.4,-.8];
report.analyticConvergence = {};
for(const method of ['flow','ode']) for(const solver of ['euler','heun']) {
  const errors = [];
  for(const steps of [32,64,128]) {
    const sim = simulate({means:[singleMean],method,solver,steps,count:512,seed:71});
    const initial = sim.frames[0], exact = new Float64Array(initial.length);
    const scale = TAU / (method==='flow' ? SOURCE_SCALE : Math.sqrt(tau2+QMAX));
    for(let i=0;i<initial.length;i++) {
      const mu = singleMean[i%2];
      exact[i] = mu + scale * (method==='flow' ? initial[i] : initial[i]-mu);
    }
    errors.push(endpointRMS(end(sim),exact));
  }
  const ratios = [errors[0]/errors[1], errors[1]/errors[2]];
  const [low,high] = solver==='heun' ? [3.3,5.0] : [1.7,2.4];
  for(const r of ratios) assert(r>low && r<high, `${method}/${solver} convergence ratio ${r}`);
  report.analyticConvergence[`${method}/${solver}`] = {steps:[32,64,128],errors,ratios};
}

// All published control combinations must remain finite. Low-step outputs
// need not be accurate: showing discretization error is part of this lab.
let configurations=0, maxAbsCoordinate=0;
for(const target of names) for(const method of ['flow','ode','sde']) {
  for(const solver of ['euler','heun']) for(const steps of stepCounts) {
    const sim=simulate({target,method,solver,steps,count:96,seed:47});
    assert.equal(sim.frames.length,steps+1);
    for(const frame of sim.frames) for(const x of frame) {
      assert(Number.isFinite(x),`nonfinite ${target}/${method}/${solver}/${steps}`);
      maxAbsCoordinate=Math.max(maxAbsCoordinate,Math.abs(x));
    }
    const t=.431;
    const a=sampleFrame(sim,t), b=sampleFrame(sim,t);
    assert.deepEqual(a,b,'scrub reads must be deterministic');
    assert.deepEqual(sampleFrame(sim,-1),sim.frames[0]);
    assert.deepEqual(sampleFrame(sim,2),end(sim));
    configurations++;
  }
}
report.finiteStates = {configurations,maxAbsCoordinate};

// Seed replay is independent of animation clocks and export frame requests.
for(const target of names) for(const method of ['flow','ode','sde']) {
  const options={target,method,steps:32,count:64,seed:492};
  const a=simulate(options),b=simulate(options),c=simulate({...options,seed:493});
  assert.deepEqual(a.frames,b.frames,`replay failed ${target}/${method}`);
  assert.notDeepEqual(end(a),end(c),'different seeds must change samples');
}
report.deterministicReplay='all three shapes and methods passed';

// Test convergence for the actual multimodal targets against a fine reference.
report.mixtureConvergence={};
for(const target of names) for(const method of ['flow','ode']) {
  const options={target,method,solver:'heun',count:256,seed:492};
  const ref=end(simulate({...options,steps:2048}));
  const errors=[16,32,64,128].map(steps=>endpointRMS(end(simulate({...options,steps})),ref));
  for(let i=1;i<errors.length;i++) assert(errors[i]<errors[i-1],`mixture convergence ${target}/${method}`);
  assert(errors.at(-1)<.004,`128-step error too high ${target}/${method}: ${errors.at(-1)}`);
  report.mixtureConvergence[`${target}/${method}`]={steps:[16,32,64,128],errors};
}

function targetMoments(means) {
  const n=means.length;
  let x=0,y=0,mx2=0,my2=0,r2=0,r4=0;
  for(const [a,b] of means) {
    const r=a*a+b*b;
    x+=a/n;y+=b/n;mx2+=(a*a+tau2)/n;my2+=(b*b+tau2)/n;
    r2+=(r+2*tau2)/n;
    r4+=(r*r+8*tau2*r+8*tau2*tau2)/n;
  }
  return {x,y,r2,vx:mx2-x*x,vy:my2-y*y,vr2:r4-r2*r2};
}

// Independent one-dimensional Gaussian-mixture CDFs test distribution shape.
// This erf approximation has maximum absolute error below ~1.5e-7.
function normalCDF(x) {
  const z=Math.abs(x)/Math.SQRT2,t=1/(1+.3275911*z);
  const p=(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t;
  const erf=1-p*Math.exp(-z*z);
  return .5*(1+Math.sign(x)*erf);
}
function projectedCDFError(points,means) {
  let largest=0;
  for(let k=0;k<12;k++) {
    const angle=k*Math.PI/12,dx=Math.cos(angle),dy=Math.sin(angle);
    const projected=[];
    for(let i=0;i<points.length;i+=2)projected.push(dx*points[i]+dy*points[i+1]);
    projected.sort((a,b)=>a-b);
    const centers=means.map(([x,y])=>dx*x+dy*y);
    for(let i=0;i<projected.length;i++) {
      const cdf=centers.reduce((s,m)=>s+normalCDF((projected[i]-m)/TAU),0)/centers.length;
      largest=Math.max(largest,Math.abs(cdf-i/projected.length),Math.abs((i+1)/projected.length-cdf));
    }
  }
  return largest;
}

// SDE uses Euler-Maruyama regardless of solver argument. Test its discrete
// one-Gaussian variance recurrence, rather than pretend finite steps are exact.
const sdeCount=24000, sdeSteps=128, h=1/sdeSteps;
let discreteVariance=tau2+QMAX;
for(let n=0;n<sdeSteps;n++) {
  discreteVariance=(1-L*h)**2*discreteVariance+varianceAt(n*h)*L*h;
}
const singleSDE=simulate({means:[singleMean],method:'sde',steps:sdeSteps,count:sdeCount,seed:1103});
const singleEnd=end(singleSDE);
let xx=0,yy=0,mx=0,my=0;
for(let i=0;i<singleEnd.length;i+=2) {
  const x=singleEnd[i]-singleMean[0],y=singleEnd[i+1]-singleMean[1];
  mx+=x/sdeCount;my+=y/sdeCount;xx+=x*x/sdeCount;yy+=y*y/sdeCount;
}
const varianceSE=discreteVariance*Math.sqrt(2/sdeCount);
assert(Math.abs(xx-discreteVariance)<5*varianceSE);
assert(Math.abs(yy-discreteVariance)<5*varianceSE);
assert(Math.abs(mx)<5*Math.sqrt(discreteVariance/sdeCount));
assert(Math.abs(my)<5*Math.sqrt(discreteVariance/sdeCount));
report.sdeGaussian128={targetVariance:tau2,discreteVariance,expectedRelativeBias:discreteVariance/tau2-1,measuredSecondMoments:[xx,yy]};

// Distribution diagnostics, not same-seed path-RMS, for stochastic sampling.
// Permit Monte Carlo noise plus a stated finite-Euler-step discretization band.
report.sdeDistributions128={};
for(const target of names) {
  const means=TARGETS[target].means,expected=targetMoments(means);
  const sim=simulate({target,method:'sde',steps:128,count:16000,seed:713});
  const actual=moments(end(sim)),n=sim.count;
  const allowed={
    x:5*Math.sqrt(expected.vx/n)+.01,
    y:5*Math.sqrt(expected.vy/n)+.01,
    r2:5*Math.sqrt(expected.vr2/n)+.02
  };
  for(const k of ['x','y','r2']) assert(Math.abs(actual[k]-expected[k])<allowed[k],`SDE distribution ${target} ${k}`);
  const projectionCDFMaxError=projectedCDFError(end(sim),means);
  assert(projectionCDFMaxError<.025,`SDE projected CDF shape mismatch ${target}: ${projectionCDFMaxError}`);
  report.sdeDistributions128[target]={expected,actual,allowedAbsoluteError:allowed,projectionCDFMaxError};
}

// Print exact one-Gaussian finite-step bias: low steps are deliberately rough.
report.sdeVarianceBiasBySteps={};
for(const steps of stepCounts) {
  const h=1/steps;let v=tau2+QMAX;
  for(let n=0;n<steps;n++)v=(1-L*h)**2*v+varianceAt(n*h)*L*h;
  report.sdeVarianceBiasBySteps[steps]=v/tau2-1;
}
console.log(JSON.stringify({passed:true,modulePath,...report},null,2));

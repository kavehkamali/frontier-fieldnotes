import assert from 'node:assert/strict';
import {DEFAULTS,TAU,motion,samplePoint,cameraAt,closureMetrics,scenePoints,exportFrame,frameDelay} from '../dist/loop-math.mjs';
const close=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol,`${a} differs from ${b}`);
for(const amplitude of [0,.9,1.7])for(const harmonic of [0,.7,1.4])for(const period of [3,6,12]){
 const cfg={...DEFAULTS,amplitude,harmonic,period};
 for(const theta of [0,.6,2.5,5.8])for(const t of [0,.137,.73,1.2]){
  const p=samplePoint(theta,t,cfg),q=samplePoint(theta,t+1,cfg);p.position.forEach((x,i)=>close(x,q.position[i]));p.velocity.forEach((x,i)=>close(x,q.velocity[i]));
  // Finite differences are per second, not per normalized phase.
  const eps=1e-6,lo=samplePoint(theta,t-eps,cfg),hi=samplePoint(theta,t+eps,cfg);p.velocity.forEach((x,i)=>close(x,(hi.position[i]-lo.position[i])/(2*eps*period),1e-7));
 }
 const seam=closureMetrics(cfg);close(seam.position,0);close(seam.velocity,0);close(seam.camera,0);
}
const endpoint={...DEFAULTS,mode:'endpoint'},e=closureMetrics(endpoint);close(e.position,0);assert.ok(e.velocity>.8);
const drift={...DEFAULTS,mode:'drift'},d=closureMetrics(drift);assert.ok(d.position>.6);close(d.velocity,0);
for(const mode of ['endpoint','drift']){const cfg={...DEFAULTS,mode},t=.36,eps=1e-6,p=motion(.7,t,cfg),lo=motion(.7,t-eps,cfg),hi=motion(.7,t+eps,cfg);p.velocity.forEach((v,i)=>close(v,(hi.position[i]-lo.position[i])/(2*eps*cfg.period),1e-7));}
for(const mode of ['fixed','return']){const cfg={...DEFAULTS,cameraMode:mode};close(cameraAt(0,cfg).orbit,cameraAt(1,cfg).orbit);close(cameraAt(0,cfg).elevation,cameraAt(1,cfg).elevation);}
close(closureMetrics({...DEFAULTS,cameraMode:'drift'}).camera,35);
// Camera changes cannot alter 3D closure, and a closed scene does not close a drifting camera.
close(closureMetrics({...DEFAULTS,cameraMode:'drift'}).position,0);
const frames=Array.from({length:60},(_,i)=>exportFrame(DEFAULTS,i));assert.equal(new Set(frames.map(s=>s.phase.toFixed(8))).size,60);assert.ok(frames.every(s=>s.phase>=0&&s.phase<1));close(frames[0].phase,DEFAULTS.phase);assert.notEqual(frames.at(-1).phase,frames[0].phase);
for(let seconds=3;seconds<=12;seconds++){const delays=Array.from({length:60},(_,i)=>frameDelay(seconds,i));assert.equal(delays.reduce((a,b)=>a+b,0),seconds*1000);assert.ok(delays.every(d=>d%10===0));}
const points=scenePoints(DEFAULTS);assert.equal(points.length,840);assert.deepEqual(points,scenePoints(DEFAULTS));assert.deepEqual(scenePoints({...DEFAULTS,orbit:-50,cameraMode:'fixed'}),points);
for(const p of points){assert.ok(p.mean.every(Number.isFinite));assert.ok(p.S[0][0]*p.S[1][1]-p.S[0][1]**2>0);}
console.log('PASS: Fourier position and derivative periodicity, finite-difference velocities, endpoint-only velocity seam, drift position seam, independent camera closure, unique full-cycle frames, deterministic Gaussian scene');

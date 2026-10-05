import assert from 'node:assert/strict';
import {camera,project,covariance,scene,DEFAULTS,compositeFrontToBack} from '../dist/gaussian-math.mjs';
const close=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
const cam=camera(0,0,5),S=covariance([1,0,0],[0,1,0],[0,0,1],[.1,.2,.3]),p=project([0,0,0],S,cam,100);
close(p.x,0);close(p.y,0);close(p.Q[0][0],4);close(p.Q[1][1],16);close(p.Q[0][1],0);close(p.r1,4);close(p.r2,2);
// Off-axis perspective covariance agrees with a finite-difference Jacobian.
for(const az of [-60,0,55]){const c=camera(az,17),m=[.8,.5,.1],q=project(m,S,c,200),eps=1e-5,J=[[],[]];for(let k=0;k<3;k++){const lo=[...m],hi=[...m];lo[k]-=eps;hi[k]+=eps;const a=project(lo,S,c,200),b=project(hi,S,c,200);J[0][k]=(b.x-a.x)/(2*eps);J[1][k]=(b.y-a.y)/(2*eps);}for(let a=0;a<2;a++)for(let b=0;b<2;b++){let val=0;for(let i=0;i<3;i++)for(let j=0;j<3;j++)val+=J[a][i]*S[i][j]*J[b][j];close(q.Q[a][b],val,1e-5);}assert.ok(q.Q[0][0]*q.Q[1][1]-q.Q[0][1]**2>0);}
const rgb=compositeFrontToBack([{color:[1,0,0],alpha:.5},{color:[0,0,1],alpha:.5}]);rgb.forEach((v,i)=>close(v,[.75,.25,.5][i]));
const sharedA=scene({...DEFAULTS,mode:'shared'},0),sharedB=scene({...DEFAULTS,mode:'shared'},45);assert.deepEqual(sharedA,sharedB);assert.deepEqual(scene({...DEFAULTS,mode:'independent'},0),sharedA);assert.notDeepEqual(scene({...DEFAULTS,mode:'independent'},45),sharedA);assert.ok(scene({...DEFAULTS,mode:'empty'}).length<sharedA.length);assert.equal(sharedA.length,981);
console.log('PASS: projection finite differences, covariance positivity, alpha composition, fixed geometry, deliberate view dependence, masked scene, deterministic scene');

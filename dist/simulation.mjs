// Exact Gaussian-mixture fields. No clean endpoint is used during generation.
export const TAU = 0.22, SOURCE_SCALE = 1.8, QMAX = 5;
export const TARGETS = {
  ring: {name:'Six islands', means:Array.from({length:6},(_,k)=>[1.65*Math.cos(k*Math.PI/3),1.65*Math.sin(k*Math.PI/3)])},
  spiral: {name:'Spiral', means:Array.from({length:18},(_,k)=>{const a=k/17*Math.PI*3.3,r=.3+1.8*k/17;return [r*Math.cos(a),r*Math.sin(a)];})},
  moons: {name:'Two crescents', means:Array.from({length:16},(_,k)=>{const a=(k%8)/7*Math.PI;return k<8?[1.25*Math.cos(a)-.55,1.25*Math.sin(a)-.35]:[1.25*Math.cos(a)+.55,-1.25*Math.sin(a)+.35];})}
};
export function random(seed=42) {
  let state=seed>>>0;
  const uniform=()=>{state+=0x6D2B79F5;let t=state;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};
  return {uniform,normal:()=>Math.sqrt(-2*Math.log(Math.max(1e-12,uniform())))*Math.cos(2*Math.PI*uniform())};
}
export function posterior(x,y,means,scale,variance) {
  const logits=means.map(m=>-((x-scale*m[0])**2+(y-scale*m[1])**2)/(2*variance));
  const max=Math.max(...logits);let z=0,mx=0,my=0;
  for(let k=0;k<means.length;k++){const w=Math.exp(logits[k]-max);z+=w;mx+=w*means[k][0];my+=w*means[k][1];}
  return [mx/z,my/z];
}
export function varianceAt(t){return (TAU*TAU+QMAX)*Math.exp(-t*Math.log((TAU*TAU+QMAX)/(TAU*TAU)));}
export function score(x,y,means,q){const v=TAU*TAU+q,m=posterior(x,y,means,1,v);return [(m[0]-x)/v,(m[1]-y)/v];}
export function field(x,y,t,means,method='flow') {
  if(method==='flow'){
    const c=SOURCE_SCALE**2*(1-t)**2+TAU**2*t*t;
    const m=posterior(x,y,means,t,c),b=(TAU**2*t-SOURCE_SCALE**2*(1-t))/c;
    return [m[0]+b*(x-t*m[0]),m[1]+b*(y-t*m[1])];
  }
  const v=varianceAt(t),m=posterior(x,y,means,1,v),L=Math.log((TAU*TAU+QMAX)/(TAU*TAU));
  const factor=(method==='sde'?1:.5)*L;
  return [factor*(m[0]-x),factor*(m[1]-y)];
}
export function simulate({target='ring',method='flow',solver='heun',steps=64,count=800,seed=42,means=TARGETS[target].means}={}) {
  const rng=random(seed),h=1/steps,L=Math.log((TAU*TAU+QMAX)/(TAU*TAU));
  let points=new Float32Array(count*2);
  for(let i=0;i<count;i++){
    // This component is discarded immediately. Diffusion starts from exact p(qmax).
    const m=method==='flow'?[0,0]:means[Math.floor(rng.uniform()*means.length)];
    const scale=method==='flow'?SOURCE_SCALE:Math.sqrt(TAU*TAU+QMAX);
    points[2*i]=m[0]+scale*rng.normal();points[2*i+1]=m[1]+scale*rng.normal();
  }
  const frames=[points];
  for(let n=0;n<steps;n++){
    const t=n*h,next=new Float32Array(points.length);
    for(let i=0;i<count;i++){
      const x=points[2*i],y=points[2*i+1],u=field(x,y,t,means,method);
      let nx=x+h*u[0],ny=y+h*u[1];
      if(method==='sde'){
        const std=Math.sqrt(varianceAt(t)*L*h);
        nx+=std*rng.normal();ny+=std*rng.normal();
      }else if(solver==='heun'){
        const w=field(nx,ny,(n+1)*h,means,method);nx=x+h*(u[0]+w[0])/2;ny=y+h*(u[1]+w[1])/2;
      }
      next[2*i]=nx;next[2*i+1]=ny;
    }
    points=next;frames.push(points);
  }
  return {frames,steps,count,means,method,solver:method==='sde'?'euler-maruyama':solver,seed,target};
}
export function sampleFrame(sim,t) {
  const f=Math.max(0,Math.min(1,t))*sim.steps,i=Math.floor(f),mix=f-i;
  if(i===sim.steps||mix===0)return sim.frames[i];
  const a=sim.frames[i],b=sim.frames[i+1],out=new Float32Array(a.length);
  for(let k=0;k<a.length;k++)out[k]=a[k]+mix*(b[k]-a[k]);return out;
}
export function endpointRMS(a,b){let sum=0;for(let i=0;i<a.length;i++)sum+=(a[i]-b[i])**2;return Math.sqrt(sum/(a.length/2));}
export function moments(points){let x=0,y=0,r2=0;for(let i=0;i<points.length;i+=2){x+=points[i];y+=points[i+1];r2+=points[i]**2+points[i+1]**2;}const n=points.length/2;return {x:x/n,y:y/n,r2:r2/n};}

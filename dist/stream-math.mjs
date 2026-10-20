// Original deterministic teaching scene. No learned probe, codec or model weights.
import {camera,project} from './gaussian-math.mjs';
export const DEFAULTS={frame:19,gop:24,budget:35,ranking:'all',colorChange:true,orbit:18,labels:true};
export const TOTAL_FRAMES=96;
const tau=Math.PI*2, clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function makeScene(){
 const p=[];const add=(mean,color,kind,s=.055)=>p.push({id:p.length,mean,color,kind,S:[[s*s,0,0],[0,s*s,0],[0,0,s*s]]});
 for(let i=0;i<16;i++)for(let j=0;j<8;j++)add([-1.85+i*.245,-1.04,-.85+j*.24],[170,184,199],'stable',.035);
 for(let i=0;i<12;i++)for(let j=0;j<9;j++)add([-.95+i*.105,-.38+j*.115,-.58],[123,101,191],'color',.062);
 for(let i=0;i<60;i++)for(let j=0;j<3;j++){const a=i/59*tau*1.25,r=.32+j*.055;add([.73+r*Math.cos(a),-.77+i/59*1.75,r*Math.sin(a)],[219,139+Math.round(20*j),107],'motion',.055);}
 // Thin stable frame around the changing light panel.
 for(let i=0;i<25;i++){const x=-1.07+i*.057;add([x,-.51,-.6],[87,167,180],'stable',.032);add([x,.67,-.6],[87,167,180],'stable',.032);}
 return p;
}
export const SCENE=makeScene();
export function atFrame(point,frame,cfg=DEFAULTS){
 const t=frame/TOTAL_FRAMES*tau;let mean=point.mean.slice(),color=point.color.slice();
 if(point.kind==='motion'){const a=point.id*.1;mean[0]+=.36*Math.sin(t+a*.08);mean[1]+=.10*Math.sin(t*2+a*.16);mean[2]+=.20*Math.sin(t+a*.13);}
 if(point.kind==='color'&&cfg.colorChange){const z=(1-Math.cos(t+point.mean[0]*.6))/2;const target=[62,181,190];color=color.map((v,i)=>v+(target[i]-v)*z);}
 return {...point,mean,color};
}
export function groupStart(frame,gop){return Math.floor(clamp(Math.floor(frame),0,TOTAL_FRAMES-1)/gop)*gop;}
export function score(point,start,cfg){
 const first=atFrame(point,start,cfg);let best=0;
 // Oracle access to synthetic trajectories across the group; not the paper's learned probe.
 for(let i=1;i<=6;i++){const s=atFrame(point,Math.min(TOTAL_FRAMES-1,start+(cfg.gop-1)*i/6),cfg);let d=s.mean.reduce((v,x,k)=>v+(x-first.mean[k])**2,0);
  if(cfg.ranking==='all')d+=s.color.reduce((v,x,k)=>v+((x-first.color[k])/255)**2,0)*4;
  best=Math.max(best,d);
 }return best;
}
export function partition(cfg=DEFAULTS){
 const start=groupStart(cfg.frame,cfg.gop),count=Math.round(SCENE.length*clamp(cfg.budget,0,100)/100);
 const ranked=SCENE.map(p=>({id:p.id,score:score(p,start,cfg)})).sort((a,b)=>b.score-a.score||a.id-b.id);
 return {start,selected:new Set(ranked.slice(0,count).map(p=>p.id)),ranked,count};
}
export function snapshot(cfg=DEFAULTS,part=partition(cfg)){
 const frame=clamp(cfg.frame,0,TOTAL_FRAMES-1),reference=SCENE.map(p=>atFrame(p,frame,cfg));
 const reused=SCENE.map(p=>({...atFrame(p,part.selected.has(p.id)?frame:part.start,cfg),selected:part.selected.has(p.id)}));
 return {reference,reused,part};
}
export function recordBudget(n,m,k){const all=n*k,reuse=n+m*(k-1);return {all,reuse,reduction:all?1-reuse/all:0};}
export function raster(points,orbit=18,width=120,height=80){
 const pixels=new Float64Array(width*height*3);pixels.fill(1);
 const cam=camera(orbit,13,5.4),f=Math.min(width*.96,height*1.42);
 const projected=points.map(p=>({p,q:project(p.mean,p.S,cam,f,width*.5,height*.5)})).filter(x=>x.q).sort((a,b)=>b.q.z-a.q.z);
 for(const {p,q}of projected){
  const a=q.Q[0][0],b=q.Q[0][1],d=q.Q[1][1],det=a*d-b*b;if(det<=0)continue;
  const rx=3*Math.sqrt(a),ry=3*Math.sqrt(d),minx=Math.max(0,Math.floor(q.x-rx)),maxx=Math.min(width-1,Math.ceil(q.x+rx)),miny=Math.max(0,Math.floor(q.y-ry)),maxy=Math.min(height-1,Math.ceil(q.y+ry));
  for(let y=miny;y<=maxy;y++)for(let x=minx;x<=maxx;x++){const dx=x+.5-q.x,dy=y+.5-q.y,z=(d*dx*dx-2*b*dx*dy+a*dy*dy)/det;if(z>9)continue;const alpha=.72*Math.exp(-.5*z),o=(y*width+x)*3;for(let c=0;c<3;c++)pixels[o+c]=alpha*p.color[c]/255+(1-alpha)*pixels[o+c];}
 }return pixels;
}
export function imageError(a,b){let sum=0;for(let i=0;i<a.length;i++)sum+=(a[i]-b[i])**2;const mse=sum/a.length;return {mse,rmse:Math.sqrt(mse),psnr:mse<1e-16?Infinity:-10*Math.log10(mse)};}
export function metrics(cfg=DEFAULTS,ss=snapshot(cfg)){
 const k=Math.min(cfg.gop,TOTAL_FRAMES-ss.part.start),budget=recordBudget(SCENE.length,ss.part.count,k);
 const error=imageError(raster(ss.reference,cfg.orbit),raster(ss.reused,cfg.orbit));
 return {...budget,...error,count:ss.part.count,total:SCENE.length,stable:SCENE.length-ss.part.count};
}
export function exportFrame(cfg,index,total){return {...cfg,frame:Math.floor(index/total*TOTAL_FRAMES)};}

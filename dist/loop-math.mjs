// Analytic teaching scene. No learned weights or OuroWorld inference.
import {covariance} from './gaussian-math.mjs';
export const TAU=2*Math.PI;
export const DEFAULTS={phase:.18,period:6,amplitude:1,harmonic:.55,orbit:22,elevation:15,mode:'periodic',cameraMode:'return',footprints:false};
export const wrap=x=>((x%1)+1)%1;
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const norm=a=>Math.hypot(...a);
const delta=(a,b)=>a.map((v,i)=>v-b[i]);
const driftDirection=theta=>[.65+.2*Math.cos(theta),.16*Math.sin(theta),.28*Math.cos(theta)];
/** phase may be 1: do not wrap here, because seam diagnostics need both endpoints. */
export function motion(theta,phase,settings=DEFAULTS){
 const a=settings.amplitude,b=settings.harmonic,w=TAU*phase,q=2*w+theta;
 const position=[a*(.26*Math.cos(theta)*Math.sin(w)+.12*Math.sin(2*theta)*(Math.cos(w)-1))+b*.18*Math.cos(q),a*.25*Math.sin(theta)*Math.sin(w)+b*.20*Math.sin(q),a*.43*Math.sin(w+2*theta)+b*.20*Math.cos(2*w+3*theta)];
 const velocity=[a*(.26*Math.cos(theta)*Math.cos(w)-.12*Math.sin(2*theta)*Math.sin(w))+2*b*-.18*Math.sin(q),a*.25*Math.sin(theta)*Math.cos(w)+2*b*.20*Math.cos(q),a*.43*Math.cos(w+2*theta)+2*b*-.20*Math.sin(2*w+3*theta)].map(v=>v*TAU/settings.period);
 const d=driftDirection(theta),amount=settings.mode==='endpoint'?4*phase*(1-phase):settings.mode==='drift'?phase:0;
 const speed=settings.mode==='endpoint'?4*(1-2*phase)/settings.period:settings.mode==='drift'?1/settings.period:0;
 return {position:add(position,d.map(v=>v*amount)),velocity:add(velocity,d.map(v=>v*speed))};
}
export function samplePoint(theta,phase,settings=DEFAULTS,crossPhase=0){
 const r=.135,base=[(1.13+r*Math.cos(crossPhase))*Math.cos(theta),(1.13+r*Math.cos(crossPhase))*Math.sin(theta),.30*Math.sin(2*theta)+r*Math.sin(crossPhase)],m=motion(theta,phase,settings);
 return {position:add(base,m.position),velocity:m.velocity};
}
export function cameraAt(phase,settings=DEFAULTS){
 const offset=settings.cameraMode==='return'?20*Math.sin(TAU*phase):settings.cameraMode==='drift'?35*phase:0;
 return {orbit:settings.orbit+offset,elevation:settings.elevation};
}
/** RMS world-position/velocity seam over evenly sampled ribbon center angles. */
export function closureMetrics(settings=DEFAULTS){
 let p=0,v=0;const count=120;
 for(let i=0;i<count;i++){const a=samplePoint(TAU*i/count,0,settings),b=samplePoint(TAU*i/count,1,settings);p+=norm(delta(a.position,b.position))**2;v+=norm(delta(a.velocity,b.velocity))**2;}
 const c0=cameraAt(0,settings),c1=cameraAt(1,settings);
 return {position:Math.sqrt(p/count),velocity:Math.sqrt(v/count),camera:Math.abs(c1.orbit-c0.orbit)};
}
const stops=[[123,98,201],[80,177,187],[233,154,121],[123,98,201]];
function palette(t){const x=t*3,i=Math.min(2,Math.floor(x)),f=x-i;return stops[i].map((v,k)=>Math.round(v*(1-f)+stops[i+1][k]*f));}
export function scenePoints(settings=DEFAULTS){
 const points=[];
 for(let i=0;i<120;i++){const theta=TAU*i/120,tangent=[-Math.sin(theta),Math.cos(theta),0],normal=[Math.cos(theta),Math.sin(theta),0],S=covariance(tangent,normal,[0,0,1],[.058,.052,.057]);
  for(let j=0;j<7;j++){const q=TAU*j/7,{position}=samplePoint(theta,settings.phase,settings,q);points.push({mean:position,S,color:palette(i/120),index:i*7+j});}
 }
 return points;
}
/** A full cycle starts at the selected phase; endpoint N is deliberately excluded. */
export function exportFrame(settings,frame,total=60){return {...settings,phase:wrap(settings.phase+frame/total)};}

// GIF durations are centiseconds: distribute rounding so the full period stays exact.
export function frameDelay(period,frame,total=60){return 10*(Math.round((frame+1)*period*100/total)-Math.round(frame*period*100/total));}

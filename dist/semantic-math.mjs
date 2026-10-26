// Synthetic geometry only. No model, tokenizer, learned denoiser or calibrated LLaCO schedule.
export const DEFAULTS={progress:91,dimension:128,vocabulary:128,seed:7,steps:12,path:'sphere',lesson:'competition'};
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function normalize(input={}){
 const c={...DEFAULTS,...input};
 for(const k of ['progress','dimension','vocabulary','seed','steps'])if(!Number.isFinite(+c[k]))c[k]=DEFAULTS[k];
 c.progress=clamp(+c.progress,0,100);c.dimension=[8,32,128,512].includes(+c.dimension)?+c.dimension:128;
 c.vocabulary=[32,128,512].includes(+c.vocabulary)?+c.vocabulary:128;c.seed=clamp(Math.round(+c.seed),1,9999);
 c.steps=clamp(Math.round(+c.steps),4,32);c.path=c.path==='linear'?'linear':'sphere';c.lesson=c.lesson==='shrink'?'shrink':'competition';return c;
}
function random(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
let cachedKey='',cached=null;
export function vocabulary(cfg){
 const c=normalize(cfg),key=[c.dimension,c.vocabulary,c.seed,c.lesson].join(':');if(key===cachedKey)return cached;
 const rng=random(c.seed),normal=()=>Math.sqrt(-2*Math.log(Math.max(1e-12,rng())))*Math.cos(2*Math.PI*rng());
 const tokens=[{id:0,a:1,b:0,norm:1,name:'SOURCE'}];
 for(let i=1;i<c.vocabulary;i++){
  const v=Array.from({length:c.dimension},normal),norm=Math.hypot(...v);
  tokens.push({id:i,a:v[0]/norm,b:v[1]/norm,norm:.28+1.05*rng(),name:'T'+String(i).padStart(3,'0')});
 }
 // The shrink-only counterexample deliberately includes a nearby, shorter embedding.
 if(c.lesson==='shrink')tokens[1]={id:1,a:.8,b:.6,norm:.35,name:'SHORT'};
 cachedKey=key;cached=tokens;return tokens;
}
export function stateAt(gamma,path='sphere',lesson='competition'){
 const g=clamp(gamma,0,1);
 if(lesson==='shrink')return{x:1-.95*g,y:0,norm:1-.95*g};
 const x=path==='linear'?1-g:Math.cos(Math.PI*g/2),y=path==='linear'?g:Math.sin(Math.PI*g/2);
 return {x,y,norm:Math.hypot(x,y)};
}
// Source and noise are orthogonal unit basis vectors. Dot products are exact in D,
// because every state lies in their span. Projection distances are never used to rank.
export function scores(tokens,s){
 return tokens.map(t=>({...t,cosine:(t.a*s.x+t.b*s.y)/s.norm,euc:2*t.norm*(t.a*s.x+t.b*s.y)-t.norm*t.norm}));
}
export function crossing(token,path='sphere'){
 if(token.id===0||token.b<=0)return Infinity;
 const tau=(1-token.a)/token.b;
 return path==='linear'?tau/(1+tau):2*Math.atan(tau)/Math.PI;
}
export function sourceRank(tokens,g,path='sphere'){
 // Full-space directional gap; the same tolerance handles floating-point ties in the UI.
 const s=stateAt(g,path);
 return 1+tokens.slice(1).filter(t=>(t.a*s.x+t.b*s.y-s.x)/s.norm>1e-12).length;
}
const sigmoid=x=>1/(1+Math.exp(-clamp(x,-700,700)));
export function schedule(tokens,path='sphere'){
 const thresholds=tokens.slice(1).map(t=>crossing(t,path)).filter(Number.isFinite),bandwidth=.012;
 const logRank=g=>Math.log(1+thresholds.reduce((sum,t)=>sum+sigmoid((g-t)/bandwidth),0));
 const lo=logRank(0),hi=logRank(1),span=hi-lo;
 const decay=g=>span>1e-12?(logRank(g)-lo)/span:g;
 const time=g=>.9*decay(g)+.1*g;
 const inverse=t=>{if(t<=0)return 0;if(t>=1)return 1;let a=0,b=1;for(let i=0;i<45;i++){const m=(a+b)/2;if(time(m)<t)a=m;else b=m;}return(a+b)/2;};
 return {decay,time,inverse,thresholds,bandwidth};
}
export function analyze(input){
 const c=normalize(input),tokens=vocabulary(c),g=c.progress/100,s=stateAt(g,c.path,c.lesson),sc=scores(tokens,s);
 const directional=[...sc].sort((a,b)=>Math.abs(b.cosine-a.cosine)<=1e-12?a.id-b.id:b.cosine-a.cosine),euclidean=[...sc].sort((a,b)=>Math.abs(b.euc-a.euc)<=1e-12?a.id-b.id:b.euc-a.euc);
 const sched=schedule(tokens,c.path),uniform=Array.from({length:c.steps+1},(_,i)=>i/c.steps),semantic=uniform.map(sched.inverse);
 return{cfg:c,tokens,state:s,scores:sc,directional,euclidean,rank:1+sc.slice(1).filter(t=>t.cosine-sc[0].cosine>1e-12).length,
  norm:s.norm,schedule:sched,uniform,semantic,firstCrossing:Math.min(...sched.thresholds),
  projectedWinner:directional[0],disagree:directional[0].id!==euclidean[0].id};
}
// A smooth forward-and-back noising sweep, starting exactly at the selected state.
export function exportFrame(input,i,count=60){const c=normalize(input),phase=Math.acos(1-2*c.progress/100);return{...c,progress:50*(1-Math.cos(phase+2*Math.PI*i/count))};}

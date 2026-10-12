import {camera,project} from './gaussian-math.mjs';
import {DEFAULTS,TAU,wrap,motion,samplePoint,cameraAt,closureMetrics,scenePoints,exportFrame,frameDelay} from './loop-math.mjs';
import {GIFEncoder,quantize,applyPalette} from './vendor/gifenc.esm.js';
const C={ink:'#26344b',muted:'#8190a3',line:'#e7ebf2',violet:'#8367c8',cyan:'#4aa5b3',coral:'#d38269'};
const modeLabel={periodic:'FOURIER LOOP',endpoint:'SAME ENDPOINTS / VELOCITY KINK',drift:'ACCUMULATED DRIFT / POSITION JUMP'};
const cameraLabel={fixed:'fixed camera',return:'returning camera ±20°',drift:'one-way camera +35°'};
const text=(ctx,t,x,y,size=14,color=C.muted,weight=400)=>{ctx.font=`${weight} ${size}px Arial,sans-serif`;ctx.fillStyle=color;ctx.fillText(t,x,y);};
const line=(ctx,x,y,x2,y2,color=C.line,width=1)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();};
const dot=(ctx,x,y,r,color)=>{ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle=color;ctx.fill();};
const clean=v=>v<1e-8?0:v;
const unitCov=[[.003,0,0],[0,.003,0],[0,0,.003]];
function renderRibbon(ctx,box,cfg){
 const {x,y,w,h}=box,view=cameraAt(cfg.phase,cfg),cam=camera(view.orbit,view.elevation,5.7),f=Math.min(w*1.04,h*1.53),cx=x+w*.48,cy=y+h*.48;
 ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
 const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.min(w,h)*.56);glow.addColorStop(0,'#f8f6fe');glow.addColorStop(1,'#ffffff');ctx.fillStyle=glow;ctx.fillRect(x,y,w,h);
 for(let gx=-1.8;gx<=1.801;gx+=.22)for(let gz=-1.6;gz<=1.601;gz+=.22){const p=project([gx,-1.56,gz],unitCov,cam,f,cx,cy);if(p)dot(ctx,p.x,p.y,.8,'#dfe5ee');}
 // The selected point's full-cycle trajectory is a 3D guide, not generated geometry.
 ctx.beginPath();for(let i=0;i<=80;i++){const p=project(samplePoint(.6,i/80,cfg).position,unitCov,cam,f,cx,cy);if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}ctx.strokeStyle='#9984c966';ctx.lineWidth=1.4;ctx.setLineDash([3,5]);ctx.stroke();ctx.setLineDash([]);
 const splats=scenePoints(cfg).map(s=>({...s,p:project(s.mean,s.S,cam,f,cx,cy)})).filter(s=>s.p).sort((a,b)=>b.p.z-a.p.z);
 for(const s of splats){const p=s.p,rgb=s.color.join(',');ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.scale(p.r1,p.r2);const g=ctx.createRadialGradient(0,0,0,0,0,3);for(let i=0;i<=12;i++){const r=i/4;g.addColorStop(r/3,`rgba(${rgb},${.63*Math.exp(-r*r/2)*(i===12?0:1)})`);}ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,3,0,TAU);ctx.fill();ctx.restore();
  if(cfg.footprints&&s.index%35===0){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.strokeStyle='#4d448c72';ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(0,0,p.r1*2,p.r2*2,0,0,TAU);ctx.stroke();ctx.restore();}
 }
 const tracked=project(samplePoint(.6,cfg.phase,cfg).position,unitCov,cam,f,cx,cy);dot(ctx,tracked.x,tracked.y,7,'#fff');dot(ctx,tracked.x,tracked.y,4,C.violet);
 ctx.restore();
}
function renderChart(ctx,box,cfg,mobile=false){
 const {x,y,w,h}=box,metric=closureMetrics(cfg),fs=mobile?17:12;
 text(ctx,'FOLLOW ONE POINT',x,y+fs,fs,C.violet,500);text(ctx,'Horizontal displacement over one cycle',x,y+fs*2.7,mobile?15:11,C.muted);
 const top=y+fs*4.3,bottom=y+h-104,left=x+8,right=x+w-8,pts=Array.from({length:121},(_,i)=>motion(.6,i/120,cfg)),vals=pts.map(p=>p.position[0]),lo=Math.min(...vals)-.18,hi=Math.max(...vals)+.18,py=v=>bottom-(v-lo)/(hi-lo)*(bottom-top),px=t=>left+t*(right-left);
 for(let j=0;j<3;j++)line(ctx,left,top+j/2*(bottom-top),right,top+j/2*(bottom-top),C.line);
 ctx.beginPath();pts.forEach((p,i)=>{if(i===0)ctx.moveTo(px(0),py(p.position[0]));else ctx.lineTo(px(i/120),py(p.position[0]));});ctx.strokeStyle=C.violet;ctx.lineWidth=2.5;ctx.stroke();
 for(const [t,col]of [[0,C.cyan],[1,C.coral]]){const p=motion(.6,t,cfg),derivative=p.velocity[0]*cfg.period,dt=.065;line(ctx,px(t-dt),py(p.position[0]-derivative*dt),px(t+dt),py(p.position[0]+derivative*dt),col,3);dot(ctx,px(t),py(p.position[0]),4,col);}
 const current=motion(.6,cfg.phase,cfg);line(ctx,px(cfg.phase),top-4,px(cfg.phase),bottom+4,'#a897c688');dot(ctx,px(cfg.phase),py(current.position[0]),5,C.violet);
 text(ctx,'0',left,bottom+22,mobile?16:11,C.muted);ctx.textAlign='right';text(ctx,'T',right,bottom+22,mobile?16:11,C.muted);ctx.textAlign='left';
 text(ctx,'Tangent at start',x,bottom+47,mobile?15:11,C.cyan);text(ctx,'at return',x+w*.58,bottom+47,mobile?15:11,C.coral);
 text(ctx,metric.velocity>1e-6?'Endpoints meet. Tangents disagree.':metric.position>1e-6?'The path ends somewhere else.':'Position and tangent return together.',x,bottom+74,mobile?16:12,metric.position+metric.velocity>1e-6?C.coral:C.violet);
}
/** Deterministic canvas render shared by the live tool, PNG, GIF and editorial media. */
export function drawScene(ctx,width,height,cfg={...DEFAULTS},caption=true){
 const mobile=!caption&&height/width>1.0,scale=width/(mobile?600:1200),W=width/scale,H=height/scale,stacked=H/W>.85;
 ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,width,height);ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);ctx.scale(scale,scale);
 const pad=mobile?24:32,top=caption?112:35,bottom=caption?122:52,core=H-top-bottom;
 if(caption){text(ctx,'FRONTIER FIELDNOTES / KAVEH',pad,29,11,C.muted,500);text(ctx,'A loop can close. And still jerk.',pad,67,31,C.ink,500);text(ctx,'3D Gaussian motion · Fourier harmonics · position, velocity and camera closure',pad,94,13,C.muted);line(ctx,pad,107,W-pad,107);}
 const figure=stacked?{x:pad,y:top+25,w:W-pad*2,h:core*.61-25}:{x:pad,y:top+27,w:W*.69-pad,h:core-25};
 const chart=stacked?{x:pad+20,y:top+core*.62,w:W-pad*2-40,h:core*.38}:{x:W*.73,y:top+14,w:W*.27-pad,h:core-10};
 text(ctx,modeLabel[cfg.mode],pad,top+8,mobile?16:12,cfg.mode==='periodic'?C.violet:C.coral,500);renderRibbon(ctx,figure,cfg);renderChart(ctx,chart,cfg,mobile);
 if(!stacked)line(ctx,W*.705,top+24,W*.705,H-bottom-12,C.line);
 const y=H-bottom+23;line(ctx,pad,y-10,W-pad,y-10,C.line);const view=cameraAt(cfg.phase,cfg);
 text(ctx,`t = ${(cfg.phase*cfg.period).toFixed(2)} / ${cfg.period} s`,pad,y+12,mobile?17:13,C.ink);
 text(ctx,`${cameraLabel[cfg.cameraMode]} · ${view.orbit.toFixed(0)}°`,stacked?W*.40:W*.28,y+12,mobile?15:12,C.muted);
 const m=closureMetrics(cfg);
 if(caption){text(ctx,`SEAM  position ${clean(m.position).toFixed(3)}   ·   velocity ${clean(m.velocity).toFixed(3)}   ·   camera ${clean(m.camera).toFixed(1)}°`,pad,y+40,12,m.position+m.velocity+m.camera>1e-6?C.coral:C.violet);text(ctx,'Original analytic illustration · not OuroWorld inference or a benchmark.',pad,H-38,12,C.muted);text(ctx,'OuroWorld · 08 Oct 2026 · arxiv.org/abs/2610.12461v1',pad,H-18,11,C.violet);ctx.textAlign='right';text(ctx,'frontier-fieldnotes / loop lab',W-pad,H-18,10,C.muted);ctx.textAlign='left';}
 ctx.restore();return m;
}
const el=id=>document.getElementById(id),canvas=el('scene');
let settings={...DEFAULTS},playing=false,last=0,exporting=false,cancelled=false,exportProgress=0,lastExport=null;
const numeric=['phase','period','amplitude','harmonic','orbit'];
const factor=k=>k==='phase'?1000:['amplitude','harmonic'].includes(k)?100:1;
function sync(){for(const k of numeric)el(k).value=settings[k]*factor(k);el('phase-value').value=`${(settings.phase*settings.period).toFixed(2)} s / ${settings.period} s`;el('period-value').value=settings.period+' s';for(const k of ['amplitude','harmonic'])el(k+'-value').value=settings[k].toFixed(2)+'×';el('orbit-value').value=Math.round(settings.orbit)+'°';el('mode').value=settings.mode;el('cameraMode').value=settings.cameraMode;el('footprints').checked=settings.footprints;el('play').textContent=playing?'Ⅱ Pause motion':'▶ Play one-cycle motion';el('play').setAttribute('aria-pressed',String(playing));}
function draw(){const m=drawScene(canvas.getContext('2d'),canvas.width,canvas.height,settings,false);for(const k of ['position','velocity','camera']){el(k+'-readout').textContent=clean(m[k]).toFixed(k==='camera'?1:3)+(k==='camera'?'°':'');el(k+'-readout').classList.toggle('broken',m[k]>1e-6);}el('seam-note').textContent=m.position>1e-6?'The scene jumps when time wraps. Camera closure cannot repair that.':m.velocity>1e-6?'The scene returns to the same position, but its velocity changes abruptly.':m.camera>1e-6?'The 3D motion closes. This camera path does not return, so the shot generally will not loop.':'Position and velocity close. The returning camera also closes the shot.';sync();}
function pause(){playing=false;last=0;sync();}
for(const k of numeric)el(k).oninput=e=>{pause();settings[k]=+e.target.value/factor(k);draw();};
for(const k of ['mode','cameraMode'])el(k).onchange=e=>{settings[k]=e.target.value;draw();};el('footprints').onchange=e=>{settings.footprints=e.target.checked;draw();};
el('play').onclick=()=>{playing=!playing;last=0;sync();};el('reset').onclick=()=>{pause();settings={...DEFAULTS};draw();};
function tick(now){if(playing&&!exporting){if(last){settings.phase=wrap(settings.phase+(now-last)/(1000*settings.period));draw();}last=now;}requestAnimationFrame(tick);}requestAnimationFrame(tick);
let drag=null;canvas.onpointerdown=e=>{if(exporting)return;pause();drag={x:e.clientX,orbit:settings.orbit};canvas.setPointerCapture(e.pointerId);};canvas.onpointermove=e=>{if(!drag||exporting)return;settings.orbit=Math.max(-70,Math.min(70,drag.orbit+(e.clientX-drag.x)*.24));draw();};canvas.onpointerup=canvas.onpointercancel=()=>{drag=null;};canvas.onkeydown=e=>{if(exporting||!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();pause();settings.orbit=Math.max(-70,Math.min(70,settings.orbit+(e.key==='ArrowLeft'?-3:3)));draw();};
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
function outputCanvas(aspect){const c=document.createElement('canvas');c.width=aspect==='wide'?960:800;c.height=aspect==='wide'?540:800;return c;}
function lock(){const snapshot={...settings},wasPlaying=playing,controls=[...document.querySelectorAll('button,input,select')].filter(x=>x.id!=='cancel'),disabled=controls.map(x=>x.disabled);pause();exporting=true;cancelled=false;exportProgress=0;controls.forEach(x=>x.disabled=true);return {snapshot,restore(){settings=snapshot;exporting=false;controls.forEach((x,i)=>x.disabled=disabled[i]);el('cancel').hidden=true;playing=wasPlaying;last=0;draw();}};}
async function exportPNG(){if(exporting)return;const held=lock(),aspect=el('aspect').value,c=outputCanvas(aspect);try{drawScene(c.getContext('2d'),c.width,c.height,held.snapshot,true);const b=await new Promise(r=>c.toBlob(r));if(!b)throw Error('PNG encoder returned no data');download(b,`loop-${held.snapshot.mode}-${aspect}.png`);lastExport={kind:'png',aspect,state:{...held.snapshot},bytes:b.size};el('export-status').textContent='PNG downloaded with this moment, your controls and source caption.';}catch(e){console.error(e);el('export-status').textContent='PNG could not finish. Please try again.';}finally{held.restore();}}
async function exportGIF(){if(exporting)return;const held=lock(),aspect=el('aspect').value,c=outputCanvas(aspect),ctx=c.getContext('2d',{willReadFrequently:true}),gif=GIFEncoder(),status=el('export-status'),total=60;el('cancel').hidden=false;
 try{for(let i=0;i<total;i++){if(cancelled){status.textContent='Export cancelled. Your controls and playback were restored.';return;}drawScene(ctx,c.width,c.height,exportFrame(held.snapshot,i,total),true);const rgba=ctx.getImageData(0,0,c.width,c.height).data,palette=quantize(rgba,128);gif.writeFrame(applyPalette(rgba,palette),c.width,c.height,{palette,delay:frameDelay(held.snapshot.period,i,total),repeat:0});exportProgress=(i+1)/total;status.textContent=`Rendering one cycle… ${Math.round(exportProgress*100)}%`;await new Promise(r=>setTimeout(r,0));}if(cancelled){status.textContent='Export cancelled. Your controls and playback were restored.';return;}gif.finish();const b=new Blob([gif.bytes()],{type:'image/gif'});download(b,`loop-${held.snapshot.mode}-${aspect}.gif`);lastExport={kind:'gif',aspect,state:{...held.snapshot},frames:total,seconds:held.snapshot.period,bytes:b.size};status.textContent=`GIF downloaded · ${held.snapshot.period} seconds · 60 frames · ${(b.size/1048576).toFixed(1)} MB. Your scene and camera settings are preserved.`;
 }catch(e){console.error(e);status.textContent='GIF could not finish. Try a PNG instead.';}finally{held.restore();}}
el('png').onclick=exportPNG;el('gif').onclick=exportGIF;el('cancel').onclick=()=>{cancelled=true;};
// Documented read/render interface for deterministic media and state/export checks.
window.loopLab={drawScene,exportFrame,getState:()=>({...settings}),setState:cfg=>{if(exporting)throw Error('An export is in progress');pause();settings={...settings,...cfg};draw();},getExportState:()=>({exporting,cancelled,progress:exportProgress,playing,lastExport})};
if(new URLSearchParams(location.search).get('embed')==='1'){document.body.classList.add('embedded');new ResizeObserver(()=>parent.postMessage({type:'loop-height',height:Math.ceil(document.body.getBoundingClientRect().height)},location.origin)).observe(document.body);}
new ResizeObserver(()=>{const small=canvas.clientWidth<600,w=small?720:1440,h=small?1040:840;if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;draw();}}).observe(canvas);
draw();

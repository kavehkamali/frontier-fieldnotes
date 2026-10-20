import {camera,project} from './gaussian-math.mjs';
import {DEFAULTS,TOTAL_FRAMES,snapshot,metrics,exportFrame} from './stream-math.mjs';
import {GIFEncoder,quantize,applyPalette} from './vendor/gifenc.esm.js';

const C={ink:'#26344b',muted:'#8490a2',line:'#e7ebf2',violet:'#8065c6',cyan:'#4ca4b3',coral:'#d5866e'};
const TAU=Math.PI*2,SECONDS=8,GIF_FRAMES=60;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const text=(ctx,t,x,y,size=14,color=C.muted,weight=400)=>{ctx.font=`${weight} ${size}px Arial,sans-serif`;ctx.fillStyle=color;ctx.fillText(t,x,y);};
const line=(ctx,x,y,x2,y2,color=C.line,width=1)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();};
function roundRect(ctx,x,y,w,h,r,fill,stroke=null){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}}
function fitText(ctx,t,x,y,maxWidth,size=12,color=C.muted,weight=400){let f=size;ctx.font=`${weight} ${f}px Arial,sans-serif`;while(f>8&&ctx.measureText(t).width>maxWidth){f-=.5;ctx.font=`${weight} ${f}px Arial,sans-serif`;}ctx.fillStyle=color;ctx.fillText(t,x,y);}
function normalize(cfg){const c={...DEFAULTS,...cfg};for(const k of ['frame','gop','budget','orbit'])if(!Number.isFinite(+c[k]))c[k]=DEFAULTS[k];c.frame=clamp(Math.floor(+c.frame),0,TOTAL_FRAMES-1);c.gop=[8,16,24,32].includes(+c.gop)?+c.gop:DEFAULTS.gop;c.budget=clamp(+c.budget,0,100);c.orbit=clamp(+c.orbit,-65,65);c.ranking=c.ranking==='position'?'position':'all';c.labels=Boolean(c.labels);c.colorChange=Boolean(c.colorChange);return c;}

function renderView(ctx,box,points,cfg,label,subheading,mobile=false){
 const {x,y,w,h}=box,fs=mobile?16:12;
 roundRect(ctx,x,y,w,h,14,'#fdfdff',C.line);
 text(ctx,label,x+19,y+27,fs,C.ink,500);
 fitText(ctx,subheading,x+19,y+48,w-38,mobile?12:10,C.muted);
 const view={x:x+4,y:y+59,w:w-8,h:h-72};
 const cam=camera(cfg.orbit,13,5.4),f=Math.min(view.w*.96,view.h*1.42),cx=view.x+view.w*.5,cy=view.y+view.h*.48;
 ctx.save();ctx.beginPath();ctx.rect(view.x,view.y,view.w,view.h);ctx.clip();
 const projected=points.map(p=>({p,q:project(p.mean,p.S,cam,f,cx,cy)})).filter(s=>s.q).sort((a,b)=>b.q.z-a.q.z);
 for(const {p,q}of projected){
  ctx.save();ctx.translate(q.x,q.y);ctx.rotate(q.angle);ctx.scale(q.r1,q.r2);
  const rgb=p.color.map(n=>Math.round(n)).join(','),gradient=ctx.createRadialGradient(0,0,0,0,0,3);
  for(let i=0;i<=16;i++){const r=3*i/16;gradient.addColorStop(i/16,`rgba(${rgb},${.72*Math.exp(-r*r/2)})`);}
  ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(0,0,3,0,TAU);ctx.fill();ctx.restore();
 }
 if(cfg.labels){
  const ty=view.y+view.h-12;
  text(ctx,'FIXED PANEL',view.x+13,ty,mobile?12:9,C.violet,500);
  ctx.textAlign='right';text(ctx,'MOVING RIBBON',view.x+view.w-13,ty,mobile?12:9,C.coral,500);ctx.textAlign='left';
 }
 ctx.restore();
}

function renderLanes(ctx,box,cfg,ss,m,mobile=false){
 const {x,y,w,h}=box,k=Math.min(cfg.gop,TOTAL_FRAMES-ss.part.start),offset=cfg.frame-ss.part.start,fs=mobile?14:11;
 const labelW=mobile?148:194,chartX=x+labelW,chartW=w-labelW-4,gap=3,cellW=Math.max(2,(chartW-(k-1)*gap)/k),rowH=mobile?19:17;
 text(ctx,'TRANSMISSION / ONE GROUP',x,y+fs,fs,C.ink,500);
 ctx.textAlign='right';text(ctx,`frames ${ss.part.start}–${ss.part.start+k-1}`,x+w,y+fs,fs,C.muted);ctx.textAlign='left';
 const rows=[{label:'ONCE / GROUP',n:m.stable,color:C.cyan,at:y+39,once:true},{label:'EACH FRAME',n:m.count,color:C.coral,at:y+77,once:false}];
 for(const row of rows){
  text(ctx,row.label,x,row.at+9,mobile?11:10,row.color,500);text(ctx,`${row.n} records`,x,row.at+26,mobile?12:11,C.muted);
  for(let i=0;i<k;i++){
   const xx=chartX+i*(cellW+gap);roundRect(ctx,xx,row.at,cellW,rowH,2,'#eff1f6');
   const active=!row.once||i===0,ratio=row.n/m.total;
   if(active&&row.n>0)roundRect(ctx,xx,row.at+rowH*(1-ratio),cellW,Math.max(1,rowH*ratio),2,row.color);
  }
  if(row.once){
   ctx.setLineDash([3,4]);line(ctx,chartX+cellW+gap,row.at+rowH*.5,chartX+chartW,row.at+rowH*.5,'#4ca4b345');ctx.setLineDash([]);
  }
 }
 const cursor=chartX+offset*(cellW+gap)+cellW*.5;
 line(ctx,cursor,y+30,cursor,y+101,'#8065c680',1.4);
 text(ctx,'cached values reused →',chartX,y+rows[0].at-y+rowH+14,mobile?10:9,C.cyan);
 if(h>118)text(ctx,`Group refresh at frame ${ss.part.start} · every Gaussian starts current`,x,y+h-2,mobile?11:10,C.muted);
}

/** Shared deterministic renderer: live canvas, editorial media, PNG and GIF. */
export function drawScene(ctx,width,height,input={...DEFAULTS},caption=true){
 const cfg=normalize(input),ss=snapshot(cfg),m=metrics(cfg,ss),mobile=!caption&&height/width>1,scale=width/(mobile?600:1200),W=width/scale,H=height/scale;
 const pad=mobile?23:32,gap=mobile?15:22,top=caption?117:31,bottom=caption?135:34;
 const lanesH=mobile?137:122,available=H-top-bottom-lanesH-22;
 ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,width,height);ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);ctx.scale(scale,scale);
 if(caption){text(ctx,'FRONTIER FIELDNOTES / KAVEH',pad,27,11,C.muted,500);text(ctx,'Keep the scene. Send the changes.',pad,65,31,C.ink,500);text(ctx,'A stationary surface can still change. The update budget has to notice.',pad,93,13,C.muted);line(ctx,pad,107,W-pad,107);}
 if(mobile){const h=(available-gap)/2;renderView(ctx,{x:pad,y:top,w:W-2*pad,h},ss.reference,cfg,'01 / REFERENCE',`All ${m.total} Gaussian records at frame ${cfg.frame}`,true);renderView(ctx,{x:pad,y:top+h+gap,w:W-2*pad,h},ss.reused,cfg,'02 / CACHE + UPDATES',`${m.stable} cached · ${m.count} refreshed each frame`,true);}
 else{const w=(W-2*pad-gap)/2;renderView(ctx,{x:pad,y:top,w,h:available},ss.reference,cfg,'01 / REFERENCE',`All ${m.total} Gaussian records at frame ${cfg.frame}`);renderView(ctx,{x:pad+w+gap,y:top,w,h:available},ss.reused,cfg,'02 / CACHE + UPDATES',`${m.stable} cached · ${m.count} refreshed each frame`);}
 const lanesY=top+available+20;renderLanes(ctx,{x:pad,y:lanesY,w:W-pad*2,h:lanesH},cfg,ss,m,mobile);
 if(caption){
  const y=H-119;line(ctx,pad,y-9,W-pad,y-9);
  text(ctx,`PIXEL RMSE  ${m.rmse.toFixed(4)}`,pad,y+14,14,m.rmse>.005?C.coral:C.violet,500);
  text(ctx,`${(m.reduction*100).toFixed(1)}% FEWER RECORDS / GROUP`,W*.36,y+14,14,C.cyan,500);
  ctx.textAlign='right';text(ctx,`${m.count}/${m.total} UPDATED`,W-pad,y+14,14,C.ink,500);ctx.textAlign='left';
  text(ctx,`Frame ${cfg.frame}/95 · group ${cfg.gop} · budget ${cfg.budget}% · rank ${cfg.ranking==='all'?'position + color':'position only'} · color ${cfg.colorChange?'changes':'fixed'} · camera ${cfg.orbit.toFixed(0)}°`,pad,y+40,11,C.muted);
  text(ctx,'Analytic teaching model · oracle ranking · equal-size records, not bytes · RMSE at 120 × 80.',pad,H-44,11,C.muted);
  text(ctx,'Not ResStreamGS inference, a learned probe or a codec benchmark.',pad,H-27,11,C.muted);
  text(ctx,'ResStreamGS · 15 Oct 2026 · arxiv.org/abs/2610.21121v1',pad,H-10,10,C.violet);
 }else{
  fitText(ctx,`Frame ${cfg.frame}/95 · ${cfg.ranking==='all'?'position + color':'position-only'} oracle ranking · ${cfg.colorChange?'changing':'fixed'} panel color`,pad,H-12,W-pad*2,mobile?12:11,C.muted);
 }
 ctx.restore();return {...m,frame:cfg.frame,groupStart:ss.part.start,groupLength:Math.min(cfg.gop,TOTAL_FRAMES-ss.part.start)};
}

const el=id=>document.getElementById(id),canvas=el('scene');
let settings={...DEFAULTS},playing=false,lastTime=0,frameRemainder=0,exporting=false,cancelled=false,exportProgress=0,lastExport=null,lastMetrics=null;
function sync(){
 for(const k of ['frame','budget','orbit','gop','ranking'])el(k).value=settings[k];
 el('frame-value').value=`${settings.frame} / ${TOTAL_FRAMES-1}`;el('budget-value').value=`${settings.budget}%`;el('orbit-value').value=`${Math.round(settings.orbit)}°`;
 for(const k of ['labels','colorChange'])el(k).checked=settings[k];
 el('play').textContent=playing?'Ⅱ Pause cycle':'▶ Play 8-second cycle';el('play').setAttribute('aria-pressed',String(playing));
}
function draw(){
 const m=lastMetrics=drawScene(canvas.getContext('2d'),canvas.width,canvas.height,settings,false);
 el('error-readout').textContent=m.rmse.toFixed(4);el('error-readout').classList.toggle('warning',m.rmse>.005);
 el('reduction-readout').textContent=`${(m.reduction*100).toFixed(1)}%`;el('count-readout').textContent=`${m.count} / ${m.total}`;el('cache-readout').textContent=`${m.stable} records stay cached`;
 el('scene-note').textContent=settings.frame===m.groupStart?'Group refresh: the complete scene is current. Scrub forward to reveal the cost of stale values.':settings.budget===100?'Everything updates. The views match, and this toy saves no records.':settings.budget===0?'Nothing updates inside this group. The cached scene waits for the next refresh.':settings.colorChange&&settings.ranking==='position'?'Position-only ranking can miss appearance changes on the stationary panel.':!settings.colorChange?'The panel’s color is fixed. Spend updates on the moving ribbon.':'Position and appearance both matter. A lower update budget can leave either one behind.';
 sync();
}
function pause(){playing=false;lastTime=0;frameRemainder=0;sync();}
for(const k of ['frame','budget','orbit'])el(k).addEventListener('input',e=>{const value=+e.target.value;pause();settings=normalize({...settings,[k]:value});draw();});
for(const k of ['gop','ranking'])el(k).addEventListener('change',e=>{const value=e.target.value;pause();settings=normalize({...settings,[k]:value});draw();});
for(const k of ['labels','colorChange'])el(k).addEventListener('change',e=>{settings=normalize({...settings,[k]:e.target.checked});draw();});
el('play').onclick=()=>{playing=!playing;lastTime=0;frameRemainder=0;sync();};
el('reset').onclick=()=>{pause();settings={...DEFAULTS};draw();};
function tick(now){
 if(playing&&!exporting){if(lastTime){frameRemainder+=(now-lastTime)*TOTAL_FRAMES/(SECONDS*1000);const n=Math.floor(frameRemainder);if(n){settings.frame=(settings.frame+n)%TOTAL_FRAMES;frameRemainder-=n;draw();}}lastTime=now;}
 requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
document.addEventListener('visibilitychange',()=>{lastTime=0;});
let drag=null;
canvas.onpointerdown=e=>{if(exporting)return;pause();drag={x:e.clientX,orbit:settings.orbit};canvas.setPointerCapture(e.pointerId);};
canvas.onpointermove=e=>{if(!drag||exporting)return;settings.orbit=clamp(drag.orbit+(e.clientX-drag.x)*.24,-65,65);draw();};
canvas.onpointerup=canvas.onpointercancel=()=>{drag=null;};
canvas.onkeydown=e=>{if(exporting||!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();pause();settings.orbit=clamp(settings.orbit+(e.key==='ArrowLeft'?-3:3),-65,65);draw();};

function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
function outputCanvas(aspect){const c=document.createElement('canvas');c.width=aspect==='wide'?960:800;c.height=aspect==='wide'?540:800;return c;}
function lock(){
 const held={...settings},wasPlaying=playing,controls=[...document.querySelectorAll('button,input,select')].filter(x=>x.id!=='cancel'),disabled=controls.map(x=>x.disabled);
 pause();drag=null;exporting=true;cancelled=false;exportProgress=0;controls.forEach(x=>x.disabled=true);
 return {snapshot:held,restore(){settings={...held};exporting=false;controls.forEach((x,i)=>x.disabled=disabled[i]);el('cancel').hidden=true;playing=wasPlaying;lastTime=0;frameRemainder=0;draw();}};
}
async function exportPNG(){
 if(exporting)return;const held=lock(),aspect=el('aspect').value,c=outputCanvas(aspect),status=el('export-status');
 try{status.textContent='Rendering this frame…';const m=drawScene(c.getContext('2d'),c.width,c.height,held.snapshot,true);const blob=await new Promise(resolve=>c.toBlob(resolve,'image/png'));if(!blob)throw Error('PNG encoding returned no data');download(blob,`stream-frame-${held.snapshot.frame}-${aspect}.png`);exportProgress=1;lastExport={kind:'png',aspect,state:{...held.snapshot},width:c.width,height:c.height,bytes:blob.size,metrics:m};status.textContent='PNG downloaded with this frame, your settings and a source caption.';}
 catch(error){console.error(error);status.textContent='PNG could not finish. Please try again.';}finally{held.restore();}
}
async function exportGIF(){
 if(exporting)return;const held=lock(),aspect=el('aspect').value,c=outputCanvas(aspect),ctx=c.getContext('2d',{willReadFrequently:true}),gif=GIFEncoder(),status=el('export-status');el('cancel').hidden=false;
 try{
  for(let i=0;i<GIF_FRAMES;i++){
   if(cancelled){status.textContent='Export cancelled. Your settings and playback were restored.';return;}
   drawScene(ctx,c.width,c.height,exportFrame(held.snapshot,i,GIF_FRAMES),true);
   const rgba=ctx.getImageData(0,0,c.width,c.height).data,palette=quantize(rgba,128),delay=(Math.round((i+1)*SECONDS*100/GIF_FRAMES)-Math.round(i*SECONDS*100/GIF_FRAMES))*10;
   gif.writeFrame(applyPalette(rgba,palette),c.width,c.height,{palette,delay,repeat:0});
   exportProgress=(i+1)/GIF_FRAMES;status.textContent=`Rendering the full scene cycle… ${Math.round(exportProgress*100)}%`;
   await new Promise(resolve=>setTimeout(resolve,0));
  }
  if(cancelled){status.textContent='Export cancelled. Your settings and playback were restored.';return;}
  gif.finish();const blob=new Blob([gif.bytes()],{type:'image/gif'});download(blob,`stream-${held.snapshot.ranking}-g${held.snapshot.gop}-${aspect}.gif`);
  lastExport={kind:'gif',aspect,state:{...held.snapshot},width:c.width,height:c.height,frames:GIF_FRAMES,seconds:SECONDS,startFrame:0,bytes:blob.size};
  status.textContent=`GIF downloaded · 8 seconds · 60 frames · ${(blob.size/1048576).toFixed(1)} MB. Your controls and playback were restored.`;
 }catch(error){console.error(error);status.textContent='GIF could not finish. Try a PNG instead.';}finally{held.restore();}
}
el('png').onclick=exportPNG;el('gif').onclick=exportGIF;el('cancel').onclick=()=>{cancelled=true;el('export-status').textContent='Cancelling after this frame…';};

// Stable read/render API for original media and UI/export verification.
window.streamLab={drawScene,exportFrame,getState:()=>({...settings}),setState:cfg=>{if(exporting)throw Error('An export is in progress');pause();settings=normalize({...settings,...cfg});draw();},getMetrics:()=>({...lastMetrics}),getExportState:()=>({exporting,cancelled,progress:exportProgress,playing,lastExport:lastExport?{...lastExport,state:{...lastExport.state}}:null})};
if(new URLSearchParams(location.search).get('embed')==='1'){
 document.body.classList.add('embedded');new ResizeObserver(()=>parent.postMessage({type:'stream-height',height:Math.ceil(document.body.getBoundingClientRect().height)},location.origin)).observe(document.body);
}
new ResizeObserver(()=>{const small=canvas.clientWidth<600,w=small?720:1440,h=small?1320:840;if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;draw();}}).observe(canvas);
draw();

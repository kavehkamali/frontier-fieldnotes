import {DEFAULTS,normalize,analyze,stateAt,sourceRank,exportFrame,clamp} from './semantic-math.mjs';
import {GIFEncoder,quantize,applyPalette} from './vendor/gifenc.esm.js';
const C={ink:'#25344b',muted:'#7f8ba0',line:'#e7ebf2',violet:'#8065c6',cyan:'#329aa8',coral:'#df8a6c'};
const TAU=Math.PI*2;
let fontScale=1;
function text(c,s,x,y,size=12,color=C.muted,weight=400){c.font=`${weight} ${size*fontScale}px Arial,sans-serif`;c.fillStyle=color;c.fillText(s,x,y);}
function line(c,x,y,a,b,color=C.line,width=1){c.beginPath();c.moveTo(x,y);c.lineTo(a,b);c.strokeStyle=color;c.lineWidth=width;c.stroke();}
function dot(c,x,y,r,color){c.beginPath();c.arc(x,y,r,0,TAU);c.fillStyle=color;c.fill();}
function box(c,x,y,w,h){c.beginPath();c.roundRect(x,y,w,h,15);c.fillStyle='#fcfdff';c.fill();c.strokeStyle=C.line;c.stroke();}
function arrow(c,x,y,a,b,color,width=2){line(c,x,y,a,b,color,width);const th=Math.atan2(b-y,a-x);c.beginPath();c.moveTo(a,b);c.lineTo(a-9*Math.cos(th-.4),b-9*Math.sin(th-.4));c.lineTo(a-9*Math.cos(th+.4),b-9*Math.sin(th+.4));c.closePath();c.fillStyle=color;c.fill();}
function geometry(c,b,a){
 const {x,y,w,h}=b,{cfg,state,tokens,directional,euclidean}=a;box(c,x,y,w,h);
 text(c,'01 / GEOMETRY',x+20,y+27,12,C.ink,600);
 text(c,`${cfg.dimension}D → source/noise plane · ${cfg.vocabulary} tokens`,x+20,y+48,10);
 const r=Math.min(w*.34,(h-135)*.48),cx=x+w*.49,cy=y+75+(h-135)*.54;
 const pos=(u,v)=>[cx+u*r,cy-v*r];
 c.save();c.beginPath();c.rect(x+8,y+60,w-16,h-117);c.clip();
 for(const rr of [.25,.5,.75,1]){c.beginPath();c.arc(cx,cy,r*rr,0,TAU);c.strokeStyle=C.line;c.stroke();}
 line(c,cx-r*1.2,cy,cx+r*1.22,cy,C.line);line(c,cx,cy-r*1.15,cx,cy+r*.72,C.line);
 c.beginPath();for(let i=0;i<=100;i++){const s=stateAt(i/100,cfg.path,cfg.lesson),p=pos(s.x,s.y);i?c.lineTo(...p):c.moveTo(...p);}c.strokeStyle=C.violet+'55';c.lineWidth=4;c.stroke();
 for(const t of tokens.slice(1)){
  const n=cfg.lesson==='shrink'?t.norm:1,[px,py]=pos(t.a*n,t.b*n),o=a.scores[t.id].cosine>a.scores[0].cosine+1e-12;
  dot(c,px,py,cfg.vocabulary>128?2.3:3.3,o?C.coral+'b8':C.violet+'55');
 }
 const grid=a.semantic;
 if(cfg.lesson==='competition')for(const g of grid){const p=stateAt(g,cfg.path);dot(c,...pos(p.x,p.y),3,C.cyan);}
 const [sx,sy]=pos(state.x,state.y);arrow(c,cx,cy,sx,sy,C.violet,2.5);dot(c,sx,sy,10,'#fff');dot(c,sx,sy,6.5,C.violet);
 const winner=directional[0],wn=cfg.lesson==='shrink'?winner.norm:1,[wx,wy]=pos(winner.a*wn,winner.b*wn);
 c.beginPath();c.arc(wx,wy,10,0,TAU);c.strokeStyle=C.cyan;c.lineWidth=2;c.stroke();
 const ew=euclidean[0],en=cfg.lesson==='shrink'?ew.norm:1,[ex,ey]=pos(ew.a*en,ew.b*en);
 c.strokeStyle=C.coral;c.lineWidth=1.7;c.strokeRect(ex-7,ey-7,14,14);
 dot(c,...pos(1,0),6,C.violet);text(c,'source',cx+r-20,cy+24,11,C.violet,600);
 if(cfg.lesson==='competition'){dot(c,...pos(0,1),4,C.cyan);text(c,'noise',cx-45,cy-r-11,11,C.cyan);}
 c.restore();
 text(c,`○ Cosine: ${winner.name}`,x+20,y+h-38,12,C.cyan,600);
 text(c,`□ Euclidean: ${ew.name}`,x+20,y+h-17,12,C.coral,600);
}
function clock(c,b,a){
 const {x,y,w,h}=b,{cfg}=a;box(c,x,y,w,h);
 text(c,cfg.lesson==='shrink'?'02 / DIRECTION IS UNCHANGED':'02 / WHERE IDENTITY CHANGES',x+20,y+27,12,C.ink,600);
 text(c,cfg.lesson==='shrink'?'Zero noise · full-space scores':w<400?'Source rank · log scale · normalized':'Source rank, scaled logarithmically from its start to endpoint',x+20,y+48,10);
 const l=x+43,t=y+78,W=w-66,H=h-205,px=g=>l+W*g,py=v=>t+H*(1-v);
 for(const q of [0,.5,1]){line(c,l,py(q),l+W,py(q));text(c,q.toFixed(1),l-28,py(q)+4,10);}
 text(c,cfg.lesson==='shrink'?'state norm':'log-rank loss',l,t-12,10,C.muted);
 if(cfg.lesson==='shrink'){
  line(c,px(0),py(1),px(1),py(.05),C.violet,2.5);
  line(c,px(0),py(1),px(1),py(1),C.cyan,2);
  text(c,'Cosine source rank stays 1',l+10,t+32,12,C.cyan,500);
  text(c,'No noise. No rotation.',l+10,t+53,12,C.muted);
 }else{
  const denom=Math.log(sourceRank(a.tokens,1,cfg.path));
  c.beginPath();for(let i=0;i<=400;i++){const g=i/400,loss=denom?Math.log(sourceRank(a.tokens,g,cfg.path))/denom:g;i?c.lineTo(px(g),py(loss)):c.moveTo(px(g),py(loss));}c.strokeStyle=C.coral;c.lineWidth=2;c.stroke();
  c.beginPath();for(let i=0;i<=200;i++){const g=i/200,v=a.schedule.decay(g);i?c.lineTo(px(g),py(v)):c.moveTo(px(g),py(v));}c.strokeStyle=C.cyan;c.lineWidth=2;c.stroke();
  text(c,'— Exact ranks',l+5,t+23,11,C.coral);text(c,'— Smoothed toy curve',l+5,t+42,11,C.cyan);
 }
 const g=cfg.progress/100;line(c,px(g),t-5,px(g),t+H+10,C.violet+'80',1.5);
 for(const k of [0,.5,1])text(c,String(k),px(k)-4,t+H+23,10);
 text(c,cfg.lesson==='shrink'?'shrink progress →':'geometric progress γ →',l+W-134,t+H+43,10);
 if(cfg.lesson==='competition'){
  const yy=t+H+66;
  text(c,'Equal geometry',l,yy,10,C.muted);text(c,'Adaptive clock',l,yy+35,10,C.cyan);
  const start=l+101,width=W-101;
  for(const [grid,dy,col]of[[a.uniform,0,C.violet],[a.semantic,35,C.cyan]]){
   line(c,start,yy+dy-4,start+width,yy+dy-4,C.line,2);
   for(const q of grid)dot(c,start+width*q,yy+dy-4,3.3,col);
  }
 }else{
  text(c,w<400?'Shorter candidates can win by distance.':'Smaller candidate norms can change the distance winner.',l,t+H+72,10,C.coral);
  text(c,w<400?'Cosine still selects the source.':'Direction-based ranking remains invariant to this shrink.',l,t+H+93,10,C.cyan);
 }
}

export function drawScene(ctx,width,height,input=DEFAULTS,caption=true){
 const a=analyze(input),{cfg}=a,portrait=height/width>1.1,unit=portrait?400:1200,scale=width/unit,W=unit,H=height/scale;
 fontScale=portrait?1.2:1;
 const pad=portrait?22:30,top=caption?110:20,bottom=caption?115:26,gap=20,available=H-top-bottom;
 ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,width,height);ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);ctx.scale(scale,scale);
 if(caption){text(ctx,'FRONTIER FIELDNOTES / KAVEH',pad,28,11,C.muted,600);text(ctx,'Equal steps. Unequal changes.',pad,65,32,C.ink,500);text(ctx,cfg.lesson==='shrink'?'Shrink a vector without adding noise. Which token wins?':'A smooth path can hide a very uneven change in token identity.',pad,91,13);}
 if(portrait){const h=(available-gap)/2;geometry(ctx,{x:pad,y:top,w:W-2*pad,h},a);clock(ctx,{x:pad,y:top+h+gap,w:W-2*pad,h},a);}
 else{const w=(W-2*pad-gap)/2;geometry(ctx,{x:pad,y:top,w,h:available},a);clock(ctx,{x:pad+w+gap,y:top,w,h:available},a);}
 if(caption){
  const y=H-94;line(ctx,pad,y-11,W-pad,y-11);
  text(ctx,`SOURCE RANK  ${a.rank}/${cfg.vocabulary}`,pad,y+10,14,C.violet,600);
  text(ctx,`NORM  ${a.norm.toFixed(3)}`,W*.39,y+10,14,C.cyan,600);
  ctx.textAlign='right';text(ctx,`${cfg.steps} STEP INTERVALS`,W-pad,y+10,14,C.ink,600);ctx.textAlign='left';
  text(ctx,`${cfg.lesson} · ${cfg.path} · ${cfg.dimension}D · seed ${cfg.seed} · progress ${cfg.progress.toFixed(1)}%`,pad,y+34,11);
  text(ctx,'Synthetic geometry / full-space ranks / no trained model or generated text.',pad,H-34,11);
  text(ctx,'LLaCO · 23 Oct 2026 · arxiv.org/abs/2610.32604v1 · toy clock, not fitted model schedule.',pad,H-15,10,C.violet);
 }else{text(ctx,portrait?'Synthetic tokens · full-space rankings':'Colored points are synthetic token directions. Their 2D distances do not determine the ranking.',pad,H-8,portrait?10:11);}
 ctx.restore();return{rank:a.rank,norm:a.norm,cosine:a.directional[0].name,euclidean:a.euclidean[0].name,firstCrossing:a.firstCrossing,semantic:a.semantic,uniform:a.uniform};
}

const el=id=>document.getElementById(id),canvas=el('scene');
let settings={...DEFAULTS},playing=false,lastTime=0,phase=0,exporting=false,cancelled=false,exportProgress=0,lastExport=null,lastMetrics=null;
function sync(){
 for(const k of ['progress','path','dimension','vocabulary','steps','seed'])el(k).value=settings[k];
 el('progress-value').value=settings.progress.toFixed(1)+'%';el('steps-value').value=settings.steps+' intervals';
 for(const k of ['competition','shrink']){el(k).classList.toggle('active',settings.lesson===k);el(k).setAttribute('aria-pressed',String(settings.lesson===k));}
 el('path').disabled=exporting||settings.lesson==='shrink';el('steps').disabled=exporting||settings.lesson==='shrink';
 el('play').textContent=playing?'Ⅱ Pause geometry':'▶ Play geometry';el('play').setAttribute('aria-pressed',String(playing));
 el('progress-label').textContent=settings.lesson==='shrink'?'Shrink progress':'Noising progress';
 el('method-label').textContent=settings.lesson==='shrink'?'NO RANDOM NOISE IS ADDED':'HOW THIS CLOCK WORKS';
 el('method-text').textContent=settings.lesson==='shrink'?'The state shrinks from norm 1 to 0.05 while its direction stays fixed. Euclidean candidate norms vary; cosine ignores their lengths.':'90% smoothed toy log-rank loss + 10% linear time. The floor keeps every region reachable. This is not LLaCO’s fitted vocabulary schedule.';
}
function draw(){
 const m=lastMetrics=drawScene(canvas.getContext('2d'),canvas.width,canvas.height,settings,false);
 el('rank-value').textContent=`${m.rank} / ${settings.vocabulary}`;el('norm-value').textContent=m.norm.toFixed(3);el('agree-value').textContent=m.cosine===m.euclidean?'Yes':'No';
 el('norm-note').textContent=settings.lesson==='shrink'?'Direction stays defined at norm ≥ 0.05':settings.path==='sphere'?'Geodesic keeps unit length':'Straight line shrinks, then grows';
 el('scene-note').textContent=settings.lesson==='shrink'?`Cosine picks ${m.cosine}; Euclidean picks ${m.euclidean}. No noise or rotation was needed to make these rules disagree.`:`First directional crossing at ${(m.firstCrossing*100).toFixed(1)}% of this path. The adaptive dots redistribute the same ${settings.steps} intervals; they do not measure text quality.`;
 sync();
}
function pause(){playing=false;lastTime=0;sync();}
for(const k of ['progress','steps','seed'])el(k).addEventListener('input',e=>{const v=e.target.value;pause();settings=normalize({...settings,[k]:v});draw();});
for(const k of ['path','dimension','vocabulary'])el(k).addEventListener('change',e=>{const v=e.target.value;pause();settings=normalize({...settings,[k]:v});draw();});
for(const lesson of ['competition','shrink'])el(lesson).onclick=()=>{pause();settings={...settings,lesson,progress:lesson==='shrink'?70:91};draw();};
el('reseed').onclick=()=>{pause();settings.seed=settings.seed%9999+1;draw();};el('reset').onclick=()=>{pause();settings={...DEFAULTS};draw();};
el('play').onclick=()=>{playing=!playing;phase=Math.acos(1-2*settings.progress/100);lastTime=0;sync();};
function tick(now){if(playing&&!exporting){if(lastTime){phase+=(now-lastTime)/8000*TAU;settings.progress=50*(1-Math.cos(phase));draw();}lastTime=now;}requestAnimationFrame(tick);}requestAnimationFrame(tick);document.addEventListener('visibilitychange',()=>{lastTime=0;});
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
function outputCanvas(aspect){const c=document.createElement('canvas');c.width=aspect==='wide'?1200:1000;c.height=aspect==='wide'?675:1000;return c;}
function lock(){const held={...settings},wasPlaying=playing,controls=[...document.querySelectorAll('button,input,select')].filter(x=>x.id!=='cancel'),disabled=controls.map(x=>x.disabled);pause();exporting=true;cancelled=false;exportProgress=0;controls.forEach(x=>x.disabled=true);return{snapshot:held,restore(){settings={...held};exporting=false;controls.forEach((x,i)=>x.disabled=disabled[i]);el('cancel').hidden=true;playing=wasPlaying;phase=Math.acos(1-2*settings.progress/100);lastTime=0;draw();}};}
async function exportPNG(){if(exporting)return;const held=lock(),aspect=el('aspect').value,c=outputCanvas(aspect),status=el('export-status');try{status.textContent='Rendering this state…';const metrics=drawScene(c.getContext('2d'),c.width,c.height,held.snapshot,true),blob=await new Promise(r=>c.toBlob(r,'image/png'));if(!blob)throw Error('Empty PNG');download(blob,`semantic-${held.snapshot.lesson}-${aspect}.png`);lastExport={kind:'png',aspect,state:held.snapshot,width:c.width,height:c.height,bytes:blob.size,metrics};exportProgress=1;status.textContent='PNG downloaded with your current settings and source caption.';}catch(e){console.error(e);status.textContent='PNG could not finish. Please try again.';}finally{held.restore();}}
async function exportGIF(){if(exporting)return;const held=lock(),aspect=el('aspect').value,c=outputCanvas(aspect),ctx=c.getContext('2d',{willReadFrequently:true}),gif=GIFEncoder(),status=el('export-status'),frames=60;el('cancel').hidden=false;try{
 for(let i=0;i<frames;i++){if(cancelled){status.textContent='Export cancelled. Settings and playback restored.';return;}drawScene(ctx,c.width,c.height,exportFrame(held.snapshot,i,frames),true);const rgba=ctx.getImageData(0,0,c.width,c.height).data,palette=quantize(rgba,128),delay=(Math.round((i+1)*800/frames)-Math.round(i*800/frames))*10;gif.writeFrame(applyPalette(rgba,palette),c.width,c.height,{palette,delay,repeat:0});exportProgress=(i+1)/frames;status.textContent=`Rendering geometric sweep… ${Math.round(exportProgress*100)}%`;await new Promise(r=>setTimeout(r,0));}
 if(cancelled){status.textContent='Export cancelled. Settings and playback restored.';return;}gif.finish();const blob=new Blob([gif.bytes()],{type:'image/gif'});download(blob,`semantic-${held.snapshot.lesson}-${aspect}.gif`);lastExport={kind:'gif',aspect,state:held.snapshot,width:c.width,height:c.height,bytes:blob.size,frames,seconds:8};status.textContent='GIF downloaded · 8 seconds · your settings restored. Use the kit MP4 for video-first platforms.';
 }catch(e){console.error(e);status.textContent='GIF could not finish. Try PNG instead.';}finally{held.restore();}}
el('png').onclick=exportPNG;el('gif').onclick=exportGIF;el('cancel').onclick=()=>{cancelled=true;el('export-status').textContent='Cancelling after this frame…';};
window.semanticLab={drawScene,exportFrame,getState:()=>({...settings}),setState:cfg=>{if(exporting)throw Error('Export active');pause();settings=normalize({...settings,...cfg});draw();},getMetrics:()=>({...lastMetrics}),getExportState:()=>({exporting,cancelled,progress:exportProgress,playing,lastExport})};
if(new URLSearchParams(location.search).get('embed')==='1'){document.body.classList.add('embedded');new ResizeObserver(()=>parent.postMessage({type:'semantic-height',height:Math.ceil(document.body.getBoundingClientRect().height)},location.origin)).observe(document.body);}
new ResizeObserver(()=>{const small=canvas.clientWidth<600,w=small?720:1440,h=small?1260:760;if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;draw();}}).observe(canvas);draw();

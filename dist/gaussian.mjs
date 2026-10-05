import {camera,project,scene,DEFAULTS} from './gaussian-math.mjs';
import {GIFEncoder,quantize,applyPalette} from './vendor/gifenc.esm.js';
const ink='#25344b',muted='#7d899c',violet='#8970c8',coral='#e88c6d';
const text=(ctx,t,x,y,size=14,color=muted,weight=400)=>{ctx.font=`${weight} ${size}px Arial,sans-serif`;ctx.fillStyle=color;ctx.fillText(t,x,y);};
const line=(ctx,x,y,x2,y2,c='#e7ebf3',width=1)=>{ctx.strokeStyle=c;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();};
function dot(ctx,x,y,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();}
function panel(ctx,box,settings,mode){
 const {x,y,w,h}=box,cam=camera(settings.orbit,settings.elevation),f=Math.min(w*1.13,h*1.38),cx=x+w/2,cy=y+h*.55;
 ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
 const flat=[[.003,0,0],[0,.003,0],[0,0,.003]];
 // Perspective ground grid; dots are plane samples, not scene Gaussians.
 for(let gx=-2;gx<=2.001;gx+=.25)for(let gz=-1.25;gz<=1.251;gz+=.25){const p=project([gx,-1.28,gz],flat,cam,f,cx,cy);if(p)dot(ctx,p.x,p.y,.8,'#dce3ed');}
 const splats=scene({...settings,mode}).map(s=>({...s,p:project(s.mean,s.S,cam,f,cx,cy)})).filter(s=>s.p).sort((a,b)=>b.p.z-a.p.z);
 for(const s of splats){const p=s.p,rgb=s.color.join(',');ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.scale(p.r1,p.r2);const g=ctx.createRadialGradient(0,0,0,0,0,3);
   for(let i=0;i<=12;i++){const r=i/4;g.addColorStop(r/3,`rgba(${rgb},${settings.opacity*Math.exp(-r*r/2)*(i===12?0:1)})`);}ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,3,0,7);ctx.fill();ctx.restore();
 }
 if(settings.ellipses){for(let i=0;i<splats.length;i++){const s=splats[i];if(!s.fill||i%15)continue;const p=s.p;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.beginPath();ctx.ellipse(0,0,2*p.r1,2*p.r2,0,0,7);ctx.strokeStyle='#9e5a4490';ctx.lineWidth=.8;ctx.stroke();ctx.restore();}}
 if(settings.region){const verts=[];for(const xx of [.26,1.28])for(const yy of [.19,1.22])for(const zz of [-.31,.31])verts.push(project([xx,yy,zz],flat,cam,f,cx,cy));ctx.setLineDash([3,4]);for(let i=0;i<8;i++)for(const k of [1,2,4])if((i&k)===0){const a=verts[i],b=verts[i|k];line(ctx,a.x,a.y,b.x,b.y,'#ce8d7480',.85);}ctx.setLineDash([]);}
 ctx.restore();
 return splats.find(s=>s.fill)?.p;
}
/** Deterministic pure canvas renderer used by UI, downloads and publishing media. */
export function drawScene(ctx,w,h,settings={...DEFAULTS},caption=true){
 ctx.clearRect(0,0,w,h);ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);
 const mobile=!caption&&h>w,s=w/(mobile?540:1200),square=h/w>.85,top=caption?116*s:mobile?25*s:64*s,bottom=caption?130*s:mobile?28*s:62*s,ph=h-top-bottom;
 if(caption){text(ctx,'FRONTIER FIELDNOTES / KAVEH',30*s,29*s,10*s,muted,500);text(ctx,'One repair. Every angle.',30*s,67*s,29*s,ink,500);text(ctx,'3D Gaussian projection + multiview consistency',30*s,94*s,12*s,muted);line(ctx,30*s,108*s,w-30*s,108*s);}
 const compare=settings.mode==='compare',stacked=mobile&&compare,boxes=stacked?[{x:16*s,y:top,w:w-32*s,h:ph/2-12*s},{x:16*s,y:top+ph/2+12*s,w:w-32*s,h:ph/2-12*s}]:compare?[{x:16*s,y:top,w:w/2-24*s,h:ph},{x:w/2+8*s,y:top,w:w/2-24*s,h:ph}]:[{x:20*s,y:top,w:w-40*s,h:ph}];
 const modes=compare?['independent','shared']:[settings.mode];let p;
 if(stacked)line(ctx,30*s,top+ph/2,w-30*s,top+ph/2);else if(compare)line(ctx,w/2,top+30*s,w/2,h-bottom-10*s);
 boxes.forEach((box,i)=>{const mode=modes[i];p=panel(ctx,box,settings,mode)||p;const name={shared:'FIXED 3D REPAIR',independent:'VIEW-DEPENDENT REPAIR',empty:'MISSING REGION'}[mode];
 text(ctx,name,box.x+18*s,box.y+(mobile?0:square?28:12)*s,(mobile?16:11)*s,mode==='shared'?violet:coral,500);
 text(ctx,mode==='shared'?'Same Gaussians. New camera.':mode==='independent'?'Repair changes with the camera.':'No repair splats.',box.x+18*s,box.y+(mobile?22:square?49:32)*s,(mobile?13:10)*s,muted);
 });
 const y=h-bottom+22*s;if(!mobile){text(ctx,`Orbit ${Math.round(settings.orbit)}° · elevation ${Math.round(settings.elevation)}°`,30*s,y,11*s,muted);ctx.textAlign='right';text(ctx,`Opacity ${settings.opacity.toFixed(2)} · anisotropy ${settings.anisotropy.toFixed(1)}× · size ${settings.size.toFixed(1)}×`,w-30*s,y,11*s,muted);ctx.textAlign='left';}
 if(caption){const by=h-85*s;line(ctx,30*s,by-13*s,w-30*s,by-13*s);text(ctx,settings.mode==='compare'?'Coral = repair. Left: deliberately altered by view. Right: shared 3D geometry.':settings.mode==='shared'?'Coral = a fixed, hand-designed repair in shared 3D geometry.':settings.mode==='independent'?'Coral = a hand-designed repair deliberately altered with the view.':'The coral boundary marks missing geometry. No repair is shown.',30*s,by+8*s,12*s,ink);text(ctx,'Hand-designed synthetic illustration · not WINGS inference or a benchmark.',30*s,by+31*s,11*s,muted);text(ctx,'Inspired by WINGS · 29 Sep 2026 · arxiv.org/abs/2609.37816v1',30*s,by+52*s,10*s,violet);text(ctx,'kavehkamali.github.io/frontier-fieldnotes/gaussian.html',30*s,by+70*s,9*s,muted);}
 return p;
}
export function orbitFrame(settings,frame,total=60){return {...settings,orbit:settings.orbit+30*Math.sin(2*Math.PI*frame/total)};}
const el=id=>document.getElementById(id),canvas=el('scene');
let settings={...DEFAULTS},playing=false,last=0,phase=0,orbitBase=settings.orbit,exporting=false,cancelled=false;
function sync(){for(const k of ['orbit','elevation','opacity','anisotropy','size']){el(k).value=['opacity','anisotropy','size'].includes(k)?settings[k]*100:settings[k];el(k+'-value').value=k==='orbit'||k==='elevation'?Math.round(settings[k])+'°':k==='opacity'?settings[k].toFixed(2):settings[k].toFixed(1)+'×';}el('mode').value=settings.mode;for(const k of ['ellipses','region'])el(k).checked=settings[k];}
function draw(){const p=drawScene(canvas.getContext('2d'),canvas.width,canvas.height,settings,false);el('angle-readout').textContent=Math.round(settings.orbit)+'°';el('cov-readout').textContent=p?`${p.r1.toFixed(1)} × ${p.r2.toFixed(1)} px`:'No repair';sync();}
function stop(){playing=false;el('play').textContent='▶ Orbit scene';el('play').setAttribute('aria-pressed','false');}
for(const k of ['orbit','elevation','opacity','anisotropy','size'])el(k).oninput=e=>{stop();settings[k]=+e.target.value/(['opacity','anisotropy','size'].includes(k)?100:1);draw();};
el('mode').onchange=e=>{settings.mode=e.target.value;draw();};for(const k of ['ellipses','region'])el(k).onchange=e=>{settings[k]=e.target.checked;draw();};
el('reset').onclick=()=>{stop();settings={...DEFAULTS};draw();};
el('play').onclick=()=>{if(playing){stop();return;}playing=true;phase=0;orbitBase=settings.orbit;last=0;el('play').textContent='Ⅱ Pause orbit';el('play').setAttribute('aria-pressed','true');};
function tick(now){if(playing&&!exporting){if(last){phase+=(now-last)/1800;settings.orbit=Math.max(-85,Math.min(85,orbitBase+30*Math.sin(phase)));draw();}last=now;}requestAnimationFrame(tick);}requestAnimationFrame(tick);
let drag=null;canvas.onpointerdown=e=>{if(exporting)return;stop();drag={x:e.clientX,orbit:settings.orbit};canvas.setPointerCapture(e.pointerId);};canvas.onpointermove=e=>{if(!drag)return;settings.orbit=Math.max(-65,Math.min(65,drag.orbit+(e.clientX-drag.x)*.22));draw();};canvas.onpointerup=canvas.onpointercancel=()=>{drag=null;};canvas.onkeydown=e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key)||exporting)return;e.preventDefault();stop();settings.orbit=Math.max(-65,Math.min(65,settings.orbit+(e.key==='ArrowLeft'?-3:3)));draw();};
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
function outputCanvas(){const c=document.createElement('canvas');c.width=el('aspect').value==='wide'?960:800;c.height=el('aspect').value==='wide'?540:800;return c;}
el('png').onclick=()=>{const cfg={...settings},c=outputCanvas();drawScene(c.getContext('2d'),c.width,c.height,cfg,true);c.toBlob(b=>{if(b){download(b,`gaussian-${el('aspect').value}.png`);el('export-status').textContent='PNG downloaded with your current settings and source caption.';}});};
el('cancel').onclick=()=>{cancelled=true;};
el('gif').onclick=async()=>{if(exporting)return;exporting=true;cancelled=false;const snapshot={...settings},wasPlaying=playing;stop();const controls=[...document.querySelectorAll('button,input,select')].filter(x=>x.id!=='cancel'),disabled=controls.map(x=>x.disabled);controls.forEach(x=>x.disabled=true);el('cancel').hidden=false;const status=el('export-status'),c=outputCanvas(),ctx=c.getContext('2d',{willReadFrequently:true}),gif=GIFEncoder();
 try{for(let i=0;i<60;i++){if(cancelled){status.textContent='Export cancelled. Your settings are unchanged.';return;}drawScene(ctx,c.width,c.height,orbitFrame(snapshot,i),true);const rgba=ctx.getImageData(0,0,c.width,c.height).data,palette=quantize(rgba,128);gif.writeFrame(applyPalette(rgba,palette),c.width,c.height,{palette,delay:100,repeat:0});status.textContent=`Rendering your orbit… ${Math.round((i+1)/60*100)}%`;await new Promise(resolve=>setTimeout(resolve,0));}if(cancelled){status.textContent='Export cancelled. Your settings are unchanged.';return;}gif.finish();const blob=new Blob([gif.bytes()],{type:'image/gif'});download(blob,`gaussian-${el('aspect').value}.gif`);status.textContent=`GIF downloaded · 6 seconds · ${(blob.size/1024/1024).toFixed(1)} MB. Same controls, camera orbit ±30°.`;
 }catch(e){console.error(e);status.textContent='Export could not finish. Try a PNG instead.';}finally{settings=snapshot;exporting=false;controls.forEach((x,i)=>x.disabled=disabled[i]);el('cancel').hidden=true;draw();if(wasPlaying)el('play').click();}};
// Expose a small, documented rendering surface for deterministic offline publishing.
window.gaussianLab={drawScene,orbitFrame,getState:()=>({...settings}),setState:cfg=>{stop();settings={...settings,...cfg};draw();}};
if(new URLSearchParams(location.search).get('embed')==='1'){document.body.classList.add('embedded');const style=document.createElement('style');style.textContent='body.embedded nav,body.embedded header,body.embedded footer{display:none}body.embedded main{padding:0;max-width:none}body.embedded .understand{padding:35px 25px}body.embedded aside{margin:0 20px 20px}';document.head.append(style);new ResizeObserver(()=>parent.postMessage({type:'gaussian-height',height:document.documentElement.scrollHeight},location.origin)).observe(document.body);}
new ResizeObserver(()=>{const small=canvas.clientWidth<600;const width=small?720:1440,height=small?1160:800;if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;draw();}}).observe(canvas);
draw();

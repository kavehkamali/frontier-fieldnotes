import {TARGETS,TAU,simulate,sampleFrame,field,endpointRMS,moments,random} from './simulation.mjs';
import {GIFEncoder,quantize,applyPalette} from './vendor/gifenc.esm.js';
const el=id=>document.getElementById(id), canvas=el('particle-canvas');
const colors=['#8262d8','#0babc0','#ef9374','#5485d2','#b16bbb','#46b49c'];
const names={flow:'Flow matching',ode:'Diffusion · probability-flow ODE',sde:'Diffusion · reverse SDE'};
const budgets=[4,8,16,32,64,128];
let cfg={target:'ring',method:'flow',solver:'heun',steps:64,count:800,seed:42};
let sim,reference,targetPoints,time=.92,playing=false,last=0,exporting=false,cancelled=false;
let view={field:true,trails:true,reference:true};
function build(){
  document.querySelectorAll('[data-process]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.process===cfg.method));
  sim=simulate(cfg);
  reference=cfg.method==='sde'?null:simulate({...cfg,steps:256,solver:'heun'});
  const rng=random(1729),means=TARGETS[cfg.target].means;targetPoints=new Float32Array(cfg.count*2);
  for(let i=0;i<cfg.count;i++){const m=means[Math.floor(rng.uniform()*means.length)];targetPoints[2*i]=m[0]+TAU*rng.normal();targetPoints[2*i+1]=m[1]+TAU*rng.normal();}
  el('lab-solver').disabled=cfg.method==='sde';
  const old=el('lab-solver').querySelector('[value="sde"]');if(old)old.remove();
  if(cfg.method==='sde'){el('lab-solver').add(new Option('Euler–Maruyama · stochastic','sde'));el('lab-solver').value='sde';}else el('lab-solver').value=cfg.solver;
  el('lab-step-value').value=cfg.steps;el('lab-seed').textContent=`seed ${cfg.seed}`;
  el('lab-nfe').textContent=cfg.steps*(cfg.method!=='sde'&&cfg.solver==='heun'?2:1);
  canvas.setAttribute('aria-label',`Two-dimensional ${names[cfg.method]} simulation of ${TARGETS[cfg.target].name} with ${cfg.steps} steps. ${cfg.method==='sde'?'Grey points are independent target samples.':'Grey points use 256-step Heun from the same initial samples.'}`);
  el('lab-phase').textContent=cfg.method==='flow'?'Noise → structure':'Noisy mixture → structure';
  el('reference-legend').textContent=cfg.method==='sde'?'Independent target samples':'256-step reference';
  el('lab-reference').parentElement.lastChild.textContent=cfg.method==='sde'?' Target samples':' Fine-step reference';
  const end=sim.frames.at(-1);
  if(reference){
    el('lab-error-label').textContent='ENDPOINT ERROR';
    const error=endpointRMS(end,reference.frames.at(-1));
    el('lab-error').textContent=error<.001?error.toExponential(1):error.toFixed(3);
    el('lab-error-note').textContent='RMS vs 256-step Heun · data units';
  }else{
    const expected=means.reduce((s,m)=>s+m[0]**2+m[1]**2+2*TAU**2,0)/means.length;
    el('lab-error-label').textContent='SECOND-MOMENT GAP';
    const delta=(moments(end).r2/expected-1)*100;
    el('lab-error').textContent=`${delta>=0?'+':''}${delta.toFixed(1)}%`;
    el('lab-error-note').textContent='E[‖x‖²] vs target · finite sample';
  }
  el('lab-equation').textContent={flow:'dx / dt = v(x,t)',ode:'dx / dq = −½ ∇ log p_q(x)',sde:'dx = v ∇ log p · dr + √v · dWᵣ'}[cfg.method];
  el('lab-explanation').textContent={flow:'Straight training paths can produce curved sampling paths. The direction changes as each point moves through the field.',ode:'The exact score points toward higher density. A deterministic probability flow removes noise without adding fresh randomness.',sde:'Denoising adds fresh noise at each step, while its drift follows the score. Too few Euler–Maruyama steps bias the final distribution.'}[cfg.method];
  el('lab-tip').textContent=cfg.method==='sde'?'Try 4, then 128 steps. The rough sampler spreads too far. Grey points are target samples; matching one statistic is not proof of correctness.':'Switch to Euler. Drop to 4 steps. Where do the colored samples land compared with the grey reference?';
  draw();
}
function text(ctx,str,x,y,size=14,color='#738198',weight=400){ctx.fillStyle=color;ctx.font=`${weight} ${size}px "DM Sans", Arial, sans-serif`;ctx.fillText(str,x,y);}
function line(ctx,x1,y1,x2,y2,color,width=1){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
export function render(ctx,w,h,t,{simulation=sim,ref=reference,targets=targetPoints,settings=cfg,layers=view,caption=false}={}){
  t=Math.max(0,Math.min(1,t));
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#ffffff';ctx.fillRect(0,0,w,h);
  const detail=(!caption&&h>=w)?1.7:1;
  const s=w/960,top=caption?122*s:24*s,bottom=caption?95*s:35*s;
  const ph=h-top-bottom,size=Math.min(w-100*s,ph),scale=size/9,ox=w/2,oy=top+ph/2;
  const X=x=>ox+x*scale,Y=y=>oy-y*scale;
  if(caption){
    text(ctx,'FRONTIER FIELDNOTES / KAVEH',34*s,31*s,10*s,'#7d88a0',500);
    text(ctx,'Fewer steps. Did we miss the turn?',34*s,69*s,29*s,'#26354f',500);
    const solver=settings.method==='sde'?'Euler–Maruyama':settings.solver==='heun'?'Heun':'Euler';
    const nfe=settings.steps*(settings.method!=='sde'&&settings.solver==='heun'?2:1);
    text(ctx,`${names[settings.method]}  /  ${solver}  /  ${settings.steps} steps · ${nfe} evaluations`,34*s,97*s,13*s,'#65758e');
    line(ctx,34*s,113*s,w-34*s,113*s,'#e8edf4');
  }
  ctx.save();ctx.beginPath();ctx.rect(12*s,top,w-24*s,ph);ctx.clip();
  for(let x=-4;x<=4;x+=.4)for(let y=-4;y<=4;y+=.4){ctx.fillStyle='#e6eaf2';ctx.beginPath();ctx.arc(X(x),Y(y),.8*s,0,7);ctx.fill();}
  // Each circle is a 2-sigma contour of a target component, not total density.
  for(const m of simulation.means){
    const gx=X(m[0]),gy=Y(m[1]),r=TAU*scale;
    const gradient=ctx.createRadialGradient(gx,gy,0,gx,gy,3*r);gradient.addColorStop(0,'#b5a6ef28');gradient.addColorStop(1,'#b5a6ef00');ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(gx,gy,3*r,0,7);ctx.fill();
    ctx.strokeStyle='#b8b2cf75';ctx.lineWidth=1*s;ctx.setLineDash([3*s,4*s]);ctx.beginPath();ctx.arc(gx,gy,2*r,0,7);ctx.stroke();ctx.setLineDash([]);
  }
  if(layers.field){
    for(let x=-3.6;x<=3.6;x+=.6)for(let y=-3.6;y<=3.6;y+=.6){
      const v=field(x,y,t,simulation.means,settings.method),mag=Math.hypot(...v);if(mag<.005)continue;
      const length=Math.min(.29,.07+mag*.028)*scale,dx=v[0]/mag*length,dy=-v[1]/mag*length,px=X(x),py=Y(y);
      line(ctx,px-dx/2,py-dy/2,px+dx/2,py+dy/2,'#a5b6ce70',1*s);
      const a=Math.atan2(dy,dx),endx=px+dx/2,endy=py+dy/2;
      line(ctx,endx,endy,endx-4*s*Math.cos(a-.55),endy-4*s*Math.sin(a-.55),'#9cabc380',1*s);
      line(ctx,endx,endy,endx-4*s*Math.cos(a+.55),endy-4*s*Math.sin(a+.55),'#9cabc380',1*s);
    }
  }
  const pts=sampleFrame(simulation,t),referencePts=ref?sampleFrame(ref,t):targets;
  if(layers.reference){ctx.fillStyle='#aeb8c27a';for(let i=0;i<referencePts.length;i+=2){ctx.beginPath();ctx.arc(X(referencePts[i]),Y(referencePts[i+1]),1.5*s,0,7);ctx.fill();}}
  if(layers.trails){
    const lastFrame=Math.floor(t*simulation.steps),stride=Math.max(1,Math.floor(lastFrame/70));
    for(let i=0;i<Math.min(simulation.count,120);i++){
      ctx.strokeStyle=colors[i%colors.length]+'55';ctx.lineWidth=1.2*s;ctx.beginPath();
      for(let k=0;k<=lastFrame;k+=stride){const p=simulation.frames[k];k===0?ctx.moveTo(X(p[i*2]),Y(p[i*2+1])):ctx.lineTo(X(p[i*2]),Y(p[i*2+1]));}
      ctx.lineTo(X(pts[i*2]),Y(pts[i*2+1]));ctx.stroke();
    }
  }
  for(let i=0;i<simulation.count;i++){ctx.fillStyle=colors[i%colors.length]+'c9';ctx.beginPath();ctx.arc(X(pts[2*i]),Y(pts[2*i+1]),(i<120?2.6:2.1)*s*detail,0,7);ctx.fill();}
  // A few white-centred tracers make individual trajectory identity readable.
  for(let i=0;i<6;i++){ctx.strokeStyle=colors[i];ctx.fillStyle='#fff';ctx.lineWidth=1.8*s;ctx.beginPath();ctx.arc(X(pts[2*i]),Y(pts[2*i+1]),4*s,0,7);ctx.fill();ctx.stroke();}
  ctx.restore();
  let outside=0;for(let i=0;i<pts.length;i+=2)if(X(pts[i])<12*s||X(pts[i])>w-12*s||Y(pts[i+1])<top||Y(pts[i+1])>top+ph)outside++;
  if(outside)text(ctx,`${outside} samples outside view`,30*s,top+ph-8*s,10*s,'#98a3b3');
  text(ctx,`t = ${t.toFixed(2)}`,30*s,top+17*s,12*s*detail,'#7c8aa0');
  ctx.textAlign='right';text(ctx,TARGETS[settings.target].name,w-30*s,top+17*s,12*s*detail,'#7c8aa0');ctx.textAlign='left';
  if(caption){
    const base=h-75*s;line(ctx,34*s,base,w-34*s,base,'#e7ebf3');
    text(ctx,settings.method==='sde'?'Fresh noise at every step. Low step counts bias the result.':(layers.reference?'Colored samples follow the field. Grey: 256-step Heun reference.':'Colored samples follow the field. Reference layer is hidden.'),34*s,base+25*s,13*s,'#52627c');
    text(ctx,'Analytic 2D model · not video inference · seed '+settings.seed,34*s,base+47*s,11*s,'#8a95a6');
    text(ctx,'kavehkamali.github.io/frontier-fieldnotes',34*s,base+65*s,10*s,'#897cab');
    ctx.fillStyle='#7463d8';ctx.fillRect(0,h-3*s,w*t,3*s);
  }
}
function draw(){render(canvas.getContext('2d'),canvas.width,canvas.height,time);el('lab-time').value=Math.round(Math.min(time,1)*1000);el('lab-time-value').value=`${Math.round(Math.min(time,1)*100)}%`;}
function playback(value){playing=value;el('lab-play').textContent=playing?'Ⅱ Pause':'▶ Play';el('lab-play').setAttribute('aria-label',playing?'Pause simulation':'Play simulation');last=0;}
function tick(now){if(playing&&!exporting){if(last){time+=(now-last)/6500;if(time>1.15)time=0;draw();}last=now;}requestAnimationFrame(tick);}
for(const button of document.querySelectorAll('[data-process]'))button.addEventListener('click',()=>{cfg.method=button.dataset.process;document.querySelectorAll('[data-process]').forEach(b=>b.classList.toggle('active',b===button));build();});
el('lab-target').onchange=e=>{cfg.target=e.target.value;build();};
el('lab-solver').onchange=e=>{cfg.solver=e.target.value;build();};
el('lab-steps').oninput=e=>{cfg.steps=budgets[+e.target.value];build();};
el('lab-reseed').onclick=()=>{cfg.seed++;build();};
for(const key of ['field','trails','reference'])el('lab-'+key).onchange=e=>{view[key]=e.target.checked;draw();};
el('lab-play').onclick=()=>{if(time>=1)time=0;playback(!playing);draw();};
el('lab-time').oninput=e=>{playback(false);time=+e.target.value/1000;draw();};
el('lab-reset').onclick=()=>{playback(false);time=0;draw();};
el('lab-focus').onclick=()=>{const active=document.body.classList.toggle('lab-focused');el('lab-focus').textContent=active?'↙ Exit focus':'↗ Focus';el('lab-focus').setAttribute('aria-pressed',active);};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('lab-focused'))el('lab-focus').click();});
function resize(){const mobile=canvas.clientWidth<600;canvas.width=1200;canvas.height=mobile?1200:760;canvas.style.aspectRatio=mobile?'1 / 1':'1200 / 760';draw();}
new ResizeObserver(resize).observe(canvas);
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
function exportCanvas(){const c=document.createElement('canvas');c.width=el('lab-aspect').value==='square'?720:960;c.height=el('lab-aspect').value==='square'?720:600;return c;}
el('lab-png').onclick=()=>{const c=exportCanvas();render(c.getContext('2d'),c.width,c.height,Math.min(time,1),{caption:true});c.toBlob(blob=>{if(blob)download(blob,`fieldnotes-${cfg.method}-${cfg.steps}steps.png`);});};
el('lab-cancel').onclick=()=>{cancelled=true;};
el('lab-gif').onclick=async()=>{
  if(exporting)return;exporting=true;cancelled=false;
  const wasPlaying=playing;playback(false);
  const controls=[...document.querySelectorAll('.particle-lab button,.particle-lab input,.particle-lab select')].filter(x=>x.id!=='lab-cancel');
  const disabled=controls.map(x=>x.disabled);controls.forEach(x=>x.disabled=true);el('lab-cancel').hidden=false;
  const status=el('lab-export-status'),c=exportCanvas(),ctx=c.getContext('2d',{willReadFrequently:true}),gif=GIFEncoder();
  try{
    for(let frame=0;frame<60;frame++){
      if(cancelled){status.textContent='Export cancelled. Your settings are unchanged.';return;}
      render(ctx,c.width,c.height,frame/59,{caption:true});
      const rgba=ctx.getImageData(0,0,c.width,c.height).data,palette=quantize(rgba,128);
      gif.writeFrame(applyPalette(rgba,palette),c.width,c.height,{palette,delay:frame===0?400:frame===59?960:80,repeat:0});
      status.textContent=`Making your GIF… ${Math.round((frame+1)/60*100)}%`;
      await new Promise(resolve=>setTimeout(resolve,0));
    }
    gif.finish();const blob=new Blob([gif.bytes()],{type:'image/gif'});
    download(blob,`fieldnotes-${cfg.method}-${cfg.steps}steps-${el('lab-aspect').value}.gif`);
    status.textContent=`GIF ready · ${(blob.size/1024/1024).toFixed(1)} MB · 6 seconds. Downloaded with your current settings.`;
  }catch(error){console.error(error);status.textContent='Export could not finish. Try the smaller square format or save an image.';}
  finally{exporting=false;controls.forEach((x,i)=>x.disabled=disabled[i]);el('lab-cancel').hidden=true;playback(wasPlaying);}
};
build();resize();requestAnimationFrame(tick);

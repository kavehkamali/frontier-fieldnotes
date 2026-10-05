// Small, dependency-free reference implementation. World units are arbitrary.
export const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
export const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>a.map(v=>v/Math.hypot(...a));
export function camera(azimuth=25,elevation=12,distance=5.8){
 const a=azimuth*Math.PI/180,e=elevation*Math.PI/180;
 const eye=[distance*Math.cos(e)*Math.sin(a),distance*Math.sin(e),distance*Math.cos(e)*Math.cos(a)];
 const forward=unit(eye.map(v=>-v)),right=unit(cross(forward,[0,1,0])),up=cross(right,forward);
 return {eye,R:[right,up,forward]};
}
export function covariance(tangent,normal,depth,sigmas){return Array.from({length:3},(_,i)=>Array.from({length:3},(_,j)=>[tangent,normal,depth].reduce((v,a,k)=>v+a[i]*a[j]*sigmas[k]**2,0)));}
export function project(mean,S,cam,focal,cx=0,cy=0){
 const rel=mean.map((x,i)=>x-cam.eye[i]),p=cam.R.map(row=>dot(row,rel));if(p[2]<=.1)return null;
 const cameraCov=cam.R.map(row=>cam.R.map(col=>row.reduce((v,r,i)=>v+r*S[i].reduce((s,x,j)=>s+x*col[j],0),0)));
 const [x,y,z]=p,J=[[focal/z,0,-focal*x/z**2],[0,-focal/z,focal*y/z**2]];
 const Q=J.map(row=>J.map(col=>row.reduce((v,r,i)=>v+r*cameraCov[i].reduce((s,t,j)=>s+t*col[j],0),0)));
 const a=Q[0][0],b=Q[0][1],d=Q[1][1],disc=Math.hypot(a-d,2*b),l1=(a+d+disc)/2,l2=(a+d-disc)/2;
 return {x:cx+focal*x/z,y:cy-focal*y/z,z,Q,r1:Math.sqrt(Math.max(l1,1e-8)),r2:Math.sqrt(Math.max(l2,1e-8)),angle:.5*Math.atan2(2*b,a-d)};
}
export function compositeFrontToBack(layers,background=[1,1,1]){let T=1,c=[0,0,0];for(const {color,alpha} of layers){c=c.map((v,i)=>v+T*alpha*color[i]);T*=1-alpha;}return c.map((v,i)=>v+T*background[i]);}
export function scene(settings,angle=settings.orbit){
 const points=[],{anisotropy=1.7,size=1}=settings;
 function add(center,tangent,normal,theta,ring,isFill){
   let color=isFill?[238,140,103]:theta<1.3?[75,170,182]:[141,120,205];
   const shade=.86+.14*Math.cos(ring);color=color.map(v=>Math.round(v*shade));
   points.push({mean:center,tangent,normal,color,fill:isFill,S:covariance(tangent,normal,[0,0,1],[.061*anisotropy*size,.06*size,.066*size])});
 }
 for(let i=0;i<=70;i++){
   const t=i/70*Math.PI,tangent=[-Math.sin(t),Math.cos(t),0],normal=[Math.cos(t),Math.sin(t),0],fill=t>.38&&t<1.13;
   for(let j=0;j<9;j++){const q=j/9*Math.PI*2,r=.155;let p=[(1.16+r*Math.cos(q))*Math.cos(t),(1.16+r*Math.cos(q))*Math.sin(t)-.12,r*Math.sin(q)];
     if(fill&&settings.mode==='empty')continue;
     if(fill&&settings.mode==='independent'){
       const shift=Math.sin(angle*Math.PI/180);p=[p[0]+.65*shift*Math.sin(t*2),p[1]+.18*shift,p[2]+.20*shift];
     }
     add(p,tangent,normal,t,q,fill);
   }
 }
 for(const side of [-1,1])for(let i=1;i<=19;i++)for(let j=0;j<9;j++){const q=j/9*Math.PI*2;add([side*1.16+.155*Math.cos(q),-.12-i*.055,.155*Math.sin(q)],[0,1,0],[1,0,0],side===1?0:2,q,false);}
 return points;
}
export const DEFAULTS={orbit:24,elevation:12,opacity:.64,anisotropy:1.7,size:1,ellipses:false,region:true,mode:'compare'};

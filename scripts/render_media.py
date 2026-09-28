"""Render original educational diagrams and silent captioned videos (Pillow + ffmpeg)."""
from PIL import Image, ImageDraw, ImageFont
import math, random, pathlib, subprocess, tempfile, os
ROOT=pathlib.Path(__file__).resolve().parents[1]; OUT=ROOT/'dist/assets';OUT.mkdir(exist_ok=True)
BG='#ffffff';INK='#18243b';MUTED='#5c6b82';LIME='#5145cd';CYAN='#008ba3';VIOLET='#ee875c'
font_candidates=[os.getenv('FIELDNOTES_FONT',''),'/System/Library/Fonts/Supplemental/Arial.ttf','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']
font_path=next((p for p in font_candidates if pathlib.Path(p).is_file()),None)
def font(n):return ImageFont.truetype(font_path,n) if font_path else ImageFont.load_default(size=n)
rng=random.Random(19);points=[]
for i in range(210):
 a=rng.random()*math.tau;r=25+rng.random()*80;k=i%3
 points.append((200+rng.gauss(0,62),470+rng.gauss(0,85),860+math.cos(a)*r,470+math.sin(a)*r+(k-1)*95,[CYAN,LIME,VIOLET][k]))
TITLES={'flow':['Noise has a distribution.','So does your data.'],'attention':['Attention chooses.','Hardware decides the cost.'],'lora':['Context is an input.','LoRA changes the weights.']}
CAPTIONS={'flow':['Pure noise: all three populations overlap.','Less noise: the data populations separate.','Reversing this illustration is not learned denoising.'], 'attention':['Dense: read across all available keys.','Causal: earlier positions are available.','Sparse: select, retain and renormalize.'], 'lora':['A low-rank update factors into two matrices.','Rank sets capacity, not guaranteed quality.','At inference, reference images provide context.']}
def render(topic,t):
 im=Image.new('RGB',(1200,900),BG);d=ImageDraw.Draw(im)
 d.text((55,36),'FRONTIER FIELDNOTES   /   KAVEH',font=font(19),fill=LIME)
 for i,s in enumerate(TITLES[topic]):d.text((55,92+i*63),s,font=font(52),fill=INK)
 d.line((55,260,1145,260),fill='#dce3ed',width=2)
 if topic=='flow':
  alpha=math.sin(t*math.pi/2);sd=math.sqrt(alpha*alpha*.16+1-alpha*alpha)
  colors=[CYAN,LIME,VIOLET];means=[-2.5,0,2.5]
  px=lambda x:100+(x+5)*100;py=lambda y:610-y*700
  normal=lambda x,m:math.exp(-.5*((x-m)/sd)**2)/(sd*math.sqrt(2*math.pi))
  d.text((100,282),'PROBABILITY DENSITY',font=font(19),fill=MUTED)
  for j in range(4):
   y=j*.1;d.line((100,py(y),1100,py(y)),fill='#e7ecf3');d.text((58,py(y)-10),f'{y:.1f}',font=font(16),fill=MUTED)
  for k,m in enumerate(means):
   coords=[(px(-5+i/40),py(normal(-5+i/40,alpha*m)/3)) for i in range(401)]
   d.line(coords,fill=colors[k],width=4)
  d.line([(px(-5+i/40),py(sum(normal(-5+i/40,alpha*m)/3 for m in means))) for i in range(401)],fill=INK,width=4)
  for x in [-4,-2,0,2,4]:d.text((px(x)-8,622),str(x),font=font(18),fill=MUTED)
  d.text((400,660),'x / toy feature value',font=font(21),fill=MUTED)
  d.text((55,696),'Cyan / A     Violet / B     Orange / C     Dark / sum',font=font(17),fill=MUTED)
 elif topic=='attention':
  mode=min(2,int(t*3));n=9;s=35;x=445;y=320
  for row in range(n):
   vals=[math.exp(2*math.sin(row*1.7+c*.8)) for c in range(n)];keep=sorted(range(n),key=lambda c:vals[c],reverse=True)[:3]
   vals=[v if (mode==0 or (mode==1 and c<=row) or (mode==2 and c in keep)) else 0 for c,v in enumerate(vals)];total=sum(vals)
   for col,v in enumerate(vals):
    q=math.sqrt(v/total) if v else 0;fill=tuple(int(a+(b-a)*q) for a,b in zip((237,241,246),(81,69,205)))
    d.rectangle((x+col*s,y+row*s,x+col*s+s-4,y+row*s+s-4),fill=fill)
  d.text((515,280),'KEYS →',font=font(20),fill=MUTED);d.text((280,450),'QUERIES',font=font(20),fill=MUTED)
  d.text((500,665),['DENSE','CAUSAL','SPARSE'][mode],font=font(25),fill=LIME)
 else:
  if t<.67:
   rank=2 if t<.34 else 3
   def matrix(x,y,rows,cols,w,h,color):
    for r in range(rows):
     for c in range(cols):d.rectangle((x+c*w/cols,y+r*h/rows,x+(c+1)*w/cols-4,y+(r+1)*h/rows-4),fill=color)
   matrix(110,370,8,8,210,210,CYAN);matrix(480,370,8,rank,rank*27,210,LIME);matrix(830,370,rank,8,210,rank*27,VIOLET)
   for x,s in [(180,'ΔW'),(375,'='),(490,'B'),(720,'×'),(920,'A')]:d.text((x,310 if s not in ['=','×'] else 455),s,font=font(36),fill=INK)
   d.text((390,650),f'8 × 8 update  /  rank {rank}',font=font(25),fill=LIME)
  else:
   for i,s in enumerate(['Reference','Reference','Target']):
    x=125+i*330;d.rounded_rectangle((x,355,x+280,570),radius=9,outline=LIME if i==2 else CYAN,width=3);d.text((x+48,440),s,font=font(29),fill=INK)
   d.text((335,635),'Joint image canvas + joint caption',font=font(28),fill=LIME)
 d.line((55,723,1145,723),fill='#dce3ed',width=2)
 d.text((55,750),CAPTIONS[topic][min(2,int(t*3))],font=font(30),fill=INK)
 d.text((55,815),'Educational schematic · not model output or benchmark evidence',font=font(21),fill=MUTED)
 d.text((55,850),'frontier-fieldnotes  /  Source links in the accompanying post',font=font(17),fill=MUTED)
 return im
# The advanced flow assets are exported from the browser's shared renderer.
# Preserve that kit when refreshing the background explainers.
for topic in ['attention', 'lora']:
 render(topic,.55 if topic!='lora' else .2).save(OUT/f'{topic}-card.png')
 frames=[]
 with tempfile.TemporaryDirectory(prefix='fieldnotes-') as td:
  for i in range(180):
   # Three-second endpoint holds make the mechanism readable.
   t=max(0,min(1,(i-24)/132));im=render(topic,t);im.save(pathlib.Path(td)/f'{i:04d}.png')
   if i%6==0:frames.append(im.resize((720,540)))
  frames[0].save(OUT/f'{topic}-loop.gif',save_all=True,append_images=frames[1:],duration=500,loop=0,optimize=True)
  subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-framerate','12','-i',td+'/%04d.png','-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart','-crf','22',str(OUT/f'{topic}-video.mp4')],check=True)
 print('Rendered',topic,flush=True)

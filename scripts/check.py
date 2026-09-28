"""Check public artifacts, X post sizes and canonical data consistency."""
from pathlib import Path
import json,re,subprocess,shutil,zipfile
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[1];DIST=ROOT/'dist'
class Assets(HTMLParser):
 def handle_starttag(self,tag,attrs):
  for k,v in attrs:
   if k in ('href','src') and v and not v.startswith(('https:','http:','#','data:')):
    assert (DIST/v).is_file(),f'Missing local asset: {v}'
Assets().feed((DIST/'index.html').read_text())
assert '#f7f9fc' in (DIST/'style.css').read_text(),'Light theme missing'
for f in (ROOT/'content/editions').glob('*/*.json'):json.loads(f.read_text())
for f in (ROOT/'content/editions').glob('*/*-x.md'):
 for post in re.split(r'\n\n(?=\d+/\d+\n)',f.read_text().strip()):
  urls=re.findall(r'https?://\S+',post);plain=re.sub(r'https?://\S+','',post)
  weight=len(urls)*23+sum(1 if ord(c)<=0x10ff or 0x2000<=ord(c)<=0x200d or 0x2010<=ord(c)<=0x201f or 0x2032<=ord(c)<=0x2037 else 2 for c in plain)
  assert weight<=280,f'{f.name}: post too long ({weight})'
for topic in ['flow','attention','lora']:
 for suffix in ['card.png','loop.gif','video.mp4']:
  f=DIST/'assets'/f'{topic}-{suffix}';assert f.exists() and f.stat().st_size>1000,f'Missing/empty media: {f}'
if shutil.which('node'):
 for name in ['app.js','data.js','lab.mjs','simulation.mjs']:subprocess.run(['node','--check',str(DIST/name)],check=True)
 subprocess.run(['node',str(ROOT/'tests/simulation.test.mjs'),str(DIST/'simulation.mjs')],check=True,stdout=subprocess.DEVNULL)
with zipfile.ZipFile(DIST/'assets/edition-001.zip') as z:
 assert z.testzip() is None
 assert len(z.namelist())>=20
for pattern in ['ghp_[A-Za-z0-9]{20,}','gho_[A-Za-z0-9]{20,}','sk-[A-Za-z0-9]{20,}']:
 for f in [*DIST.glob('*.js'),*DIST.glob('*.html'),*ROOT.glob('*.md')]:
  assert not re.search(pattern,f.read_text()),f'Possible credential in {f}'
print('PASS: local links, light theme, JSON, X lengths, media, JavaScript syntax, edition archive, public-content credential patterns.')

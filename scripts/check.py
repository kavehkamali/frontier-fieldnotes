"""Validate edition integrity, links, posting assets and numerical teaching models."""
from pathlib import Path
import json,re,subprocess,shutil,zipfile
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
ROOT=Path(__file__).resolve().parents[1];DIST=ROOT/'dist'
class Assets(HTMLParser):
 def __init__(self,page):super().__init__();self.page=page
 def handle_starttag(self,tag,attrs):
  for k,v in attrs:
   if k not in ('href','src') or not v:continue
   url=urlsplit(v)
   if url.scheme or url.netloc or not url.path:continue
   assert (self.page.parent/unquote(url.path)).is_file(),f'Missing local asset in {self.page.name}: {v}'
for page in DIST.glob('*.html'):Assets(page).feed(page.read_text())
assert '#f7f9fc' in (DIST/'style.css').read_text(),'Light theme missing'
for f in (ROOT/'content/editions').glob('*/*.json'):json.loads(f.read_text())
meta=json.loads((DIST/'edition.json').read_text());edition=ROOT/'content/editions'/meta['date']
canonical=json.loads((edition/'research.json').read_text())
data=(DIST/'data.js').read_text();variables={}
for line in data.splitlines():
 match=re.fullmatch(r'const (\w+) = (.*);',line)
 assert match, 'Malformed generated data'
 variables[match[1]]=json.loads(match[2])
assert variables['EDITION']==meta
assert variables['PAPERS']==canonical['papers'], 'Research differs from canonical edition'
assert 5<=len(variables['PAPERS'])<=8
assert 5<=len(variables['QUEUE'])<=8
for name in ['queue','competitors','community']:
 assert variables[name.upper()]==json.loads((edition/(name+'.json')).read_text())
for story in meta['stories']:
 for channel in ['linkedin','x','medium']:
  assert variables['DRAFTS'][story['id']][channel]==(edition/f"{story['id']}-{channel}.md").read_text().strip(), 'Canonical draft mismatch'
for f in (ROOT/'content/editions').glob('*/*-x.md'):
 for post in re.split(r'\n\n(?=\d+/\d+\n)',f.read_text().strip()):
  urls=re.findall(r'https?://\S+',post);plain=re.sub(r'https?://\S+','',post)
  weight=len(urls)*23+sum(1 if ord(c)<=0x10ff or 0x2000<=ord(c)<=0x200d or 0x2010<=ord(c)<=0x201f or 0x2032<=ord(c)<=0x2037 else 2 for c in plain)
  assert weight<=280,f'{f.name}: post too long ({weight})'
topics={'flow','attention','lora'}|{s['id'] for s in meta['stories']}
for topic in topics:
 for suffix in ['card.png','loop.gif','video.mp4']:
  f=DIST/'assets'/f'{topic}-{suffix}';assert f.exists() and f.stat().st_size>1000,f'Missing/empty media: {f}'
if shutil.which('node'):
 for f in [*DIST.glob('*.js'),*DIST.glob('*.mjs')]:subprocess.run(['node','--check',str(f)],check=True)
 subprocess.run(['node',str(ROOT/'tests/simulation.test.mjs'),str(DIST/'simulation.mjs')],check=True,stdout=subprocess.DEVNULL)
 subprocess.run(['node',str(ROOT/'tests/gaussian.test.mjs')],check=True)
for archive in (DIST/'assets').glob('edition-*.zip'):
 with zipfile.ZipFile(archive) as z:assert z.testzip() is None
with zipfile.ZipFile(DIST/'assets'/meta['archive']) as z:
 for f in edition.iterdir():
  if f.is_file():assert z.read('content/'+f.name)==f.read_bytes(),f'Stale archived file: {f.name}'
 for story in meta['stories']:
  for suffix in ['card.png','loop.gif','video.mp4']:
   name=story['id']+'-'+suffix;assert z.read('assets/'+name)==(DIST/'assets'/name).read_bytes()
 for name in meta.get('interactive_files',[]):assert 'interactive/'+name in z.namelist()
for pattern in ['ghp_[A-Za-z0-9]{20,}','gho_[A-Za-z0-9]{20,}','sk-[A-Za-z0-9]{20,}']:
 for f in [*DIST.glob('*.js'),*DIST.glob('*.mjs'),*DIST.glob('*.html'),*ROOT.glob('*.md'),*edition.glob('*.md'),*edition.glob('*.json')]:
  assert not re.search(pattern,f.read_text()),f'Possible credential in {f}'
print('PASS: links, light theme, canonical edition/drafts, X sizes, media, JS syntax, both numerical labs and archived content.')

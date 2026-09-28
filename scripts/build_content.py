"""Build the dashboard from canonical edition files without overwriting drafts."""
import json, pathlib, argparse, zipfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--edition',default='2026-09-28');a=p.parse_args()
e=ROOT/'content/editions'/a.edition
research=json.loads((e/'research.json').read_text());drafts={}
for f in sorted(e.glob('*.md')):
 for channel in ['linkedin','x','medium']:
  if f.stem.endswith('-'+channel):
   topic=f.stem[:-(len(channel)+1)];drafts.setdefault(topic,{})[channel]=f.read_text().strip()
output='const PAPERS = '+json.dumps(research['papers'])+';\nconst DRAFTS = '+json.dumps(drafts)+';\n'
for name in ['queue','competitors','community']:
 f=e/(name+'.json')
 output+='const '+name.upper()+' = '+json.dumps(json.loads(f.read_text()) if f.exists() else [])+';\n'
(ROOT/'dist/data.js').write_text(output)
assets=ROOT/'dist/assets'
with zipfile.ZipFile(assets/'edition-001.zip','w',zipfile.ZIP_DEFLATED) as z:
 for f in sorted(e.iterdir()):
  if f.is_file():z.write(f,'content/'+f.name)
 for f in sorted(assets.iterdir()):
  if f.is_file() and f.suffix in ['.png','.gif','.mp4','.md']:z.write(f,'assets/'+f.name)
print(f"Built {len(research['papers'])} research records and {sum(len(v) for v in drafts.values())} drafts")

"""Build the selected edition without overwriting canonical drafts or older archives."""
import json, pathlib, argparse, zipfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--edition');a=p.parse_args()
available=sorted(f.name for f in (ROOT/'content/editions').iterdir() if f.is_dir() and (f/'research.json').exists())
selected=a.edition or available[-1]
e=ROOT/'content/editions'/selected
research=json.loads((e/'research.json').read_text());drafts={}
for f in sorted(e.glob('*.md')):
 for channel in ['linkedin','x','medium']:
  if f.stem.endswith('-'+channel):
   topic=f.stem[:-(len(channel)+1)];drafts.setdefault(topic,{})[channel]=f.read_text().strip()
metadata=e/'edition.json'
meta=json.loads(metadata.read_text()) if metadata.exists() else {
 'date':selected,'label':'28 SEP 2026','number':'001','title':'Few-step video',
 'archive':'edition-001.zip','brief_url':f'https://github.com/kavehkamali/frontier-fieldnotes/blob/main/content/editions/{selected}/weekly-brief.md',
 'stories':[{'id':k,'label':k.title(),'alt':k+' educational diagram','caption':'Original analytic or schematic visual; not paper inference.','narration':'assets/video-script.md'} for k in drafts],
 'interactive_files':[]}
assert {s['id'] for s in meta['stories']}==set(drafts), 'Stories and canonical draft topics disagree'
assert all(set(channels)=={'linkedin','x','medium'} for channels in drafts.values()), 'Incomplete publishing kit'
output='const EDITION = '+json.dumps(meta)+';\nconst PAPERS = '+json.dumps(research['papers'])+';\nconst DRAFTS = '+json.dumps(drafts)+';\n'
for name in ['queue','competitors','community']:
 f=e/(name+'.json')
 output+='const '+name.upper()+' = '+json.dumps(json.loads(f.read_text()) if f.exists() else [])+';\n'
(ROOT/'dist/data.js').write_text(output)
(ROOT/'dist/edition.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n')
assets=ROOT/'dist/assets'
media=[]
for story in meta['stories']:
 for suffix in ['card.png','loop.gif','video.mp4']:
  media.append(assets/f"{story['id']}-{suffix}")
 media.append(ROOT/'dist'/story['narration'])
for f in media: assert f.is_file(), f'Missing kit asset: {f}'
with zipfile.ZipFile(assets/meta['archive'],'w',zipfile.ZIP_DEFLATED) as z:
 for f in sorted(e.iterdir()):
  if f.is_file():z.write(f,'content/'+f.name)
 for f in sorted(set(media)):z.write(f,'assets/'+f.name)
 for name in meta.get('interactive_files',[]):
  f=ROOT/'dist'/name
  assert f.is_file(),f'Missing interactive asset: {name}'
  if name.endswith('.html'):
   text=f.read_text().replace('./index.html','https://kavehkamali.github.io/frontier-fieldnotes/')
   z.writestr('interactive/'+name,text)
  else:z.write(f,'interactive/'+name)
print(f"Built {selected}: {len(research['papers'])} research records, {sum(len(v) for v in drafts.values())} drafts and {meta['archive']}")

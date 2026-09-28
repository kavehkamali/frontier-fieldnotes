# Frontier Fieldnotes

A public visual research notebook by Kaveh: current creative AI research, clear fundamentals and reusable publishing kits.

**[Open the interactive lab](https://kavehkamali.github.io/frontier-fieldnotes/)**

Focus: 3D Gaussian splatting, video, voice generation, AI filmmaking, diffusion, attention and efficient adaptation. The interface always uses a light, modern, minimal theme.

## What is here

- Interactive diffusion distributions: exact marginals of a toy Gaussian mixture, colored components and sample trajectories.
- Separate schematic transport, attention masking and LoRA/context explanations.
- Four-step presentation view, PNG export and editable channel drafts.
- Eight dated research entries, six prioritized fundamentals/graphic proposals, three product updates and three Reddit leads in the first edition.
- Three LinkedIn drafts, three X threads, one longer Medium article and two short article drafts.
- Original PNG diagrams, looping GIFs and 15-second silent captioned MP4s; narration/shot list for a separate 60-second cut.

## Weekly research contract

Every weekly edition contains **two lists**: frontier/SOTA candidates and fundamentals worth turning into interactive graphics. Each proposed teaching topic connects to recent research. A dated competitor/community section tracks Higgsfield, OpenArt and relevant peers. Primary sources support technical claims; community posts are discovery leads.

The first edition is a curated September 2026 snapshot, checked September 28. It is not an exhaustive benchmark leaderboard. Nothing here claims independent model reproduction or universal SOTA. Robotics and physical AI are excluded from the current agenda.

## Run locally

```sh
python3 -m http.server 8765 --directory dist
```

Open http://localhost:8765. No API key, server database or installation is needed. The dashboard is static and does not call paid generation services. Google Fonts is optional; fallback system fonts work offline.

Canonical content is under `content/editions/`. To rebuild the dashboard data and downloadable kit:

```sh
python3 scripts/build_content.py --edition 2026-09-28
python3 scripts/check.py
```

`render_media.py` requires Pillow and ffmpeg. Set `FIELDNOTES_FONT` to a local TrueType font if needed. The media are original programmatic scientific diagrams, not copied paper figures or model outputs.

## Publication

GitHub Pages publishes the `dist/` folder through the included workflow. Sites hosting metadata is in `.openai/hosting.json`; source publishing there uses the Sites workflow independently. Scheduled research runs belong to the owner's Codex chat and are not GitHub CI jobs. They require that environment to be available.

Drafts are prepared for editorial review. No social account posting is automated. Editing a draft in the web page changes only that session; download it to save your changes.

## Licensing and attribution

Project code and original diagrams: MIT, see LICENSE. Research papers, product names and external content remain the property of their respective owners and retain their original licenses. Source links and caveats accompany research records. No copied paper figures are redistributed.

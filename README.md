# Frontier Fieldnotes

A public visual research notebook by Kaveh: current creative AI research, clear fundamentals and reusable publishing kits.

**[Open the interactive lab](https://kavehkamali.github.io/frontier-fieldnotes/)**

Focus: 3D Gaussian splatting, video, voice generation, AI filmmaking, diffusion, attention and efficient adaptation. The interface always uses a light, modern, minimal theme.

## What is here

- A new light, minimal sampler studio linked to recent video research: FlashRender (3 Sep 2026) and ViRDM (24 Sep 2026).
- 800 samples integrated through exact 2D Gaussian-mixture fields: flow matching, probability-flow diffusion ODE and reverse diffusion SDE.
- Three target shapes; Euler/Heun; 4–128 numerical steps; trajectory, field and reference layers; seeded replay, timeline and focus mode.
- One-click, locally encoded six-second GIF and PNG from the current settings in square or wide format. No upload or API key. The default posting kit includes an MP4 conversion.
- Eight dated frontier entries, six research-linked interactive proposals, plus product and Reddit leads.
- Casual LinkedIn/X drafts and Medium articles. Older attention/LoRA material stays in a clearly dated reference library.

The fields are analytic teaching models, not trained video models or paper reproductions. Deterministic errors compare the same initial samples against 256-step Heun. Stochastic mode shows a distribution statistic instead; coarse Euler–Maruyama can have large variance bias. See [the numerical notes](docs/simulation.md).

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

`render_media.py` creates the original background explainers and requires Pillow and ffmpeg; do not use it to overwrite the advanced flow kit. Export the advanced flow GIF/PNG from the browser, then convert GIF to MP4 with ffmpeg. Set `FIELDNOTES_FONT` to a local TrueType font if needed. The media are original programmatic scientific diagrams, not copied paper figures or model outputs.

## Publication

GitHub Pages publishes the `dist/` folder through the included workflow. Sites hosting metadata is in `.openai/hosting.json`; source publishing there uses the Sites workflow independently. Scheduled research runs belong to the owner's Codex chat and are not GitHub CI jobs. They require that environment to be available.

Drafts are prepared for editorial review. No social account posting is automated. Editing a draft in the web page changes only that session; download it to save your changes.

## Licensing and attribution

Project code and original diagrams: MIT, see LICENSE. Vendored gifenc 1.0.3 is MIT; its license is under dist/vendor/. Research papers, product names and external content remain the property of their respective owners and retain their original licenses. Source links and caveats accompany research records. No copied paper figures are redistributed.

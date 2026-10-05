# Frontier Fieldnotes

A public visual research notebook by Kaveh: current creative AI research, clear fundamentals and reusable publishing kits.

**[Open the interactive lab](https://kavehkamali.github.io/frontier-fieldnotes/)**

Focus: 3D Gaussian splatting, video, voice generation, AI filmmaking, diffusion, attention and efficient adaptation. The interface always uses a light, modern, minimal theme.

## What is here

- [This week’s 3D lab](https://kavehkamali.github.io/frontier-fieldnotes/gaussian.html): orbit a synthetic Gaussian-splat arch, compare a fixed repair with deliberately view-dependent hypotheses, and inspect projection, opacity and anisotropy.
- [October 5 edition](content/editions/2026-10-05/weekly-brief.md): eight fresh research candidates, eight fundamentals-to-graphics ideas, dated competitor changes and source coverage.
- A casual WINGS-inspired LinkedIn draft, five-post X thread, Medium article, original PNG, six-second GIF/MP4, and narration. [Download edition 002](https://kavehkamali.github.io/frontier-fieldnotes/assets/edition-002.zip).
- One-click PNG/GIF export from the 3D lab in square or wide format. GIF adds a ±30° orbit around the selected camera while preserving the other settings.
- The previous analytic sampler lab remains available: 800 samples, flow/ODE/SDE, numerical solvers, step counts, seeded replay and exports. Earlier attention and LoRA explainers remain reference material.
- Canonical prior editions and the September 28 kit remain intact.

The 3D lab uses handmade geometry and a simplified perspective Gaussian renderer; it does not run WINGS or compare model outputs. Consistent geometry is not proof of correct hidden geometry. See [renderer notes](docs/gaussian.md).

The previous sampler uses analytic fields, not trained video models. See [numerical notes](docs/simulation.md).

## Weekly research contract

Every weekly edition contains **two lists**: frontier/SOTA candidates and fundamentals worth turning into interactive graphics. Each proposed teaching topic connects to recent research. A dated competitor/community section tracks Higgsfield, OpenArt and relevant peers. Primary sources support technical claims; community posts are discovery leads.

The current edition is checked October 5, 2026; earlier dated snapshots are preserved. It is not an exhaustive benchmark leaderboard. Nothing here claims independent model reproduction or universal SOTA. Robotics and physical AI are excluded from the current agenda.

## Run locally

```sh
python3 -m http.server 8765 --directory dist
```

Open http://localhost:8765. No API key, server database or installation is needed. The dashboard is static and does not call paid generation services. Google Fonts is optional; fallback system fonts work offline.

Canonical content is under `content/editions/`. Each edition’s edition.json selects its stories, media and archive name. To rebuild the dashboard data and its own downloadable kit (without overwriting earlier kits):

```sh
python3 scripts/build_content.py --edition 2026-10-05
python3 scripts/check.py
```

`render_media.py` creates the original background explainers and requires Pillow and ffmpeg; do not use it to overwrite the advanced flow kit. Export the advanced flow GIF/PNG from the browser, then convert GIF to MP4 with ffmpeg. Set `FIELDNOTES_FONT` to a local TrueType font if needed. The media are original programmatic scientific diagrams, not copied paper figures or model outputs.

## Publication

GitHub Pages publishes the `dist/` folder through the included workflow. Sites hosting metadata is in `.openai/hosting.json`; source publishing there uses the Sites workflow independently. Scheduled research runs belong to the owner's Codex chat and are not GitHub CI jobs. They require that environment to be available.

Drafts are prepared for editorial review. No social account posting is automated. Editing a draft in the web page changes only that session; download it to save your changes.

## Licensing and attribution

Project code and original diagrams: MIT, see LICENSE. Vendored gifenc 1.0.3 is MIT; its license is under dist/vendor/. Research papers, product names and external content remain the property of their respective owners and retain their original licenses. Source links and caveats accompany research records. No copied paper figures are redistributed.

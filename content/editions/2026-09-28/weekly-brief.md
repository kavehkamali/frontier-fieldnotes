# Weekly brief — 28 September 2026

This edition leads with recent few-step video research. Publication dates matter: ViRDM is from last week; FlashRender is earlier this month. These are scoped, author-reported research contributions, not an independent ranking of all video generators.

## List 1: Frontier / SOTA candidates

| Priority | Paper / checked version | Date | What changed | Evidence boundary |
|---|---|---|---|---|
| 1 | [ViRDM v1](https://arxiv.org/abs/2609.28923v1) | Submitted 24 Sep | Generator-only post-training against cached representation distributions; dynamics regularization for motion | Technical report; existing pretrained generator and encoders. Compute claims cover post-training |
| 2 | [FlashRender v1](https://arxiv.org/abs/2609.03563v1) | Submitted 3 Sep | Addresses sampling-dependent camera control with geometry alignment, MeanFlow and distillation | Camera-controlled video retakes; author results, no independent reproduction |
| 3 | [ETA v2](https://arxiv.org/abs/2609.20888v2) | Revised 25 Sep | Adaptive block-sparse decoding | Specific model, context and implementation; not a universal speedup |
| 4 | [LACI](https://arxiv.org/abs/2609.16989v1) | 15 Sep | Error recovery during long narration | Specific TTS systems and long-prompt evaluation |
| 5 | [VS-Splat](https://arxiv.org/abs/2609.12343v1) | 11 Sep | Object-aware allocation of Gaussian primitives | Selected sparse-view reconstruction benchmarks |
| 6 | [StepAudio 3 Gen](https://arxiv.org/abs/2609.12945v1) | 11 Sep | Shared discrete representation for audio generation | Technical report; no independent listening comparison here |
| 7 | [BEACON](https://arxiv.org/abs/2609.13264v1) | 7 Sep | Separates appearance from facial behavior conditioning | Facial-video datasets, not general film continuity |
| 8 | [Parallelism in diffusion LMs v2](https://arxiv.org/abs/2609.20539v2) | Revised 18 Sep | Separates language-diffusion formulations theoretically | Oracle and distribution assumptions; not wall-clock production performance |

Primary research checks and limitations are in research.json and fresh-paper-notes.md. Older foundations are cited only to explain mechanisms. IC-LoRA remains a dated 2024 reference-library story.

## List 2: Fundamentals to turn into graphics

| Priority | Topic and recent connection | Interaction | Status |
|---|---|---|---|
| 1 | Sampler discretization → FlashRender | 800 samples; flow / ODE / SDE; Euler / Heun; 4–128 steps; same-seed reference; three shapes | Advanced lab implemented, GIF / PNG export ready |
| 2 | Gaussian projection and compositing → VS-Splat | Orbit a camera, change covariance and opacity, inspect splat footprints | Proposed next build |
| 3 | Appearance versus motion conditioning → BEACON | Independently switch reference channels along a timeline | Proposed |
| 4 | Audio tokens and prosody → StepAudio / LACI | Codebook timeline, pauses, pitch and recovery points | Proposed |
| 5 | Space/time attention → ETA | Frame–patch–text connectivity, block sparsity and retained information | Basic masks ready; video extension proposed |
| 6 | Matching frames versus matching motion → ViRDM | Construct clips with similar frame statistics but different temporal dynamics | Proposed |

Recommendation: publish the FlashRender-led sampler explanation now, with ViRDM as last week's companion. Then prioritize ViRDM's motion-versus-appearance interaction or a fresh 3DGS result, after checking the new week's papers. Do not repeat generic diffusion introductions as news.

## Ready-to-post kit

The flow story has casual LinkedIn and X drafts, a longer Medium article, a matching square PNG, a six-second GIF, and a six-second silent MP4. All are original analytic diagrams. The lab exports your selected process, shape, seed, solver, step count and visible layers in square or wide format. The GIF has source/context labels; use the MP4 alternative where video works better.

Attention and LoRA drafts were also rewritten in a conversational voice. LoRA is reference material, not this edition's headline. The older attention/LoRA animations remain 15-second silent diagrams. No posts have been sent to social accounts.

## Product and community changes

See competitors.json and community.json for dated links and evidence labels. Higgsfield and OpenArt are priorities, with ElevenLabs covering voice. These are product announcements and community leads, not a hands-on ranking.

Reddit discovery used public/search-indexed threads and the last30days engine. Direct Reddit access was partially blocked; the engine yielded one relevant Reddit thread and mostly off-topic HN results. The shortlist uses separately reviewed search results. X and YouTube were not included in that scan. No continuous or exhaustive coverage is claimed.

# Weekly brief — 28 September 2026

## List 1: Frontier / SOTA candidates

This is a curated research shortlist, not an exhaustive leaderboard. New results are author-reported unless independently reproduced. All entries were checked on 28 September; some were released earlier in September.

| Priority | Research | Why it matters | Evidence boundary |
|---|---|---|---|
| 1 | [VS-Splat](https://arxiv.org/abs/2609.12343v1) | Object-aware allocation of Gaussian primitives in sparse-view reconstruction | Selected reconstruction benchmarks; no reproduction here |
| 2 | [BEACON](https://arxiv.org/abs/2609.13264v1) | Separates appearance from facial behavior conditioning | Facial-video datasets, not general film continuity |
| 3 | [LACI / Taming Long-form TTS](https://arxiv.org/abs/2609.16989v1) | Error recovery during long narration | Specific systems and long-prompt evaluation |
| 4 | [StepAudio 3 Gen](https://arxiv.org/abs/2609.12945v1) | Unified discrete audio generation | Technical report; independently comparable quality remains to be assessed |
| 5 | [ETA v2](https://arxiv.org/abs/2609.20888v2) | Adaptive block-sparse attention | Model/hardware/context-dependent results |
| 6 | [Parallelism in diffusion LMs](https://arxiv.org/abs/2609.20539v2) | Distinguishes diffusion formulations theoretically | Assumptions and forward-pass complexity are not deployment speed |
| 7 | [Frequency and pixel losses](https://arxiv.org/abs/2609.02748v1) | Different supervision for detail versus coarse structure | Early-month context; no reproduction |

IC-LoRA is retained separately as a 2024 foundation, not a frontier candidate.

## List 2: Fundamentals to turn into graphics

| Priority | Topic | Graphic and controls | Current status |
|---|---|---|---|
| 1 | Diffusion distributions | Colored mixture densities; signal/noise slider and play/pause | Implemented |
| 2 | 3D Gaussian splatting | Camera orbit, covariance ellipses, opacity compositing | Proposed next build |
| 3 | Identity versus motion | Separate reference channels across a temporal diagram | Proposed |
| 4 | Speech tokens and prosody | Token/codebook timeline; pauses and pitch contours | Proposed |
| 5 | Space/time attention | Frame–patch–text connectivity and masks | Basic masks implemented; video extension proposed |
| 6 | LoRA versus context | Rank slider and reference slots | Implemented |

Recommendation: next build the Gaussian projection/opacity explainer and pair it with VS-Splat. The current launch kit explains diffusion distributions, attention, and IC-LoRA. BEACON is a timely bridge from distributions to creative conditioning.

## Product and community changes

See competitors.json and community.json for verified links and evidence labels. Higgsfield and OpenArt are prioritized; ElevenLabs covers voice. These entries are dated product updates, not a ranking or hands-on product review.

Reddit discovery used public/search-indexed threads plus the last30days engine. Its direct Reddit endpoint was partially blocked; the engine returned only one relevant Reddit thread and several largely off-topic HN stories. The final shortlist uses separately reviewed search results instead of inflating those counts into comprehensive coverage. X and YouTube were not part of the engine scan. No continuous coverage is claimed.

## Publication status

Prepared drafts and original diagrams. Not posted to LinkedIn, X or Medium. No voice clone, paid generation run, model training or external benchmark reproduction was performed. The MP4 assets are silent 15-second captioned animations; a separate narration script is provided.

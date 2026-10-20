# Frontier Fieldnotes — 19 October 2026

Window: October 13–19, reviewed at 2026-10-20 02:16:57 UTC (October 19 Toronto). No expansion to older news needed. This list ranks editorial usefulness, not unrelated benchmarks.

**Recommended pairing: ResStreamGS × selective updates.** The new [interactive](https://kavehkamali.github.io/frontier-fieldnotes/stream.html) lets you break the update budget, see a stationary panel lose its changing color, and compare position-only with color-aware ranking. It is an analytic teaching scene; it does not reproduce the paper.

## 1. Frontier / SOTA watchlist

### 1. ResStreamGS: stop sending the whole scene every frame.

**15 Oct 2026 · v1** · [Primary source](https://arxiv.org/abs/2610.21121v1)

Caches stable splats per frame group; updates attribute-sensitive splats frame by frame.

**What changed:** October 15 v1, covered in the October 16 delta and carried into this weekly synthesis with a new original interactive. Not a new October 19 release.

**Evidence:** Author tests: six 300-frame sequences, held-out cameras, 20-frame groups. Against a controlled V3-style baseline: +7.51–8.35 dB PSNR and 21.4–56.5% lower amortized payload. 30.883 FPS on one Snapdragon 778G phone.

**Limits/access:** Payload is not wireless performance. Culling and pruning also improve speed. Abrupt changes challenge fixed groups; GIFStream has smaller payloads. Full paper reviewed; implementation not verified, no reproduction.

**For creators:** For captured volumetric scenes. Stationary splats can still need appearance updates.

### 2. TriFold: give irregular Gaussian scenes a regular latent space

**16 Oct 2026 · v1** · [Primary source](https://arxiv.org/abs/2610.23050v1)

A native Gaussian VAE maps variable-size scenes to triplane latents. Multiple learned slots preserve information when primitives collide in a projected cell; occupancy and set decoding recover adaptive local counts. A latent flow model supports point-cloud or single-image conditioning.

**What changed:** New to the archive this week. Original submission October 16; an October 19 aggregator date is not a revision.

**Evidence:** Author tests on InteriorGS and Aria/SceneSplat: approximately 19,600 crops plus 8,600 scenes, split before cropping. Reconstruction reports 26.55 dB PSNR versus GaussianGPT's 21.40 under the adapted common protocol. Generation is assessed within its own conditioning setup, without a matched cross-generator comparison.

**Limits/access:** Limited indoor-scene diversity and fixed physical crop scale constrain generalization. Unseen areas are plausible completions, not recovered truth. The local candidate count remains bounded; adaptive does not mean unlimited. Paper available. Official project page retrieval failed; code, weights and license availability not verified.

**For creators:** Relevant to generating explorable 3D set pieces from partial views, with a clear distinction between observed and invented geometry.

### 3. MOSS-Image: give the renderer a layout

**16 Oct 2026 · v1** · [Primary source](https://arxiv.org/abs/2610.23374v1)

A 5B DiT combines text and layout conditioning with an optional external prompt planner. Structured boxes make composition an explicit input.

**What changed:** Official repository dates Base/SFT code-and-weight release October 16. Paper v1 was submitted October 16; the repository's October 19 news entry announces arXiv availability, not a separate new model release.

**Evidence:** Authors report 96.3 Mean-6 on LLTB: 240 English/Chinese text tasks, four images each, all scored. The OCR multiset-recall metric ignores order and does not directly penalize extra text. RLA uses 61 design tasks and blind human preferences; MOSS ranks second among displayed end-to-end systems with an external planner. These are author-run evaluations, not an independent reproduction.

**Limits/access:** Current backbone is text-to-image, with no direct reference-image conditioning or image editing. Layout changes regenerate an image. The external planner can introduce factual/design errors. General superiority and reliable typesetting are unestablished. Public Base/SFT weights and inference code verified; SFT model card explicitly licenses weights and bundled inference code Apache-2.0. No generation run. Official defaults: 50 Euler steps, CFG 3, shift 5, negative-branch layer 22 skipping; 5B excludes the separate frozen 9B text encoder.

**For creators:** A practical candidate for editable poster/storyboard layout specifications. Review the rendered wording, not just visual appeal or OCR coverage.

### 4. FLUX 3 Image Klein: a box is a guide, not a mask.

**15 Oct 2026 · October 15 launch; base and distilled checkpoints** · [Primary source](https://bfl.ai/blog/flux-3-image-klein)

BFL releases a 5.6B image transformer with generation, editing and up to ten references. A 50-step base and 16-step distilled checkpoint expose bounding-box layout control.

**What changed:** October 15 launch, newly added to this weekly review; exact later checkpoint revisions were not verified.

**Evidence:** Vendor internal preference evaluations cover generation, editing and multi-reference tasks. NVIDIA reports 1 MP GPU timing; API comparisons time BFL server-side and competitors client-side. No independent reproduction here.

**Limits/access:** Boxes guide placement and scale, not hard masks; edits may affect other regions. API pixel restoration is a separate feature. Generator parameter count excludes the text encoder and prompt upsampler; headline 8 GB operation is configuration-specific. Public reference code and gated base/distilled HF repositories verified. FLUX Kommunity terms include a qualifying commercial-output exception below US$5M annualized revenue; not unrestricted commercial fine-tuning/distribution. No weights downloaded or inference run.

**For creators:** Useful for local layout-controlled edits and adaptation. Supply expanded scene captions and budget the whole pipeline, not just transformer weights.

### 5. Instant Soundtracks: keep music and effects editable.

**15 Oct 2026 · article updated 19 Oct · Launch / public API** · [Primary source](https://elevenlabs.io/blog/introducing-instant-soundtracks)

Video-conditioned music and timed effects arrive with separate editable tracks and optional reference to the video's existing audio.

**What changed:** October 15 release, carried into the weekly list from October 16's delta. Article updated October 19; no second launch inferred.

**Evidence:** Official feature announcement and API contract, with no quantitative synchronization benchmark or independent output test in this review.

**Limits/access:** Detection of a visual event does not guarantee perfect audio timing. API add_sfx, separate_tracks and use_audio_as_reference all default false; enabling separate tracks returns a ZIP. Vendor says available in ElevenCreative, ElevenMusic and API. API accepts up to ten videos, 200 MB and 600 seconds combined. No paid request or generation run.

**For creators:** Score an assembled edit, then correct effects or swap music without remaking the video. Compare event timing and sound quality separately.

### 6. Mirelo SFX 2.0: keep the take, rebuild the sound.

**14 Oct 2026 · 2.0** · [Primary source](https://mirelo.ai/blog/mirelo-sfx-2-0)

Video-to-sound generation replaces unwanted audio with Foley and ambience across cuts, while retaining the spoken performance.

**What changed:** October 14 launch, newly discovered in this review; Runway MCP integration is dated October 15.

**Evidence:** Vendor blind test: 25 screened raters judged 30 videos per comparison. Against Seedance 2.5 native audio: 47% preferred Mirelo, 28% native, 25% ties. The 72% headline includes ties.

**Limits/access:** The FAQ says speech is regenerated, not guaranteed waveform-preserved. Tests are vendor-run and scoped to selected clips. A separately controlled stem variant is still coming soon. Studio, API, MCP and selected partner access announced; up to ten-minute edits in Studio/API. Weights not verified; no listening or generation test.

**For creators:** A finishing pass for an assembled scene; audition dialogue fidelity and ambience continuity before replacing the source audio.

### 7. ORL: train a diffusion LM on its own unfinished predictions

**14 Oct 2026 · v1** · [Primary source](https://arxiv.org/abs/2610.20687v1)

ORL replays residual predictions encountered by the current model and adds adjacent entropy contraction, training each refinement to resolve uncertainty faster. A specialized runtime turns parallel commitments into lower single-request latency.

**What changed:** New October 14 paper; first archive coverage.

**Evidence:** Qwen-derived 4B model plus LLaDA-2.1-mini and DiffusionGemma. Main suite: GSM8K, MATH-500, HumanEval and MBPP. Author claims up to 6.2x tokens per forward and about 6.9x throughput including dlmrt. Single-request H100 measurements; cross-family literature rows are not scorer-matched.

**Limits/access:** The 1,298 versus 746 tokens/s DFlash comparison uses relaxed verification at selected matched accuracy. Strict autoregressive speculation retains accuracy 2.4 points higher. Base/ORL comparisons include selected decoders; throughput is not a universal model-only gain or a lossless guarantee. MIT training/evaluation repository and separate DLMRT runtime are public. Reproducing paper training requires its included Triton kernel; integration of newer kernels remains in progress. Checkpoints and execution not verified.

**For creators:** Relevant to interactive local assistants and editing agents where one request blocks the next; bulk serving remains a different workload.

### 8. Kandinsky S2V: compressed visual memory for speech-driven avatars

**13 Oct 2026 · v1** · [Primary source](https://arxiv.org/abs/2610.19290v1)

2B and 21B models combine image, speech and text with three-scale visual history. Older frames use coarser tokens; five-second chunks retain a bounded memory. Distilled variants reduce 100 network evaluations to 16.

**What changed:** October 13 technical report, first archive coverage. Do not equate the paper date with independently verified checkpoint availability.

**Evidence:** Author evaluation uses 50 clips each from EMTD, CelebV-HQ and HDTF, plus 80 Russian and about 140 multilingual human-comparison cases. Distilled Pro leads aggregate benchmark ranks; individual metrics and human criteria differ.

**Limits/access:** Pro trails HeyGen and LongCat in multilingual visual quality; Lite loses some lip synchronization after distillation. The claimed 5.4x speedup uses eight H100s, resident weights and compilation. Ordinary per-chunk timing differs; not real-time generation. Official paper/project page claim MIT code, checkpoints and Diffusers integration. Linked GitHub and model retrieval failed, so downloadable availability and licensing were not independently verified.

**For creators:** A candidate for speech-driven character shots and dubbing research, with lip-sync quality assessed separately from image quality and identity.

## 2. Fundamentals worth making visible

### 1. Keep the scene. Send the changes. — Interactive ready

Scrub a synthetic 3D set beside its cached approximation. Compare a position-only ranking with position-and-color ranking; watch a stationary surface go stale.

**Controls:** Update budget, frame-group length, time, ranking, color-change toggle, orbit; one-click PNG/GIF in square or wide format.

**Misconception:** Stationary means unchanged, or caching a splat removes its rendering cost.

**Recent connection:** [ResStreamGS · 15 Oct 2026. Implemented analytic scene. Known synthetic trajectories rank updates; not its learned probe, training, codec or mobile benchmark. Record counts are not compressed bytes.](https://arxiv.org/abs/2610.21121v1)

### 2. One cell can contain several things — Proposed

Project colored splats onto three planes. Compare mean pooling with a toy multi-slot assignment and occupancy-controlled decoding.

**Controls:** Collision density, slots per cell, attention temperature, occupancy threshold and candidate cap; planned PNG/GIF.

**Misconception:** One pooled feature preserves every overlapping primitive, or adaptive output counts are unlimited.

**Recent connection:** [TriFold · 16 Oct 2026. Proposed analytic pooling illustration, no learned encoder or generated scene.](https://arxiv.org/abs/2610.23050v1)

### 3. All the words can be present—and still be wrong — Proposed

Drag colored layout boxes and compare exact-string accuracy with multiset OCR recall on a deliberately reordered sentence.

**Controls:** Text, line breaks, duplicate/extra words, canvas ratio, coordinate system and box overlap; planned PNG/GIF.

**Misconception:** A high text-coverage score means every word is correct and in the right place.

**Recent connection:** [MOSS-Image · 16 Oct 2026. Proposed layout/metric lab; no generated poster or model inference.](https://arxiv.org/abs/2610.23374v1)

### 4. A box tells the model where. A mask enforces where. — Proposed

Drag a conditioning box over a synthetic image. Compare soft spatial influence with hard compositing and measure outside-region change.

**Controls:** Box size/location, influence falloff, hard-mask toggle and restoration stage; planned PNG/GIF.

**Misconception:** Bounding-box conditioning guarantees unchanged pixels outside the box.

**Recent connection:** [FLUX 3 Image Klein · 15 Oct 2026. Proposed analytic influence field, not measured model leakage.](https://bfl.ai/blog/flux-3-image-klein)

### 5. An event, a sound, and a preserved voice are different tests — Proposed

Scrub video-event, dialogue, music and Foley lanes. Compare alignment, per-track editability and waveform differences independently.

**Controls:** Offset in milliseconds, mute/solo, cut position, ambience continuity and regenerated-dialogue toggle; planned PNG/GIF and synthetic audio.

**Misconception:** Synchronized audio is necessarily editable, or preserved dialogue means identical samples.

**Recent connection:** [Instant Soundtracks · 15 Oct; Mirelo SFX 2.0 · 14 Oct 2026. Proposed synthetic timeline; no vendor outputs.](https://mirelo.ai/blog/mirelo-sfx-2-0)

### 6. Less uncertainty does not guarantee a better answer — Proposed

Track categorical predictions through refinement, showing entropy and correctness separately, including a confidently wrong trajectory.

**Controls:** Residual strength, contraction target, policy refresh interval, shift and update size; planned PNG/GIF.

**Misconception:** Entropy contraction proves correctness, or system throughput isolates a training-method improvement.

**Recent connection:** [ORL · 14 Oct 2026. Proposed synthetic dynamics; not an ORL training or speed reproduction.](https://arxiv.org/abs/2610.20687v1)

### 7. Spend detail on recent frames — Proposed

Pack recent and older frame tiles into different-resolution memory buckets while tracking identity reference and lip timing.

**Controls:** History length, patch scale by age, chunk boundary, detail frequency and audio offset; planned PNG/GIF.

**Misconception:** Bounded visual memory guarantees unlimited identity consistency, or fewer model calls equal proportional end-to-end speedup.

**Recent connection:** [Kandinsky S2V · 13 Oct 2026. Proposed memory schematic; no generated avatar.](https://arxiv.org/abs/2610.19290v1)

### 8. The right token can be the wrong next step — Proposed

Show a commit-order tree and fresh target verification, counting both forward batches and candidate states.

**Controls:** Branch width, stale/fresh shift, temperature and shared sampling noise; planned PNG/GIF.

**Misconception:** A correct token at the wrong position is an acceptable draft, or fewer forward calls means less total work.

**Recent connection:** [SPOT · 15 Oct 2026. Proposed synthetic categorical verifier. Exactness excludes the paper's approximate-cache transfer rows.](https://arxiv.org/abs/2610.22543v1)

## Competitor changes and practical dates

- **Higgsfield · FLUX 3 Video Upscaler build updated — 15 Oct 2026 · changelog; newly found this review.** A new upscaler build automatically replaces the previous one. Higgsfield attributes detail improvements to BFL and claims shorter processing and fewer credits. Retest matching footage before assuming a quality/cost gain. Exact rates are shown before generation; no measured comparison or output test here. [Source](https://higgsfield.ai/creator-hub/changelog)

- **OpenArt · Mirelo SFX 2.0 listed — Observed 19 Oct 2026 · exact integration date unknown.** Official model page and directory now list Mirelo SFX 2.0 for video sound replacement and dialogue-focused output. The underlying Mirelo release is October 14. A new listed option for finishing audio inside OpenArt. Credits, plan availability and output were not tested; don't infer the integration date from this observation. [Source](https://openart.ai/ai-model/mirelo-sfx-2-0/)

- **Runway · Mirelo SFX 2.0 and Drama 3 in MCP — 15 Oct / 14 Oct 2026 · paid plans.** Runway dates Mirelo SFX 2.0 integration October 15, producing a separate audio track. Drama 3 directed voiceovers arrived October 14; BiRefNet v2 background removal October 15. These are access/integration changes, not new underlying model launches. No request, timing or sound-quality test was performed. [Source](https://runway.com/changelog)

- **ElevenLabs · Instant Soundtracks — 15 Oct 2026 launch · page updated 19 Oct.** Video-conditioned scoring and SFX can be exported as separate tracks. The October 19 page edit does not establish a second feature release. A useful counterpart to Mirelo's audio replacement. Test synchronization separately from sound quality; no independent comparison here. [Source](https://elevenlabs.io/blog/introducing-instant-soundtracks)

- **ComfyUI · MOSS support and crash fix — 18 Oct v0.42.0 · 19 Oct v0.42.1.** Version 0.42 adds MOSS-image support and a Krea 3 partner node. The next patch fixes a MOSS-template crash for some users. Model access and integration maturity are separate checks. No local upgrade or generation run performed. [Source](https://github.com/Comfy-Org/ComfyUI/releases/tag/v0.42.1)

- **Adobe · Lightroom mobile gets Open Eyes and Generative Expand — 19 Oct 2026 · announcement.** Adobe introduces a blink-correction quick action and image outpainting on mobile. Open Eyes can use other library photos to guide eye appearance. Useful for portrait repair and reframing assets. Vendor-described availability and quality; no image test. This is a workflow release, not a comparative SOTA result. [Source](https://blog.adobe.com/en/publish/2026/10/19/give-your-photos-a-second-chance-with-open-eyes-in-lightroom-on-mobile)

- **Cartesia · previously reported Sonic sunset is imminent — July 2026 notice · sunset after 20 Oct; rechecked 19 Oct.** Current changelog still names Sonic-2, Sonic-turbo and Sonic-3-2025-10-27 for retirement after October 20. Reminder for affected integrations, not new news. Exact cutoff time/timezone is unspecified; no account use inspected. [Source](https://docs.cartesia.ai/changelog/2026)

- **Higgsfield · previously reported API migration — Deadline 31 Oct 2026 · rechecked 19 Oct; notice date unknown.** Official status banner still requests migration from platform.higgsfield.ai to api.higgsfield.ai. If affected, check application, SDK and environment base URLs. Last-updated status time is not the notice publication time. [Source](https://status.higgsfield.ai/)

- **Legacy Luma Ray 2 nodes · October 24 endpoint removal — 02 Oct 2026 Comfy change · discovered 14 Oct; removal 24 Oct · prior notice retained.** Comfy's merged deprecation change and legacy-node guides say the Ray 2 endpoints used by its old image/text-to-video nodes are removed October 24. The guides point to separate Ray 3.2 nodes. Inspect saved workflows for legacy nodes before the deadline. This is Comfy's integration guidance; Luma-owned confirmation and a drop-in migration were not verified. Do not infer all Luma services are ending. [Source](https://docs.comfy.org/tutorials/partner-nodes/luma/luma-image-to-video)

- **Hume · TTS and EVI API sunset — 02 Oct 2026 · notice; discovered 12 Oct · prior notice retained.** Hume says TTS and EVI API access ends 13 November 2026 at 12:01 a.m. EST. Account data will be permanently deleted after 13 November. An older notice missing from the previous review, not a new launch. Workflows using these APIs need a replacement and a plan for needed account data before the deadline. The notice says both APIs remain fully supported until then. [Source](https://dev.hume.ai/voice/changelog)

## Publishing kit and verification

LinkedIn, X and Medium drafts accompany original captioned PNG/GIF/MP4 and the interactive. Browser exports preserve current settings; all new proposals are labeled. No social publishing or purchased generation. See source-coverage.md for access gaps and validation notes.

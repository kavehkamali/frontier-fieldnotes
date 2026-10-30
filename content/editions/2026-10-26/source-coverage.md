# Source coverage · 26 October 2026

> **30 October follow-up:** [daily delta](delta-2026-10-30.md) adds L3G-World, SonoWorld4D, Pika H3 Flex, SFX v3 and Phonon v0.6.0; the OpenArt deadline now has conflicting official sources. All new visuals are proposals. The original weekly snapshot is preserved.

> **29 October follow-up:** [daily delta](delta-2026-10-29.md) covers artifact releases, voice controls and OpenArt retirement limits. The original weekly snapshot below is preserved.

> **28 October follow-up:** [new research and workflow delta](delta-2026-10-28.md), including an App Studio date-metadata correction. This document remains the original weekly snapshot.

> **27 October correction:** the Direct Forcing availability/version assessment in this original snapshot was incomplete. See the [dated delta](delta-2026-10-27.md) for verified public code, paper v2 and subsequent release checks.

The weekly window is **19–26 October 2026**, ending at **20:27:37 UTC on 26 October**. The daily-change comparison starts at **23 October, 23:01:00 UTC**. The previous weekly edition and its 20/23 October deltas were read before selecting topics. This is a bounded research pass, not continuous or exhaustive monitoring.

The editorial scope is 3D Gaussian splatting, image/video generation, voice/audio generation, AI filmmaking, diffusion language models and related learning mechanisms. Robotics and physical AI are excluded. No generated model output was requested, no model files were downloaded or executed, no services were purchased, and no social accounts were published to. Browser cookies and account setup were not accessed.

## Freshness ledger

| Item | Verified source date | What this edition adds |
| --- | --- | --- |
| LLaCO | arXiv v1, 23 Oct 13:28:40 UTC | Newly covered, but predates Friday’s cutoff. No later paper revision verified. |
| FastH3 Omni | 20 Oct announcement/model-card finalization, 18:34:38 UTC | Newly covered release documentation. Repository and file history begin 5/8 Oct; not a new 26 Oct checkpoint. Earlier public visibility is unknown. |
| Direct Forcing | arXiv v1, 22 Oct 07:41:41 UTC | Newly covered paper, submitted before Friday’s review. |
| UniVOE | arXiv v1, 22 Oct 17:54:03 UTC; weight files 21 Oct | Newly covered paper/artifact distinction. Model-card update 23 Oct 14:10:58 UTC is not the original weight release. |
| SplatFlux | arXiv v1, 20 Oct 14:12:53 UTC | Explicit carryover from Friday’s delta; no new revision. |
| Ideogram Vector on Higgsfield | Host changelog: 23 Oct, exact UTC unknown | Newly discovered integration. A secondary 22 Oct original-launch date was not backed by a retrieved dated primary announcement. |
| Phonon v0.4.1 | Published 24 Oct 08:09:35 UTC | Verified after-Friday release. GitHub created_at is earlier, 21 Oct; publication date is used. |
| Phonon v0.4.2 | Published 25 Oct 20:07:06 UTC | Verified after-Friday release; runtime support changes, not new voice weights. |
| Runway App Studio | Changelog: 23 Oct, exact UTC unknown | Newly discovered workflow launch. Cannot place it after Friday’s exact cutoff. |

No October 24–26 launch is invented to fill the watchlist. The list is a weekly synthesis of meaningful in-window research and features; Phonon has the clearly verified post-Friday releases. Paper dates, model uploads, card edits, hosting integrations and discovery dates are separate events.

## Primary research and artifact checks

**LLaCO.** Read the [submission history](https://arxiv.org/abs/2610.32604), [full paper](https://arxiv.org/html/2610.32604v1) and [official repository](https://github.com/WhenGIX/LLaCO). The current repository has a report and assets; inference code, training code and LLaCO-8B weights remain unchecked TODOs. Its latest checked README commit is `624db2758e58b4d172eb6e504bb79a275c398f70`, 23 October 11:23:46 UTC. A repository license does not verify a future checkpoint’s license. The project-site fetch did not return readable content. Nine author-run benchmark comparisons are scoped to the named diffusion baselines; no universal language-model ranking or throughput result is inferred.

**Direct Forcing.** Read [history](https://arxiv.org/abs/2610.30861) and [full methods, evaluation and limitations](https://arxiv.org/html/2610.30861v1). The 250 updates are post-training, not training from scratch. Four evaluations are per causal chunk. VBench results, hardware, sample count and semantic-score tradeoff remain explicit. No official runnable code, weights or associated artifact licenses were verified. Other methods’ cited results and shared timing figures are not treated as a new independent head-to-head run.

**UniVOE.** Read [history](https://arxiv.org/abs/2610.31641), [full paper](https://arxiv.org/html/2610.31641v1), the [Hub model card](https://huggingface.co/Ysz2022/UniVOE) and public file/commit metadata. The web tool did not fetch the Hub page, but unauthenticated metadata and the [raw README](https://huggingface.co/Ysz2022/UniVOE/raw/main/README.md) were retrievable. The first checked injection file upload is 21 October 11:20:11 UTC; removal files followed that day. The latest card update is 23 October 14:10:58 UTC, commit `fd037cfaa4a8e54896c6b5760ae8bc86dc8a96c6`. The [linked code repository](https://github.com/Tencent-Hunyuan/UniVOE) returned 404. The card metadata says Apache-2.0, while its license section remains a placeholder. No unrestricted commercial-use assurance is given. The proprietary reward model and selected evaluation comparisons limit reproducibility and generalization.

**SplatFlux.** Rechecked [submission history](https://arxiv.org/abs/2610.28257) and the [project page](https://rm-zhang.github.io/SplatFlux/). The paper remains v1 from 20 October. Detailed methods/evaluation from [Friday’s full-paper review](https://arxiv.org/html/2610.28257v1) are retained. Current project extraction was sparse; no runnable code, weights or license were verified. Video proxy scores, reconstruction and generation are not collapsed into one 4D ranking.

**FastH3 Omni.** Checked the [official methodology/benchmark announcement](https://haoailab.com/blogs/fastvideo-omniref-update/), [model card](https://huggingface.co/FastVideo/FastVideo-FastH3-Omni-8-Step-V1), public Hub history and the [runtime repository](https://github.com/hao-ai-lab/FastVideo). The repository existed on 5 October and files were reuploaded on 8 October; the release card and local recipes were finalized on 20 October. Complete-serving latency includes encoding and MP4 production. Different recipes, precision choices and hardware prevent an isolated distillation or consumer-GPU conclusion. Qualitative examples do not establish quality parity. Public artifacts use the MiniMax-H3 community license. The owner’s MiniMax-H3 Turbo 8 preference is unchanged; this review performs no video generation.

**Phonon.** Checked [v0.4.1](https://github.com/gradium-ai/xn-ptts/releases/tag/v0.4.1), [v0.4.2](https://github.com/gradium-ai/xn-ptts/releases/tag/v0.4.2), exact public GitHub publication metadata and existing [31M](https://huggingface.co/gradium/phonon-31m-en)/[40M](https://huggingface.co/gradium/phonon-40m-en) cards. The new normalization API can run without loading a model. v0.4.2 adds decoder/platform support and regression checks. Attached CoreML/QNN bundles are explicitly unchanged from v0.4.0. Word-recovery CI is not a perceptual voice-quality or prosody study. Licensing remains different across model sizes; no gated access terms were accepted.

Discovery also considered DConstrain, task/language-dependent diffusion-model speed, and SyncVid. Their full reviews were not completed, so they were not promoted as verified findings. Broader arXiv listing dates were not substituted for submission dates.

## Competitors and product coverage

| Source | What was checked | Result and limit |
| --- | --- | --- |
| [Higgsfield changelog](https://higgsfield.ai/creator-hub/changelog) | Dated entries, current model listings and status banner | Ideogram Vector integration dated 23 Oct selected. Content Factory 22 Oct and Kling 4.0 21 Oct are retained. Kimi integration and promotions were lower editorial priority. Exact release UTCs unavailable. |
| [Ideogram Vector](https://ideogram.ai/models/vector/) and [generation API](https://developer.ideogram.ai/api-reference/vectors/generate-svg) / [vectorization API](https://developer.ideogram.ai/api-reference/vectors/image-to-svg) | Output format, request inputs and conversion modes | Official feature contracts verified; no generated output, quantitative comparison, editable-text guarantee or original launch timestamp established. |
| [OpenArt Kling listing](https://openart.ai/ai-model/kling-4-0/) | Current English instructions, blog and [What’s New](https://openart.ai/suite/whats-new) | Listing retained, integration date unknown. What’s New exposed navigation only. Tutorial dates do not establish feature-launch dates. No Ideogram Vector integration verified. |
| [Kling-owned site](https://klingai.com/) | Underlying vendor page | Robots restriction. Hosting listings are evidence of host availability/specifications, not a retrieved underlying model report. |
| [Higgsfield Kling API](https://open.higgsfield.ai/models/kling-video/v4.0/text-to-video/playground) and [introduction](https://higgsfield.ai/kling-4-0-intro) | Dated HD specs versus undated 4K/HDR marketing | Conflict persists. No 4K access promise or universal quality claim; no output or usable-shot cost test. |
| [Runway changelog](https://runway.com/changelog) and [App Studio guide](https://help.runwayml.com/hc/en-us/articles/56447349336467-Building-apps-with-App-Studio) | Launch date, paid access, credits, audience, export and lifecycle | 23 Oct workflow release verified. Guide says no delete/unpublish control. No app was built; portability beyond published source ZIP was not tested. |
| [ElevenLabs changelog](https://elevenlabs.io/docs/changelog) and [product announcements](https://elevenlabs.io/blog/category/product) | Realtime and Translation dates | 19 Oct changelog grouping differs from 20/21 Oct announcement dates. No additional post-Friday launch verified. Prior scoped independent evidence is retained, not a new listening/latency evaluation. |
| [Luma news](https://lumalabs.ai/news) and [changelog](https://lumalabs.ai/changelog) | New-release coverage | News fetch failed with unsupported content; readable changelog was stale. No conclusion of inactivity. Legacy Ray 2 enforcement remains unverified. |
| [Pika blog](https://pika.art/blog) | Dated releases | Latest dated release found was 16 Oct, outside the seven-day window. Undated navigation is not launch-date evidence. |
| [Adobe blog](https://blog.adobe.com/en) | Official-domain recent queries | 19 Oct Lightroom changes were already covered. No additional date-verified feature promoted; coverage is not exhaustive. |
| [Cartesia changelog](https://docs.cartesia.ai/changelog/2026) | Current release sections and prior Sonic sunset | No additional new release verified. The previously announced after-20-Oct deadline has passed, but actual shutdown or outage is not inferred. |

[Higgsfield’s API migration](https://status.higgsfield.ai/) remains a **31 October** reminder; the original notice date is unknown, and the status update timestamp is not its publication date. [Comfy’s legacy Luma guidance](https://docs.comfy.org/tutorials/partner-nodes/luma/luma-image-to-video) had a **24 October** removal date; neither enforcement nor a drop-in migration was verified. The [Hume notice](https://dev.hume.ai/voice/changelog), originally 2 October, is retained from earlier verified coverage for the **13 November** deadline; it was **not rechecked in this pass**. No user integration or account data was inspected.

## Public Reddit discovery

The last30days skill instructions and relevant environment/config behavior were reviewed. Its public-only Reddit route was run in a minimal environment, with browser fallback disabled and no credential configuration or keychain access. Python 3.9 was incompatible; a Python 3.14 rerun completed with zero items and a DNS/listing-access error. That failure is not evidence of an inactive community. Search-indexed public Reddit supplied the fallback, with partial coverage and often no exact UTC post times.

| Community | Coverage and treatment |
| --- | --- |
| r/StableDiffusion | Recent demo/LoRA discussions surfaced; no additional date-verified primary release selected. Turbo 8 user reports remain anecdotes. |
| r/LocalLLaMA | Phonon, TTS comparisons and Kokoro speedup discussions surfaced. Phonon’s new runtime versions were verified from primary release metadata. |
| r/MachineLearning | Older ORL material dated 16 Oct surfaced and was excluded as fresh weekly news. |
| r/GaussianSplatting | A 25 Oct Quake/PlayCanvas public-code follow-up was checked against its repository. It is a rendering/workflow lead, not generative-3D SOTA. |
| r/comfyui | FastH3 Omni’s 20 Oct author announcement led to primary verification. An agent-generated music-video claim dated 26 Oct was deferred because exact cutoff membership and reproducibility were not established. |
| r/generativeAI | Questions and promotions predominated in returned results; automated recommendation comments were excluded as evidence. |
| r/HiggsfieldAI | No additional date-verified relevant lead found in indexed results. This is incomplete coverage, not proof of no activity. |

Selected discussion records are in [community.json](community.json). The [FastH3 announcement](https://www.reddit.com/r/comfyui/comments/1xb2xz6/fasth3_omni_is_out_with_day0_comfyui_support_open/) is author-supplied; comments contain uncontrolled timing and quality reports. The [earlier Phonon thread](https://www.reddit.com/r/LocalLLaMA/comments/1xaw2vt/phonon_is_now_opensource_31m_and_40m_tts_models/) remains a discovery pointer, not independent validation of versions released days later. The [Quake splat-map follow-up](https://www.reddit.com/r/GaussianSplatting/comments/1xext2v/quake_3_with_gaussian_splatting_follow_up_post/) links a [public work-in-progress repository](https://github.com/Loppas/playcanvas-quake3), with user-supplied game assets and unfinished behavior; no gameplay benchmark was run.

The Kokoro “50–100×” headline, “best TTS” preferences and the agent-created music video were not promoted as results. Upvotes, repeated cross-posts, promotional claims and uncontrolled demos do not establish independent performance evidence. No private or login-only communities were accessed.

## Attribution, visuals and publishing

- **Paper/author results** remain attributed and limited to their tasks, baselines, hardware and sample counts. None was independently reproduced in this pass.
- **Vendor claims** describe documented features and availability. They do not establish quality, production reliability or measured usable-shot cost.
- **Community reports** are discovery signals and anecdotes. They are not converted into benchmark claims.
- **Creator implications and visual ideas** are editorial interpretations, separate from source results.

The LLaCO-linked presentation is an original synthetic geometry lab. Token rank is calculated in the full vector dimension; the two-dimensional projection is for display. Pairwise threshold algebra is distinct from high-dimensional statistical assumptions. The toy semantic schedule is not the paper’s calibrated 8B schedule. No learned embedding, denoiser, text generation, experimental language-model result or paper reproduction is claimed. Other queued visuals remain proposals. The presentation keeps light surfaces, minimal layout and restrained explanatory color.

The publishing kit is prepared for the owner to review and post. Existing editions preserve their original dates and human edits. Only project content and original teaching assets are eligible for the authorized repository publishing path; no credentials, private company information, account changes or social publication are part of this review.

## October 27 follow-up

The original review above remains a dated snapshot. Its Direct Forcing availability/version assessment is corrected in [the October 27 delta](delta-2026-10-27.md), which also records fresh release timestamps, unchanged checks and access gaps. Current structured watchlists distinguish updated records from those last checked October 26.

### October 28 follow-up

The [daily delta](delta-2026-10-28.md) and [structured source coverage](delta-watchlist-2026-10-28.json) record new research, artifact availability, competitor changes, public Reddit limitations and voice exclusions. Current App Studio changelog metadata is October 26; earlier October 23 observations above remain historical. No new launch is inferred from that edit.

### October 29 follow-up

See the [dated review](delta-2026-10-29.md) and [structured watchlist](delta-watchlist-2026-10-29.json) for source-access gaps, partial Reddit coverage, commit/public-availability distinctions and newly discovered older documentation. No new paper submission, model run or independent reproduction was established.

# October 12 weekly source coverage

The same-day delta scan below is reused; it was completed immediately before this weekly edition. Further weekly research follows it. Descriptions of proposed graphics below refer to the delta stage; the periodic-motion lab is now implemented in this edition.

# Product delta checked 12 October 2026

Scope: changes since the October 5 edition, prioritizing dated primary evidence. Three product additions and two community leads are reflected in the watchlists. Research used public sources without account changes, cookies, purchases or generation runs. Hume's older October 2 sunset notice is covered in the [dated delta](../2026-10-05/delta-2026-10-12.md).

## Three additions

- **Higgsfield Ad Multiplier — October 6 release and blog.** A visual interface in Ads Studio adds reference-video ad variations. Treat this as a workflow expansion, not a new foundational model. Availability is vendor-documented; structural fidelity is untested. [Announcement](https://higgsfield.ai/blog/ad-multiplier-ads-studio), [changelog](https://higgsfield.ai/creator-hub/changelog).
- **Higgsfield Katana — October 8 release, October 12 guide.** Preset-driven reference-image edits through Claude/MCP are now documented. Worth tracking as an integration for repeatable motion styles. Do not date the launch from the later tutorial or imply an independent quality result. [Release](https://higgsfield.ai/creator-hub/changelog), [later guide](https://higgsfield.ai/blog/higgsfield-katana).
- **ElevenCreative Brand Kit — published October 9, updated October 12.** Shared visual assets/rules work across Image & Video, Flows and its agent. The announcement says available now; voice and sound are future work. This is a visual-production feature, not a speech-model improvement. [Primary announcement](https://elevenlabs.io/blog/introducing-brand-kit).

## Correct the older Higgsfield date labels

The official changelog distinguishes releases from the blog dates used in the October 5 watchlist:

| Existing item | Release date | Blog date already recorded |
| --- | --- | --- |
| AI Influencer | **October 2, 2026** | October 3, 2026 |
| Ads Studio | **September 30, 2026** | October 1, 2026 |

Keep both dates rather than presenting either as a new October 12 event. [Dated release entries](https://higgsfield.ai/creator-hub/changelog).

## Community leads, with evidence boundaries

**ComfyUI 0.39.0:** an [October 6 H3 roundup](https://www.reddit.com/r/comfyui/comments/1wz9gmw/a_quick_minimax_h3_news_roundup_6th_october_2026/) links a useful local-video update. The [official release](https://github.com/Comfy-Org/ComfyUI/releases/tag/v0.39.0) is dated October 5 at 22:49 in the retrieved page (timezone not exposed). It verifies VAE offload/memory fixes and Save Video defaults. No measured memory saving or quality advantage was established here.

**H3 long-take refinement:** this [r/StableDiffusion discussion](https://www.reddit.com/r/StableDiffusion/comments/1x0nbr5/h3_degradation_my_turn_attempts_to_fixing/) led to [public author code and workflow](https://github.com/xyzDist/H3-LongTakeNoCuts). The author documents background changes, dissolves and audio problems alongside the proposed refinement. Useful for continuity tradeoffs, not a validated fix. Found October 12; exact post/release date was not independently confirmed.

## Coverage and exclusions

| Source | Result or limitation |
| --- | --- |
| Higgsfield | Dated official changelog and selected blogs read. Contests and promotions excluded. Nano Banana 2.1 integration was visible but not promoted without checking the underlying model announcement. |
| OpenArt | [Blog index](https://openart.ai/blog/) and dated October guides checked. An [October 12 cinematic-video guide](https://openart.ai/blog/how-to-create-multi-cut-cinematic-ai-videos/) is not proof of a new feature launch. The public [what's-new page](https://openart.ai/suite/whats-new) yielded no readable entries; indexed home-page promotions lacked a verified launch date. **No additional dated product release established.** |
| Runway | [Changelog](https://runway.com/changelog) retrieved; newest relevant listed release remained October 2, already covered. |
| ElevenLabs | Brand Kit verified above. Office expansion, customer stories and agent-building news excluded from the creative-media delta. |
| Cartesia / Pika | [Cartesia blog](https://www.cartesia.ai/blog) and [Pika blog](https://pika.art/blog) checked; no fresh creative capability established in this pass. |
| Luma / Kling / Adobe | Luma news returned unsupported content type; Kling official access was robots-blocked. Official-domain searches did not establish a fresh relevant Adobe release. Coverage is incomplete, not evidence these vendors were inactive. |
| r/comfyui | October 6 roundup selected; October 11 roundup had additional author nodes not individually verified. |
| r/StableDiffusion | Experimental long-take lead selected, with date and reproduction gaps retained. |
| r/GaussianSplatting | [October 6 weekly roundup](https://www.reddit.com/r/GaussianSplatting/comments/1wz2p56/weekly_wrap_up_of_gaussian_splatting/) surfaced, but direct retrieval failed. Older orbit-to-splat discussion was already covered; no new technical claim promoted. |
| r/LocalLLaMA | [October 7 LFM discussion](https://www.reddit.com/r/LocalLLaMA/comments/1wzuto0/new_lfm_to_be_released_today/) was a speculation lead; no fresh relevant creative release verified through it. |
| r/MachineLearning | [October 2 self-promotion thread](https://www.reddit.com/r/MachineLearning/comments/1wvi1j8/d_selfpromotion_thread/) had later comments. A fresh comment is not a newly published thread; no selected creative release. |
| r/generativeAI | [October 10 album workflow](https://www.reddit.com/r/generativeAI/comments/1x2p5mt/i_didnt_release_this_album_my_ai_assistant_did/) surfaced. Automated comments were excluded as sentiment evidence; no primary product release promoted. |

The last30days public-only engine ran with a clean environment, browser access disabled and no credential setup. Reddit retrieval hit DNS failures; Reddit and Hacker News returned **zero usable engine items**, not proof of no news. Indexed web searches supplied the Reddit leads above. No X, YouTube, TikTok or Instagram evidence was gathered. Do not report this as exhaustive community coverage or infer sentiment from automated replies.

# Frontier Fieldnotes — 12 October 2026 research delta

Two research additions, two revision records and a WINGS carryover check inform the updated [research watchlist](../2026-10-05/research.json) and [graphics queue](../2026-10-05/queue.json). Original October 5 lists are preserved in dated snapshots. No model runs or new interactive implementation were performed.

## Recommended additions

**[OuroWorld](https://arxiv.org/abs/2610.12461v1)** is the strongest next graphic pairing. The official [repository](https://github.com/youzhe0305/OuroWorld) contains implementation and run instructions. Its bounds and access requirements are in the JSON record. Avoid converting the title's “any world” into an established unrestricted-camera claim.

**[SepGen](https://arxiv.org/abs/2610.11361v1)** is the stronger new filmmaking workflow story: an addressable soundtrack. The official [repository](https://github.com/AviadDahan/SepGen) contains inference, training and a moving-camera demonstration. Distinguish the paper's evaluated separation/generation claims from that demonstration's spatial rendering. The authors' ablations find that caption/audio information drives separation; do not claim precise visual grounding is established.

| Item | First submission UTC | Latest revision UTC | Treatment |
|---|---|---|---|
| OuroWorld | 8 Oct 2026, 17:59:46 | None; v1 | New research |
| SepGen | 8 Oct 2026, 06:51:59 | None; v1 | New research |
| Custom Forcing | 2 Oct 2026, 07:04:09 | 5 Oct 2026, 05:25:58; v2 | Correct prior version record |
| ID-Forcing | 2 Oct 2026, 10:40:49 | 7 Oct 2026, 14:51:16; v2 | Version-record update |
| WINGS | 29 Sep 2026, 15:27:34 | None; v1 | Carryover |

Version sources: [Custom Forcing history](https://arxiv.org/abs/2610.02914), [ID-Forcing history](https://arxiv.org/abs/2610.03120), [WINGS history](https://arxiv.org/abs/2609.37816). The first correction predates the October 5 edition cutoff of 13:01:52 UTC; do not label it a new October 12 result. Full v1–v2 text differences were not established. Failure to fetch project sites does not prove code is unavailable.

## Graphic implementation guidance for a future run

**Periodic deformation:** Fourier basis features give f(t+T)=f(t). A deterministic decoder of those features inherits the same period. A toy can expose harmonics, endpoint position and derivative continuity. Do not imply periodicity ensures physically correct dynamics. When exporting, use a fixed or periodic camera path and sample one cycle without duplicating the endpoint frame. A periodically deforming scene can still produce a non-looping video if the camera does not return. Show the grounded drift as an explanatory nuisance component used during fitting, not as real observed geometry. The existing static WINGS graphic remains distinct. [Paper method](https://arxiv.org/html/2610.12461v1), [implementation context](https://github.com/youzhe0305/OuroWorld).

**Gated attention:** for query/key order (stem 1, stem 2, mix), the audio attention mask is [[1,1,1],[1,1,1],[0,0,1]]. A zero mix-token adapter gate is separately necessary: an adapter shared across token projections could otherwise change the protected stream despite the mask. A browser toy can calculate finite-dimensional attention and show an exact unchanged-mix invariant with both controls enabled. It should not generate fake audio-quality scores. Two synthetic tones can explain remixing, but they are not SepGen outputs. [Paper routing and ablations](https://arxiv.org/html/2610.11361v1).

Both queue items are **proposed**. Keep the light white/violet/cyan/orange design. A future implementation needs state-matched PNG/GIF/MP4 export and a visible analytic-model label.

## Screened but not selected

[AV-FlowEdit, 9 October v1](https://arxiv.org/abs/2610.13072v1) offers interesting shared-perturbation difference flows and spectral preservation. It is weaker for this bounded headline: its table reports DINO 0.592 versus AvED 0.956 and AV-Align 0.297 versus 0.42, despite improving several other metrics. The retrieved evaluation section does not establish dataset/sample count or a clear runtime budget. Do not describe it as the best preservation or synchronization method. [Primary results](https://arxiv.org/html/2610.13072v1).

Additional leads were discovered through the arXiv Sound and Graphics recent lists, including DiffuPlex and LiveSynth. They were not reviewed deeply enough for this delta. Kandinsky 6.0 Video was submitted October 4, so its paper alone would not constitute new publication in the requested October 5–12 window.

## Coverage and access

Primary arXiv recent lists, paper HTML, submission histories, author project URLs and official repositories were checked. HF papers markdown/API failed, so arXiv was the reading fallback. HF SepGen model/dataset pages resolved on one attempt but detailed retrieval was intermittent; code links and repository instructions are verified, checkpoint execution is not. Direct Python fetches failed DNS. OuroWorld's project page returned no readable text, but its repository was available. Community and product coverage is documented above. This is a curated delta, not exhaustive monitoring.



# October 12 weekly research additions

Three weekly additions join the previously checked OuroWorld and SepGen; LiveSynth is a screened extra outside the prioritized list. All dates below are arXiv submission-history timestamps, not crawl or demo dates. All are v1 with no later revision listed at this check. No model execution or independent benchmark reproduction.

| Paper | First submission (UTC) | Evidence | Access |
|---|---|---|---|
| Tabula Rasa | 2026-10-08 10:30:02 | [History](https://arxiv.org/abs/2610.11653v1), [methods/evaluation](https://arxiv.org/html/2610.11653v1) | [Official code](https://github.com/facebookresearch/Tabula-Rasa); JAX and WebGPU, majority CC-BY-NC |
| CrossEdit | 2026-10-07 15:36:56 | [History](https://arxiv.org/abs/2610.10264v1), [methods/evaluation](https://arxiv.org/html/2610.10264v1) | [Official examples](https://wanchichen.github.io/crossedit/); usable downloadable model/benchmark not verified |
| DiffuPlex | 2026-10-08 16:01:37 | [History](https://arxiv.org/abs/2610.12214v1), [methods/evaluation](https://arxiv.org/html/2610.12214v1) | [Project](https://diffuplex.github.io/) retrieval failed; availability unknown |
| LiveSynth | 2026-10-09 06:05:45 | [History](https://arxiv.org/abs/2610.13054v1), [methods/evaluation](https://arxiv.org/html/2610.13054v1) | [Project](https://kyungsukim42.github.io/livesynth-demo/) retrieval failed; paper's code-release statement unverified |

Next-build recommendation after the OuroWorld lab: Tabula Rasa and the variance/correlation graphic. This is an editorial choice for explanatory depth, not a claim that it wins a video-model leaderboard. The proposed visuals are original teaching designs; none are implemented. Do not copy the non-commercial implementation into a differently licensed public project without resolving its license.

The weekly selection uses five papers and three clearly labeled product features. LiveSynth is retained here as a screened extra; the prioritized list does not use September carryovers.

Primary-paper reading followed the Hugging Face papers workflow; its markdown endpoints were inaccessible for these IDs, so arXiv HTML supplied the methods and evaluations. Project retrieval failure does not establish that code is unreleased. Sources are author reports; external reproduction has not been performed.

AV-FlowEdit (2610.13072v1, October 9) was considered but not selected: its evaluation omits important dataset/runtime context, and the reported preservation and audiovisual-alignment metrics do not support a blanket best-editing claim. CrossEdit offers a more auditable creator-facing story. Avoid mixing numbers between these papers' different protocols.

Mathematical graphic guardrail, independently derived: for fixed weights a and independent unit-normal samples X, Var(a·X)=||a||², and Corr((a·X)/||a||,(b·X)/||b||)=(a·b)/(||a||||b||). This gives a browser-scale exact reference. Compare an approximate sketch against that reference; disclose estimator and hash-collision error. Do not label a finite noisy histogram as proof of exact variance or independence.

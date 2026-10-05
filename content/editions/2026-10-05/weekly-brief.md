# Frontier Fieldnotes — 5 October 2026

**Edition 002 · One repair. Every angle.** Research window: September 28–October 5, checked at the Monday review. All eight papers below were submitted in that window; no 30-day fallback was needed. Dates are original submissions, not crawl dates. All currently have v1 only; no revised version was found. These are scoped research candidates, not an independent SOTA leaderboard.

**Recommended pairing:** WINGS + multi-view consistency, covariance projection and opacity. The new [interactive Gaussian lab](https://kavehkamali.github.io/frontier-fieldnotes/gaussian.html) uses a synthetic arch to make a difficult constraint visible: plausible images need not describe one scene. A shared repair can still be wrong.

WINGS, PartiCam and Audible World Models were already flagged in the October 2 delta. This is their first full weekly treatment, with a new WINGS-inspired publishing kit—not another release announcement. The other five papers are new to this watchlist.

## 1. Frontier / SOTA candidates

### 1. [WINGS: Reference-Free Gaussian Splatting Inpainting with 3D-Native Generative Priors](https://arxiv.org/abs/2609.37816v1)

**Submitted 29 Sep 2026 · v1 · no later revision found.** Completes masked Gaussian-splat geometry and appearance using a 3D-native prior, without inpainted reference views.

**What changed:** First full weekly coverage; already included in the Oct 2 delta. No later arXiv revision found.
**Evaluation:** Author evaluation on 29 scenes from COR-NeRF, Inpaint360 and 360-USID; user study with 29 participants and 1,401 comparisons. No independent reproduction.
**Boundary:** Axis-aligned pattern bias and limited view-dependent appearance; not real-time. Consistency does not establish the true hidden geometry.
**Access:** Paper available. Runnable public code/checkpoints not verified.
**Creator use:** A coherent scene completion could support repeated camera moves after object removal. This edition’s interactive illustrates shared synthetic geometry; it does not run WINGS.

### 2. [Custom Forcing: Training-Free Subject Customization for Autoregressive Video Generation](https://arxiv.org/abs/2610.02914v1)

**Submitted 2 Oct 2026 · v1 · no later revision found.** Persistent reference anchors, drift-adaptive value amplification and anchor contrastive guidance preserve a subject in long autoregressive video without fine-tuning the generator.

**What changed:** New Oct 2 paper; not covered in the previous edition or Friday delta. No later arXiv revision found.
**Evaluation:** Frozen RollingForcing/Wan2.1 T2V 1.3B; 10 DreamBooth subjects, 10 prompts each; 30-second and 2-minute outputs. Author comparisons, not universal model rankings.
**Boundary:** Whole-subject customization, not precise part editing; no multi-subject evaluation. Excessively strong anchoring can suppress motion or make the subject dominate the frame.
**Access:** Paper and official project page available at https://gustn9609.github.io/custom-forcing/ . Runnable public code not verified.
**Creator use:** Useful research direction for keeping a prop or character recognizable across extended action. A graphic can show the tradeoff between anchoring strength, drift and motion.

### 3. [In-Distribution Forcing for Long Video Generation at Test Time](https://arxiv.org/abs/2610.03120v1)

**Submitted 2 Oct 2026 · v1 · no later revision found.** Self-caching, a bounded rolling cache, an initial sink and positional rerotation address cached features whose original conditioning context has already been evicted.

**What changed:** New Oct 2 paper; not covered in the previous edition or Friday delta. No later arXiv revision found.
**Evaluation:** Self-Forcing and LongLive on Wan2.1 T2V 1.3B; 128 refined MovieGen prompts, 120- and 240-second videos, four denoising steps. Author-reported tests.
**Boundary:** ID means in-distribution, not identity. The cache argument is not a guarantee that arbitrary long videos match the training distribution. Some consistency metrics can reward near-static collapse.
**Access:** Paper available. The paper's project URLs could not be fetched; runnable code not verified.
**Creator use:** Long-shot reliability may depend on how memory was created, as well as how much is kept. Show a cache ancestry graph and the effects of eviction.

### 4. [PartiCam: Camera Controlled Video Generation with Reward Guidance](https://arxiv.org/abs/2609.39504v1)

**Submitted 30 Sep 2026 · v1 · no later revision found.** Combines global particle guidance with local refinement to guide a pretrained video generator along a requested camera path.

**What changed:** First full weekly coverage; already included in the Oct 2 delta. No later arXiv revision found.
**Evaluation:** Author evaluation on nine static and nine dynamic videos using the NVS-Solver protocol, primarily CogVideo-based comparisons.
**Boundary:** Small evaluation; camera metrics do not all improve. Training-free still requires inference-time search. It does not establish control for arbitrary commercial video models.
**Access:** Paper available; runnable code not verified. The author site's PartiCam project link points to an unrelated Sparfels page, so use the versioned paper link.
**Creator use:** A camera-path graphic can expose the competition between image quality and geometric adherence, with particle count and local-search strength as controls.

### 5. [Audible World Models: Spatially Aware Sound Generation for 3D Worlds](https://arxiv.org/abs/2609.38444v1)

**Submitted 29 Sep 2026 · v1 · no later revision found.** Grounds generated sound sources in reconstructed scene geometry, then renders listener-dependent spatial audio.

**What changed:** First full weekly coverage; already included in the Oct 2 delta. No later arXiv revision found.
**Evaluation:** Author evaluation on 80 generated scenes with semantic and geometry-referenced spatial tests. Metric-dependent comparisons; not best on every semantic score.
**Boundary:** Offline construction with static geometry and fixed automatically placed sources. A supplied moving-source trajectory is not automatic motion inference or action–sound synchronization. Spatial tests measure consistency with the constructed scene.
**Access:** Paper available. Runnable public implementation not verified.
**Creator use:** For a camera move, sound should stay attached to its source. A listener-path diagram can distinguish generated dry audio from spatial rendering.

### 6. [Text embeddings: easier to separate is not easier to generate.](https://arxiv.org/abs/2610.01016v1)

**Submitted 01 Oct 2026 · v1 · no later revision found.** Distills an encoder using soft decoder probabilities so plausible token alternatives occupy a more connected latent region.

**What changed:** New to this edition: submitted 1 October, v1; no later revision verified.
**Evaluation:** Same ELF-B/M diffusion setup with different embeddings. Three seeds of 1,024 generated samples; best GPT-2-Large generative perplexity at real-text entropy across a sampling sweep.
**Boundary:** OWT-1024 and LM1B; generative perplexity and entropy, not a frontier-LLM ranking. Pretraining differs across encoders; distillation reduces classification performance. No reproduction here.
**Access:** Official sampling/training repository and checkpoint links available; not executed. Sampling needs no HF login per README; training with the teacher encoder requires accepting its model terms.
**Creator use:** For language-generation tooling, inspect latent geometry and diversity alongside the sampler. This does not establish better scriptwriting or production latency.

### 7. [Adaptive diffusion: spend steps where they help.](https://arxiv.org/abs/2610.03034v1)

**Submitted 02 Oct 2026 · v1 · no later revision found.** A proportional-integral controller uses current and previous numerical error to choose stochastic sampling steps; averaged paths also yield fixed schedules.

**What changed:** New to this edition: submitted 2 October, v1; no later revision verified.
**Evaluation:** Image FID at matched average NFE, three sets of 50,000 samples; language perplexity and unigram entropy. Also tests a 1D analytic mixture.
**Boundary:** FFHQ, ImageNet-64 and LM1B. Per-sample adaptivity offers modest real-data gains; it does not beat every low-NFE baseline. Language perplexity gains trade against token entropy. Linked code access unverified.
**Access:** Paper links https://github.com/ellakemperman/adaptive-second-order-diffusion-solvers; browser retrieval failed, so runnable access is not confirmed.
**Creator use:** Compare schedule and solver together at a compute budget. A large benefit in a toy distribution need not transfer to image or language models.

### 8. [Rubric-Based Optimization for Text-to-Music Generation](https://arxiv.org/abs/2610.03589v1)

**Submitted 2 Oct 2026 · v1 · no later revision found.** Uses audio-language-model rubrics as preference or scalar rewards to post-train MusicGen-small and ACE-Step v1.

**What changed:** New Oct 2 paper; not covered in the previous edition or Friday delta. No later arXiv revision found.
**Evaluation:** MusicCaps automatic evaluators, targeted tempo/key/instrument tests, and a small best-run listening study: seven listeners, 52 paired judgments over 40 captions.
**Boundary:** Results depend on the rater and prompting. Rubric rewards did not improve key accuracy; optimizing measurable attributes directly worked better. Short clips do not establish long-form musical quality.
**Access:** Paper available. Runnable public code not verified.
**Creator use:** Better aggregate music scores need not mean the requested key, tempo or instruments are right. A teaching graphic can separate proxy reward from independently measured attributes.

## 2. Fundamentals to make interactive

Priority reflects editorial value and implementation readiness, not benchmark rank. Foundational Gaussian projection/compositing predates this week; WINGS supplies the fresh research connection.

### 1. One repair, every camera angle — Interactive ready

**Misconception:** A convincing filled image is not evidence that all camera views describe the same scene. Shared geometry can still be wrong.
**Visual:** Orbit two synthetic Gaussian arches: one repair deliberately changes with the view; the other stays fixed in 3D. Inspect projected ellipses and overlapping opacity.
**Controls:** Orbit, elevation, opacity, anisotropy, splat size, missing-region mode, footprint overlays; PNG/GIF export.
**Connection:** [WINGS · 29 Sep 2026. New interactive this week; synthetic illustration, not its model or evaluation.](https://arxiv.org/abs/2609.37816v1)
**Audience:** ML engineers and filmmakers.

### 2. What a cache remembers after you evict it — Proposed

**Misconception:** A short KV cache does not necessarily contain only short-context information.
**Visual:** Draw video chunks as nodes, with attention edges showing each cached chunk's ancestry. Evict visible nodes and reveal information still inherited by the survivors.
**Controls:** Context-window length, ordinary versus self-caching, rollout duration, ancestry highlight.
**Connection:** [ID-Forcing · 2 Oct 2026. Show cache provenance without fabricating generated-video quality.](https://arxiv.org/abs/2610.03120v1)
**Audience:** Video-model engineers.

### 3. Keep the subject without freezing the action — Proposed

**Misconception:** Turning up reference conditioning is not a free improvement in both identity and motion.
**Visual:** A token-attention diagram follows reference anchors across a rollout. Inspect how stronger anchor influence can constrain identity and compete with new content.
**Controls:** Reference gain, drift trigger, contrast guidance, prompt change and elapsed chunks.
**Connection:** [CustomForcing · 2 Oct 2026. Abstract conditioning visual; actual identity scores require a model run.](https://arxiv.org/abs/2610.02914v1)
**Audience:** Filmmakers and applied ML teams.

### 4. Camera guidance without losing every alternative — Proposed

**Misconception:** Training-free camera guidance is not free of inference cost or diversity tradeoffs.
**Visual:** Animate candidate camera trajectories, reward weights and resampling ancestry. Track effective sample size and surviving path diversity.
**Controls:** Particle count, camera reward, aesthetic reward, restart budget and fixed compute budget.
**Connection:** [PartiCam · 30 Sep 2026; carried forward from Friday's proposal, not a new release today.](https://arxiv.org/abs/2609.39504v1)
**Audience:** ML engineers and camera-control users.

### 5. Sound attached to a place — Proposed

**Misconception:** A soundtrack that matches a scene is not necessarily audio that remains spatially attached as you move.
**Visual:** Move a listener among fixed emitters and walls. Compare a soundtrack with geometry-linked left/right cues and occlusion.
**Controls:** Listener path, emitter location, distance attenuation, wall toggle and binaural comparison.
**Connection:** [Audible World Models · 29 Sep 2026. Its automatic scene geometry and source placement are static; no action-sync claim.](https://arxiv.org/abs/2609.38444v1)
**Audience:** Audio creators and immersive-media teams.

### 6. The empty space between plausible words — Proposed

**Misconception:** An embedding that separates words well is not automatically a good latent space for generation.
**Visual:** Use labeled synthetic token islands and decoder regions to show how a denoised embedding can land between valid alternatives. Compare separated and connected regions.
**Controls:** Candidate spacing, soft-label strength, sampling error, decoder confidence and entropy.
**Connection:** [Scaling and Distilling Text Embeddings · 1 Oct 2026. A 2D explanation would not be a measured projection of its 640D embeddings.](https://arxiv.org/abs/2610.01016v1)
**Audience:** ML practitioners learning diffusion language models.

### 7. Where should the next sampling step go? — Extension proposed

**Misconception:** Adaptive per-sample steps do not always outperform a well-chosen fixed schedule.
**Visual:** Extend the existing sampler lab with a timeline of error estimates and evaluation spending. Compare uniform, adaptive and averaged schedules on the same analytic field.
**Controls:** Absolute/relative tolerance, proportional/integral gains, evaluation budget and schedule choice.
**Connection:** [Adaptive Second-Order Solvers · 2 Oct 2026. The current lab has fixed step counts; PI control is not implemented yet.](https://arxiv.org/abs/2610.03034v1)
**Audience:** Diffusion engineers and numerical-method learners.

### 8. A music score is more than one score — Proposed

**Misconception:** A higher automatic reward is not proof of better music for every listener.
**Visual:** Break a music prompt into rubric criteria and compare pairwise preferences under different weights; expose cases where one dimension hides another.
**Controls:** Rubric selection, per-criterion weights, judge disagreement, quality versus adherence display.
**Connection:** [Rubric-Based Optimization for Text-to-Music · 2 Oct 2026. Synthetic preferences are illustrations, not a listening study.](https://arxiv.org/abs/2610.03589v1)
**Audience:** Music-generation teams and creative directors.

## Competitor changes

These are official availability statements and vendor claims; there were no paid runs, authenticated access tests or independent quality comparisons.

- **[Higgsfield · AI Influencer rebuild](https://higgsfield.ai/blog/new-ai-influencer) — 03 Oct 2026 · update announced.** New since the 2 October check: a 19-setting character builder, paired portrait/full-body output and Genjutsu motion tools in the same studio. Workflow update. The vendor documents present availability and reuse in Cinema Studio; account access, identity consistency and motion quality have not been tested.
- **[Runway · Seedance 2.5 Draft Mode](https://runway.com/changelog) — 02 Oct 2026 · available, All Plans.** Newly verified in the official changelog: Agent can generate 480p drafts and enhance them after generation, with a toggle for Draft Mode. Generation-workflow integration, not a new base model. Faster/cheaper iteration is a vendor claim; draft-to-final continuity and cost per accepted shot remain untested.
- **[Runway · ElevenLabs v4 integration](https://runway.com/changelog) — 29 Sep 2026 · available, Paid Plans.** New to this watchlist: Runway documents ElevenLabs v4 support for audio generation. The integration predates the 2 October check. Access expansion, not another voice-model launch. Eleven v4 launched on 28 September and was already covered; no listening test or independent quality comparison was performed.
- **[OpenArt · FLUX 3 Image](https://openart.ai/blog/flux-3-image-overview/) — 01 Oct 2026 · availability guide; carryover.** Already covered on 2 October: OpenArt documents multi-reference image generation/editing and 2K/4K output. Carryover documentation, not fresh October 5 release news. The global launch date and exact integration time are unverified; edit-preservation and identity quality remain vendor claims.
- **[Higgsfield · Ads Studio](https://higgsfield.ai/blog/higgsfield-ads-studio) — 01 Oct 2026 · announced; carryover.** Already covered on 2 October: reusable brand kits and product inputs generate batches of static-ad concepts and variations. Carryover workflow launch, not a new video model. Compare brand consistency and useful variation; authenticated availability and output quality have not been tested.

Runway’s October 2 changelog also adds Ideogram 4.5 to MCP on paid plans. This is an integration, not a Runway model launch. No additional dated creative release was verified for Cartesia, Pika or Adobe in this window. Luma and Kling source access was incomplete; that does not mean they were unchanged.

## Ready-to-review publishing kit

- Casual [LinkedIn draft](gaussian-linkedin.md), [five-post X thread](gaussian-x.md) and [Medium article](gaussian-medium.md).
- Original synthetic [PNG](https://kavehkamali.github.io/frontier-fieldnotes/assets/gaussian-card.png), [six-second GIF](https://kavehkamali.github.io/frontier-fieldnotes/assets/gaussian-loop.gif) and [silent MP4](https://kavehkamali.github.io/frontier-fieldnotes/assets/gaussian-video.mp4).
- [Interactive presentation](https://kavehkamali.github.io/frontier-fieldnotes/gaussian.html): orbit/elevation, opacity, anisotropy, splat size, missing-region view, footprint overlays and current-control PNG/GIF exports in 16:9 or 1:1.
- [Download edition 002](https://kavehkamali.github.io/frontier-fieldnotes/assets/edition-002.zip), including narration and interactive source. Earlier canonical editions and edition-001.zip remain intact. Serve the extracted interactive folder over local HTTP for ES modules; the page’s dashboard links target the hosted dashboard.

The comparison is deliberately constructed. No WINGS model, inpainting competitor or hidden-ground-truth recovery is being evaluated. Other seven graphics remain proposals. No social posts were published.

## Community discovery and source gaps

Public indexed discussions were checked in r/StableDiffusion, r/LocalLLaMA, r/GaussianSplatting, r/comfyui, r/generativeAI and r/MachineLearning. Useful leads include the [October 2 orbit-video-to-splat workflow](https://www.reddit.com/r/GaussianSplatting/comments/1ww427o/update_image_to_ai_360_orbital_to_guassian_splat/), [October 4 konte music-video workflow](https://www.reddit.com/r/comfyui/comments/1wxftkt/i_made_a_3minute_music_video_locally_with_claude/) and [October 3 community Qwen adapters/samplers](https://www.reddit.com/r/StableDiffusion/comments/1wwi34c/qwen_image_21_fix_v20_updated_due_to_feedback/). They are author/community leads, not model rankings. The [konte tool](https://github.com/shiwano/konte), [production example](https://github.com/shiwano/konte-music-video-example), [adapter](https://huggingface.co/e-n-v-y/Qwen-Image-2.1-Fix-v2.0) and [sampler code](https://github.com/envy-ai/ComfyUI-DPMpp-2M-Sharp) provide inspectable artifacts; this does not independently reproduce the reported outcomes.

The last30days public Reddit/Hacker News run returned no usable results after DNS failures; indexed public search was the fallback. Exact thread timestamps and stable engagement counts were not obtained. X, YouTube transcripts, TikTok and Instagram were not scanned. HF paper markdown/API retrieval failed, so primary arXiv HTML and submission histories were used. The ElevenLabs docs changelog exceeded the retrieval limit; developer/API coverage is incomplete. Luma direct news retrieval and Kling official retrieval were blocked or incomplete. See [source-coverage.md](source-coverage.md) for the dated source-by-source record. No exhaustive monitoring or independent model reproduction is claimed.

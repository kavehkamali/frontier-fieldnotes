# Frontier Fieldnotes

## Owner and purpose
Kaveh is an AI leader with a PhD in robotics and machine learning. Public content should be technically credible, approachable and useful to engineers and creative practitioners. Do not invent employer details, personal experiments, opinions, results or experience.

## Scope — latest user direction
Focus on 3D Gaussian splatting, image/video generation, voice/audio generation, AI filmmaking, diffusion language models, attention, LoRA and related learning mechanisms. EXCLUDE robotics and physical AI from the editorial agenda unless explicitly reinstated.

Always use a light, modern, minimal visual theme with color to clarify mechanisms. Preserve the current white surfaces, restrained violet/cyan/orange diagram palette, generous spacing and readable typography.

## Weekly deliverables
Every Monday produce TWO prioritized lists, not just ready-made posts:
1. Frontier/SOTA watchlist: 5–8 meaningful new papers, models or releases. Record publication and revision dates, primary source, contribution, evaluation scope, access/code status if verified, limitations, creator implications, and what changed since last week. Label unverified SOTA claims and do not rank unrelated benchmarks together.
2. Fundamentals-to-graphics queue: 5–8 ideas. Each includes the misconception, a concrete interactive graphic, useful controls, a recent research connection, audience, status, and an editorial recommendation. Clearly label old foundations by date. Do not repeat prior topics without a new angle.
Recommend the strongest frontier/fundamentals pairing. Build one coherent weekly publishing kit: LinkedIn draft, X thread, original PNG, GIF/MP4 or interactive presentation, and a deeper article when there is enough substance. Keep proposals distinct from implemented visuals. The user's choices can reprioritize the queue.

## Discovery and verification
Use Reddit as an early signal source: r/StableDiffusion, r/LocalLLaMA, r/MachineLearning, r/GaussianSplatting, r/comfyui, r/generativeAI, r/HiggsfieldAI, and relevant video/audio communities after verifying them. Use last30days when available, plus search-indexed Reddit if access is incomplete. Never scan browser cookies or alter account setup. Disclose coverage gaps; do not claim continuous or exhaustive monitoring.

Read primary papers, official model cards/repositories, release notes and changelogs before repeating technical claims. Separate community anecdote, vendor claim, paper claim, independent reproduction and editorial inference. Date and link community posts; do not infer new publication from a recent comment. Watch for affiliate promotion and duplicated posts. Upvotes are not a benchmark.

Competitor priority: Higgsfield and OpenArt; compare relevant updates from Runway, Luma, Kling, Pika, Adobe Firefly, ElevenLabs, Cartesia and open model/tool ecosystems. Track model availability, controls, character/shot consistency, camera/editing features, audio/voice, workflow integrations, usable-shot cost, limits and licensing changes only when relevant and verified. Do not describe a promotion as a permanent capability. No purchases or paid generation runs without user authorization.

## Publishing and project maintenance
Canonical drafts and research are in content/editions/YYYY-MM-DD/. Build data.js from these files; never replace human edits from a hardcoded draft generator. Keep an edition archive and update the selected date and visible labels for new editions. Use scripts/check.py before committing.

Public GitHub publishing and recurring project updates are authorized. Inspect status first, preserve unrelated edits, push only this project's files, never credentials or private company material. Use a pull request if changes conflict with active work. Sites publication follows the Sites workflow; the public GitHub Pages deployment is separate. Never auto-publish posts to X, LinkedIn or Medium: prepare drafts and assets for the user's review.

Do not claim a trained model or experimental result for analytic or schematic visuals. Noise reversal with access to clean samples is not a learned diffusion sampler. 3D Gaussian splatting is not the same as Gaussian noise in diffusion. Distinguish neural rendering from generative 3D modeling.

## Useful commands
- Preview: python3 -m http.server 8765 --directory dist
- Rebuild selected edition: python3 scripts/build_content.py --edition YYYY-MM-DD
- Render original media: python3 scripts/render_media.py (Pillow and ffmpeg required)
- Check: python3 scripts/check.py

No API key is needed to view or run the dashboard. UI draft edits are session-local and must be downloaded to persist.

## Voice, freshness and interactive depth
Lead weekly public posts with a verified result from the last 7 days where possible, otherwise the last 28 days. Display original publication and latest revision dates separately. Older papers belong in a clearly dated reference library; do not headline them as SOTA. Re-check the rolling window on each run. SOTA means a scoped, attributed claim, not merely a fresh paper or product launch.

Write like an informed colleague explaining the interesting part: contractions, direct sentences, a concrete surprise or limitation, and technical detail only where it earns its place. Avoid generic thought-leadership hooks, breathless adjectives, emoji/hashtag lists, repetitive rhetorical questions, and phrases like "game changer", "unlock", "delve", "revolutionize", or "the future is here". Never invent first-person experiments or the owner's opinions. Lead with what changed in the paper, then use a fundamental to explain why it matters. The user wants casual and human, with scientific precision.

Visuals should allow substantive exploration: numerical solvers, score/velocity fields, particle trajectories, approximation errors, conditioning, temporal dynamics or actual rendering mechanisms. Aesthetic motion alone is not an explanation. Tie each advanced simulation to a recent paper, while stating clearly when it is an analytic teaching model rather than a reproduction. Navier–Stokes is an example of the desired depth; do not equate fluid flow with diffusion sampling. Keep the creative AI focus.

Every new visual needs a simple sharing path: one-click GIF and PNG from the current settings, readable caption, source/context and limitations. Include a ready-to-use MP4 where practical for video-first posting. Test the actual export, including cancellation, aspect ratios and matching visual state. Do not suggest all platforms accept GIFs identically; keep a video alternative.

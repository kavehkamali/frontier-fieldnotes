# This edition: fewer steps, different camera move

Research: FlashRender (3 Sep 2026), https://arxiv.org/abs/2609.03563v1; companion ViRDM (24 Sep 2026), https://arxiv.org/abs/2609.28923v1.

The downloadable flow GIF / MP4 is a six-second silent loop of the new analytic 2D sampler, with Heun, 64 steps, 128 evaluations and seed 42. It is a mechanism illustration, not video-model output.

## Optional 45–60 second narration

“Lowering the generation steps shouldn't change the camera move you asked for. That's a failure case explored in September's FlashRender paper.

To see the numerical issue, watch these dots. Each is following a direction field. Take enough small steps and it can follow the turns. Switch to Euler and use just four steps: some samples miss the finer path.

Heun takes a second look before correcting each step. That helps here, but it costs another field evaluation. The grey dots use a much finer numerical reference.

This is a small analytic distribution, not FlashRender running in your browser. It makes one part of the paper easier to inspect: how the path and the sampling budget interact.

Last week's ViRDM looks at a different part of fast video generation—post-training and preserving motion. A sharp frame alone doesn't tell us if the whole shot works.”

## Shot list

1. Title with paper name and submission date (0–5 seconds).
2. Lab: Flow matching, Six islands, Heun, 64 steps; play (5–15 seconds).
3. Pause at the end; change Euler to 4 steps, keeping seed 42 (15–25 seconds).
4. Compare the endpoint error and grey reference; increase to 128 steps (25–35 seconds).
5. Switch back to Heun and point out field-evaluation cost (35–45 seconds).
6. Show source links and “analytic mechanism, not model reproduction” (45–55 seconds).

Capture this narrated sequence separately. The six-second loop does not contain the full shot list or narration. Attention and LoRA assets remain 15-second silent background explainers.

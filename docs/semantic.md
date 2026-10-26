# Diffusion-clock lab — numerical scope and validation

The October 26 visual connects to [LLaCO, submitted October 23, 2026](https://arxiv.org/abs/2610.32604v1). It is an original analytical teaching model. It does not run LLaCO, pretrained token embeddings, a learned denoiser, text generation, or a performance benchmark.

## Geometry

The seeded vocabulary contains unit directions in D = 8, 32, 128 or 512 dimensions. Source and noise are orthogonal unit endpoints. Gaussian random directions are normalized before their source/noise-plane projections are retained. Every state lies in that plane, so dot products against the stored projections equal the full-dimensional dot products. The displayed distance between two projected points is not their original-space distance. Token IDs have no learned linguistic meaning.

For a source direction u_i, rival u_j, noise direction z and state s = alpha u_i + beta z, a rival passes the source when

`beta / alpha > (1 - dot(u_i, u_j)) / (dot(u_j, z) - dot(u_i, z))`.

Only positive denominators can cross on the selected nonnegative path. Rank is one plus the number of strict source-beating rivals, with a 1e-12 comparison tolerance. This pairwise boundary is algebraic; it does not use the paper's approximate probability model. The two paths are linear interpolation and an orthogonal-endpoint quarter-circle SLERP. A special shrink experiment holds direction fixed, adds no noise and decreases the state norm from 1 to 0.05.

The cosine decoder ranks unit directions. The Euclidean decoder additionally uses unequal candidate norms n_j and ranks `2 n_j dot(u_j, s) - n_j^2`. The common `-||s||^2` term can be omitted. Candidate norms are synthetic. One shorter competitor is included in shrink mode to make disagreement legible without implying a measured property of a real tokenizer. Competition-mode dots depict directions; shrink-mode dots depict norm-scaled candidates.

## Toy clock

Crossings are smoothed with logistic width 0.012 in geometric progress. We take the logarithm of one plus the smoothed crossing count and normalize between its endpoints, producing H(gamma). The clock is `t(gamma) = 0.9 H(gamma) + 0.1 gamma`, inverted by 45 bisection steps. The 10% floor follows the mapping form and epsilon in paper equations 27–28; our single-path curve replaces the paper's fitted pretrained-vocabulary retention curve. Uniform and adaptive grids always show the same selected number of intervals. They do not predict text quality or latency. For a vocabulary with no crossings, the implementation falls back to uniform time.

The lab excludes the mask-biased endpoint, fitted vocabulary distribution, directional adapter, training and reverse inference. Playing a path backwards retraces known geometry.

## Original media

PNG captures the current settings. GIF starts at the selected progress and makes a smooth out-and-back periodic sweep: `g_i = (1 - cos(acos(1 - 2 g_0) + 2 pi i / 60)) / 2`. Seed, dimension, vocabulary, path, lesson and step budget stay fixed. Sixty frames total eight seconds. Frame zero matches the PNG state; the periodic continuation is smooth rather than a duplicated terminal frame. Export locks controls; cancellation restores the settings and prior playback state.

Wide exports are 1200 × 675; square exports are 1000 × 1000. Both contain the source and model limitation. The ready-to-use H.264 MP4 is the same wide animation at 30 fps, with one white bottom row added (1200 × 676) for yuv420p compatibility. It is silent; a separate narration and shot list accompanies the kit. No model-based video generation or paid service is used.

## Validation on October 26

- Twelve numerical tests use independent full-dimensional oracles, including a rotated coordinate system, to check scores, rank, tie handling, crossings, norm invariance, interpolation, schedule inversion and export phase continuity.
- Real-browser checks exercised both lessons, dimension/path controls, keyboard endpoints, reset and mobile horizontal overflow.
- Actual wide and square PNG/GIF downloads were inspected. Each GIF decodes as 60 frames over 8.000 seconds. The first wide GIF frame agrees with the selected-state PNG up to palette quantization (46.77 dB PSNR including alpha). The MP4 decodes as 240 frames over 8.000 seconds.
- Cancellation during playback, disabled controls during export, state restoration and resumed playback were verified through the live interface.

These checks validate the implementation and sharing behavior, not LLaCO or a language-model result. Run `python3 scripts/check.py` for the repository's numerical, canonical-content, archive, syntax, media-presence and local-link checks.

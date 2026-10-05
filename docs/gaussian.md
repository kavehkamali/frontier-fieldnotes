# Gaussian repair teaching renderer

Created for the October 5, 2026 edition; inspired by [WINGS](https://arxiv.org/abs/2609.37816v1), submitted September 29. This is an original synthetic illustration, not model inference or a benchmark.

The scene has 981 hand-placed Gaussian primitives. The shared repair keeps their positions fixed. The comparison deliberately shifts the masked subset with camera azimuth; it is not a faithful implementation of an image inpainting method. At zero azimuth, the two geometries agree. Consistency does not prove the hidden geometry is correct.

The renderer rotates a positive-definite world covariance into camera coordinates and projects it with the local perspective Jacobian: Q = J R Σ Rᵀ Jᵀ. Its eigensystem determines ellipse axes and orientation. A finite radial gradient approximates Gaussian alpha out to three standard deviations. Splats are sorted by center depth and composited back to front with source-over, equivalent to the front-to-back transmittance formula shown on the page under this sorting approximation.

Limitations: center-depth rather than per-pixel sorting; approximate radial falloff; fixed colors; no spherical harmonics, scene training, geometry optimization or learned inpainting. Camera controls stay away from singular configurations. Projected covariance is a first-order approximation, not exact volumetric integration.

PNG captures current controls. GIF freezes the control state and adds a six-second ±30° sinusoidal orbit around the selected view. Source/context and synthetic-scene labels are included. Both ratios, cancellation and state restoration were exercised in browser checks. MP4 is the silent GIF-derived video alternative.

Meaningful checks in tests/gaussian.test.mjs compare projection covariance with finite differences, check a known opacity-compositing case and verify fixed versus deliberately changing geometry. The page exposes window.gaussianLab.drawScene/getState/setState/ orbitFrame for deterministic local media rendering.

The original 3D Gaussian Splatting foundation is from [2023](https://arxiv.org/abs/2308.04079), not this week’s news.

# Selective-update teaching lab

Original analytic scene inspired by ResStreamGS (15 October 2026), not its implementation. The fixed set contains moving orange points, a stationary color-changing panel and stable floor/frame points. A perspective covariance projection and center-depth Gaussian alpha composition form each view.

For each frame group, a known synthetic trajectory sampled at six later times ranks position changes, or position plus normalized color changes. The budget picks a fixed number of top-ranked primitives; others retain group-start attributes. This oracle is not the paper's learned adaptation probe or quality-aware ratio selector. Covariances stay fixed. No training, codec, network or renderer-pruning benchmark is simulated.

A small 120×80 CPU raster measures normalized RGB RMSE between reference and reused scenes under the same camera. The display uses an approximate canvas Gaussian falloff; its resolution and falloff discretization differ. Error is camera-dependent, and zero error does not assert realism. Attribute-record cost is N+M(K−1), compared with NK for N primitives, M updated and K frames. These are equal-size hypothetical records, not file bytes or bitrate.

The live view, PNG, GIF and editorial assets share drawScene. Export snapshots freeze controls, preserve selected settings and restore playback; GIFs cover 96 synthetic frames in 8 seconds using 60 sampled frames. Cancellation emits no completed file. The synthetic scene loops; cache resets at group boundaries can intentionally create discontinuities.

Validation covers full-update equality, group-boundary reset, stale-cache error, fixed-position/changing-color distinction, ranking, deterministic raster and accounting. Browser checks cover controls, cancellation, square/wide output and current-state preservation.

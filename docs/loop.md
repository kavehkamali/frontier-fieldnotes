# Periodic 3D Gaussian teaching lab

Created for the October 12, 2026 edition, inspired by [OuroWorld](https://arxiv.org/abs/2610.12461v1), first submitted October 8. This is an original analytic explanation, **not trained model inference, its fitting pipeline or a benchmark reproduction**.

The scene contains 840 hand-designed Gaussians arranged along a closed ribbon. Their means combine two temporal Fourier harmonics and spatially varying coefficients. Colors and positive-definite covariances are fixed. `gaussian-math.mjs` provides camera rotation, first-order perspective covariance projection and the renderer's depth convention. Canvas approximates each Gaussian with a radial gradient truncated at three standard deviations, sorting translucent footprints back to front by center depth. This does not implement per-pixel depth sorting, spherical harmonics, learned motion or physically plausible dynamics.

The three modes are mathematical contrasts:

- **Fourier loop:** integer temporal harmonics share period T. Positions and time derivatives return exactly, within floating-point tolerance.
- **Same endpoints:** add `4 τ(1−τ) d(θ)`, where τ=t/T and d is a spatially varying vector. Position closes. Endpoint velocities differ by `8 d(θ)/T` in magnitude. This creates a kink at replay.
- **Accumulated drift:** add `τ d(θ)`. Endpoint velocities agree but positions differ. This deliberately broken loop is not OuroWorld's reference-anchored training-time nuisance field.

Position and velocity metrics are RMS vector differences over 120 equally spaced ribbon angles, in arbitrary world units and units per second. No threshold is a perceptual quality guarantee. The time chart displays the horizontal displacement of one Gaussian angle (θ=0.6 radians), with endpoint tangents, not the whole scene's error.

Camera motion is separate from geometry: fixed, a ±20° sinusoidal return orbit, or a +35° non-returning orbit. The displayed camera seam is azimuth difference in degrees. A closed 3D scene does not generally yield a closed image sequence under a non-returning camera. The ±20° option echoes the paper's bounded evaluation; this hand-designed scene can be orbited farther, which is not evidence of the paper's novel-view performance.

The paper reports 39 scenes, static and ±20° orbit cameras, ground-truth-free metrics and a 30-participant study. Those are author-reported findings. Official code is linked; full-pipeline non-commercial dependencies and reference-generation options are covered in the weekly research record. The default own-scene reference workflow uses paid APIs, while the repository documents a Wan alternative and reuse of released references. No models or paid services run in this page.

## Controls and exports

Time scrubbing exposes both endpoints (0 and T); playback wraps phase into [0,1). Period changes velocity and playback speed. Harmonic sliders change geometry while preserving periodicity in Fourier mode. Dragging or arrow keys changes base camera angle. Selected footprints expose the projected covariance ellipses.

PNG captures the selected instant, settings and caption. GIF captures exactly 60 phase samples across one cycle, beginning at the selected phase and excluding the duplicated terminal endpoint. Current mode, harmonics, camera, period and footprint setting remain fixed. Broken modes intentionally retain their discontinuity; exporting does not silently repair them. GIF frame delays distribute centisecond rounding so their sum exactly matches the chosen 3–12 second period. Export controls pause, lock and then restore playback/settings. GIF has progress and cancellation; a cancelled export does not download a partial file. Both wide and square layouts include source, limitations and numerical seam metrics. PNG/GIF are generated locally, without network calls.

## Deterministic media surface

`window.loopLab` is a documented rendering surface for editorial media and browser QA:

- `getState()` returns a copy of the current settings.
- `setState(partialSettings)` pauses animation, merges settings and renders; it refuses changes during an export. Intended callers supply settings within the UI ranges.
- `drawScene(ctx, width, height, settings, caption=true)` renders one deterministic frame into any canvas.
- `exportFrame(settings, frame, total=60)` gives one cycle's settings without a duplicate endpoint.
- `getExportState()` reports active/cancelled state, progress, playback state and metadata for the latest completed download.

For media, set a mode and phase, then render `exportFrame(snapshot,i,60)` for i=0…59. Convert those original frames to MP4 where a platform prefers video. Do not claim all social platforms accept animated GIFs identically. Embed `loop.html?embed=1`; it emits same-origin `loop-height` messages for the dashboard iframe.

`tests/loop-math.test.mjs` checks analytic velocities against independent central finite differences, period and derivative invariance across amplitudes/periods, isolated endpoint and drift failures, independent camera closure, positive covariance minors, deterministic geometry and 60 unique export samples. Browser checks must additionally cover wide/square downloads, cancellation, state restoration, mobile layout and both camera/scene failure modes.

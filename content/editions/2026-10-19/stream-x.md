1/4
ResStreamGS (Oct 15) separates reusable Gaussian splats from those needing frame-by-frame updates. The fun part: a stationary surface can still need updating.
https://arxiv.org/abs/2610.21121v1

2/4
A wall can stay still while its color changes. In this synthetic scene, switch from position-only ranking to position + color. With the same update budget, which parts get refreshed changes. Watch the image, not just the counter.

3/4
Cached doesn't mean invisible. Reused splats still get rendered; their attributes stay at the group's starting values. Longer groups save more update records but can leave the picture stale. That's separate from removing splats to speed up rendering.

4/4
Try the frame, update-budget, color and camera controls. Compare pixel error and export a PNG/GIF. This analytic lab uses known synthetic trajectories; the counter isn't codec bytes, and it isn't the paper running in your browser.
https://kavehkamali.github.io/frontier-fieldnotes/stream.html

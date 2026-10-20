# Keep the scene. Send the changes.

ResStreamGS, submitted October 15, 2026, puts reusable Gaussian splats in a frame-group cache and updates the sensitive ones frame by frame. Its author evaluation covers six sequences, with better quality and lower payload than a controlled V3-style baseline. Those results aren't a ranking of every streaming method. [Paper, v1](https://arxiv.org/abs/2610.21121v1).

The [interactive scene](https://kavehkamali.github.io/frontier-fieldnotes/stream.html) explores two decisions hiding inside that idea: what needs refreshing, and what still needs drawing. It uses synthetic 3D Gaussians with known motion and color changes. No model weights or video codec run in the browser.

Start with the colored panel. It stays in the same place while its color changes. A selector that only measures movement sees very little reason to spend updates there. Yet freezing its old color changes the image.

That's the first useful distinction. Stationary describes position. Safe to reuse describes the attributes that matter to the picture over a particular time interval. Even “background” doesn't answer that question. A backdrop with changing illumination can matter more than a small moving detail hidden behind something else.

In the lab, switch between position-only ranking and position-plus-color ranking. Both get the same number of update slots. Their choices differ because they score different information. The second option can notice the panel; it isn't guaranteed to minimize image error from every camera.

The selector also gets an advantage that a real system must earn: access to the scene's known synthetic trajectories. It samples six later states in the group and ranks changes from the starting state. ResStreamGS instead uses probe adaptation, several Gaussian attributes and a quality-based selection rule. The lab illustrates the decision; it doesn't implement that algorithm. [Method](https://arxiv.org/html/2610.21121v1).

Now watch the frame around the panel. Reusing it doesn't make it disappear. Its splats remain in the rendered image, using their cached values. Only the selected splats receive current-frame attributes.

That's the second distinction. Caching answers when to refresh information. Culling and pruning answer which primitives to draw or retain. They can work together, but one doesn't automatically deliver the savings of the other. A cached wall can still cover a lot of pixels.

The record counter makes one small part of this concrete. With N splats across K frames, refreshing every splat every frame requires NK attribute records. Sending the initial scene once and refreshing M splats on each remaining frame gives:

$$N+M(K-1).$$

For a hypothetical 1,000-splat scene over 20 frames, updating 250 splats after the first frame gives 5,750 records instead of 20,000. That's simple bookkeeping, not a compression benchmark. Actual bytes depend on precision, encoding, indices and other overhead. The lab doesn't estimate wireless throughput or phone playback speed.

Increase the group length and that initial scene gets shared across more frames. The tradeoff is that unselected splats keep older attributes for longer. Scrub through the group to see where that becomes visible. Returning to the next group boundary refreshes the reference state.

Then rotate the camera. The same scene discrepancy can become more or less visible through projection and overlap. The lab compares reference and reused renders with pixel RMSE on a 120 × 80 grid. That number belongs to this view and this simplified renderer; it isn't perceptual quality or the paper's measured performance.

A good first export is the changing panel with a tight update budget. Keep everything else fixed and switch the ranking rule. The useful story is where the budget goes, what remains visible, and which detail has quietly gone stale.

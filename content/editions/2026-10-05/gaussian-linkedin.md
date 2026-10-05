A 3D edit can look completely convincing. Until you move the camera.

Fill the same missing region independently in several images and you can get several plausible answers: an edge here, a different shape there. Each image works on its own. They may not describe the same scene.

WINGS, a September 29 preprint, tackles that problem by completing the missing region directly in a Gaussian-splat scene with a 3D-native prior. Its evaluation covers 29 scenes. There are still limits around alignment, view-dependent appearance and runtime; this isn't a solved production-editing workflow.

The interesting part to explain is what “shared 3D” actually buys you.

This week's interactive lets you orbit a synthetic scene, change the shape and opacity of its Gaussians, and inspect the ellipses they project onto the image. The orange repair stays fixed in one panel. In the other, deliberately inconsistent repair hypotheses change with the view.

It's an illustration of the constraint, not WINGS running in your browser or a benchmark comparison. A consistent repair can still be the wrong repair.

Try the orbit, then lower the opacity. You'll see why agreeing on the scene and agreeing on one picture are different problems.

Interactive: https://kavehkamali.github.io/frontier-fieldnotes/gaussian.html
Paper: https://arxiv.org/abs/2609.37816v1

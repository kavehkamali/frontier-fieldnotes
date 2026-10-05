# The camera move that exposes a bad 3D edit

A still image gives a repair somewhere to hide. A short orbit takes that hiding place away.

Imagine an arch with a section missing. From the front, a smooth patch might finish the shape convincingly. From the side, you need to decide how deep that patch is. From behind, you need another surface. If those decisions happen independently, the images can disagree even when each one looks reasonable.

That's a useful way into [WINGS](https://arxiv.org/abs/2609.37816v1), submitted September 29, 2026. It completes masked regions of a Gaussian-splat scene with a 3D-native prior, avoiding the need to reconcile independently inpainted reference views. Its author evaluation covers 29 scenes. Alignment, view-dependent appearance and runtime remain limitations. No WINGS inference runs in the interactive linked below.

## One object, several images

The [interactive scene](https://kavehkamali.github.io/frontier-fieldnotes/gaussian.html) has two panels. One keeps an orange repair fixed in 3D. The other deliberately varies its repair hypothesis with the camera view.

That second panel is hand-designed to expose the inconsistency. It isn't a measured failure rate of an image model, and the fixed repair isn't a recovered ground truth. Both are synthetic. The question is narrower: which properties change when multiple views must come from the same representation?

Start at the front, then orbit. Look at the repair's silhouette and its overlap with the rest of the arch. A shared scene imposes a relationship between those observations. It doesn't guarantee that the scene is correct.

## What a Gaussian contributes

The underlying rendering idea predates this week's paper. [3D Gaussian Splatting (2023)](https://arxiv.org/abs/2308.04079) represents a scene with spatial Gaussian primitives. Each has a center, shape, opacity and appearance. A camera projects them into image-space footprints and blends their contributions.

Our teaching renderer uses a local linear approximation of perspective projection. With world covariance Σ, camera rotation R and projection Jacobian J, the projected covariance is approximately J R Σ Rᵀ Jᵀ. Its eigenvectors and eigenvalues determine the footprint's orientation and spread.

Rotate the camera while watching an elongated splat. Its image footprint changes even though its 3D shape stays fixed. A Gaussian here describes a rendering primitive; it isn't the Gaussian noise used in diffusion sampling.

## Opacity is a separate decision

Now lower the opacity. Contributions behind the repair become easier to see. Enlarging a footprint increases overlap; it doesn't add missing geometric knowledge. Depth ordering also matters because the contribution of a farther splat depends on how much light the nearer ones leave visible.

The browser uses a simplified renderer with fixed colors, synthetic geometry and approximate splat ordering. It doesn't reproduce the training, spherical-harmonic appearance or optimized rasterization of a full Gaussian-splat system.

## What to check in a real editing workflow

For a proposed repair, examine more than the input view. Include side views, silhouettes and an occlusion boundary. Keep the original context visible so a plausible patch can't disguise damage elsewhere. If the result is for a shot, inspect the actual camera path.

Those checks test a practical requirement: does this edit survive the views you need? They do not establish a universal model ranking.

The interactive exports your settings as a PNG or orbit GIF, with its source and limitations included. A ready MP4 is also in the [October 5 kit](https://kavehkamali.github.io/frontier-fieldnotes/assets/edition-002.zip). Use the visual to explain the constraint; keep the paper's reported results separate from the synthetic demonstration.

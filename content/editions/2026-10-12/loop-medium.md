# A 3D loop can close perfectly and still look wrong

OuroWorld, submitted October 8, 2026, puts periodic motion into a Gaussian-splat scene. The representation itself returns to its starting state. That's a useful direction for animated backgrounds and small moving details in a 3D set. [Paper, v1](https://arxiv.org/abs/2610.12461v1).

There's a trap in the word “seamless,” though. Returning to the starting point, crossing the seam smoothly, and moving believably are three different requirements.

The [interactive loop lab](https://kavehkamali.github.io/frontier-fieldnotes/loop.html) separates them using a synthetic scene of projected 3D Gaussians. These are rendering primitives with spatial extent and opacity. They aren't diffusion noise, and this isn't OuroWorld running in the browser.

## Coming back to the same place

Take a single moving point with position x(t) and loop duration T. Closing its path requires

$$x(T)=x(0).$$

That alone leaves room for a nasty restart. The point can arrive moving left and leave moving right. Its position is continuous when the clip repeats, but its velocity jumps.

For a smooth first derivative at the seam, we also need

$$\dot{x}(T)=\dot{x}(0).$$

Acceleration continuity asks another question again. A seam diagnostic should say which of these it measures. A tiny position error doesn't certify the entire motion.

In the lab, compare the periodic case with the case that only matches positions. Scrub near the seam. Watch the change in direction as well as the displayed error.

## Giving every wave the same clock

A simple way to build periodic motion is a finite Fourier sum:

$$x(t)=x_0+\sum_{k=1}^{K}\left[a_k\cos(2\pi kt/T)+b_k\sin(2\pi kt/T)\right].$$

Here x₀, aₖ and bₖ can be 3D vectors. Every frequency is an integer multiple of the base frequency. After T seconds, all the terms return together. Differentiating the finite sum keeps that period, so velocity and acceleration also match across the seam.

Phase changes when a component moves. Amplitude changes how far it moves. Higher harmonics add faster variation. For equal amplitudes, velocity grows with k and acceleration with k². A perfectly closed path can therefore become frantic very quickly. Try increasing the higher-frequency contribution without changing the loop duration.

OuroWorld uses Fourier features decoded into Gaussian attribute changes. It also learns a reference-anchored drift field to handle disagreement between generated training views, then discards that field for rendering. The lab's deliberately drifting motion is only a counterexample to periodicity; it isn't that learned field. [Method](https://arxiv.org/html/2610.12461v1).

## The camera has its own seam

The image depends on the scene and the camera:

$$I(t)=\operatorname{Render}(G(t),C(t)).$$

Periodic scene state G(t) isn't enough if camera state C(t) keeps changing. For a reliably repeating shot, all changing render inputs must repeat too. That includes camera pose and any animated appearance settings.

Use a fixed camera or a camera path that closes with the scene. Inspect the result from another angle as well: one projection can hide a mismatch.

For N exported frames, sample t=nT/N, with n from 0 to N−1. Including both 0 and T duplicates a frame and can create a small pause. The movement from the last sampled frame back to the first is normal motion; the mathematical seam compares the states at 0 and T.

## What this proves

This graphic demonstrates constraints, not learned dynamics or physical realism. Its analytic trajectories and simplified splat renderer don't reproduce the paper's training or establish a quality score. OuroWorld's author evaluation covers 39 scenes with static and limited-orbit cameras; that doesn't establish quality across unrestricted camera travel.

Use the PNG and GIF exports to show one change at a time. A good first comparison is a closed position path with a velocity jump beside a periodic path. Then keep the periodic motion and change the camera. The seam has more than one place to go wrong.

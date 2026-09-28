# Numerical notes

The browser computes samples by numerical integration of exact Gaussian-mixture fields. It does not use paired clean endpoints to draw generation trajectories, train a network, or reproduce a paper's video results.

Targets have equal component weights, means μₖ and covariance τ²I, with τ = 0.22. The three layouts are six islands, a spiral, and two crescents. Colors follow sample indices and are unrelated to class labels.

## Flow matching

Use independent noise ε ~ N(0, a²I), a = 1.8, and target Y. The training coupling is Xₜ = (1−t)ε + tY. At time t, each component has mean tμₖ and scalar variance c = a²(1−t)² + τ²t².

Compute posterior responsibilities rₖ with log-sum-exp from the component log densities. If m = Σrₖμₖ, the exact marginal velocity is:

v(x,t) = m + [τ²t − a²(1−t)] / c · (x − tm).

Initialize fresh Gaussian samples and integrate dx/dt = v with Euler or Heun. Conditional training paths are straight; marginal sampling trajectories need not be. The browser does not train MeanFlow or implement FlashRender.

## Diffusion

The noised target p_q has component variance τ²+q. The exact score is s = (Σrₖμₖ − x)/(τ²+q).

The initial distribution is p_qmax with qmax = 5. Draw a component plus noise and immediately discard component identity. This is the exact finite-noise marginal, not an assertion that a finite-noise mixture is a pure standard Gaussian.

Set v = τ²+q, L = log((τ²+qmax)/τ²), and r = Lt. Then v(r) = (τ²+qmax)exp(−r).

- Probability-flow ODE: dx/dr = ½v s. Implemented with Euler or Heun.
- Reverse SDE: dx = v s dr + √v dWᵣ. Implemented with Euler–Maruyama. Both drift and randomness are necessary for these marginals.

At finite steps the stochastic method is biased. Even for a single Gaussian, the final coordinate variance is about 305% too high with 4 steps, versus 1.86% with 128 under this schedule. Low-step behavior is an intentional numerical-error experiment, not a quality sampler recommendation.

## Diagnostics and display

Deterministic endpoint RMS uses the same initial samples and 256-step Heun reference. It is in data units and is not exact ground truth or an image-quality score. Heun uses two field evaluations per step; Euler and Euler–Maruyama use one.

SDE mode instead reports the signed relative gap in sample E[‖x‖²] against the analytic target. This is only one moment, with sampling error; it cannot establish full distribution agreement. Grey marks are independently drawn target samples in this mode, not matched deterministic paths.

Scrubbing linearly interpolates stored states. In SDE mode these intermediate points are display interpolation, not fresh Brownian states. Arrows are normalized/capped for display only. The dynamics are never clamped to the viewport; an outside-view count appears when necessary. Dashed target circles show two standard deviations of each component, not total-density level sets.

The GIF renderer uses the same computed trajectories and settings as the lab: 60 frames, six seconds including beginning/end holds, infinite loop. The loop resets to noise; it does not imply a reversible stochastic path.

## Verification

Run `node tests/simulation.test.mjs ./dist/simulation.mjs` (included in scripts/check.py). The checks cover finite-difference score gradients, seeded replay, all 108 shape/method/solver/step configurations, analytic single-Gaussian solver order, mixture convergence, stochastic variance, moments and projected-CDF comparisons. These validate the numerical teaching model, not the cited research papers.

## Primary readings

- [Flow Matching, 2022](https://arxiv.org/abs/2210.02747)
- [Score-based generative modeling through SDEs, 2020](https://arxiv.org/abs/2011.13456)
- [FlashRender, 3 Sep 2026](https://arxiv.org/abs/2609.03563v1)
- [A Lagrangian View of Flow Matching, revised 5 Sep 2026](https://arxiv.org/abs/2609.00198v2)
- [ViRDM, 24 Sep 2026](https://arxiv.org/abs/2609.28923v1)

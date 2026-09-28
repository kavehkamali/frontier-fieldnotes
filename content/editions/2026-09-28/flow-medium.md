# Watch a distribution change: a visual route into diffusion

*From three colored peaks to Gaussian noise—and why running the animation backward is not a generative model.*

A noisy image is a useful starting point for explaining diffusion. It is also easy to misread. When we see a picture becoming clear, we can come away thinking that generation simply restores an original image hidden inside the noise.

A distribution view makes a different idea visible. We are learning how to produce plausible samples from a population, potentially conditioned on a prompt or reference. There need not be one original picture waiting inside a particular noise draw.

The [interactive lab](https://kavehkamali.github.io/frontier-fieldnotes/) begins with three colored populations. Each has a different mean. Together, they form a distribution with three peaks. A slider controls how much data signal remains relative to independent Gaussian noise.

## What the graph actually computes

Let the data population be an equally weighted mixture of three one-dimensional Gaussians. Their means are −2.5, 0 and 2.5, and each has standard deviation 0.4.

For a data sample x and an independent standard Gaussian sample ε, define:

xα = αx + √(1 − α²)ε.

When α = 1, we keep the data. When α = 0, we have only standard Gaussian noise. Between those endpoints, each component remains Gaussian: its mean is multiplied by α, and its variance becomes α² × 0.16 + (1 − α²).

That gives us an exact density to draw. We do not need to train a neural network to calculate it.

The cyan, violet and orange curves represent the three weighted components. Their sum is the dark curve. The dots show a fixed set of samples coupled across slider positions so we can follow them visually. They are not independent fresh draws on every animation frame.

This construction lets a simple question become visible: at what noise level do distinct populations become hard to tell apart?

## What disappears as noise grows

At low noise, a sample near one peak gives useful evidence about which population it came from. As the peaks overlap, that evidence becomes less decisive. At the pure-noise endpoint, all three component distributions coincide.

This is a useful intuition for information loss. Adding noise is easy because we deliberately discard distinctions. Recovering useful structure requires knowledge of the data distribution.

Notice that the dots are not each assigned a single inevitable destination by the noisy point alone. In an overlapping region, several clean explanations may be plausible. Generative modeling has to deal with that ambiguity rather than simply undoing a deterministic blur.

## Why the reverse animation is not a model

The slider can be moved in either direction because the illustration already knows the clean mixture and the sampled noise. That makes the picture reversible as a user-interface operation.

A model does not get those privileged ingredients at generation time. It receives a noisy state, time information and possibly conditioning, then uses learned information to determine how sampling should proceed.

This is the distinction I want an introductory visual to preserve. Knowing a convenient formula for a toy marginal is not the same as learning a sampler for images, audio or video.

The [score-based SDE framework](https://arxiv.org/abs/2011.13456) connects forward noising, learned scores and reverse-time generation. It also develops a probability-flow ODE formulation. That is why “diffusion means a random path, flow means a smooth path” is too crude as a general explanation.

## Where flow matching fits

A second mode in the lab shows a transport picture. Start with a simple distribution, then follow a time-dependent direction field toward a data distribution.

[Flow matching](https://arxiv.org/abs/2210.02747) provides a way to learn such vector fields from specified conditional probability paths. There are relationships between diffusion and flow formulations; they are not two unrelated boxes.

The transport mode is intentionally only a schematic. Its hand-defined paths are not the learned field from an experiment. Comparing that drawing with the density view cannot establish which method produces better images or runs faster.

For an actual comparison, I would want the model, training setup, sampler, number of evaluations, quality metric and hardware held in view together.

## The connection to current AI filmmaking

Once the distribution idea is clear, conditioning becomes a more interesting question. What information changes the set of outputs the generator should consider plausible?

For a face, one image can describe appearance. It cannot fully describe the characteristic way that person moves or expresses emotion over time. [BEACON](https://arxiv.org/abs/2609.13264v1), a September 2026 paper, explores separate reference-image and reference-video signals for appearance and facial behavior.

That is a research connection, not a claim that this toy reproduces BEACON. Its facial-video evaluation also does not establish reliable full-film storytelling, multi-shot continuity or arbitrary body motion.

For a filmmaker, the questions become concrete. Is the reference intended to preserve a face, transfer a performance, guide a camera move, or maintain a location across cuts? “More control” is vague until we say which variable the control affects.

## How I would use this in a short explanation

I would begin with the three peaks and ask viewers to follow one color. Then I would move toward noise and pause when the components heavily overlap. Finally, I would return toward data and explain why the animation has access to information a real generator must learn.

Only after that would I introduce a newer method. The fundamentals earn their place by making the current result easier to interrogate.

A useful visual should leave the reader with a sharper question, not merely a memorable animation. In this case: which distribution is changing, what information is being supplied, and what has actually been learned?

— Kaveh / Frontier Fieldnotes

*Checked September 28, 2026. Original educational visualization. No model training, generated-film evaluation or independent benchmark reproduction was performed.*

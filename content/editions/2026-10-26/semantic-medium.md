# Why the clock matters in text diffusion

LLaCO's October 23 paper reallocates time along a continuous text-diffusion trajectory according to changes in token identity. It combines this with spherical noising and an adapter for a pretrained diffusion-language backbone. This is new to the October 26 edition of Frontier Fieldnotes, rather than a release from today. [Paper, v1](https://arxiv.org/abs/2610.32604v1).

The [interactive lab](https://kavehkamali.github.io/frontier-fieldnotes/semantic.html) makes the geometry tangible. Start with one vector, move it toward a noise direction, and keep asking which candidate it points toward most strongly. Smooth movement doesn't require a smooth change in the answer. A ranking can sit still for ages, then cross several boundaries in a small part of the path.

Before adding noise, try something simpler.

Choose “Shrink without noise.” The purple state gets shorter but never rotates. Cosine still picks the source because it compares directions. Euclidean distance also cares about the lengths of the candidates. A shorter candidate can become closer to the shrinking state, despite no change in its direction.

You can see that disagreement in the two winner labels. The toy deliberately includes a nearby, shorter candidate. It stops the state at length 0.05, above zero, so its direction stays defined. It isn't claiming a word has changed meaning. “Source” is just the label of the vector we started from.

Now switch to “Competition clock.” Here the state travels between orthogonal unit source and noise directions. The spherical path follows a quarter circle and keeps length one. The straight path cuts through the circle, getting shorter before growing again. Both are simple, completely known paths.

A rival passes the source when it gains enough alignment with the noise direction to overcome its initial disadvantage. Each candidate has its own crossing point. In this toy, candidates that have no advantage along the noise direction never cross. Count the crossings you've passed, add one, and you have the source's rank.

This is what the orange staircase shows. Rank changes in jumps because candidates are discrete, even though the moving vector is continuous. The cyan curve smooths those jumps so we can build a usable clock.

There's a trap in the picture: those dots aren't living in two dimensions.

The lab creates random unit directions in 8, 32, 128 or 512 dimensions, then shows their projection onto the source/noise plane. The current state always lies in that plane. Knowing each candidate's projection is therefore enough to calculate its dot product with the state exactly. The remaining coordinates contribute zero to that dot product.

That doesn't make the picture a full-space distance map. Two dots can look close on screen while their hidden coordinates differ. The rank readout uses the full-space calculation; eyeballing distances between projected dots can give a different answer.

Try raising the dimension while keeping vocabulary size fixed. Then change the seed. The crossing locations move, often bunching toward the noisy end. These are small random vocabularies, not a measured distribution of real words. Changing vocabulary size changes the competition too: more candidates provide more chances for someone to pass the source.

The bottom two rows spend the same number of intervals differently. One divides geometric progress evenly. The other uses this teaching rule:

`t(gamma) = 0.9 H(gamma) + 0.1 gamma`

Here, H is an endpoint-normalized, smoothed log-rank loss along this one synthetic path. The implementation smooths each crossing with a logistic curve. Equal increments of the resulting clock are then mapped back onto geometric progress.

Where the rank changes quickly, those dots get closer together. The 10% linear part makes the clock keep advancing even where the smoothed rank barely changes. Without some treatment of flat regions, reversing the clock can become ambiguous. The 10% linear floor follows the paper’s mapping form; our smoothed single-path log-rank curve replaces its fitted pretrained-vocabulary retention curve.

Rearranging dots is only a scheduling illustration. It doesn't train a denoiser, generate a sentence or measure inference speed. Playing the animation backward retraces a path whose endpoints and geometry are already known. The paper instead calibrates its schedule on pretrained token geometry and trains a language model around that process.

The reported results also deserve a narrow reading. Against Dream, LLaCO scores 62.12 versus 51.20 on MATH, but 48.17 versus 54.27 on HumanEval. That's a mixed comparison across tasks, not universal language-model leadership. The adaptation-token count excludes backbone pretraining. [Evaluation](https://arxiv.org/html/2610.32604v1).

As of October 26, inference code, training code and the 8B checkpoint are still unchecked items in the [official repository](https://github.com/WhenGIX/LLaCO). The lab is an explanation you can explore now, not a browser version of that model.

For a first share, export the zero-noise shrink. A fixed direction and a changing distance winner fit in one short loop. Then export the competition view with the same step budget on both rows. PNG captures the current settings; GIF makes an eight-second sweep out and back, with the source and synthetic-model label included.

# An almost empty attention matrix can still be slow

An attention diagram makes sparsity look easy. Keep a few bright squares, erase the rest, and there seems to be much less work left.

The missing piece is how you decided which squares to keep.

In ordinary attention, a query is compared with keys. The resulting scores become weights, and those weights combine the corresponding values. The matrix is a convenient picture of those interactions. In the [visual lab](https://kavehkamali.github.io/frontier-fieldnotes/#basics), rows are queries, columns are keys, and the colors represent synthetic weights.

Try the causal mask first. It prevents a position from reading later positions. That rule comes from how the sequence is allowed to use information. Now try top-k. It keeps a limited number of entries per row according to their scores. That introduces another choice: which interactions are worth retaining?

The picture updates immediately because it's small. In a large model, finding the largest scores may itself require substantial work. If you compute everything first and only then discard most of it, the final matrix can look sparse even though you already paid much of the cost.

There's also memory movement. A GPU processes data in layouts and chunks. A selection scattered across memory can be less convenient than a set of contiguous blocks, even if it contains fewer entries. The implementation has to turn the selection into work the hardware can actually skip.

And the information you keep has to be enough. A faint connection might still carry something useful. Removing it changes the weighted combination, and renormalizing the remaining weights changes their relative contribution. A heatmap by itself won't tell you the effect on the final answer.

[Elastic Threshold Attention](https://arxiv.org/abs/2609.20888v2), revised September 25, 2026, is a recent attempt to connect these concerns. ETA learns thresholds from query representations and uses a custom implementation to screen blocks during decoding. Its design includes how the model is trained and how the resulting pattern is executed. The authors evaluate quality and speed in specified language-model settings; those results don't automatically carry over to a video transformer with a different layout and workload.

The lab's top-k control is deliberately simpler. It helps explain what disappears from an attention pattern and how the remaining weights change. It doesn't reproduce ETA's training method, block screening or runtime behavior.

When reading a speed claim, follow the time all the way through. Selecting blocks, preparing metadata, reading memory and running the remaining computation all belong in the accounting. A faster attention kernel may save little overall time if another part of the model dominates. Batch size, context length and hardware also affect which cost matters most.

For a creator using an AI video tool, those implementation details eventually show up as waiting time, available resolution or the length of a clip that fits in memory. But an attractive attention diagram cannot establish any of those improvements on its own.

Try making the matrix sparser, then pause before treating the empty space as a win. The next thing to find in the paper is the work that actually disappeared, followed by the quality that remained.

— Kaveh / Frontier Fieldnotes

*Checked September 28, 2026. The graphic uses synthetic attention weights. The cited research has not been independently reproduced here.*

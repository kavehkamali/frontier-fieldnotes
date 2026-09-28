An attention matrix can be almost empty and still be slow.

Choosing what to skip costs time. The remaining work also needs to fit the way a GPU moves data. A nice sparsity percentage only tells part of that story.

Elastic Threshold Attention is a recent example worth looking at. It learns thresholds that change with the query, then skips blocks of context during decoding. The updated paper came out on September 25.

The practical question is whether the model keeps the information it needs while getting faster end to end. That depends on the model, context length and implementation.

The visual lab lets you switch between dense, causal and top-k patterns. Watch which connections disappear. The weights are synthetic, and this is a basic attention explainer rather than an ETA implementation.

Paper: https://arxiv.org/abs/2609.20888v2

Try it: https://kavehkamali.github.io/frontier-fieldnotes/#basics

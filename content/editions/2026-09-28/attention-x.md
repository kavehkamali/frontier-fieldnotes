1/3
An attention matrix can be almost empty and still be slow. Choosing what to skip costs time. The remaining work also has to suit the GPU. A sparsity percentage only tells part of the story.

2/3
ETA learns query-dependent thresholds and skips blocks of context during decoding. The latest revision is Sep 25. The useful comparison is quality and end-to-end latency at the same workload.
https://arxiv.org/abs/2609.20888v2

3/3
Switch between dense, causal and top-k patterns here. Watch which connections disappear. It's a synthetic attention explainer, not an ETA implementation.
https://kavehkamali.github.io/frontier-fieldnotes/#basics

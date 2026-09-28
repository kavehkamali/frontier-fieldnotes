“Sparse attention is faster” leaves out the hard part.

Imagine a query reading from a library of token memories. Dense attention reads broadly. Sparse attention tries to keep the useful shelves.

But selecting the shelves also costs time. And a GPU does not move memory one abstract token at a time.

That is why I separate three questions:

1. What information is removed?
2. How is it selected?
3. Does the implementation actually save wall-clock time at the quality we need?

Elastic Threshold Attention is a recent paper worth reading through that lens. It learns context-dependent thresholds for block-sparse decoding. Read the latest version: v2, September 25, 2026.

My attached matrix is a toy illustration of dense, causal and top-k patterns. It does not implement ETA, and brighter squares are synthetic weights—not measured model attention.

Primary source: https://arxiv.org/abs/2609.20888v2
Interactive lab: https://kavehkamali.github.io/frontier-fieldnotes/#lab

#MachineLearning #LLM #AIEngineering

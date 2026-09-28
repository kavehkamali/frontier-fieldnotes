# Context is not a weight update

A reference image, a prompt and a learned adapter can all change a generator’s behavior. They do not act in the same way.

Conditioning provides information to an otherwise fixed computation. Adaptation changes parameters that determine that computation. Keeping these separate makes model comparisons clearer.

LoRA expresses a weight update as the product of two matrices. For an output-by-input matrix, B has shape output-by-rank and A has shape rank-by-input. Their product has the shape needed to update the original matrix. The parameter count is rank × (input + output).

This only saves parameters relative to a full update when that quantity is smaller than input × output. “Low rank” is meaningful relative to the original dimensions; it is not a magic label guaranteeing efficiency at every setting.

[IC-LoRA](https://arxiv.org/abs/2410.23775v3) provides a useful foundation for discussing how joint image context and task-specific adaptation can work together. It was introduced in 2024. This article treats it as background, not a current frontier claim.

At inference, the reference content helps specify what to generate. The learned adapter shapes how the model uses such inputs. Supplying a new reference does not itself imply another optimization run.

The lab separates the matrix-factorization view from the joint-context view. Neither is a quality benchmark. They explain two distinct mechanisms so that newer papers can be read more critically.

When a method claims in-context ability, ask which parameters are fixed, which were adapted, what data the adaptation used, and what the model receives at inference. That is a more informative starting point than the label alone.

— Kaveh / Frontier Fieldnotes

*Short article draft. Checked September 28, 2026. [Explore the lab](https://kavehkamali.github.io/frontier-fieldnotes/).*

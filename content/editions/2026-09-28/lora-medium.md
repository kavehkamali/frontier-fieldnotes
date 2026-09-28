# What happens when a model “learns your character”?

You upload a few reference images. The next result looks more like your character. Somewhere in the interface, the tool says it has learned them.

That word can cover several different operations.

A model can use a reference image as an input while its weights stay fixed. The image supplies context for this generation. A trained adapter changes part of the computation itself, using an optimization process before you generate with it. A system can use both.

That difference is useful when deciding what to prepare for a project. Supplying a new reference and training a reusable adaptation have different workflows, even when the buttons look similar.

LoRA is one way to make the learned update relatively small. Instead of learning a full update to a weight matrix W, it factors an update into two matrices:

ΔW = B × A.

If W maps d input features to m output features, A has r rows and d columns, while B has m rows and r columns. Their product fits the original matrix. The rank of that product is at most r. A practical implementation may also apply a scaling factor. The base model's weights can stay frozen while the adapter is trained. [LoRA paper, 2021](https://arxiv.org/abs/2106.09685)

Here's the arithmetic for one illustrative layer. A 4,096-by-4,096 full matrix has 16,777,216 entries. With rank 16, the two adapter matrices together have 16 × (4,096 + 4,096) = 131,072 entries. That's 128 times fewer entries to learn for this update.

The original matrix hasn't vanished. You still need the base computation, and this arithmetic alone doesn't predict training time, generation speed or visual quality. It just shows why the parameter count can be attractive.

Increasing the rank gives the update more room to express changes. It doesn't promise that the images will improve. The training data, objective and optimization still matter. At a large enough rank, even the simple parameter-count advantage can disappear.

The [interactive diagram](https://kavehkamali.github.io/frontier-fieldnotes/#basics) lets you inspect the factorization and change the rank. It is a drawing of the mechanism, not an experiment measuring character consistency.

[IC-LoRA](https://arxiv.org/abs/2410.23775v3) brings adaptation and context together in diffusion transformers. The method arranges images jointly, uses captions describing the combined content, and applies task-specific LoRA tuning. The resulting model can then use reference content when generating. The training changes how it works with that context; providing another reference does not by itself imply that training runs again.

This is a foundation from 2024, not a new release. It earns its place in a current discussion because the same ambiguity keeps appearing in reference-driven image and video tools: what was learned beforehand, and what is being supplied for this output?

For a character workflow, those questions become practical. Can you swap a reference for the next shot? Does a reusable adapter have to be trained first? Which inputs guide appearance, pose or composition? What evidence shows that the identity survives a different angle or lighting setup?

You don't need the tool to expose every internal detail. You do need enough information to know what the preparation step buys you and how to change the result when it goes wrong.

The next time an interface says it has “learned” a subject, look at the operation behind the word. That will tell you more about how to use it than the label alone.

— Kaveh / Frontier Fieldnotes

*Checked September 28, 2026. The numerical example is simple matrix arithmetic. No adapter training or generated-image comparison was performed for this article.*

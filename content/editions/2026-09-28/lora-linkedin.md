Two things often get mixed together in AI explanations:

Giving a model context.
Changing its weights.

A reference image can influence the next output without any learning happening at inference time. LoRA, by contrast, is a way to learn a constrained weight update during adaptation.

For a matrix W, the update is often written ΔW = B × A. The inner dimension—the rank—controls the capacity of that update.

IC-LoRA combines task-specific low-rank tuning with jointly arranged images and captions. That makes it a useful example of how adaptation and conditioning work together.

This is foundational work from 2024, not a new release. I’m revisiting it because the distinction still matters when evaluating newer reference-conditioned generation systems.

The attached diagram is a schematic, not a generated-image comparison.

Original paper: https://arxiv.org/abs/2410.23775v3
Interactive lab: https://kavehkamali.github.io/frontier-fieldnotes/#lab

#GenerativeAI #MachineLearning #LoRA

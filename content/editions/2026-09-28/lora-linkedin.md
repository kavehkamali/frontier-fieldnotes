You can give a model a reference image without changing a single weight.

The image guides that generation. LoRA does something else: it learns a weight update during adaptation.

The little equation is ΔW = B × A. Two smaller matrices build the update. Their shared inner dimension is the rank, which limits how much the update can express.

IC-LoRA brings those ideas together. It arranges images and captions jointly, then uses task-specific LoRA tuning. So the reference inputs and the learned update both have a role.

This paper is from 2024. The distinction is still useful when a new tool says it can “learn your character”: find out whether you're supplying a reference, training an adapter, or doing both.

The lab shows the weight-update idea as a diagram. It doesn't compare generated images.

Paper: https://arxiv.org/abs/2410.23775v3

Try it: https://kavehkamali.github.io/frontier-fieldnotes/#basics

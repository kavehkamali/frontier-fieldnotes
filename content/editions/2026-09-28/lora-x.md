1/3
A reference image can guide a generation while the model's weights stay fixed. LoRA learns a weight update during adaptation. Those are different things happening at different stages.

2/3
LoRA writes that update as ΔW = B × A. IC-LoRA combines task-specific tuning with jointly arranged images and captions. This is a 2024 foundation, useful for understanding newer reference tools.
https://arxiv.org/abs/2410.23775v3

3/3
When a tool says it can “learn your character,” look for what actually happens: a reference input, a trained adapter, or both.
The lab illustrates the update with a simple diagram:
https://kavehkamali.github.io/frontier-fieldnotes/#basics

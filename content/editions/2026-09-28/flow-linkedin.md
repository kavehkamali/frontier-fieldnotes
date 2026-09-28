Lowering the step count shouldn't quietly change your camera move.

That's a failure case in FlashRender, submitted September 3: coarse sampling can change the motion of a generated video retake. The paper works on keeping that control consistent while reducing the sampling budget.

The useful bit to unpack is the path. A sampler follows directions through a changing field. If a large step cuts across a bend, the result can move away from what the finer calculation would produce.

The interactive lab lets you see this with colored samples, solver controls and a fixed seed. It's an analytic example of the mechanism. It doesn't run FlashRender or reproduce its video results.

Last week's ViRDM paper, submitted September 24, tackles another part of few-step video generation: post-training an existing causal generator without an online score teacher or learned critic. Its motion regularization is a reminder that good-looking frames don't tell the whole story.

Both are research reports with author-reported evidence. They address different tasks, so the results need separate comparisons.

Try the lab: https://kavehkamali.github.io/frontier-fieldnotes/#lab
FlashRender: https://arxiv.org/abs/2609.03563v1
ViRDM: https://arxiv.org/abs/2609.28923v1

Research checked September 28, 2026.

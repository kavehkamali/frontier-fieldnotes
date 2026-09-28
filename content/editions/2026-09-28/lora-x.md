1/3
Context is an input. A weight update changes the model. Reference-image conditioning does not automatically mean the model is learning new weights during inference.

2/3
LoRA learns an update ΔW = B × A with a small inner rank. IC-LoRA pairs task-specific adaptation with jointly composed images and captions.
Foundation, not breaking news: the original work is from 2024.
https://arxiv.org/abs/2410.23775v3

3/3
When comparing a new method, ask: what is learned during adaptation, and what is supplied during inference? That one distinction clears up a lot of confusion.
Visual explanation:
https://kavehkamali.github.io/frontier-fieldnotes/#lab

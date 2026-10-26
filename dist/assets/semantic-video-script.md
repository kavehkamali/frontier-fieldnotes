# Equal steps and unequal changes

45-second screen-recording script. Original analytic graphics; no model-generated footage. Research: LLaCO, October 23, 2026; newly covered October 26.

**0–8 seconds — competition view, slow progress sweep**

“LLaCO's October 23 paper changes the clock in text diffusion around token competition. Here's a small interactive way to see why.”

**8–20 seconds — select Shrink without noise; sweep from 0% to 70%**

“Shrink this vector. No noise, no rotation. Cosine still picks the source, but Euclidean distance can pick a shorter competitor. Length changes the answer.”

**20–33 seconds — return to Competition clock; highlight both step rows**

“Now move toward noise. Watch the source rank hold, then fall. Both rows have the same step budget. The adaptive clock puts more intervals around the changes.”

**33–45 seconds — change dimension, then show export controls**

“These are random vectors, not learned words. The toy clock includes a ten-percent linear floor. No denoiser runs here. Change the geometry, then export a PNG or GIF.”

Persistent small caption: Synthetic geometry · full-space ranks · no generated text.
End card: https://kavehkamali.github.io/frontier-fieldnotes/semantic.html
Source: https://arxiv.org/abs/2610.32604v1

Accessibility description: A purple vector moves among projected synthetic token directions. Cyan and orange markers identify cosine and Euclidean winners. A rank curve sits above evenly spaced and adaptively spaced sample grids. In the second mode, the vector shrinks without rotation and the two decoding rules can disagree.

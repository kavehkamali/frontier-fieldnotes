1/5
LLaCO (Oct 23) reallocates the clock in continuous text diffusion around changes in token rank. Equal geometric steps can hide very unequal changes in identity. New to this week's coverage, not a new Oct 26 release.
https://arxiv.org/abs/2610.32604v1

2/5
Try shrinking a vector without adding noise. Its direction stays fixed, yet Euclidean distance can pick a shorter competing embedding. Cosine keeps the source. The lab's "Shrink without noise" mode lets you watch that disagreement happen.

3/5
In "Competition clock," the source rank can stay flat, then fall quickly. Change 8 dimensions to 512 and try another seed. These are random token directions. Ranking uses exact full-space dot products, not distances between the plotted dots.

4/5
Same step budget, different spacing. The toy clock uses smoothed log-rank loss plus a 10% linear floor, keeping the whole path reachable. It's not LLaCO's fitted schedule. More dots near crossings do not prove better text or faster inference.

5/5
Drag the controls, compare straight and spherical paths, then export your view as PNG or a looping GIF. No trained model runs here; playing backward retraces known geometry. Original Oct 26 teaching lab:
https://kavehkamali.github.io/frontier-fieldnotes/semantic.html

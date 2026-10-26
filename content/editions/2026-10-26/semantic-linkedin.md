LLaCO's October 23 paper puts a useful idea behind text diffusion: move the clock around changes in token identity, instead of assuming equal steps through embedding space do equal work.

Here's the part that's easy to miss. Shrink a vector without adding any noise. Its direction stays exactly the same, but a nearest-distance decoder can switch to another token because that candidate has a shorter embedding.

The interactive has a button for that: “Shrink without noise.” Watch the cosine and Euclidean winners disagree.

Then switch to “Competition clock.” Move along the path and watch the source token's rank. It can hold steady for a long stretch, then drop quickly. The adaptive dots put more of the same step budget around those changes.

Try 8 dimensions, then 512. Change the seed too.

These are random synthetic token directions, not learned words. Rankings use the full space; the picture is a projection. The toy clock uses smoothed log-rank loss plus a 10% linear floor. It isn't LLaCO's fitted schedule, and no denoiser runs here.

PNG/GIF exports keep the settings and source caption.

Interactive: https://kavehkamali.github.io/frontier-fieldnotes/semantic.html
Paper, October 23; covered October 26: https://arxiv.org/abs/2610.32604v1

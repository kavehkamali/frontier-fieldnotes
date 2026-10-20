ResStreamGS, posted October 15, asks which Gaussian splats actually need another update. Its authors report better quality and lower payload than a controlled all-splats baseline across six sequences.

The interesting wrinkle: a surface can stay perfectly still and still need updating.

Think of a wall catching changing light. Its position hasn't moved. Its appearance has.

The interactive below makes that easy to poke at. There's a moving object, a panel that changes color, and a stable frame around it. Give the scene a fixed update budget, then switch between ranking by position and ranking by position plus color.

Watch what gets left behind.

Cached splats remain in the picture. They're reused at their old values, not deleted. Stretch the frame group and you save more update records, but the cached state can grow stale. Turn the camera and the visible error changes too.

This is a synthetic teaching scene, not a ResStreamGS reproduction. Its counter measures attribute records, not compressed bytes or network speed.

Try the color-change toggle first. It's a neat way to see why “not moving” and “safe to reuse” are different decisions.

Interactive: https://kavehkamali.github.io/frontier-fieldnotes/stream.html
Paper: https://arxiv.org/abs/2610.21121v1

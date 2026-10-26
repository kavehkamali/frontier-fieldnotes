import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULTS, normalize, vocabulary, stateAt, scores, crossing, sourceRank,
  schedule, analyze, exportFrame,
} from '../dist/semantic-math.mjs';

// Independent geometric checks: no tokenizer, trained embeddings or quality claim.
const close = (actual, expected, tolerance = 2e-12, context = '') => {
  assert.ok(Number.isFinite(actual), `${context}: expected finite value, got ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance,
    `${context}: ${actual} differs from ${expected} by more than ${tolerance}`);
};
const dot = (a, b) => a.reduce((sum, value, i) => sum + value * b[i], 0);
const length = a => Math.sqrt(dot(a, a));
const unit = a => a.map(x => x / length(a));
const distanceSquared = (a, b) => a.reduce((sum, value, i) => sum + (value - b[i]) ** 2, 0);
const combine = (a, x, b, y) => a.map((value, i) => value * x + b[i] * y);
const projectedToken = (direction, norm, id, source, noise) => ({
  id, a: dot(direction, source), b: dot(direction, noise), norm, name: `T${id}`,
});

// Check full vectors in a rotated eight-dimensional basis, including components
// outside the displayed plane. The oracle is direct vector arithmetic.
test('projected scores equal full-space cosine and negative squared distance', () => {
  const source = unit([1, 1, 0, 0, 0, 0, 0, 0]);
  const noise = unit([0, 0, 1, -1, 0, 0, 0, 0]);
  const directions = [source, unit([1, 2, 3, 4, 5, 6, 7, 8]),
    unit([-2, 1, 3, -5, 8, -1, 2, 7]), unit([0, 0, 0, 0, 1, 1, 1, 1])];
  const norms = [1, 0.35, 1.28, 0.91];
  const tokens = directions.map((u, i) => projectedToken(u, norms[i], i, source, noise));
  for (const path of ['sphere', 'linear']) for (const gamma of [0, 0.17, 0.5, 0.91, 1]) {
    const s = stateAt(gamma, path);
    const fullState = combine(source, s.x, noise, s.y);
    const result = scores(tokens, s);
    result.forEach((score, i) => {
      const embedding = directions[i].map(x => x * norms[i]);
      close(score.cosine, dot(embedding, fullState) / (length(embedding) * length(fullState)),
        2e-12, `cosine token ${i}, gamma ${gamma}`);
      close(score.euc, length(fullState) ** 2 - distanceSquared(embedding, fullState),
        2e-12, `Euclidean token ${i}, gamma ${gamma}`);
    });
  }
});

test('a nearer plotted point can lose both full-space rankings', () => {
  // T2 projects exactly onto the state, but its omitted component is sqrt(0.75).
  const directions = [[1, 0, 0], [0.6, 0.8, 0], [0.3, 0.4, Math.sqrt(0.75)]];
  const tokens = directions.map((u, id) => ({id, a: u[0], b: u[1], norm: 1}));
  const state = {x: 0.3, y: 0.4, norm: 0.5};
  const result = scores(tokens, state);
  assert.ok(distanceSquared(directions[2].slice(0, 2), [state.x, state.y]) <
    distanceSquared(directions[1].slice(0, 2), [state.x, state.y]));
  assert.ok(result[1].cosine > result[2].cosine);
  assert.ok(result[1].euc > result[2].euc);
  assert.ok(distanceSquared(directions[1], [0.3, 0.4, 0]) <
    distanceSquared(directions[2], [0.3, 0.4, 0]));
});

test('supported synthetic vocabularies are deterministic valid unit-direction projections', () => {
  for (const dimension of [8, 32, 128, 512]) {
    const cfg = {dimension, vocabulary: 32, seed: 7};
    const first = structuredClone(vocabulary(cfg));
    vocabulary({...cfg, seed: 8}); // Force a different cached realization.
    assert.deepEqual(vocabulary(cfg), first);
    assert.equal(first.length, 32);
    assert.deepEqual(first[0], {id: 0, a: 1, b: 0, norm: 1, name: 'SOURCE'});
    for (const t of first) {
      assert.ok(t.a ** 2 + t.b ** 2 <= 1 + 1e-12);
      assert.ok(t.norm > 0);
    }
  }
});

test('quarter-circle SLERP keeps unit norm while the linear path has its known midpoint', () => {
  for (let i = 0; i <= 1000; i++) {
    const s = stateAt(i / 1000, 'sphere');
    close(s.norm, 1);
    close(s.x ** 2 + s.y ** 2, 1);
  }
  const start = stateAt(0, 'sphere'), end = stateAt(1, 'sphere');
  close(start.x, 1); close(start.y, 0); close(end.x, 0); close(end.y, 1);
  const midpoint = stateAt(0.5, 'linear');
  close(midpoint.x, 0.5); close(midpoint.y, 0.5); close(midpoint.norm, Math.SQRT1_2);
});

test('noise-free shrink preserves source cosine rank but produces the predicted distance switch', () => {
  const source = {id: 0, a: 1, b: 0, norm: 1};
  const shorter = {id: 1, a: 0.8, b: 0.6, norm: 0.35};
  // Eq. 1 solved independently for alpha at a pairwise Euclidean tie.
  const alphaTie = (1 - 0.35 ** 2) / (2 * (1 - 0.35 * 0.8));
  const gammaTie = (1 - alphaTie) / 0.95;
  close(alphaTie, 0.609375);
  const pairAt = g => scores([source, shorter], stateAt(g, 'sphere', 'shrink'));
  close(pairAt(gammaTie)[0].euc, pairAt(gammaTie)[1].euc);
  assert.ok(pairAt(gammaTie - 1e-6)[0].euc > pairAt(gammaTie - 1e-6)[1].euc);
  assert.ok(pairAt(gammaTie + 1e-6)[0].euc < pairAt(gammaTie + 1e-6)[1].euc);
  for (let progress = 0; progress <= 100; progress++) {
    const result = analyze({...DEFAULTS, lesson: 'shrink', progress});
    assert.equal(result.rank, 1);
    assert.equal(result.directional[0].id, 0);
    close(result.scores[0].cosine, 1);
    close(result.norm, 1 - 0.95 * progress / 100);
    assert.ok(result.norm >= 0.05 - 1e-12);
  }
  assert.equal(analyze({lesson: 'shrink', progress: 0}).euclidean[0].id, 0);
  assert.equal(analyze({lesson: 'shrink', progress: 70}).euclidean[0].name, 'SHORT');
});

test('pairwise crossing equals the analytic threshold and changes direct score sign', () => {
  const rival = {id: 1, a: 0.8, b: 0.6, norm: 0.35};
  close(crossing(rival, 'linear'), 0.25);
  close(crossing(rival, 'sphere'), Math.atan(1 / 3) / (Math.PI / 2));
  assert.equal(crossing({id: 0, a: 1, b: 0}), Infinity);
  assert.equal(crossing({id: 1, a: 0.2, b: 0}), Infinity);
  assert.equal(crossing({id: 1, a: 0.2, b: -0.3}), Infinity);
  for (const dimension of [8, 32, 128, 512]) for (const path of ['sphere', 'linear']) {
    const tokens = vocabulary({dimension, vocabulary: 128, seed: 7});
    for (const token of tokens.slice(1)) {
      const threshold = crossing(token, path);
      if (!Number.isFinite(threshold)) continue;
      assert.ok(threshold > 0 && threshold < 1);
      const gap = gamma => {
        const scored = scores([tokens[0], token], stateAt(gamma, path));
        return scored[1].cosine - scored[0].cosine;
      };
      close(gap(threshold), 0, 2e-12);
      assert.ok(gap(threshold - 1e-7) < 0);
      assert.ok(gap(threshold + 1e-7) > 0);
    }
  }
});

test('source rank matches direct cosine ranking away from numerical ties', () => {
  for (const dimension of [8, 32, 128, 512]) for (const seed of [1, 7, 42]) {
    const tokens = vocabulary({dimension, vocabulary: 128, seed});
    for (const path of ['sphere', 'linear']) {
      let previous = 1;
      for (let i = 0; i <= 400; i++) {
        const gamma = i / 400;
        const values = scores(tokens, stateAt(gamma, path));
        const direct = 1 + values.slice(1).filter(t => t.cosine > values[0].cosine + 1e-12).length;
        const predicted = sourceRank(tokens, gamma, path);
        assert.equal(predicted, direct, `${dimension}D, seed ${seed}, ${path}, gamma ${gamma}`);
        assert.ok(predicted >= previous);
        previous = predicted;
      }
      assert.equal(sourceRank(tokens, 0, path), 1);
      assert.equal(sourceRank(tokens, 1, path), 1 + tokens.slice(1).filter(t => t.b > 0).length);
    }
  }
  // Strict source tie retention at an exactly representable linear crossing.
  const pair = [{id: 0, a: 1, b: 0, norm: 1}, {id: 1, a: 0, b: 1, norm: 1}];
  assert.equal(sourceRank(pair, 0.5, 'linear'), 1);
  assert.equal(sourceRank(pair, 0.500001, 'linear'), 2);
});

test('UI rank and analytic plot retain the source at floating-point pairwise ties', () => {
  const cfg = {dimension: 8, vocabulary: 128, seed: 1};
  const tokens = vocabulary(cfg);
  for (const path of ['linear', 'sphere']) {
    for (const token of tokens.slice(1).filter(t => Number.isFinite(crossing(t, path))).slice(0, 16)) {
      const gamma = crossing(token, path);
      const expected = 1 + tokens.slice(1).filter(t => crossing(t, path) < gamma - 1e-12).length;
      const result = analyze({...cfg, path, progress: gamma * 100});
      assert.equal(sourceRank(tokens, gamma, path), expected);
      assert.equal(result.rank, expected, `${path}, rival ${token.id}: roundoff must not count a tie as an overtake`);
      assert.equal(result.directional.findIndex(t => t.id === 0) + 1, expected);
    }
  }
});

test('toy clock is endpoint-normalized, strictly increasing and invertible', () => {
  for (const dimension of [8, 128, 512]) for (const path of ['sphere', 'linear']) {
    const clock = schedule(vocabulary({dimension, vocabulary: 128, seed: 7}), path);
    close(clock.decay(0), 0); close(clock.decay(1), 1);
    close(clock.time(0), 0); close(clock.time(1), 1);
    assert.equal(clock.inverse(-1), 0); assert.equal(clock.inverse(2), 1);
    let previousTime = clock.time(0), previousDecay = clock.decay(0);
    for (let i = 1; i <= 500; i++) {
      const gamma = i / 500, time = clock.time(gamma), decay = clock.decay(gamma);
      assert.ok(decay >= previousDecay - 2e-14);
      assert.ok(time - previousTime >= 0.1 / 500 - 2e-14, 'linear floor preserves reachability');
      close(clock.inverse(time), gamma, 1e-11);
      close(clock.time(clock.inverse(gamma)), gamma, 1e-11);
      previousTime = time; previousDecay = decay;
    }
    const result = analyze({dimension, path, steps: 12});
    assert.equal(result.semantic.length, 13);
    assert.equal(result.uniform.length, 13);
    result.semantic.forEach((gamma, i) => close(clock.time(gamma), i / 12, 1e-11));
    for (let i = 1; i < result.semantic.length; i++) assert.ok(result.semantic[i] > result.semantic[i - 1]);
  }
});

test('no-crossing geometry has a finite identity-clock fallback', () => {
  const tokens = [{id: 0, a: 1, b: 0, norm: 1}, {id: 1, a: 0, b: -1, norm: 1}];
  const clock = schedule(tokens);
  assert.deepEqual(clock.thresholds, []);
  for (const gamma of [0, 0.1, 0.5, 0.9, 1]) {
    close(clock.time(gamma), gamma);
    close(clock.decay(gamma), gamma);
    close(clock.inverse(gamma), gamma);
  }
});

test('normalization and path evaluation clamp supported input bounds', () => {
  const lower = normalize({progress: -20, seed: -5, steps: -4, dimension: 17, vocabulary: 2,
    path: 'unknown', lesson: 'unknown'});
  assert.equal(lower.progress, 0); assert.equal(lower.seed, 1); assert.equal(lower.steps, 4);
  assert.equal(lower.dimension, 128); assert.equal(lower.vocabulary, 128);
  assert.equal(lower.path, 'sphere'); assert.equal(lower.lesson, 'competition');
  const upper = normalize({progress: 150, seed: 50000, steps: 90});
  assert.equal(upper.progress, 100); assert.equal(upper.seed, 9999); assert.equal(upper.steps, 32);
  const invalid = normalize({progress: NaN, seed: Infinity, steps: -Infinity, dimension: 'bad', vocabulary: undefined});
  for (const key of ['progress', 'seed', 'steps', 'dimension', 'vocabulary']) assert.equal(invalid[key], DEFAULTS[key]);
  assert.deepEqual(stateAt(-1), stateAt(0)); assert.deepEqual(stateAt(2), stateAt(1));
  const original = {progress: 20}; normalize(original); assert.deepEqual(original, {progress: 20});
});

test('export starts at the selected state, preserves settings and produces a bounded seamless sweep', () => {
  for (const progress of [-10, 0, 0.3, 50, 91, 100, 110]) {
    const input = {progress, dimension: 32, vocabulary: 512, seed: 42, steps: 19, path: 'linear', lesson: 'shrink'};
    const saved = structuredClone(input), normalized = normalize(input), frames = 60;
    const first = exportFrame(input, 0, frames), loop = exportFrame(input, frames, frames);
    close(first.progress, normalized.progress, 2e-12);
    close(loop.progress, first.progress, 2e-12);
    for (let i = 0; i < frames; i++) {
      const frame = exportFrame(input, i, frames);
      assert.ok(frame.progress >= 0 && frame.progress <= 100);
      for (const key of ['dimension', 'vocabulary', 'seed', 'steps', 'path', 'lesson'])
        assert.equal(frame[key], normalized[key]);
    }
    assert.deepEqual(input, saved);
  }
  close(exportFrame({progress: 0}, 30, 60).progress, 100);
  close(exportFrame({progress: 100}, 30, 60).progress, 0);
});

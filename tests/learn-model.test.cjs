const assert = require('node:assert/strict');
const L = require('../js/learn-model.js');
const close = (actual, expected) => actual.forEach((v, i) => assert.ok(Math.abs(v - expected[i]) < 1e-12));
const cases = { flip: [0, 1], twice: [1, 0], quantum: [.5, .5], undo: [1, 0], read: [.5, .5], phase: [0, 1], pair: [.5, 0, 0, .5] };
Object.entries(cases).forEach(([id, probabilities]) => {
  close(L.expected(id, 3), probabilities);
  const r = L.run(id, 3, 40);
  assert.equal(r.counts.reduce((a, b) => a + b), 40);
  r.outcomes.forEach(outcome => assert.ok(probabilities[outcome] > 0));
});
for (let target = 0; target < 4; target++) {
  const expected = [0, 0, 0, 0]; expected[target] = 1;
  close(L.expected('search', target), expected);
  assert.ok(L.run('search', target, 40).outcomes.every(x => x === target));
}
// Mid-circuit measurement changes the state for the second H, not just a label.
const midZero = L.trial('read', 0, () => .1);
const midOne = L.trial('read', 0, () => .9);
close(midZero.frames[2], [1, 0]); close(midOne.frames[2], [0, 1]);
close(midZero.frames[3], [Math.SQRT1_2, Math.SQRT1_2]);
close(midOne.frames[3], [Math.SQRT1_2, -Math.SQRT1_2]);
assert.notDeepEqual(L.expected('read'), L.expected('undo'));
console.log('PASS: all beginner experiments, intermediate measurement branches, sampling and every search target.');

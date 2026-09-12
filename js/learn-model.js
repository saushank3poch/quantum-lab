/* The beginner experiments use the same gate model as the full lab.
 * Intermediate measurements branch the exact probability calculation; each
 * sampled run separately executes those measurements. No canned outcomes. */
(function (root) {
  'use strict';
  var Q = root.Quantum;
  if (typeof module !== 'undefined') Q = require('./model.js');
  var experiments = {
    flip: { n: 1, ops: ['X'] },
    twice: { n: 1, ops: ['X', 'X'] },
    quantum: { n: 1, ops: ['H'] },
    undo: { n: 1, ops: ['H', 'H'] },
    read: { n: 1, ops: ['H', 'M', 'H'] },
    phase: { n: 1, ops: ['H', 'Z', 'H'] },
    pair: { n: 2, ops: ['H', 'CX'] },
    search: { n: 2, ops: ['HH', 'O', 'D'] }
  };
  function apply(a, op, target) {
    if (op === 'X') return Q.x(a, 0);
    if (op === 'H') return Q.h(a, 0);
    if (op === 'Z') return Q.z(a, 0);
    if (op === 'CX') return Q.cnot(a, 0, 1);
    if (op === 'HH') return Q.h(Q.h(a, 0), 1);
    if (op === 'O') return Q.oracle(a, target);
    if (op === 'D') return Q.diffuse(a);
    throw Error('Unknown operation: ' + op);
  }
  function expected(id, target) {
    var spec = experiments[id];
    var branches = [{ weight: 1, vector: Q.initial(spec.n) }];
    spec.ops.forEach(function (op) {
      var next = [];
      branches.forEach(function (b) {
        if (op !== 'M') { next.push({ weight: b.weight, vector: apply(b.vector, op, target) }); return; }
        Q.probabilities(b.vector).forEach(function (p, i) {
          if (p < 1e-14) return;
          var a = b.vector.map(function () { return 0; }); a[i] = 1;
          next.push({ weight: b.weight * p, vector: a });
        });
      });
      branches = next;
    });
    var result = Q.initial(spec.n).map(function () { return 0; });
    branches.forEach(function (b) { Q.probabilities(b.vector).forEach(function (p, i) { result[i] += b.weight * p; }); });
    return result;
  }
  function trial(id, target, random) {
    var spec = experiments[id], a = Q.initial(spec.n), frames = [a.slice()];
    spec.ops.forEach(function (op) {
      a = op === 'M' ? Q.measure(a, random).state : apply(a, op, target);
      frames.push(a.slice());
    });
    var measured = Q.measure(a, random);
    frames.push(measured.state);
    return { frames: frames, outcome: measured.outcome };
  }
  function run(id, target, count, random) {
    var results = [], counts = Q.initial(experiments[id].n).map(function () { return 0; }), first;
    for (var i = 0; i < count; i++) {
      var t = trial(id, target, random); if (!first) first = t;
      results.push(t.outcome); counts[t.outcome]++;
    }
    return { outcomes: results, counts: counts, frames: first.frames, expected: expected(id, target) };
  }
  var api = { experiments: experiments, expected: expected, trial: trial, run: run };
  root.LearnModel = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);

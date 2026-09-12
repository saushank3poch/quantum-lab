/* Exact real-amplitude statevector model. These gates preserve real amplitudes;
 * this is not a general complex-gate simulator. Bit order is q0 q1 (q0 left).
 * No DOM or drawing dependency. */
(function (global) {
  'use strict';
  function initial(n) { var a = Array(Math.pow(2, n)).fill(0); a[0] = 1; return a; }
  function qubits(a) { return Math.round(Math.log2(a.length)); }
  function mask(a, q) { return 1 << (qubits(a) - 1 - q); }
  function gate(a, q, m) {
    var b = a.slice(), bit = mask(a, q);
    for (var i = 0; i < a.length; i++) if (!(i & bit)) {
      b[i] = m[0] * a[i] + m[1] * a[i | bit];
      b[i | bit] = m[2] * a[i] + m[3] * a[i | bit];
    }
    return b.map(function (v) { return Math.abs(v) < 1e-14 ? 0 : v; });
  }
  function h(a, q) { var r = Math.SQRT1_2; return gate(a, q, [r, r, r, -r]); }
  function x(a, q) { return gate(a, q, [0, 1, 1, 0]); }
  function z(a, q) { return gate(a, q, [1, 0, 0, -1]); }
  function cnot(a, control, target) {
    var b = a.slice(), c = mask(a, control), t = mask(a, target);
    for (var i = 0; i < a.length; i++) b[(i & c) ? i ^ t : i] = a[i];
    return b;
  }
  function oracle(a, marked) { return a.map(function (v, i) { return i === marked ? -v : v; }); }
  function diffuse(a) {
    var mean = a.reduce(function (sum, v) { return sum + v; }, 0) / a.length;
    return a.map(function (v) { return 2 * mean - v; });
  }
  function probabilities(a) { return a.map(function (v) { return v * v; }); }
  function sample(p, random) {
    var r = (random || Math.random)(), sum = 0;
    for (var i = 0; i < p.length; i++) { sum += p[i]; if (r < sum) return i; }
    return p.length - 1;
  }
  function measure(a, random) {
    var outcome = sample(probabilities(a), random), b = a.map(function () { return 0; });
    b[outcome] = 1;
    return { outcome: outcome, state: b };
  }
  // ASSUMED: independent symmetric output bit flips; no gate or decoherence noise.
  function readout(p, error) {
    var n = Math.round(Math.log2(p.length));
    return p.map(function (_, out) {
      return p.reduce(function (sum, probability, input) {
        var flips = 0, bits = out ^ input;
        for (var q = 0; q < n; q++) flips += (bits >> q) & 1;
        return sum + probability * Math.pow(error, flips) * Math.pow(1 - error, n - flips);
      }, 0);
    });
  }
  function shots(a, count, error, random) {
    // Each sample represents a fresh identical preparation, then measurement.
    var p = readout(probabilities(a), error), counts = a.map(function () { return 0; });
    for (var i = 0; i < count; i++) counts[sample(p, random)]++;
    return counts;
  }
  function label(i, n) { return i.toString(2).padStart(n, '0'); }
  function prepare(mode, phase, marked) {
    var a = initial(mode === 'interference' ? 1 : 2);
    if (mode === 'interference') return h(phase ? z(h(a, 0), 0) : h(a, 0), 0);
    if (mode === 'bell') return cnot(h(a, 0), 0, 1);
    return diffuse(oracle(h(h(a, 0), 1), marked));
  }
  var api = { initial: initial, qubits: qubits, h: h, x: x, z: z, cnot: cnot,
    oracle: oracle, diffuse: diffuse, probabilities: probabilities, readout: readout,
    measure: measure, shots: shots, label: label, prepare: prepare };
  global.Quantum = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);

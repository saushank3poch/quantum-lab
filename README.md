# Quantum Field Lab

An interactive quantum computing lab for saushank3poch. Follow a state carrier through interference, Bell-pair entanglement, and a four-candidate Grover search. The calculations drive the amplitude bars, the station readouts, and the shot histograms.

## Run

Open `index.html` directly, or serve this directory with `python3 -m http.server 8765`. There is no build step, runtime dependency, external asset, or API call. Links to sources open only when selected.

## Controls

| Control | Action |
| --- | --- |
| Experiment tabs | Start the selected experiment |
| Numbered stops, circuit blocks, or buildings | Recompute through that stop and pause |
| Play / Space | Play or pause |
| Next / S | Travel to the next station, then pause |
| Replay / R | Restart the guided tour and clear reading history |
| F / Follow | Toggle the following camera |
| L / Labels | Toggle labels |
| Drag / pinch / scroll | Pan or zoom |
| Fit / double-click | Show the entire lab |
| Phase flip / marked answer | Recompute the current stop and pause |
| Readout error | Recompute the shot sample using the selected output error |
| The science | Pause and open sources and fidelity notes; Escape closes |

The first visit to a stop waits for its text to be read: `min(30, max(12, words / 3.8 + 3.5))` seconds, divided by the selected speed. Later visits wait 1.4 seconds. Normal replays preserve reading history; the dedicated Replay control clears it. The three tours total approximately eight minutes at 1×. Reduced-motion preferences pause the initial animation.

## Station operations

The route and circuit run left to right in the strip. Bit strings are written q0 q1, with q0 on the left. Every measurement uses the computational (Z) basis.

| Stop | Interference | Entanglement | Search |
| --- | --- | --- | --- |
| Preparation dock | Initialize one qubit | Initialize two qubits | Initialize two qubits |
| Hadamard hall | H | H on q0 | H on both qubits |
| Tower | Optional Z | CNOT, q0 controls q1 | Phase oracle for the marked candidate |
| Bridge | H | Inspect without changing state | Reflect amplitudes about the mean |
| Readout room | Measure | Measure both | Measure both |
| Statistics terrace | 1,024 fresh preparations | 1,024 fresh preparations | 1,024 fresh preparations |

## How much of it is real

**Computed:** `js/model.js` performs real-valued statevector operations for H, X, Z, CNOT, a phase oracle, and diffusion. It computes squared-amplitude probabilities, samples measurement outcomes, collapses the state, and draws 1,024 independent samples from fresh identical preparations. `js/sim.js` applies the operations at the appropriate stops. Both `js/render.js` and `js/ui.js` read that same state. X is included in the model and tested; it is not a separate tour station.

**Scaled down:** one or two qubits, four search candidates, one marked target. All 1,024 preparations are sampled together instead of animating every repetition. This is a small teaching model, not a performance benchmark.

**Assumed:** initialization and gates are ideal. Measurement is in the Z basis. Optional readout error independently flips each reported bit with probability p. It does not model decoherence, imperfect gates, leakage, or correlated noise. Sampling uses browser pseudorandom numbers. Only real-amplitude gates are included; this is not a general complex-gate simulator.

**Visual metaphor:** buildings, roads, travel time, and the moving carrier are invented. Qubits do not move through a town. The carrier displays simulator state information unavailable from a single hardware measurement. Search-oracle construction cost and hardware timing are omitted. Trust the computed amplitudes and probabilities; treat the lab as an illustration.

Matching outputs in the Bell experiment alone do not prove entanglement: classical correlated bits can produce the same Z-basis distribution. Here the ideal circuit calculation establishes the Bell state. Entanglement does not provide controllable faster-than-light communication. Quantum computing does not reveal all candidate answers in one measurement.

## Foundations and accuracy checks

- [Microsoft: qubits, gates, and measurement](https://learn.microsoft.com/en-us/azure/quantum/concepts-the-qubit)
- [IBM Quantum: circuits and Bell states](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/quantum-circuits/circuits)
- [Microsoft: Grover theory](https://learn.microsoft.com/en-us/azure/quantum/concepts-grovers)
- [IBM Quantum: readout error](https://quantum.cloud.ibm.com/docs/en/tutorials/readout-error-mitigation-sampler)

Run `node tests/model.test.cjs` to verify H-H, H-Z-H, X, Bell amplitudes, all four search targets, measurement collapse, the independent readout channel, and shot totals. At a per-bit error probability of 0.1, Bell outcomes have expected probabilities 0.41, 0.09, 0.09, 0.41. At error probability 0.5 the reported two-bit distribution is uniform.

Browser validation covers every station in every experiment, all target selections, the phase switch, sampling, noise, quizzes, step/pause controls, modal keyboard behavior, guide toggle, full animated station ordering, console errors, and desktop/mobile/landscape layouts. Visual checks include device pixel ratio 2.

## Files and architecture

| File | Responsibility |
| --- | --- |
| `index.html` | Layout, controls, science notes, attribution |
| `css/styles.css` | Responsive interface and typography |
| `js/iso.js` | Learnscape projection, routes, drawing primitives |
| `js/model.js` | Pure, independently testable quantum calculations |
| `js/world.js` | Station narration, routes, waypoints |
| `js/sim.js` | Station operations, run state, reading pace |
| `js/render.js` | Ground, sorted landmarks/carrier, labels |
| `js/ui.js` | Controls and calculated readouts |
| `js/main.js` | Canvas camera, pointer/keyboard input, frame loop |

Station distances are anchored to route waypoints. Model operations happen only at stops; travel is illustrative. Jumping to a stop resets and applies all preceding operations, preventing stale or inconsistent quantum state. Landmarks sit behind their stopping points so they do not hide the carrier. Footprint objects share a depth-sorted painter pass; labels use CSS pixel coordinates with the device pixel ratio transform.

## Credits

Inspired by [Laurentiu Raducu’s learning flow](https://laurentiugabriel.github.io/blog/articles/how-i-use-llms-to-learn/) and [Learnscape](https://github.com/LaurentiuGabriel/learnscape). The projection and camera originate from Learnscape; the simulation pacing is adapted from it. Its MIT license and copyright notice are preserved in `LICENSE`.

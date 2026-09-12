(function (global) {
  'use strict';
  var I = global.Iso;
  var positions = [[4,9],[4,3],[12,3],[21,3],[21,12],[12,17]];
  var colors = ['#11847f','#4686ba','#9073bf','#158f94','#df9751','#4e7e95'];
  var lesson = {
    interference: [
      ['Preparation dock','Start with a known state','A qubit begins at 0. What happens next depends on its amplitudes.',
       'The yellow carrier holds one qubit, initialized to |0⟩. Its two bars represent amplitudes for the outcomes 0 and 1: right now they are 1 and 0. Squaring an amplitude gives the probability of that outcome. A classical bit also returns a definite 0 or 1 when read; the difference here is that quantum gates can transform amplitudes, including their relative signs, before we measure. The carrier is a picture of the state, not a particle moving through a real computer.','|0⟩'],
      ['Hadamard hall','Create a superposition','One H gate gives two equally likely outcomes. It does more than toss a coin.',
       'Watch the carrier grow two equal bars. The Hadamard gate, written H, changes |0⟩ into (|0⟩ + |1⟩)/√2. Each amplitude is about +0.707, so each squared amplitude is 0.5. Measuring now would return 0 or 1 with equal probability. But we have not measured. The two amplitudes still form a coherent quantum state and can interfere at a later gate. This distinction is why a superposition cannot be understood as just an ordinary hidden coin result.','H'],
      ['Phase tower','Change the relative sign','A phase flip changes an amplitude without changing its probability.',
       'With “Phase flip” on, the Z gate changes the amplitude of |1⟩ from +0.707 to −0.707. Its bar turns purple. Squaring either value still gives 0.5, so measuring at this stop cannot reveal the sign change. Relative phase matters because the next H gate combines amplitudes by addition and subtraction. Try the switch, then replay: with no phase flip the two amplitudes have the same sign; with the flip they have opposite signs. A negative amplitude is not a negative probability.','Z / I'],
      ['Interference bridge','Recombine the amplitudes','The second H turns an invisible sign difference into a definite outcome.',
       'H adds the incoming amplitudes for output 0 and subtracts them for output 1, dividing each result by √2. With the phase flip on, the amplitude for 0 cancels and the amplitude for 1 becomes 1. With the flip off, it is the other way around. Two H gates therefore return |0⟩ to |0⟩, while H then Z then H produces |1⟩. This is interference: controlling which amplitudes reinforce and which cancel. No measurement happened between the gates.','H'],
      ['Readout room','Measure once','A measurement gives one classical result, not the full state.',
       'The readout chooses one result using the squared amplitudes. The carrier now shows the state after measurement: only the observed outcome has amplitude 1. This tour measures in the computational, or Z, basis. Measuring this same state again without another operation would ideally repeat its result. On actual hardware, one measurement does not expose all the amplitude bars shown here. Those bars are available because this small simulation tracks the full state mathematically.','M'],
      ['Statistics terrace','Repeat the experiment','Each shot starts over. More shots estimate probabilities more closely.',
       'The histogram comes from 1,024 independently sampled runs of the same preparation, gates, and measurement. The expected probabilities and the sampled counts are shown separately. Try a readout bit-flip probability of 10%: some reported bits will differ from their ideal outcomes. This is a deliberately simple model of readout error, not a model of all hardware noise. Increasing the number of shots can reduce sampling uncertainty, but cannot remove a systematic error in the device.','1,024 shots']
    ],
    bell: [
      ['Preparation dock','Prepare two qubits','Two qubits begin together in |00⟩.',
       'This carrier now holds a joint two-qubit state. The four bars correspond to 00, 01, 10, and 11. We write bits in the order q0 q1, so q0 is the leftmost bit. Initially the amplitude of 00 is 1 and all others are 0. The four amplitudes describe the pair together. They are not four independent bits, and a single measurement will return only one of the four possible bit strings. We will use two gates to create an entangled pair.','|00⟩'],
      ['Hadamard hall','Put q0 in superposition','H on the first qubit makes 00 and 10 equally likely.',
       'The first qubit passes through H while the second stays at 0. The joint state becomes (|00⟩ + |10⟩)/√2. Only the 00 and 10 bars rise, each to about +0.707. At this point the pair is not entangled: its state is a superposition on q0 multiplied by |0⟩ on q1. Measuring the second qubit would definitely return 0. The next gate will couple the two qubits and change the structure of their joint state.','H(q0)'],
      ['Coupling tower','Apply a controlled flip','CNOT moves the 10 amplitude to 11.',
       'A controlled-NOT gate flips q1 when q0 is 1 and leaves q1 alone when q0 is 0. Applied coherently to this superposition, it leaves the 00 amplitude where it is and moves the 10 amplitude to 11. The result is (|00⟩ + |11⟩)/√2, a Bell state. This state cannot be split into a separate pure state for each qubit. The linked pair of towers represents that joint description; it does not represent a message sent between the qubits.','CX'],
      ['Correlation bridge','Inspect the Bell state','Each bit is random, but the pair agrees when measured in this basis.',
       'The joint probabilities are 50% for 00, 50% for 11, and 0% for the two mismatched outcomes. Either qubit by itself has a 50/50 result. The bridge does not apply another gate; it is a stop to inspect the state created by H and CNOT. Matching outputs alone are not proof of entanglement: classical correlated bits can match too. Here, the ideal circuit calculation establishes the Bell state. Entanglement cannot be used to send a controllable message faster than light.','Inspect'],
      ['Readout room','Read both qubits','One shot yields either 00 or 11 in the ideal model.',
       'Both qubits are measured in the computational basis. The simulator samples the joint distribution, giving 00 or 11 with equal probability, then updates the state to the measured result. The unmeasured Bell state is no longer present after this measurement. To get another independent Bell-pair sample, we must prepare the pair again and repeat H and CNOT. A second measurement of these already measured qubits would ideally repeat the same two-bit result.','M ⊗ M'],
      ['Statistics terrace','Collect Bell-pair shots','The two matching outcomes fill the histogram; finite counts need not match.',
       'These 1,024 shots represent fresh Bell-pair preparations. Counts usually differ slightly between 00 and 11 even though their ideal probabilities are equal. Add independent readout bit flips and the mismatched outcomes 01 and 10 can appear. At a 10% flip probability per bit, the expected probability of each mismatched string is 9%. The slider changes only the reported measurement bits. It does not simulate decoherence, imperfect gates, or the many other errors found in physical processors.','1,024 shots']
    ],
    grover: [
      ['Preparation dock','A search with four candidates','Two qubits label four possible candidates: 00, 01, 10, and 11.',
       'This experiment demonstrates one iteration of Grover’s search algorithm for exactly four candidates and exactly one marked answer. The two-qubit register starts at |00⟩, and an oracle will recognize the selected target. Choose a target in the control panel and replay to see how the amplitudes change. This small example exposes the mechanism of amplitude amplification. It is not a practical speed benchmark: building an oracle and running its gates have costs that a tiny visual demonstration does not measure.','|00⟩'],
      ['Hadamard hall','Spread the amplitudes','H on both qubits creates four equal amplitudes.',
       'Applying H to q0 and then q1 produces a uniform superposition of all four bit strings. Each amplitude is +0.5, and each measurement probability is 0.25. Measuring now would simply choose a random candidate. The algorithm needs to make the marked candidate more likely before measurement. Quantum search does not let us read four answers at once; the benefit comes from the way the following operations reshape this distribution. Watch for a change of sign at the oracle.','H ⊗ H'],
      ['Oracle tower','Mark one candidate','The oracle flips the target amplitude’s sign, leaving its probability unchanged.',
       'The oracle applies a phase of −1 only to the selected target. That one amplitude changes from +0.5 to −0.5; the other three stay positive. All four squared amplitudes are still 0.25. The oracle recognizes a solution without measuring the register. In a real problem, that recognition must be implemented as a reversible quantum operation. Here the target selector defines the oracle directly, so its construction cost is deliberately omitted. The next operation converts this sign pattern into a useful probability change.','Oracle'],
      ['Amplifier bridge','Reflect about the mean','Interference concentrates all the probability on the marked candidate.',
       'The diffusion step replaces each amplitude a with 2 × mean − a. After the oracle, the mean of the four amplitudes is 0.25. Each unmarked amplitude therefore becomes 0.5 − 0.5 = 0, while the marked amplitude becomes 0.5 − (−0.5) = 1. One ideal iteration is enough for this special four-candidate, one-target case. Larger search spaces need a carefully chosen number of iterations; repeating the operation too many times can reduce the chance of success.','Diffusion'],
      ['Readout room','Measure the amplified state','The ideal four-candidate circuit returns the marked answer with certainty.',
       'The target now has squared amplitude 1, so this ideal measurement returns the marked two-bit string with 100% probability. The other candidates have probability 0. This exact result relies on four candidates, one marked solution, and ideal operations. Grover’s algorithm more generally reduces the number of oracle queries for unstructured search from order N to order √N. That query improvement does not by itself account for oracle construction, hardware errors, or the total time of a practical computation.','M ⊗ M'],
      ['Statistics terrace','Test the result','Ideal shots all find the target. Readout errors can change the reported bits.',
       'Every fresh ideal preparation in this four-candidate example ends at the target. Turn up the independent readout bit-flip probability to see the observed histogram spread. At 10% per bit, the probability that both target bits are reported correctly is 0.9 × 0.9 = 81%. This models only the last readout step. A real search circuit also faces errors during state preparation and gates, so these results should not be interpreted as a hardware performance estimate.','1,024 shots']
    ]
  };
  var route = I.makeRoute([[4,12],[4,9],[4,3],[12,3],[21,3],[21,12],[21,17],[12,17],[4,17],[4,12]]);
  var indices = [1,2,3,4,5,7];
  var world = { GW:26, GH:21, routes:{out:route}, stations:{out:indices.map(function (at,i) { return {id:'s'+i,dist:route.cum[at],dwell:1.4}; })},
    districts:[], stationToDistrict:{}, lesson:lesson,
    build:function (mode) {
      world.districts=lesson[mode || 'interference'].map(function (data,i) {
        return {id:'s'+i,index:i,x:positions[i][0],y:positions[i][1],r:3,color:colors[i],name:data[0],tag:data[1],short:data[2],body:data[3],gate:data[4]};
      });
    },
    readSeconds:function(id) { var d=world.districts[Number(id.slice(1))]; return Math.min(30,Math.max(12,(d.short+' '+d.body).split(/\s+/).length/3.8+3.5)); }
  };
  global.World=world;
})(window);

const assert = require('node:assert/strict');
const M = require('../js/search-model.js');
const Q = require('../js/model.js');
const near = (a,b) => assert.ok(Math.abs(a-b)<1e-11, `${a} != ${b}`);
for (const [size, rounds] of [[4,1],[16,3],[64,6],[256,12]]) {
  let total = 0;
  for (let target=0;target<size;target++) {
    const p=M.prepare(size,target);
    assert.equal(p.rounds,rounds);
    near(p.probability,Math.sin((2*rounds+1)*Math.asin(1/Math.sqrt(size)))**2);
    near(Q.probabilities(p.vector).reduce((a,b)=>a+b),1);
    near(p.chances[0],1/size);
    const c=M.classical(p);
    assert.equal(c.outcome,target);
    assert.equal(c.checks,target+1);
    total+=c.checks;
    // Choose a sample in the middle of the marked outcome's probability interval.
    const probs=Q.probabilities(p.vector);
    const midpoint=probs.slice(0,target).reduce((a,b)=>a+b,0)+probs[target]/2;
    const success=M.attempt(p,()=>midpoint);
    assert.equal(success.success,true);
    assert.equal(success.checks,rounds+1);
  }
  near(total/size,(size+1)/2);
}
const miss=M.attempt(M.prepare(16,15),()=>0);
assert.equal(miss.success,false);
assert.equal(miss.outcome,0);
assert.equal(miss.checks,4);
assert.throws(()=>M.prepare(32,0),RangeError);
assert.throws(()=>M.prepare(4,4),RangeError);
console.log('PASS all 340 targets: normalization, analytic success probabilities, rounds, classical average, verification costs and quantum failure.');

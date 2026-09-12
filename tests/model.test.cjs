const assert = require('node:assert/strict');
const Q = require('../js/model.js');
const near = (a,b) => { assert.equal(a.length,b.length); a.forEach((v,i)=>assert.ok(Math.abs(v-b[i])<1e-12, `${a} != ${b}`)); };
near(Q.x(Q.initial(1),0), [0,1]);
near(Q.probabilities(Q.h(Q.initial(1),0)), [.5,.5]);
near(Q.prepare('interference',false,0), [1,0]);
near(Q.prepare('interference',true,0), [0,1]);
near(Q.prepare('bell',false,0), [Math.SQRT1_2,0,0,Math.SQRT1_2]);
near(Q.probabilities(Q.h(Q.initial(2),0)), [.5,0,.5,0]);
for(let marked=0; marked<4; marked++) { const expected=[0,0,0,0]; expected[marked]=1; near(Q.prepare('grover',false,marked),expected); }
near(Q.readout([.5,0,0,.5],.1), [.41,.09,.09,.41]);
near(Q.readout([1,0,0,0],.5), [.25,.25,.25,.25]);
for(const p of [0,.1,.5]) for(const mode of ['interference','bell','grover']) {
  const a=Q.prepare(mode,true,2);
  assert.ok(Math.abs(Q.readout(Q.probabilities(a),p).reduce((s,v)=>s+v,0)-1)<1e-12);
  assert.equal(Q.shots(a,1024,p).reduce((s,v)=>s+v,0),1024);
}
const collapse=Q.measure(Q.h(Q.initial(1),0),()=>.75);
assert.equal(collapse.outcome,1);
assert.equal(Q.measure(collapse.state,()=>0).outcome,1);
console.log('PASS: X, H, interference, Bell, all Grover targets, readout, shots and collapse.');

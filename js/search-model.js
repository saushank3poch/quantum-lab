/* Ideal unstructured search. Counts checking-rule calls, not runtime. */
(function (root) {
  'use strict';
  var Q = root.Quantum;
  if (typeof module !== 'undefined') Q = require('./model.js');
  function prepare(size, target) {
    if ([4,16,64,256].indexOf(size)<0 || !Number.isInteger(target) || target<0 || target>=size) throw new RangeError('Invalid search problem');
    var vector=Array(size).fill(1/Math.sqrt(size));
    var rounds=Math.floor(Math.PI/(4*Math.asin(1/Math.sqrt(size))));
    var chances=[vector[target]*vector[target]];
    for(var i=0;i<rounds;i++) {
      vector=Q.diffuse(Q.oracle(vector,target));
      chances.push(vector[target]*vector[target]);
    }
    return {size:size,target:target,vector:vector,rounds:rounds,chances:chances,
      probability:Math.min(1,chances[rounds]),classicalAverage:(size+1)/2};
  }
  function classical(problem) {
    // A sequential scan that confirms a match, including the last candidate.
    var checks=0;
    for(var candidate=0;candidate<problem.size;candidate++) {
      checks++;
      if(candidate===problem.target) return {outcome:candidate,checks:checks};
    }
  }
  function attempt(problem, random) {
    var outcome=Q.measure(problem.vector,random).outcome;
    return {outcome:outcome,success:outcome===problem.target,checks:problem.rounds+1};
  }
  var api={prepare:prepare,classical:classical,attempt:attempt};
  root.SearchModel=api;
  if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

(function (root) {
  'use strict';
  var Q = root.Quantum, M = root.LearnModel, S = root.Sim, W = root.World;
  var lessons = [
    {
      id:'flip', group:'First, an ordinary bit', title:'Start with a tiny switch.',
      intro:'An ordinary computer stores information as 0s and 1s. One of these is called a bit. A flip swaps 0 for 1, or 1 for 0.',
      question:'Start at 0. Flip it once. What comes out?', guesses:['0','1'], answer:1,
      action:'Try one flip', count:1, station:0, steps:['Start at 0','Flip','Read'],
      takeaway:'The bit changed from 0 to 1.', explanation:'Nothing random happened. Starting from 0, the same flip gives 1 every time.',
      check:'What does a flip do?', reasons:['Swaps 0 and 1','Chooses a number at random'], correct:0,
      hint:'A flip always swaps the two values. Try that answer.',
      math:'The X operation maps |0⟩ to |1⟩ and |1⟩ to |0⟩. On these two definite states, it behaves like a classical NOT operation.',
      note:'The switch and the yellow carrier are illustrations. The calculation underneath is real.'
    },
    {
      id:'twice', group:'First, an ordinary bit', title:'Now flip it twice.',
      intro:'Reset to 0. Pass through the same flip two times before reading the bit.',
      question:'Where will two flips leave us?', guesses:['Back at 0','Still at 1'], answer:0,
      action:'Try two flips', count:1, station:0, steps:['Start at 0','Flip','Flip','Read'],
      takeaway:'The second flip undid the first.', explanation:'The bit followed 0 → 1 → 0. Remember that idea: an operation can undo itself.',
      check:'Why did we get 0 again?', reasons:['The second flip undid the first','The reader reset the bit'], correct:0,
      hint:'The value was already 0 before we read it. The two flips cancelled each other.',
      math:'X × X = I, where I is the identity operation: it leaves a state unchanged.',
      note:'Next we will try the same “do it twice” idea with a quantum bit.'
    },
    {
      id:'quantum', group:'The quantum experiment', title:'A quantum bit can behave differently.',
      intro:'A quantum bit is called a qubit. Start it at 0 and send it through the blue operation. Reading it still gives just one number: 0 or 1.',
      question:'Across 40 fresh runs, what do you expect?', guesses:['Always the same number','A mixture of 0s and 1s'], answer:1,
      action:'Try 40 fresh runs', count:40, station:1, steps:['Start at 0','Blue operation','Read'],
      takeaway:'Each fresh run has a 50/50 chance.', explanation:'The blue operation prepares a state called a superposition. A single reading gives only 0 or 1. Forty runs need not split exactly 20/20.',
      check:'Does one reading give both 0 and 1?', reasons:['Yes, both at once','No, just one number'], correct:1,
      hint:'Each little tile is one reading. It contains one number, even though either number was possible.',
      math:'The blue operation is H, the Hadamard gate. H|0⟩ = (|0⟩ + |1⟩)/√2. The two amplitudes are 1/√2; squaring them gives 1/2 for each outcome.',
      note:'Every tile starts over at 0. These are not repeated readings of the same prepared qubit.'
    },
    {
      id:'undo', group:'The quantum experiment', title:'Here is the surprising part.',
      intro:'Use the blue operation twice. Do not read the qubit between them. Read only at the end.',
      question:'Will the final readings still be unpredictable?', guesses:['Yes, a mixture of 0s and 1s','No, they will all be 0'], answer:1,
      action:'Try the blue operation twice', count:40, station:3, steps:['Start at 0','Blue operation','Blue operation','Read'],
      takeaway:'Every run returns to 0.', explanation:'The second blue operation undoes the first. The intermediate state kept information that a simple 50/50 probability chart cannot show. The next step tests what happens if we read it in the middle.',
      check:'What did we deliberately avoid?', reasons:['Reading between the operations','Starting from 0'], correct:0,
      hint:'We did start from 0. We kept the two blue operations together, without reading in between.',
      math:'H × H = I. The first H creates two amplitudes; the second adds and subtracts them so the amplitude for 1 cancels. This is quantum interference.',
      note:'All the gates in these beginner experiments are ideal. Real hardware can introduce errors.'
    },
    {
      id:'read', group:'The quantum experiment', title:'Change just one thing: read it in the middle.',
      intro:'Keep both blue operations. This time, measure the qubit after the first one, then apply the second.',
      question:'Does the guaranteed final 0 survive?', guesses:['Yes, always 0','No, either 0 or 1 can appear'], answer:1,
      action:'Try it with the extra reading', count:40, station:4, steps:['Start at 0','Blue operation','Read here','Blue operation','Read'],
      takeaway:'The final result is 50/50 again.', explanation:'The middle reading changes the quantum state. The second operation now has a different starting point, so it no longer reverses the original preparation.',
      check:'Why did the outcome change?', reasons:['A person paid attention to it','The measurement changed the state'], correct:1,
      hint:'A measurement is a physical operation. A person watching or thinking about the experiment is not what changes the state.',
      math:'After the middle measurement, the state is |0⟩ or |1⟩, each with probability 1/2. H maps either of those to a state with 50/50 Z-basis measurement probabilities. The model computes both branches.',
      note:'“Read” means a measurement in the 0/1 basis, not simply looking at the animation.'
    },
    {
      id:'phase', group:'The quantum experiment', title:'A change the odds cannot show.',
      intro:'Remove the middle reading. Put the purple operation between the two blue ones instead. Right after purple, the odds of 0 and 1 are still 50/50.',
      question:'Will the final result still be 0?', guesses:['Yes, nothing changed','No, it will switch to 1'], answer:1,
      action:'Try the purple operation', count:40, station:2, steps:['Start at 0','Blue operation','Purple operation','Blue operation','Read'],
      takeaway:'Now every run returns 1.', explanation:'Purple changes a relationship inside the quantum state called phase. The second blue operation makes that change visible. This is one reason a qubit is more than an ordinary random bit.',
      check:'What can the purple operation change?', reasons:['Phase, even when the immediate odds stay the same','Nothing, if the odds stay the same'], correct:0,
      hint:'The unchanged 50/50 odds did not describe everything. The different final result revealed a change in phase.',
      math:'Purple is Z. After H, the amplitudes are (+1/√2, +1/√2); Z changes them to (+1/√2, −1/√2). Their squares stay (1/2, 1/2). The final H yields |1⟩. A negative amplitude is not a negative probability.',
      note:'You have reached the core idea: operations can change a quantum state in ways that become visible only later.'
    },
    {
      id:'pair', group:'More to explore · optional', title:'What if we connect two qubits?',
      intro:'Start both qubits at 0. Apply the blue operation to the first, then a linking operation to the pair. Read both at the end.',
      question:'Which pairs will this ideal experiment produce?', guesses:['Only matching pairs: 00 or 11','All four pairs: 00, 01, 10, 11'], answer:0,
      action:'Try 40 fresh pairs', count:40, station:2, steps:['Start at 00','Blue on first','Link the pair','Read both'],
      takeaway:'Each bit is unpredictable. The pair always matches.', explanation:'This circuit prepares an entangled pair. These readings show one feature of it. Matching numbers alone are not proof of entanglement; ordinary correlated bits can match too.',
      check:'Can you choose whether this pair returns 00 or 11?', reasons:['Yes, by deciding which one to read','No, either pair can appear'], correct:1,
      hint:'In this experiment each fresh pair has a 50% chance of 00 and a 50% chance of 11.',
      math:'From |00⟩, apply H to q0, then CNOT with q0 controlling q1. This produces (|00⟩ + |11⟩)/√2. Bit strings here are ordered q0 q1. The model measures the joint register.',
      note:'Entanglement does not let these qubits send a controllable message faster than light.'
    },
    {
      id:'search', group:'More to explore · optional', title:'Use the effect to find one marked answer.',
      intro:'Supply a check that recognises one of four answers without reading it out. This tiny search changes the odds so the final reading finds that answer. Here, your selection defines the check.',
      question:'What can one final reading return?', guesses:['All four answers at once','One answer: the marked one here'], answer:1,
      action:'Run the tiny search', count:40, station:3, steps:['Start at 00','Prepare four','Mark one','Amplify','Read'],
      takeaway:'The marked answer gets all the probability.', explanation:'This is a small example of Grover’s search. Its operations reinforce the marked answer and cancel the others. The exact result here depends on four candidates, one marked answer, and ideal operations.',
      check:'Does this mean every search is solved in one step?', reasons:['Yes, whatever the problem','No, this is a special small example'], correct:1,
      hint:'Bigger problems need more operations. Building the operation that recognizes the answer also has a cost.',
      math:'H on both qubits creates four amplitudes of +0.5. The oracle negates the marked amplitude. Diffusion maps each a to 2 × mean − a: the marked amplitude becomes 1 and the others 0. One ideal iteration suffices only for this four-candidate, one-target example.',
      note:'The selector defines the marking operation. This demo omits the cost of building it; it is not a hardware speed benchmark.'
    }
  ];
  var state = { index:0, unlocked:0, prediction:null, result:null, answered:false, busy:false, elapsed:0, target:3, frame:0, complete:false };
  var fly = null;
  function $(id) { return document.getElementById(id); }
  function current() { return lessons[state.index]; }
  function setWorld() {
    var lesson=current();
    S.state.mode=lesson.id==='pair'?'bell':lesson.id==='search'?'grover':'interference';
    W.build(S.state.mode); S.pause(); S.state.running=false; S.state.station='s'+lesson.station;
    S.van.dist=W.stations.out[lesson.station].dist;
    S.state.vector=Q.initial(M.experiments[lesson.id].n); S.state.outcome=null; S.state.counts=null;
    fly={x:W.districts[lesson.station].x,y:W.districts[lesson.station].y,follow:true};
  }
  function resetExperiment() {
    document.body.classList.remove('has-result');
    state.prediction=null; state.result=null; state.answered=false; state.busy=false; state.elapsed=0; state.frame=0; state.complete=false;
    setWorld(); render();
  }
  function load(index, focus) {
    if(index<0 || index>=lessons.length || index>state.unlocked) return;
    state.index=index; resetExperiment();
    if(focus) $('learn-title').focus();
  }
  function setupChoices() {
    $('learn-predictions').innerHTML=current().guesses.concat(["I’m not sure yet"]).map(function(text,i){
      return '<button class="prediction" data-prediction="'+i+'" aria-pressed="false">'+text+'</button>';
    }).join('');
    $('learn-predictions').querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){
      state.prediction=Number(b.dataset.prediction);
      $('learn-predictions').querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});
      $('learn-run').disabled=false;
    });});
  }
  function bench() {
    var l=current();
    $('learn-sequence').innerHTML=l.steps.map(function(text,i){
      var cls=text.indexOf('Blue')>=0?'blue':text.indexOf('Purple')>=0?'purple':text.indexOf('Read')>=0?'reader':'';
      return (i?'<span class="bench-arrow" aria-hidden="true">→</span>':'')+'<div class="bench-operation '+cls+'" data-frame="'+i+'"><span>'+text+'</span></div>';
    }).join('');
    $('learn-output').innerHTML='<span class="unknown-result">?</span><p>Your prediction comes first.<br>Then we’ll run the experiment.</p>';
    $('learn-sample-note').textContent=l.count===1?'A fresh start at 0 for each try.':'Each tile will be a fresh run from the starting state.';
    $('learn-target-wrap').hidden=l.id!=='search';
    document.querySelectorAll('[data-target]').forEach(function(b){b.setAttribute('aria-pressed',String(Number(b.dataset.target)===state.target));});
  }
  function render() {
    var l=current();
    $('learn-group').textContent=l.group;
    $('learn-progress').textContent=state.index<6?'Step '+(state.index+1)+' of 6':'Extra '+(state.index-5)+' of 2';
    $('learn-title').textContent=l.title; $('learn-intro').textContent=l.intro; $('learn-question').textContent=l.question;
    $('learn-run').textContent=l.action; $('learn-run').disabled=true;
    $('learn-predict-area').hidden=false; $('learn-discovery').hidden=true; $('learn-finish').hidden=true;
    $('learn-check-feedback').textContent=''; $('learn-next').disabled=true;
    $('learn-next').textContent=state.index===5?'Finish the basics →':state.index===7?'Finish →':'Continue →';
    $('learn-back').disabled=state.index===0;
    $('learn-math').open=false; $('learn-math-copy').textContent=l.math;
    $('learn-note').textContent=l.note;
    $('learn-navigation').innerHTML=lessons.map(function(lesson,i){
      return '<button data-lesson="'+i+'" '+(i>state.unlocked?'disabled':'')+' '+(i===state.index?'aria-current="step"':'')+' title="'+lesson.title+'" aria-label="'+(i<6?'Step '+(i+1):'Optional experiment '+(i-5))+': '+lesson.title+'">'+(i<6?i+1:'+')+'</button>';
    }).join('');
    $('learn-navigation').querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){load(Number(b.dataset.lesson),true);});});
    setupChoices(); bench();
    $('learn-guide-scroll').scrollTop=0;
  }
  function run() {
    if(state.prediction===null || state.busy) return;
    var l=current(); state.result=M.run(l.id,state.target,l.count); state.busy=true; state.elapsed=0; state.frame=0;
    $('learn-run').disabled=true; $('learn-run').textContent='Running your experiment…';
    $('learn-predictions').querySelectorAll('button').forEach(function(b){b.disabled=true;});
    $('learn-output').innerHTML='<span class="unknown-result running">…</span><p>Applying the operations, then reading.</p>';
    if(matchMedia('(prefers-reduced-motion: reduce)').matches) finishRun();
  }
  function results() {
    var l=current(),r=state.result,n=M.experiments[l.id].n;
    if(l.count===1){
      $('learn-output').innerHTML='<div class="single-result"><span>THE READING</span><strong>'+r.outcomes[0]+'</strong><p>'+l.takeaway+'</p></div>';
    } else {
      var dominant=r.expected.findIndex(function(p){return p>.999;});
      var headline=dominant>=0?'All '+l.count+' readings were '+Q.label(dominant,n):r.counts.map(function(count,i){return count+' × '+Q.label(i,n);}).filter(function(_,i){return r.expected[i]>1e-12;}).join(' · ');
      $('learn-output').innerHTML='<div class="result-heading"><strong>'+headline+'</strong><span>ACTUAL READINGS · '+l.count+' FRESH RUNS</span></div><div class="readings-grid '+(n===2?'pairs':'')+'">'+r.outcomes.map(function(value){return '<span class="reading-tile value-'+value+'">'+Q.label(value,n)+'</span>';}).join('')+'</div><div class="expected-odds"><span>Chance on each fresh run</span>'+r.expected.map(function(p,i){return '<b>'+Q.label(i,n)+': '+Math.round(p*100)+'%</b>';}).join('')+'</div>';
    }
    $('learn-sample-note').textContent=l.count>1?'The chances come from the model. The tiles are samples; a 50/50 chance does not guarantee an even split.':'The experiment resets to 0 before each try.';
  }
  function finishRun() {
    document.body.classList.add('has-result');
    state.busy=false; var l=current(),r=state.result;
    S.state.vector=r.frames[r.frames.length-1].slice(); S.state.outcome=r.outcomes[0];
    document.querySelectorAll('[data-frame]').forEach(function(b){b.classList.remove('executing');});
    results();
    $('learn-predict-area').hidden=true; $('learn-discovery').hidden=false;
    $('learn-observed').textContent=l.takeaway; $('learn-explanation').textContent=l.explanation;
    $('learn-your-guess').textContent='Your prediction: '+(l.guesses[state.prediction] || 'I’m not sure yet');
    $('learn-check-question').textContent=l.check;
    $('learn-reasons').innerHTML=l.reasons.map(function(reason,i){return '<button data-reason="'+i+'">'+reason+'</button>';}).join('');
    $('learn-reasons').querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){
      var correct=Number(b.dataset.reason)===l.correct;
      $('learn-reasons').querySelectorAll('button').forEach(function(x){x.classList.remove('correct','try-again');});
      b.classList.add(correct?'correct':'try-again');
      $('learn-check-feedback').textContent=correct?'Exactly. Continue when you’re ready.':l.hint;
      state.answered=correct; $('learn-next').disabled=!correct;
    });});
    $('learn-observed').focus({preventScroll:true});
    if(innerWidth<=900)$('learn-output').scrollIntoView({block:'start',behavior:'instant'});
  }
  function finishBasics() {
    document.body.classList.remove('has-result');
    state.complete=true;
    $('learn-finish').hidden=false; $('learn-predict-area').hidden=true; $('learn-discovery').hidden=true;
    $('learn-title').textContent=state.index===7?'You’ve explored the core idea.':'You’ve reached the core idea.';
    $('learn-intro').textContent='A qubit still gives one answer when read. What makes it different is how its state can change before that reading.';
    $('learn-finish-copy').textContent='One blue operation gives 50/50 readings. Two undo each other. A measurement in the middle breaks that return. A phase change can switch the final answer.';
    $('learn-extra').hidden=state.index===7;
    $('learn-math').open=false; $('learn-guide-scroll').scrollTop=0; $('learn-title').focus();
    $('learn-next').disabled=true;
  }
  function next() {
    if(!state.answered || state.busy || state.complete) return;
    state.unlocked=Math.max(state.unlocked,Math.min(7,state.index+1));
    if(state.index===5 || state.index===7){finishBasics();return;}
    load(state.index+1,true);
  }
  function enter() {
    api.active=true; document.body.classList.add('learning'); S.pause();
    $('learning-mode').textContent='Full lab'; $('guide-toggle').hidden=true;
    resetExperiment(); root.dispatchEvent(new Event('resize'));
  }
  function exit() {
    document.body.classList.remove('has-result');
    state.busy=false; api.active=false; document.body.classList.remove('learning');
    $('learning-mode').textContent='Start simply'; $('guide-toggle').hidden=false;
    W.build('interference'); S.select('interference'); if(matchMedia('(prefers-reduced-motion: reduce)').matches)S.pause(); root.UI.paint(true); root.dispatchEvent(new Event('resize'));
  }
  function init() {
    $('learn-run').addEventListener('click',run);
    $('learn-next').addEventListener('click',next);
    $('learn-back').addEventListener('click',function(){load(state.index-1,true);});
    $('learn-repeat').addEventListener('click',function(){resetExperiment();$('learn-title').focus();});
    $('learn-extra').addEventListener('click',function(){state.unlocked=Math.max(state.unlocked,6);load(6,true);});
    $('learn-full-lab').addEventListener('click',exit);
    $('learn-again').addEventListener('click',function(){load(0,true);});
    $('learning-mode').addEventListener('click',function(){if(api.active)exit();else enter();});
    document.querySelectorAll('[data-target]').forEach(function(b){b.addEventListener('click',function(){state.target=Number(b.dataset.target);resetExperiment();});});
    enter();
  }
  function update(dt) {
    if(!api.active || !state.busy || $('about').open) return;
    state.elapsed+=dt;
    var frames=state.result.frames,index=Math.min(frames.length-1,Math.floor(state.elapsed/.45));
    state.frame=index;S.state.vector=frames[index].slice();
    document.querySelectorAll('[data-frame]').forEach(function(b){b.classList.toggle('executing',Number(b.dataset.frame)===index);});
    if(state.elapsed>=frames.length*.45) finishRun();
  }
  var api={active:true,init:init,update:update,state:state,lessons:lessons,enter:enter,exit:exit,
    takeFlyTo:function(){var target=fly;fly=null;return target;}};
  root.Beginner=api;
})(window);

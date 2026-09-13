(function (root) {
  'use strict';
  var Q = root.Quantum, M = root.LearnModel, S = root.Sim, W = root.World;
  var lessons = [
    {
      id:'flip', group:'First, an ordinary bit', title:'Start with a tiny switch.',
      intro:'An ordinary computer stores information as 0s and 1s. One of these is called a bit. A flip swaps 0 for 1, or 1 for 0.',
      question:'Start at 0. Flip it once. What comes out?', guesses:['0','1'], answer:1,
      action:'Try one flip', count:1, station:0, steps:['Start at 0','Flip','Read'],
      takeaway:'The bit changed from 0 to 1.', explanation:["We started with the bit at 0.", "The flip changed 0 to 1. The reader then reported that 1."],
      check:'What does a flip do?', reasons:['Swaps 0 and 1','Chooses a number at random'], correct:0,
      hint:'A flip always swaps the two values. Try that answer.',
      math:'The X operation maps |0⟩ to |1⟩ and |1⟩ to |0⟩. On these two definite states, it behaves like a classical NOT operation.',
      note:'The switch and the yellow carrier are illustrations. The calculation underneath is real.',
      meaning:"The operation changed the value before we read it. Starting at 0 and doing the same flip will always give 1.",
      confirmation:"Yes. A flip swaps the value: 0 becomes 1, and 1 becomes 0."
    },
    {
      id:'twice', group:'First, an ordinary bit', title:'Now flip it twice.',
      intro:'Reset to 0. Pass through the same flip two times before reading the bit.',
      question:'Where will two flips leave us?', guesses:['Back at 0','Still at 1'], answer:0,
      action:'Try two flips', count:1, station:0, steps:['Start at 0','Flip','Flip','Read'],
      takeaway:'Two flips brought the bit back to 0.', explanation:["The first flip changed 0 to 1.", "The second flip changed that 1 back to 0. The reader found the bit already at 0."],
      check:'Why did we get 0 again?', reasons:['The second flip undid the first','The reader reset the bit'], correct:0,
      hint:'The value was already 0 before we read it. The two flips cancelled each other.',
      math:'X × X = I, where I is the identity operation: it leaves a state unchanged.',
      note:'Next we will try the same “do it twice” idea with a quantum bit.',
      meaning:"The journey was 0 → 1 → 0. The reader did not reset anything; the second flip undid the first.",
      confirmation:"Yes. The second flip brought the bit back to 0 before the reading."
    },
    {
      id:'quantum', group:'The quantum experiment', title:'A quantum bit can behave differently.',
      intro:'A quantum bit is called a qubit. Start it at 0 and send it through the blue operation. Reading it still gives just one number: 0 or 1.',
      question:'Across 40 fresh runs, what do you expect?', guesses:['Always the same number','A mixture of 0s and 1s'], answer:1,
      action:'Try 40 fresh runs', count:40, station:1, steps:['Start at 0','Blue operation','Read'],
      takeaway:'One reading, two possible answers.', explanation:["We reset to 0 before each of the 40 trials, then applied blue.", "Blue prepared a state called a superposition, with equal contributions to 0 and 1. These contributions are called amplitudes: numbers used to calculate the chances.", "The reader returned one answer per trial. Here, equal amplitudes give 0 and 1 a 50% chance each."],
      check:'Does one reading give both 0 and 1?', reasons:['Yes, both at once','No, just one number'], correct:1,
      hint:'Each little tile is one reading. It contains one number, even though either number was possible.',
      math:'The blue operation is H, the Hadamard gate. H|0⟩ = (|0⟩ + |1⟩)/√2. The two amplitudes are 1/√2; squaring them gives 1/2 for each outcome.',
      note:'Every tile starts over at 0. These are not repeated readings of the same prepared qubit.',
      meaning:"These readings can look like coin tosses. Next, we will test whether doing blue twice behaves like tossing a coin twice.",
      confirmation:"Yes. One reading gives one number. The 40 tiles come from 40 fresh trials."
    },
    {
      id:'undo', group:'The quantum experiment', title:'Here is the surprising part.',
      intro:'Use the blue operation twice. Do not read the qubit between them. Read only at the end.',
      question:'Will the final readings still be unpredictable?', guesses:['Yes, a mixture of 0s and 1s','No, they will all be 0'], answer:1,
      action:'Try the blue operation twice', count:40, station:3, steps:['Start at 0','Blue operation','Blue operation','Read'],
      takeaway:'Blue twice brought every trial back to 0.', explanation:["The first blue operation prepared equal amplitudes for 0 and 1. We did not read the qubit yet.", "The second blue operation combines those numbers: it adds them for output 0 and takes their difference for output 1. Equal numbers have a difference of zero.", "So the contribution to 1 cancels completely. Only 0 can come out when we finally read."],
      check:"Why did every trial end at 0?", reasons:["The second blue operation cancelled the contribution to 1", "We tossed a coin twice and happened to get only 0s"], correct:0,
      hint:"This was guaranteed, not a lucky streak. The second blue operation combined equal amplitudes so the contribution to 1 became zero.",
      math:'H × H = I. The first H creates two amplitudes; the second adds and subtracts them so the amplitude for 1 cancels. Each sum and difference is divided by √2 to keep the total probability at 1. This is quantum interference.',
      note:'All the gates in these beginner experiments are ideal. Real hardware can introduce errors.',
      meaning:"This adding and cancelling is called interference. Blue twice gives a guaranteed 0 here; two independent coin tosses would not.",
      confirmation:"Yes. The second blue operation cancels the contribution to 1, leaving only 0."
    },
    {
      id:'read', group:'The quantum experiment', title:'Change just one thing: read it in the middle.',
      intro:'Keep both blue operations. This time, measure the qubit after the first one, then apply the second.',
      question:'Does the guaranteed final 0 survive?', guesses:['Yes, always 0','No, either 0 or 1 can appear'], answer:1,
      action:'Try it with the extra reading', count:40, station:4, steps:['Start at 0','Blue operation','Read here','Blue operation','Read'],
      takeaway:'The middle reading removed the guaranteed 0.', explanation:["The first blue operation made either reading possible, just as before.", "The extra reading then left the qubit in one definite state: 0 or 1. The original superposition was gone.", "Blue applied to either definite state makes the final reading 50/50. It no longer has the untouched superposition that it could undo."],
      check:'Why did the outcome change?', reasons:['A person paid attention to it','The measurement changed the state'], correct:1,
      hint:"A measurement is a physical operation. Here it leaves the qubit at a definite 0 or 1; a person paying attention is not the cause.",
      math:'After the middle measurement, the state is |0⟩ or |1⟩, each with probability 1/2. H maps either of those to a state with 50/50 Z-basis measurement probabilities. The model computes both branches.',
      note:'“Read” means a measurement in the 0/1 basis, not simply looking at the animation.',
      meaning:"The extra reading changed what the second blue operation received. That is why the guaranteed return to 0 disappeared.",
      confirmation:"Yes. The middle measurement left a definite 0 or 1, changing the input to the next operation."
    },
    {
      id:'phase', group:'The quantum experiment', title:'A change the odds cannot show.',
      intro:'Remove the middle reading. Put the purple operation between the two blue ones instead. Right after purple, the odds of 0 and 1 are still 50/50.',
      question:'Will the final result still be 0?', guesses:['Yes, nothing changed','No, it will switch to 1'], answer:1,
      action:'Try the purple operation', count:40, station:2, steps:['Start at 0','Blue operation','Purple operation','Blue operation','Read'],
      takeaway:'With purple, every final reading was 1.', explanation:["After the first blue operation, the two amplitudes were equal and positive.", "Purple reversed the sign of the amplitude for 1. Its size stayed the same, so the immediate reading chances stayed 50/50.", "The final blue operation added those opposite signs for output 0: they cancelled. For output 1, it subtracted them: they reinforced. Only 1 could come out."],
      check:"Why did adding purple switch the final answer?", reasons:["It changed a sign, so the final blue operation cancelled 0 instead of 1", "It measured the qubit and picked 1"], correct:0,
      hint:"Purple did not measure. It reversed one amplitude’s sign. The final blue operation then made the contribution to 0 cancel.",
      math:'Purple is Z. After H, the amplitudes are (+1/√2, +1/√2); Z changes them to (+1/√2, −1/√2). Their squares stay (1/2, 1/2). The final H yields |1⟩. A negative amplitude is not a negative probability.',
      note:'You have reached the core idea: operations can change a quantum state in ways that become visible only later.',
      meaning:"Without purple, 1 cancels and we read 0. With purple, 0 cancels and we read 1. This sign relationship is an example of phase.",
      confirmation:"Yes. Purple changed a sign, which switched which output cancelled at the final blue operation."
    },
    {
      id:'pair', group:'More to explore · optional', title:'What if we connect two qubits?',
      intro:'Start both qubits at 0. Apply the blue operation to the first, then a linking operation to the pair. Read both at the end.',
      question:'Which pairs will this ideal experiment produce?', guesses:['Only matching pairs: 00 or 11','All four pairs: 00, 01, 10, 11'], answer:0,
      action:'Try 40 fresh pairs', count:40, station:2, steps:['Start at 00','Blue on first','Link the pair','Read both'],
      takeaway:'The two numbers matched in every trial.', explanation:["We started both qubits at 0. Blue on the first made 00 and 10 possible; the second qubit was still 0.", "The linking operation flips the second qubit only when the first is 1. It leaves the 00 contribution alone and changes the 10 contribution to 11.", "That leaves only matching readings: 00 or 11, each with a 50% chance on a fresh trial."],
      check:"Why are there no 01 or 10 readings here?", reasons:["The link makes both qubits always read 0", "The link flips the second qubit only when the first is 1"], correct:1,
      hint:"Before the link, the possibilities were 00 and 10. The link leaves 00 alone and changes 10 to 11, so neither mismatched pair remains.",
      math:'From |00⟩, apply H to q0, then CNOT with q0 controlling q1. This produces (|00⟩ + |11⟩)/√2. Bit strings here are ordered q0 q1. The model measures the joint register.',
      note:'Entanglement does not let these qubits send a controllable message faster than light.',
      meaning:"The link created the matching relationship; it did not choose which pair we would read. This circuit makes an entangled state, though matching readings alone cannot prove entanglement.",
      confirmation:"Yes. The link leaves 00 alone and turns the 10 contribution into 11."
    },
    {
      id:'search', group:'More to explore · optional', title:'Use the effect to find one marked answer.',
      intro:'Supply a check that recognises one of four answers without reading it out. This tiny search changes the odds so the final reading finds that answer. Here, your selection defines the check.',
      question:'What can one final reading return?', guesses:['All four answers at once','One answer: the marked one here'], answer:1,
      action:'Run the tiny search', count:40, station:3, steps:['Start at 00','Prepare four','Mark one','Amplify','Read'],
      takeaway:'Every trial found your selected match.', explanation:["Preparation gave each of the four candidates a 25% chance.", "Marking reversed the matching candidate’s amplitude sign. That alone left all four chances at 25%.", "The amplify operation combined the amplitudes. In this four-candidate case, the three non-matches cancelled completely, leaving only the selected match to be read."],
      check:'Does this mean every search is solved in one step?', reasons:['Yes, whatever the problem','No, this is a special small example'], correct:1,
      hint:'Bigger problems need more operations. Building the operation that recognizes the answer also has a cost.',
      math:'H on both qubits creates four amplitudes of +0.5. The oracle negates the marked amplitude. Diffusion maps each a to 2 × mean − a: the marked amplitude becomes 1 and the others 0. One ideal iteration suffices only for this four-candidate, one-target example.',
      note:'The selector defines the marking operation. This demo omits the cost of building it; it is not a hardware speed benchmark.',
      meaning:"Marking supplied a difference; interference turned it into a useful answer. The 100% result here relies on four candidates, one match, and ideal operations.",
      confirmation:"Yes. Four candidates is a special case. Bigger searches need more rounds and can sometimes miss."
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
    document.body.classList.remove('showing-application');$('learn-application').hidden=true;
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
    document.querySelector('.bench-heading > span').textContent='WHAT WE’LL DO';
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
    $('learn-next').textContent=state.index===5?'See why this can be useful →':state.index===7?'Finish →':'Continue →';
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
    document.querySelector('.bench-heading > span').textContent='WHAT WE DID';
    $('learn-sample-note').textContent=l.count===1?'The experiment resets to 0 before each try.':
      r.expected.some(function(p){return p>.999;})?'The model gives this answer a 100% chance with these ideal operations. Each tile is a fresh trial.':
      'Each tile is a fresh trial. A 50/50 chance does not guarantee 20 of each answer in 40 trials.';
  }
  function finishRun() {
    document.body.classList.add('has-result');
    state.busy=false; var l=current(),r=state.result;
    S.state.vector=r.frames[r.frames.length-1].slice(); S.state.outcome=r.outcomes[0];
    document.querySelectorAll('[data-frame]').forEach(function(b){b.classList.remove('executing');});
    results();
    $('learn-predict-area').hidden=true; $('learn-discovery').hidden=false;
    $('learn-observed').textContent=l.takeaway;
    var n=M.experiments[l.id].n;
    $('learn-reading').textContent=l.count===1?'You started at 0 and read '+r.outcomes[0]+'.':
      'Your '+l.count+' trials: '+r.counts.map(function(count,i){return count+' readings of '+Q.label(i,n);}).filter(function(_,i){return r.expected[i]>1e-12;}).join(' · ')+'.';
    $('learn-explanation').replaceChildren();
    l.explanation.forEach(function(text){var item=document.createElement('li');item.textContent=text;$('learn-explanation').appendChild(item);});
    $('learn-meaning').textContent=l.meaning;
    $('learn-your-guess').textContent='Your prediction: '+(l.guesses[state.prediction] || 'I’m not sure yet');
    $('learn-check-question').textContent=l.check;
    $('learn-next').textContent='Answer the question ↓';
    $('learn-reasons').innerHTML=l.reasons.map(function(reason,i){return '<button data-reason="'+i+'">'+reason+'</button>';}).join('');
    $('learn-reasons').querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){
      var correct=Number(b.dataset.reason)===l.correct;
      $('learn-reasons').querySelectorAll('button').forEach(function(x){x.classList.remove('correct','try-again');});
      b.classList.add(correct?'correct':'try-again');
      $('learn-check-feedback').textContent=correct?l.confirmation:l.hint;
      state.answered=correct; $('learn-next').disabled=!correct;
      $('learn-next').textContent=correct?(state.index===5?'See why this can be useful →':state.index===7?'Finish →':'Continue →'):'Answer the question ↓';
    });});
    $('learn-observed').focus({preventScroll:true});
    if(innerWidth<=900)$('learn-output').scrollIntoView({block:'start',behavior:'instant'});
  }
  function finishBasics() {
    document.body.classList.add('showing-application');$('learn-application').hidden=false;
    document.body.classList.remove('has-result');
    state.complete=true;
    $('learn-group').textContent='A practical application';$('learn-progress').textContent='Basics complete';
    $('learn-bench').scrollTop=0;
    $('learn-finish').hidden=false; $('learn-predict-area').hidden=true; $('learn-discovery').hidden=true;
    $('learn-title').textContent='What could this help us do?';
    $('learn-intro').textContent='The search showed how a different algorithm can need fewer checks as a problem grows. Another promising use is understanding nature itself.';
    $('learn-finish-copy').textContent='You saw phase changes and interference change which answer comes out. Quantum algorithms arrange these operations to extract useful information.';
    $('learn-extra').hidden=state.index===7;
    $('learn-math').open=false; $('learn-guide-scroll').scrollTop=0; $('learn-title').focus();
    $('learn-next').disabled=true;
  }
  function next() {
    if(!state.answered || state.busy || state.complete) return;
    state.unlocked=Math.max(state.unlocked,Math.min(7,state.index+1));
    if(state.index===5){root.Power.open(finishBasics);return;}
    if(state.index===7){finishBasics();return;}
    load(state.index+1,true);
  }
  function enter() {
    api.active=true; document.body.classList.add('learning'); S.pause();
    markSection('start-simple');$('guide-toggle').hidden=true;
    resetExperiment(); root.dispatchEvent(new Event('resize'));
  }
  function exit() {
    document.body.classList.remove('showing-application');
    root.Power.close();
    document.body.classList.remove('has-result');
    state.busy=false; api.active=false; document.body.classList.remove('learning');
    markSection('learning-mode');$('guide-toggle').hidden=false;
    W.build('interference'); S.select('interference'); if(matchMedia('(prefers-reduced-motion: reduce)').matches)S.pause(); root.UI.paint(true); root.dispatchEvent(new Event('resize'));
  }
  function init() {
    root.Power.init();
    $('start-simple').addEventListener('click',function(){root.Power.close();state.index=0;enter();$('learn-title').focus();});
    $('walkthrough-open').addEventListener('click',openWalkthrough);
    $('learn-power-again').addEventListener('click',function(){root.Power.open(finishBasics);});
    $('learn-run').addEventListener('click',run);
    $('learn-next').addEventListener('click',next);
    $('learn-back').addEventListener('click',function(){load(state.index-1,true);});
    $('learn-repeat').addEventListener('click',function(){resetExperiment();$('learn-title').focus();});
    $('learn-extra').addEventListener('click',function(){state.unlocked=Math.max(state.unlocked,6);load(6,true);});
    $('learn-full-lab').addEventListener('click',exit);
    $('learn-again').addEventListener('click',function(){load(0,true);});
    $('learning-mode').addEventListener('click',function(){if(api.active)exit();});
    document.querySelectorAll('[data-target]').forEach(function(b){b.addEventListener('click',function(){state.target=Number(b.dataset.target);resetExperiment();});});
    enter();
    if(root.location.hash==='#advantage')openWalkthrough();
    root.Principles.init();
  }
  function openWalkthrough() {
    if(!$('power-view').hidden){$('power-title').focus();return;}
    if(!api.active)enter();
    state.index=5;state.unlocked=Math.max(state.unlocked,5);
    resetExperiment();root.Power.open(finishBasics);
  }
  function markSection(id) {
    ['start-simple','principles-open','walkthrough-open','learning-mode'].forEach(function(name){
      if(name===id)$(name).setAttribute('aria-current','page');else $(name).removeAttribute('aria-current');
    });
  }
  function update(dt) {
    if(!api.active || !state.busy || $('about').open || !$('principles-view').hidden) return;
    state.elapsed+=dt;
    var frames=state.result.frames,index=Math.min(frames.length-1,Math.floor(state.elapsed/.45));
    state.frame=index;S.state.vector=frames[index].slice();
    document.querySelectorAll('[data-frame]').forEach(function(b){b.classList.toggle('executing',Number(b.dataset.frame)===index);});
    if(state.elapsed>=frames.length*.45) finishRun();
  }
  var api={active:true,init:init,update:update,state:state,lessons:lessons,enter:enter,exit:exit,markSection:markSection,
    takeFlyTo:function(){var target=fly;fly=null;return target;}};
  root.Beginner=api;
})(window);

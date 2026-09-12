(function(global){
  'use strict';
  var S=global.Sim,W=global.World,Q=global.Quantum,fly=null,lastRevision=-1,lastStation=null,lastMode=null,aboutWasPaused=true;
  function $(id){return document.getElementById(id);}
  var questions={
    interference:{q:'With the phase flip off, what do two H gates do to |0⟩?',answers:['Return 0 every time','Return 0 or 1 at random'],correct:0,why:'H then H is the identity. The amplitudes interfere to recover |0⟩.'},
    bell:{q:'Do matching 00 and 11 outputs alone prove entanglement?',answers:['Yes','No'],correct:1,why:'Classical correlated bits can match too. The ideal state calculation here establishes a Bell state; that one measurement distribution alone does not.'},
    grover:{q:'Can one measurement reveal all four candidate answers?',answers:['Yes','No'],correct:1,why:'One measurement returns one bit string. The algorithm changes its probability by amplifying the marked amplitude.'}
  };
  function navigation(){
    $('station-nav').innerHTML=W.districts.map(function(d){return '<button data-stop="'+d.index+'" title="'+d.name+'" aria-label="Stop '+(d.index+1)+': '+d.name+'">0'+(d.index+1)+'</button>';}).join('');
    $('circuit').innerHTML=W.districts.map(function(d,i){return (i?'<span class="circuit-wire"></span>':'')+'<button class="circuit-gate" data-stop="'+i+'" title="'+d.tag+'" aria-label="'+d.name+'">'+d.gate+'</button>';}).join('');
    document.querySelectorAll('[data-stop]').forEach(function(b){b.addEventListener('click',function(){visit(Number(b.dataset.stop));});});
  }
  function visit(i){S.jump(i);fly=W.districts[i];paint(true);}
  function showDistrict(d){visit(d.index);}
  function showNarration(index){
    var d=W.districts[index];
    $('station-tag').textContent=d.tag;$('station-title').textContent=d.name;$('station-short').textContent=d.short;$('station-body').textContent=d.body;
    $('step-count').textContent='STOP 0'+(index+1)+' / 06';
    document.querySelectorAll('[data-stop]').forEach(function(b){var at=Number(b.dataset.stop);b.classList.toggle('current',at===index);b.classList.toggle('active',at===index);b.classList.toggle('visited',at<index);if(at===index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
    $('shot-panel').hidden=index!==5;$('challenge').hidden=index!==5;document.querySelector('.state-panel').hidden=index===5;
    $('next').innerHTML=index===5?'Next experiment <span>→</span>':'Next stop <span>→</span>';
    document.querySelector('.guide-scroll').scrollTop=0;
    if(index===5) quiz();
  }
  function quiz(){
    var q=questions[S.state.mode];$('question').textContent=q.q;$('feedback').textContent='';
    $('answers').innerHTML=q.answers.map(function(a,i){return '<button data-answer="'+i+'">'+a+'</button>';}).join('');
    $('answers').querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){
      $('answers').querySelectorAll('button').forEach(function(x){x.classList.remove('correct','incorrect');});
      var correct=Number(b.dataset.answer)===q.correct;b.classList.add(correct?'correct':'incorrect');
      $('feedback').textContent=(correct?'Correct. ':'Try the other answer. ')+q.why;
    });});
    $('next-lesson').textContent=S.state.mode==='grover'?'Replay the first experiment ↻':'Next experiment →';
  }
  function nextLesson(){var modes=['interference','bell','grover'];select(modes[(modes.indexOf(S.state.mode)+1)%3]);}
  function select(mode){S.select(mode);fly=W.districts[0];paint(true);}
  function renderState(){
    var s=S.state,a=s.vector,n=Q.qubits(a),p=Q.probabilities(a);
    $('state-status').textContent=s.outcome===null?'BEFORE MEASUREMENT':'AFTER MEASUREMENT';
    $('amplitudes').innerHTML=a.map(function(v,i){return '<div class="amplitude"><span>|'+Q.label(i,n)+'⟩</span><div class="track"><span class="'+(v<0?'negative':'')+'" style="width:'+Math.abs(v)*100+'%"></span></div><span class="amp-num">'+(v>0?'+':'')+v.toFixed(3)+'</span><span class="prob-num">'+Math.round(p[i]*100)+'%</span></div>';}).join('');
    var summary;
    if(s.outcome!==null) summary='This shot returned '+Q.label(s.outcome,n)+'. The bars now show the measured state.';
    else if(a.some(function(v){return v<-.001;}))summary='Purple means negative amplitude. Its square is still a positive probability.';
    else if(p.filter(function(v){return v>.001;}).length===1)summary='One outcome has 100% probability if measured here.';
    else summary='Several outcomes are possible. These amplitudes can still interfere before measurement.';
    $('state-summary').textContent=summary;
    if(s.counts){
      var expected=Q.readout(Q.probabilities(s.prepared),s.error);
      $('histogram').innerHTML=s.counts.map(function(count,i){return '<div class="hist-row"><span>'+Q.label(i,n)+'</span><div class="hist-track"><span style="width:'+count/1024*100+'%"></span></div><b>'+count+' · '+Math.round(expected[i]*100)+'%</b></div>';}).join('');
    }
  }
  function paint(force){
    var s=S.state,index=s.station?Number(s.station.slice(1)):0;
    if(s.mode!==lastMode){
      navigation();lastMode=s.mode;lastStation=null;
      document.querySelectorAll('.lesson').forEach(function(b){b.classList.toggle('active',b.dataset.mode===s.mode);b.setAttribute('aria-pressed',b.dataset.mode===s.mode?'true':'false');});
      $('phase-control').hidden=s.mode!=='interference';$('target-control').hidden=s.mode!=='grover';$('bell-note').hidden=s.mode!=='bell';
      $('lab-size').textContent=s.mode==='interference'?'1 QUBIT / 2 AMPLITUDES':'2 QUBITS / 4 AMPLITUDES';
      $('lesson-footnote').textContent='EXPERIMENT 0'+(['interference','bell','grover'].indexOf(s.mode)+1);
    }
    if(s.station!==lastStation||force){showNarration(index);lastStation=s.station;}
    if(s.revision!==lastRevision||force){renderState();lastRevision=s.revision;}
    $('play').textContent=s.paused?'▶':'Ⅱ';$('play').setAttribute('aria-label',s.paused?(s.finished?'Replay experiment':'Play tour'):'Pause tour');
    $('step').disabled=s.finished;
    var percent=s.dwellTotal?100*s.dwellLeft/s.dwellTotal:0;
    $('reading-fill').style.width=percent+'%';document.querySelector('.reading-progress').setAttribute('aria-valuenow',String(Math.round(percent)));
    $('status-text').textContent=s.finished?'Experiment complete':s.paused?'Paused · explore at your pace':s.dwellLeft>0?'At '+W.districts[index].name:'Following the state carrier';
    $('status-detail').textContent=s.finished?'Try the next experiment, or replay with different settings.':s.paused?'Play to continue, or advance one stop.':s.reading?'Reading stop · '+Math.ceil(s.dwellLeft/s.speed)+' seconds remaining':s.tourDone?'You have seen these stops; this replay moves faster.':'The bars on the carrier are the calculated amplitudes.';
  }
  function resetAll(){S.replayTour();S.run();fly=W.districts[0];paint(true);}
  function next(){if(S.state.station==='s5')nextLesson();else S.step();}
  function init(){
    document.querySelectorAll('.lesson').forEach(function(b){b.addEventListener('click',function(){select(b.dataset.mode);});});
    $('play').addEventListener('click',function(){S.toggle();paint(false);});
    $('step').addEventListener('click',function(){S.step();});$('next').addEventListener('click',next);
    $('restart').addEventListener('click',resetAll);$('next-lesson').addEventListener('click',nextLesson);
    $('speed').addEventListener('change',function(){S.state.speed=Number(this.value);});
    $('phase').addEventListener('change',function(){S.change('phase',this.checked);paint(true);});
    $('target').addEventListener('change',function(){S.change('marked',Number(this.value));paint(true);});
    $('error').addEventListener('input',function(){S.state.error=Number(this.value)/100;$('error-value').textContent=this.value+'%';S.resample();paint(false);});
    $('resample').addEventListener('click',function(){S.resample();paint(false);});
    $('labels').addEventListener('change',function(){global.Renderer.setLabels(this.checked);});
    $('guide-toggle').addEventListener('click',function(){var hidden=$('inspector').classList.toggle('hidden');this.textContent=hidden?'Show guide':'Hide guide';this.setAttribute('aria-expanded',String(!hidden));});
    $('about-open').addEventListener('click',function(){aboutWasPaused=S.state.paused;S.pause();$('about').showModal();});
    $('about-close').addEventListener('click',function(){$('about').close();});
    $('about').addEventListener('click',function(e){if(e.target===this){var r=this.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)this.close();}});
    $('about').addEventListener('close',function(){if(!aboutWasPaused)S.play();});
    S.on(function(name){if(name==='station'||name==='reset'||name==='lesson'||name==='shots')paint(false);});
  }
  global.UI={init:init,paint:paint,run:function(){S.run();if(matchMedia('(prefers-reduced-motion: reduce)').matches)S.pause();paint(true);},resetAll:resetAll,showDistrict:showDistrict,
    unpin:function(){},activeDistrict:function(){return S.state.station;},takeFlyTo:function(){var f=fly;fly=null;return f;}};
})(window);

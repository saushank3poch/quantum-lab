/* Inspect the saved calculation and reading. Replay never samples again. */
(function(root){
  'use strict';
  var state={index:0,problem:null,result:null,attempts:0};
  function $(id){return document.getElementById(id);}
  function percent(value){
    if(value<1e-12)return '0%';
    if(value<.0001)return '<0.01%';
    if(value>1-1e-12)return '100%';
    return (value*100).toFixed(value>.9999?3:2)+'%';
  }
  function sign(value){return Math.abs(value)<1e-12?'0':value<0?'−':'+';}
  function show(problem,result,attempts){
    state.problem=problem;state.result=result;state.attempts=attempts;state.index=0;
    $('trace-math').open=false;render();
  }
  function render(){
    var p=state.problem,r=state.result,index=state.index;
    var read=index>=p.frames.length,verified=index>p.frames.length;
    var frame=read?{kind:verified?'verify':'read',round:p.rounds,vector:p.vector}:p.frames[index];
    var kind=frame.kind,target=p.target+1,answer=r.outcome+1;
    var before=index>0?p.frames[Math.min(index-1,p.frames.length-1)].vector:p.frames[0].vector;
    var chance=frame.vector[p.target]*frame.vector[p.target];
    var calls=verified?p.rounds+1:frame.round;
    $('search-replay').dataset.kind=kind;
    $('trace-position').textContent='Replay of attempt '+state.attempts+' · Step '+(index+1)+' of '+(p.frames.length+2);
    $('trace-cost').textContent=calls+' checking-rule '+(calls===1?'use':'uses')+' so far in this attempt';
    $('trace-status').textContent=read?'ONE ANSWER RECORDED':'NO ANSWER READ YET';
    var title,copy,change;
    if(kind==='prepare'){
      title='Start with equally likely answers.';
      copy='Each box stands for a possible answer, not a qubit. The quantum register was prepared so every box had the same chance of being read. No box had been selected.';
      change='All '+p.size+' boxes: '+percent(1/p.size)+' each. The bars show reading chances; the + signs show amplitude signs.';
    }else if(kind==='phase'){
      title='Round '+frame.round+' · Purple changes a sign.';
      copy='The checking rule recognises the match and reverses its amplitude sign. Here that is box '+target+'. Watch the sign change; its chance stays the same. This operation does not read a box or return the answer.';
      change='Box '+target+': '+sign(before[p.target])+' → '+sign(frame.vector[p.target])+'. Chance: '+percent(before[p.target]*before[p.target])+' → '+percent(chance)+'. Purple marks the sign change, not an opened box.';
    }else if(kind==='interference'){
      title='Round '+frame.round+' · Interference changes the chances.';
      copy='This operation combines the signed amplitudes by adding and subtracting them. Because purple changed the match’s sign, the combination increases its chance and reduces the others. The boxes are still possible answers; none has been read.';
      change='Box '+target+': '+percent(before[p.target]*before[p.target])+' → '+percent(chance)+'. '+(p.size===4?'The other three chances become 0%.':'Other boxes still have a chance. A minus sign does not mean a box is removed.');
    }else if(kind==='read'){
      title='Read once: box '+answer+' came out.';
      copy='After '+p.rounds+' rounds, the match had a '+percent(p.probability)+' chance. The reader then selected one answer according to those chances. This run recorded '+answer+'; it did not return all the boxes.';
      change='Reading records an answer. We still need a separate check to confirm it. Reading itself adds no use of the checking rule.';
    }else{
      title=r.success?'Check: box '+answer+' is a match.':'Check: box '+answer+' is not a match.';
      copy='We used the checking rule on the recorded answer. It said '+(r.success?'yes, confirming the result.':'no. The quantum attempt missed, even though its chance of success was high. A fresh attempt can try again.');
      change=p.rounds+' purple rule '+(p.rounds===1?'use':'uses')+' + 1 final check = '+(p.rounds+1)+' in this attempt.'+(state.attempts>1?' Earlier attempts remain included in the comparison total.':'');
    }
    $('trace-title').textContent=title;$('trace-copy').textContent=copy;$('trace-change').textContent=change;
    document.querySelectorAll('[data-trace-kind]').forEach(function(el){
      var active=el.dataset.traceKind===kind;el.classList.toggle('active',active);
      if(active)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');
    });
    var grid=$('trace-boxes');
    grid.classList.toggle('many',p.size>16);
    grid.replaceChildren();
    frame.vector.forEach(function(amplitude,i){
      var cell=document.createElement('div'),probability=amplitude*amplitude;
      cell.className='trace-box';cell.dataset.candidate=i;
      if(kind==='phase' && i===p.target)cell.classList.add('phase-changed');
      if(read)cell.classList.add(i===r.outcome?'selected':'not-selected');
      if(verified && i===r.outcome)cell.classList.add(r.success?'confirmed':'rejected');
      var label=document.createElement('strong');label.textContent=i+1;cell.appendChild(label);
      var badge=document.createElement('span');badge.className='trace-sign';
      badge.textContent=read?(i===r.outcome?(verified?(r.success?'✓':'×'):'Read'):'—'):sign(amplitude);
      cell.appendChild(badge);
      var bar=document.createElement('span');bar.className='trace-bar';
      var fill=document.createElement('i');fill.style.width=(read?(i===r.outcome?100:0):Math.min(100,100*probability))+'%';
      bar.appendChild(fill);cell.appendChild(bar);
      var odds=document.createElement('small');odds.textContent=read?(i===r.outcome?(verified?(r.success?'Match':'No match'):'Recorded'):'Not read'):percent(probability);
      cell.appendChild(odds);
      cell.setAttribute('aria-label','Box '+(i+1)+'. '+(read?odds.textContent:'Amplitude sign '+(sign(amplitude)==='−'?'minus':sign(amplitude)==='+'?'plus':'zero')+'. Reading chance '+percent(probability)));
      grid.appendChild(cell);
    });
    // Keep the relevant box inside the grid's own scrolling area.
    var relevant=read?r.outcome:p.target,cell=grid.children[relevant];
    grid.scrollTop=kind==='prepare'?0:cell.offsetTop-grid.clientHeight/2+cell.clientHeight/2;
    $('trace-grid-label').textContent=read?'After reading · one recorded answer':p.size+' possible answers · before reading';
    $('trace-legend').textContent=read?'The outlined box is the recorded answer. The other boxes are not additional readings.':'Bar length and % show reading chance. + / − show amplitude sign; either sign can still be read. Purple outline = sign changed on this step.';
    $('trace-prev').disabled=index===0;$('trace-next').disabled=verified;
    var nextKind=verified?null:index+1<p.frames.length?p.frames[index+1].kind:index+1===p.frames.length?'read':'verify';
    $('trace-next').textContent=verified?'Replay complete':nextKind==='phase'?'Next: apply purple →':nextKind==='interference'?'Next: combine amplitudes →':nextKind==='read'?'Next: read one box →':'Next: check that answer →';
    $('trace-math').hidden=read;
    var mean=before.reduce(function(sum,a){return sum+a;},0)/p.size;
    $('trace-math-copy').textContent=kind==='interference'?'Diffusion computes each new amplitude as 2 × mean − old amplitude. For box '+target+': 2 × '+mean.toFixed(5)+' − ('+before[p.target].toFixed(5)+') = '+frame.vector[p.target].toFixed(5)+'. Squaring gives its '+percent(chance)+' chance. This combines several gates; it is not the single blue H gate from the earlier lessons.':kind==='phase'?'The oracle multiplies only the matching amplitude by −1. Its square stays the same, so its reading probability does not change.':'Each of the '+p.size+' amplitudes starts at 1/√'+p.size+'. Squaring gives probability 1/'+p.size+'.';
  }
  function init(){
    function explainStep(){
      render();
      if(innerWidth<=900)document.querySelector('.trace-story').scrollIntoView({block:'start',behavior:'instant'});
      $('trace-title').focus({preventScroll:true});
    }
    $('trace-next').addEventListener('click',function(){if(state.problem && state.index<state.problem.frames.length+1){state.index++;explainStep();}});
    $('trace-prev').addEventListener('click',function(){if(state.index>0){state.index--;explainStep();}});
    $('trace-restart').addEventListener('click',function(){if(state.problem){state.index=0;explainStep();}});
  }
  root.SearchReplay={init:init,show:show,state:state};
})(window);

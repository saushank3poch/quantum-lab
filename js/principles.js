(function (root) {
  'use strict';
  var Q=root.Quantum, mode='plain', step=0, frames=[], readings={}, previousSection='start-simple', returnFocus=null;
  function $(id){return document.getElementById(id);}
  function reset(){step=0;frames=[Q.initial(1)];readings={};render();}
  function advance(){
    if(step===4)return;
    var next=step+1;
    if(!frames[next]){
      var a=frames[step].slice();
      if(next===1 || next===3)a=Q.h(a,0);
      if(next===2 && mode==='purple')a=Q.z(a,0);
      if(next===4 || (next===2 && mode==='read')){
        var reading=Q.measure(a);readings[next]=reading.outcome;a=reading.state;
      }
      frames[next]=a;
    }
    step=next;render();
  }
  function narrative(){
    if(step===0)return ['Start with a definite 0.','We prepared the qubit at 0. Its amplitude for 0 is 1; its amplitude for 1 is 0.','A reading now would be 0 every time.'];
    if(step===1)return ['Blue makes two equal amplitudes.','Blue changed (1, 0) into (+0.707…, +0.707…). Squaring either number gives ½, so either reading has a 50% chance.','We have not read anything yet. Both amplitudes are still part of the state.'];
    if(step===2){
      if(mode==='purple')return ['Purple changes a sign, not the odds.','The amplitude for 1 is now negative. Its square is still ½, so both reading chances stay at 50%.','Something did change: the signs are now opposite. The next blue operation will combine them differently.'];
      if(mode==='read')return ['The middle reading gave '+readings[2]+'.','The reader returned one number and left the qubit in that definite state. The original pair of amplitudes is gone.','This is a physical measurement, not just someone looking at the screen. Blue now receives a definite '+readings[2]+'.'];
      return ['Leave the quantum state untouched.','We applied no operation and took no reading. The two equal, positive amplitudes are still there.','Their relationship survives. That is what the next blue operation can use.'];
    }
    if(step===3){
      if(mode==='purple')return ['Opposite signs cancel the 0 output.','Blue adds the two opposite amplitudes for output 0: they cancel. It takes their difference for output 1: they reinforce.','The state is now 1. A final reading is guaranteed to give 1 in this ideal experiment.'];
      if(mode==='read')return ['The second blue produces 50/50 again.','Blue applied to the definite '+readings[2]+' from the middle reading makes both final answers possible.','Reading in the middle changed the input. We no longer get the guaranteed return to 0.'];
      return ['Equal amplitudes cancel the 1 output.','Blue adds them for output 0 and takes their difference for output 1. Equal numbers have a difference of zero.','The state is back at 0. Two blue operations undo each other when we leave the state untouched between them.'];
    }
    return ['The final reading gave '+readings[4]+'.',mode==='read'?'This run returned one of the two possible answers. Another fresh run can return the other answer.':'The operations made '+readings[4]+' certain before we read it. The reading revealed that result.', 'One reading gives one number. Go back to inspect this same run, or start a fresh run to try again.'];
  }
  function render(){
    var labels=['Start at 0','Blue',mode==='purple'?'Purple':mode==='read'?'Read here':'Leave alone','Blue','Read one'];
    $('fp-sequence').innerHTML=labels.map(function(label,i){
      var cls=i===1||i===3?'blue':i===4||(i===2&&mode==='read')?'reader':i===2&&mode==='purple'?'purple':'';
      return '<li class="'+cls+'"'+(step===i?' aria-current="step"':'')+'>'+label+'</li>';
    }).join('');
    $('fp-boxes').innerHTML=frames[step].map(function(a,i){
      if(step===4)return '<div class="fp-box '+(readings[4]===i?'selected':'unread')+'"><strong>'+i+'</strong><span>'+(readings[4]===i?'The one reading':'Not read')+'</span></div>';
      var probability=Math.round(a*a*100),value=Math.abs(a)<1e-12?'0':(a<0?'−':'+')+(Math.abs(a)>.999?'1':'0.707…');
      return '<div class="fp-box '+(a<0?'negative':'')+'"><strong>'+i+'</strong><small>amplitude</small><b>'+value+'</b><div class="fp-chance" aria-hidden="true"><i style="width:'+probability+'%"></i></div><span>'+probability+'% reading chance</span></div>';
    }).join('');
    var copy=narrative();
    $('fp-position').textContent='STEP '+(step+1)+' OF 5';
    $('fp-step-title').textContent=copy[0];$('fp-step-copy').textContent=copy[1];$('fp-step-meaning').textContent=copy[2];
    $('fp-prev').disabled=step===0;$('fp-next').disabled=step===4;
    $('fp-next').textContent=step===4?'Run complete':step===0||step===2?'Next: apply blue →':step===3?'Read one answer →':mode==='purple'?'Apply purple →':mode==='read'?'Read in the middle →':'Leave it alone →';
    document.querySelectorAll('[data-fp-mode]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.fpMode===mode));});
  }
  function open(){
    if(!$('principles-view').hidden){$('principles-title').focus();return;}
    returnFocus=document.activeElement;
    var current=document.querySelector('.header-actions [aria-current="page"]');
    previousSection=current?current.id:'start-simple';
    root.Sim.pause();
    document.body.classList.add('showing-principles');$('principles-view').hidden=false;
    root.Beginner.markSection('principles-open');$('principles-title').focus({preventScroll:true});
  }
  function close(restoreFocus){
    if($('principles-view').hidden)return;
    $('principles-view').hidden=true;document.body.classList.remove('showing-principles');
    root.Beginner.markSection(previousSection);
    if(restoreFocus && returnFocus)returnFocus.focus({preventScroll:true});
  }
  function init(){
    $('principles-open').addEventListener('click',open);
    ['start-simple','walkthrough-open','learning-mode'].forEach(function(id){$(id).addEventListener('click',function(){close(false);},true);});
    $('principles-back').addEventListener('click',function(){close(true);});
    $('fp-practical').addEventListener('click',function(){$('walkthrough-open').click();});
    $('fp-flip').addEventListener('click',function(){var bit=1-Number($('fp-bit-value').textContent);$('fp-bit-value').textContent=bit;$('fp-bit-copy').textContent='Read it now: '+bit+'. Flip again to undo it.';});
    document.querySelectorAll('[data-fp-mode]').forEach(function(b){b.addEventListener('click',function(){mode=b.dataset.fpMode;reset();});});
    $('fp-next').addEventListener('click',advance);
    $('fp-prev').addEventListener('click',function(){if(step>0){step--;render();}});
    $('fp-reset').addEventListener('click',reset);
    // Scroll topic links inside this view without replacing the shareable section URL.
    document.querySelectorAll('.principles-contents a').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var section=document.querySelector(a.getAttribute('href'));section.scrollIntoView({block:'start'});section.setAttribute('tabindex','-1');section.focus({preventScroll:true});});});
    reset();
    root.addEventListener('hashchange',function(){if(root.location.hash==='#first-principles')open();});
    if(root.location.hash==='#first-principles')open();
  }
  root.Principles={init:init,open:open};
})(window);

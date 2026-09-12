(function (root) {
  'use strict';
  var M=root.SearchModel;
  var state={size:16,problem:null,result:null,checks:0,attempts:0};
  var onDone=null,returnFocus=null;
  function $(id){return document.getElementById(id);}
  function percent(p){return p>=1-1e-12?'100%':(100*p).toFixed(p>.9999?3:1)+'%';}
  function reset() {
    state.problem=null;state.result=null;state.checks=0;state.attempts=0;
    document.querySelectorAll('[data-search-size]').forEach(function(b){b.setAttribute('aria-pressed',String(Number(b.dataset.searchSize)===state.size));});
    $('power-grid').innerHTML=Array(state.size).fill(0).map(function(_,i){return '<span>'+ (i+1) +'</span>';}).join('');
    $('power-grid').classList.toggle('large',state.size>64);
    $('power-classical-count').textContent='?';$('power-quantum-count').textContent='?';
    $('power-classical-result').textContent='Check candidate 1, then 2, then 3… Stop when the rule says yes.';
    $('power-quantum-result').textContent='Use the rule to change phase, then interference to raise the chance of the answer. Read one candidate and check it.';
    $('power-classical-bar').style.width='0%';$('power-quantum-bar').style.width='0%';
    $('power-run').textContent='Try both methods';$('power-retry').hidden=true;
    $('power-result').hidden=true;$('power-next').disabled=true;
    $('power-odds').innerHTML='';
    $('power-grid-note').textContent=state.size+' candidates. One hidden match. No useful order or clues.';
  }
  function renderResult() {
    var p=state.problem,r=state.result,c=M.classical(p);
    $('power-classical-count').textContent=c.checks;
    $('power-quantum-count').textContent=state.checks;
    $('power-classical-result').textContent='Found candidate '+(c.outcome+1)+'. '+c.checks+' candidates checked in order.';
    $('power-quantum-result').textContent='Read candidate '+(r.outcome+1)+'. '+(r.success?'The final check confirms it.':'The final check rejects it. Try another fresh quantum run.')+' '+p.rounds+' rule uses + 1 final check per attempt.';
    var scale=Math.max(state.size,state.checks);
    $('power-classical-bar').style.width=(100*c.checks/scale)+'%';
    $('power-quantum-bar').style.width=(100*state.checks/scale)+'%';
    $('power-grid').querySelectorAll('span').forEach(function(cell,i){cell.className=i===p.target?'match':i<p.target?'checked':'';});
    $('power-grid-note').textContent='Match: '+(p.target+1)+'. Shaded cells show the ordinary scan. Green is its confirmed match.';
    $('power-odds').innerHTML='<p><strong>How interference changes the chance of a correct reading</strong></p><p class="power-chart-hint">Scroll across the chart to see every round →</p><div class="power-odds-steps" tabindex="0" role="region" aria-label="Chance of success after each round">'+p.chances.map(function(chance,i){return '<div><span>'+(i===0?'Start':'Round '+i)+'</span><b>'+percent(chance)+'</b><i style="height:'+Math.max(2,80*chance)+'px"></i></div>';}).join('')+'</div><p class="power-small">Calculated by the simulator. A quantum computer’s single reading does not reveal this chart.</p>';
    $('power-result').hidden=false;
    $('power-verdict').textContent=!r.success?'This quantum attempt missed. Its checks still count.':state.checks<c.checks?'Quantum used fewer checks on this run.':state.checks===c.checks?'The methods tied on this run.':'The ordinary scan used fewer checks on this run.';
    $('power-pattern').textContent='Across uniformly hidden targets, the ordinary scan averages '+p.classicalAverage+' checks. Each quantum attempt uses '+(p.rounds+1)+' and succeeds '+percent(p.probability)+' of the time. Retries add checks. Increase the problem size to see how the work grows.';
    $('power-retry').hidden=r.success;$('power-run').textContent='Hide a new answer & try again';
    $('power-next').disabled=false;
  }
  function run() {
    state.problem=M.prepare(state.size,Math.floor(Math.random()*state.size));
    state.checks=0;state.attempts=0;retry();
  }
  function retry() {
    state.result=M.attempt(state.problem);state.checks+=state.result.checks;state.attempts++;
    renderResult();
  }
  function open(done) {
    returnFocus=document.activeElement;
    onDone=done;reset();
    $('power-view').querySelector('details').open=false;
    document.body.classList.add('showing-power');$('power-view').hidden=false;
    $('power-view').scrollTop=0;$('power-title').focus();
  }
  function close() {
    $('power-view').hidden=true;document.body.classList.remove('showing-power');
    if(returnFocus && returnFocus.isConnected)returnFocus.focus({preventScroll:true});
  }
  function init() {
    document.querySelectorAll('[data-search-size]').forEach(function(b){b.addEventListener('click',function(){state.size=Number(b.dataset.searchSize);reset();});});
    $('power-run').addEventListener('click',run);
    $('power-retry').addEventListener('click',retry);
    $('power-next').addEventListener('click',function(){close();if(onDone)onDone();});
    $('power-back').addEventListener('click',close);
  }
  root.Power={init:init,open:open,close:close,state:state};
})(window);

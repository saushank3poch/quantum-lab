/* Pacing adapted from Learnscape: stops fire model operations, first visits
 * wait for reading, repeated visits are shorter, and tour memory survives runs. */
(function(global) {
  'use strict';
  var Q=global.Quantum, W=global.World, I=global.Iso;
  var tour={seen:Object.create(null)}, listeners=[];
  var state={mode:'interference',phase:true,marked:3,error:0,speed:1,running:false,paused:true,finished:false,
    station:null,stationT:0,stepMode:false,reading:false,dwellLeft:0,dwellTotal:0,tourDone:false,
    vector:Q.initial(1),prepared:null,counts:null,outcome:null,revision:0};
  var van={routeName:'out',dist:0,dwell:0,stationIdx:0};
  function emit(name,value) { state.revision++; listeners.forEach(function(fn){fn(name,value);}); }
  function operation(index) {
    var a=state.vector, mode=state.mode;
    if(index===0) a=Q.initial(mode==='interference'?1:2);
    if(index===1) { a=Q.h(a,0); if(mode==='grover') a=Q.h(a,1); }
    if(index===2) {
      if(mode==='interference' && state.phase) a=Q.z(a,0);
      if(mode==='bell') a=Q.cnot(a,0,1);
      if(mode==='grover') a=Q.oracle(a,state.marked);
    }
    if(index===3) {
      if(mode==='interference') a=Q.h(a,0);
      if(mode==='grover') a=Q.diffuse(a);
      state.prepared=a.slice();
    }
    if(index===4) { var m=Q.measure(a); state.outcome=m.outcome; a=m.state; }
    if(index===5) state.counts=Q.shots(state.prepared,1024,state.error);
    state.vector=a;
  }
  function fire(st) {
    state.station=st.id; state.stationT=0;
    operation(Number(st.id.slice(1)));
    emit('station',st.id);
  }
  function reset() {
    state.finished=false; state.station=null; state.stationT=0; state.stepMode=false;
    state.reading=false; state.dwellLeft=0; state.dwellTotal=0;
    state.vector=Q.initial(state.mode==='interference'?1:2);
    state.prepared=null; state.counts=null; state.outcome=null;
    state.tourDone=W.districts.every(function(d){return tour.seen[state.mode+d.id];});
    van.dist=0; van.stationIdx=0; van.dwell=0;
    emit('reset');
  }
  function run() { reset(); state.running=true; state.paused=false; }
  function arrive(st) {
    var topic=state.mode+st.id, first=!tour.seen[topic];
    fire(st); tour.seen[topic]=true;
    van.dwell=first?W.readSeconds(st.id):1.4;
    state.reading=first; state.dwellTotal=van.dwell; state.dwellLeft=van.dwell;
    if(state.stepMode){state.paused=true;state.stepMode=false;}
  }
  function advanceRoute() {
    state.finished=true;state.paused=true;state.tourDone=true;
    emit('done');
  }
  function update(dt) {
    if(!state.running || state.paused || state.finished) return;
    state.stationT+=dt;
    if(van.dwell>0) {
      van.dwell-=dt*state.speed;
      state.dwellLeft=Math.max(0,van.dwell);
      if(van.dwell<=0){state.reading=false;state.dwellTotal=0;}
      return;
    }
    var route=W.routes.out;
    van.dist+=6*dt*state.speed*(state.tourDone?2.4:1);
    var st=W.stations.out[van.stationIdx];
    if(st && van.dist>=st.dist){van.dist=st.dist;van.stationIdx++;arrive(st);return;}
    if(van.dist>=route.total) advanceRoute();
  }
  function jump(index) {
    reset(); state.running=true;state.paused=true;
    for(var i=0;i<index;i++) operation(i);
    var st=W.stations.out[index];van.dist=st.dist;van.stationIdx=index+1;arrive(st);
  }
  global.Sim={state:state,van:van,run:run,reset:reset,update:update,
    replayTour:function(){tour.seen=Object.create(null);},
    vanPosition:function(){return I.smoothAt(W.routes.out,van.dist,.45);},
    on:function(fn){listeners.push(fn);},
    play:function(){if(state.finished)run();else{state.running=true;state.paused=false;}},
    pause:function(){state.paused=true;},
    toggle:function(){if(state.paused)this.play();else this.pause();},
    step:function(){if(state.finished)return;state.running=true;state.stepMode=true;state.paused=false;van.dwell=0;},
    jump:jump,
    select:function(mode){state.mode=mode;W.build(mode);run();emit('lesson');},
    change:function(key,value){state[key]=value;var at=state.station?Number(state.station.slice(1)):0;jump(at);},
    resample:function(){if(!state.prepared)jump(5);else{state.counts=Q.shots(state.prepared,1024,state.error);emit('shots');}}
  };
})(window);

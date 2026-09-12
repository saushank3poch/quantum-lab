(function(global){
  'use strict';
  var I=global.Iso,W=global.World,S=global.Sim,Q=global.Quantum,labels=true;
  var P=I.project;
  function line(c,a,b,color,width){c.strokeStyle=color;c.lineWidth=width||1;I.polyLine(c,[P.apply(null,a),P.apply(null,b)],false);}
  function box(c,x,y,z,w,d,h,color){I.box(c,{x:x,y:y,z:z,w:w,d:d,h:h,color:color,edge:'rgba(43,77,88,.22)'});}
  function cylinder(c,x,y,z,r,h,color){I.cylinder(c,{x:x,y:y,z:z,r:r,h:h,color:color,edge:'rgba(43,77,88,.22)'});}
  function ground(c){
    box(c,-1,-2,-.9,29,26,.8,'#bdd0d8');
    c.fillStyle='#dce8ec';I.poly(c,[P(-1,-2),P(28,-2),P(28,24),P(-1,24)]);
    for(var x=0;x<29;x++)line(c,[x,-2,0],[x,24,0],'#cbdde3',.6);
    for(var y=-2;y<25;y++)line(c,[-1,y,0],[28,y,0],'#cbdde3',.6);
    // A miniature circuit etched into the substrate. The roads are the gate order.
    var pts=W.routes.out.pts;
    for(var j=1;j<pts.length;j++){
      var a=pts[j-1],b=pts[j];
      c.fillStyle='#b3cbd3';I.ribbon(c,a.x,a.y,b.x,b.y,2.45,.01);
      c.fillStyle='#f5f9f9';I.ribbon(c,a.x,a.y,b.x,b.y,1.95,.03);
      c.fillStyle='#8abeb9';I.ribbon(c,a.x,a.y,b.x,b.y,.11,.04);
      var len=Math.hypot(a.x-b.x,a.y-b.y),ux=(b.x-a.x)/len,uy=(b.y-a.y)/len;
      for(var t=1.5;t<len;t+=2.4){var xx=a.x+ux*t,yy=a.y+uy*t;
        line(c,[xx-ux*.18-uy*.2,yy-uy*.18+ux*.2,.05],[xx+ux*.18,yy+uy*.18,.05],'#85b7b3',1.4);
        line(c,[xx-ux*.18+uy*.2,yy-uy*.18-ux*.2,.05],[xx+ux*.18,yy+uy*.18,.05],'#85b7b3',1.4);
      }
    }
    W.districts.forEach(function(d){
      c.fillStyle=I.rgba(d.color,.11);I.disc(c,d.x,d.y,0,2.15);
      c.strokeStyle=I.rgba(d.color,.26);c.lineWidth=1;var p=P(d.x,d.y);c.beginPath();c.ellipse(p.x,p.y,2.15*I.TW*1.414,2.15*I.TH*1.414,0,0,Math.PI*2);c.stroke();
    });
    // Central chip sits clear of the route, a reminder this town is one circuit.
    box(c,10,8,.05,5.5,4.5,.2,'#87aeb8');
    for(var n=0;n<6;n++){
      box(c,9.6,8.3+n*.65,.06,.5,.24,.2,'#d7bc77');
      box(c,15.4,8.3+n*.65,.06,.5,.24,.2,'#d7bc77');
    }
    box(c,10.7,8.65,.25,4.1,3.2,.2,'#233f50');
    var center=P(12.75,10.1,.5);
    c.save();c.translate(center.x,center.y);c.fillStyle='#a4d0d6';c.font='600 13px monospace';c.textAlign='center';c.fillText('Q U A N T U M',0,-4);c.font='10px monospace';c.fillStyle='#82aaaF';c.fillText('STATE PROCESSOR',0,13);c.restore();
  }
  function landmark(c,d,clock){
    // Landmarks are behind their stopping points, so the live carrier stays visible.
    var x=d.x-2.2,y=d.y-2.7,k=d.index,col=d.color;
    box(c,x-.55,y-.4,0,3.4,2.6,.25,'#bacdd3');
    if(k===0){
      cylinder(c,x+1,y+.8,.25,1.05,.6,'#dee9e9');
      cylinder(c,x+1,y+.8,.85,.8,1.85,'#d3dfe4');
      for(var r=0;r<4;r++)cylinder(c,x+1,y+.8,.9+r*.48,.88,.1,r%2?'#77aaaE':'#e8f1f0');
      cylinder(c,x+1,y+.8,2.72,.65,.22,'#e4b562');
      cylinder(c,x+1,y+.8,2.94,.18,.35,'#4d9097');
      box(c,x-1,y+.9,.25,.8,.65,1.3,'#2c5365');
      box(c,x-.93,y+1.45,.75,.6,.06,.45,'#7fe3c7');
    }else if(k===1){
      box(c,x,y,.25,2.3,1.65,.9,'#e7eff1');
      box(c,x-.2,y-.1,1.15,2.7,1.9,.18,col);
      for(var j=0;j<2;j++){
        cylinder(c,x+.4+j*1.4,y+.8,1.33,.42,1.2,'#93c8d7');
        cylinder(c,x+.4+j*1.4,y+.8,2.5,.5,.16,'#335971');
      }
      var p=P(x+1.1,y+.8,2.9);c.fillStyle='#e8f6fa';c.strokeStyle='#4c879d';c.lineWidth=2;c.beginPath();c.arc(p.x,p.y,19,0,Math.PI*2);c.fill();c.stroke();c.fillStyle='#22657e';c.textAlign='center';c.font='600 22px monospace';c.fillText('H',p.x,p.y+8);
    }else if(k===2){
      for(var t=0;t<2;t++){
        box(c,x+t*1.5,y,.25,.85,1.6,2.15,'#dce6ef');
        box(c,x+t*1.5,y,2.4,.85,1.6,.25,col);
        box(c,x+t*1.5+.1,y+1.61,1,.65,.03,1.1,t===0?'#63bba9':'#9f7bbd');
      }
      line(c,[x+.4,y+.8,2.9],[x+1.9,y+.8,2.9],col,7);
      var q=P(x+1.15,y+.8,3.05);c.fillStyle=col;c.font='bold 20px monospace';c.textAlign='center';c.fillText(S.state.mode==='bell'?'CX':S.state.mode==='grover'?'O':'Z',q.x,q.y-7);
    }else if(k===3){
      box(c,x,y,.25,2.5,1.8,.6,'#dce8e8');
      for(var a=0;a<3;a++){
        cylinder(c,x+.5+a*.75,y+.9,.85,.25,1.1+a*.25,col);
        cylinder(c,x+.5+a*.75,y+.9,1.95+a*.25,.34,.12,'#a4e0d2');
      }
      var rr=P(x+1.25,y+.9,2.2);c.strokeStyle='#45a69e';c.lineWidth=3;c.beginPath();c.ellipse(rr.x,rr.y,43,20,-.3,0,Math.PI*2);c.stroke();
      c.fillStyle='#eafcf4';c.beginPath();c.arc(rr.x,rr.y,10,0,Math.PI*2);c.fill();
    }else if(k===4){
      box(c,x,y,.25,2.6,1.7,1.3,'#e5e9e7');
      box(c,x-.1,y-.1,1.55,2.8,1.9,.25,'#cc9b58');
      box(c,x+.35,y+1.72,.55,1.9,.05,.7,'#1a3c4b');
      var o=P(x+1.3,y+1.78,.93);c.save();c.translate(o.x,o.y);c.rotate(Math.atan2(I.TH,I.TW));c.fillStyle='#a3edcb';c.font='18px monospace';c.textAlign='center';c.fillText(S.state.outcome===null?'?':Q.label(S.state.outcome,Q.qubits(S.state.vector)),0,6);c.restore();
      cylinder(c,x+.55,y+.6,1.8,.25,.5,'#f2cc79');
    }else{
      box(c,x-.2,y,.25,2.8,1.7,.5,'#d9e5e9');
      for(var b=0;b<4;b++){
        var counts=S.state.counts,h=counts?counts[b]||0:0;
        var hh=.25+h/1024*2.7;
        box(c,x+b*.65,y+.35,.75,.43,.75,hh,['#5a9ca9','#82bebd','#798bad','#cfab68'][b]);
      }
    }
    // Power conduit from the machine to its stop.
    line(c,[x+1.2,y+2.2,.15],[d.x,d.y,.15],I.rgba(col,.5),2);
  }
  function carrier(c){
    var v=S.vanPosition(),a=S.state.vector;
    c.fillStyle='rgba(33,68,84,.16)';I.disc(c,v.x,v.y,0,1.1);
    I.orientedBox(c,{x:v.x,y:v.y,z:.18,len:2.25,wid:1.22,h:.3,hx:v.dx,hy:v.dy,color:'#294b5a'});
    I.orientedBox(c,{x:v.x,y:v.y,z:.48,len:2.4,wid:1.3,h:.47,hx:v.dx,hy:v.dy,color:'#efbd56'});
    var px=-v.dy,py=v.dx;
    a.forEach(function(am,i){
      var across=(i-(a.length-1)/2)*.49;
      var xx=v.x+across, yy=v.y-.1;
      var height=.12+Math.abs(am)*1.18;
      box(c,xx-.17,yy-.17,.97,.34,.34,height,am<0?'#9870bf':'#138c7e');
      var p=P(xx,yy,1.15+height);c.font='bold 12px monospace';c.textAlign='center';c.fillStyle=am<0?'#715295':'#176d66';c.fillText(am===0?'0':am<0?'−':'+',p.x,p.y);
    });
    var front=P(v.x+v.dx*1.05,v.y+v.dy*1.05,.74);c.fillStyle='#fff4bd';c.beginPath();c.arc(front.x,front.y,3,0,Math.PI*2);c.fill();
  }
  function scenery(c,o){
    if(o.kind==='server'){
      box(c,o.x,o.y,0,.8,.65,1.2,'#829fab');
      for(var k=0;k<3;k++)box(c,o.x+.1,o.y+.66,.2+k*.28,.6,.03,.09,'#c2dde0');
    }else{
      cylinder(c,o.x,o.y,0,.18,.95,'#8caaa9');
      cylinder(c,o.x,o.y,.9,.31,.13,'#dfecde');
    }
  }
  function drawLabels(c,cam){
    c.setTransform(cam.dpr,0,0,cam.dpr,0,0);
    var placed=[],v=S.vanPosition();
    function label(x,y,z,text,color,priority){
      var p=P(x,y,z),sx=p.x*cam.scale+cam.ox,sy=p.y*cam.scale+cam.oy;
      c.font=priority?'600 12px monospace':'500 12px -apple-system, sans-serif';
      var width=c.measureText(text).width+22, yy=sy-20, height=26;
      for(var tries=0;tries<10;tries++){
        var overlap=placed.some(function(r){return sx-width/2<r.x+r.w+5&&sx+width/2>r.x-5&&yy<r.y+r.h+4&&yy+height>r.y-4;});
        if(!overlap)break;yy-=30;
      }
      c.strokeStyle=I.rgba(color,.45);c.lineWidth=1;c.beginPath();c.moveTo(sx,sy+8);c.lineTo(sx,yy+height);c.stroke();
      c.fillStyle=priority?'#183e4d':'#f9fcfd';c.beginPath();c.roundRect(sx-width/2,yy,width,height,4);c.fill();
      c.strokeStyle=priority?'#183e4d':'#b9cdd5';c.stroke();c.fillStyle=priority?'#eaf9ee':color;c.textAlign='center';c.fillText(text,sx,yy+17);
      placed.push({x:sx-width/2,y:yy,w:width,h:height});
    }
    var st=S.state,n=Q.qubits(st.vector);
    var read=st.outcome===null?'STATE '+(n===1?'|ψ⟩':'|ψ₀₁⟩'):'MEASURED '+Q.label(st.outcome,n);
    label(v.x,v.y,3.0,read,'#315e6c',true);
    if(!labels)return;
    var ds=W.districts.slice().sort(function(a,b){return (a.id===st.station?-1:0)-(b.id===st.station?-1:0);});
    ds.forEach(function(d){if(cam.scale<.34&&d.id!==st.station)return;
      label(d.x-1.2,d.y-2,3.8,'0'+(d.index+1)+'  '+d.name,d.color,false);
    });
  }
  function draw(canvas,cam,clock,active,hover){
    var c=canvas.getContext('2d');c.setTransform(1,0,0,1,0,0);c.fillStyle='#e9f0f4';c.fillRect(0,0,canvas.width,canvas.height);
    c.setTransform(cam.dpr*cam.scale,0,0,cam.dpr*cam.scale,cam.dpr*cam.ox,cam.dpr*cam.oy);
    ground(c);
    var items=W.districts.map(function(d){return {depth:d.x+d.y-2.5,draw:function(){landmark(c,d,clock);}};});
    [[1,1],[1,4],[25,3],[25,6],[25,16],[4,21],[8,21],[19,21],[24,20],[1,18],[8,-.8],[16,-.8]].forEach(function(p,i){
      var o={x:p[0],y:p[1],kind:i%3?'lamp':'server'};items.push({depth:o.x+o.y+.7,draw:function(){scenery(c,o);}});
    });
    var v=S.vanPosition();items.push({depth:v.x+v.y,draw:function(){carrier(c);}});
    items.sort(function(a,b){return a.depth-b.depth;});items.forEach(function(o){o.draw();});
    var current=W.districts.find(function(d){return d.id===(hover||active);});
    if(current){c.strokeStyle=I.rgba(current.color,.5);c.lineWidth=2;var p=P(current.x,current.y,.05);c.beginPath();c.ellipse(p.x,p.y,67,33.5,0,0,Math.PI*2);c.stroke();}
    drawLabels(c,cam);
  }
  global.Renderer={draw:draw,setLabels:function(v){labels=v;}};
})(window);

// Original Interactivity Logic
function setMode(m){
  mode=m;edgePick=null;
  ['sel','node','edge','del'].forEach(x=>document.getElementById('tb-'+x).classList.remove('on'));
  const map={select:'sel',addNode:'node',addEdge:'edge',delete:'del'};
  document.getElementById('tb-'+map[m]).classList.add('on');
  const hints={
    select:'<strong>SELECT</strong> — Drag nodes to reposition | Right-click for options',
    addNode:'<strong>ADD ROUTER</strong> — Click canvas to place a new router node',
    addEdge:'<strong>ADD LINK</strong> — Click first router, then second to connect',
    delete:'<strong>DELETE</strong> — Click any router or link to remove it'
  };
  document.getElementById('hint-bar').innerHTML=hints[m];
  canvas.style.cursor=m==='addNode'?'crosshair':m==='delete'?'not-allowed':'default';
}

function setExecMode(m){
  execMode=m;
  document.getElementById('tb-step').classList.toggle('on',m==='step');
  document.getElementById('tb-auto').classList.toggle('on',m==='auto');
  if(algoSt&&!algoSt.done){if(m==='step')stopAuto();else startAuto();}
}

function cpx(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}

canvas.addEventListener('mousedown',e=>{
  e.preventDefault();initAudio();
  const p=cpx(e);const n=nodeAt(p.x,p.y);
  if(e.button===2){if(n)showCtx(n,p.x,p.y);return}
  if(e.button===1){panning=true;panSx=p.x;panSy=p.y;camSx=cam.x;camSy=cam.y;return}
  if(mode==='select'){
    if(n){dragging=n;const w=s2w(p.x,p.y);dox=n.x-w.x;doy=n.y-w.y;phyOn=false}
    else{panning=true;panSx=p.x;panSy=p.y;camSx=cam.x;camSy=cam.y}
  }else if(mode==='addNode'){
    const w=s2w(p.x,p.y);addNode(w.x,w.y);
  }else if(mode==='addEdge'){
    if(n){
      if(!edgePick){edgePick=n.id;toast('Selected '+n.id+' — click second router')}
      else if(edgePick!==n.id){
        const c=parseInt(document.getElementById('ecost').value)||10;
        addEdge(edgePick,n.id,c);edgePick=null;
      }
    }
  }else if(mode==='delete'){
    if(n)delNode(n.id);
    else{const edge=edgeAt(p.x,p.y);if(edge)delEdge(edge)}
  }
});

canvas.addEventListener('mousemove',e=>{
  const p=cpx(e);mouseX=p.x;mouseY=p.y;
  if(dragging){const w=s2w(p.x,p.y);dragging.x=w.x+dox;dragging.y=w.y+doy;dragging.vx=0;dragging.vy=0;return}
  if(panning){cam.x=camSx+(p.x-panSx)/cam.z;cam.y=camSy+(p.y-panSy)/cam.z;return}
  const n=nodeAt(p.x,p.y);
  if(n!==hNode){
    hNode=n;
    if(n){showTT(n,p.x,p.y);canvas.style.cursor=mode==='delete'?'not-allowed':'grab'}
    else{hideTT();canvas.style.cursor=mode==='addNode'?'crosshair':mode==='delete'?'crosshair':'default'}
  }else if(n)showTT(n,p.x,p.y);
  hEdge=n?null:edgeAt(p.x,p.y);
});

canvas.addEventListener('mouseup',e=>{
  if(dragging){phyOn=true;dragging.vx=0;dragging.vy=0;dragging=null}
  panning=false;
});
canvas.addEventListener('mouseleave',()=>{
  hNode=null;hEdge=null;hideTT();
  if(dragging){phyOn=true;dragging=null}panning=false;
});
canvas.addEventListener('wheel',e=>{
  e.preventDefault();
  const p=cpx(e);const w=s2w(p.x,p.y);
  const f=e.deltaY<0?1.12:0.89;
  cam.z=Math.max(0.08,Math.min(6,cam.z*f));
  const w2=s2w(p.x,p.y);cam.x+=w2.x-w.x;cam.y+=w2.y-w.y;
},{passive:false});
document.addEventListener('contextmenu',e=>e.preventDefault());
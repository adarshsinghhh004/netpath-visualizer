// Original Dijkstra Engine
class MPQ{
  constructor(){this.h=[]}
  push(it){this.h.push(it);this._up(this.h.length-1)}
  pop(){const t=this.h[0],l=this.h.pop();if(this.h.length){this.h[0]=l;this._dn(0)}return t}
  get size(){return this.h.length}
  _up(i){while(i>0){const p=Math.floor((i-1)/2);if(this.h[p].d<=this.h[i].d)break;[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p}}
  _dn(i){const n=this.h.length;while(true){let m=i,l=2*i+1,r=2*i+2;if(l<n&&this.h[l].d<this.h[m].d)m=l;if(r<n&&this.h[r].d<this.h[m].d)m=r;if(m===i)break;[this.h[m],this.h[i]]=[this.h[i],this.h[m]];i=m}}
}

function initDijk(){
  if(!srcNode||!dstNode){toast('Set SOURCE and DESTINATION first');return null}
  const dist={},prev={},visited=new Set(),frontier=new Set();
  for(const n of nodes){dist[n.id]=Infinity;prev[n.id]=null}
  dist[srcNode]=0;
  const pq=new MPQ();pq.push({id:srcNode,d:0});frontier.add(srcNode);
  return{dist,prev,visited,frontier,pq,curNode:null,evalEdges:new Set(),done:false,found:false,steps:0};
}

function stepDijk(){
  if(!algoSt||algoSt.done)return;
  const s=algoSt;s.steps++;stepCnt++;
  if(s.pq.size===0){
    s.done=true;
    setStatus('NO PATH EXISTS','err');
    document.getElementById('nopath').style.display='block';
    addLog(stepCnt,'No path from '+srcNode+' to '+dstNode,'ls');
    sndNoPath();stopAuto();return;
  }
  const{id:u}=s.pq.pop();
  s.frontier.delete(u);
  if(s.visited.has(u)){if(!s.done)setTimeout(stepDijk,0);return}
  s.visited.add(u);s.curNode=u;

  const un=getN(u);
  if(un){spawnRing(un.x,un.y,s.dist[u]<Infinity?'#009980':'#2a5a80');spawnBurst(un.x,un.y,'#00e5cc',5)}
  sndVisit(stepCnt);

  addLog(stepCnt,'Visit '+u+' (d='+(s.dist[u]===Infinity?'∞':s.dist[u])+')','lv');
  document.getElementById('a-step').textContent=stepCnt;
  document.getElementById('a-cur').textContent=u;
  document.getElementById('a-vis').textContent=s.visited.size;
  updDistTable();

  if(u===dstNode){
    s.done=true;s.found=true;
    pathN=[];pathE=[];
    let cur=dstNode;
    while(cur){
      pathN.push(cur);
      if(s.prev[cur]){const pe=edges.find(e=>(e.from===s.prev[cur]&&e.to===cur)||(e.from===cur&&e.to===s.prev[cur]));if(pe)pathE.push(pe.id)}
      cur=s.prev[cur];
    }
    pathN.reverse();pathE.reverse();
    const cost=s.dist[dstNode];
    document.getElementById('a-cost').textContent=cost;
    document.getElementById('path-banner').innerHTML=`PATH: <strong>${pathN.join(' → ')}</strong> &nbsp;·&nbsp; COST: <span class="pc">${cost}</span>`;
    document.getElementById('path-banner').style.display='block';
    setStatus('PATH FOUND — COST: '+cost,'done');
    addLog(stepCnt,'PATH: '+pathN.join('→')+' ['+cost+']','lp');
    sndPathFound();
    triggerGlitch();
    for(const pid of pathN){const pn=getN(pid);if(pn){spawnBurst(pn.x,pn.y,'#00e5cc',12);spawnRing(pn.x,pn.y,'#00e5cc')}}
    stopAuto();return;
  }

  for(const e of edges){
    let nb=null;
    if(e.from===u)nb=e.to;else if(e.to===u)nb=e.from;
    if(!nb||s.visited.has(nb))continue;
    s.evalEdges.add(e.id);
    const alt=s.dist[u]+e.cost;
    if(alt<s.dist[nb]){
      s.dist[nb]=alt;s.prev[nb]=u;
      s.pq.push({id:nb,d:alt});s.frontier.add(nb);
      addLog(stepCnt,'Update '+nb+' d='+alt+' via '+u,'lu');
      sndUpdate();
    }
  }
  updDistTable();
}

function runAlgo(){
  if(!srcNode||!dstNode){toast('Set SOURCE and DESTINATION first');return}
  initAudio();
  resetAlgo();
  algoSt=initDijk();if(!algoSt)return;
  stepCnt=0;
  setStatus('DIJKSTRA RUNNING...','run');
  document.getElementById('path-banner').style.display='none';
  document.getElementById('nopath').style.display='none';
  addLog(0,'INIT: '+srcNode+' → '+dstNode,'ls');
  tone(440,0.1,'square',0.05);
  startAuto();
}

function stepAlgo(){
  initAudio();
  if(!algoSt){
    if(!srcNode||!dstNode){toast('Set SOURCE and DESTINATION first');return}
    algoSt=initDijk();if(!algoSt)return;
    stepCnt=0;
    document.getElementById('path-banner').style.display='none';
    document.getElementById('nopath').style.display='none';
    addLog(0,'INIT: '+srcNode+' → '+dstNode,'ls');
    setStatus('STEPPING...','run');
  }
  if(algoSt.done){toast('Algorithm complete — reset to run again');return}
  stepDijk();
}

function startAuto(){
  stopAuto();
  const delay=1100-parseInt(document.getElementById('spd').value);
  algoTimer=setInterval(()=>{if(!algoSt||algoSt.done){stopAuto();return}stepDijk()},delay);
}
function stopAuto(){if(algoTimer){clearInterval(algoTimer);algoTimer=null}}

function resetAlgo(){
  stopAuto();algoSt=null;pathN=[];pathE=[];stepCnt=0;
  document.getElementById('path-banner').style.display='none';
  document.getElementById('nopath').style.display='none';
  document.getElementById('a-step').textContent='—';
  document.getElementById('a-cur').textContent='—';
  document.getElementById('a-cost').textContent='—';
  document.getElementById('a-vis').textContent='0';
  document.getElementById('step-log').innerHTML='';
  document.getElementById('dtbody').innerHTML='';
  setStatus('AWAITING EXECUTION','');
}
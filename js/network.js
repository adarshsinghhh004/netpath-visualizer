// Original Node Helpers
function NR(){return Math.max(9,14-nodes.length*0.06)}
function getN(id){return nodes.find(n=>n.id===id)}

function nodeAt(sx,sy){
  const w=s2w(sx,sy);const r=NR()+6;
  for(let i=nodes.length-1;i>=0;i--){
    const n=nodes[i];const dx=n.x-w.x,dy=n.y-w.y;
    if(dx*dx+dy*dy<r*r)return n;
  }return null;
}
function edgeAt(sx,sy){
  const w=s2w(sx,sy);
  for(const e of edges){
    const a=getN(e.from),b=getN(e.to);if(!a||!b)continue;
    const dx=b.x-a.x,dy=b.y-a.y,len=Math.sqrt(dx*dx+dy*dy)||0.1;
    const t=Math.max(0,Math.min(1,((w.x-a.x)*dx+(w.y-a.y)*dy)/(len*len)));
    const px=a.x+t*dx-w.x,py=a.y+t*dy-w.y;
    if(px*px+py*py<(7/cam.z)**2)return e;
  }return null;
}
function addNode(wx,wy){
  const lbl='R'+(++nid);
  nodes.push({id:lbl,x:wx,y:wy,vx:(Math.random()-0.5)*2,vy:(Math.random()-0.5)*2,label:lbl});
  spawnBurst(wx,wy,'#00e5cc',8);
  updStats();return lbl;
}
function addEdge(f,t,cost){
  if(f===t)return;
  if(edges.find(e=>(e.from===f&&e.to===t)||(e.from===t&&e.to===f)))return;
  cost=parseInt(cost)||Math.floor(Math.random()*80)+10;
  const id=++eid;
  edges.push({id,from:f,to:t,cost});
  for(let i=0;i<2;i++) ambientP.push({edgeId:id,t:Math.random(),speed:0.0015+Math.random()*0.002,dir:Math.random()<0.5?1:-1});
  updStats();
}
function delNode(id){
  nodes=nodes.filter(n=>n.id!==id);
  edges=edges.filter(e=>e.from!==id&&e.to!==id);
  ambientP=ambientP.filter(p=>!edges.find||true).filter(p=>{const e=edges.find(x=>x.id===p.edgeId);return!!e});
  if(srcNode===id){srcNode=null;document.getElementById('src-disp').textContent='—'}
  if(dstNode===id){dstNode=null;document.getElementById('dst-disp').textContent='—'}
  resetAlgo();updStats();
}
function delEdge(e){
  edges=edges.filter(x=>x.id!==e.id);
  ambientP=ambientP.filter(p=>p.edgeId!==e.id);
  updStats();
}
function clearAll(){
  nodes=[];edges=[];nid=0;eid=0;srcNode=null;dstNode=null;
  ambientP=[];particles=[];rings=[];
  document.getElementById('src-disp').textContent='—';
  document.getElementById('dst-disp').textContent='—';
  resetAlgo();updStats();
}
// Original Physics Engine
function phyUpdate(){
  springK=document.getElementById('spr-k').value/1000;
  repelK=parseInt(document.getElementById('rep-k').value);
  document.getElementById('spr-v').textContent=document.getElementById('spr-k').value;
  document.getElementById('rep-v').textContent=document.getElementById('rep-k').value;
}
function tickPhy(){
  if(!phyOn||nodes.length<2)return;
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i],b=nodes[j];
      let dx=b.x-a.x,dy=b.y-a.y,d=Math.sqrt(dx*dx+dy*dy)||0.1;
      const f=repelK/(d*d);const fx=dx/d*f,fy=dy/d*f;
      a.vx-=fx;a.vy-=fy;b.vx+=fx;b.vy+=fy;
    }
  }
  for(const e of edges){
    const a=getN(e.from),b=getN(e.to);if(!a||!b)continue;
    let dx=b.x-a.x,dy=b.y-a.y,d=Math.sqrt(dx*dx+dy*dy)||0.1;
    const f=(d-IDEAL)*springK*0.6;const fx=dx/d*f,fy=dy/d*f;
    a.vx+=fx;a.vy+=fy;b.vx-=fx;b.vy-=fy;
  }
  for(const n of nodes){n.vx+=n.x*-0.0003;n.vy+=n.y*-0.0003}
  for(const n of nodes){
    if(n===dragging){n.vx=0;n.vy=0;continue}
    n.vx*=damp;n.vy*=damp;n.x+=n.vx;n.y+=n.vy;
  }
}
function shuffleLayout(){
  for(const n of nodes){n.vx=(Math.random()-0.5)*8;n.vy=(Math.random()-0.5)*8}
}
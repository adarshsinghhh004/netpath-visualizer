// Original Network Generators
function genNet(){
  clearAll();
  const type=document.getElementById('gen-type').value;
  const n=parseInt(document.getElementById('gen-n').value);
  ({random:genRandom,mesh:genMesh,cluster:genCluster,hier:genHier,sw:genSW})[type](n);
  updStats();setTimeout(fitView,300);
  toast(type.charAt(0).toUpperCase()+type.slice(1)+' network: '+nodes.length+' routers, '+edges.length+' links');
}

function genRandom(n){
  nid=0;const s=Math.sqrt(n)*85;
  for(let i=0;i<n;i++){
    const a=Math.random()*Math.PI*2,r=Math.random()*s;
    addNode(Math.cos(a)*r,Math.sin(a)*r);
  }
  for(let i=0;i<nodes.length;i++){
    const sorted=[...nodes].filter(x=>x.id!==nodes[i].id).sort((a,b)=>d2(nodes[i],a)-d2(nodes[i],b));
    const k=2+Math.floor(Math.random()*3);
    for(let j=0;j<Math.min(k,sorted.length);j++)addEdge(nodes[i].id,sorted[j].id,rand(10,90));
  }
  for(let i=0;i<Math.floor(n*0.12);i++){
    const a=nodes[ri(nodes.length)],b=nodes[ri(nodes.length)];
    addEdge(a.id,b.id,rand(50,150));
  }
}
function genMesh(n){
  nid=0;const cols=Math.ceil(Math.sqrt(n)),rows=Math.ceil(n/cols),sp=100;
  const ox=-(cols-1)*sp/2,oy=-(rows-1)*sp/2;const g=[];
  for(let r=0;r<rows;r++){g[r]=[];for(let c=0;c<cols;c++){
    if(nodes.length>=n)break;
    const id=addNode(ox+c*sp+(Math.random()-0.5)*12,oy+r*sp+(Math.random()-0.5)*12);g[r][c]=id;
  }}
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    if(!g[r]||!g[r][c])continue;
    if(c+1<cols&&g[r][c+1])addEdge(g[r][c],g[r][c+1],rand(5,50));
    if(r+1<rows&&g[r+1]&&g[r+1][c])addEdge(g[r][c],g[r+1][c],rand(5,50));
    if(Math.random()<0.25&&r+1<rows&&c+1<cols&&g[r+1]&&g[r+1][c+1])addEdge(g[r][c],g[r+1][c+1],rand(15,65));
  }
}
function genCluster(n){
  nid=0;const nc=Math.max(3,Math.floor(Math.sqrt(n)*0.6));const cs=Math.floor(n/nc);
  const centers=[],members=[];
  for(let c=0;c<nc;c++){
    const a=(c/nc)*Math.PI*2,r=180+Math.random()*100;
    centers.push({x:Math.cos(a)*r,y:Math.sin(a)*r});members.push([]);
  }
  for(let c=0;c<nc;c++){
    const extra=c===0?n-cs*nc:0;
    for(let i=0;i<cs+extra;i++){
      const id=addNode(centers[c].x+(Math.random()-0.5)*110,centers[c].y+(Math.random()-0.5)*110);
      members[c].push(id);
    }
    for(let i=0;i<members[c].length;i++)
      for(let j=i+1;j<members[c].length;j++)
        if(Math.random()<0.45)addEdge(members[c][i],members[c][j],rand(5,30));
  }
  for(let c=0;c<nc;c++){
    const nx=(c+1)%nc;
    addEdge(members[c][ri(members[c].length)],members[nx][ri(members[nx].length)],rand(80,150));
    if(Math.random()<0.4)addEdge(members[c][ri(members[c].length)],members[nx][ri(members[nx].length)],rand(60,130));
  }
}
function genHier(n){
  nid=0;
  const root=addNode(0,-220);const l1=[],l2=[],l3=[];
  const n1=Math.min(5,Math.floor(n*0.1)+2);
  for(let i=0;i<n1;i++){const a=(i/n1)*Math.PI*2,id=addNode(Math.cos(a)*140,Math.sin(a)*140-30);l1.push(id);addEdge(root,id,rand(10,30))}
  const n2=Math.min(14,Math.floor(n*0.25));
  for(let i=0;i<n2;i++){const a=(i/n2)*Math.PI*2,id=addNode(Math.cos(a)*280,Math.sin(a)*260+80);l2.push(id);addEdge(l1[i%l1.length],id,rand(20,50))}
  for(let i=0;i<n-1-n1-n2;i++){const a=(i/(n-1-n1-n2))*Math.PI*2,r=420+Math.random()*70,id=addNode(Math.cos(a)*r,Math.sin(a)*r+120);l3.push(id);addEdge(l2[i%l2.length],id,rand(30,80))}
  for(let i=0;i<l1.length-1;i++)addEdge(l1[i],l1[(i+1)%l1.length],rand(15,40));
  for(let i=0;i<Math.floor(l2.length*0.35);i++){const a=l2[ri(l2.length)],b=l2[ri(l2.length)];addEdge(a,b,rand(25,60))}
}
function genSW(n){
  nid=0;const k=3;
  for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2,r=200+(Math.random()-0.5)*35;addNode(Math.cos(a)*r,Math.sin(a)*r)}
  for(let i=0;i<nodes.length;i++)for(let j=1;j<=k;j++)addEdge(nodes[i].id,nodes[(i+j)%nodes.length].id,rand(10,40));
  for(const e of [...edges])if(Math.random()<0.28){edges=edges.filter(x=>x.id!==e.id);addEdge(e.from,nodes[ri(nodes.length)].id,rand(20,100))}
}
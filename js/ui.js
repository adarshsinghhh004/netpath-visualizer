// Original UI Updates
function setStatus(t,type){
  document.getElementById('stext').textContent=t;
  document.getElementById('sdot').className=type;
}
function addLog(s,msg,cls){
  const log=document.getElementById('step-log');
  const el=document.createElement('div');
  el.className='le '+cls;
  el.innerHTML=`<span class="le-s">#${String(s).padStart(3,'0')}</span><span>${msg}</span>`;
  log.appendChild(el);log.scrollTop=log.scrollHeight;
}
function updDistTable(){
  if(!algoSt)return;
  const tb=document.getElementById('dtbody');tb.innerHTML='';
  const sorted=[...nodes].sort((a,b)=>{
    const da=algoSt.dist[a.id]===Infinity?1e9:algoSt.dist[a.id];
    const db=algoSt.dist[b.id]===Infinity?1e9:algoSt.dist[b.id];
    return da-db;
  });
  for(const n of sorted.slice(0,12)){
    const d=algoSt.dist[n.id],p=algoSt.prev[n.id];
    const tr=document.createElement('tr');
    if(n.id===algoSt.curNode)tr.className='cur';
    else if(pathN.includes(n.id))tr.className='pth';
    else if(algoSt.visited.has(n.id))tr.className='vis';
    tr.innerHTML=`<td>${n.id}</td><td class="${d===Infinity?'dinf':''}">${d===Infinity?'∞':d}</td><td>${p||'—'}</td>`;
    tb.appendChild(tr);
  }
}
function updStats(){
  document.getElementById('st-n').textContent=nodes.length;
  document.getElementById('st-e').textContent=edges.length;
  if(edges.length>0){
    document.getElementById('st-ac').textContent=Math.round(edges.reduce((s,e)=>s+e.cost,0)/edges.length);
  }else document.getElementById('st-ac').textContent='—';
  const mx=nodes.length*(nodes.length-1)/2;
  document.getElementById('st-d').textContent=mx>0?Math.round(edges.length/mx*100)+'%':'0%';
}
function toast(msg){
  const t=document.getElementById('toast');t.textContent=msg;t.style.opacity='1';
  setTimeout(()=>t.style.opacity='0',2500);
}
function showTT(n,sx,sy){
  const tt=document.getElementById('tt');
  const nb=edges.filter(e=>e.from===n.id||e.to===n.id);
  let h=`<div class="tt-id">${n.id}</div>`;
  h+=`<div class="tt-r"><span>Links</span><span>${nb.length}</span></div>`;
  if(algoSt){
    const d=algoSt.dist[n.id];
    h+=`<div class="tt-r"><span>Distance</span><span>${d===Infinity?'∞':d}</span></div>`;
    if(algoSt.prev[n.id])h+=`<div class="tt-r"><span>Via</span><span>${algoSt.prev[n.id]}</span></div>`;
  }
  if(nb.length){
    h+='<div style="margin-top:5px;padding-top:4px;border-top:1px solid #0b1f38">';
    for(const e of nb.slice(0,4)){
      const o=e.from===n.id?e.to:e.from;
      h+=`<div class="tt-r"><span>${o}</span><span>${e.cost}</span></div>`;
    }
    if(nb.length>4)h+=`<div style="color:#163560">+${nb.length-4} more</div>`;
    h+='</div>';
  }
  tt.innerHTML=h;
  const wrap=document.getElementById('cv-wrap').getBoundingClientRect();
  let tx=sx+16,ty=sy-10;
  if(tx+160>wrap.width)tx=sx-170;
  if(ty+120>wrap.height)ty=sy-130;
  tt.style.left=tx+'px';tt.style.top=ty+'px';tt.style.display='block';
}
function hideTT(){document.getElementById('tt').style.display='none'}

function showCtx(n,sx,sy){
  ctxNode=n;
  document.getElementById('ctx-head').textContent=n.id;
  const wrap=document.getElementById('cv-wrap').getBoundingClientRect();
  let x=sx,y=sy;
  if(x+160>wrap.width)x=wrap.width-165;
  if(y+130>wrap.height)y=wrap.height-135;
  document.getElementById('ctx').style.left=x+'px';
  document.getElementById('ctx').style.top=y+'px';
  document.getElementById('ctx').style.display='block';
  document.getElementById('ctx-back').style.display='block';
}
function hideCtx(){
  document.getElementById('ctx').style.display='none';
  document.getElementById('ctx-back').style.display='none';
}
function ctxSrc(){
  if(!ctxNode)return;srcNode=ctxNode.id;
  document.getElementById('src-disp').textContent=ctxNode.id;
  sndSelect();hideCtx();resetAlgo();
  setStatus('SRC: '+ctxNode.id+(dstNode?' | DST: '+dstNode+' — READY':'  — SET DESTINATION'),'');
}
function ctxDst(){
  if(!ctxNode)return;dstNode=ctxNode.id;
  document.getElementById('dst-disp').textContent=ctxNode.id;
  sndSelect();hideCtx();resetAlgo();
  setStatus((srcNode?'SRC: '+srcNode+' | ':'')+'DST: '+ctxNode.id+(srcNode?' — READY':'  — SET SOURCE'),'');
}
function ctxDel(){if(!ctxNode)return;delNode(ctxNode.id);ctxNode=null;hideCtx()}

function onSpdChange(){
  const v=parseInt(document.getElementById('spd').value);
  document.getElementById('spd-v').textContent=(1100-v)+'ms';
  if(algoTimer)startAuto();
}
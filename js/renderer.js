// Original Drawing Logic
function spawnBurst(x,y,color,count){
  for(let i=0;i<count;i++){
    const a=Math.random()*Math.PI*2,s=1+Math.random()*3;
    particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,maxLife:1,
      color,size:1+Math.random()*2,decay:0.02+Math.random()*0.04});
  }
}
function spawnRing(x,y,color){
  rings.push({x,y,r:NR(),maxR:NR()*4,life:1,maxLife:1,color});
}
function tickParticles(){
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];
    p.x+=p.vx;p.y+=p.vy;p.vx*=0.94;p.vy*=0.94;
    p.life-=p.decay;if(p.life<=0)particles.splice(i,1);
  }
  for(let i=rings.length-1;i>=0;i--){
    const r=rings[i];
    r.r+=2;r.life-=0.04;if(r.life<=0)rings.splice(i,1);
  }
  for(const ap of ambientP){
    const e=edges.find(x=>x.id===ap.edgeId);if(!e)continue;
    ap.t+=ap.speed*ap.dir;
    if(ap.t>1){ap.t=0}else if(ap.t<0){ap.t=1}
  }
  sweepY+=1.5;if(sweepY>canvas.height)sweepY=-60;
}

function nodeColor(n){
  if(!algoSt){
    if(n.id===srcNode)return{fill:'#00ff9d',glow:'#00ff9d',hot:false};
    if(n.id===dstNode)return{fill:'#ff8c42',glow:'#ff8c42',hot:false};
    return{fill:'#1a4a8a',glow:'#2060b0',hot:false};
  }
  const s=algoSt;
  if(pathN.includes(n.id))return{fill:'#00e5cc',glow:'#00e5cc',hot:true};
  if(n.id===s.curNode)return{fill:'#ff2d55',glow:'#ff2d55',hot:true};
  if(s.visited.has(n.id))return{fill:'#009980',glow:'#009980',hot:false};
  if(s.frontier.has(n.id))return{fill:'#ffd60a',glow:'#ffd60a',hot:false};
  if(n.id===srcNode)return{fill:'#00ff9d',glow:'#00ff9d',hot:false};
  if(n.id===dstNode)return{fill:'#ff8c42',glow:'#ff8c42',hot:false};
  return{fill:'#1a4a8a',glow:'#2060b0',hot:false};
}

function drawHexGrid(){
  const ox=(cam.x*0.2*cam.z+canvas.width/2)%90;
  const oy=(cam.y*0.2*cam.z+canvas.height/2)%78;
  const size=30;const w=size*2,h=Math.sqrt(3)*size;
  ctx.save();
  ctx.strokeStyle='rgba(10,30,60,0.5)';ctx.lineWidth=0.5;
  for(let col=-2;col<canvas.width/w+3;col++){
    for(let row=-2;row<canvas.height/h+3;row++){
      const x=col*w*1.5+ox+(row%2)*w*0.75;
      const y=row*h+oy;
      ctx.beginPath();
      for(let i=0;i<6;i++){
        const a=Math.PI/180*(60*i-30);
        i===0?ctx.moveTo(x+size*Math.cos(a),y+size*Math.sin(a))
             :ctx.lineTo(x+size*Math.cos(a),y+size*Math.sin(a));
      }
      ctx.closePath();ctx.stroke();
    }
  }
  ctx.restore();
}

function drawScanSweep(){
  if(sweepY<0||sweepY>canvas.height)return;
  const g=ctx.createLinearGradient(0,sweepY-30,0,sweepY+30);
  g.addColorStop(0,'transparent');
  g.addColorStop(0.5,'rgba(0,229,204,0.06)');
  g.addColorStop(1,'transparent');
  ctx.fillStyle=g;ctx.fillRect(0,sweepY-30,canvas.width,60);
}

function drawEdges(){
  for(const e of edges){
    const a=getN(e.from),b=getN(e.to);if(!a||!b)continue;
    const isPath=pathE.includes(e.id);
    const isEval=algoSt&&algoSt.evalEdges&&algoSt.evalEdges.has(e.id);
    const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
    const dx=b.x-a.x,dy=b.y-a.y,len=Math.sqrt(dx*dx+dy*dy)||1;
    const curve=len*0.08;
    const cpx=mx-dy/len*curve,cpy=my+dx/len*curve;

    let col='#0b1f38',alpha=0.7,lw=1;
    if(isPath){col='#00e5cc';alpha=1;lw=2.5}
    else if(isEval){col='#bf5af2';alpha=0.55;lw=1.5}
    else if(algoSt&&(algoSt.visited.has(a.id)||algoSt.visited.has(b.id))){col='#009980';alpha=0.35;lw=1}
    else if(hEdge===e){col='#3a8acc';alpha=0.9;lw=1.5}

    ctx.save();
    if(isPath){
      for(const [w2,a2] of [[12,0.08],[6,0.2],[3,0.6]]){
        ctx.strokeStyle=col;ctx.globalAlpha=a2*alpha;ctx.lineWidth=w2/cam.z;
        ctx.shadowColor=col;ctx.shadowBlur=0;
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo(cpx,cpy,b.x,b.y);ctx.stroke();
      }
    }
    ctx.strokeStyle=col;ctx.globalAlpha=alpha;ctx.lineWidth=lw/cam.z;
    ctx.shadowColor=isPath?col:'transparent';ctx.shadowBlur=isPath?8/cam.z:0;
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo(cpx,cpy,b.x,b.y);ctx.stroke();
    ctx.restore();

    if(cam.z>0.35||hEdge===e){
      ctx.save();
      const fs=Math.max(8,10/cam.z);
      ctx.font=`${fs}px "Share Tech Mono"`;
      ctx.textAlign='center';ctx.textBaseline='middle';
      const m=ctx.measureText(e.cost);const tw=m.width+5,th=fs+4;
      ctx.fillStyle='rgba(1,8,16,0.85)';
      ctx.fillRect(cpx-tw/2,cpy-th/2,tw,th);
      ctx.fillStyle=isPath?'#00e5cc':hEdge===e?'#5aaccc':'#2a5a80';
      ctx.fillText(e.cost,cpx,cpy);
      ctx.restore();
    }
  }
}

function drawAmbientParticles(){
  for(const ap of ambientP){
    const e=edges.find(x=>x.id===ap.edgeId);if(!e)continue;
    const a=getN(e.from),b=getN(e.to);if(!a||!b)continue;
    const isPath=pathE.includes(e.id);
    const dx=b.x-a.x,dy=b.y-a.y,len=Math.sqrt(dx*dx+dy*dy)||1;
    const curve=len*0.08;
    const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
    const cpx=mx-dy/len*curve,cpy=my+dx/len*curve;
    const t=ap.t;
    const px=(1-t)*(1-t)*a.x+2*(1-t)*t*cpx+t*t*b.x;
    const py=(1-t)*(1-t)*a.y+2*(1-t)*t*cpy+t*t*b.y;
    ctx.save();
    ctx.globalAlpha=isPath?0.9:0.25;
    const col=isPath?'#00e5cc':'#1a5080';
    ctx.shadowColor=col;ctx.shadowBlur=isPath?6:3;
    ctx.fillStyle=col;
    ctx.beginPath();ctx.arc(px,py,(isPath?2.5:1.5)/cam.z,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
}

function draw3DSphere(n){
  const r=NR();const c=nodeColor(n);
  const {x,y}=n;

  ctx.save();
  ctx.globalAlpha=0.35;
  ctx.fillStyle='rgba(0,0,0,0.5)';
  ctx.beginPath();ctx.ellipse(x+r*0.25,y+r*0.5,r*0.7,r*0.25,0,0,Math.PI*2);ctx.fill();
  ctx.restore();

  const haloG=ctx.createRadialGradient(x,y,r,x,y,r*3);
  haloG.addColorStop(0,c.glow+'30');haloG.addColorStop(1,'transparent');
  ctx.save();ctx.fillStyle=haloG;
  ctx.beginPath();ctx.arc(x,y,r*3,0,Math.PI*2);ctx.fill();ctx.restore();

  if(c.hot){
    const pr=r+4+Math.sin(time*0.12)*3;
    ctx.save();ctx.strokeStyle=c.glow;
    ctx.globalAlpha=0.35+Math.sin(time*0.12)*0.15;
    ctx.lineWidth=1/cam.z;
    ctx.shadowColor=c.glow;ctx.shadowBlur=8/cam.z;
    ctx.beginPath();ctx.arc(x,y,pr,0,Math.PI*2);ctx.stroke();ctx.restore();
  }

  const baseG=ctx.createRadialGradient(x-r*0.3,y-r*0.35,r*0.05,x,y,r);
  const fc=c.fill;
  baseG.addColorStop(0,lighten(fc,0.7));
  baseG.addColorStop(0.4,fc);
  baseG.addColorStop(1,darken(fc,0.5));
  ctx.save();
  ctx.shadowColor=c.glow;
  ctx.shadowBlur=(hNode===n?20:10)/cam.z;
  ctx.fillStyle=baseG;
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  ctx.restore();

  const rimG=ctx.createRadialGradient(x+r*0.5,y+r*0.5,r*0.2,x,y,r);
  rimG.addColorStop(0,'transparent');
  rimG.addColorStop(0.7,'transparent');
  rimG.addColorStop(1,c.glow+'60');
  ctx.save();ctx.fillStyle=rimG;
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.restore();

  const specG=ctx.createRadialGradient(x-r*0.35,y-r*0.38,0,x-r*0.35,y-r*0.38,r*0.5);
  specG.addColorStop(0,'rgba(255,255,255,0.75)');
  specG.addColorStop(0.4,'rgba(255,255,255,0.2)');
  specG.addColorStop(1,'transparent');
  ctx.save();ctx.fillStyle=specG;
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.restore();

  ctx.save();
  ctx.strokeStyle=c.glow;ctx.lineWidth=(hNode===n?1.5:0.8)/cam.z;
  ctx.globalAlpha=0.7;
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();ctx.restore();

  ctx.save();
  ctx.fillStyle=hNode===n?'#fff':'rgba(255,255,255,0.85)';
  ctx.font=`bold ${Math.max(7,r*0.85)}px "Rajdhani"`;
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.shadowColor=c.glow;ctx.shadowBlur=4;
  ctx.fillText(n.label,x,y);ctx.restore();
}

function drawTargetReticle(n){
  const r=NR()+8;const{x,y}=n;const t=time*0.03;
  const col=nodeColor(n).glow;
  ctx.save();
  ctx.strokeStyle=col;ctx.lineWidth=1/cam.z;
  ctx.globalAlpha=0.6+Math.sin(time*0.1)*0.2;
  const blen=r*0.55,gap=r*0.25;
  const corners=[[1,1],[-1,1],[1,-1],[-1,-1]];
  for(const[sx,sy]of corners){
    const bx=x+sx*(r+gap/2),by=y+sy*(r+gap/2);
    ctx.beginPath();
    ctx.moveTo(bx-sx*blen,by);ctx.lineTo(bx,by);ctx.lineTo(bx,by-sy*blen);
    ctx.stroke();
  }
  for(let i=0;i<4;i++){
    const a=t+i*Math.PI/2;
    const ix=x+Math.cos(a)*(r+gap),iy=y+Math.sin(a)*(r+gap);
    ctx.globalAlpha=0.4;
    ctx.beginPath();ctx.arc(ix,iy,1.5/cam.z,0,Math.PI*2);ctx.fill();
  }
  const fs=Math.max(8,8/cam.z);
  ctx.globalAlpha=0.5;ctx.fillStyle=col;
  ctx.font=`${fs}px "Share Tech Mono"`;
  ctx.textAlign='left';ctx.textBaseline='top';
  ctx.fillText(`${Math.round(n.x)},${Math.round(n.y)}`,x+r+4,y-r);
  ctx.restore();
}

function drawEdgePickLine(){
  if(mode!=='addEdge'||!edgePick)return;
  const n=getN(edgePick);if(!n)return;
  const w=s2w(mouseX,mouseY);
  ctx.save();
  ctx.strokeStyle='#00e5cc';ctx.globalAlpha=0.45;
  ctx.lineWidth=1.5/cam.z;ctx.setLineDash([5/cam.z,4/cam.z]);
  ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(w.x,w.y);ctx.stroke();
  ctx.restore();
}

function drawParticles(){
  for(const p of particles){
    const s=w2s(p.x,p.y);
    ctx.save();ctx.globalAlpha=p.life*0.8;
    ctx.fillStyle=p.color;
    ctx.shadowColor=p.color;ctx.shadowBlur=4;
    ctx.beginPath();ctx.arc(p.x,p.y,p.size/cam.z,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
  for(const r of rings){
    ctx.save();ctx.strokeStyle=r.color;
    ctx.globalAlpha=r.life*0.6;ctx.lineWidth=1.5/cam.z;
    ctx.shadowColor=r.color;ctx.shadowBlur=8/cam.z;
    ctx.beginPath();ctx.arc(r.x,r.y,r.r,0,Math.PI*2);ctx.stroke();
    ctx.restore();
  }
}

function triggerGlitch(){
  const gl=document.getElementById('glitch-layer');
  gl.classList.add('active');setTimeout(()=>gl.classList.remove('active'),200);
}

function fitView(){
  if(!nodes.length)return;
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  for(const n of nodes){minX=Math.min(minX,n.x);maxX=Math.max(maxX,n.x);minY=Math.min(minY,n.y);maxY=Math.max(maxY,n.y)}
  const pw=canvas.width-120,ph=canvas.height-80;
  const gw=maxX-minX+100,gh=maxY-minY+100;
  cam.z=Math.min(pw/gw,ph/gh,2.2);
  cam.x=-(minX+maxX)/2;cam.y=-(minY+maxY)/2;
}

function drawAll(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawHexGrid();
  drawScanSweep();

  ctx.save();
  ctx.translate(canvas.width/2,canvas.height/2);
  ctx.scale(cam.z,cam.z);
  ctx.translate(cam.x,cam.y);

  drawEdges();
  drawAmbientParticles();
  drawEdgePickLine();
  drawParticles();

  for(const n of nodes) draw3DSphere(n);
  if(hNode) drawTargetReticle(hNode);

  ctx.restore();
  time++;
}
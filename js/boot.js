// Original Boot Sequence Data
const bootLines=[
  {t:'> INITIALIZING NETPATH NEURAL ROUTING SYSTEM v4.2.1',c:''},
  {t:'> LOADING PHYSICS SIMULATION ENGINE...',c:''},
  {t:'  [OK] FORCE-DIRECTED LAYOUT MODULE',c:'bl-ok'},
  {t:'> INITIALIZING DIJKSTRA PATHFINDING CORE...',c:''},
  {t:'  [OK] MIN-HEAP PRIORITY QUEUE: READY',c:'bl-ok'},
  {t:'> LOADING RENDERING PIPELINE...',c:''},
  {t:'  [OK] WEBGL CANVAS: ACTIVE',c:'bl-ok'},
  {t:'  [OK] PARTICLE SYSTEM: LOADED',c:'bl-ok'},
  {t:'> CALIBRATING NETWORK TOPOLOGY ENGINE...',c:''},
  {t:'  [OK] 5 TOPOLOGY GENERATORS LOADED',c:'bl-ok'},
  {t:'> AUDIO SUBSYSTEM: STANDBY (AWAITING USER GESTURE)',c:'bl-warn'},
  {t:'> ALL SYSTEMS NOMINAL',c:''},
  {t:'> GENERATING INITIAL NETWORK TOPOLOGY...',c:''},
  {t:'  [READY] NETPATH ONLINE',c:'bl-ok'},
];

function runBoot(){
  const container=document.getElementById('boot-lines');
  const fill=document.getElementById('boot-fill');
  let i=0;
  function next(){
    if(i>=bootLines.length){
      fill.style.width='100%';
      setTimeout(()=>{
        document.getElementById('boot').style.opacity='0';
        document.getElementById('app').classList.add('visible');
        genNet(); 
        loop();
        setTimeout(()=>{document.getElementById('boot').style.display='none'},1000);
      },400);
      return;
    }
    const bl=bootLines[i];
    const el=document.createElement('span');
    el.className='bl '+(bl.c||'');el.textContent=bl.t;
    container.appendChild(el);
    requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('show')));
    fill.style.width=((i+1)/bootLines.length*100)+'%';
    i++;
    setTimeout(next,70+Math.random()*80);
  }
  next();
}
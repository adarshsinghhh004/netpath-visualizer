// Original Boot and Loop Runner
function resize(){
  const w=document.getElementById('cv-wrap');
  canvas.width=w.clientWidth;canvas.height=w.clientHeight;
}
window.addEventListener('resize',resize);resize();

function loop(){
  tickPhy();
  tickParticles();
  drawAll();
  requestAnimationFrame(loop)
}

// Start boot
runBoot();
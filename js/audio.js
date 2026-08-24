// Original Sound Engine
let AC = null;
function initAudio(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}}
function tone(freq,dur,type='sine',vol=0.07){
  if(!AC)return;
  try{
    const o=AC.createOscillator(),g=AC.createGain();
    o.connect(g);g.connect(AC.destination);
    o.frequency.value=freq;o.type=type;
    g.gain.setValueAtTime(vol,AC.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,AC.currentTime+dur);
    o.start();o.stop(AC.currentTime+dur);
  }catch(e){}
}
function sndVisit(step){tone(300+step*8,0.08,'sine',0.05)}
function sndUpdate(){tone(600,0.05,'triangle',0.03)}
function sndSelect(){tone(880,0.04,'square',0.04)}
function sndPathFound(){[523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,0.35,'sine',0.06),i*80))}
function sndNoPath(){[300,250,200].forEach((f,i)=>setTimeout(()=>tone(f,0.2,'sawtooth',0.04),i*100))}
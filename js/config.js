// Original State Variables
let nodes=[],edges=[];
let nid=0,eid=0;
let cam={x:0,y:0,z:1};
let mode='select';
let execMode='step';
let dragging=null,dox=0,doy=0;
let panning=false,panSx=0,panSy=0,camSx=0,camSy=0;
let hNode=null,hEdge=null;
let edgePick=null;
let ctxNode=null;
let srcNode=null,dstNode=null;
let algoSt=null,algoTimer=null,stepCnt=0;
let pathN=[],pathE=[];
let springK=0.008,repelK=800,damp=0.86;
let IDEAL=120;
let phyOn=true;
let time=0;

// Original Particle system vars
let particles=[]; 
let ambientP=[];  
let rings=[];     
let sweepY=-100;
let mouseX=0,mouseY=0;

// Setup canvas globally
const canvas = document.getElementById('mc');
const ctx = canvas.getContext('2d');
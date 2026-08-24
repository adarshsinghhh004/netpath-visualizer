// Original Transforms and Math Helpers
function w2s(wx,wy){return{x:(wx+cam.x)*cam.z+canvas.width/2,y:(wy+cam.y)*cam.z+canvas.height/2}}
function s2w(sx,sy){return{x:(sx-canvas.width/2)/cam.z-cam.x,y:(sy-canvas.height/2)/cam.z-cam.y}}

function hexToRgb(hex){
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return{r,g,b};
}
function lighten(hex,amt){
  const{r,g,b}=hexToRgb(hex);
  return`rgb(${Math.min(255,r+200*amt)},${Math.min(255,g+200*amt)},${Math.min(255,b+200*amt)})`;
}
function darken(hex,amt){
  const{r,g,b}=hexToRgb(hex);
  return`rgb(${Math.max(0,r-200*amt)},${Math.max(0,g-200*amt)},${Math.max(0,b-200*amt)})`;
}
function rand(a,b){return Math.floor(Math.random()*(b-a))+a}
function ri(n){return Math.floor(Math.random()*n)}
function d2(a,b){return(a.x-b.x)**2+(a.y-b.y)**2}
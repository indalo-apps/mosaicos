// ---------- Zoom (v2.8): ampliar el dibujo de Trazar y Colorear con dos dedos, la rueda (Ctrl o pellizco en el panel táctil) o los botones ----------
// Dos dedos amplían y mueven; ya ampliado, un dedo mueve el dibujo (y deslizar no cambia de paso). Un toque sigue pintando.
// Mientras se repasa a mano no hay zoom: el dedo dibuja. «Tamaño normal» lo devuelve todo a su sitio.
(function(){
const MAX=5;
function zoomable(el,{activo=()=>true}={}){
  let s=1,tx=0,ty=0;const P=new Map();let ini=null,movido=false,ultimo=0;
  const caja=()=>el.getBoundingClientRect();
  const hijos=()=>[...el.children].filter(c=>!c.classList.contains('zoom-ui'));
  function aplicar(){const r=caja(),w=r.width,h=r.height;
    s=Math.min(MAX,Math.max(1,s));tx=Math.min(0,Math.max(w-w*s,tx));ty=Math.min(0,Math.max(h-h*s,ty));
    if(s<1.01){s=1;tx=0;ty=0;}
    for(const c of hijos()){c.style.transformOrigin='0 0';c.style.transform=s===1?'':`translate(${tx}px,${ty}px) scale(${s})`;}
    el.dataset.zoom=s>1?s.toFixed(2):'';el.classList.toggle('ampliado',s>1);
    ui.normal.hidden=s===1;ui.menos.hidden=s===1;}
  function zoomEn(f,cx,cy){const r=caja(),x=cx-r.left,y=cy-r.top,s1=Math.min(MAX,Math.max(1,s*f)),k=s1/s;tx=x-(x-tx)*k;ty=y-(y-ty)*k;s=s1;aplicar();}
  function reset(){s=1;tx=0;ty=0;aplicar();}
  // botones visibles: el gesto no es la única forma de ampliar
  const ui={};const barra=document.createElement('div');barra.className='zoom-ui';
  barra.innerHTML=`<button type="button" data-z="mas" aria-label="${tr('Ampliar el dibujo','Zoom in')}">+</button><button type="button" data-z="menos" aria-label="${tr('Reducir el dibujo','Zoom out')}" hidden>−</button><button type="button" data-z="normal" hidden>${tr('Tamaño normal','Normal size')}</button>`;
  el.insertAdjacentElement('afterend',barra);
  ui.mas=barra.querySelector('[data-z=mas]');ui.menos=barra.querySelector('[data-z=menos]');ui.normal=barra.querySelector('[data-z=normal]');
  barra.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const r=caja(),cx=r.left+r.width/2,cy=r.top+r.height/2;
    if(b.dataset.z==='mas')zoomEn(1.6,cx,cy);else if(b.dataset.z==='menos')zoomEn(1/1.6,cx,cy);else{reset();ui.mas.focus();}});
  // gestos
  el.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'||!activo())return;P.set(e.pointerId,[e.clientX,e.clientY]);movido=false;
    if(P.size===2){const [a,b]=[...P.values()];ini={d:Math.hypot(a[0]-b[0],a[1]-b[1]),m:[(a[0]+b[0])/2,(a[1]+b[1])/2],s,tx,ty};}
    else if(P.size===1)ini={p:[e.clientX,e.clientY],tx,ty};});
  el.addEventListener('pointermove',e=>{if(!P.has(e.pointerId)||!ini)return;P.set(e.pointerId,[e.clientX,e.clientY]);
    if(P.size>=2&&ini.d){const [a,b]=[...P.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]),m=[(a[0]+b[0])/2,(a[1]+b[1])/2],r=caja();
      const s1=Math.min(MAX,Math.max(1,ini.s*d/ini.d)),k=s1/ini.s,x=ini.m[0]-r.left,y=ini.m[1]-r.top;
      s=s1;tx=x-(x-ini.tx)*k+(m[0]-ini.m[0]);ty=y-(y-ini.ty)*k+(m[1]-ini.m[1]);movido=true;aplicar();e.preventDefault();}
    else if(P.size===1&&s>1&&ini.p){const dx=e.clientX-ini.p[0],dy=e.clientY-ini.p[1];if(Math.hypot(dx,dy)>6)movido=true;
      if(movido){tx=ini.tx+dx;ty=ini.ty+dy;aplicar();e.preventDefault();}}});
  const fin=e=>{if(!P.has(e.pointerId))return;P.delete(e.pointerId);if(movido)ultimo=Date.now();
    if(P.size===1){const p=[...P.values()][0];ini={p,tx,ty};}else if(!P.size)ini=null;};
  ['pointerup','pointercancel','pointerleave'].forEach(t=>el.addEventListener(t,fin));
  // después de mover o pellizcar, el dedo al soltarse no pinta
  el.addEventListener('click',e=>{if(Date.now()-ultimo<350){e.stopPropagation();e.preventDefault();}},true);
  // ordenador: Ctrl + rueda, o pellizco en el panel táctil
  el.addEventListener('wheel',e=>{if(!e.ctrlKey||!activo())return;e.preventDefault();zoomEn(Math.exp(-e.deltaY*0.01),e.clientX,e.clientY);},{passive:false});
  // el dibujo se rehace a menudo (cada paso, cada pieza pintada): se le vuelve a aplicar el zoom
  new MutationObserver(()=>{if(s>1)aplicar();}).observe(el,{childList:true});
  addEventListener('resize',()=>aplicar());
  return {reset};}
const Z=[];
const tz=document.getElementById('tzsvg'),cz=document.getElementById('svg');
if(tz)Z.push(zoomable(tz,{activo:()=>!tz.classList.contains('practicando')}));
if(cz)Z.push(zoomable(cz));
// al cambiar de alicatado o de pantalla, el dibujo vuelve a su tamaño
addEventListener('hashchange',()=>Z.forEach(z=>z.reset()));
document.addEventListener('click',e=>{if(e.target.closest('.viewbar button,[data-met]'))Z.forEach(z=>z.reset());});
})();

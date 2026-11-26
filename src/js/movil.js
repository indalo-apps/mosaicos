// ---------- v2.15: usabilidad en el móvil ----------
// · Mide lo que se queda fijo arriba (pestañas y dibujo) para que no tape el foco (scroll-padding-top: --fijo)
//   y para que en Colorear la fila de vistas se esconda bajo las pestañas al bajar (--alto-vb).
// · En el móvil, Deshacer va sobre el dibujo (junto al zoom) y Exportar, Otro color y Reiniciar bajan a los controles.
// · Las filas que se deslizan (vistas de Colorear) se difuminan por el lado en que hay más botones.
// · Al cambiar de paso en Trazar, si el texto del paso ha quedado bajo el dibujo, la pantalla baja o sube hasta él.
(function(){
const $=id=>document.getElementById(id),raiz=document.documentElement;
const MQ=matchMedia('(max-width:760px)');
const tabsVis=()=>{const b=$('barra-etapas');return b&&!b.hidden&&b.offsetParent!==null;};
const etapa=()=>['trazado','teselar','colorear','imprimir'].find(n=>{const t=$('tab-'+n);return t&&t.classList.contains('show');});
function medir(){
  const tabs=tabsVis()?$('barra-etapas').offsetHeight:0;if(tabs)raiz.style.setProperty('--alto-tabs',tabs+'px');
  let vb=0;const cz=document.querySelector('#tab-colorear>.stage'),bar=cz&&cz.querySelector('.viewbar');
  if(cz&&bar&&bar.offsetParent!==null){const a=cz.getBoundingClientRect(),b=bar.getBoundingClientRect();vb=Math.round(b.bottom-a.top+parseFloat(getComputedStyle(bar).marginBottom||0));
    raiz.style.setProperty('--alto-vb',vb+'px');}
  let fijo=tabs;const e=tabs&&etapa();
  if(e&&MQ.matches&&e!=='imprimir'){const st=e==='colorear'?cz:document.querySelector('#tab-'+e+' .stage');if(st)fijo+=st.offsetHeight-(e==='colorear'?vb:0);}
  raiz.style.setProperty('--fijo',(fijo?fijo+8:0)+'px');}
// Botones de Colorear: en el móvil, Deshacer sobre el dibujo y el resto abajo, con los controles
function colocar(){const ui=$('svg')&&$('svg').nextElementSibling,mas=$('acciones-mas'),ac=$('acciones');if(!ui||!ui.classList.contains('zoom-ui')||!mas||!ac)return;
  const otros=['exportar','comparar','reiniciar'].map($);
  if(MQ.matches){ui.insertBefore($('deshacer'),ui.firstChild);otros.forEach(b=>mas.appendChild(b));mas.hidden=false;}
  else{ac.insertBefore($('deshacer'),ac.firstChild);otros.forEach(b=>ac.appendChild(b));mas.hidden=true;}
  medir();}
// Filas que se deslizan
function pista(el){const izq=el.scrollLeft>2,dcha=el.scrollLeft+el.clientWidth<el.scrollWidth-2;el.classList.toggle('mas-izq',izq);el.classList.toggle('mas-dcha',dcha);}
document.querySelectorAll('.viewbar').forEach(el=>{el.addEventListener('scroll',()=>pista(el),{passive:true});
  // la vista elegida se centra en la fila
  el.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&el.scrollWidth>el.clientWidth)b.scrollIntoView({block:'nearest',inline:'center'});});
  // con el teclado, si la fila está escondida bajo las pestañas, la pantalla sube hasta ella
  el.addEventListener('focusin',()=>{const r=el.getBoundingClientRect(),t=parseFloat(getComputedStyle(raiz).getPropertyValue('--alto-tabs'))||0;if(MQ.matches&&r.top<t){const st=el.closest('.stage');scrollTo(0,Math.max(0,scrollY+st.parentElement.getBoundingClientRect().top-t-12));}});});
// Trazar: que se vea el texto del paso nuevo
window.verPaso=()=>{if(!MQ.matches)return;requestAnimationFrame(()=>{const st=document.querySelector('#tab-trazado .stage'),c=$('stepn')&&$('stepn').closest('.card');if(!st||!c||!c.offsetParent)return;
  const a=st.getBoundingClientRect().bottom+8,r=c.getBoundingClientRect();if(r.top<a||r.top>innerHeight-120)scrollBy(0,r.top-a);});};
const todo=()=>{medir();document.querySelectorAll('.viewbar').forEach(pista);};
const ro=new ResizeObserver(todo);
['barra-etapas','tab-trazado','tab-teselar','tab-colorear'].forEach(id=>{const e=$(id);if(e)ro.observe(e);});
document.querySelectorAll('.stage,.viewbar').forEach(e=>ro.observe(e));
MQ.addEventListener('change',colocar);addEventListener('resize',todo);addEventListener('hashchange',()=>setTimeout(todo,60));
// al cambiar de vista se ocultan o aparecen botones (Panel): se vuelve a mirar la pista
new MutationObserver(todo).observe(document.querySelector('.viewbar')||document.body,{attributes:true,subtree:true,attributeFilter:['hidden','class']});
colocar();setTimeout(todo,300);
})();

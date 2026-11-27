/* ===== v2.17: el taller (lo que acompaña mientras se dibuja en papel) ===== */
(function(){
const $=id=>document.getElementById(id);
const K='mosaicos-taller-v1',T={vela:true};try{Object.assign(T,JSON.parse(localStorage.getItem(K)||'{}'));}catch(e){}
const guardarT=()=>{try{localStorage.setItem(K,JSON.stringify(T))}catch(e){}};
// ---- Pantalla siempre encendida en Trazar: con el compás en la mano no se puede tocar el móvil cada medio minuto
const puede='wakeLock' in navigator;let cerrojo=null,pidiendo=false;
async function velar(){const c=$('vela');if(c)c.checked=!!T.vela;
  const quiere=puede&&T.vela&&document.visibilityState==='visible'&&$('tab-trazado').classList.contains('show');
  if(quiere&&!cerrojo&&!pidiendo){pidiendo=true;
    try{cerrojo=await navigator.wakeLock.request('screen');cerrojo.addEventListener('release',()=>{cerrojo=null;});}catch(e){cerrojo=null;}
    pidiendo=false;if(cerrojo&&!$('tab-trazado').classList.contains('show'))velar();}
  else if(!quiere&&cerrojo){const v=cerrojo;cerrojo=null;try{await v.release();}catch(e){}}}
window.pantallaEncendida=()=>!!cerrojo;
if($('vela-fila'))$('vela-fila').hidden=!puede;
if($('vela'))$('vela').addEventListener('change',e=>{T.vela=e.target.checked;guardarT();velar();});
addEventListener('hashchange',()=>setTimeout(velar,0));document.addEventListener('visibilitychange',velar);
// el permiso puede pedir un gesto: se vuelve a intentar al primer toque
addEventListener('pointerdown',()=>{if(!cerrojo)velar();},{passive:true});
velar();
})();

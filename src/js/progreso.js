// ---------- Progreso de cada alicatado (v2.17) ----------
// Tres marcas por alicatado: trazado completo (se llegó al último paso), coloreado (los colores no son los de partida)
// y dibujado en papel (lo marca quien dibuja). Siempre con icono y texto, nunca solo con color.
const HECHO={k:'mosaicos-hecho-v1',d:{},
  marca(id,q,v=true){const e=this.d[id]||(this.d[id]={});if(!!e[q]===!!v)return;if(v)e[q]=1;else delete e[q];try{localStorage.setItem(this.k,JSON.stringify(this.d))}catch(err){}}};
try{const g=JSON.parse(localStorage.getItem(HECHO.k)||'{}');if(g&&typeof g==='object')HECHO.d=g;}catch(e){}
function pintadoPat(p,g){if(!g)return false;const f=fresh(p);
  return Object.keys(g.over||{}).length>0||JSON.stringify(g.cols||f.cols)!==JSON.stringify(f.cols)||(g.ribbon||f.ribbon)!==f.ribbon||(g.outline||f.outline)!==f.outline;}
function hechoDe(p){const h=HECHO.d[p.id]||{};return {t:!!h.t,c:pintadoPat(p,p===PAT?st:ESTADO.p[p.id]),p:!!h.p};}
function textosHecho(p){const e=hechoDe(p),L=[];if(e.t)L.push(tr('Trazado completo','All steps done'));if(e.c)L.push(tr('Coloreado','Colored'));if(e.p)L.push(tr('Dibujado en papel','Drawn on paper'));return L;}
function chipsHecho(p){const L=textosHecho(p);return L.length?`<span class="pat-hecho">${L.map(t=>`<span>${icono('hecho')}${t}</span>`).join('')}</span>`:'';}
// Las dos casillas «Ya lo he dibujado en papel» (último paso de Trazar y tarjeta «En papel») van siempre a la par
function pintarHecho(ultimo){const on=!!(HECHO.d[PAT.id]||{}).p;
  for(const id of ['tz-hecho','pp-hecho']){const c=document.getElementById(id);if(c)c.checked=on;}
  const f=document.getElementById('tz-hecho-fila');if(f&&ultimo!==undefined)f.hidden=!ultimo;}
for(const id of ['tz-hecho','pp-hecho']){const c=document.getElementById(id);if(c)c.addEventListener('change',()=>{HECHO.marca(PAT.id,'p',c.checked);pintarHecho();});}
addEventListener('hashchange',()=>setTimeout(()=>pintarHecho(),0));

// Las piezas y cintas de los patrones nuevos se calculan la primera vez que se abren
function datos(p){if(!p.D){p.prep=MOTOR.preparar(p);const mx=p.W*0.1,my=p.H*0.1;p.D=MOTOR.zona(p,p.prep,-mx,-my,4*p.W+mx,3*p.H+my);}return p.D;}
let PAT=PATS.lazo8,D=D_LAZO,st,CELDA=null;
function fresh(p=PAT){const pal=Object.values(p.paletas)[0];return{view:'2x2',cols:[...pal.cols],ribbon:pal.ribbon,outline:pal.outline,over:{},rw:p.rw,ow:p.ow,interlace:p.tipo!=='mosaico',wc:false,grid:false,construct:false,brush:'#1f5f5b',solo:false};}
// El coloreado de cada patrón se guarda en el móvil: así no se pierde al cerrar la app ni al actualizarse
const ST_KEY='laceria-estado-v1',ST2='laceria-estado-v2';
let ESTADO={pat:'lazo8',p:{}};
try{const e=JSON.parse(localStorage.getItem(ST2)||'null');if(e&&e.p&&typeof e.p==='object')ESTADO=e;}catch(e){}
if(!ESTADO.p.lazo8){try{const g=JSON.parse(localStorage.getItem(ST_KEY)||'null');if(g)ESTADO.p.lazo8=g;}catch(e){}}
function cargar(id){const p=PATS[id]||PATS.lazo8;PAT=p;D=datos(p);CELDA=null;ESTADO.pat=p.id;st=fresh(p);
  const g=ESTADO.p[p.id];if(g&&Array.isArray(g.cols)&&g.cols.length===p.nombres.length&&p.vistas[g.view])st=Object.assign(st,g);}
function guardar(){ESTADO.p[PAT.id]=st;try{localStorage.setItem(ST2,JSON.stringify(ESTADO))}catch(e){}}
const $=id=>document.getElementById(id);
function opts(){const [x0,y0,w,h]=PAT.vistas[st.view],o={x0,y0,w,h,cols:st.cols,over:st.over,ribbon:st.ribbon,outline:st.outline,rw:st.rw,ow:st.ow,interlace:st.interlace,wc:st.wc,grid:st.grid,construct:st.construct};
  // «Módulo»: el módulo mínimo del libro (cuadrado girado o hexágono), no el bloque que se repite para los colores
  const M=PAT.modulo;if(st.view==='mod'&&PAT.vistaModulo){const [a,b,w,h]=PAT.vistaModulo;Object.assign(o,{x0:a,y0:b,w,h,frame:true});}
  else if(st.view==='mod'&&M){
    if(M.tipo==='hex'){const R=M.R,a=R*Math.sqrt(3)/2;Object.assign(o,{x0:M.cx-a-0.3,y0:M.cy-R-0.3,w:2*a+0.6,h:2*R+0.6,clip:Array.from({length:6},(_,i)=>{const t=(90+60*i)*Math.PI/180;return [M.cx+R*Math.cos(t),M.cy+R*Math.sin(t)];})});}
    else Object.assign(o,{x0:M.cx-M.m/2,y0:M.cy-M.m/2,w:M.m,h:M.m,giro:M.giro?[M.giro,M.cx,M.cy]:null});
    o.frame=true;}
  return o;}
// Panel (v2.9): el dibujo con el friso de almenillas y las cenefas, como en el último paso del libro
function frisoSvg(F,x0,y0,w,opc){const c=F.periodo/F.cuadros,alto=F.alto*c,cen=F.cenefa*c,n=Math.ceil(w/F.periodo)+1;
  const P=[[0,0],[1.5,1.5],[1.5,3.5],[2.5,3.5],[2.5,5.5],[4,7],[5.5,5.5],[5.5,3.5],[6.5,3.5],[6.5,1.5],[8,0]];
  const blanco=opc.cols.every(v=>/^#f{6}$/i.test(v)),K=F.colores,lin=blanco?(opc.outline||'#222'):opc.ribbon,lw=blanco?0.08:Math.max(0.04,opc.rw||0.1);
  const col=v=>blanco?'#ffffff':v,yf=y0+cen;
  let s=`<rect x="${x0}" y="${y0}" width="${w}" height="${cen}" fill="${col(K.cenefa)}" stroke="${lin}" stroke-width="${lw}"/>`+
    `<rect x="${x0}" y="${yf}" width="${w}" height="${alto}" fill="${col(K.oscuro)}" stroke="${lin}" stroke-width="${lw}"/>`;
  for(let i=0;i<n;i++){const X=x0+i*F.periodo-F.periodo/2;s+=`<polygon points="${P.map(([u,v])=>(X+u*c).toFixed(3)+','+(yf+v*c).toFixed(3)).join(' ')}" fill="${col(K.claro)}" stroke="${lin}" stroke-width="${lw}" stroke-linejoin="round"/>`;}
  s+=`<rect x="${x0}" y="${yf+alto}" width="${w}" height="${cen}" fill="${col(K.cenefa)}" stroke="${lin}" stroke-width="${lw}"/>`;
  return {svg:`<g class="friso" pointer-events="none"><clipPath id="friso-clip"><rect x="${x0}" y="${y0}" width="${w}" height="${2*cen+alto}"/></clipPath><g clip-path="url(#friso-clip)">${s}</g></g>`,alto:2*cen+alto,cen};}
function conPanel(sv,F){const m=sv.match(/viewBox="([-\d.e]+) ([-\d.e]+) ([-\d.e]+) ([-\d.e]+)"/);if(!m)return sv;const [x0,y0,w,h]=m.slice(1).map(Number);
  const o=opts(),fr=frisoSvg(F,x0,y0,w,o),fh=fr.alto,bh=fr.cen;
  const pie=`<rect x="${x0}" y="${y0+h}" width="${w}" height="${bh}" fill="${o.cols.every(v=>/^#f{6}$/i.test(v))?'#ffffff':F.colores.cenefa}" stroke="${o.ribbon}" stroke-width="${Math.max(0.04,o.rw||0.1)}"/>`;
  return sv.replace(m[0],`viewBox="${x0} ${y0-fh} ${w} ${h+fh+bh}"`).replace(/<\/svg>\s*$/,`<g transform="translate(0 ${-fh})">${fr.svg}</g>${pie}</svg>`);}
function draw(){
  guardar();
  if(st.view==='panel'&&!PAT.panel)st.view='2x2';
  $('svg').innerHTML=st.view==='panel'?conPanel(renderLazo(D,opts()),PAT.panel):renderLazo(D,opts());
  {const bp=document.querySelector('[data-v="panel"]');if(bp)bp.hidden=!PAT.panel;}
  document.querySelectorAll('[data-v]').forEach(b=>{const on=b.dataset.v===st.view;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});
  const mos=PAT.tipo==='mosaico',lazo=PAT.id==='lazo8';
  document.querySelector('[data-v="mod"]').textContent=(lazo?tr('Módulo (29×29)','Module (29×29)'):tr('Módulo','Module'));
  $('row-outline').hidden=mos;$('row-interlace').hidden=mos;$('row-grid').hidden=!lazo;$('row-construct').hidden=!lazo;
  $('h-cinta').textContent=mos?tr('Juntas','Joints'):tr('Cinta','Strapwork');$('l-ribbon').textContent=mos?tr('Color de las juntas','Joint color'):tr('Color de la cinta','Strap color');$('l-rw').textContent=mos?tr('Ancho de las juntas','Joint width'):tr('Ancho de la cinta','Strap width');
  $('rw').min=mos?0.04:+(PAT.rw*0.48).toFixed(2);$('rw').max=mos?0.5:+(PAT.rw*1.37).toFixed(2);
  $('types').innerHTML=PAT.nombres.map((n,i)=>`<div class="row"><label for="t${i}">${n}${CARTA?`<span class="pintura">${txtPintura(st.cols[i])}</span>`:''}</label><input type="color" id="t${i}" data-t="${i}" value="${st.cols[i]}"></div>`).join('');
  if(CARTA){$('l-ribbon').insertAdjacentHTML('beforeend',`<span class="pintura">${txtPintura(st.ribbon)}</span>`);}
  pintarCarta();
  $('ribbon').value=st.ribbon;$('outline').value=st.outline;$('rw').value=st.rw;
  ['interlace','wc','grid','construct','solo'].forEach(k=>$(k).checked=st[k]);
  const caja=document.querySelector('#brush .carta-caja'),sc=caja?caja.scrollTop:0;
  const otro=`<input type="color" id="brushc" value="${st.brush}" title="${tr('Otro color','Other color')}" aria-label="${tr('Otro color del pincel','Other brush color')}">`;
  if(CARTA){const C=CARTAS[CARTA].colores,b=st.brush.toLowerCase();
    $('brush').innerHTML=`<div class="carta-caja" role="group" aria-label="${tr('Colores de la carta','Chart colors')} ${CARTAS[CARTA].nombre}">`+C.map(c=>{const on=c[3].toLowerCase()===b,n=pNombre(c);return `<button class="sw${on?' sel':''}" style="background:${c[3]}" data-c="${c[3]}" title="${n}" aria-label="${n}" aria-pressed="${on}"></button>`;}).join('')+`</div>`
      +`<p id="brush-nom" aria-live="polite">${tr('Pincel','Brush')}: ${txtPintura(st.brush)}</p>`+otro;
    const nc=document.querySelector('#brush .carta-caja');if(nc)nc.scrollTop=sc;}
  else $('brush').innerHTML=BRUSH.map((c,i)=>`<button class="sw${c===st.brush?' sel':''}" style="background:${c}" data-c="${c}" title="${BRUSH_N[i]}" aria-label="${BRUSH_N[i]}" aria-pressed="${c===st.brush}"></button>`).join('')+otro;
  marcarPieza();
}
// ---------- Carta de acuarela: botones, conversión y lista «Con qué pintar» ----------
// Pinturas que usa el coloreado: [color de la carta, exacta, piezas]
function listaPinturas(){if(!CARTA)return[];const M=new Map(),add=(h,quien)=>{const r=pintura(h);if(!r)return;const k=r[0][3];let e=M.get(k);if(!e){e={c:r[0],exacta:true,q:[]};M.set(k,e);}if(!r[1])e.exacta=false;if(!e.q.includes(quien))e.q.push(quien);};
  PAT.nombres.forEach((n,i)=>add(st.cols[i],n));
  add(st.ribbon,PAT.tipo==='mosaico'?tr('Juntas','Joints'):tr('Cinta','Strapwork'));
  for(const h of Object.values(st.over))add(h,tr('retoques sueltos','single-piece touches'));
  return [...M.values()];}
function pintarCarta(){
  document.querySelectorAll('#cartas [data-cv]').forEach(b=>{const on=b.dataset.cv===CARTA;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});
  $('card-pintar').hidden=!CARTA;$('carta-marca').hidden=!CARTA;
  if(!CARTA){$('row-convertir').hidden=true;return;}
  const L=listaPinturas();$('row-convertir').hidden=L.every(e=>e.exacta);
  $('carta-marca').textContent=CARTA==='vg'?tr('Van Gogh es una marca de Royal Talens. 60 colores de su carta de acuarela (sin los metálicos ni los de interferencia).','Van Gogh is a Royal Talens brand. 60 colors from its watercolor chart (without the metallic and interference colors).')
    :CARTA==='wn'?tr('Cotman es una gama de Winsor & Newton. 40 colores de su carta de acuarela (sin los metálicos ni los iridiscentes).','Cotman is a Winsor & Newton range. 40 colors from its watercolor chart (without the metallic and iridescent colors).')
    :tr('Daniel Smith es una marca de Daniel Smith Inc. 223 colores de su carta de acuarela (sin los Duochrome, nacarados, iridiscentes ni de interferencia).','Daniel Smith is a brand of Daniel Smith Inc. 223 colors from its watercolor chart (without the Duochrome, pearlescent, iridescent and interference colors).');
  $('lista-pint').innerHTML=L.map(e=>`<li><i style="background:${e.c[3]}" aria-hidden="true"></i><span>${e.exacta?'':'≈ '}<b>${pNombre(e.c)}</b><small>${e.q.join(', ')}</small></span></li>`).join('');}
function aCarta(){const f=h=>{const r=pintura(h);return r?r[0][3]:h;};st.cols=st.cols.map(f);st.ribbon=f(st.ribbon);for(const k in st.over)st.over[k]=f(st.over[k]);st.brush=f(st.brush);}
$('cartas').addEventListener('click',e=>{const b=e.target.closest('[data-cv]');if(!b)return;CARTA=b.dataset.cv;try{localStorage.setItem(CARTA_KEY,JSON.stringify(CARTA))}catch(err){}snap();if(CARTA)aCarta();draw();b.focus();});
// Lista de la compra: marca, referencia y nombre de cada pintura
// Lista de la compra (v2.2): tarjeta con muestras, referencias y casillas; se comparte como imagen, texto o PDF
const bola=hx=>{const n=parseInt(hx.slice(1),16),r=(n>>16&255)/255,g=(n>>8&255)/255,b=(n&255)/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,d=mx-mn,s=d?d/(1-Math.abs(2*l-1)):0;
  let h=0;if(d){h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;h=(h*60+360)%360;}
  if(l>0.9||(s<0.12&&l>0.7))return '⚪';if(l<0.16||(s<0.12&&l<0.45))return '⚫';if(s<0.12)return '⚪';
  if(h>=12&&h<48&&l<0.42)return '🟤';return h<12||h>=340?'🔴':h<45?'🟠':h<70?'🟡':h<170?'🟢':h<255?'🔵':'🟣';};
function textoCompra(){const K=CARTAS[CARTA],L=listaPinturas();
  return `🛒 ${tr('Lista de la compra','Shopping list')} · Mosaicos\n${PAT.nombre}\n${K.marca===K.nombre?K.nombre:K.nombre+' ('+K.marca+')'} · ${tr('acuarela','watercolor')} · ${L.length} ${L.length===1?tr('tubo','tube'):tr('tubos','tubes')}\n\n`+
    L.map(e=>`☐ ${bola(e.c[3])} ${e.c[0]?e.c[0]+' · ':''}${EN?e.c[2]:e.c[1]}${e.exacta?'':' (≈)'}\n     ${e.q.join(', ')}`).join('\n')+`\n\n${tr('Colores aproximados','Approximate colors')} · indalo-apps.github.io/mosaicos`;}
async function tarjetaCompra(){const K=CARTAS[CARTA],L=listaPinturas(),W=1080,M=60,FS='"Cormorant Garamond",Georgia,serif',FN='Inter,system-ui,sans-serif';
  try{await document.fonts.ready;}catch(e){}
  const cv=document.createElement('canvas'),x=cv.getContext('2d');
  x.font=`500 30px ${FN}`;
  // reparte las piezas en dos líneas como mucho
  const anchoTxt=W-2*M-80-96-26-140,lineas=t=>{const pal=t.split(' '),out=[''];x.font=`400 28px ${FN}`;for(const w of pal){const k=out.length-1,pr=out[k]?out[k]+' '+w:w;if(x.measureText(pr).width<=anchoTxt||!out[k])out[k]=pr;else if(out.length<2)out.push(w);else{out[k]=out[k].replace(/[ ,]*$/,'')+'…';break;}}return out;};
  const filas=L.map(e=>({e,ql:lineas(e.q.join(', '))})),altoF=f=>86+f.ql.length*34;
  const H=M+190+28+filas.reduce((a,f)=>a+altoF(f),0)+120;
  cv.width=W;cv.height=H;
  x.fillStyle='#fbf8f1';x.fillRect(0,0,W,H);
  x.strokeStyle='#d8d0c0';x.lineWidth=3;x.strokeRect(1.5,1.5,W-3,H-3);
  // cabecera: el alicatado con tus colores
  try{const img=await cargarImg(svgColor(1,1,'160',String(Math.round(160*PAT.H/PAT.W))));const t=160;x.save();x.beginPath();x.roundRect?x.roundRect(M,M,t,t,14):x.rect(M,M,t,t);x.clip();x.drawImage(img,M,M,t,t*PAT.H/PAT.W);x.restore();x.strokeStyle='#cfc4ae';x.lineWidth=2;x.strokeRect(M,M,t,t);}catch(e){}
  const tx=M+190;x.fillStyle='#8a7a60';x.font=`500 26px ${FN}`;x.fillText(tr('LISTA DE LA COMPRA','SHOPPING LIST'),tx,M+34);
  x.fillStyle='#2a241c';x.font=`600 54px ${FS}`;let nom=PAT.nombre;while(x.measureText(nom).width>W-tx-M&&nom.length>4)nom=nom.slice(0,-2);if(nom!==PAT.nombre)nom+='…';x.fillText(nom,tx,M+92);
  x.fillStyle='#6b5f4c';x.font=`400 28px ${FN}`;x.fillText(`${K.marca===K.nombre?K.nombre:K.nombre+' · '+K.marca} · ${tr('acuarela','watercolor')}`,tx,M+134);
  x.fillText(`${L.length} ${L.length===1?tr('tubo','tube'):tr('tubos','tubes')}`,tx,M+170);
  let y=M+190+28;x.strokeStyle='#e6dccb';x.lineWidth=2;x.beginPath();x.moveTo(M,y-14);x.lineTo(W-M,y-14);x.stroke();
  for(const [k,f] of filas.entries()){const e=f.e,h=altoF(f),cy=y+h/2;
    // casilla
    x.strokeStyle='#8a7a60';x.lineWidth=3;x.strokeRect(M,cy-20,40,40);
    // muestra
    x.beginPath();x.arc(M+80+48,cy,44,0,Math.PI*2);x.fillStyle=e.c[3];x.fill();x.strokeStyle='rgba(60,50,30,.35)';x.lineWidth=2;x.stroke();
    // nombre y piezas
    const nx=M+80+96+26,top=y+(h-(46+f.ql.length*34))/2;
    x.fillStyle='#2a241c';x.font=`500 34px ${FN}`;x.fillText((e.exacta?'':'≈ ')+(EN?e.c[2]:e.c[1]),nx,top+36);
    x.fillStyle='#6b5f4c';x.font=`400 28px ${FN}`;f.ql.forEach((l,i)=>x.fillText(l,nx,top+36+38+i*34));
    // referencia
    if(e.c[0]){x.font=`600 28px ${FN}`;const rw=x.measureText(e.c[0]).width+28,rx=W-M-rw;x.fillStyle='#efe6d6';x.beginPath();x.roundRect?x.roundRect(rx,cy-24,rw,48,10):x.rect(rx,cy-24,rw,48);x.fill();x.fillStyle='#5a4a30';x.fillText(e.c[0],rx+14,cy+10);}
    y+=h;if(k<filas.length-1){x.setLineDash([8,8]);x.beginPath();x.moveTo(M,y);x.lineTo(W-M,y);x.stroke();x.setLineDash([]);}}
  x.strokeStyle='#e6dccb';x.beginPath();x.moveTo(M,y+20);x.lineTo(W-M,y+20);x.stroke();
  x.fillStyle='#8a7a60';x.font=`400 24px ${FN}`;x.fillText(`Mosaicos · indalo-apps.github.io/mosaicos · ${tr('colores aproximados','approximate colors')}`,M,y+70);
  return cv;}
const lcNombre=ext=>`mosaicos-${PAT.id}-${tr('lista','list')}-${CARTA}.${ext}`;
let LC=null;
$('copiar-compra').onclick=async()=>{if(!CARTAS[CARTA])return;$('lc-msg').textContent='';
  $('lc-imagen').textContent=matchMedia('(pointer:coarse)').matches&&navigator.canShare?tr('🖼️ Compartir imagen','🖼️ Share image'):tr('🖼️ Descargar imagen','🖼️ Download image');
  window.abrirDlg('dlg-compra');LC=await tarjetaCompra();$('lc-img').src=LC.toDataURL('image/png');
  $('lc-img').alt=tr('Lista de la compra de ','Shopping list for ')+PAT.nombre+': '+listaPinturas().map(e=>(e.c[0]?e.c[0]+' ':'')+(EN?e.c[2]:e.c[1])).join(', ');};
$('lc-imagen').onclick=async()=>{if(!LC)return;const blob=await new Promise(ok=>LC.toBlob(ok,'image/png'));$('lc-msg').textContent=await entregar(blob,lcNombre('png'));};
$('lc-texto').onclick=async()=>{let ok;try{await navigator.clipboard.writeText(textoCompra());ok=tr('Texto copiado: pégalo en una nota o un mensaje.','Text copied: paste it into a note or a message.');}catch(e){ok=tr('No se ha podido copiar.','Could not copy.');}$('lc-msg').textContent=ok;};
$('lc-pdf').onclick=async()=>{if(!LC)return;// A5 vertical, con la tarjeta centrada
  const PW=1748,PH=2480,c=document.createElement('canvas');c.width=PW;c.height=PH;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,PW,PH);
  const k=Math.min((PW-200)/LC.width,(PH-200)/LC.height);x.drawImage(LC,(PW-LC.width*k)/2,100,LC.width*k,LC.height*k);
  const jpg=new Uint8Array(await (await new Promise(ok=>c.toBlob(ok,'image/jpeg',0.92))).arrayBuffer());
  $('lc-msg').textContent=await entregar(pdfJpeg(jpg,PW,PH,148*72/25.4,210*72/25.4),lcNombre('pdf'));};
['lc-x','lc-cerrar'].forEach(id=>$(id).onclick=()=>window.cerrarDlg('dlg-compra'));
// ---- Mismo dibujo, otro color (v2.6): la misma trama coloreada de varias maneras
{let OPC=[];
  const pal=()=>{const u=[...new Set([...st.cols,...Object.values(PAT.paletas).flatMap(p=>p.cols)])].filter(c=>c.toLowerCase()!=='#ffffff');return u.length?u:['#1f5f5b','#2f4fa3','#c98b2b','#161616'];};
  const azar=()=>{const P=pal(),n=PAT.nombres.length,k=Math.min(P.length,2+Math.floor(Math.random()*3)),el=[...P].sort(()=>Math.random()-0.5).slice(0,k);
    // reparte pocos colores: así unas piezas se agrupan y aparecen figuras nuevas
    return Array.from({length:n},()=>el[Math.floor(Math.random()*k)]);};
  const mini=o=>{const [x0,y0,w,h]=PAT.vistas['2x2'];return renderLazo(D,{x0,y0,w,h,cols:o.cols,over:{},ribbon:o.ribbon,outline:o.outline,rw:st.rw,ow:st.ow,interlace:st.interlace,wc:false}).replace('width="100%"','width="100%" aria-hidden="true" focusable="false"');};
  function construir(nuevas){
    if(!nuevas||!OPC.length){OPC=[{n:tr('El tuyo','Yours'),cols:[...st.cols],ribbon:st.ribbon,outline:st.outline,over:st.over}];
      for(const [n,p] of Object.entries(PAT.paletas))if(!/colorear|coloring/i.test(n))OPC.push({n:palNombre(n),cols:[...p.cols],ribbon:p.ribbon,outline:p.outline});}
    OPC=OPC.filter(o=>!o.azar);for(let i=0;i<4;i++)OPC.push({n:tr('Combinación ','Combination ')+(i+1),cols:azar(),ribbon:st.ribbon,outline:st.outline,azar:true});
    $('cmp-grid').innerHTML=OPC.map((o,i)=>`<button class="cmp-op${i===0?' on':''}" data-i="${i}" aria-pressed="${i===0}">${mini(o)}<small>${o.n}</small></button>`).join('');}
  $('comparar').onclick=()=>{construir(false);window.abrirDlg('dlg-comparar');};
  $('cmp-otras').onclick=()=>construir(true);
  $('cmp-grid').addEventListener('click',e=>{const b=e.target.closest('.cmp-op');if(!b)return;const o=OPC[+b.dataset.i];snap();st.cols=[...o.cols];st.ribbon=o.ribbon;st.outline=o.outline;st.over=o.over?{...o.over}:{};if(CARTA)aCarta();draw();
    document.querySelectorAll('#cmp-grid .cmp-op').forEach(x=>{const on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on);});});
  ['cmp-x','cmp-cerrar'].forEach(id=>$(id).onclick=()=>window.cerrarDlg('dlg-comparar'));}
$('convertir').onclick=()=>{snap();aCarta();draw();$('convertir').closest('.card').querySelector('button.on')?.focus();};
// ---------- Pintar con el teclado: flechas para elegir pieza, Intro o espacio para pintar ----------
let SEL=-1;
function visibles(){const [x0,y0,w,h]=PAT.vistas[st.view];const out=[];
  D.F.forEach((f,i)=>{const p=f[1];let cx=0,cy=0;for(let k=0;k<p.length;k+=2){cx+=p[k];cy+=p[k+1];}cx/=p.length/2;cy/=p.length/2;
    if(cx>x0&&cx<x0+w&&cy>y0&&cy<y0+h)out.push([i,cx,cy]);});return out;}
function marcarPieza(){const sv=$('svg').querySelector('svg');if(!sv)return;const old=sv.querySelector('#pieza-sel');if(old)old.remove();
  if(SEL<0||document.activeElement!==$('svg'))return;const pol=sv.querySelector(`polygon[data-i="${SEL}"]`);if(!pol)return;
  const m=pol.cloneNode();m.id='pieza-sel';m.removeAttribute('data-i');m.setAttribute('fill','none');m.setAttribute('stroke','#e0a526');m.setAttribute('stroke-width',String(Math.max(PAT.vistas[st.view][2]/120,0.15)));m.setAttribute('pointer-events','none');sv.appendChild(m);}
function anunciar(){if(SEL<0)return;const k=D.F[SEL][0],c=(st.over[SEL]||st.cols[k]),n=BRUSH.indexOf(c);$('pieza-anuncio').textContent=PAT.nombres[k]+(CARTA?', '+txtPintura(c):(n>=0?', '+BRUSH_N[n].toLowerCase():''));}
// ---------- Deshacer (v1.6.1): copias del coloreado antes de cada cambio, por patrón ----------
let HIST=[],editando=false;
const copia=()=>JSON.stringify(st);
function snap(){const c=copia();if(HIST[HIST.length-1]!==c){HIST.push(c);if(HIST.length>60)HIST.shift();}$('deshacer').disabled=false;}
function deshacer(){const c=HIST.pop();if(c){st=JSON.parse(c);draw();}$('deshacer').disabled=!HIST.length;}
$('deshacer').onclick=()=>{deshacer();if($('deshacer').disabled)$('exportar').focus();};
function pintarPieza(i){snap();if(st.solo)st.over[i]=st.brush;else{const k=D.F[i][0];st.cols[k]=st.brush;for(const j in st.over)if(D.F[j][0]===k)delete st.over[j];}draw();}
$('svg').addEventListener('focus',()=>{const V=visibles();if(!V.some(v=>v[0]===SEL)){const [x0,y0,w,h]=PAT.vistas[st.view],cx=x0+w/2,cy=y0+h/2;
  V.sort((a,b)=>Math.hypot(a[1]-cx,a[2]-cy)-Math.hypot(b[1]-cx,b[2]-cy));SEL=V.length?V[0][0]:-1;}marcarPieza();anunciar();});
$('svg').addEventListener('blur',()=>marcarPieza());
$('svg').addEventListener('keydown',e=>{const dirs={ArrowRight:[1,0],ArrowLeft:[-1,0],ArrowDown:[0,1],ArrowUp:[0,-1]};
  if((e.key==='Enter'||e.key===' ')&&SEL>=0){e.preventDefault();pintarPieza(SEL);$('svg').focus();anunciar();return;}
  const d=dirs[e.key];if(!d)return;e.preventDefault();const V=visibles(),c=V.find(v=>v[0]===SEL);if(!c)return;
  let best=null,bd=1e9;for(const v of V){if(v[0]===SEL)continue;const dx=v[1]-c[1],dy=v[2]-c[2],a=dx*d[0]+dy*d[1];if(a<=1e-6)continue;
    const lat=Math.abs(dx*d[1]-dy*d[0]);if(lat>a*1.2)continue;const s=a+2*lat;if(s<bd){bd=s;best=v[0];}}
  if(best!=null){SEL=best;marcarPieza();anunciar();}});
function pintarPaletas(){$('presets').innerHTML=Object.entries(PAT.paletas).map(([n,p])=>`<button class="preset" data-p="${n}">${palNombre(n)}<i>${[...new Set(p.cols)].slice(0,5).map(c=>`<b style="background:${c}"></b>`).join('')}</i></button>`).join('');}
document.addEventListener('click',e=>{
  const t=e.target;
  if(t.dataset.v){st.view=t.dataset.v;draw();}
  else if(t.closest('[data-p]')){snap();const p=PAT.paletas[t.closest('[data-p]').dataset.p];st.cols=[...p.cols];st.ribbon=p.ribbon;st.outline=p.outline;st.over={};if(CARTA)aCarta();draw();}
  else if(t.dataset.c){st.brush=t.dataset.c;draw();}
  else if(t.tagName==='polygon'&&t.dataset.i){SEL=+t.dataset.i;pintarPieza(SEL);}
});
document.addEventListener('input',e=>{
  const t=e.target;if(!editando&&t.closest&&t.closest('#tab-colorear')&&(t.dataset.t||['ribbon','outline','rw'].includes(t.id))){snap();editando=true;}
  if(t.dataset.t){st.cols[+t.dataset.t]=t.value;$('svg').innerHTML=renderLazo(D,opts());}
  else if(t.id==='brushc'){st.brush=t.value;document.querySelectorAll('.sw').forEach(s=>{s.classList.remove('sel');s.setAttribute('aria-pressed','false');});}
  else if(t.id==='ribbon'||t.id==='outline'){st[t.id]=t.value;
    // v2.20: en los alicatados con cintas de varios colores, «Color de la cinta» las pinta todas del mismo color
    if(t.id==='ribbon'&&PAT.cintas)for(const i of PAT.cintas){st.cols[i]=t.value;const e=$('t'+i);if(e)e.value=t.value;}
    $('svg').innerHTML=renderLazo(D,opts());}
  else if(t.id==='rw'){st.rw=+t.value;$('svg').innerHTML=renderLazo(D,opts());}
});
document.addEventListener('input',()=>guardar());
document.addEventListener('change',e=>{const t=e.target;editando=false;if(['interlace','wc','grid','construct','solo'].includes(t.id)){if(t.id!=='solo')snap();st[t.id]=t.checked;draw();}
  else if(CARTA&&t.type==='color'&&t.closest('#tab-colorear'))draw();});
$('clearOver').onclick=()=>{snap();st.over={};draw();};
// Reiniciar (v2.12): junto a Deshacer, Exportar y Otro color; vuelve todo el coloreado al principio. Pide un segundo toque y se puede deshacer
let resetArmado=0;const txtReiniciar=()=>tr('↺ Reiniciar','↺ Start over');
$('reiniciar').onclick=()=>{const b=$('reiniciar');
  if(Date.now()-resetArmado>4000){resetArmado=Date.now();b.classList.add('peligro');b.textContent=tr('¿Empezar de cero? Toca otra vez','Start from scratch? Tap again');
    setTimeout(()=>{if(Date.now()-resetArmado>=3900){b.classList.remove('peligro');b.textContent=txtReiniciar();}},4000);return;}
  resetArmado=0;b.classList.remove('peligro');b.textContent=txtReiniciar();snap();st=fresh(PAT);draw();$('msg').textContent=tr('Todo el coloreado ha vuelto al principio. Puedes deshacerlo.','All the coloring is back to the start. You can undo it.');};
// ---------- Exportar (v1.2): SVG en color, PNG, y láser (piezas o celosía) ----------
// Cada patrón se repite cada W × H (un módulo). Se exporta un rectángulo de c × r módulos que encaja sin costuras.
const fx=n=>+(+n).toFixed(3);
const EX_KEY='laceria-export-v1';
let EX={modo:'svg',c:2,r:2,mm:60,px:4000,papel:'A4',ori:'v',linea:'gris'};
try{EX=Object.assign(EX,JSON.parse(localStorage.getItem(EX_KEY)||'{}'));}catch(e){}
function exGuardar(){try{localStorage.setItem(EX_KEY,JSON.stringify(EX))}catch(e){}}
const interior=s=>s.slice(s.indexOf('>')+1,s.lastIndexOf('</svg>'));

// Dibujo en color. Hasta 4 × 3 módulos se dibuja tal cual (con los retoques sueltos);
// si es mayor, se repite ese bloque, que encaja porque mide un número entero de módulos.
function svgColor(c,r,ancho,alto,extra){
  const w=c*PAT.W,h=r*PAT.H,bw=Math.min(w,4*PAT.W),bh=Math.min(h,3*PAT.H);
  const o=opts();Object.assign(o,extra||{},{x0:0,y0:0,w:bw,h:bh});
  const base=interior(renderLazo(D,o));
  let s=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${w} ${h}" width="${ancho}" height="${alto}">`;
  if(bw===w&&bh===h)return s+base+'</svg>';
  s+=`<defs><g id="lz-bloque">${base}</g><clipPath id="lz-todo"><rect x="0" y="0" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#lz-todo)">`;
  for(let x=0;x<w;x+=bw)for(let y=0;y<h;y+=bh)s+=`<use href="#lz-bloque" xlink:href="#lz-bloque" x="${x}" y="${y}"/>`;
  return s+'</g></svg>';
}

// Geometría de las piezas para el láser
function celda(){ // las piezas de un módulo: las que tienen su centro dentro del módulo
  if(CELDA)return CELDA;CELDA=[];
  D.F.forEach(fc=>{const p=fc[1],n=p.length/2;let cx=0,cy=0;
    for(let k=0;k<p.length;k+=2){cx+=p[k];cy+=p[k+1];}cx/=n;cy/=n;
    if(cx>=0&&cx<PAT.W&&cy>=0&&cy<PAT.H){const P=[];for(let k=0;k<p.length;k+=2)P.push([p[k],p[k+1]]);CELDA.push(P);}});
  return CELDA;
}
function piezas(w,h){
  const out=[],nc=Math.ceil(w/PAT.W),nr=Math.ceil(h/PAT.H);
  for(let i=-1;i<=nc;i++)for(let j=-1;j<=nr;j++)for(const P of celda()){
    const Q=P.map(([x,y])=>[x+PAT.W*i,y+PAT.H*j]);
    if(Q.every(p=>p[0]<=0)||Q.every(p=>p[0]>=w)||Q.every(p=>p[1]<=0)||Q.every(p=>p[1]>=h))continue;
    out.push(Q);
  }
  return out;
}
const area=P=>{let a=0;for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length];a+=p[0]*q[1]-q[0]*p[1];}return a/2;};
function recortar(P,x0,y0,x1,y1){ // Sutherland–Hodgman contra un rectángulo
  const lados=[[p=>p[0]>=x0,(a,b)=>[x0,a[1]+(x0-a[0])/(b[0]-a[0])*(b[1]-a[1])]],
    [p=>p[0]<=x1,(a,b)=>[x1,a[1]+(x1-a[0])/(b[0]-a[0])*(b[1]-a[1])]],
    [p=>p[1]>=y0,(a,b)=>[a[0]+(y0-a[1])/(b[1]-a[1])*(b[0]-a[0]),y0]],
    [p=>p[1]<=y1,(a,b)=>[a[0]+(y1-a[1])/(b[1]-a[1])*(b[0]-a[0]),y1]]];
  let out=P;
  for(const [dentro,corte] of lados){const inp=out;out=[];if(!inp.length)break;
    for(let i=0;i<inp.length;i++){const cur=inp[i],prev=inp[(i+inp.length-1)%inp.length];
      if(dentro(cur)){if(!dentro(prev))out.push(corte(prev,cur));out.push(cur);}else if(dentro(prev))out.push(corte(prev,cur));}}
  return out;
}
function encoger(P,d){ // desplaza cada lado d hacia dentro; null si la pieza se deforma
  const s=Math.sign(area(P)),n=P.length,L=[];
  for(let i=0;i<n;i++){const a=P[i],b=P[(i+1)%n],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy);
    const nx=-dy/l*s,ny=dx/l*s;L.push([[a[0]+nx*d,a[1]+ny*d],[dx,dy]]);}
  const Q=[];
  for(let i=0;i<n;i++){const [p1,v1]=L[(i+n-1)%n],[p2,v2]=L[i],cr=v1[0]*v2[1]-v1[1]*v2[0];
    if(Math.abs(cr)<1e-9){Q.push(p2);continue;}
    const t=((p2[0]-p1[0])*v2[1]-(p2[1]-p1[1])*v2[0])/cr;Q.push([p1[0]+v1[0]*t,p1[1]+v1[1]*t]);}
  if(Math.sign(area(Q))!==s)return null;
  for(let i=0;i<n;i++){const a=Q[i],b=Q[(i+1)%n],v=L[i][1];if((b[0]-a[0])*v[0]+(b[1]-a[1])*v[1]<=0)return null;}
  return Q;
}
// Láser: líneas rojas de 0,1 mm. «piezas»: el mosaico, cada línea una sola vez. «celosia»: huecos con la cinta de puente y marco.
function svgLaser(modo,c,r,mm,vista){
  const w=c*PAT.W,h=r*PAT.H,u=mm/PAT.W;let d='',nPiezas=0;
  const pt=p=>fx(p[0])+','+fx(p[1]);
  if(modo==='piezas'){
    const vistos=new Set();
    for(const P of piezas(w,h)){const Q=recortar(P,0,0,w,h);if(Q.length<3||Math.abs(area(Q))<1e-6)continue;nPiezas++;
      for(let k=0;k<Q.length;k++){const a=pt(Q[k]),b=pt(Q[(k+1)%Q.length]);if(a===b)continue;
        const key=a<b?a+' '+b:b+' '+a;if(vistos.has(key))continue;vistos.add(key);d+=`M${a}L${b}`;}}
  }else{
    const m=2,dist=(st.rw+2*st.ow)/2;
    for(const P of piezas(w,h)){const I=encoger(P,dist);if(!I)continue;
      const Q=recortar(I,m,m,w-m,h-m);if(Q.length<3)continue;
      const A=Math.abs(area(Q));let per=0;for(let k=0;k<Q.length;k++){const a=Q[k],b=Q[(k+1)%Q.length];per+=Math.hypot(b[0]-a[0],b[1]-a[1]);}
      if(A<0.3||A/(per/2)<0.3)continue;nPiezas++; // fuera las tiras demasiado finas junto al marco
      d+='M'+Q.map(pt).join('L')+'Z';}
    d+=`M0,0H${w}V${h}H0Z`;
  }
  const trazo=vista?'stroke-width="1" vector-effect="non-scaling-stroke"':`stroke-width="${fx(0.1/u)}"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${fx(w*u)}mm" height="${fx(h*u)}mm"><path d="${d}" fill="none" stroke="#ff0000" ${trazo} stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}
if(typeof module!=='undefined')module.exports.ex={svgLaser,celda,encoger,piezas,area};

// ---------- Lámina para pintar (v1.5): PDF A4 o A3 con el dibujo solo en línea ----------
const PAPEL={A5:[148,210],A4:[210,297],A3:[297,420]};
function lamina(){ // medidas en mm de la hoja y del dibujo
  let [pw,ph]=PAPEL[EX.papel]||PAPEL.A4;if(EX.ori==='h')[pw,ph]=[ph,pw];
  const ley=CARTA&&EX.leyenda!==false?listaPinturas():[],nc=pw>250?3:2,fila=6,lh=ley.length?8+Math.ceil(ley.length/nc)*fila:0;
  const m=Math.min(pw,ph)<160?9:12,pie=8,aw=pw-2*m,ah=ph-2*m-pie-lh,w=EX.c*PAT.W,h=EX.r*PAT.H,e=Math.min(aw/w,ah/h),dw=w*e,dh=h*e;
  // leyenda de pinturas: debajo del dibujo, en columnas
  const ly=ph-m-pie-lh+4,cw=aw/nc,items=ley.map((it,i)=>({it,x:m+(i%nc)*cw,y:ly+6+Math.floor(i/nc)*fila,w:cw-3}));
  return {pw,ph,m,pie,dw,dh,dx:(pw-dw)/2,dy:m+(ah-dh)/2,umm:e,ley:items,ly,titLey:ley.length?`${tr('Pinturas','Paints')} · ${CARTAS[CARTA].nombre}`:''};
}
const textoLey=it=>`${it.exacta?'':'≈ '}${pNombre(it.c)} — ${it.q.join(', ')}`;
const escXml=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;');
function svgLamina(L){ // dibujo en línea, con el grosor de línea en milímetros reales
  const col=EX.linea==='negra'?'#222222':'#8c8c8c',lw=(EX.linea==='negra'?0.35:0.3)/L.umm,mos=PAT.tipo==='mosaico';
  const blanco=Array(PAT.nombres.length).fill('#ffffff');
  const o=mos?{cols:blanco,over:{},ribbon:col,outline:col,rw:lw,ow:0,wc:false,grid:false,construct:false}
             :{cols:blanco,over:{},ribbon:'#ffffff',outline:col,ow:lw,wc:false,grid:false,construct:false};
  return svgColor(EX.c,EX.r,fx(L.dw)+'mm',fx(L.dh)+'mm',o);
}
function laminaVista(){const L=lamina();const d=svgLamina(L).replace(/^<svg /,`<svg x="${fx(L.dx)}" y="${fx(L.dy)}" `).replace(/width="[^"]*mm" height="[^"]*mm"/,`width="${fx(L.dw)}" height="${fx(L.dh)}"`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L.pw} ${L.ph}" style="max-height:240px;width:auto"><rect width="${L.pw}" height="${L.ph}" fill="#fff" stroke="#c9c2b5" stroke-width="0.8"/>${d}<text x="${L.m}" y="${L.ph-L.m}" font-size="3" fill="#8c8c8c" font-family="Inter,sans-serif">${PAT.nombre} · ${PAT.lugar}</text>`
  +(L.titLey?`<text x="${L.m}" y="${fx(L.ly+2)}" font-size="3" fill="#555" font-family="Inter,sans-serif" font-weight="600">${escXml(L.titLey)}</text>`:'')
  +L.ley.map(o=>`<rect x="${fx(o.x)}" y="${fx(o.y-3.6)}" width="4.5" height="4.5" fill="${o.it.c[3]}" stroke="#999" stroke-width="0.2"/><text x="${fx(o.x+6)}" y="${fx(o.y)}" font-size="2.6" fill="#444" font-family="Inter,sans-serif">${escXml(textoLey(o.it)).slice(0,60)}</text>`).join('')+`</svg>`;}
// PDF de una página con una imagen JPEG (sin librerías: funciona sin conexión)
function pdfJpeg(jpg,wpx,hpx,wpt,hpt){
  const enc=new TextEncoder(),partes=[],off=[];let pos=0;
  const add=b=>{const u=typeof b==='string'?enc.encode(b):b;partes.push(u);pos+=u.length;};
  const obj=(n,cuerpo,flujo)=>{off[n]=pos;add(`${n} 0 obj\n${cuerpo}\n`);if(flujo){add('stream\n');add(flujo);add('\nendstream\n');}add('endobj\n');};
  const cont=`q ${wpt.toFixed(2)} 0 0 ${hpt.toFixed(2)} 0 0 cm /Im0 Do Q`;
  add('%PDF-1.4\n%\xe2\xe3\xcf\xd3\n');
  obj(1,'<< /Type /Catalog /Pages 2 0 R >>');
  obj(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  obj(3,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${wpt.toFixed(2)} ${hpt.toFixed(2)}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
  obj(4,`<< /Type /XObject /Subtype /Image /Width ${wpx} /Height ${hpx} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>`,jpg);
  obj(5,`<< /Length ${cont.length} >>`,enc.encode(cont));
  obj(6,'<< /Creator (Mosaicos - indalo-apps) /Producer (Mosaicos) >>');
  const xref=pos;let x='xref\n0 7\n0000000000 65535 f \n';for(let n=1;n<=6;n++)x+=String(off[n]).padStart(10,'0')+' 00000 n \n';
  add(x+`trailer\n<< /Size 7 /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(partes,{type:'application/pdf'});
}
function cargarImg(svg){return new Promise((ok,mal)=>{const img=new Image();img.onload=()=>ok(img);img.onerror=()=>mal(new Error('svg'));img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);});}
async function crearLamina(){
  const L=lamina(),dpi=EX.papel==='A3'?250:300,mmPx=dpi/25.4,W=Math.round(L.pw*mmPx),H=Math.round(L.ph*mmPx);
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;const cx=cv.getContext('2d');
  cx.fillStyle='#ffffff';cx.fillRect(0,0,W,H);
  const img=await cargarImg(svgLamina(L).replace(/width="[^"]*mm" height="[^"]*mm"/,`width="${Math.round(L.dw*mmPx)}" height="${Math.round(L.dh*mmPx)}"`));
  cx.drawImage(img,Math.round(L.dx*mmPx),Math.round(L.dy*mmPx),Math.round(L.dw*mmPx),Math.round(L.dh*mmPx));
  cx.fillStyle='#8c8c8c';cx.font=`${Math.round(3*mmPx)}px Inter, system-ui, sans-serif`;cx.textBaseline='alphabetic';
  cx.textAlign='left';cx.fillText(`${PAT.nombre} · ${PAT.lugar} · ${monu(PAT)}`,L.m*mmPx,(L.ph-L.m)*mmPx);
  cx.textAlign='right';cx.fillText('Mosaicos · indalo-apps.github.io/mosaicos',(L.pw-L.m)*mmPx,(L.ph-L.m)*mmPx);
  if(L.ley.length){cx.textAlign='left';cx.fillStyle='#555555';cx.font=`600 ${Math.round(3*mmPx)}px Inter, system-ui, sans-serif`;cx.fillText(L.titLey,L.m*mmPx,(L.ly+2)*mmPx);
    cx.font=`${Math.round(2.6*mmPx)}px Inter, system-ui, sans-serif`;
    for(const o of L.ley){cx.fillStyle=o.it.c[3];cx.fillRect(o.x*mmPx,(o.y-3.6)*mmPx,4.5*mmPx,4.5*mmPx);cx.strokeStyle='#999999';cx.lineWidth=0.2*mmPx;cx.strokeRect(o.x*mmPx,(o.y-3.6)*mmPx,4.5*mmPx,4.5*mmPx);
      let t=textoLey(o.it);const max=(o.w-6)*mmPx;cx.fillStyle='#444444';while(t.length>4&&cx.measureText(t).width>max)t=t.slice(0,-2);if(t!==textoLey(o.it))t=t.slice(0,-1)+'…';
      cx.fillText(t,(o.x+6)*mmPx,o.y*mmPx);}}
  const jpg=await new Promise((ok,mal)=>cv.toBlob(b=>b?ok(b):mal(new Error('jpg')),'image/jpeg',0.92));
  const bytes=new Uint8Array(await jpg.arrayBuffer());cv.width=cv.height=1;
  return pdfJpeg(bytes,W,H,L.pw*72/25.4,L.ph*72/25.4);
}

// Ventana de exportar
const EX_AYUDA=EN?{
  svg:'Vector file just as you see it, for Inkscape or Illustrator, printing at any size or cutting colored vinyl.',
  png:'High-resolution image for wallpapers, social media or printing.',
  piezas:'Red 0.1 mm cutting lines with the pieces fitted together like a mosaic (marquetry, tiling, stencils). Each line is cut only once.',
  celosia:'The holes of the pieces are cut out and the strap remains as a one-piece lattice, with a frame. It uses the strap width from the Color tab.',
  lamina:'A sheet ready to print with the drawing in line only, to paint in watercolor or colored pencils. The drawing fits the paper.'
}:{
  svg:'Archivo vectorial tal como lo ves, para Inkscape, Illustrator, imprimir a cualquier tamaño o cortar vinilo de colores.',
  png:'Imagen en alta resolución para fondos de pantalla, redes o imprimir.',
  piezas:'Líneas de corte rojas de 0,1 mm con las piezas encajadas como un mosaico (marquetería, alicatado, plantillas). Cada línea se corta una sola vez.',
  celosia:'Se cortan los huecos de las piezas y queda la cinta como una celosía de una sola pieza, con marco. Usa el ancho de la cinta de la pestaña Colorear.',
  lamina:'Una hoja lista para imprimir con el dibujo solo en línea, para pintarla a la acuarela o con lápices de colores. El dibujo se ajusta al papel.'
};
function exDims(){const w=EX.c*PAT.W,h=EX.r*PAT.H,lado=EX.px;return w>=h?[lado,Math.round(lado*h/w)]:[Math.round(lado*w/h),lado];}
function exSvg(vista){
  if(EX.modo==='piezas'||EX.modo==='celosia')return svgLaser(EX.modo,EX.c,EX.r,EX.mm,vista);
  if(EX.modo==='png'){const [W,H]=exDims();return svgColor(EX.c,EX.r,W,H);}
  return svgColor(EX.c,EX.r,fx(EX.c*EX.mm)+'mm',fx(EX.r*EX.mm)+'mm');
}
function exNombre(ext){const t={svg:'',png:'',piezas:'-laser-piezas',celosia:'-laser-celosia',lamina:'-lamina-'+EX.papel}[EX.modo];return `mosaicos-${PAT.id}${t}-${EX.c}x${EX.r}.${ext}`;}
const mmTxt=n=>(Math.round(n*10)/10).toLocaleString(EN?'en-US':'es-ES');
function exPintar(){
  document.querySelectorAll('[data-ex]').forEach(g=>g.querySelectorAll('button').forEach(b=>{const on=String(EX[g.dataset.ex])===b.dataset.val;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);}));
  $('ex-c').textContent=EX.c;$('ex-r').textContent=EX.r;
  if(document.activeElement!==$('ex-mm'))$('ex-mm').value=EX.mm;
  const png=EX.modo==='png',lam=EX.modo==='lamina';
  $('ex-g-mm').hidden=png||lam;$('ex-g-px').hidden=!png;$('ex-g-lam').hidden=!lam;$('row-leyenda').hidden=!CARTA;$('ex-leyenda').checked=EX.leyenda!==false;$('ex-copiar').hidden=png||lam;
  $('ex-ayuda').textContent=EX_AYUDA[EX.modo];
  let info;
  if(png){const [W,H]=exDims();info=`${EX.c} × ${EX.r} ${tr('módulos','modules')} · ${W} × ${H} ${tr('píxeles','pixels')}`;}
  else if(lam){const L=lamina();info=`${EX.c} × ${EX.r} ${tr('módulos','modules')} · ${tr('cada módulo mide','each module is')} ${mmTxt(PAT.W*L.umm)} × ${mmTxt(PAT.H*L.umm)} mm · ${EX.papel} ${EX.ori==='h'?tr('horizontal','landscape'):tr('vertical','portrait')}`;}
  else info=`${EX.c} × ${EX.r} ${tr('módulos','modules')} · ${mmTxt(EX.c*EX.mm)} × ${mmTxt(EX.r*EX.mm*PAT.H/PAT.W)} mm`;
  if((EX.modo==='svg'||png)&&(EX.c>4||EX.r>3)&&Object.keys(st.over).length)info+=tr(' · Los retoques sueltos se repiten cada 4 × 3 módulos.',' · Single-piece touches repeat every 4 × 3 modules.');
  $('ex-info').textContent=info;
  $('ex-vista').innerHTML=lam?laminaVista():exSvg(true);
  $('ex-msg').textContent='';
}
async function entregar(blob,nombre){
  const tactil=matchMedia('(pointer:coarse)').matches;
  try{const file=new File([blob],nombre,{type:blob.type});
    if(tactil&&navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file]});return tr('Listo: elige «Guardar en Archivos», «Guardar imagen» o la app donde quieras usarlo.','Done: choose “Save to Files”, “Save Image” or the app where you want to use it.');}}
  catch(e){if(e&&e.name==='AbortError')return '';}
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=nombre;document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},5000);
  return tr('Descargado: ','Downloaded: ')+nombre;
}
function aPng(svg,W,H){return new Promise((ok,mal)=>{const img=new Image();
  img.onload=()=>{try{const cv=document.createElement('canvas');cv.width=W;cv.height=H;cv.getContext('2d').drawImage(img,0,0,W,H);cv.toBlob(b=>b?ok(b):mal(new Error('png')),'image/png');}catch(e){mal(e);}};
  img.onerror=()=>mal(new Error('svg'));img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);});}
$('exportar').onclick=()=>{exPintar();window.abrirDlg('dlg-exportar');};
['ex-x','ex-cerrar'].forEach(id=>$(id).onclick=()=>window.cerrarDlg('dlg-exportar'));
$('dlg-exportar').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  const g=b.closest('[data-ex]');
  if(g){EX[g.dataset.ex]=g.dataset.ex==='px'?+b.dataset.val:b.dataset.val;exGuardar();exPintar();b.focus();}
  else if(b.dataset.rep){const k=b.dataset.rep;EX[k]=Math.max(1,Math.min(10,EX[k]+ +b.dataset.d));exGuardar();exPintar();}
});
$('ex-leyenda').addEventListener('change',()=>{EX.leyenda=$('ex-leyenda').checked;exGuardar();exPintar();});
$('ex-mm').addEventListener('input',()=>{const v=+$('ex-mm').value;if(v>=10&&v<=1000){EX.mm=v;exGuardar();exPintar();}});
$('ex-mm').addEventListener('change',()=>{$('ex-mm').value=EX.mm;});
$('ex-bajar').onclick=async()=>{
  const btn=$('ex-bajar');btn.disabled=true;$('ex-msg').textContent=EX.modo==='png'?tr('Preparando la imagen…','Preparing the image…'):'';
  try{let blob,nombre;
    if(EX.modo==='lamina'){$('ex-msg').textContent=tr('Preparando la lámina…','Preparing the sheet…');blob=await crearLamina();nombre=exNombre('pdf');}
    else if(EX.modo==='png'){const [W,H]=exDims();blob=await aPng(exSvg(false),W,H);nombre=exNombre('png');}
    else{blob=new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n'+exSvg(false)],{type:'image/svg+xml'});nombre=exNombre('svg');}
    $('ex-msg').textContent=await entregar(blob,nombre);
  }catch(e){$('ex-msg').textContent=tr('No se ha podido crear el archivo. Prueba con menos repeticiones o con 2000 píxeles.','The file could not be created. Try fewer repeats or 2000 pixels.');}
  btn.disabled=false;
};
$('ex-copiar').onclick=async()=>{try{await navigator.clipboard.writeText(exSvg(false));$('ex-msg').textContent=tr('SVG copiado. Pégalo en un archivo .svg, en Inkscape o en tu programa de corte.','SVG copied. Paste it into an .svg file, Inkscape or your cutting software.');}catch(err){$('ex-msg').textContent=tr('El navegador no ha dejado copiar. Usa «Descargar».','The browser did not allow copying. Use “Download”.');}};

// ---------- Galería de patrones ----------
// Miniaturas (v2.9): se guardan en el móvil la primera vez, para no recalcular cada alicatado al abrir la galería
const MINI={},VMINI=(document.querySelector('meta[name="app-version"]')||{}).content||'';
function miniatura(p){if(MINI[p.id])return MINI[p.id];const kk='mosaicos-mini-'+VMINI+'-'+p.id;
  try{const g=localStorage.getItem(kk);if(g)return MINI[p.id]=g;}catch(e){}
  const d=datos(p),pal=Object.values(p.paletas)[0],[x0,y0,w,h]=p.vistas.mod,l=Math.min(w,h);
  const sv=renderLazo(d,{x0,y0,w:l,h:l,cols:pal.cols,over:{},ribbon:pal.ribbon,outline:pal.outline,rw:p.rw,ow:p.ow,interlace:false}).replace('width="100%"','width="48" height="48" aria-hidden="true" focusable="false"');
  MINI[p.id]=sv;try{for(const k of Object.keys(localStorage))if(k.startsWith('mosaicos-mini-')&&!k.startsWith('mosaicos-mini-'+VMINI+'-'))localStorage.removeItem(k);if(sv.length<150000)localStorage.setItem(kk,sv);}catch(e){}
  return sv;}
const yaMini=p=>{if(MINI[p.id])return true;try{return !!localStorage.getItem('mosaicos-mini-'+VMINI+'-'+p.id);}catch(e){return false;}};
function contarGaleria(){}
// Galería (v2.8): en el orden del libro, y cada tarjeta con su página o número, los pasos, las piezas y la dificultad (con texto, no solo con color)
function nPasos(p){return p.pasos?p.pasos.length:(window.LAZO_PASOS||6);}
const tiposPieza=p=>p.nombres.length-(p.cintas?p.cintas.length:0); // v2.20: las cintas de color no cuentan como piezas
function dificultad(p){const n=nPasos(p)+p.nombres.length/2;return n<=7?0:n<=11?1:2;}
function datosPat(p){const d=dificultad(p),DIF=[tr('Fácil','Easy'),tr('Media','Medium'),tr('Difícil','Hard')];
  const ref=p.coleccion==='alhambra'?tr(`n.º ${p.num}`,`no. ${p.num}`)+(p.pags?tr(` · págs. ${String(p.pags).replace(/ a /,'–')}`,` · pp. ${String(p.pags).replace(/ (a|y) /,'–')}`):''):tr(`págs. ${String(p.pags).replace(/ a /,'–')}`,`pp. ${String(p.pags).replace(/ (a|y) /,'–')}`);
  const pt=`<span class="dif" aria-hidden="true">${'●'.repeat(d+1)}${'○'.repeat(2-d)}</span>`;
  return `<span class="pat-datos"><span>${icono('libro')}${ref}</span><span>${icono('pasos')}${tr(nPasos(p)+' pasos',nPasos(p)+' steps')}</span><span>${icono('piezas')}${tr(tiposPieza(p)+' piezas',tiposPieza(p)+' pieces')}</span><span>${pt}${DIF[d]}</span></span>`;}
const ordenLibro=p=>p.coleccion==='alhambra'?p.num:parseInt(p.pags)||0;
function pintarGaleria(col){contarGaleria();$('galeria').innerHTML=Object.values(PATS).filter(p=>!col||(p.coleccion||'alcazar')===col).sort((a,b)=>ordenLibro(a)-ordenLibro(b)).map(p=>`<button class="pat${p===PAT?' on':''}" data-pat="${p.id}" aria-pressed="${p===PAT}">${yaMini(p)?miniatura(p):`<span class="mini-hueco" data-mini="${p.id}"></span>`}<span><b>${p.nombre}</b><small>${p.lugar}</small>${datosPat(p)}${chipsHecho(p)}</span></button>`).join('');
  const huecos=[...$('galeria').querySelectorAll('[data-mini]')],sig=()=>{const h=huecos.shift();if(!h)return;if(h.isConnected){const t=document.createElement('span');t.innerHTML=miniatura(PATS[h.dataset.mini]);h.replaceWith(t.firstChild);}setTimeout(sig,0);};setTimeout(sig,30);}
function cabecera(){$('titulo').innerHTML=PAT.nombre+`<span class="sub">${PAT.lugar} · ${monu(PAT)}</span>`;document.title=PAT.nombre+' · Lacería';$('intro').innerHTML=PAT.intro;$('pie').textContent=PAT.pie;
  document.querySelectorAll('[data-pat]').forEach(b=>{const on=b.dataset.pat===PAT.id;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});}
function cambiarPatron(id){if(id===PAT.id)return;guardar();cargar(id);HIST=[];$('deshacer').disabled=true;SEL=-1;guardar();pintarPaletas();cabecera();draw();if(window.trazadoCambio)window.trazadoCambio();}
$('galeria').addEventListener('click',e=>{const b=e.target.closest('[data-pat]');if(b)location.hash='#a/'+b.dataset.pat+'/trazado';});
cargar(new URLSearchParams(location.search).get('patron')||ESTADO.pat);pintarPaletas();cabecera(); // la galería se pinta al abrirla
draw();
// ---------- Trazado paso a paso ----------
(function(){
const V=[-2.5,-2.5,29,29];           // vista del libro: cuadrícula 0..29 (5-7-5-7-5)
const B=n=>n+2.5;                     // coordenada del libro (0..29)
const TS=[[[3.5,0],[2.5,1],'r'],[[2.5,1],[2.5,2.5],'a'],[[2.5,2.5],[11,2.5],'a'],[[11,2.5],[12,3.5],'r'],
  [[3.5,0],[12,8.5],'d'],[[9.5,9.5],[11,9.5],'a'],[[11,9.5],[12,8.5],'r'],[[8.5,0],[9.5,1],'r'],[[9.5,1],[9.5,9.5],'a']];
const G=[(u,v)=>[u,v],(u,v)=>[-u,v],(u,v)=>[u,-v],(u,v)=>[-u,-v],(u,v)=>[v,u],(u,v)=>[-v,u],(u,v)=>[v,-u],(u,v)=>[-v,-u]];
const x0=V[0],y0=V[1],x1=V[0]+V[2],y1=V[1]+V[3];
function clip(a,b){let t0=0,t1=1;const dx=b[0]-a[0],dy=b[1]-a[1];
  for(const [p,q] of [[-dx,a[0]-x0],[dx,x1-a[0]],[-dy,a[1]-y0],[dy,y1-a[1]]]){
    if(Math.abs(p)<1e-12){if(q<0)return null}else{const r=q/p;if(p<0)t0=Math.max(t0,r);else t1=Math.min(t1,r)}}
  if(t0>=t1-1e-9)return null;return[[a[0]+t0*dx,a[1]+t0*dy],[a[0]+t1*dx,a[1]+t1*dy]];}
const segs={a:[],d:[],r:[]},seen=new Set();
for(let i=-1;i<=2;i++)for(let j=-1;j<=2;j++)for(const g of G)for(const [a,b,k] of TS){
  let A=g(...a),C=g(...b);A=[A[0]+24*i,A[1]+24*j];C=[C[0]+24*i,C[1]+24*j];
  const c=clip(A,C);if(!c)continue;
  const key=[c[0],c[1]].map(p=>p.map(n=>n.toFixed(2)).join(',')).sort().join('|');
  if(seen.has(key))continue;seen.add(key);segs[k].push(c);}
const ctr=[12,12],dist=s=>Math.hypot((s[0][0]+s[1][0])/2-ctr[0],(s[0][1]+s[1][1])/2-ctr[1]);
for(const k in segs)segs[k].sort((p,q)=>dist(p)-dist(q));
const ln=(a,b,attr,i,n)=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" pathLength="1" ${attr}${i!=null?` style="animation-delay:${(i/n*1.6).toFixed(2)}s"`:''}/>`;

function layers(step){
  const L=[];const cur=k=>k===step?' draw actual':(k<step?' previo':'');const dim=k=>(step>4&&k<4)?' dim':'';
  // 1 cuadrícula
  let g=`<g class="${step===1?'fade actual':'previo'}${step>=4?' dim':''}" fill="none">`;
  for(let i=0;i<=29;i++){g+=`<line x1="${i-2.5}" y1="-2.5" x2="${i-2.5}" y2="26.5" stroke="#9cbbd6" stroke-width="0.03"/><line x1="-2.5" y1="${i-2.5}" x2="26.5" y2="${i-2.5}" stroke="#9cbbd6" stroke-width="0.03"/>`;}
  for(const c of [0,5,12,17,24,29]){g+=`<line x1="${c-2.5}" y1="-2.5" x2="${c-2.5}" y2="26.5" stroke="#2b4f73" stroke-width="0.09"/><line x1="-2.5" y1="${c-2.5}" x2="26.5" y2="${c-2.5}" stroke="#2b4f73" stroke-width="0.09"/>`;}
  g+='</g>';
  if(step===1){ // cotas 5-7-5-7-5
    const m=[0,5,12,17,24,29];for(let i=0;i<5;i++)g+=`<text x="${(m[i]+m[i+1])/2-2.5}" y="-3" font-size="1.2" text-anchor="middle" fill="#2b4f73" font-family="Inter,sans-serif">${m[i+1]-m[i]}</text>`;
  }
  L.push(g);
  // 2 estrellas
  if(step>=2){let s=`<g class="${cur(2)}${step>=4?' dim':''}" fill="none" stroke="#b5444b" stroke-width="0.09">`,n=0;
    const C=[0,12,24];const tot=18;
    for(const cy of C)for(const cx of C){
      s+=`<polygon pathLength="1" points="${cx-2.5},${cy-2.5} ${cx+2.5},${cy-2.5} ${cx+2.5},${cy+2.5} ${cx-2.5},${cy+2.5}" style="animation-delay:${(n++/tot*1.4).toFixed(2)}s"/>`;
      s+=`<polygon pathLength="1" points="${cx},${cy-3.5} ${cx+3.5},${cy} ${cx},${cy+3.5} ${cx-3.5},${cy}" style="animation-delay:${(n++/tot*1.4).toFixed(2)}s"/>`;}
    L.push(s+'</g>');}
  // 3 prolongar diagonales
  if(step>=3){let s=`<g class="${step===3?'fade actual':'previo'}${step>=4?' dim':''}" stroke="#b5444b" stroke-width="0.06" stroke-dasharray="0.35 0.2" fill="none" clip-path="url(#tzclip)">`;
    for(let k=-2;k<=6;k++)for(const e of [-3.5,3.5]){const c=12*k+e;
      s+=`<line x1="-2.5" y1="${c+2.5}" x2="26.5" y2="${c-26.5}"/><line x1="-2.5" y1="${-2.5-c}" x2="26.5" y2="${26.5-c}"/>`;}
    L.push(s+'</g>');}
  // 4-6 remarcar
  const parts=[['a',4],['d',5],['r',6]];
  for(const [k,n] of parts){if(step<n)continue;
    let s=`<g class="${cur(n)}" stroke="#1b1b1b" stroke-width="0.17" stroke-linecap="round" fill="none">`;
    segs[k].forEach((q,i)=>s+=ln(q[0],q[1],'',step===n?i:null,segs[k].length));L.push(s+'</g>');}
  return L.join('');
}
const STEPS=[
 {h:'La cuadrícula',t:'Dibuja una cuadrícula de 29 × 29 cuadros. Remarca las divisiones alternando 5 y 7 cuadros: 5-7-5-7-5. Así quedan nueve cuadrados de 5 × 5, uno en cada cruce de las bandas estrechas.',c:'Con un cuadro de 6,5 mm, el módulo mide unos 19 cm y cabe en un A4. Usa un lápiz duro (2H) y trazo muy suave.'},
 {h:'Las estrellas de ocho puntas',t:'En cada cuadrado de 5 dibuja una estrella: el propio cuadrado y, encima, un rombo con el mismo centro, girado 45°, cuyas puntas sobresalen un cuadro por cada lado (3,5 cuadros desde el centro).',c:'Es la versión en cuadrícula de la estrella de dos cuadrados que en la página 133 se traza con compás.'},
 {h:'Prolongar los lados',t:'Prolonga los lados de las estrellas. Los lados del cuadrado coinciden con las líneas 5-7 que ya tienes. Los del rombo se convierten en diagonales que cruzan todo el módulo.',c:'Todas las líneas del dibujo final están en esta red: horizontales, verticales y diagonales a 45°.'},
 {h:'Remarcar: rectas',t:'Empieza a remarcar el lazo. Primero, los tramos horizontales y verticales: rodean las estrellas y forman el cuadrado alrededor de la estrella central.',c:'Remarca con un lápiz más blando (HB o 2B). Las líneas de construcción quedan atenuadas.'},
 {h:'Remarcar: diagonales largas',t:'Remarca las diagonales largas. Salen de las puntas de los rombos de las esquinas y atraviesan el módulo hasta las estrellas de los lados.',c:'Fíjate en que cada diagonal pasa justo por la punta de una estrella vecina.'},
 {h:'Remarcar: remates',t:'Añade los remates cortos a 45°. Unen las rectas con las diagonales y dibujan las puntas en V de las estrellas. Con esto el lazo forma cintas continuas y cerradas.',c:'Si una línea se queda suelta, falta algún remate: cada cinta tiene que seguir sin cortes.'},
 {h:'Dar ancho a la cinta',t:'Convierte cada línea en una cinta: dibuja una paralela a cada lado del trazo, a la misma distancia. Después borra la línea central y las de construcción.',c:'Una cinta de algo más de medio cuadro de ancho es la proporción del alicatado. Calcula el ancho con el recuadro de la página 134.'},
 {h:'Entrelazar',t:'En cada cruce, una cinta pasa por encima y la otra por debajo. Recorre cada cinta alternando: encima, debajo, encima… y borra los trozos de la que queda debajo.',c:'Si alternas bien en una cinta, las demás encajan solas.'},
 {h:'Colorear',t:'Ya puedes pintar. Las estrellas y los alfardones en negro y las piezas en V en verde reproducen el zócalo del patio.',c:'Prueba antes las combinaciones en la pestaña Colorear.'}
];
window.LAZO_PASOS=STEPS.length;
if(EN&&PAT_EN.lazo8)STEPS.forEach((q,i)=>Object.assign(q,PAT_EN.lazo8.pasos[i]||{}));
let step=1;
// v2.0: el mismo reproductor sirve para las construcciones básicas (window.MODO.c) y empieza por el objetivo (paso 0)
window.MODO=window.MODO||{c:null};
const lt=x=>Array.isArray(x)?(EN?x[1]:x[0]):x;
const metB=()=>!MODO.c&&PAT.pasosB&&(()=>{try{return localStorage.getItem('laceria-metodo-'+PAT.id)==='B'}catch(e){return false}})();
const pasos=()=>MODO.c?MODO.c.pasos.map(q=>({h:lt(q.h),t:lt(q.t),c:''})):(PAT.id==='lazo8'?STEPS:(metB()?PAT.pasosB:PAT.pasos));
const clave=()=>MODO.c?'laceria-paso-c-'+MODO.c.id:(PAT.id==='lazo8'?'laceria-paso':'laceria-paso-'+PAT.id+(metB()?'-B':''));
function leerPaso(){step=0;try{const v=localStorage.getItem(clave());const s=+v;if(v!==null&&s>=0&&s<=pasos().length)step=s;}catch(e){}}
leerPaso();
const white={cols:Array(9).fill('#ffffff'),ribbon:'#ffffff',outline:'#222222',rw:0.62,ow:0.08};
// Paso actual en azul intenso y más grueso; lo ya trazado, en gris claro. Así se distinguen sin depender del color.
function marcarPaso(){const raiz=document.querySelector('#tzsvg .capas>.nuevo')||document.getElementById('tzsvg');
  const pinta=(sel,fn)=>raiz.querySelectorAll(sel).forEach(g=>[g,...g.querySelectorAll('*')].forEach(e=>{const st=e.getAttribute('stroke');if(!st||st==='none')return;const f=e.getAttribute('fill');if(f&&f!=='none'&&e.tagName!=='g')return;fn(e);}));
  pinta('.previo',e=>{e.setAttribute('stroke','#a7a196');});
  pinta('.actual',e=>{e.setAttribute('stroke','#1d4ed8');const w=parseFloat(e.getAttribute('stroke-width'));if(w)e.setAttribute('stroke-width',+(w*1.5).toFixed(3));});
  const hay=!!raiz.querySelector('.previo')&&!!raiz.querySelector('.actual');document.getElementById('leyenda-paso').hidden=!hay;}
// ---------- Medidas en papel en cada paso (v2.9): en cm, según el papel y los módulos elegidos en Teselar › En papel ----------
// [texto, texto en inglés, medida en unidades del libro]; 'rw' = ancho de la cinta
const MEDPASO={
  damas36:{1:[['Radio de la circunferencia','Radius of the circle',Math.SQRT2],['Lado del cuadrado (el módulo)','Side of the square (the module)',2]],
    3:[['Distancia de las paralelas al centro','Distance of the parallels from the center',Math.SQRT1_2]],
    4:[['Distancia de cada recta al centro','Distance of each line from the center',3*Math.SQRT1_2-2],['Ancho de cada barra (A)','Width of each bar (A)',6*Math.SQRT1_2-4]],
    5:[['Distancia de las paralelas al centro','Distance of the parallels from the center',5*Math.SQRT1_2-3],['Y de las otras','And of the others',3-3*Math.SQRT1_2]],
    6:[['Radio AB','Radius AB',4*Math.SQRT2-5],['Radio de la circunferencia menor','Radius of the smaller circle',(3*Math.SQRT1_2-2)/Math.sin(Math.PI/8)]],
    11:[['A (ancho de las barras del paso 4)','A (width of the bars of step 4)',6*Math.SQRT1_2-4],['Ancho de la cinta (A/4)','Strap width (A/4)','rw']]},
  damas37:{1:[['Lado del cuadrado','Side of the square',2],['Radio de la circunferencia y de las semicircunferencias','Radius of the circle and of the semicircles',1]],
    2:[['Lado de los hexágonos','Side of the hexagons',1],['Distancia de sus lados al centro','Distance of their sides from the center',Math.sqrt(3)/2]],
    3:[['Distancia de los lados de los triángulos al centro','Distance of the sides of the triangles from the center',0.5]],
    4:[['Puntos de la estrella, desde el centro','Points of the star, from the center',1/Math.sqrt(3)],['Cada recta, desde el centro','Each line, from the center',Math.cos(5*Math.PI/12)/Math.sqrt(3)]],
    5:[['Radio de las circunferencias de las esquinas','Radius of the corner circles',Math.SQRT2*(1-Math.sqrt(3)/2)]],
    8:[['A (entre dos brazos paralelos)','A (between two parallel arms)',2*Math.cos(5*Math.PI/12)/Math.sqrt(3)],['Ancho de la cinta (A/4)','Strap width (A/4)','rw']]},
  jambas31:{1:[['Lado del cuadrado','Side of the square',2],['Radio de la circunferencia','Radius of the circle',1]],
    3:[['Distancia de las rectas al centro','Distance of the lines from the center',1-Math.SQRT1_2]],
    5:[['Radio AB','Radius AB',Math.hypot(0.5,Math.SQRT1_2-0.5)],['Radio CD','Radius CD',Math.SQRT1_2-Math.hypot(0.5,Math.SQRT1_2-0.5)],['Radio EF','Radius EF',Math.hypot(0.5,Math.SQRT1_2-0.5)-(1-Math.SQRT1_2)]],
    6:[['Centros de las ruedas, desde el centro','Centers of the wheels, from the center',Math.hypot(Math.SQRT1_2,1-Math.SQRT1_2)]],
    12:[['Lado de los cuadrados de la estrella (ancho del zafate)','Side of the squares of the star (zafate width)',2*(Math.SQRT1_2-Math.hypot(0.5,Math.SQRT1_2-0.5))*Math.cos(3*Math.PI/8)]]},
  reyes29:{1:[['Radio de la circunferencia','Radius of the circle',1]],
    2:[['Lado del hexágono','Side of the hexagon',1]],
    4:[['Lados de los triángulos, desde el centro','Sides of the triangles, from the center',Math.sqrt(3)/4]],
    6:[['Puntas de la estrella de doce, desde el centro','Points of the twelve-pointed star, from the center',Math.sqrt(3)/4/Math.SQRT1_2],['Cada recta, desde el centro (medio ancho del zafate)','Each line, from the center (half the zafate width)',Math.sqrt(3)/4/Math.SQRT1_2*Math.cos(5*Math.PI/12)]],
    7:[['Lados del hexágono girado, desde el centro','Sides of the turned hexagon, from the center',Math.sqrt(3)/2-Math.sqrt(3)/4/Math.SQRT1_2*Math.cos(5*Math.PI/12)]],
    8:[['Lado del nuevo hexágono','Side of the new hexagon',Math.sqrt(3)/2]]},
  reyes28:{1:[['Lado del cuadrado','Side of the square',2],['Radio de la circunferencia','Radius of the circle',1]],
    2:[['Radio de los arcos','Radius of the arcs',1],['Los arcos cortan las diagonales, desde el centro, a','The arcs cut the diagonals, from the center, at',Math.SQRT2-1]],
    3:[['Las prolongaciones llegan al lado del cuadrado, desde el eje, a','The extensions reach the side of the square, from the axis, at',2-Math.SQRT2]],
    4:[['Puntas de la estrella de ocho en los ejes, desde el centro','Points of the eight-pointed star on the axes, from the center',Math.SQRT2-1]]},
  taca:{1:[['Radio de la circunferencia','Radius of the circle',1],['Lado del cuadrado','Side of the square',2]],
    2:[['Distancia de las paralelas al centro','Distance of the parallels from the center',Math.SQRT1_2]],
    3:[['Vértices del octógono central, desde el centro','Vertices of the central octagon, from the center',Math.SQRT1_2/Math.cos(Math.PI/8)]],
    4:[['Vértices del nuevo octógono central, desde el centro','Vertices of the new central octagon, from the center',(1-Math.SQRT1_2)/Math.cos(Math.PI/8)],['Rectas del segundo octógono estrellado, desde el centro','Lines of the second star octagon, from the center',(1-Math.SQRT1_2)*Math.tan(Math.PI/8)]]},
  felipe:{1:[['Radio de la circunferencia','Radius of the circle',Math.SQRT2],['Lado de los cuadrados inscritos','Side of the inscribed squares',2]],
    2:[['Los ocho puntos de corte, desde el centro','The eight crossing points, from the center',1/Math.cos(Math.PI/8)]],
    3:[['Distancia de las ocho rectas al centro','Distance of the eight lines from the center','G.dB']],
    4:[['Radio de las circunferencias pequeñas','Radius of the small circles','G.rho']],
    5:[['Lado del cuadrado del marco','Side of the frame square','G.s2'],['Del centro a cada vértice del rombo','From the center to each vertex of the rhombus','G.q']],
    8:[['Ancho de la cinta','Strap width','rw']],9:[['Ancho de la cinta','Strap width','rw']]},
  barca:{1:[['Lado del cuadrado de 8 × 8','Side of the 8 × 8 square',8],['Lado de cada cuadro y radio de la circunferencia','Side of each square and radius of the circle',1]],
    2:[['Distancia de cada paralela al centro','Distance of each parallel from the center',Math.SQRT1_2]],
    3:[['Distancia de las paralelas al centro','Distance of the parallels from the center',Math.SQRT1_2]],
    4:[['Distancia de las paralelas al centro','Distance of the parallels from the center',1+Math.SQRT1_2]],
    5:[['Las paralelas cortan los ejes, desde el centro, a','The parallels cut the axes, from the center, at',1+Math.SQRT2]],
    6:[['Distancia de las paralelas al centro','Distance of the parallels from the center',1+3*Math.SQRT1_2]],
    8:[['A (entre las rectas del paso 4)','A (between the lines of step 4)',2+Math.SQRT2],['B = A/10','B = A/10',(2+Math.SQRT2)/10],['Ancho de la cinta (2B)','Strap width (2B)','rw']]},
  arrayanes:{1:[['Radio de la circunferencia (y de los arcos)','Radius of the circle (and of the arcs)',1]],
    2:[['Lado del hexágono','Side of the hexagon',1]],
    3:[['Radio de la circunferencia tangente','Radius of the tangent circle',Math.sqrt(3)/2]],
    8:[['Ancho de la cinta','Strap width','rw']]},
  zaguan2:{1:[['Lado del cuadrado de 8 × 8','Side of the 8 × 8 square',8],['Lado de cada cuadro','Side of each square',1],['Radio de las circunferencias (2 cuadros)','Radius of the circles (2 squares)',2]],
    4:[['Radio de los cuartos de circunferencia','Radius of the quarter circles',Math.SQRT2]]}};
function medPaso(){const el=document.getElementById('stepm');if(!el)return;
  if(MODO.c||!window.papelActual){el.hidden=true;return;}
  const P=window.papelActual();if(!P){el.hidden=true;return;}
  const kl=PAT.k||1,cmv=v=>window.cmPapel(v*kl*P.G.k);
  const val=v=>{if(v==='rw')return window.cmPapel(PAT.rw*P.G.k);if(typeof v==='string'&&v.startsWith('G.')){const G=PAT.G||{},n=v.slice(2);return cmv(n==='s2'?2*G.s:G[n]);}return cmv(v);};
  let L=(!metB()&&step>0&&MEDPASO[PAT.id]&&MEDPASO[PAT.id][step])?MEDPASO[PAT.id][step].map(([a,b,v])=>[tr(a,b),val(v)]):null;
  if(!L)L=step===0?P.med:P.med.slice(0,1);
  el.innerHTML=`<p class="mp-t">${icono('regla')}<b>${tr('En papel','On paper')}</b> <span>· ${P.desc}</span> <button type="button" class="enlace" id="mp-cambiar">${tr('Cambiar','Change')}</button></p><ul>`+L.map(([t,v])=>`<li>${t}: <b>${v}</b></li>`).join('')+'</ul>';
  el.hidden=false;
  document.getElementById('mp-cambiar').onclick=()=>{location.hash='#a/'+PAT.id+'/imprimir';setTimeout(()=>{const d=document.getElementById('ts-papel');if(d){d.scrollIntoView({block:'start',behavior:'smooth'});}},350);};}
let tinta=false; // v2.18: «Entintar» enseña qué se repasa con tinta; cualquier cambio de paso vuelve al trazado
function show(){
  tinta=false;pintarTintaUI();
  const PS=pasos(),N=PS.length;if(step>N)step=N;if(step<0)step=0;
  try{localStorage.setItem(clave(),step)}catch(e){}
  if(!MODO.c&&step===N)HECHO.marca(PAT.id,'t');pintarHecho(!MODO.c&&step===N);
  const obj={h:tr('El objetivo','The goal'),t:MODO.c?tr('Esta es la figura que vas a construir. Pulsa «Empezar» para ver el primer paso.','This is the figure you are going to construct. Tap “Start” to see the first step.'):tr(`Este es el mosaico que vas a dibujar, con los colores de ${PAT.coleccion==='alhambra'?'la Alhambra':'el Alcázar'}. Pulsa «Empezar» para ver el primer paso.`,`This is the mosaic you are going to draw, in the ${PAT.coleccion==='alhambra'?'Alhambra':'Alcázar'} colors. Tap “Start” to see the first step.`),c:matchMedia('(pointer:coarse)').matches?tr('También puedes deslizar el dibujo para cambiar de paso.','You can also swipe the drawing to change step.'):''} // v2.15: con ratón no se desliza; ahí ya está el aviso de las flechas del teclado;
  const s=step===0?obj:PS[step-1];
  const etq=step===0?tr('Objetivo','Goal'):tr(`Paso ${step} de ${N}`,`Step ${step} of ${N}`);
  document.getElementById('stepn').textContent=etq;
  document.getElementById('paso-chip').textContent=step===0?tr('La figura terminada','The finished figure'):etq+' · '+s.h;
  document.getElementById('steph').textContent=s.h;document.getElementById('stept').textContent=s.t;document.getElementById('stepc').textContent=s.c||'';try{medPaso();}catch(e){}try{pintarComprobar(PS);}catch(e){}
  let svg;
  if(step===0){
    if(MODO.c)svg=consSvg(MODO.c,0,true);
    else{const pal=Object.values(PAT.paletas)[0],[vx,vy,vw,vh]=PAT.vistas['2x2'];
      svg=`<div class="fade">${renderLazo(datos(PAT),{x0:vx,y0:vy,w:vw,h:vh,cols:pal.cols,over:{},ribbon:pal.ribbon,outline:pal.outline,rw:PAT.rw,ow:PAT.ow,interlace:PAT.tipo!=='mosaico'}).replace('<svg ','<svg style="pointer-events:none" ')}</div>`;}}
  else if(MODO.c)svg=consSvg(MODO.c,step);
  else if(PAT.id!=='lazo8')svg=PATRONES.dibujarPaso(PAT,step,renderLazo,PS);
  else if(step<=6){svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3.5 -4.5 31 31.5" width="100%"><rect x="-2.5" y="-2.5" width="29" height="29" fill="#fffefa"/><defs><clipPath id="tzclip"><rect x="-2.5" y="-2.5" width="29" height="29"/></clipPath></defs>${layers(step)}</svg>`;}
  else{const o={x0:-2.5,y0:-2.5,w:29,h:29,...white,interlace:step>=8,frame:true};
    if(step===9){const p=PRESETS['Alcázar'];o.cols=p.cols;o.ribbon=p.ribbon;o.outline=p.outline;}
    svg=`<div class="fade">${renderLazo(D_LAZO,o).replace('<svg ','<svg style="pointer-events:none" ')}</div>`;}
  {const el=document.getElementById('tzsvg'),viejo=el.querySelector(':scope>.capas>.nuevo')||el;
   // si el dibujo nuevo entra con fundido, el anterior se queda debajo (quieto) hasta que termina
   if(/^<div class="fade">/.test(svg)&&step>0&&el.innerHTML){const v=(viejo===el?el.innerHTML:viejo.innerHTML).replace(/ class="([^"]*)"/g,(m,c)=>{const k=c.split(/\s+/).filter(x=>x&&x!=='draw'&&x!=='fade').join(' ');return k?` class="${k}"`:'';});
     el.innerHTML=`<div class="capas"><div class="viejo" aria-hidden="true">${v}</div><div class="nuevo">${svg}</div></div>`;
     clearTimeout(show.tv);show.tv=setTimeout(()=>{const x=el.querySelector('.capas>.viejo');if(x)x.remove();},1000);}
   else el.innerHTML=svg;}
  const foco=document.activeElement&&document.activeElement.id;
  document.getElementById('dots').innerHTML=`<button data-step="0" class="${step===0?'on':''}" title="${obj.h}" aria-label="${obj.h}"${step===0?' aria-current="step"':''}>★</button>`+PS.map((_,i)=>`<button data-step="${i+1}" class="${i+1===step?'on':''}" title="${PS[i].h}" aria-label="${tr('Paso','Step')} ${i+1}: ${PS[i].h}"${i+1===step?' aria-current="step"':''}>${i+1}</button>`).join('');
  {const m=document.getElementById('metodo'),hay=!MODO.c&&!!PAT.pasosB;m.hidden=!hay;if(hay)m.querySelectorAll('[data-met]').forEach(b=>{const on=(b.dataset.met==='B')===!!metB();b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});}
  marcarPaso();
  document.getElementById('tzsvg').setAttribute('aria-label',step===0?obj.h:tr(`Dibujo del paso ${step}: ${s.h}`,`Drawing for step ${step}: ${s.h}`));
  document.getElementById('prev').disabled=step===0;
  document.getElementById('next').textContent=step===0?tr('Empezar →','Start →'):tr('Siguiente →','Next →');
  const sigC=MODO.c?CONS.L[CONS.L.indexOf(MODO.c)+1]:null;
  document.getElementById('gocolor').textContent=MODO.c?(sigC?tr('Siguiente construcción →','Next construction →'):tr('Volver a la lista','Back to the list')):tr('Siguiente: teselar →','Next: tessellate →');
  const ult=step===N;document.getElementById('next').hidden=ult;document.getElementById('gocolor').hidden=!ult;
  if(ult&&foco==='next')document.getElementById('gocolor').focus();
  if(typeof pintarTrazos==='function')pintarTrazos();
}
// «Comprueba antes de seguir» (v2.18): lo que se puede mirar con la regla o el compás antes de pasar de paso
function pintarComprobar(PS){const el=document.getElementById('stepok');if(!el)return;
  if(MODO.c||step===0){el.hidden=true;return;}
  let ancho=null;try{const P=window.papelActual&&window.papelActual();if(P&&PAT.tipo==='cinta')ancho=window.cmPapel(PAT.rw*P.G.k);}catch(e){}
  const L=comprobaciones(PAT,step,PS,!!metB(),ancho);if(!L.length){el.hidden=true;return;}
  el.innerHTML=`<p class="ok-t">${icono('hecho')}<b>${tr('Comprueba antes de seguir','Check before you go on')}</b></p><ul>`+L.map(t=>`<li>${t}</li>`).join('')+'</ul>';el.hidden=false;}
// «Entintar» (v2.18)
function svgTinta(){
  if(PAT.id==='lazo8'){const o={x0:-2.5,y0:-2.5,w:29,h:29,...white,outline:'#111111',ow:0.11,interlace:true,frame:true};
    const g=PATRONES.lapiz(layers(3).replace(/ clip-path="[^"]*"/g,''),1);
    return renderLazo(D_LAZO,o).replace('<svg ','<svg style="pointer-events:none" ').replace(/<\/svg>\s*$/,`<defs><clipPath id="tzclip3"><rect x="-2.5" y="-2.5" width="29" height="29"/></clipPath></defs><g class="tinta-lapiz" stroke-dasharray="0.22 0.16" clip-path="url(#tzclip3)">${g}</g></svg>`);}
  return PATRONES.dibujarTinta(PAT,renderLazo,pasos());}
function pintarTintaUI(){const b=document.getElementById('tinta-on'),p=document.getElementById('tinta-panel');if(!b)return;
  b.hidden=!!MODO.c;b.setAttribute('aria-pressed',tinta);b.classList.toggle('on',tinta);p.hidden=!tinta;
  document.querySelector('#tab-trazado .tzside').classList.toggle('entintando',tinta);}
function verTinta(){tinta=true;pintarTintaUI();const cinta=PAT.tipo==='cinta';
  let ancho=null;try{const P=window.papelActual&&window.papelActual();if(P&&cinta)ancho=window.cmPapel(PAT.rw*P.G.k);}catch(e){}
  const el=document.getElementById('tzsvg');el.innerHTML=`<div class="fade">${svgTinta()}</div>`;
  el.setAttribute('aria-label',tr('Qué se repasa con tinta: el dibujo final, en trazo grueso; el lápiz de la construcción, fino y a rayas','What to ink: the final drawing in a thick line; the construction pencil, thin and dashed'));
  document.getElementById('paso-chip').textContent=tr('Entintar','Inking');document.getElementById('leyenda-paso').hidden=true;
  const m=(d,w)=>`<svg class="tinta-m" viewBox="0 0 34 10" width="34" height="10" aria-hidden="true" focusable="false"><line x1="2" y1="5" x2="32" y2="5" stroke="currentColor" stroke-width="${w}" stroke-linecap="round"${d?' stroke-dasharray="4 3"':''}/></svg>`;
  const L=[tr('Repasa con tinta solo las líneas gruesas y continuas: son el dibujo definitivo.','Go over only the thick, solid lines in ink: they are the final drawing.'),
    cinta?tr('En cada cruce, la cinta que pasa por debajo se corta a los dos lados de la que pasa por encima: levanta la pluma al llegar y sigue al otro lado.','At every crossing, the strap that goes under stops on both sides of the one that goes over: lift the pen when you reach it and carry on at the other side.')+(ancho?tr(` La cinta mide ${ancho} de ancho en tu papel.`,` The strap is ${ancho} wide on your paper.`):'')
      :tr('Repasa cada pieza entera, de vértice a vértice: todas quedan cerradas.','Go over each whole piece, from vertex to vertex: they all end up closed.'),
    tr('Deja secar la tinta y borra el lápiz: la cuadrícula, las circunferencias y las líneas prolongadas.','Let the ink dry and rub out the pencil: the grid, the circles and the extended lines.')];
  document.getElementById('tinta-panel').innerHTML=`<p class="mp-t"><b>🖋 ${tr('Entintar','Inking')}</b></p><p class="tinta-ley"><span>${m(false,3.2)}${tr('Con tinta','In ink')}</span><span>${m(true,1.2)}${tr('Lápiz: se borra','Pencil: rub it out')}</span></p><ol>`+L.map(t=>`<li>${t}</li>`).join('')+`</ol><div class="ops"><button type="button" id="tinta-off">${tr('Volver al paso','Back to the step')}</button></div>`;
  document.getElementById('tinta-off').onclick=()=>{show();document.getElementById('tinta-on').focus();};
  if(typeof pintarTrazos==='function')pintarTrazos();}
document.getElementById('tinta-on').onclick=()=>{if(tinta)show();else{verTinta();const p=document.getElementById('tinta-panel');if(matchMedia('(max-width:760px)').matches)p.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});}};
// ---------- Repasar a mano (v1.5): trazos guardados por patrón, en las coordenadas del dibujo ----------
const PR_KEY='laceria-practica-v1';let PR={},practicando=false,lapiz=false,actual=null;
try{PR=JSON.parse(localStorage.getItem(PR_KEY)||'{}')||{};}catch(e){PR={};}
const prK=()=>MODO.c?'c-'+MODO.c.id:PAT.id+(metB()?'-B':'');
const trazos=()=>PR[prK()]||(PR[prK()]=[]);
function prGuardar(){try{localStorage.setItem(PR_KEY,JSON.stringify(PR))}catch(e){}}
function prSvg(){return document.querySelector('#tzsvg .nuevo svg')||document.querySelector('#tzsvg svg');}
function prAncho(sv){const vb=sv.viewBox.baseVal;return Math.max(vb.width,vb.height)/170;}
const pathD=pts=>{let d='M'+pts[0]+' '+pts[1];for(let i=2;i<pts.length;i+=2)d+='L'+pts[i]+' '+pts[i+1];return pts.length===2?d+'l0.001 0':d;};
function pintarTrazos(){const sv=prSvg();if(!sv)return;let g=sv.querySelector('.trazos');if(g)g.remove();
  g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','trazos');g.setAttribute('fill','none');g.setAttribute('stroke','#1f5f5b');
  g.setAttribute('stroke-width',prAncho(sv).toFixed(3));g.setAttribute('stroke-linecap','round');g.setAttribute('stroke-linejoin','round');
  g.innerHTML=trazos().map(t=>`<path d="${pathD(t)}"/>`).join('');sv.appendChild(g);
  const hay=trazos().length>0;$pr('pr-undo').hidden=!practicando&&!hay;$pr('pr-clear').hidden=!practicando&&!hay;$pr('pr-undo').disabled=!hay;$pr('pr-clear').disabled=!hay;}
const $pr=id=>document.getElementById(id);
function punto(e,sv){const m=sv.getScreenCTM();if(!m)return null;const p=sv.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const q=p.matrixTransform(m.inverse());return[+q.x.toFixed(2),+q.y.toFixed(2)];}
function prModo(on){practicando=on;$pr('tzsvg').classList.toggle('practicando',on);$pr('pr-on').setAttribute('aria-pressed',on);$pr('pr-on').classList.toggle('on',on);
  $pr('pr-on').textContent=on?tr('✓ Terminar de repasar','✓ Stop tracing'):tr('✏️ Repasar a mano','✏️ Trace by hand');$pr('pr-hint').hidden=!on;pintarTrazos();}
const tz=$pr('tzsvg');
tz.addEventListener('pointerdown',e=>{if(!practicando)return;if(e.pointerType==='pen')lapiz=true;if(lapiz&&e.pointerType==='touch')return;
  const sv=prSvg();if(!sv)return;const q=punto(e,sv);if(!q)return;e.preventDefault();try{tz.setPointerCapture(e.pointerId)}catch(err){}
  actual={id:e.pointerId,pts:[...q],el:document.createElementNS('http://www.w3.org/2000/svg','path')};
  let g=sv.querySelector('.trazos');if(!g){pintarTrazos();g=sv.querySelector('.trazos');}g.appendChild(actual.el);actual.el.setAttribute('d',pathD(actual.pts));});
tz.addEventListener('pointermove',e=>{if(!actual||e.pointerId!==actual.id)return;const sv=prSvg();if(!sv)return;
  const ev=e.getCoalescedEvents?e.getCoalescedEvents():[e];for(const c of (ev.length?ev:[e])){const q=punto(c,sv);if(!q)continue;const n=actual.pts.length;
    if(Math.hypot(q[0]-actual.pts[n-2],q[1]-actual.pts[n-1])<prAncho(sv)*0.35)continue;actual.pts.push(...q);}
  actual.el.setAttribute('d',pathD(actual.pts));});
function prFin(e){if(!actual||e.pointerId!==actual.id)return;const t=trazos();t.push(actual.pts);if(t.length>400)t.shift();actual=null;prGuardar();pintarTrazos();}
tz.addEventListener('pointerup',prFin);tz.addEventListener('pointercancel',prFin);
// Deslizar el dibujo a izquierda o derecha cambia de paso (no mientras se repasa)
let tx=null;
tz.addEventListener('touchstart',e=>{tx=(!practicando&&!tz.dataset.zoom&&e.touches.length===1)?[e.touches[0].clientX,e.touches[0].clientY]:null;},{passive:true});
tz.addEventListener('touchend',e=>{if(!tx)return;const t=e.changedTouches[0],dx=t.clientX-tx[0],dy=t.clientY-tx[1];tx=null;
  if(Math.abs(dx)<50||Math.abs(dy)>Math.abs(dx)*0.6)return;
  if(dx<0&&step<pasos().length){step++;show();window.verPaso&&verPaso();}else if(dx>0&&step>0){step--;show();window.verPaso&&verPaso();}},{passive:true});
let borrarArmado=0;
$pr('pr-on').onclick=()=>prModo(!practicando);
$pr('pr-undo').onclick=()=>{trazos().pop();prGuardar();pintarTrazos();};
$pr('pr-clear').onclick=()=>{const b=$pr('pr-clear');
  if(Date.now()-borrarArmado>4000){borrarArmado=Date.now();b.classList.add('peligro');b.textContent=tr('¿Borrar todo? Toca otra vez','Clear it all? Tap again');
    setTimeout(()=>{if(Date.now()-borrarArmado>=3900){b.classList.remove('peligro');b.textContent=tr('Borrar mi dibujo','Clear my drawing');}},4000);return;}
  borrarArmado=0;PR[prK()]=[];prGuardar();b.classList.remove('peligro');b.textContent=tr('Borrar mi dibujo','Clear my drawing');pintarTrazos();};
document.addEventListener('click',e=>{const t=e.target;
  if(t.dataset.step){step=+t.dataset.step;show();window.verPaso&&verPaso();}
  else if(t.id==='prev'&&step>0){step--;show();window.verPaso&&verPaso();}
  else if(t.id==='next'&&step<pasos().length){step++;show();window.verPaso&&verPaso();}
  else if(t.id==='replay'){show();}
  else if(t.closest&&t.closest('#gocolor')){
    if(MODO.c){const sig=CONS.L[CONS.L.indexOf(MODO.c)+1];location.hash=sig?'#c/'+sig.id:'#aprender';}
    else tab('teselar');}
  else if(t.closest&&t.closest('[data-tab]')){tab(t.closest('[data-tab]').dataset.tab);}
});
document.querySelector('.tabs').addEventListener('keydown',e=>{if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;e.preventDefault();
  const E=['trazado','teselar','colorear','imprimir'],i=E.findIndex(n=>document.getElementById('tab-'+n).classList.contains('show')),n=E[(i+(e.key==='ArrowRight'?1:3))%4];tab(n);document.querySelector(`[data-tab="${n}"]`).focus();});
document.addEventListener('keydown',e=>{if(e.target.closest&&(e.target.closest('.tabs')||e.target.closest('#svg')))return;if(!document.getElementById('tab-trazado').classList.contains('show')||document.querySelector('.dlg:not([hidden])')||document.getElementById('ik-sheet'))return;
  if(e.key==='ArrowRight'&&step<pasos().length){step++;show();}else if(e.key==='ArrowLeft'&&step>0){step--;show();}});
function tab(n,sinHash){document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('show',x.id==='tab-'+n));
  document.querySelectorAll('[data-tab]').forEach(b=>{const on=b.dataset.tab===n;b.classList.toggle('on',on);b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;});
  if(!sinHash&&!MODO.c){const h='#a/'+PAT.id+'/'+n;if(location.hash!==h)location.hash=h;}
  if(n==='teselar'&&window.pintarTeselar)window.pintarTeselar();if(n==='imprimir'&&window.pintarImprimir)window.pintarImprimir();}
window.tabEtapa=tab;
window.trazadoCambio=()=>{leerPaso();show();};
// Método de trazado (compás o cuadrícula), para los alicatados que tienen los dos
document.getElementById('metodo').addEventListener('click',e=>{const b=e.target.closest('[data-met]');if(!b||!PAT.pasosB)return;
  try{localStorage.setItem('laceria-metodo-'+PAT.id,b.dataset.met)}catch(err){}leerPaso();show();b.focus();});
})();


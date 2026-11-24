/* ===== v2.0: vistas (inicio, aprender, alicatados, mis dibujos, construcción y alicatado en 4 etapas) ===== */
(function(){
const $=id=>document.getElementById(id),lt=x=>Array.isArray(x)?(EN?x[1]:x[0]):x;
const ULT='laceria-ultimo-v1',store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const ETAPAS=['trazado','teselar','colorear','imprimir'];
const pasoGuardado=c=>{try{const v=localStorage.getItem('laceria-paso-c-'+c.id);return v===null?null:+v;}catch(e){return null;}};
const mini=c=>consSvg(c,0,true).replace('width="100%"','aria-hidden="true" focusable="false"');
const VOLVER={'#inicio':['Inicio','Home'],'#aprender':['Aprender a trazar','Learn to draw'],'#alicatados':['Alcázar','Alcázar'],'#alhambra':['Alhambra','Alhambra']};
function cab(t,sub,volver,intro){$('titulo').innerHTML=t+(sub?`<span class="sub">${sub}</span>`:'');
  if(volver){const n=lt(VOLVER[volver]||VOLVER['#inicio']);$('volver-txt').textContent=n;$('volver').setAttribute('aria-label',tr('Volver a ','Back to ')+n);}
  document.querySelector('.cab-top').classList.toggle('con-volver',!!volver);document.querySelector('.cab-top').classList.toggle('en-inicio',t==='Mosaicos'&&!volver);document.title=(t==='Mosaicos'?'':t.replace(/<[^>]+>/g,'')+' · ')+'Mosaicos';
  $('volver').hidden=!volver;if(volver)$('volver').href=volver;$('intro').hidden=!intro;$('intro').innerHTML=intro||'';$('ficha').hidden=true;}
// ---- Portada de cada alicatado (v2.7): el muro en color, el libro, el lugar, los pasos y las piezas
function ficha(p){const pal=Object.values(p.paletas)[0],w=2*p.W,h=w/3.2;
  const img=renderLazo(datos(p),{x0:p.W*0.25,y0:p.H*0.25,w,h,cols:pal.cols,over:{},ribbon:pal.ribbon,outline:pal.outline,rw:p.rw,ow:p.ow,interlace:p.tipo!=='mosaico'}).replace('width="100%"','width="100%" aria-hidden="true" focusable="false"').replace('xMidYMid meet','xMidYMid slice');
  const alh=p.coleccion==='alhambra',libro=alh?'<i>La Alhambra con regla y compás</i>':'<i>El Real Alcázar de Sevilla con regla y compás</i>';
  const ref=alh?tr(`alicatado n.º ${p.num}`,`tile pattern no. ${p.num}`):tr(`págs. ${p.pags}`,`pp. ${String(p.pags).replace(/ a /,'–')}`);
  const n=(p.pasos||[]).length,nB=(p.pasosB||[]).length,tipos=p.nombres.length;
  const pasos=p.id==='lazo8'?tr('Paso a paso','Step by step'):tr(`${n} pasos`,`${n} steps`)+(nB?tr(' · también con cuadrícula',' · also with a grid'):'');
  const fila=(ic,t)=>`<li>${icono(ic)}<span>${t}</span></li>`;
  $('ficha').innerHTML=`<div class="ficha-img">${img}</div><ul class="ficha-datos">`+fila('libro',`${libro} · ${ref}`)+fila('lugar',`${p.lugar}`)+fila('pasos',pasos)+fila('piezas',tr(`${tipos} tipos de pieza`,`${tipos} kinds of piece`))+'</ul>';
  $('ficha').hidden=false;}
function mostrar(v){['inicio','aprender','alicatados','mis'].forEach(n=>$('v-'+n).hidden=n!==v);
  const ali=v==='a',con=v==='c';$('barra-etapas').hidden=!ali;
  if(!ali&&!con)document.querySelectorAll('.tab').forEach(x=>x.classList.remove('show'));
  document.querySelector('footer #pie').hidden=!ali;}
// ---- Inicio
function inicio(){mostrar('inicio');cab('Mosaicos',tr('Lacería con regla y compás','Strapwork with ruler and compass'),null,'');
  const u=store.get(ULT,null);let html='';
  if(u){const m=u.match(/^a\/([\w-]+)\/(\w+)$/),c=u.match(/^c\/([\w-]+)$/);
    if(m&&PATS[m[1]]){const p=PATS[m[1]],e={trazado:tr('Trazar','Draw'),teselar:tr('Teselar','Tessellate'),colorear:tr('Colorear','Color'),imprimir:tr('Imprimir','Print')}[m[2]]||'';
      html=`${miniatura(p).replace('width="48" height="48"','width="44" height="44"')}<span><small>${tr('Seguir donde lo dejaste','Continue where you left off')}</small><b>${p.nombre} · ${e}</b></span>`;}
    else if(c){const k=CONS.L.find(x=>x.id===c[1]);if(k)html=`${mini(k)}<span><small>${tr('Seguir donde lo dejaste','Continue where you left off')}</small><b>${lt(k.nombre)}</b></span>`;}}
  $('seguir').hidden=!html;if(html){$('seguir').innerHTML=html;$('seguir').href='#'+u;}
  $('ic-aprender').innerHTML=`<svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true"><rect width="40" height="40" rx="8" fill="#1f5f5b"/><circle cx="20" cy="20" r="13" fill="none" stroke="#e2a93b" stroke-width="1.6" stroke-dasharray="2.4 1.6"/><rect x="10.8" y="10.8" width="18.4" height="18.4" fill="none" stroke="#fbf4e2" stroke-width="2.2"/><rect x="10.8" y="10.8" width="18.4" height="18.4" fill="none" stroke="#fbf4e2" stroke-width="2.2" transform="rotate(45 20 20)"/><circle cx="20" cy="20" r="1.8" fill="#e2a93b"/></svg>`;
  $('ic-mis').innerHTML=`<svg viewBox="0 0 2 2" width="40" height="40"><rect width="1" height="1" fill="#1f5f5b"/><rect x="1" width="1" height="1" fill="#c98b2b"/><rect y="1" width="1" height="1" fill="#2f4fa3"/><rect x="1" y="1" width="1" height="1" fill="#161616"/></svg>`;
  const banda=(p,x0,y0,w,h)=>{const pal=Object.values(p.paletas)[0];return renderLazo(datos(p),{x0,y0,w,h,cols:pal.cols,over:{},ribbon:pal.ribbon,outline:pal.outline,rw:p.rw,ow:p.ow,interlace:p.tipo!=='mosaico'}).replace('width="100%"','width="100%" aria-hidden="true" focusable="false"').replace('xMidYMid meet','xMidYMid slice');};
  if(!$('portada-img').firstChild)$('portada-img').innerHTML=banda(PATS.felipe,0,4,72,27);
  if(!$('im-alcazar').firstChild)$('im-alcazar').innerHTML=banda(PATS.zaguan2,0,2,24,9);
  if(!$('im-alhambra').firstChild&&PATS.barca)$('im-alhambra').innerHTML=banda(PATS.barca,0,0,24,9);
  const na=deCol('alcazar').length,nh=deCol('alhambra').length;
  $('n-alcazar').textContent=tr(`${na} alicatados`,`${na} tile patterns`);
  $('n-alhambra').textContent=tr(`${nh} ${nh===1?'alicatado':'alicatados'} · se irán añadiendo más`,`${nh} tile ${nh===1?'pattern':'patterns'} · more coming`);
  $('n-aprender').textContent=tr(`${CONS.L.length} construcciones`,`${CONS.L.length} constructions`);
  const n=misDibujos().length;$('n-mis').textContent=n?tr(`${n} ${n===1?'guardado':'guardados'}`,`${n} saved`):tr('Aún no hay ninguno','None yet');}
// ---- Aprender a trazar
function aprender(){mostrar('aprender');cab(tr('Aprender a trazar','Learn to draw'),tr('Construcciones básicas · págs. 164 a 175','Basic constructions · pp. 164–175'),'#inicio',tr('Las construcciones con regla y compás del libro: la base de todos los alicatados. Cada una empieza por la figura terminada.','The ruler-and-compass constructions from the book: the basis of every tile pattern. Each one starts with the finished figure.'));
  let html='';for(const [g,nom] of Object.entries(CONS.grupos)){const L=CONS.L.filter(c=>c.grupo===g);if(!L.length)continue;
    html+=`<h2 class="grupo-t">${lt(nom)}</h2><ul class="lista-c">`+L.map(c=>{const k=pasoGuardado(c),N=c.pasos.length;
      const est=k===N?`<small class="hecha">✓ ${tr('Hecha','Done')}</small>`:(k>0?`<small>${tr('Paso','Step')} ${k}/${N}</small>`:`<small>${tr('pág.','p.')} ${c.pags}</small>`);
      return `<li><a href="#c/${c.id}">${mini(c)}<span>${lt(c.nombre)}</span>${est}</a></li>`;}).join('')+'</ul>';}
  $('lista-cons').innerHTML=html;}
// ---- Construcción
function construccion(id){const c=CONS.L.find(x=>x.id===id);if(!c){location.hash='#aprender';return;}
  MODO.c=c;mostrar('c');cab(lt(c.nombre),tr('Aprender a trazar · pág. ','Learn to draw · p. ')+c.pags,'#aprender','');
  window.tabEtapa('trazado',true);window.trazadoCambio();store.set(ULT,'c/'+id);}
// ---- Alicatados
const deCol=col=>Object.values(PATS).filter(p=>(p.coleccion||'alcazar')===col);
function alicatados(col){col=col||'alcazar';mostrar('alicatados');const n=deCol(col).length;
  if(col==='alhambra')cab(tr('La Alhambra de Granada','The Alhambra of Granada'),tr(`${n} ${n===1?'alicatado':'alicatados'} por ahora`,`${n} tile ${n===1?'pattern':'patterns'} so far`),'#inicio',tr('Los alicatados de <i>La Alhambra con regla y compás</i>. Se irán añadiendo más.','The tile patterns from <i>La Alhambra con regla y compás</i> (“The Alhambra with ruler and compass”). More will be added.'));
  else cab(tr('Real Alcázar de Sevilla','Royal Alcázar of Seville'),tr(`${n} alicatados del libro`,`${n} tile patterns from the book`),'#inicio','');
  pintarGaleria(col);}
// ---- Alicatado en 4 etapas
function alicatado(id,etapa){if(!PATS[id]){location.hash='#alicatados';return;}if(!ETAPAS.includes(etapa))etapa='trazado';
  const antes=MODO.c;MODO.c=null;mostrar('a');
  if(PAT.id!==id)cambiarPatron(id);else if(antes||!$('dots').children.length)window.trazadoCambio();
  cab(PAT.nombre,`${PAT.lugar} · ${monu(PAT)}`,PAT.coleccion==='alhambra'?'#alhambra':'#alicatados',etapa==='trazado'?PAT.intro:''); // el texto largo, solo al empezar: en las demás etapas el dibujo queda más arriba
  document.querySelector('footer #pie').hidden=etapa!=='trazado';if(etapa==='trazado')ficha(PAT);
  window.tabEtapa(etapa,true);if(etapa==='colorear')draw();store.set(ULT,'a/'+id+'/'+etapa);}
// ---- Mis dibujos
function misDibujos(){const out=[];let E={};try{E=JSON.parse(localStorage.getItem('laceria-estado-v2')||'{}').p||{};}catch(e){}
  let PRr={};try{PRr=JSON.parse(localStorage.getItem('laceria-practica-v1')||'{}')||{};}catch(e){}
  for(const p of Object.values(PATS)){const col=!!E[p.id],rep=(PRr[p.id]||[]).length>0;if(col||rep)out.push({p,col,rep});}
  for(const c of CONS.L)if((PRr['c-'+c.id]||[]).length)out.push({c,rep:true});return out;}
function mis(){mostrar('mis');cab(tr('Mis dibujos','My drawings'),tr('Guardados en este dispositivo','Saved on this device'),'#inicio','');const L=misDibujos();
  let E={};try{E=JSON.parse(localStorage.getItem('laceria-estado-v2')||'{}').p||{};}catch(e){}
  $('lista-mis').innerHTML=L.length?'<ul class="lista-c">'+L.map(x=>{
    if(x.c)return `<li><a href="#c/${x.c.id}">${mini(x.c)}<span>${lt(x.c.nombre)}</span><small>${tr('Repasado a mano','Traced by hand')}</small></a></li>`;
    const g=E[x.p.id],d=datos(x.p),[a,b,w]=x.p.vistas.mod,pal=Object.values(x.p.paletas)[0];
    const sv=renderLazo(d,{x0:a,y0:b,w,h:w,cols:g&&g.cols||pal.cols,over:{},ribbon:g&&g.ribbon||pal.ribbon,outline:g&&g.outline||pal.outline,rw:g&&g.rw||x.p.rw,ow:x.p.ow,interlace:false}).replace('width="100%"','aria-hidden="true" focusable="false"');
    return `<li><a href="#a/${x.p.id}/${x.col?'colorear':'trazado'}">${sv}<span>${x.p.nombre}</span><small>${x.col?tr('Coloreado','Colored'):tr('Repasado a mano','Traced by hand')}</small></a></li>`;}).join('')+'</ul>'
    :`<p>${tr('Todavía no has coloreado ni repasado ningún dibujo. Empieza por un alicatado o por «Aprender a trazar».','You have not colored or traced anything yet. Start with a tile pattern or with “Learn to draw”.')}</p>`;}
// ---- Teselar
const TS={marcar:true,tc:'#1d4ed8',tg:'0.012',color:false,dibujar:false};
// Construye el teselado: c × r módulos. Devuelve el SVG, el texto del chip, la caja y la red de traslación (para repetir el dibujo a mano)
function tsConstruir(c,r,marcar,conColor,fondo){
  const mos=PAT.tipo==='mosaico',blanco=Array(PAT.nombres.length).fill('#ffffff'),k=PAT.W/24;
  let o=mos?{cols:blanco,over:{},ribbon:'#4a4a4a',outline:'#4a4a4a',rw:0.1*k,ow:0,wc:false,grid:false,construct:false}:{cols:blanco,over:{},ribbon:'#ffffff',outline:'#3a3a3a',ow:0.07,wc:false,grid:false,construct:false};
  if(conColor)o={cols:st.cols,over:st.over,ribbon:st.ribbon,outline:st.outline,ow:st.ow,wc:false,grid:false,construct:false,rwc:st.rw};
  const RW=v=>conColor?st.rw:v;
  const M=PAT.modulo;
  if(M&&M.tipo==='hex'&&TS.forma==='tri'){ // módulo mínimo del libro: triángulo entre tres estrellas; reflejado forma un rombo, que se repite
    const R=M.R,L=R*Math.sqrt(3),A=[L,0],B=[L/2,1.5*R],O=[M.cx,M.cy],pt=(i,j)=>[O[0]+i*A[0]+j*B[0],O[1]+i*A[1]+j*B[1]];
    const caja=[pt(0,0),pt(c,0),pt(c,r),pt(0,r)],xs=caja.map(p=>p[0]),ys=caja.map(p=>p[1]),x0=Math.min(...xs)-0.4,y0=Math.min(...ys)-0.4,w=Math.max(...xs)-x0+0.4,h=Math.max(...ys)-y0+0.4;
    datos(PAT);const key='t'+c+'x'+r;PAT.Dts=PAT.Dts||{};if(!PAT.Dts[key])PAT.Dts[key]=MOTOR.zona(PAT,PAT.prep,x0-2,y0-2,x0+w+2,y0+h+2);
    let sv=renderLazo(PAT.Dts[key],Object.assign({},o,{x0,y0,w,h,rw:RW(PAT.rw),interlace:true,clip:fondo?null:caja}));
    const P=a=>a.map(p=>p.map(v=>v.toFixed(3)).join(',')).join(' '),sw=w/250;
    if(marcar){let q=`<g fill="none" stroke="#e0a526" stroke-width="${sw}" stroke-dasharray="${sw*4} ${sw*3}">`;
      for(let i=0;i<c;i++)for(let j=0;j<r;j++)q+=`<polygon points="${P([pt(i,j),pt(i+1,j),pt(i+1,j+1),pt(i,j+1)])}"/><line x1="${pt(i+1,j)[0]}" y1="${pt(i+1,j)[1]}" x2="${pt(i,j+1)[0]}" y2="${pt(i,j+1)[1]}"/>`;
      q+=`</g><polygon points="${P([pt(0,0),pt(1,0),pt(0,1)])}" fill="#e0a526" fill-opacity="0.18" stroke="#e0a526" stroke-width="${sw*2.2}"/><polygon points="${P([pt(1,0),pt(1,1),pt(0,1)])}" fill="#2f4fa3" fill-opacity="0.12" stroke="#2f4fa3" stroke-width="${sw*1.8}"/>`;sv=sv.replace(/<\/svg>$/,q+'</svg>');}
    return {sv,vb:[x0,y0,w,h],red:{O,A,B,tam:L},chip:tr(`${c} × ${r} rombos · el triángulo y su reflejo, resaltados`,`${c} × ${r} rhombuses · the triangle and its reflection highlighted`)};}
  if(M&&M.tipo==='hex'){ // módulo hexagonal: filas desplazadas medio hexágono
    const R=M.R,a=R*Math.sqrt(3)/2,cen=[];for(let j=0;j<r;j++)for(let i=0;i<c;i++)cen.push([M.cx+i*2*a+(j%2)*a,M.cy+j*1.5*R]);
    const x0=M.cx-a-0.3,y0=M.cy-R-0.3,w=(2*c+(r>1?1:0))*a+0.6,h=(1.5*(r-1)+2)*R+0.6;
    datos(PAT);const key='h'+c+'x'+r;PAT.Dts=PAT.Dts||{};if(!PAT.Dts[key])PAT.Dts[key]=MOTOR.zona(PAT,PAT.prep,x0-2,y0-2,x0+w+2,y0+h+2);
    let sv=renderLazo(PAT.Dts[key],Object.assign({},o,{x0,y0,w,h,rw:RW(PAT.rw),interlace:true}));
    const hx=([x,y])=>Array.from({length:6},(_,i)=>{const t=(90+60*i)*Math.PI/180;return (x+R*Math.cos(t)).toFixed(3)+','+(y+R*Math.sin(t)).toFixed(3);}).join(' ');
    if(marcar){const sw=w/250;let q=`<g fill="none" stroke="#e0a526" stroke-width="${sw}" stroke-dasharray="${sw*4} ${sw*3}">`+cen.slice(1).map(p=>`<polygon points="${hx(p)}"/>`).join('')+'</g>';
      q+=`<polygon points="${hx(cen[0])}" fill="#e0a526" fill-opacity="0.12" stroke="#e0a526" stroke-width="${sw*2.2}"/>`;sv=sv.replace(/<\/svg>$/,q+'</svg>');}
    return {sv,vb:[x0,y0,w,h],red:{O:[M.cx,M.cy],A:[2*a,0],B:[a,1.5*R],tam:2*a},chip:tr(`${c} × ${r} módulos hexagonales · el primero, resaltado`,`${c} × ${r} hexagonal modules · the first one highlighted`)};}
  if(M){ // módulo mínimo distinto del bloque de color (o girado en el muro): se teselan módulos de lado m
    const m=M.m,w=c*m,h=r*m,g=(M.giro||0)*Math.PI/180,dx=c%2?0:m/2,dy=r%2?0:m/2;
    const P=[M.cx+dx*Math.cos(-g)-dy*Math.sin(-g),M.cy+dx*Math.sin(-g)+dy*Math.cos(-g)],x0=P[0]-w/2,y0=P[1]-h/2,R=Math.hypot(w,h)/2+2;
    datos(PAT);const key=[c,r].join('x');PAT.Dts=PAT.Dts||{};if(!PAT.Dts[key])PAT.Dts[key]=MOTOR.zona(PAT,PAT.prep,P[0]-R,P[1]-R,P[0]+R,P[1]+R);
    let sv=renderLazo(PAT.Dts[key],Object.assign({},o,{x0,y0,w,h,rw:mos?(conColor?st.rw:o.rw):RW(PAT.rw),interlace:!mos,giro:M.giro?[M.giro,P[0],P[1]]:null}));
    if(marcar){const sw=w/250;let q=`<g fill="none" stroke="#e0a526" stroke-width="${sw}" stroke-dasharray="${sw*4} ${sw*3}">`;
      for(let i=1;i<c;i++)q+=`<line x1="${x0+i*m}" y1="${y0}" x2="${x0+i*m}" y2="${y0+h}"/>`;for(let j=1;j<r;j++)q+=`<line x1="${x0}" y1="${y0+j*m}" x2="${x0+w}" y2="${y0+j*m}"/>`;
      q+=`</g><rect x="${x0}" y="${y0}" width="${m}" height="${m}" fill="#e0a526" fill-opacity="0.12" stroke="#e0a526" stroke-width="${sw*2.2}"/>`;sv=sv.replace(/<\/svg>$/,q+'</svg>');}
    return {sv,vb:[x0,y0,w,h],red:{O:[x0,y0],A:[m,0],B:[0,m],tam:m},chip:tr(`${c} × ${r} módulos · el primero, resaltado`,`${c} × ${r} modules · the first one highlighted`)+(M.nota?tr(...M.nota):M.giro?tr(' · derecho, como en el libro',' · upright, as in the book'):'')};}
  if(conColor)o.rw=st.rw;
  let sv=svgColor(c,r,'100%','100%',o).replace(/ width="100%" height="100%"/,' width="100%"');
  if(marcar){const W=PAT.W,H=PAT.H,w=c*W,h=r*H,sw=w/250;let g=`<g fill="none" stroke="#e0a526" stroke-width="${sw}" stroke-dasharray="${sw*4} ${sw*3}">`;
    for(let i=1;i<c;i++)g+=`<line x1="${i*W}" y1="0" x2="${i*W}" y2="${h}"/>`;for(let j=1;j<r;j++)g+=`<line x1="0" y1="${j*H}" x2="${w}" y2="${j*H}"/>`;
    g+=`</g><rect x="0" y="0" width="${W}" height="${H}" fill="#e0a526" fill-opacity="0.12" stroke="#e0a526" stroke-width="${sw*2.2}"/>`;sv=sv.replace(/<\/svg>$/,g+'</svg>');}
  return {sv,vb:[0,0,c*PAT.W,r*PAT.H],red:{O:[0,0],A:[PAT.W,0],B:[0,PAT.H],tam:PAT.W},chip:tr(`${c} × ${r} módulos · el primero, resaltado`,`${c} × ${r} modules · the first one highlighted`)};}
// ---- Tesela: lo que dibujas en el primer módulo se repite en todos
const TES_KEY='laceria-tesela-v1';let TES={};try{TES=JSON.parse(localStorage.getItem(TES_KEY)||'{}')||{};}catch(e){TES={};}
const tesK=()=>PAT.id+(PAT.modulo&&PAT.modulo.tipo==='hex'&&TS.forma==='tri'?'-tri':'');
const tesTrazos=()=>TES[tesK()]||(TES[tesK()]=[]);
const tesGuardar=()=>{try{localStorage.setItem(TES_KEY,JSON.stringify(TES))}catch(e){}};
function tesCapa(red,vb){const T=tesTrazos();if(!T.length&&!TS.actual)return '';const {O,A,B,tam}=red;
  const lista=TS.actual?T.concat([TS.actual]):T,camino=lista.map(t=>`<path d="M${t.p.map(q=>(q[0]*tam).toFixed(3)+' '+(q[1]*tam).toFixed(3)).join('L')}" stroke="${t.c}" stroke-width="${(t.w*tam).toFixed(3)}"/>`).join('');
  // orígenes de la red que tocan la vista
  const [x0,y0,w,h]=vb,det=A[0]*B[1]-A[1]*B[0],ij=(x,y)=>[((x-O[0])*B[1]-(y-O[1])*B[0])/det,(A[0]*(y-O[1])-A[1]*(x-O[0]))/det];
  const esq=[[x0,y0],[x0+w,y0],[x0,y0+h],[x0+w,y0+h]].map(p=>ij(...p)),is=esq.map(e=>e[0]),js=esq.map(e=>e[1]);let g='';
  for(let i=Math.floor(Math.min(...is))-2;i<=Math.ceil(Math.max(...is))+1;i++)for(let j=Math.floor(Math.min(...js))-2;j<=Math.ceil(Math.max(...js))+1;j++)
    g+=`<g transform="translate(${(O[0]+i*A[0]+j*B[0]).toFixed(3)} ${(O[1]+i*A[1]+j*B[1]).toFixed(3)})">${camino}</g>`;
  return `<g id="ts-capa" fill="none" stroke-linecap="round" stroke-linejoin="round" pointer-events="none">${g}</g>`;}
{const alto=()=>{const b=document.getElementById('barra-etapas');if(b&&!b.hidden)document.documentElement.style.setProperty('--alto-tabs',b.offsetHeight+'px');};addEventListener('resize',alto);addEventListener('hashchange',()=>setTimeout(alto,50));setTimeout(alto,300);}
// ---- En papel (v2.8): medidas del módulo y de la figura de partida para dibujar el teselado a mano
// Figura de partida de cada alicatado, en unidades del libro: [texto, texto en inglés, medida]. La primera es la principal.
const BASE={lazo8:[['Lado de cada cuadro de la cuadrícula','Side of each grid square',1]],
  zaguan:[['Lado de cada cuadro (el ancho de la cinta)','Side of each square (the strap width)',1]],
  toledanos:[['Lado de cada triángulo de la red','Side of each triangle in the grid',1]],
  cenador6:[['Lado de cada triángulo de la red','Side of each triangle in the grid',1]],
  munecas17:[['Lado del cuadrado de 3 × 3','Side of the 3 × 3 square',3],['Lado de cada cuadro','Side of each square',1]],
  cubos:[['Lado de cada cuadro','Side of each square',1]],
  alargadas:[['Radio de las circunferencias (el lado de un cuadro)','Radius of the circles (the side of a square)',1]],
  alfardones:[['Lado de cada cuadro de la cuadrícula','Side of each grid square',1]],
  octogonos:[['Lado de cada cuadro','Side of each square',1],['Radio de la circunferencia inscrita','Radius of the inscribed circle',0.5]],
  zaguan2:[['Lado del cuadrado de 8 × 8','Side of the 8 × 8 square',8],['Lado de cada cuadro','Side of each square',1],['Radio de las circunferencias (2 cuadros)','Radius of the circles (2 squares)',2]],
  felipe:[['Radio de la circunferencia inicial','Radius of the starting circle',Math.SQRT2],['Lado del cuadrado inscrito','Side of the inscribed square',2]],
  barca:[['Lado del cuadrado de 8 × 8','Side of the 8 × 8 square',8],['Radio de la circunferencia (un cuadro)','Radius of the circle (one square)',1]],
  arrayanes:[['Radio de la circunferencia inicial','Radius of the starting circle',1]],
  taca:[['Lado del cuadrado inicial','Side of the starting square',2],['Radio de la circunferencia inscrita','Radius of the inscribed circle',1]]};
const PAPEL={A5:[148,210],A4:[210,297],A3:[297,420]},PPK='laceria-papel-v1';
const PP=Object.assign({p:'A4',w:210,h:297,ori:null,m:15},store.get(PPK,{}));
const mm=v=>(Math.round(v*10)/10).toLocaleString(EN?'en':'es',{minimumFractionDigits:1,maximumFractionDigits:1})+' mm';
function pintarPapel(R){const det=$('ts-papel');if(!det||!det.open)return;
  document.querySelectorAll('#pp-papel [data-pp]').forEach(b=>{const on=b.dataset.pp===PP.p;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});
  $('pp-medidas').hidden=PP.p!=='med';if(PP.p==='med'){if(document.activeElement!==$('pp-w'))$('pp-w').value=PP.w;if(document.activeElement!==$('pp-h'))$('pp-h').value=PP.h;}
  if(document.activeElement!==$('pp-m'))$('pp-m').value=PP.m;
  const a=+PP.w||0,b=+PP.h||0; // medidas a mano (solo «A medida»)
  const [vx,vy,vw,vh]=R.vb,m=Math.max(0,+PP.m||0);
  // orientación: la que elijas; si no, la que deja el dibujo más grande
  const esc=(W,H)=>Math.min((W-2*m)/vw,(H-2*m)/vh);
  let ori=PP.ori;if(!ori){const p0=PP.p==='med'?[a,b]:[Math.min(a,b),Math.max(a,b)];ori=esc(p0[1],p0[0])>esc(p0[0],p0[1])?'h':'v';}
  let PW,PH;if(PP.p==='med'){PW=a;PH=b;if(ori==='h'&&PW<PH||ori==='v'&&PW>PH)[PW,PH]=[PH,PW];}else{const [x,y]=PAPEL[PP.p];[PW,PH]=ori==='h'?[y,x]:[x,y];}
  document.querySelectorAll('#pp-ori [data-ori]').forEach(b=>{const on=b.dataset.ori===ori;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});
  const k=esc(PW,PH);
  if(!(PW>0&&PH>0)||!(k>0)){$('pp-vista').innerHTML='';$('pp-res').innerHTML=`<dt>${tr('No cabe','It does not fit')}</dt><dd>${tr('Con ese margen no queda sitio para el dibujo. Prueba un margen menor o un papel más grande.','With that margin there is no room for the drawing. Try a smaller margin or a larger sheet.')}</dd>`;return;}
  const dw=vw*k,dh=vh*k,x0=(PW-dw)/2,y0=(PH-dh)/2,M=PAT.modulo,kl=PAT.k||1;
  // dibujo a escala dentro del papel
  const fs=Math.max(PW,PH)/22,sw=Math.max(PW,PH)/400;
  const dib=R.sv.replace(/<svg([^>]*?)\swidth="[^"]*"/,'<svg$1').replace('<svg ',`<svg x="${x0}" y="${y0}" width="${dw}" height="${dh}" preserveAspectRatio="xMidYMid meet" `);
  const cota=(x1,y1,x2,y2,t,dx,dy)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#1d4ed8" stroke-width="${sw}" marker-start="url(#pp-fl)" marker-end="url(#pp-fl)"/><text x="${(x1+x2)/2+dx}" y="${(y1+y2)/2+dy}" font-size="${fs}" text-anchor="middle" fill="#1d4ed8" font-family="Inter,sans-serif" paint-order="stroke" stroke="#fff" stroke-width="${fs/4}">${t}</text>`;
  $('pp-vista').innerHTML=`<svg viewBox="${-fs} ${-fs} ${PW+2*fs} ${PH+2*fs}" width="100%" aria-hidden="true" focusable="false"><defs><marker id="pp-fl" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#1d4ed8"/></marker></defs>`+
    `<rect x="0" y="0" width="${PW}" height="${PH}" fill="#fff" stroke="#8a8172" stroke-width="${sw*1.5}"/>`+
    `<rect x="${m}" y="${m}" width="${PW-2*m}" height="${PH-2*m}" fill="none" stroke="#8a8172" stroke-width="${sw}" stroke-dasharray="${sw*6} ${sw*4}"/>`+dib+
    `<rect x="${x0}" y="${y0}" width="${dw}" height="${dh}" fill="none" stroke="#1d4ed8" stroke-width="${sw}"/>`+
    (y0>fs*1.6?cota(x0,y0-fs*0.6,x0+dw,y0-fs*0.6,mm(dw),0,-fs*0.35):'')+
    (x0>fs*1.6?`<g transform="rotate(-90 ${x0-fs*0.6} ${y0+dh/2})">${cota(x0-fs*0.6-dh/2,y0+dh/2,x0-fs*0.6+dh/2,y0+dh/2,mm(dh),0,-fs*0.35)}</g>`:'')+
    (y0+dh<PH-fs*1.6?cota(PW/2,y0+dh,PW/2,PH,mm(PH-y0-dh),fs*2.6,fs*0.35):'')+
    `</svg>`;
  $('pp-vista').setAttribute('aria-label',tr(`Papel de ${mm(PW)} × ${mm(PH)} con el dibujo de ${mm(dw)} × ${mm(dh)} en el centro`,`A ${mm(PW)} × ${mm(PH)} sheet with the ${mm(dw)} × ${mm(dh)} drawing in the middle`));
  const hex=M&&M.tipo==='hex',tam=R.red.tam*k;
  const base=(BASE[PAT.id]||[]).map(([t,te,v],i)=>`<dt${i?'':' class="pp-main"'}>${tr(t,te)}</dt><dd${i?'':' class="pp-main"'}>${mm(v*kl*k)}</dd>`).join('');
  const modTxt=hex&&TS.forma!=='tri'?tr(`${mm(M.R*k)} de lado (hexágono)`,`${mm(M.R*k)} per side (hexagon)`):tr(`${mm(tam)} de lado`,`${mm(tam)} per side`);
  $('pp-res').innerHTML=base+`<dt>${tr('Cada módulo','Each module')}</dt><dd>${modTxt}</dd>`+
    `<dt>${tr('Dibujo entero','Whole drawing')}</dt><dd>${mm(dw).replace(' mm','')} × ${mm(dh)} · ${EX.c} × ${EX.r} ${tr('módulos','modules')}</dd>`+
    `<dt>${tr('Márgenes','Margins')}</dt><dd>${tr('izquierda y derecha','left and right')} ${mm(x0)} · ${tr('arriba y abajo','top and bottom')} ${mm(y0)}</dd>`+
    `<dt>${tr('Papel','Paper')}</dt><dd>${PP.p==='med'?tr('a medida','custom'):PP.p} · ${ori==='h'?tr('horizontal','landscape'):tr('vertical','portrait')} · ${mm(PW).replace(' mm','')} × ${mm(PH)}</dd>`;}
{const gp=()=>store.set(PPK,PP);
  $('pp-papel').addEventListener('click',e=>{const b=e.target.closest('[data-pp]');if(!b)return;PP.p=b.dataset.pp;if(PP.p==='med'&&!PP.wSet){const [x,y]=PAPEL.A4;PP.w=x;PP.h=y;PP.wSet=1;}gp();window.pintarTeselar();});
  $('pp-ori').addEventListener('click',e=>{const b=e.target.closest('[data-ori]');if(!b)return;PP.ori=b.dataset.ori;gp();window.pintarTeselar();});
  for(const [id,k] of [['pp-w','w'],['pp-h','h'],['pp-m','m']])$(id).addEventListener('input',e=>{const v=parseFloat(String(e.target.value).replace(',','.'));if(!(v>=0))return;PP[k]=v;gp();window.pintarTeselar();});
  $('ts-papel').addEventListener('toggle',()=>{if($('ts-papel').open)window.pintarTeselar();});}
window.pintarTeselar=function(){$('ts-c').textContent=EX.c;$('ts-r').textContent=EX.r;
  const M=PAT.modulo;$('ts-forma').hidden=!(M&&M.tipo==='hex');
  if(M&&M.tipo==='hex')document.querySelectorAll('#ts-forma [data-forma]').forEach(b=>{const on=b.dataset.forma===(TS.forma||'hex');b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});
  const R=tsConstruir(EX.c,EX.r,TS.marcar,TS.color);TS.red=R.red;TS.vb=R.vb;
  $('tssvg').innerHTML=R.sv.replace(/<\/svg>\s*$/,tesCapa(R.red,R.vb)+'</svg>');$('ts-chip').textContent=R.chip;
  $('tssvg').classList.toggle('dibujando',!!TS.dibujar);
  document.querySelectorAll('#ts-herr [data-tc]').forEach(b=>{const on=b.dataset.tc===TS.tc;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});
  document.querySelectorAll('#ts-herr [data-tg]').forEach(b=>{const on=b.dataset.tg===String(TS.tg);b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});
  $('ts-undo').disabled=!tesTrazos().length;pintarPapel(R);};

document.querySelector('#tab-teselar .ex-rep').addEventListener('click',e=>{const b=e.target.closest('[data-ts]');if(!b)return;const k=b.dataset.ts;EX[k]=Math.max(1,Math.min(10,EX[k]+ +b.dataset.d));exGuardar();pintarTeselar();});
$('ts-marcar').addEventListener('change',e=>{TS.marcar=e.target.checked;pintarTeselar();});
// Dibujar en la tesela
{const tz=$('tssvg');let pid=null;
  const punto=e=>{const sv=tz.querySelector('svg'),m=sv.getScreenCTM().inverse(),q=new DOMPoint(e.clientX,e.clientY).matrixTransform(m),{O,tam}=TS.red;return [+((q.x-O[0])/tam).toFixed(4),+((q.y-O[1])/tam).toFixed(4)];};
  const capa=()=>{const g=tz.querySelector('#ts-capa'),h=tesCapa(TS.red,TS.vb);if(g)g.outerHTML=h||'<g id="ts-capa"></g>';else tz.querySelector('svg').insertAdjacentHTML('beforeend',h);};
  tz.addEventListener('pointerdown',e=>{if(!TS.dibujar||pid!==null)return;pid=e.pointerId;tz.setPointerCapture(pid);TS.actual={c:TS.tc,w:+TS.tg,p:[punto(e)]};e.preventDefault();});
  tz.addEventListener('pointermove',e=>{if(e.pointerId!==pid||!TS.actual)return;const q=punto(e),u=TS.actual.p[TS.actual.p.length-1];if(Math.hypot(q[0]-u[0],q[1]-u[1])<0.004)return;TS.actual.p.push(q);capa();});
  const fin=e=>{if(e.pointerId!==pid)return;pid=null;if(TS.actual&&TS.actual.p.length>1){tesTrazos().push(TS.actual);tesGuardar();}TS.actual=null;pintarTeselar();};
  tz.addEventListener('pointerup',fin);tz.addEventListener('pointercancel',fin);}
$('ts-tesela').addEventListener('toggle',e=>{if(!e.target.open&&TS.dibujar)$('ts-dib').click();});
$('ts-dib').onclick=()=>{TS.dibujar=!TS.dibujar;$('ts-dib').setAttribute('aria-pressed',TS.dibujar);$('ts-dib').classList.toggle('on',TS.dibujar);
  $('ts-msg').textContent=TS.dibujar?tr('Dibuja con el dedo, el lápiz o el ratón sobre el dibujo.','Draw with your finger, a stylus or the mouse on the drawing.'):'';pintarTeselar();};
$('ts-undo').onclick=()=>{tesTrazos().pop();tesGuardar();pintarTeselar();};
$('ts-borrar').onclick=()=>{if(!tesTrazos().length)return;if(!confirm(tr('¿Borrar todo lo que has dibujado en esta tesela?','Clear everything you drew on this tile?')))return;TES[tesK()]=[];tesGuardar();pintarTeselar();};
$('ts-herr').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.tc)TS.tc=b.dataset.tc;if(b.dataset.tg)TS.tg=b.dataset.tg;pintarTeselar();b.focus();});
$('ts-color').addEventListener('change',e=>{TS.color=e.target.checked;pintarTeselar();});
$('ts-fondo').onclick=async()=>{const Wp=1170,Hp=2532;let c=Math.min(EX.c,3),r=1,R;
  for(;r<40;r++){R=tsConstruir(c,r,false,TS.color,true);if(R.vb[3]/R.vb[2]>=Hp/Wp)break;}
  let sv=R.sv.replace(/<\/svg>\s*$/,tesCapa(R.red,R.vb)+'</svg>').replace(/width="100%"( height="100%")?/,`width="${Wp}" height="${Hp}"`).replace('xMidYMid meet','xMidYMid slice');
  if(!/preserveAspectRatio/.test(sv.slice(0,400)))sv=sv.replace('<svg ','<svg preserveAspectRatio="xMidYMid slice" ');
  try{const img=await cargarImg(sv),cv=document.createElement('canvas');cv.width=Wp;cv.height=Hp;const x=cv.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,Wp,Hp);x.drawImage(img,0,0,Wp,Hp);
    const blob=await new Promise(ok=>cv.toBlob(ok,'image/png'));$('ts-msg').textContent=await entregar(blob,`mosaicos-${PAT.id}-fondo.png`);}
  catch(err){$('ts-msg').textContent=tr('No se ha podido crear la imagen.','Could not create the image.');}};
$('ts-forma').addEventListener('click',e=>{const b=e.target.closest('[data-forma]');if(!b)return;TS.forma=b.dataset.forma;pintarTeselar();b.focus();});
$('ts-ant').onclick=()=>window.tabEtapa('trazado');$('ts-sig').onclick=()=>window.tabEtapa('colorear');
// ---- Imprimir
window.pintarImprimir=function(){$('imp-info').textContent=tr(`Se imprime el dibujo de ${EX.c} × ${EX.r} módulos que elegiste en Teselar, con tus colores de Colorear. Podrás cambiarlo en la ventana siguiente.`,`It prints the ${EX.c} × ${EX.r} module drawing you chose in Tessellate, with your colors from Color. You can change it in the next window.`);};
document.querySelector('#tab-imprimir .caminos').addEventListener('click',e=>{const b=e.target.closest('[data-imp]');if(!b)return;EX.modo=b.dataset.imp;exGuardar();exPintar();window.abrirDlg('dlg-exportar');});
$('imp-ant').onclick=()=>window.tabEtapa('colorear');
// ---- Glosario
function pintarGlosario(f){const q=(f||'').trim().toLowerCase();$('glo-lista').innerHTML=GLOSARIO.filter(g=>!q||(g[0]+g[1]+g[2]+g[3]).toLowerCase().includes(q)).sort((x,y)=>q?((y[0]+y[1]).toLowerCase().includes(q))-((x[0]+x[1]).toLowerCase().includes(q)):0).map(g=>`<dt>${EN?g[1]:g[0]}</dt><dd>${EN?g[3]:g[2]}${EN&&g[1]!==g[0]?`<small>${tr('','Spanish: ')}${g[0]}</small>`:''}</dd>`).join('')||`<dd>${tr('No hay ningún término con esa búsqueda.','No term matches that search.')}</dd>`;}
const abrirGlo=()=>{pintarGlosario($('glo-buscar').value);window.abrirDlg('dlg-glosario');};
$('btn-glosario').onclick=abrirGlo;$('glo-aprender').onclick=abrirGlo;
if(EN)$('glo-buscar').placeholder='Search…';
$('glo-buscar').addEventListener('input',e=>pintarGlosario(e.target.value));
['glo-x','glo-cerrar'].forEach(id=>$(id).onclick=()=>window.cerrarDlg('dlg-glosario'));
// ---- Rutas
function ruta(){let h=decodeURIComponent(location.hash.slice(1));
  const q=new URLSearchParams(location.search).get('patron');
  if(!h&&q&&PATS[q]){location.replace('#a/'+q+'/trazado');return;}
  if(h==='trazado'||h==='colorear'){location.replace('#a/'+PAT.id+'/'+h);return;}
  if(!h||h==='inicio')return inicio();
  if(h==='aprender')return aprender();if(h==='alicatados')return alicatados('alcazar');if(h==='alhambra')return alicatados('alhambra');if(h==='mis')return mis();
  let m=h.match(/^c\/([\w-]+)$/);if(m)return construccion(m[1]);
  m=h.match(/^a\/([\w-]+)(?:\/(\w+))?$/);if(m)return alicatado(m[1],m[2]||'trazado');
  inicio();}
addEventListener('hashchange',()=>{document.querySelectorAll('.dlg:not([hidden])').forEach(d=>window.cerrarDlg&&window.cerrarDlg(d.id));ruta();scrollTo(0,0);});
ruta();
})();

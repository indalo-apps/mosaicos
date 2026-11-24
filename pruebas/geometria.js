// Prueba de geometría: comprueba que cada alicatado sigue las medidas del libro y que se repite bien.
// Uso: node pruebas/geometria.js   (no necesita navegador; sale con error si algo falla)
//
// Para cada alicatado comprueba:
//  · que todas las piezas tienen un tipo con nombre y cada paleta tiene un color por tipo;
//  · que el dibujo se repite exactamente al desplazarlo un periodo (columna y fila);
//  · que el módulo mínimo (Teselar y Colorear) es de verdad una tesela: desplazar el dibujo
//    por sus lados deja todo igual, y desplazarlo medio lado no (si no, el módulo sería demasiado grande);
//  · que todos los pasos del trazado se dibujan;
//  · y las medidas concretas que da el libro (tabla LIBRO, abajo).
const fs=require('fs'),path=require('path'),vm=require('vm');
const js=f=>fs.readFileSync(path.join(__dirname,'..','src','js',f),'utf8');
const ctx={console,Math};vm.createContext(ctx);
for(const f of ['lazo.js','lazo8-dibujo.js','motor.js','patrones.js'])vm.runInContext(js(f),ctx,{filename:f});
const {PATRONES,MOTOR,renderLazo}=vm.runInContext('({PATRONES,MOTOR,renderLazo})',ctx);

let fallos=0,oks=0;
const ok=(c,msg)=>{if(c)oks++;else{fallos++;console.log('  ✗ '+msg);}};
const cerca=(a,b,tol=1e-3)=>Math.abs(a-b)<=tol;
const rad=d=>d*Math.PI/180,s2=Math.SQRT2,s3=Math.sqrt(3);

// ---------- Utilidades: piezas de una zona como «huella» (centro, número de lados, área) ----------
const area=Q=>{let A=0;for(let i=0;i<Q.length;i++){const a=Q[i],b=Q[(i+1)%Q.length];A+=a[0]*b[1]-b[0]*a[1];}return Math.abs(A)/2;};
const centro=Q=>[Q.reduce((s,p)=>s+p[0],0)/Q.length,Q.reduce((s,p)=>s+p[1],0)/Q.length];
function piezas(p,prep,n=3){const L=[];for(let i=-n;i<=n;i++)for(let j=-n;j<=n;j++)for(const [k,P] of prep.piezas){
  const Q=P.map(v=>[v[0]+i*p.W,v[1]+j*p.H]);L.push({k,Q,c:centro(Q),n:Q.length,a:area(Q)});}return L;}
// índice espacial sencillo para buscar una pieza por su centro
function indice(L,celda=1){const M=new Map(),key=(x,y)=>Math.round(x/celda)+','+Math.round(y/celda);
  for(const q of L){const k=key(q.c[0],q.c[1]);(M.get(k)||M.set(k,[]).get(k)).push(q);}
  return (x,y)=>{const out=[];const cx=Math.round(x/celda),cy=Math.round(y/celda);
    for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(const q of M.get((cx+a)+','+(cy+b))||[])if(cerca(q.c[0],x,1e-3*celda*10)&&cerca(q.c[1],y,1e-3*celda*10))out.push(q);return out;};}
// ¿Mover las piezas centrales con la transformación T deja una pieza igual en su sitio?
function invariante(L,busca,T,zona){let malas=0,total=0;
  for(const q of L){if(!zona(q.c))continue;total++;const d=T(q.c[0],q.c[1]);
    if(!busca(d[0],d[1]).some(r=>r.n===q.n&&cerca(r.a,q.a,1e-3*Math.max(1,q.a))))malas++;}
  return {malas,total};}

// ---------- Medidas del libro ----------
// Lo que dice cada libro, escrito aparte de las fórmulas de la app: si un cambio en el código las altera, la prueba falla.
const LIBRO={
  felipe:{pasos:9,pasosB:9,
    // Módulo: el cuadrado inscrito en la circunferencia de radio √2 (lado 2 del libro)
    modulo:2,
    // Paso 8: la línea interior de la cinta pasa por los puntos medios del cuadrado inicial
    extra(p){const k=p.k,G=p.G;
      ok(cerca(G.R,s2),'Felipe: la circunferencia inicial tiene radio √2');
      // el borde interior de la cinta del rombo |x|+|y|=q está en |x|+|y| = q − (rw/2)·√2/k y debe pasar por (0,1)
      ok(cerca(G.q-(p.rw/2)*s2/k,1,2e-4),'Felipe: el borde interior de la cinta pasa por el punto medio (0,1) del cuadrado');
      ok(cerca(G.q,G.s*s2),'Felipe: el rombo y el cuadrado del marco salen de la misma circunferencia');
      // cada recta de las estrellas está girada 22,5° sobre los ejes
      ok(cerca(G.dA,Math.hypot(1,s2-1)*Math.cos(rad(67.5))),'Felipe: distancia de los octógonos estrellados');},
    // la rueda tiene simetría de 8 dentro de su marco; el muro entero, de 4
    simetria:{centro:p=>[p.k,p.k],estrella:8,giros:[[8,p=>p.G.s*p.k*0.98],[4,p=>p.W*0.45]]}},
  barca:{pasos:11,modulo:8,
    extra(p){const S=Math.SQRT1_2,A=2*(1+S);
      // Paso 8: la cinta mide 2B, con B = A/10 y A la distancia entre las rectas x = ±(1+√2/2) del paso 4
      ok(cerca(p.rw,2*(A/10)*p.k,1e-3),'Barca: la cinta mide 2·A/10');
      ok(p.modulo.giro===-45,'Barca: el módulo está girado 45° en el muro');},
    // la estrella de ocho es simétrica de 8; lo que la rodea (piezas en Y), de 4
    simetria:{centro:()=>[0,0],estrella:8,giros:[[4,p=>p.W*0.45]]}},
  arrayanes:{pasos:8,
    extra(p){const L=p.modBase();
      ok(L.length===24,'Arrayanes: 12 rectas, cada una en dos tramos (24 segmentos)');
      // 12 rectas a √3/4 del centro: los lados de dos estrellas de seis inscritas en el hexágono de radio 1
      for(const s of L){const [x1,y1,x2,y2]=s,dx=x2-x1,dy=y2-y1,d=Math.abs(x1*dy-y1*dx)/Math.hypot(dx,dy);
        ok(cerca(d,s3/4,1e-6),'Arrayanes: cada recta está a √3/4 del centro');
        // cada tramo empieza en el vértice entrante de la estrella, a r = 1/2, y acaba en el hexágono (r ≤ 1)
        const r=[Math.hypot(x1,y1),Math.hypot(x2,y2)].sort((a,b)=>a-b);
        ok(cerca(r[0],0.5,1e-6),'Arrayanes: el tramo empieza a r = 1/2 (vértice entrante)');
        ok(r[1]<=1+1e-9,'Arrayanes: el tramo acaba dentro del hexágono');}
      ok(cerca(p.modulo.R,p.k),'Arrayanes: el módulo es el hexágono de radio 1 del libro');},
    // la estrella de doce tiene simetría de 12 dentro del hexágono; el muro entero, de 6
    simetria:{centro:()=>[0,0],estrella:12,giros:[[12,p=>0.8*p.k],[6,p=>p.W*0.9]]}},
  taca:{pasos:8,
    extra(p){const {a1,d2,d3,c}=p.Gt,L=p.modBase(),ok8=[d3,a1];
      ok(cerca(d2,1-a1)&&cerca(d3,d2*Math.tan(Math.PI/8)),'Taca: el segundo octógono estrellado sale del octógono central del primero');
      // paso 5: todas las líneas del módulo son paralelas a los ejes o a las diagonales, a d3 (paso 4) o a 1/√2 (paso 2) del centro
      for(const [x1,y1,x2,y2] of L){const dx=x2-x1,dy=y2-y1,d=Math.abs(x1*dy-y1*dx)/Math.hypot(dx,dy),ang=(Math.atan2(dy,dx)*180/Math.PI+360)%45;
        ok(cerca(ang,0,1e-6)||cerca(ang,45,1e-6),'Taca: cada trazo es paralelo a un eje o a una diagonal');
        ok(ok8.some(v=>cerca(d,v,1e-9)),'Taca: cada trazo está en una recta del paso 2 o del paso 4');
        ok(Math.max(Math.abs(x1),Math.abs(y1),Math.abs(x2),Math.abs(y2))<=1+1e-9,'Taca: el módulo no se sale del cuadrado');}
      // las cuatro partes son iguales, giradas 90° alrededor del centro
      const clave=t=>{const a=[t[0],t[1]].map(v=>v.toFixed(6)).join(','),b=[t[2],t[3]].map(v=>v.toFixed(6)).join(',');return a<b?a+'|'+b:b+'|'+a;};
      const S=new Set(L.map(clave));ok(L.every(t=>S.has(clave([-t[1],t[0],-t[3],t[2]]))),'Taca: el módulo es igual girado 90°');
      ok(!L.every(t=>S.has(clave([-t[0],t[1],-t[2],t[3]]))),'Taca: el módulo no es simétrico por sí solo (la simetría se aplica en el paso 6)');
      ok(cerca(p.modulo.m,2*Math.SQRT2*p.k),'Taca: el módulo mínimo para teselar es el cuadrado girado 45° de lado 2√2');},
    simetria:{centro:p=>[p.k,p.k],giros:[[4,p=>0.95*p.k]]}},
  zaguan2:{pasos:7,modulo:8},
  zaguan:{pasos:4},toledanos:{pasos:4},cenador6:{pasos:4},munecas17:{pasos:5},
  cubos:{pasos:4},alargadas:{pasos:5},alfardones:{pasos:5},octogonos:{pasos:4},
};

// ---------- Pruebas ----------
for(const [id,p] of Object.entries(PATRONES.P)){
  const antes=fallos;console.log(`${id} · ${p.nombre}`);
  const prep=MOTOR.preparar(p),L=piezas(p,prep),busca=indice(L,p.W/12);
  ok(prep.piezas.length>0,'tiene piezas');
  const tipos=p.nombres.length;
  ok(prep.piezas.every(([k])=>Number.isInteger(k)&&k>=0&&k<tipos),'cada pieza tiene un tipo con nombre');
  for(const [n,pal] of Object.entries(p.paletas))ok(pal.cols.length===tipos,`la paleta «${n}» tiene un color por tipo`);
  // se repite al desplazarlo un periodo
  const dentro=c=>c[0]>=0&&c[0]<p.W&&c[1]>=0&&c[1]<p.H;
  for(const [dx,dy] of [[p.W,0],[0,p.H],[p.W,p.H]]){const r=invariante(L,busca,(x,y)=>[x+dx,y+dy],dentro);ok(r.total>0&&r.malas===0,`se repite al mover (${dx.toFixed(1)}, ${dy.toFixed(1)}): ${r.malas} de ${r.total} piezas no casan`);}
  // módulo mínimo
  const M=p.modulo;let vec=null;
  if(M&&M.tipo==='hex'){const a=s3*M.R;vec=[[a,0],[a/2,1.5*M.R]];}
  else if(M){const g=rad(M.giro||0);vec=[[M.m*Math.cos(g),M.m*Math.sin(g)],[-M.m*Math.sin(g),M.m*Math.cos(g)]];}
  if(vec){for(const [vx,vy] of vec){
      const r=invariante(L,busca,(x,y)=>[x+vx,y+vy],dentro);ok(r.total>0&&r.malas===0,`el módulo mínimo es una tesela (lado ${Math.hypot(vx,vy).toFixed(2)}): ${r.malas} de ${r.total} no casan`);
      const h=invariante(L,busca,(x,y)=>[x+vx/2,y+vy/2],dentro);ok(h.malas>0,'el módulo no es más grande de lo necesario (medio lado no es tesela)');}
    if(LIBRO[id]&&LIBRO[id].modulo&&M.m)ok(cerca(M.m/p.k,LIBRO[id].modulo),`el módulo mide ${LIBRO[id].modulo} unidades del libro`);}
  // simetría de giro alrededor del centro de la rueda o estrella
  const S=LIBRO[id]&&LIBRO[id].simetria;
  if(S){const [cx,cy]=S.centro(p);
    for(const [orden,radio] of S.giros){const R=radio(p),ang=rad(360/orden),cerca0=c=>Math.hypot(c[0]-cx,c[1]-cy)<R;
      const r=invariante(L,busca,(x,y)=>{const dx=x-cx,dy=y-cy;return[cx+dx*Math.cos(ang)-dy*Math.sin(ang),cy+dx*Math.sin(ang)+dy*Math.cos(ang)];},cerca0);
      ok(r.total>=orden&&r.malas===0,`simetría de ${orden} alrededor del centro: ${r.malas} de ${r.total} piezas no casan`);}
    // la estrella central, vértice a vértice
    if(S.estrella){const q=L.find(q=>cerca(q.c[0],cx,1e-3)&&cerca(q.c[1],cy,1e-3)),ang=rad(360/S.estrella);
      ok(!!q,'hay una estrella en el centro');
      if(q){const gira=([x,y])=>{const dx=x-cx,dy=y-cy;return[cx+dx*Math.cos(ang)-dy*Math.sin(ang),cy+dx*Math.sin(ang)+dy*Math.cos(ang)];};
        ok(q.Q.every(v=>{const w=gira(v);return q.Q.some(u=>cerca(u[0],w[0])&&cerca(u[1],w[1]));}),`la estrella central es simétrica de ${S.estrella} (${q.n} vértices)`);}}}
  // pasos (como la app: el dibujo de 4 × 3 periodos se calcula antes)
  p.prep=prep;{const mx=p.W*0.1,my=p.H*0.1;p.D=MOTOR.zona(p,prep,-mx,-my,4*p.W+mx,3*p.H+my);}
  const lib=LIBRO[id]||{};
  for(const [nombre,lista,esperado] of [['pasos',p.pasos,lib.pasos],['pasosB',p.pasosB,lib.pasosB]]){
    if(!lista){ok(!esperado,`tiene ${nombre}`);continue;}
    if(esperado!=null)ok(lista.length===esperado,`${nombre}: ${lista.length} pasos (el libro tiene ${esperado})`);
    lista.forEach((s,i)=>{let svg='';try{svg=PATRONES.dibujarPaso(p,i+1,renderLazo,lista);}catch(e){svg='';ok(false,`${nombre} ${i+1}: ${e.message}`);}
      ok(typeof svg==='string'&&svg.includes('<svg'),`${nombre} ${i+1} se dibuja`);ok(!!(s.t||s.texto||s.titulo),`${nombre} ${i+1} tiene texto`);});}
  if(lib.extra)lib.extra(p);
  if(fallos===antes)console.log('  ✓ todo bien');
}
console.log(`\n${oks} comprobaciones bien, ${fallos} mal`);
process.exit(fallos?1:0);

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
  reyes29:{pasos:11,
    extra(p){const {h,r0,tE,tV,tR,tP}=p.Gz,s3=Math.sqrt(3);
      ok(cerca(r0,s3/4/Math.SQRT1_2,1e-9),'N.º 29: los cruces más alejados de los cuatro triángulos están a (√3/4)/cos 45° del centro');
      ok(cerca(h,r0*Math.cos(5*Math.PI/12),1e-9),'N.º 29: la estrella de doce une los puntos de cinco en cinco (sus lados, a r0·cos 75°)');
      ok(cerca(tE,1-h/s3,1e-9),'N.º 29: las calles de los zafates escotados llegan al lado del hexágono del paso 2');
      // paso 7: el hexágono que une los extremos tiene los lados a √3/2 − h; la muesca toca sus lados
      const a7=s3/2-h;ok(cerca(0.5*(-h)+s3/2*tE,a7,1e-9)&&cerca(s3/2*tV,a7,1e-9),'N.º 29: la muesca (paso 9) está en los lados del hexágono del paso 7');
      ok(cerca(tP,s3/2,1e-9)&&cerca(tR+h*Math.tan(Math.PI/6),tP,1e-9),'N.º 29: la punta del zafate redondo está en el hexágono del paso 8');
      ok(cerca(p.modulo.R,p.k),'N.º 29: el módulo es el hexágono del paso 2, de radio 1');
      // paso 9: «con este método de trazado se da que AB = BC y DE = EF» (pág. 148). Lado sg de un zafate en la dirección f (grados)
      const g=(q,f)=>{const c=Math.cos(rad(f)),n=Math.sin(rad(f));return[q[0]*c-q[1]*n,q[0]*n+q[1]*c];},
        lado=(f,sg)=>[g([0,sg*h],f),g([1,0],f)],
        corte=([p1,d1],[p2,d2])=>{const t=((p2[0]-p1[0])*d2[1]-(p2[1]-p1[1])*d2[0])/(d1[0]*d2[1]-d1[1]*d2[0]);return[p1[0]+t*d1[0],p1[1]+t*d1[1]];},
        dist=(u,v)=>Math.hypot(u[0]-v[0],u[1]-v[1]);
      const A=g([tE,-h],150),B=corte(lado(150,-1),lado(120,1)),C=corte(lado(120,1),lado(180,-1));
      const D=g([tP,0],120),E=g([tR,-h],120),F=corte(lado(120,-1),lado(90,1));
      ok(cerca(dist(A,B),dist(B,C),1e-9),`N.º 29: AB = BC, como dice el paso 9 (${dist(A,B).toFixed(4)} y ${dist(B,C).toFixed(4)})`);
      ok(cerca(dist(D,E),dist(E,F),1e-9),`N.º 29: DE = EF, como dice el paso 9 (${dist(D,E).toFixed(4)} y ${dist(E,F).toFixed(4)})`);
      // los seis puntos son vértices del dibujo: están en sus trazos
      const L=p.modBase(),enTrazo=q=>L.some(([x1,y1,x2,y2])=>{const dx=x2-x1,dy=y2-y1,t=((q[0]-x1)*dx+(q[1]-y1)*dy)/(dx*dx+dy*dy);return t>-1e-9&&t<1+1e-9&&Math.hypot(x1+t*dx-q[0],y1+t*dy-q[1])<1e-9;});
      ok([A,B,C,D,E,F].every(enTrazo),'N.º 29: A, B, C, D, E y F están en los trazos del módulo');},
    simetria:{centro:p=>[Math.sqrt(3)/2*p.k,1.5*p.k],estrella:12,giros:[[6,p=>0.9*p.k]]}},
  reyes28:{pasos:8,modulo:4,
    extra(p){const {a,e,t,ri}=p.Gr;
      ok(cerca(e,2-Math.SQRT2)&&cerca(t,1-Math.SQRT1_2),'N.º 28: E (prolongación del octógono) a 2 − √2 del eje; T (arco y diagonal) a 1 − 1/√2');
      // el lado del octógono (de (1,0) a (a,a)) prolongado corta el lado del cuadrado y = 1 en x = e
      const xE=1+(a-1)*(1/a);ok(cerca(xE,e,1e-9),'N.º 28: la prolongación del lado del octógono llega a (2 − √2, 1)');
      // el arco de radio 1 con centro en el vértice (1,1) corta la diagonal en T
      ok(cerca(Math.hypot(1-t,1-t),1,1e-9),'N.º 28: T está en el arco de radio 1 con centro en el vértice');
      // la recta E–T llega al eje x = 0 en y = −(√2 − 1): la punta de la estrella de ocho, a la misma distancia que T
      const yE=1+(0-e)*((t-1)/(t-e));ok(cerca(yE,-(Math.SQRT2-1),1e-9)&&cerca(Math.hypot(t,t),Math.SQRT2-1,1e-9),'N.º 28: las puntas de las estrellas están a √2 − 1 del centro (en ejes y diagonales)');
      // y corta el eje y = 0 en x = 3 − 2√2: los vértices entrantes de la estrella de cuatro
      const xC=e+(0-1)*((t-e)/(t-1));ok(cerca(xC,3-2*Math.SQRT2,1e-9)&&cerca(ri,3-2*Math.SQRT2,1e-9),'N.º 28: vértices entrantes de las estrellas a 3 − 2√2 del centro');
      const A=p.modBase('A'),B=p.modBase('B');ok(A.length===8+8+16&&B.length===8+8+8,'N.º 28: octógono, 8 rectas E–T y la estrella (16 lados en A, 8 en B)');},
    simetria:{centro:p=>[p.k,p.k],estrella:8,giros:[[4,p=>1.2*p.k]]}},
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
  jambas31:{pasos:13,modulo:2,
    extra(p){const {r1,AB,CD,EF,w}=p.Gj,s2=Math.SQRT2;
      // paso 1: los lados de los dos cuadrados se cortan en (√2/2, 1 − √2/2): los centros de las ruedas de ocho
      ok(cerca(r1,Math.hypot(1/s2,1-1/s2),1e-12),'N.º 31: los centros de las ruedas de ocho están donde se cortan los dos cuadrados del paso 1');
      // paso 5: A = (−½, ½), B = (0, √2/2); C es el centro y E el centro de una rueda
      ok(cerca(AB,Math.hypot(0.5,1/s2-0.5),1e-12),'N.º 31: AB va de (−½, ½) a (0, √2/2)');
      ok(cerca(CD,Math.hypot(0.5,0.5)-AB,1e-12)&&cerca(CD,0.1659,1e-4),'N.º 31: la circunferencia CD es tangente a la de A (CD ≈ 0,166)');
      ok(cerca(EF,AB-Math.hypot(1/s2-0.5,(1-1/s2)-0.5),1e-12)&&cerca(EF,0.2483,1e-4),'N.º 31: la circunferencia EF es tangente a la de A (EF ≈ 0,248)');
      // todas las rectas del dibujo: lados de las estrellas {16/6} y {8/3} (radio CD), de los octógonos (radio EF) y de la estrella del paso 12
      const R=[],pol=(c,n,r,a0)=>Array.from({length:n},(_,i)=>{const g=rad(a0+360*i/n);return[c[0]+r*Math.cos(g),c[1]+r*Math.sin(g)];});
      const lados=(V,m)=>V.forEach((v,i)=>{const q=V[(i+m)%V.length],dx=q[0]-v[0],dy=q[1]-v[1],L=Math.hypot(dx,dy);R.push([-dy/L,dx/L,(-dy*v[0]+dx*v[1])/L]);});
      for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++){if((i+j)%2)continue;lados(pol([i,j],16,CD,0),6);
        for(let m=0;m<8;m++){const g=rad(22.5+45*m),c=[i+r1*Math.cos(g),j+r1*Math.sin(g)];lados(pol(c,8,CD,0),3);lados(pol(c,8,EF,22.5),1);}}
      // paso 12: la estrella del lado (dos cuadrados de lado w) y la recta que cierra cada brazo de la X, a 2r − w/2 de su centro
      const r=w/2*s2;for(const c of [[1,0],[0,1],[-1,0],[0,-1]]){lados(pol(c,4,r,0),1);lados(pol(c,4,r,45),1);lados(pol(c,4,(2*r-w/2)*s2,45),1);}
      const enRecta=(x,y,X,Y)=>R.some(([a,b,d])=>Math.abs(a*x+b*y-d)<1e-9&&Math.abs(a*X+b*Y-d)<1e-9);
      ok(p.TR.every(([x,y,X,Y])=>enRecta(x,y,X,Y)),'N.º 31: cada trazo está en una recta de los pasos 7, 8, 9 o 12');
      ok(cerca(w,2*CD*Math.cos(3*Math.PI/8),1e-12),'N.º 31: el ancho de los zafates es el de la estrella {16/6} y el lado de los cuadrados del paso 12');},
    simetria:{centro:p=>[p.k,p.k],estrella:16,giros:[[4,p=>1.9*p.k]]}},
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

// ---------- Piezas y colores (v2.9.2) ----------
// Cada tipo de pieza tiene que ser de verdad lo que dice su nombre, y su color en la primera paleta, el que dice el libro.
//  · todas las piezas de un tipo son iguales (mismo número de lados, de vértices entrantes y misma área);
//  · «estrella de N» o «sino» (estrella de ocho): N vértices entrantes y al menos 2N lados; «cruz»: 4 entrantes;
//    triángulo, cuadrado, rombo, rectángulo, trapecio, pentágono, hexágono y octógono: polígonos convexos de 3, 4, 5, 6 u 8 lados;
//  · si el nombre dice un color (negro, verde, melado, azul, blanco), la primera paleta lo pinta de ese color;
//  · y los colores que da el libro para las piezas cuyo nombre no lo dice (tabla COLORES).
const COLORES={
  jambas31:[[/^Estrella de dieciséis|^Sino/,'azul'],[/^Candilejo|^Almendrilla/,'blanco']],
  reyes28:[[/^Almendrilla/,'blanco']],
  reyes29:[[/^Sino/,'negro'],[/^Hexágono|^Almendrilla|^Pieza blanca/,'blanco']],
  taca:[[/^Sino/,'azul'],[/^Cruz|^Estrella de cuatro|^Pieza pequeña/,'blanco'],[/^Zafate/,['verde','melado','negro']]],
  barca:[[/^Alfardón/,'verde'],[/^Pieza en Y/,'negro']],
  felipe:[[/^Flecha/,'negro']],
  zaguan:[[/^Cinta/,'blanco']],
  toledanos:[[/^Triángulo/,'blanco']],
  cenador6:[[/^Rombo|^Alfardón/,'blanco']],
  munecas17:[[/^Rectángulo/,'negro'],[/^Trapecio/,'blanco'],[/^Cuadrado/,'verde']],
  alfardones:[[/^Estrella/,'blanco']],
  octogonos:[[/^Estrella/,'blanco']],
  zaguan2:[[/^Estrella de seis|^Pieza pequeña|^Pieza en V/,'azul'],[/^Pieza grande/,'negro']]};
const familia=h=>{const n=parseInt(h.slice(1),16),r=(n>>16&255)/255,g=(n>>8&255)/255,b=(n&255)/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,d=mx-mn;
  let hh=0;if(d){hh=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;hh*=60;if(hh<0)hh+=360;}const s=d?d/(1-Math.abs(2*l-1)):0;
  if(l<0.18)return 'negro';if(l>0.84||s<0.15&&l>0.6)return 'blanco';if(s<0.12)return l<0.45?'negro':'blanco';
  if(hh>=190&&hh<270)return 'azul';if(hh>=120&&hh<190)return 'verde';return 'melado';};
const PALABRA=[[/\bnegr[oa]s?\b|oscur/i,'negro'],[/\bverdes?\b/i,'verde'],[/\bmelad[oa]s?\b/i,'melado'],[/\bazul(es)?\b/i,'azul'],[/\bblanc[oa]s?\b/i,'blanco']];
const NUM={cuatro:4,seis:6,ocho:8,doce:12};
const areaS=Q=>{let S=0;for(let i=0;i<Q.length;i++){const p=Q[i],q=Q[(i+1)%Q.length];S+=p[0]*q[1]-q[0]*p[1];}return S/2;};
const entrantes=Q=>{const s=Math.sign(areaS(Q));let r=0;for(let i=0;i<Q.length;i++){const a=Q[(i+Q.length-1)%Q.length],b=Q[i],c=Q[(i+1)%Q.length],cr=(b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]);if(Math.sign(cr)===-s&&Math.abs(cr)>1e-9)r++;}return r;};
console.log('\nPiezas y colores');
for(const [id,p] of Object.entries(PATRONES.P)){const antes=fallos,prep=MOTOR.preparar(p),pal=Object.values(p.paletas)[0];
  const T=p.nombres.map(()=>[]);for(const [k,Q] of prep.piezas)T[k].push({n:Q.length,r:entrantes(Q),a:Math.abs(areaS(Q))});
  p.nombres.forEach((nom,k)=>{const L=T[k],q=L[0];
    ok(L.length>0,`${id}: hay piezas de «${nom}»`);if(!q)return;
    ok(L.every(x=>x.n===q.n&&x.r===q.r&&cerca(x.a,q.a,0.01*q.a)),`${id}: todas las piezas de «${nom}» son iguales`);
    const m=nom.match(/estrella de (cuatro|seis|ocho|doce)/i),N=m?NUM[m[1].toLowerCase()]:/^sino/i.test(nom)?8:0;
    if(N)ok(q.r===N&&q.n>=2*N,`${id}: «${nom}» es una estrella de ${N} puntas (tiene ${q.r} vértices entrantes y ${q.n} lados)`);
    if(/^cruz/i.test(nom))ok(q.r===4,`${id}: «${nom}» es una cruz (4 vértices entrantes; tiene ${q.r})`);
    for(const [re,lados] of [[/^triángulo/i,3],[/^(cuadrad|rombo|rectángulo|trapecio)/i,4],[/^pentágono|\(pentágono\)/i,5],[/^hexágono|\(hexágono/i,6],[/^octógono/i,8]])
      if(re.test(nom))ok(q.n===lados&&q.r===0,`${id}: «${nom}» es un polígono convexo de ${lados} lados (tiene ${q.n} lados y ${q.r} entrantes)`);
    const fam=familia(pal.cols[k]);
    for(const [re,f] of PALABRA)if(re.test(nom))ok(fam===f,`${id}: «${nom}» va de ${f} en la primera paleta (va de ${fam}, ${pal.cols[k]})`);
    for(const [re,f] of COLORES[id]||[])if(re.test(nom)){const F=[].concat(f);ok(F.includes(fam),`${id}: según el libro, «${nom}» va de ${F.join(' o ')} (va de ${fam})`);}});
  if(fallos===antes)console.log(`  ✓ ${id}`);}
console.log(`\n${oks} comprobaciones bien, ${fallos} mal`);
process.exit(fallos?1:0);

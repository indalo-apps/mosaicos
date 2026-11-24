// ---------- Patrones nuevos (v1.3) ----------
// Cada patrón: periodo W × H (se escala para que W = 24), líneas de un periodo, tipos de pieza,
// paletas y pasos del trazado (redactados para la app).
const PATRONES=(function(){
const s3=Math.sqrt(3),s2=Math.SQRT2,rad=d=>d*Math.PI/180;
const mod=(a,n)=>((a%n)+n)%n;
// recta infinita (punto p, dirección d) recortada a una caja
function recta(p,d,[x0,y0,x1,y1]){let t0=-1e9,t1=1e9;
  for(const [pp,dd,lo,hi] of [[p[0],d[0],x0,x1],[p[1],d[1],y0,y1]]){
    if(Math.abs(dd)<1e-12){if(pp<lo-1e-9||pp>hi+1e-9)return null;continue;}
    let a=(lo-pp)/dd,b=(hi-pp)/dd;if(a>b)[a,b]=[b,a];t0=Math.max(t0,a);t1=Math.min(t1,b);}
  if(t1-t0<1e-9)return null;return[p[0]+d[0]*t0,p[1]+d[1]*t0,p[0]+d[0]*t1,p[1]+d[1]*t1];}
const contorno=P=>P.map((p,i)=>[p[0],p[1],P[(i+1)%P.length][0],P[(i+1)%P.length][1]]);
const poligono=(cx,cy,n,r,a0)=>{const P=[];for(let k=0;k<n;k++){const a=rad(a0+360*k/n);P.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}return P;};
function escalar(p){const k=24/p.W,base=p.lineas,cl=p.clase;
  return Object.assign(p,{k,W0:p.W,H0:p.H,W:24,H:p.H*k,rw:p.tipo==='mosaico'?0.12:0.62,ow:p.tipo==='mosaico'?0:0.07,lineas:()=>base.call(p).map(s=>s.map(v=>v*k)),
    clase:cl?(Q,c,i,f)=>cl.call(p,Q,[c[0]/k,c[1]/k],i,f):null});}
// Red de triángulos equiláteros (lado u) con un lado horizontal, para las guías del trazado
function redTriangulos(box,u){const L=[];
  const [x0,y0,x1,y1]=box,h=u*s3/2;
  for(let j=Math.floor(y0/h)-1;j<=Math.ceil(y1/h)+1;j++){const s=recta([0,j*h],[1,0],box);if(s)L.push(s);}
  for(const a of [60,120]){const d=[Math.cos(rad(a)),Math.sin(rad(a))];
    for(let i=Math.floor((x0-(y1-y0))/u)-2;i<=Math.ceil((x1+(y1-y0))/u)+2;i++){const s=recta([i*u,0],d,box);if(s)L.push(s);}}
  return L;}
const P={};

// ===== Zaguán: cuadrados y cintas (págs. 29-31) =====
// Cuadrícula girada 45°. En cada dirección se repite: una calle de 1 (la cinta) y un hueco de 2 (el cuadrado).
P.zaguan=escalar({id:'zaguan',nombre:'Cuadrados y cintas',lugar:'Zaguán',pags:'29 a 31',tipo:'mosaico',
  W:6*s2,H:12*s2,
  lineas(){const L=[],box=[-0.5,-0.5,6*s2+0.5,12*s2+0.5];
    for(let n=-12;n<=24;n++)for(const c of [3*n,3*n+1]){const k=c*s2/2;
      // u = (x+y)/√2 = c  →  x+y = c√2 ;  v = (x−y)/√2 = c  →  x−y = c√2
      for(const s of [recta([c*s2,0],[1,-1],box),recta([c*s2,0],[1,1],box)])if(s)L.push(s);}
    return L;},
  clase(Pz,[x,y]){const u=(x+y)/s2,v=(x-y)/s2,a=Math.abs(MOTOR.area(Pz))/(this.k*this.k);
    if(Math.abs(a-2)<0.2)return 6;                       // cinta
    const p=Math.floor(u/3),q=Math.floor(v/3);
    const fila=(u-v)/3;                                   // filas horizontales de cuadrados
    if(a<1.5){const f=mod(Math.round(fila),8);return f===0?3:f===4?5:4;}
    const r=mod(p-q,8),s=mod(p+q,4);
    if(r===0)return 0;if(r===1||r===7)return s===1||s===3?(mod(p,2)?0:1):1;
    if(r===4)return 2;if(r===3||r===5)return s===1||s===3?(mod(p,2)?2:1):1;
    return 1;},
  nombres:['Cuadrado negro','Cuadrado verde','Cuadrado melado','Cuadradito negro','Cuadradito verde','Cuadradito melado','Cinta (rectángulo)'],
  paletas:{
    'Alcázar':{cols:['#171615','#2a5c62','#b8772f','#171615','#2a5c62','#b8772f','#f6f3ec'],ribbon:'#ffffff',outline:'#ffffff'},
    'Azul y blanco':{cols:['#1e3a78','#3d63a8','#9ab6dc','#1e3a78','#3d63a8','#9ab6dc','#ffffff'],ribbon:'#ffffff',outline:'#ffffff'},
    'Terracota':{cols:['#7a3b26','#b8694d','#e8b49a','#7a3b26','#b8694d','#e8b49a','#fbf4ec'],ribbon:'#fbf4ec',outline:'#fbf4ec'},
    'Para colorear':{cols:Array(7).fill('#ffffff'),ribbon:'#222222',outline:'#222222'}}
});

// ===== Salas de Toledanos y Sevillanos: hexágonos y triángulos (págs. 75-77) =====
// Hexágonos de lado 1 que se tocan por los vértices; entre cada tres queda un triángulo.
P.toledanos=escalar({id:'toledanos',nombre:'Hexágonos y triángulos',lugar:'Salas de Toledanos y Sevillanos',pags:'75 a 77',tipo:'mosaico',
  W:6*s3,H:6,
  centros(){const C=[];for(let i=-6;i<=12;i++)for(let j=-6;j<=12;j++){const x=j*s3,y=2*i+j;C.push([x,y,i,j]);}return C;},
  lineas(){const L=[];for(const [x,y] of this.centros())if(x>-3&&x<6*s3+3&&y>-3&&y<9)L.push(...contorno(poligono(x,y,6,1,30)));return L;},
  clase(Pz,[x,y]){if(Pz.length===3)return 3;
    // centro del hexágono en la red (j: columnas, i: a lo largo de la vertical)
    const j=Math.round(x/s3),i=Math.round((y-j)/2),a=mod(i,3),b=mod(j,3);
    if(a===1&&b===1)return 2;              // melado, en el centro del rombo
    if((a===0&&b===0)||(a===2&&b===2))return 1; // verdes, en los ángulos agudos
    return 0;},
  nombres:['Hexágono negro','Hexágono verde','Hexágono melado','Triángulo'],
  paletas:{
    'Alcázar':{cols:['#191817','#2b5d5c','#b8772f','#dcd9d2'],ribbon:'#ffffff',outline:'#ffffff'},
    'Cobalto':{cols:['#1d2a55','#2f4fa3','#c98b2b','#f2efe8'],ribbon:'#ffffff',outline:'#ffffff'},
    'Verde y oro':{cols:['#0f3b36','#2f7a6d','#d4a83c','#f8f3e6'],ribbon:'#ffffff',outline:'#ffffff'},
    'Para colorear':{cols:Array(4).fill('#ffffff'),ribbon:'#222222',outline:'#222222'}}
});

// ===== Cenador de Carlos V: estrellas de seis (págs. 145-146) =====
// Estrellas de doce triángulos (un hexágono y seis puntas) que se tocan punta con punta.
P.cenador6=escalar({id:'cenador6',nombre:'Estrellas de seis',lugar:'Cenador de Carlos V',pags:'145 y 146',tipo:'mosaico',
  W:12,H:4*s3,
  estrella(cx,cy){const Q=[];for(let k=0;k<12;k++){const a=rad(-90+30*k),r=k%2?1:s3;Q.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}return Q;},
  lineas(){const L=[];for(let i=-1;i<=5;i++)for(let j=-1;j<=3;j++)L.push(...contorno(this.estrella(3*i,2*s3*j)));return L;},
  clase(Pz,[x,y]){if(Pz.length===4)return 4;if(Pz.length===6)return 5;
    const i=Math.round(x/3),j=Math.round(y/(2*s3));return mod(i+2*j,4);},
  nombres:['Estrella negra','Estrella melada','Estrella verde','Estrella azul','Rombo','Alfardón (hexágono alargado)'],
  paletas:{
    'Alcázar':{cols:['#171615','#b8772f','#2d6a51','#2c55a8','#f6f3ec','#f6f3ec'],ribbon:'#ffffff',outline:'#ffffff'},
    'Dos azules':{cols:['#1d2a55','#3d63a8','#1d2a55','#3d63a8','#ffffff','#ffffff'],ribbon:'#ffffff',outline:'#ffffff'},
    'Terracota':{cols:['#7a3b26','#b8694d','#d98e6e','#e8b49a','#fbf4ec','#fbf4ec'],ribbon:'#fbf4ec',outline:'#fbf4ec'},
    'Para colorear':{cols:Array(6).fill('#ffffff'),ribbon:'#222222',outline:'#222222'}}
});

// ===== Patio de las Muñecas: octógonos y cuadrados (págs. 123-125) =====
// Cuadrado de 3 × 3 con un octógono de lados desiguales partido en tres franjas; se repite girándolo 90°.
P.munecas17=escalar({id:'munecas17',nombre:'Octógonos y cuadrados',lugar:'Patio de las Muñecas',pags:'123 a 125',tipo:'mosaico',
  W:6,H:6,
  baldosa(x,y,vertical){const O=[[1,0],[2,0],[3,1],[3,2],[2,3],[1,3],[0,2],[0,1]].map(([a,b])=>[x+a,y+b]),L=contorno(O);
    for(const t of [1,2])L.push(vertical?[x+t,y,x+t,y+3]:[x,y+t,x+3,y+t]);return L;},
  lineas(){return[...this.baldosa(0,0,false),...this.baldosa(3,0,true),...this.baldosa(0,3,true),...this.baldosa(3,3,false)];},
  clase(Pz,c,i,f){const per=parseFloat(f.split('|')[2])/this.k;return per>7.5?0:per>6.2?1:2;},
  nombres:['Rectángulo de la franja central','Trapecio','Cuadrado entre octógonos'],
  paletas:{
    'Alcázar':{cols:['#151515','#f6f3ec','#2b5d5c'],ribbon:'#ffffff',outline:'#ffffff'},
    'Cobalto':{cols:['#1d2a55','#f2efe8','#3d63a8'],ribbon:'#ffffff',outline:'#ffffff'},
    'Melado':{cols:['#7a3b26','#fbf4ec','#c98b2b'],ribbon:'#ffffff',outline:'#ffffff'},
    'Para colorear':{cols:Array(3).fill('#ffffff'),ribbon:'#222222',outline:'#222222'}}
});


// ===== Cenador de Carlos V: cubos (págs. 143-144) =====
// Cuadrícula con sus diagonales: un cuadro de cada tres (en diagonal) queda entero y es la cara de delante del cubo.
P.cubos=escalar({id:'cubos',nombre:'Cubos',lugar:'Cenador de Carlos V',pags:'143 y 144',tipo:'mosaico',
  W:9,H:9,
  lineas(){const L=[];
    for(let i=-1;i<=10;i++)for(let j=-1;j<=10;j++){const s=mod(i+j,3);
      if(s!==1){L.push([i,j,i,j+1],[i,j,i+1,j]);} // lados izquierdo y de arriba (no van en los cuadros «1»)
      if(s!==2)L.push([i,j,i+1,j+1]);}               // diagonal descendente
    return L;},
  clase(Pz,[x,y]){const xs=Pz.map(p=>p[0]/this.k),ys=Pz.map(p=>p[1]/this.k),w=Math.max(...xs)-Math.min(...xs),h=Math.max(...ys)-Math.min(...ys);
    if(w>1.5)return 3;if(h>1.5)return 4;return mod(Math.round((Math.floor(x)+Math.floor(y)-2)/3),3);},
  nombres:['Cuadrado verde','Cuadrado melado','Cuadrado negro','Cara de arriba (blanca)','Cara del lado (azul)'],
  paletas:{
    'Alcázar':{cols:['#2d6a51','#b8772f','#171615','#f6f3ec','#2c55a8'],ribbon:'#ffffff',outline:'#ffffff'},
    'Grises':{cols:['#555555','#555555','#555555','#e8e8e8','#9a9a9a'],ribbon:'#ffffff',outline:'#ffffff'},
    'Terracota':{cols:['#7a3b26','#d98e6e','#3a2a20','#fbf4ec','#b8694d'],ribbon:'#ffffff',outline:'#ffffff'},
    'Para colorear':{cols:Array(5).fill('#ffffff'),ribbon:'#222222',outline:'#222222'}}
});

// ===== Cenador de Carlos V: estrellas de ocho alargadas (págs. 147-149) =====
// Circunferencias de radio 1 en una red de 2 × 2. Las piezas salen de prolongar lados de las estrellas de ocho inscritas.
const S8=Math.SQRT1_2,E8=2-S8,D8=1-S8;
const ALARG=[[-E8,-S8],[-D8,-S8],[0,-1],[D8,-S8],[E8,-S8],[E8,-D8],[1,0],[E8,D8],[E8,S8],[D8,S8],[0,1],[-D8,S8],[-E8,S8],[-E8,D8],[-1,0],[-E8,-D8]];
P.alargadas=escalar({id:'alargadas',nombre:'Estrellas de ocho alargadas',lugar:'Cenador de Carlos V',pags:'147 a 149',tipo:'mosaico',
  W:8,H:4,
  lineas(){const L=[];
    for(let a=-1;a<=5;a++)for(let b=-1;b<=3;b++){const cx=2*a,cy=2*b,hz=mod(a+b,2)===0;
      L.push(...contorno(ALARG.map(([x,y])=>hz?[cx+x,cy+y]:[cx+y,cy+x])));
      const qx=cx+1,qy=cy+1;L.push(...contorno([[qx-D8,qy-D8],[qx+D8,qy-D8],[qx+D8,qy+D8],[qx-D8,qy+D8]]),[qx-D8,qy-D8,qx+D8,qy+D8],[qx+D8,qy-D8,qx-D8,qy+D8]);}
    return L;},
  clase(Pz,[x,y]){if(Pz.length===3){const qx=Math.floor(x/2)*2+1,qy=Math.floor(y/2)*2+1;return Math.abs(y-qy)>Math.abs(x-qx)?4:5;}
    const a=Math.round(x/2),b=Math.round(y/2);if(mod(a+b,2))return 3;
    return mod(b,2)?2:(mod(a,4)===0?0:1);},
  nombres:['Estrella alargada azul','Estrella alargada negra','Estrella alargada melada','Estrella alargada blanca (de pie)','Triángulo oscuro','Triángulo claro'],
  paletas:{
    'Alcázar':{cols:['#2c4f9e','#171615','#8a4a22','#ebe6dc','#1d1d1d','#ebe6dc'],ribbon:'#ffffff',outline:'#ffffff'},
    'Verde y oro':{cols:['#0f3b36','#2f7a6d','#d4a83c','#f8f3e6','#0f3b36','#f8f3e6'],ribbon:'#ffffff',outline:'#ffffff'},
    'Cobalto':{cols:['#1d2a55','#3d63a8','#1d2a55','#f2efe8','#1d2a55','#f2efe8'],ribbon:'#ffffff',outline:'#ffffff'},
    'Para colorear':{cols:Array(6).fill('#ffffff'),ribbon:'#222222',outline:'#222222'}}
});

// ===== Patio de las Muñecas: estrellas de cuatro y alfardones (págs. 138-141) =====
// Alfardones (hexágonos alargados) tumbados y de pie, como un tejido; entre ellos quedan las estrellas de cuatro.
P.alfardones=escalar({id:'alfardones',nombre:'Estrellas de cuatro y alfardones',lugar:'Patio de las Muñecas',pags:'138 a 141',tipo:'mosaico',
  W:24,H:24,
  alf(cx,cy,hz){const A=[[-8.5,0],[-5,-3.5],[5,-3.5],[8.5,0],[5,3.5],[-5,3.5]];return A.map(([x,y])=>hz?[cx+x,cy+y]:[cx+y,cy+x]);},
  lineas(){const L=[];for(let a=-1;a<=3;a++)for(let b=-1;b<=3;b++)L.push(...contorno(this.alf(12*a,12*b,mod(a+b,2)===0)));return L;},
  clase(Pz,[x,y]){if(Pz.length!==6)return 2;const a=Math.round(x/12),b=Math.round(y/12);return mod(a+b,2)?1:0;},
  nombres:['Alfardón tumbado','Alfardón de pie','Estrella de cuatro'],
  paletas:{
    'Alcázar':{cols:['#1a1918','#1a1918','#f2efe8'],ribbon:'#ffffff',outline:'#ffffff'},
    'Verde y negro':{cols:['#2b5d5c','#1a1918','#f2efe8'],ribbon:'#ffffff',outline:'#ffffff'},
    'Melado':{cols:['#7a3b26','#b8772f','#f2efe8'],ribbon:'#ffffff',outline:'#ffffff'},
    'Para colorear':{cols:Array(3).fill('#ffffff'),ribbon:'#222222',outline:'#222222'}}
});

// ===== Frisos: octógonos y estrellas de cuatro (rodapié W, págs. 158-159) =====
P.octogonos=escalar({id:'octogonos',nombre:'Octógonos y estrellas de cuatro',lugar:'Rodapié de los zócalos',pags:'158 y 159',tipo:'mosaico',
  W:2,H:4,
  lineas(){const L=[];for(let a=-1;a<=2;a++)for(let b=-1;b<=3;b++)L.push(...contorno(poligono(2*a+1,2*b+1,8,1,0)));return L;},
  clase(Pz,[x,y]){if(Math.abs(MOTOR.area(Pz))/(this.k*this.k)<2)return 2;return mod(Math.floor(y/2),2);},
  nombres:['Octógono de las filas oscuras','Octógono de las filas verdes','Estrella de cuatro'],
  paletas:{
    'Alcázar':{cols:['#151a19','#244a3f','#f4f1ea'],ribbon:'#ffffff',outline:'#ffffff'},
    'Azul':{cols:['#1d2a55','#3d63a8','#f2efe8'],ribbon:'#ffffff',outline:'#ffffff'},
    'Melado':{cols:['#7a3b26','#c98b2b','#fbf4ec'],ribbon:'#ffffff',outline:'#ffffff'},
    'Para colorear':{cols:Array(3).fill('#ffffff'),ribbon:'#222222',outline:'#222222'}}
});

// ===== Zaguán, segunda sala: estrellas de seis y de ocho (págs. 32-35) =====
// Módulo de 8 × 8 cuadros con centro (4,4); se dibuja un periodo de 16 × 16 para alternar
// los colores de las estrellas de ocho y de cuatro, como en el zócalo.
P.zaguan2=escalar({id:'zaguan2',nombre:'Estrellas de seis y de ocho',lugar:'Zaguán, segunda sala',pags:'32 a 35',tipo:'cinta',
  W:16,H:16,
  lineas(){const r2=Math.SQRT2,pD=(4-2/s3)/(1+1/s3);
    const F=[[0,r2,r2-1,1],[r2-1,1,4-1/s3,1],[4-1/s3,1,3+s3,5-s3],[3+s3,5-s3,7,4+1/s3],[4-2/s3,0,pD,pD]];
    const G=[(x,y)=>[x,y],(x,y)=>[8-x,y],(x,y)=>[x,8-y],(x,y)=>[8-x,8-y],(x,y)=>[y,x],(x,y)=>[8-y,x],(x,y)=>[y,8-x],(x,y)=>[8-y,8-x]];
    const L=[],vis=new Set();
    for(const g of G)for(const q of F){const a=g(q[0],q[1]),b=g(q[2],q[3]),k=[a,b].map(v=>v.map(n=>n.toFixed(4)).join(',')).sort().join('|');if(vis.has(k))continue;vis.add(k);
      for(const dx of [0,8])for(const dy of [0,8])L.push([a[0]+dx,a[1]+dy,b[0]+dx,b[1]+dy]);}
    return L;},
  clase(Q,[x,y]){const n=Q.length,d0=v=>Math.min(mod(v,8),8-mod(v,8))<0.4,d4=v=>Math.abs(mod(v,8)-4)<0.4;
    if(n===16)return (Math.round(x/8)+Math.round(y/8))%2?5:4;   // estrella de ocho: negra / melada
    if(n===12)return 0;                                           // estrella de seis
    if(n===8&&d4(x)&&d4(y))return (Math.floor(x/8)+Math.floor(y/8))%2?3:2; // estrella de cuatro: melada / verde
    if(n===4)return 7;                                            // pieza pequeña
    if(n===8&&(d0(x)||d0(y)))return 6;                            // pieza en V
    return 1;},                                                   // octógono grande
  nombres:['Estrella de seis','Octógono grande','Estrella de cuatro melada','Estrella de cuatro verde','Estrella de ocho negra','Estrella de ocho melada','Pieza en V','Pieza pequeña'],
  paletas:{
    'Alcázar':{cols:['#2f4fa3','#161616','#c98b2b','#1f5f5b','#161616','#c98b2b','#2f4fa3','#2f4fa3'],ribbon:'#fbfaf5',outline:'#1c1c1c'},
    'Verde y melado':{cols:['#1f5f5b','#161616','#c98b2b','#c98b2b','#c98b2b','#161616','#1f5f5b','#1f5f5b'],ribbon:'#fbfaf5',outline:'#1c1c1c'},
    'Terracota':{cols:['#b8694d','#f0cdb8','#d98e6e','#d98e6e','#8a4b36','#8a4b36','#e8b49a','#e8b49a'],ribbon:'#fbf4ec',outline:'#8a4b36'},
    'Para colorear':{cols:Array(8).fill('#ffffff'),ribbon:'#ffffff',outline:'#222222'}}
});
Object.assign(P.zaguan2,{rw:0.75,ow:0.07,modulo:{m:12,cx:6,cy:6}}); // el bloque de 16 lleva 4 módulos (para alternar colores)

// ===== Salón del techo de Felipe II: rueda de ocho sesgada (págs. 110-114) =====
// Circunferencia de radio √2 (el cuadrado inscrito, de lado 2, es el módulo). Dos octógonos estrellados
// dan ocho rectas giradas a distancia dB del centro; circunferencias de radio rho dan el marco (cuadrado s y rombo q).
(function(){const R=s2,dA=Math.hypot(1,s2-1)*Math.cos(rad(67.5)),dB=dA*s2*Math.cos(rad(67.5)),rho=dB*s2,s=(R-rho)/s2,K=2-rho,c=K-s,q=s*s2;
function rosa(){const T=[],golpes=[],dentro=(x,y)=>Math.max(Math.abs(x),Math.abs(y))<=s+1e-9&&Math.abs(x)+Math.abs(y)<=q+1e-9;
  for(let k=0;k<8;k++){const a=rad(22.5+45*k),n=[Math.cos(a),Math.sin(a)],d=[-n[1],n[0]];
    for(const sg of [1,-1]){let lo=dB,hi=3;for(let i=0;i<60;i++){const m=(lo+hi)/2;dentro(n[0]*dB+d[0]*sg*m,n[1]*dB+d[1]*sg*m)?lo=m:hi=m;}
      const B=[n[0]*dB+d[0]*sg*lo,n[1]*dB+d[1]*sg*lo];golpes.push(B);T.push([n[0]*dB+d[0]*sg*dB,n[1]*dB+d[1]*sg*dB,B[0],B[1]]);}}
  const hueco=(A,B)=>{const H=golpes.filter(g=>Math.abs((B[0]-A[0])*(g[1]-A[1])-(B[1]-A[1])*(g[0]-A[0]))<1e-7),L2=(B[0]-A[0])**2+(B[1]-A[1])**2;
    const t=H.map(g=>((g[0]-A[0])*(B[0]-A[0])+(g[1]-A[1])*(B[1]-A[1]))/L2).sort((x,y)=>x-y),at=u=>[A[0]+(B[0]-A[0])*u,A[1]+(B[1]-A[1])*u];
    return [[...A,...at(t[0])],[...at(t[1]),...B]];};
  for(const g of [1,-1])T.push(...hueco([-c,g*s],[c,g*s]),...hueco([g*s,-c],[g*s,c]),...hueco([g*(q-1),1],[g,q-1]),...hueco([g*(q-1),-1],[g,-(q-1)]));
  for(const [x,y] of [[1,1],[1,-1],[-1,1],[-1,-1]])T.push([x*s,y*c,x*(K-1),y],[x*c,y*s,x,y*(K-1)]);
  return T;}
const area=Q=>{let A=0;for(let i=0;i<Q.length;i++){const a=Q[i],b=Q[(i+1)%Q.length];A+=a[0]*b[1]-b[0]*a[1];}return Math.abs(A)/2;};
P.felipe=escalar({id:'felipe',nombre:'Rueda de ocho sesgada',lugar:'Salón del techo de Felipe II',pags:'110 a 114',tipo:'cinta',
  W:4,H:4,
  lineas(){const L=[];for(const dx of [1,3])for(const dy of [1,3])for(const t of rosa())L.push([t[0]+dx,t[1]+dy,t[2]+dx,t[3]+dy]);return L;},
  clase(Q,[x,y]){const n=Q.length,A=area(Q)/this.k/this.k,par=(Math.round((x-1)/2)+Math.round((y-1)/2))%2===0,f=v=>v-2*Math.floor(v/2),rc=Math.hypot(f(x)-1,f(y)-1);
    if(n===16&&rc<0.2)return par?0:1;   // sino: negro / verde, como un tablero
    if(n===16)return 5;                  // estrella pequeña de las esquinas
    if(n===6&&A>0.15)return par?3:2;     // zafates: verdes junto al sino negro, azules junto al verde
    if(n===8)return 4;                   // flecha
    if(n===12)return 6;                  // pieza entre dos ruedas
    return 7;},
  nombres:['Sino negro (estrella central)','Sino verde (estrella central)','Zafate azul','Zafate verde','Flecha','Estrella pequeña de las esquinas','Pieza entre dos ruedas','Pieza pequeña'],
  paletas:{
    'Alcázar':{cols:['#161616','#1f5f5b','#2f4fa3','#1f5f5b','#161616','#1f5f5b','#1f5f5b','#1f5f5b'],ribbon:'#fbfaf5',outline:'#1c1c1c'},
    'Melado y cobalto':{cols:['#2f4fa3','#c98b2b','#2f4fa3','#c98b2b','#161616','#c98b2b','#1f5f5b','#1f5f5b'],ribbon:'#fbfaf5',outline:'#1c1c1c'},
    'Terracota':{cols:['#8a4b36','#b8694d','#e8b49a','#f0cdb8','#8a4b36','#d98e6e','#d98e6e','#e8b49a'],ribbon:'#fbf4ec',outline:'#8a4b36'},
    'Para colorear':{cols:Array(8).fill('#ffffff'),ribbon:'#ffffff',outline:'#222222'}}
});
// Paso 8 del libro: la línea interior de la cinta pasa por los puntos medios de los lados del cuadrado inicial, (0,±1) y (±1,0).
// La cinta del rombo |x|+|y|=q queda a (q-1)/√2 de ese punto: medio ancho. En unidades de la app (×6).
Object.assign(P.felipe,{modulo:{m:12,cx:6,cy:6},rw:+(2*(q-1)/s2*6).toFixed(4),ow:0.07,G:{R,dA,dB,rho,s,K,c,q}});
})();

// ===== LA ALHAMBRA · Sala de la Barca, zócalo 1 (alicatado n.º 16) =====
// Cuadrado de 8 × 8 con circunferencia de radio 1: paralelas a ejes y diagonales por sus cortes (pasos 1 a 6 del libro).
// En el muro el módulo está girado 45°: aquí se guarda ya girado y los pasos lo enseñan derecho (p.giro).
(function(){const S=Math.SQRT1_2,a=1+S,b=1+2*S,c3=1+3*S,t3=3*S,U=8*S;
const F=[[S,-a,a,-a],[-S,-a,S,-c3],[S,-c3,t3,-c3],[t3,-c3,3,-4],[-3,-4,-4,-3]];
const G=[(x,y)=>[x,y],(x,y)=>[-x,y],(x,y)=>[x,-y],(x,y)=>[-x,-y],(x,y)=>[y,x],(x,y)=>[-y,x],(x,y)=>[y,-x],(x,y)=>[-y,-x]];
function modulo(){const L=[],vis=new Set();for(const g of G)for(const q of F){const p=g(q[0],q[1]),r=g(q[2],q[3]),k=[p,r].map(v=>v.map(n=>n.toFixed(4)).join(',')).sort().join('|');if(vis.has(k))continue;vis.add(k);L.push([...p,...r]);}return L;}
const Rt=v=>[(v[0]-v[1])*S,(v[0]+v[1])*S];
const area=Q=>{let A=0;for(let i=0;i<Q.length;i++){const p=Q[i],q=Q[(i+1)%Q.length];A+=p[0]*q[1]-q[0]*p[1];}return Math.abs(A)/2;};
P.barca=escalar({id:'barca',coleccion:'alhambra',num:16,nombre:'Estrellas de ocho y piezas en Y',lugar:'Sala de la Barca · Palacio de Comares',tipo:'cinta',
  W:4*U,H:2*U,
  lineas(){const L=[];for(const [cc,rr] of [[0,0],[2,0],[1,1],[3,1],[4,0],[0,2],[2,2],[4,2],[-1,1],[1,-1],[3,-1]])for(const s of modulo()){const p=Rt([s[0],s[1]]),q=Rt([s[2],s[3]]);L.push([p[0]+cc*U,p[1]+rr*U,q[0]+cc*U,q[1]+rr*U]);}return L;},
  clase(Q,[x,y]){const n=Q.length,cc=Math.round(x/U),rr=Math.round(y/U),d=Math.hypot(x-cc*U,y-rr*U);
    if(n===16&&d<0.3)return rr%2?0:((cc%4+4)%4===2?2:1);  // sinos: filas de azules y filas de melados y negros
    if(n===12)return 3;if(n===4)return 5;return 4;},
  nombres:['Sino azul','Sino melado','Sino negro','Alfardón (estrella de cuatro alargada)','Pieza en Y','Pieza cuadrada'],
  paletas:{
    'Alhambra':{cols:['#2f4fa3','#c98b2b','#161616','#3d7a62','#161616','#161616'],ribbon:'#fbfaf5',outline:'#1c1c1c'},
    'Verde y negro':{cols:['#1f5f5b','#c98b2b','#161616','#2f4fa3','#161616','#161616'],ribbon:'#fbfaf5',outline:'#1c1c1c'},
    'Terracota':{cols:['#8a4b36','#d98e6e','#5a3022','#e8b49a','#8a4b36','#8a4b36'],ribbon:'#fbf4ec',outline:'#8a4b36'},
    'Para colorear':{cols:Array(6).fill('#ffffff'),ribbon:'#ffffff',outline:'#222222'}}
});
// Paso 8: la cinta mide 2B, con B = A/10 y A la distancia entre las rectas x = ±(1+√2/2) del paso 4
Object.assign(P.barca,{rw:+(2*(2*a/10)*P.barca.k).toFixed(4),ow:0.07,giro:-45,Gb:{S,a,b,c3,U},
  modulo:{m:8*P.barca.k,cx:6,cy:6,giro:-45}}); // módulo mínimo: el cuadrado de 8 × 8 del libro, girado en el muro
})();

// ===== LA ALHAMBRA · Acceso al Patio de los Arrayanes, yesería del zaguán (n.º 7) =====
// Estrella de doce inscrita en un hexágono regular: 12 rectas a √3/4 del centro (los lados de dos estrellas de seis).
(function(){const s3=Math.sqrt(3),d=s3/4,HEX=[0,1,2,3,4,5].map(i=>[Math.cos(rad(90+60*i)),Math.sin(rad(90+60*i))]);
function clipHex(p,u){let t0=-9,t1=9;for(let i=0;i<6;i++){const a=HEX[i],b=HEX[(i+1)%6],n=[-(b[1]-a[1]),b[0]-a[0]],den=u[0]*n[0]+u[1]*n[1],num=(p[0]-a[0])*n[0]+(p[1]-a[1])*n[1];
  if(Math.abs(den)<1e-12){if(num<0)return null;continue;}const t=-num/den;if(den>0)t0=Math.max(t0,t);else t1=Math.min(t1,t);}return t1>t0?[t0,t1]:null;}
function modulo(){const L=[];for(let k=0;k<12;k++){const a=rad(30*k),n=[Math.cos(a),Math.sin(a)],u=[-n[1],n[0]],P=[n[0]*d,n[1]*d],c=clipHex(P,u);if(!c)continue;
  const at=t=>[P[0]+u[0]*t,P[1]+u[1]*t],t0=d/s3;L.push([...at(c[0]),...at(-t0)],[...at(t0),...at(c[1])]);}return L;} // cada lado de las estrellas de seis, desde su cruce con el otro lado de la misma estrella (vértice entrante, a r = 1/2) hasta el hexágono
P.arrayanes=escalar({id:'arrayanes',coleccion:'alhambra',num:7,nombre:'Estrellas de doce',lugar:'Acceso al Patio de los Arrayanes · yesería del zaguán',tipo:'cinta',
  W:s3,H:3,
  lineas(){const L=[];for(let i=-1;i<=2;i++)for(let j=-1;j<=2;j++){const cx=i*s3+(j%2?s3/2:0),cy=j*1.5;for(const t of modulo())L.push([t[0]+cx,t[1]+cy,t[2]+cx,t[3]+cy]);}return L;},
  clase(Q){const n=Q.length;return n>=20?0:n===5?1:n===4?2:3;},
  nombres:['Estrella de doce puntas','Zafate (pentágono)','Pieza de cuatro lados','Triángulo'],
  paletas:{
    'Yesería':{cols:['#efe4cc','#e0cfa8','#d6c398','#cdb88a'],ribbon:'#fbf7ee',outline:'#8a7650'},
    'Alhambra':{cols:['#c98b2b','#1f5f5b','#2f4fa3','#161616'],ribbon:'#fbfaf5',outline:'#1c1c1c'},
    'Azul y oro':{cols:['#2f4fa3','#e0b04a','#1f5f5b','#161616'],ribbon:'#fbfaf5',outline:'#1c1c1c'},
    'Para colorear':{cols:Array(4).fill('#ffffff'),ribbon:'#ffffff',outline:'#222222'}}
});
Object.assign(P.arrayanes,{modBase:modulo,hexV:HEX,rw:0.55,ow:0.06,modulo:{tipo:'hex',R:P.arrayanes.k,cx:2*s3*P.arrayanes.k,cy:3*P.arrayanes.k}});
})();

// ===== LA ALHAMBRA · Tacas de la Torre de Comares (alicatado n.º 15) =====
// Cuadrado de lado 2 con su circunferencia inscrita (radio 1). Por los cortes con las diagonales, paralelas a los lados (a 1/√2);
// uniendo los puntos medios de los lados, el cuadrado girado 45°. Su octógono central, unido de tres en tres, da un octógono estrellado
// con otro octógono en el centro; el octógono estrellado de este, prolongado, da rectas a d3 = (1−1/√2)·tan 22,5° del centro.
// El módulo básico (paso 5) es el cuadrado: cuatro partes iguales giradas 90°. Se replica por simetría con dos lados como ejes (paso 6)
// y la baldosa de 2 × 2 se repite por traslación (paso 7). Periodo de 4 × 4 (dos cuadrados por lado).
(function(){const a1=Math.SQRT1_2,d2=1-a1,d3=d2*Math.tan(Math.PI/8),c=d3*Math.SQRT2;
const A=[[0,-1],[-d3,-(1-d3)],[-d3,d3-c],[-a1,a1-c],[-a1,a1+c],[c-1,1]];   // desde el punto medio del lado de arriba
const B=[[-1,0],[a1-1,-a1],[a1+c,-a1],[1,c-1]];                            // desde el punto medio del lado izquierdo
const rot=([u,v],k)=>{for(let i=0;i<k;i++)[u,v]=[-v,u];return[u,v];};
function modulo(){const L=[];for(let k=0;k<4;k++)for(const P of [A,B]){const Q=P.map(q=>rot(q,k));for(let i=0;i+1<Q.length;i++)L.push([...Q[i],...Q[i+1]]);}return L;}
const area=Q=>{let S=0;for(let i=0;i<Q.length;i++){const p=Q[i],q=Q[(i+1)%Q.length];S+=p[0]*q[1]-q[0]*p[1];}return Math.abs(S)/2;};
P.taca=escalar({id:'taca',coleccion:'alhambra',num:15,nombre:'Estrellas de ocho y zafates',lugar:'Tacas de la Torre de Comares · Patio de los Arrayanes',tipo:'mosaico',
  W:4,H:4,
  lineas(){const L=[];for(let i=-1;i<=2;i++)for(let j=-1;j<=2;j++){const sx=i%2?-1:1,sy=j%2?-1:1,cx=1+2*i,cy=1+2*j; // simetría por los lados del cuadrado
    for(const t of modulo())L.push([cx+sx*t[0],cy+sy*t[1],cx+sx*t[2],cy+sy*t[3]]);}return L;},
  clase(Q,[x,y]){const n=Q.length,Ar=area(Q)/this.k/this.k,par=(Math.floor(x/2)+Math.floor(y/2))%2===0;
    if(n===16)return Ar>0.34?0:1;          // 16 lados: el sino (estrella de ocho) o la cruz en X, más pequeña
    if(n===6)return par?2:3;                // zafates en grupos de cuatro: un grupo melado, el siguiente verde
    if(n===8)return Ar>0.2?4:5;             // zafate negro / estrella de cuatro blanca
    return 6;},
  nombres:['Sino (estrella de ocho)','Cruz','Zafate (grupos melados)','Zafate (grupos verdes)','Zafate negro','Estrella de cuatro','Pieza pequeña'],
  paletas:{
    'Alhambra':{cols:['#2f4fa3','#ffffff','#c98b2b','#1f5f5b','#161616','#ffffff','#ffffff'],ribbon:'#ffffff',outline:'#ffffff'},
    'Azul y oro':{cols:['#2f4fa3','#ffffff','#e0b04a','#e0b04a','#161616','#ffffff','#ffffff'],ribbon:'#ffffff',outline:'#ffffff'},
    'Terracota':{cols:['#8a4b36','#fbf4ec','#d98e6e','#e8b49a','#5a3022','#fbf4ec','#fbf4ec'],ribbon:'#fbf4ec',outline:'#fbf4ec'},
    'Para colorear':{cols:Array(7).fill('#ffffff'),ribbon:'#222222',outline:'#222222'}}
});
Object.assign(P.taca,{Gt:{a1,d2,d3,c},modBase:modulo,vistaModulo:[0,0,2*P.taca.k,2*P.taca.k], // en Colorear, «Módulo» enseña el cuadrado del paso 5, derecho

  // Paso 8: el panel se corona con un friso de almenillas blancas y negras entre dos cenefas verdes. En la figura del libro, cada
  // pareja de almenillas ocupa 8 × 7 cuadros y mide la mitad del lado del cuadrado inicial (una unidad, el radio de la circunferencia).
  panel:{periodo:P.taca.k,cuadros:8,alto:7,cenefa:1.75,campo:[0,0,3*24,2*24],colores:{oscuro:'#161616',claro:'#ffffff',cenefa:'#1f5f5b'}},
  modulo:{m:2*Math.SQRT2*P.taca.k,cx:P.taca.k,cy:P.taca.k,giro:45,nota:[' · el dibujo va girado 45° para ver el módulo derecho; en el muro, la baldosa del paso 6 va recta',' · the drawing is turned 45° to show the module upright; on the wall, the tile from step 6 is straight']}}); // módulo mínimo: la baldosa de 2 × 2 tiene un periodo en diagonal (2, 2)
})();

// ---------- Textos y pasos del trazado ----------
const T={u:'<em>El Real Alcázar de Sevilla con regla y compás</em>'};
const ln=(s,attr)=>`<line x1="${+s[0].toFixed(3)}" y1="${+s[1].toFixed(3)}" x2="${+s[2].toFixed(3)}" y2="${+s[3].toFixed(3)}"${attr?' '+attr:''}/>`;
// red de triángulos de lado u con una familia de rectas en la dirección phi, que pasa por (0,0)
function redTri(box,u,phi){const L=[],h=u*s3/2,[x0,y0,x1,y1]=box,R=Math.hypot(x1-x0,y1-y0)+Math.hypot(x0,y0)+Math.hypot(x1,y1);
  for(const a of [phi,phi+60,phi+120]){const d=[Math.cos(rad(a)),Math.sin(rad(a))],n=[-d[1],d[0]];
    for(let m=Math.floor(-R/h);m<=Math.ceil(R/h);m++){const s=recta([n[0]*m*h,n[1]*m*h],d,box);if(s)L.push(s);}}
  return L;}
const guia=(L,c,w,dash)=>`<g fill="none" stroke="${c}" stroke-width="${w}"${dash?` stroke-dasharray="${dash}"`:''}>`+L.map(s=>ln(s)).join('')+'</g>';
const animar=(L,c,w)=>`<g class="draw" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round">`+L.map((s,i)=>ln(s,`pathLength="1" style="animation-delay:${(i/L.length*1.4).toFixed(2)}s"`)).join('')+'</g>';
const caja=(vt,m)=>[vt[0]-m,vt[1]-m,vt[0]+vt[2]+m,vt[1]+vt[3]+m];
const AZ='#9cbbd6',RO='#b5444b';

Object.assign(P.zaguan,{vt:[0,0,24,24],
  resumen:'Cintas blancas que se cruzan en ángulo recto, cuadrados grandes en los huecos y cuadraditos en los cruces.',
  pie:'Todo sale de una cuadrícula girada 45°: se remarcan las líneas con el ritmo 1-2-1-2, una calle de un cuadro para la cinta y un hueco de dos para el cuadrado.',
  pasos:[
    {h:'Una cuadrícula girada',t:'Dibuja una cuadrícula de cuadros iguales girada 45°, como un tablero puesto de pico. El lado de cada cuadro será el ancho de las cintas blancas.',c:'Si te resulta más cómodo, gira el papel y trabaja con la cuadrícula derecha: es el mismo dibujo.',
     guia(p,vt){const L=[],b=caja(vt,1),k=p.k;for(let c=-40;c<=40;c++){for(const s of [recta([c*s2*k,0],[1,-1],b),recta([c*s2*k,0],[1,1],b)])if(s)L.push(s);}return guia(L,AZ,0.05);}},
    {h:'El ritmo 1-2',t:'Remarca las líneas siguiendo el ritmo 1-2-1-2…: una calle de un cuadro y un hueco de dos, en las dos direcciones. Las calles serán las cintas; los huecos, los cuadrados grandes.',c:'Cuenta en voz baja: remarca, remarca, salta dos.',tipo:'remarcar'},
    {h:'Las piezas',t:'Salen tres piezas: cuadrados de 2 × 2 en los huecos, cuadraditos de 1 × 1 donde se cruzan las calles y rectángulos de 1 × 2 que forman las cintas.',c:'En el zócalo las cintas son blancas y los cuadrados, negros, verdes y melados.',tipo:'piezas'},
    {h:'Colorear',t:'Los cuadrados negros y los melados se agrupan de cuatro en cuatro alrededor de un cuadradito del mismo color, en filas que se alternan. Todo lo demás es verde y las cintas, blancas.',c:'Prueba otras combinaciones en la pestaña Colorear.',tipo:'color'}]});

Object.assign(P.munecas17,{vt:[0,0,24,24],
  resumen:'Octógonos de lados desiguales partidos en tres franjas, que giran 90° de uno a otro, y cuadrados verdes entre ellos.',
  pie:'Cada baldosa es un cuadrado de 3 × 3 con un octógono que une los puntos que dividen sus lados en tres; la baldosa se repite girándola 90° alrededor de una esquina.',
  pasos:[
    {h:'Cuadrado de 3 × 3',t:'Dibuja un cuadrado y divídelo en 3 × 3 cuadros. Traza también las diagonales de los cuadros.',c:'Con cuadros de 2 cm, cada baldosa mide 6 cm y la baldosa de cuatro, 12 cm.',
     guia(p,vt){const L=[],D=[],b=caja(vt,1),k=p.k;for(let n=-2;n<=9;n++){L.push([n*k,b[1],n*k,b[3]],[b[0],n*k,b[2],n*k]);for(const s of [recta([n*k,0],[1,1],b),recta([n*k,0],[1,-1],b)])if(s)D.push(s);}return guia(D,RO,0.04,'0.3 0.2')+guia(L,AZ,0.05);}},
    {h:'El octógono',t:'Une los puntos que dividen cada lado en tres partes: sale un octógono con cuatro lados largos y cuatro cortos, que son diagonales de los cuadros de las esquinas. Remarca también las dos rectas que lo parten en tres franjas iguales.',c:'Las esquinas que sobran del cuadrado son triángulos: juntando cuatro saldrá un cuadrado.',anim:'draw',
     guia(p,vt){return animar(p.baldosa(0,0,false).map(s=>s.map(v=>v*p.k)),RO,0.12);}},
    {h:'Girar 90°',t:'Repite la baldosa girándola 90° alrededor de una de sus esquinas. Las franjas quedan alternadas, horizontales y verticales, y con cuatro baldosas tienes el módulo que se repite.',c:'Fíjate en que entre cuatro octógonos queda un cuadrado de pico.',tipo:'remarcar'},
    {h:'Las piezas',t:'Hay tres piezas: el rectángulo de la franja central, dos trapecios a sus lados y el cuadrado que queda entre cuatro octógonos.',c:'Todas tienen lados de 1 cuadro o diagonales de un cuadro.',tipo:'piezas'},
    {h:'Colorear',t:'En el zócalo los rectángulos son negros, los trapecios blancos y los cuadrados verdes. El dibujo parece un tejido de cintas que se cruzan.',c:'Prueba otras combinaciones en la pestaña Colorear.',tipo:'color'}]});

Object.assign(P.toledanos,{vt:[0,0,24,P.toledanos.H],
  resumen:'Hexágonos que se tocan por los vértices y triángulos blancos entre ellos; el color se agrupa en rombos.',
  pie:'Todo el dibujo está en una red de triángulos equiláteros: los hexágonos son grupos de seis triángulos y entre cada tres hexágonos queda uno suelto.',
  pasos:[
    {h:'Red de triángulos',t:'Dibuja una red de triángulos equiláteros. Puedes hacerla con circunferencias del mismo radio, una con centro en cada cruce de la anterior, o con escuadra y cartabón.',c:'Aquí las rectas de la red son verticales y a 30°, para que los hexágonos queden de pico arriba.',
     guia(p,vt){return guia(redTri(caja(vt,2),p.k,90),AZ,0.05);}},
    {h:'Hexágonos',t:'Remarca hexágonos de seis triángulos que se toquen por los vértices. Entre cada tres hexágonos queda libre un triángulo.',c:'Si empiezas por una fila, la siguiente va desplazada medio hexágono.',tipo:'remarcar'},
    {h:'Las piezas',t:'Solo hay dos piezas: el hexágono y el triángulo, los dos con el mismo lado.',c:'Es uno de los alicatados más sencillos del Alcázar.',tipo:'piezas'},
    {h:'Colorear',t:'El color se organiza en rombos de 3 × 3 hexágonos: uno melado en el centro rodeado de seis negros, y verdes en los ángulos agudos. Los triángulos son blancos.',c:'Prueba otras combinaciones en la pestaña Colorear.',tipo:'color'}]});

Object.assign(P.cenador6,{vt:[0,0,24,P.cenador6.H],
  resumen:'Estrellas de seis puntas de colores, punta con punta, con rombos y alfardones blancos entre ellas.',
  pie:'Cada estrella son doce triángulos de una red de triángulos equiláteros: un hexágono y una punta en cada lado. Las estrellas se tocan por las puntas.',
  pasos:[
    {h:'Red de triángulos',t:'Dibuja una red de triángulos equiláteros con una de sus familias de rectas horizontal.',c:'Usa un lápiz duro y trazo muy suave: la red solo sirve de guía.',
     guia(p,vt){return guia(redTri(caja(vt,2),p.k,0),AZ,0.05);}},
    {h:'Estrellas de seis',t:'Remarca estrellas de doce triángulos: un hexágono y una punta en cada lado. Colócalas en filas, tocándose punta con punta, y pon cada fila justo debajo de la anterior para que también se toquen de arriba abajo.',c:'Entre el centro de dos estrellas vecinas de una fila hay tres lados de triángulo.',tipo:'remarcar'},
    {h:'Las piezas',t:'Entre dos estrellas de una fila queda un rombo, y entre dos filas, un alfardón: un hexágono alargado de diez triángulos.',c:'Las tres piezas salen solas al dibujar las estrellas: no hace falta ninguna línea más.',tipo:'piezas'},
    {h:'Colorear',t:'Las estrellas van en negro, melado, verde y azul, y los rombos y alfardones en blanco.',c:'En el libro verás una variante de la Sala de Audiencias del Cuarto Real Alto con triángulos en lugar de rombos.',tipo:'color'}]});


const circulos=(C,r,c,w)=>`<g fill="none" stroke="${c}" stroke-width="${w}" stroke-dasharray="0.3 0.2">`+C.map(([x,y])=>`<circle cx="${+x.toFixed(3)}" cy="${+y.toFixed(3)}" r="${+r.toFixed(3)}"/>`).join('')+'</g>';
// cuadrícula de paso «u» (en unidades del libro) y, si se pide, sus diagonales
function cuadricula(p,vt,u,diag){const L=[],D=[],b=caja(vt,1),k=p.k*u;
  for(let n=Math.floor(b[0]/k)-1;n<=Math.ceil(b[2]/k)+1;n++)L.push([n*k,b[1],n*k,b[3]]);
  for(let n=Math.floor(b[1]/k)-1;n<=Math.ceil(b[3]/k)+1;n++)L.push([b[0],n*k,b[2],n*k]);
  if(diag)for(let n=-60;n<=60;n++)for(const s of [recta([n*k,0],[1,1],b),recta([n*k,0],[1,-1],b)])if(s)D.push(s);
  return guia(D,RO,0.04,'0.3 0.2')+guia(L,AZ,0.05);}

Object.assign(P.cubos,{vt:[0,0,24,24],
  resumen:'Cuadrados de colores con dos caras en paralelogramo, blanca y azul: parecen cubos vistos en perspectiva.',
  pie:'Es una cuadrícula con las diagonales descendentes: en cada fila, uno de cada tres cuadros se deja entero y los demás se parten por la diagonal.',
  pasos:[
    {h:'Cuadrícula y diagonales',t:'Dibuja una cuadrícula y traza en cada cuadro la diagonal que baja de izquierda a derecha.',c:'Con cuadros de 1,5 cm, el módulo de 3 × 3 mide 4,5 cm.',
     guia(p,vt){const L=[],D=[],b=caja(vt,1),k=p.k;for(let n=-2;n<=12;n++)L.push([n*k,b[1],n*k,b[3]],[b[0],n*k,b[2],n*k]);for(let n=-12;n<=12;n++){const s=recta([n*k,0],[1,1],b);if(s)D.push(s);}return guia(D,RO,0.05,'0.3 0.2')+guia(L,AZ,0.05);}},
    {h:'Cuadros enteros y caras',t:'En cada fila deja entero uno de cada tres cuadros, corriéndolo un cuadro a la izquierda en la fila de abajo. Remarca las diagonales de los demás y borra las líneas que unen dos triángulos de una misma cara: arriba de cada cuadro queda un paralelogramo tumbado y a su izquierda, otro de pie.',c:'Cada cubo es un cuadro entero, la cara de arriba y la del lado.',tipo:'remarcar'},
    {h:'Las piezas',t:'Salen tres piezas: el cuadrado (la cara de delante), el paralelogramo tumbado (la de arriba) y el paralelogramo de pie (la del lado).',c:'Los dos paralelogramos son iguales, solo cambia su posición.',tipo:'piezas'},
    {h:'Colorear',t:'Las caras de arriba son blancas y las del lado, azules. Los cuadrados cambian de color en cada escalera: verde, melado y negro.',c:'Prueba otras combinaciones en la pestaña Colorear.',tipo:'color'}]});

Object.assign(P.alargadas,{vt:[0,0,24,24],
  resumen:'Estrellas de ocho alargadas de colores, tumbadas, y blancas de pie, con cuadraditos partidos en aspa entre ellas.',
  pie:'La base es una red de circunferencias iguales, tangentes de cuatro en cuatro. Las piezas salen de prolongar algunos lados de las estrellas de ocho inscritas en ellas.',
  pasos:[
    {h:'Cuadrícula y circunferencias',t:'Dibuja una cuadrícula con sus diagonales. Con centro en uno de cada dos cruces, traza circunferencias que se toquen de cuatro en cuatro: su radio es el lado de un cuadro.',c:'Las circunferencias quedan tangentes entre sí y a los lados de los cuadros grandes de 2 × 2.',
     guia(p,vt){const C=[];for(let a=-1;a<=7;a++)for(let b=-1;b<=7;b++)C.push([2*a*p.k,2*b*p.k]);return cuadricula(p,vt,1,true)+circulos(C,p.k,RO,0.06);}},
    {h:'Estrellas de ocho',t:'En cada circunferencia inscribe una estrella de ocho puntas con dos cuadrados: uno con los lados horizontales y verticales, y otro girado 45°. Prolonga los lados horizontales y verticales.',c:'Los lados prolongados forman una red de calles; en sus cruces saldrán los cuadraditos.',
     guia(p,vt){const L=[],k=p.k,s=Math.SQRT1_2;for(let a=-1;a<=7;a++)for(let b=-1;b<=7;b++){const x=2*a,y=2*b;L.push(...contorno([[x-s,y-s],[x+s,y-s],[x+s,y+s],[x-s,y+s]]),...contorno([[x,y-1],[x+1,y],[x,y+1],[x-1,y]]));}return animar(L.map(q=>q.map(v=>v*k)),RO,0.08);},anim:'draw'},
    {h:'Remarcar',t:'Remarca las estrellas alargadas: alrededor de una circunferencia, tumbada (con una punta arriba y otra abajo); alrededor de las vecinas, de pie. Entre cuatro estrellas queda un cuadradito; traza sus diagonales.',c:'Cada estrella alargada encaja con sus vecinas sin dejar huecos: la punta de una entra en la muesca de la otra.',tipo:'remarcar'},
    {h:'Las piezas',t:'Hay dos piezas: la estrella alargada, igual tumbada que de pie, y el triángulo del cuadradito partido en aspa.',c:'En los bordes del panel las estrellas se recortan.',tipo:'piezas'},
    {h:'Colorear',t:'Las estrellas de pie son blancas. Las tumbadas van en filas: una de estrellas meladas y otra alternando azul y negro. En los cuadraditos, los triángulos de arriba y abajo son oscuros.',c:'Prueba otras combinaciones en la pestaña Colorear.',tipo:'color'}]});

Object.assign(P.alfardones,{vt:[0,0,24,24],
  resumen:'Alfardones (hexágonos alargados) tumbados y de pie que se entrecruzan como un tejido, con estrellas de cuatro blancas entre ellos.',
  pie:'Sale de estrellas de ocho de segundo cruce trazadas sobre una cuadrícula con el ritmo 3,5-5-3,5: de cada estrella se remarcan los trazos que forman los alfardones y la estrella de cuatro.',
  pasos:[
    {h:'Cuadrícula 3,5-5-3,5',t:'Dibuja una cuadrícula y remarca las líneas siguiendo el ritmo 3,5 - 5 - 3,5 cuadros. Cada grupo de 12 cuadros alojará una estrella.',c:'Los medios cuadros se marcan a ojo en el centro del cuadro.',
     guia(p,vt){const L=[],b=caja(vt,1),k=p.k;for(let n=-1;n<=3;n++)for(const e of [3.5,8.5]){const c=(12*n+e)*k;L.push([c,b[1],c,b[3]],[b[0],c,b[2],c]);}return cuadricula(p,vt,1,false)+guia(L,'#2b4f73',0.09);}},
    {h:'Estrellas de ocho',t:'En cada cuadro de 12 dibuja una estrella de ocho puntas de segundo cruce: los lados horizontales y verticales van por las líneas remarcadas y los inclinados, a 45°, unen las puntas de dos en dos. Las estrellas vecinas se tocan por las puntas.',c:'Cada punta está a 6 cuadros del centro de su estrella.',anim:'draw',
     guia(p,vt){const L=[],k=p.k;for(let a=-1;a<=2;a++)for(let b=-1;b<=2;b++){const cx=12*a+6,cy=12*b+6;
       const pt=[[6,2.5],[2.5,6],[-2.5,6],[-6,2.5],[-6,-2.5],[-2.5,-6],[2.5,-6],[6,-2.5]].map(([x,y])=>[cx+x,cy+y]);
       for(let i=0;i<8;i++){const A=pt[i],B=pt[(i+3)%8];L.push([A[0]*k,A[1]*k,B[0]*k,B[1]*k]);}}return animar(L,RO,0.08);}},
    {h:'Remarcar',t:'De cada estrella remarca solo los trazos que forman los alfardones: hexágonos alargados con las puntas a 45°, tumbados y de pie alternando. La punta de cada alfardón toca el lado largo del vecino. Lo que queda entre ellos son las estrellas de cuatro.',c:'Una estrella es simétrica de la de al lado: si una gira a la derecha, la vecina gira a la izquierda.',tipo:'remarcar'},
    {h:'Las piezas',t:'Solo hay dos piezas: el alfardón, igual tumbado que de pie, y la estrella de cuatro puntas.',c:'Es el mismo motivo del vestíbulo del palacio, entre los alicatados del zaguán.',tipo:'piezas'},
    {h:'Colorear',t:'En las jambas casi todos los alfardones son negros, con algunas filas verdes o meladas que dibujan una cruz en el centro del panel. Las estrellas son blancas.',c:'Prueba otras combinaciones en la pestaña Colorear.',tipo:'color'}]});

Object.assign(P.octogonos,{vt:[0,0,72,72],
  resumen:'Octógonos regulares que se tocan por los vértices, en filas oscuras y verdes, con estrellas de cuatro blancas en los huecos.',
  pie:'La base es una cuadrícula con sus diagonales: en cada cuadro se inscribe una circunferencia y en ella, un octógono regular.',
  pasos:[
    {h:'Cuadrícula y circunferencias',t:'Dibuja una cuadrícula con sus diagonales y, en cada cuadro, la circunferencia inscrita.',c:'Los ejes y las diagonales dividen cada circunferencia en ocho partes iguales.',
     guia(p,vt){const C=[];for(let a=-1;a<=7;a++)for(let b=-1;b<=7;b++)C.push([(2*a+1)*p.k,(2*b+1)*p.k]);return cuadricula(p,vt,2,true)+circulos(C,p.k,RO,0.06);}},
    {h:'Octógonos',t:'Une en orden los ocho puntos donde los ejes y las diagonales cortan cada circunferencia: sale un octógono regular, con una punta arriba. Los octógonos vecinos se tocan por las puntas.',c:'Los huecos que quedan entre cuatro octógonos son estrellas de cuatro.',tipo:'remarcar'},
    {h:'Las piezas',t:'Dos piezas: el octógono y la estrella de cuatro puntas.',c:'En los bordes del panel se usan medias estrellas y cuartos de estrella.',tipo:'piezas'},
    {h:'Colorear',t:'Las filas de octógonos se alternan en verde y negro, y las estrellas siempre son blancas.',c:'Prueba otras combinaciones en la pestaña Colorear.',tipo:'color'}]});

Object.assign(P.zaguan2,{vt:[0,0,12,12],
  resumen:'Estrellas de ocho en las esquinas del módulo, de seis en el centro de sus lados y de cuatro en el centro, unidas por una cinta blanca que se entrelaza.',
  pie:'Todo sale de un cuadrado de 8 × 8 con cinco circunferencias de radio 2: los lados de cuatro triángulos equiláteros, ocho rectas desde los bordes y una recta a 45° en cada esquina.',
  pasos:[
    {h:'Cuadrado de 8 × 8 y circunferencias',t:'Dibuja un cuadrado dividido en 8 × 8 cuadros. Con centro en el punto medio de cada lado traza una semicircunferencia de radio 2 cuadros, y otra circunferencia igual con centro en el del cuadrado.',c:'La circunferencia del centro toca a las cuatro semicircunferencias.',
     guia(p,vt){const k=p.k;return cuadricula(p,vt,1,false)+circulos([[4,0],[0,4],[8,4],[4,8],[4,4]].map(([x,y])=>[x*k,y*k]),2*k,RO,0.05);}},
    {h:'Cuatro triángulos',t:'Las líneas de la cuadrícula cortan la circunferencia del centro en doce puntos repartidos por igual. Únelos de cuatro en cuatro: salen cuatro triángulos equiláteros. Prolonga sus lados hasta el borde del cuadrado.',c:'Cada lado queda a un cuadro del centro; cuatro de ellos coinciden con líneas de la cuadrícula.',anim:'draw',
     guia(p,vt){const k=p.k,b=[0,0,8*k,8*k],L=[];for(let i=0;i<12;i++){const a=rad(30*i),n=[Math.cos(a),Math.sin(a)];const s=recta([(4+n[0])*k,(4+n[1])*k],[-n[1],n[0]],b);if(s)L.push(s);}return animar(L,RO,0.06);}},
    {h:'Rectas desde los bordes',t:'Marca dónde cortan las semicircunferencias a las líneas de la cuadrícula más próximas al borde. Traza una recta por cada uno de esos puntos y por el extremo más cercano de los lados prolongados.',c:'Salen ocho rectas, dos por cada lado del cuadrado, inclinadas como los lados de los triángulos.',anim:'draw',
     guia(p,vt){const k=p.k,b=[0,0,8*k,8*k],L=[],A=[4-2/s3,0],B=[4-s3,1];
       const G=[(x,y)=>[x,y],(x,y)=>[8-x,y],(x,y)=>[x,8-y],(x,y)=>[8-x,8-y],(x,y)=>[y,x],(x,y)=>[8-y,x],(x,y)=>[y,8-x],(x,y)=>[8-y,8-x]];
       for(const g of G){const a=g(...A),c=g(...B),s=recta([a[0]*k,a[1]*k],[c[0]-a[0],c[1]-a[1]],b);if(s)L.push(s);}return animar(L,'#2b4f73',0.06);}},
    {h:'Las esquinas',t:'Con centro en cada esquina traza un cuarto de circunferencia de radio igual a la diagonal de un cuadro. Une los extremos de cada arco con una recta a 45°.',c:'Esas rectas cierran las puntas de las estrellas de ocho de las esquinas.',anim:'draw',
     guia(p,vt){const k=p.k,r=Math.SQRT2,C=[[0,0],[8,0],[0,8],[8,8]];const L=C.map(([x,y])=>[x*k,(y?y-r:y+r)*k,(x?x-r:x+r)*k,y*k]);return circulos(C.map(([x,y])=>[x*k,y*k]),r*k,RO,0.05)+animar(L,RO,0.08);}},
    {h:'Remarcar',t:'Remarca solo los trazos del dibujo: una estrella de ocho puntas alrededor de cada esquina, una de seis en el centro de cada lado y una de cuatro en el centro. Las líneas se enlazan en una red continua.',c:'Las puntas de la estrella de cuatro tocan la circunferencia del centro.',tipo:'remarcar'},
    {h:'Las piezas',t:'Salen seis piezas distintas: las estrellas de ocho, de seis y de cuatro puntas, el octógono grande, la pieza en V y una pieza pequeña de cuatro lados.',c:'El módulo se repite por traslación. Al repetirlo, las estrellas de ocho y de cuatro alternan sus colores.',tipo:'piezas'},
    {h:'La cinta y el color',t:'Da ancho a la cinta con dos paralelas a cada línea y alterna los cruces por encima y por debajo. En el zaguán, las estrellas de seis y las piezas pequeñas son azules y los octógonos, negros. Las estrellas de ocho alternan negro y melado, y las de cuatro, melado y verde.',c:'Prueba otras combinaciones en la pestaña Colorear.',tipo:'color'}]});

(function(){const p=P.felipe,G=p.G,k=p.k,C=[6,6],R=G.R*k,X=v=>C[0]+v*k,Y=v=>C[1]+v*k;
  const lin=(a,d,box)=>recta([X(a[0]),Y(a[1])],d,box);
  const vt=[-2.8,-2.8,17.6,17.6],b=caja(vt,0);
  const ejes=()=>{const L=[];for(let i=0;i<4;i++){const a=rad(45*i),d=[Math.cos(a),Math.sin(a)];L.push([C[0]-d[0]*R,C[1]-d[1]*R,C[0]+d[0]*R,C[1]+d[1]*R]);}return L;};
  const estrella=(dist,a0)=>{const L=[];for(let i=0;i<8;i++){const a=rad(a0+45*i),n=[Math.cos(a),Math.sin(a)],s=lin([n[0]*dist,n[1]*dist],[-n[1],n[0]],b);if(s)L.push(s);}return L;};
  const V=[];for(let i=0;i<8;i++){const a=rad(45*i);V.push([Math.cos(a)*G.R,Math.sin(a)*G.R]);}
  Object.assign(p,{vt,
  resumen:'Una rueda de ocho con la estrella central «sesgada»: sus puntas se cruzan girando, rodeadas de ocho zafates, con estrellas pequeñas y flechas entre las ruedas.',
  pie:'Todo sale de una circunferencia dividida en ocho partes: dos octógonos estrellados dan las ocho rectas giradas de la estrella, y ocho circunferencias pequeñas dan el marco. El módulo se repite por traslación.',
  pasos:[
    {h:'Circunferencia y dos cuadrados',t:'Traza una circunferencia y divídela en ocho partes iguales con sus ejes y sus diagonales. Une los puntos de dos en dos saltando uno: salen dos cuadrados inscritos, uno derecho y otro de pico.',c:'Es la construcción de «Aprender a trazar» de la pág. 168. El cuadrado derecho será el borde del módulo.',anim:'draw',
     guia(){const Q1=[[1,1],[-1,1],[-1,-1],[1,-1]],Q2=[[G.R,0],[0,G.R],[-G.R,0],[0,-G.R]];const L=[];for(const Q of [Q1,Q2])for(let i=0;i<4;i++){const a=Q[i],c=Q[(i+1)%4];L.push([X(a[0]),Y(a[1]),X(c[0]),Y(c[1])]);}
       return circulos([C],R,'#2b4f73',0.05)+guia(ejes(),AZ,0.04)+animar(L,RO,0.08);}},
    {h:'Primer octógono estrellado',t:'Los lados de los dos cuadrados se cortan en ocho puntos. Tómalos como vértices de un octógono estrellado: une cada punto con el tercero siguiente.',c:'Sus lados salen horizontales, verticales y a 45°.',anim:'draw',
     guia(){const rP=Math.hypot(1,s2-1),Pt=i=>[X(rP*Math.cos(rad(22.5+45*i))),Y(rP*Math.sin(rad(22.5+45*i)))],L=[];for(let i=0;i<8;i++){const u=Pt(i),w=Pt(i+3);L.push([...u,...w]);}return animar(L,RO,0.06);}},
    {h:'Segundo octógono, sesgado',t:'Los lados de ese octógono se cortan sobre los ejes y las diagonales. Une esos ocho puntos de la misma manera y prolonga los lados: salen ocho rectas un poco giradas, que no pasan por el centro.',c:'Ese giro es el que da nombre a la rueda «sesgada».',anim:'draw',
     guia(){return animar(estrella(G.dB,22.5),'#2b4f73',0.07);}},
    {h:'Nueve circunferencias pequeñas',t:'Los lados del octógono anterior forman dos cuadrados pequeños: traza la circunferencia que pasa por sus vértices. Con el mismo radio, traza otras ocho con centro en los vértices de los dos cuadrados iniciales.',c:'Las nueve tienen el mismo radio.',
     guia(){return circulos([C,...V.map(v=>[X(v[0]),Y(v[1])])],G.rho*k,RO,0.06);}},
    {h:'El marco',t:'Esas circunferencias cortan a los ejes y diagonales: por esos puntos pasan un cuadrado y un rombo que forman un octógono alrededor de la rueda. En cada vértice, une también los dos puntos donde la circunferencia corta a los lados del cuadrado inicial.',c:'Los trazos cortos de las esquinas serán media estrella pequeña.',anim:'draw',
     guia(){const s=G.s,q=G.q,L=[];const P4=[[s,s],[-s,s],[-s,-s],[s,-s]],D4=[[q,0],[0,q],[-q,0],[0,-q]];
       for(const Q of [P4,D4])for(let i=0;i<4;i++){const a=Q[i],c=Q[(i+1)%4];L.push([X(a[0]),Y(a[1]),X(c[0]),Y(c[1])]);}
       const r=G.rho,M=[];for(const [x,y] of [[1,1],[1,-1],[-1,1],[-1,-1]])M.push([X(x),Y(y*(1-r)),X(x*(1-r)),Y(y)]);
       const h=G.R-r/s2;for(const [x,y] of [[0,1],[0,-1],[1,0],[-1,0]])M.push(x?[X(x*h),Y(-r/s2),X(x*h),Y(r/s2)]:[X(-r/s2),Y(y*h),X(r/s2),Y(y*h)]);
       return animar(L,'#2b4f73',0.07)+animar(M,RO,0.08);}},
    {h:'Remarcar',t:'De las líneas obtenidas en los pasos anteriores, remarca las indicadas: con ellas se obtiene el módulo generador de la composición.',c:'Las puntas de la estrella se cruzan y siguen hasta el octógono, donde doblan; en las esquinas queda media estrella pequeña.',tipo:'remarcar'},
    {h:'Repetir el módulo',t:'El módulo se repite por traslación en la dirección de los lados del cuadrado.',c:'Al repetirlo, entre cuatro ruedas se forma una estrella pequeña y entre dos, una flecha a cada lado.',tipo:'piezas',vt:[0,0,36,36]},
    {h:'La cinta',t:'La cinta se dibuja trazando paralelas equidistantes a los ejes definidos en el paso 6. La línea interior de la cinta pasa por los puntos medios de los lados de los cuadrados iniciales.',c:'Los puntos rojos son esos puntos medios: marcan el ancho de la cinta.',tipo:'cinta',
     guia(){const L=[[1,0],[-1,0],[0,1],[0,-1]];return `<g fill="${RO}">`+L.map(([x,y])=>`<circle cx="${X(x)}" cy="${Y(y)}" r="0.22"/>`).join('')+'</g>';}},
    {h:'Paralelas y cruces',t:'Con esa misma distancia, traza paralelas al resto de los ejes. Remarca los trazos adecuados para que, en los cruces, las cintas pasen por encima o por debajo en orden alterno.',c:'En el zócalo los sinos alternan negro y verde; los zafates son verdes junto al sino negro y azules junto al verde, y las flechas, negras. El mismo dibujo está en unas jambas del Patio de las Doncellas.',tipo:'color'}]});
  // Segundo método (pág. 113): con una cuadrícula de 28 cuadros, con la secuencia 5-9-9-5. El módulo va de centro a centro de las estrellas de las esquinas (23 cuadros).
  const g=1/11.5,ln2=(a,b2)=>[X(a[0]),Y(a[1]),X(b2[0]),Y(b2[1])],caja2=[X(-14*g),Y(-14*g),X(14*g),Y(14*g)];
  const rejilla=()=>{const L=[],F=[];for(let i=-14;i<=14;i++){const v=i*g;(Math.abs(i)===14||Math.abs(i)===9||i===0?F:L).push(ln2([v,-14*g],[v,14*g]),ln2([-14*g,v],[14*g,v]));}
    const cot=[[-14,-9,5],[-9,0,9],[0,9,9],[9,14,5]].map(([a,b2,n])=>`<text x="${X((a+b2)/2*g)}" y="${Y(-15.3*g)}" font-size="0.75" text-anchor="middle" fill="#2b4f73" font-family="Inter,sans-serif">${n}</text>`).join('');
    return guia(L,AZ,0.03)+guia(F,'#2b4f73',0.07)+cot;};
  const esquinas=()=>{const L=[],h=2.5*g,r=2.5*s2*g;for(const [cx,cy] of [[1,1],[1,-1],[-1,1],[-1,-1]]){const Q=[[cx-h,cy-h],[cx+h,cy-h],[cx+h,cy+h],[cx-h,cy+h]],D=[[cx+r,cy],[cx,cy+r],[cx-r,cy],[cx,cy-r]];for(const P of [Q,D])for(let i=0;i<4;i++)L.push(ln2(P[i],P[(i+1)%4]));}return L;};
  const RB=9*s2*g,rc=2.5*s2*g;
  p.pasosB=[
    {h:'Cuadrícula 5-9-9-5',t:'Para dibujar el módulo con una cuadrícula, remarca la secuencia 5-9-9-5 y dibuja las estrellas de los cuatro ángulos: un cuadrado de 5 × 5 cuadros y un rombo con el mismo centro.',c:'El centro de cada estrella pequeña es una esquina del módulo.',anim:'fade',
     guia(){return rejilla()+animar(esquinas(),RO,0.07);}},
    {h:'Circunferencia y dos cuadrados',t:'Dibuja una circunferencia que pase por los vértices de las cuatro estrellas más próximos al centro. Dibuja los dos cuadrados inscritos en ella.',c:'El cuadrado derecho coincide con las líneas remarcadas del 9.',anim:'draw',
     guia(){const Q=[[RB,0],[0,RB],[-RB,0],[0,-RB]],S=[[9*g,9*g],[-9*g,9*g],[-9*g,-9*g],[9*g,-9*g]],L=[];for(const P of [Q,S])for(let i=0;i<4;i++)L.push(ln2(P[i],P[(i+1)%4]));return circulos([C],RB*k,'#2b4f73',0.05)+animar(L,RO,0.07);}},
    {h:'Diagonales del octógono',t:'Los dos cuadrados se cortan formando un octógono. Traza sus diagonales: ocho radios desde el centro hasta sus vértices.',c:'Quedan a 22,5° de los ejes de la cuadrícula.',anim:'draw',
     guia(){const r=9*g/Math.cos(rad(22.5)),L=[];for(let i=0;i<8;i++){const a=rad(22.5+45*i);L.push(ln2([0,0],[r*Math.cos(a),r*Math.sin(a)]));}return animar(L,'#2b4f73',0.06);}},
    {h:'Circunferencia central',t:'Dibuja una circunferencia central cuyo radio sea igual al de la circunferencia circunscrita a una de las estrellas de los ángulos.',c:'Mide el radio en la estrella de una esquina, con el compás, y llévalo al centro.',anim:'fade',
     guia(){return circulos([C,[X(-1),Y(-1)]],rc*k,'#2b4f73',0.06);}},
    {h:'Paralelas a las diagonales',t:'Traza paralelas a las diagonales del paso 3 por los puntos donde estas cortan a la circunferencia del paso anterior.',c:'Por cada punto pasa una paralela a la diagonal que está a 45°: salen las ocho rectas giradas de la estrella.',anim:'draw',
     guia(){const L=[];for(let i=0;i<8;i++){const a=rad(22.5+45*i),P=[rc*Math.cos(a),rc*Math.sin(a)],d=[Math.cos(a+rad(45)),Math.sin(a+rad(45))],sg=recta([X(P[0]),Y(P[1])],d,caja2);if(sg)L.push(sg);}return animar(L,RO,0.07);}},
    {h:'Remarcar',t:'Remarca los trazos adecuados para obtener el esquema lineal de la composición.',c:'Es el mismo módulo que con el compás: la cuadrícula da una aproximación muy buena.',tipo:'remarcar'},
    ...p.pasos.slice(6)];
})();

(function(){const p=P.barca,{S,a,b,c3}=p.Gb,k=p.k,X=v=>6+v*k,Y=v=>6+v*k,box=[X(-4),Y(-4),X(4),Y(4)];
  const ln=(L,c,w,d)=>guia(L.map(([x1,y1,x2,y2])=>[X(x1),Y(y1),X(x2),Y(y2)]),c,w,d),an=(L,c,w)=>animar(L.map(([x1,y1,x2,y2])=>[X(x1),Y(y1),X(x2),Y(y2)]),c,w);
  const ejes=(v)=>[[-4,v,4,v],[-4,-v,4,-v],[v,-4,v,4],[-v,-4,-v,4]];
  const diag=(v)=>{const L=[];for(const sg of [1,-1])for(const t of [v,-v]){const s0=recta([X(0),Y(t)],[1,sg],box);if(s0)L.push(s0);}return L;}; // x∓y=±v
  const vtM=[6-4*k-0.4,6-4*k-0.4,8*k+0.8,8*k+0.8],vtG=[5.25,5.25,25.5,25.5];
  Object.assign(p,{vt:vtM,
  resumen:'Cintas blancas que se entrelazan formando octógonos superpuestos, con estrellas de ocho azules, negras y meladas en sus centros, alfardones verdes y piezas negras en forma de Y.',
  pie:'Todo sale de un cuadrado de 8 × 8 con una circunferencia de radio 1: por sus cortes con los ejes y las diagonales se trazan paralelas, y por los cortes de estas, otras. En el muro el módulo aparece girado 45°.',
  pasos:[
    {h:'Cuadrado de 8 × 8 y circunferencia',t:'Parte de un cuadrado dividido en 8 × 8 cuadros y remarca sus ejes y diagonales. Dibuja una circunferencia con centro en el del cuadrado y radio 1/8 del lado.',c:'Es la cuadrícula de «Aprender a trazar» (dividir el cuadrado en 8).',anim:'fade',
     guia(){const L=[];for(let i=-4;i<=4;i++)L.push([i,-4,i,4],[-4,i,4,i]);return ln(L,AZ,0.04)+ln([[-4,0,4,0],[0,-4,0,4],[-4,-4,4,4],[-4,4,4,-4]],RO,0.05,'0.3 0.2')+circulos([[X(0),Y(0)]],k,'#2b4f73',0.06);}},
    {h:'Paralelas a las diagonales',t:'Por los puntos donde la circunferencia corta a los ejes, traza paralelas a las diagonales hasta el borde del cuadrado.',c:'Salen cuatro rectas, dos en cada dirección.',anim:'draw',
     guia(){return animar(diag(1),RO,0.07);}},
    {h:'Paralelas a los ejes',t:'Por los puntos donde la circunferencia corta a las diagonales, traza rectas paralelas a los ejes.',c:'Quedan a 0,71 cuadros del centro.',anim:'draw',
     guia(){return an(ejes(S),'#2b4f73',0.07);}},
    {h:'Paralelas a los lados',t:'Por los puntos donde se cortan las rectas de los dos pasos anteriores, traza paralelas a los lados del cuadrado.',c:'Son los lados del cuadrado que rodea a la estrella central.',anim:'draw',
     guia(){return an(ejes(a),RO,0.07);}},
    {h:'Paralelas a las diagonales',t:'Por esos mismos puntos, traza ahora paralelas a las diagonales.',c:'Se cruzan sobre los ejes: serán las puntas de la estrella.',anim:'draw',
     guia(){return animar(diag(b),'#2b4f73',0.07);}},
    {h:'Más paralelas a los lados',t:'Por los puntos donde se cortan las rectas del paso 3 con las del paso 5, traza rectas paralelas a los lados del cuadrado.',c:'Son las últimas: ya están todas las líneas del módulo.',anim:'draw',
     guia(){return an(ejes(c3),RO,0.07);}},
    {h:'La estructura del módulo',t:'Con los trazos anteriores ya puedes dibujar la estructura lineal del módulo que genera la composición.',c:'Una estrella de ocho en el centro, rodeada de octógonos que se superponen, y un brazo hacia cada esquina.',tipo:'remarcar'},
    {h:'La cinta',t:'Para dibujar la cinta, cuya anchura es 2B, traza paralelas a ambos lados del eje a una distancia B = A/10, siendo A la distancia entre las dos rectas del paso 4. La proporción entre cuerda y calle es 1/4.',c:'La raya azul marca A.',tipo:'cinta',
     guia(){return `<g stroke="#2b4f73" stroke-width="0.06" fill="#2b4f73">${[[X(-a),Y(-a)-0.25,X(a),Y(-a)-0.25]].map(s=>ln_(s)).join('')}<text x="${X(0)}" y="${Y(-a)-0.45}" font-size="0.55" text-anchor="middle" font-family="Inter,sans-serif" stroke="none">A</text></g>`;}},
    {h:'Las cintas se cruzan',t:'Una vez obtenido el contorno, solo queda prolongar algunos de sus lados para generar el efecto de lazo: unas cintas parecen pasar sobre otras en un ritmo alterno.',c:'Cada cinta pasa por encima en un cruce y por debajo en el siguiente.',tipo:'cinta',entrelazar:true},
    {h:'Repetir el módulo',t:'La repetición por traslación del módulo permite cubrir el plano.',c:'Si se mira solo el contorno, el módulo se puede dividir en ocho partes iguales y simétricas.',tipo:'piezas',vt:vtG},
    {h:'Girar 45°',t:'Para colocar el diseño en la posición en que aparece en el muro hay que girarlo 45°. En el zócalo los sinos son azules, negros y melados, los alfardones verdes y las piezas en Y, negras.',c:'Prueba otras combinaciones en la pestaña Colorear.',tipo:'color',vt:vtG,sinGiro:true}]});
  function ln_(s0){return `<line x1="${s0[0]}" y1="${s0[1]}" x2="${s0[2]}" y2="${s0[3]}"/>`;}
})();

(function(){const p=P.arrayanes,k=p.k,s3=Math.sqrt(3),C=[p.modulo.cx,p.modulo.cy],X=v=>C[0]+v*k,Y=v=>C[1]+v*k,ap=s3/2;
  const pol=(r,a0,n)=>Array.from({length:n},(_,i)=>[r*Math.cos(rad(a0+360*i/n)),r*Math.sin(rad(a0+360*i/n))]);
  const cerrado=(V,c,w,an)=>{const L=V.map((v,i)=>[X(v[0]),Y(v[1]),X(V[(i+1)%V.length][0]),Y(V[(i+1)%V.length][1])]);return an?animar(L,c,w):guia(L,c,w);};
  const diam=(a0,n,r)=>Array.from({length:n},(_,i)=>{const a=rad(a0+180*i/n);return [X(-r*Math.cos(a)),Y(-r*Math.sin(a)),X(r*Math.cos(a)),Y(r*Math.sin(a))];});
  const arco=(c,a0,a1)=>{const P1=[X(c[0]+Math.cos(rad(a0))),Y(c[1]+Math.sin(rad(a0)))],P2=[X(c[0]+Math.cos(rad(a1))),Y(c[1]+Math.sin(rad(a1)))];return `<path d="M${P1[0].toFixed(3)} ${P1[1].toFixed(3)}A${k} ${k} 0 0 1 ${P2[0].toFixed(3)} ${P2[1].toFixed(3)}"/>`;};
  const hexV=pol(1,90,6),triA=[pol(ap,0,3),pol(ap,60,3)],triB=[pol(ap,90,3),pol(ap,30,3)];
  const vt=[C[0]-1.15*k,C[1]-1.15*k,2.3*k,2.3*k];
  Object.assign(p,{vt,
  resumen:'Estrellas de doce puntas inscritas en circunferencias tangentes entre sí, rodeadas de zafates, sobre una red de hexágonos y otra de triángulos equiláteros.',
  pie:'Todo sale de una circunferencia dividida en doce partes: un hexágono inscrito, la circunferencia tangente a sus lados y dos estrellas de seis puntas, cuyos lados prolongados forman la estrella de doce.',
  pasos:[
    {h:'Circunferencia y cuatro arcos',t:'Parte de una circunferencia con dos diámetros perpendiculares entre sí. Tomando como centros los extremos de los diámetros y radio igual al de la circunferencia, traza cuatro arcos.',c:'Es la división de la circunferencia en 12 de «Aprender a trazar».',anim:'draw',
     guia(){const R=1;return circulos([C],k,'#2b4f73',0.06)+guia(diam(0,2,1),RO,0.05,'0.3 0.2')+`<g class="draw" fill="none" stroke="${RO}" stroke-width="0.07">${arco([1,0],120,240)+arco([-1,0],-60,60)+arco([0,1],210,330)+arco([0,-1],30,150)}</g>`;}},
    {h:'Doce partes y un hexágono',t:'Los arcos y los diámetros iniciales dividen la circunferencia en doce partes iguales. Traza los nuevos diámetros que pasan por los puntos de división y, a continuación, dibuja uno de los hexágonos inscritos.',c:'El hexágono tiene un vértice arriba y otro abajo.',anim:'draw',
     guia(){return guia(diam(0,6,1).filter((_,i)=>i!==0&&i!==3),RO,0.05)+cerrado(hexV,'#2b4f73',0.08,true);}},
    {h:'Circunferencia tangente',t:'Dibuja una nueva circunferencia, concéntrica con la primera y tangente a los lados del hexágono.',c:'Su radio es la apotema del hexágono.',anim:'fade',
     guia(){return circulos([C],ap*k,RO,0.07);}},
    {h:'Primera estrella de seis',t:'Une los puntos medios de los lados del hexágono, en orden alterno, para obtener una estrella formada por dos triángulos equiláteros.',c:'Los puntos medios están en la circunferencia del paso 3.',anim:'draw',
     guia(){return cerrado(triA[0],RO,0.08,true)+cerrado(triA[1],RO,0.08,true);}},
    {h:'Segunda estrella de seis',t:'Une los extremos de los diámetros de la circunferencia interior que pasan por los vértices del hexágono. Obtienes dos nuevos triángulos equiláteros. Prolonga sus lados hasta su intersección con los del hexágono.',c:'Las dos estrellas de seis, juntas, dan doce puntas.',anim:'draw',
     guia(){const L=[];for(let i=0;i<6;i++){const a=rad(30+60*i),n=[Math.cos(a),Math.sin(a)],u=[-n[1],n[0]],P=[n[0]*s3/4,n[1]*s3/4];let t0=-9,t1=9;
       for(let j=0;j<6;j++){const A=hexV[j],B=hexV[(j+1)%6],m=[-(B[1]-A[1]),B[0]-A[0]],den=u[0]*m[0]+u[1]*m[1],num=(P[0]-A[0])*m[0]+(P[1]-A[1])*m[1];if(Math.abs(den)<1e-12)continue;const t=-num/den;if(den>0)t0=Math.max(t0,t);else t1=Math.min(t1,t);}
       L.push([X(P[0]+u[0]*t0),Y(P[1]+u[1]*t0),X(P[0]+u[0]*t1),Y(P[1]+u[1]*t1)]);}return animar(L,'#2b4f73',0.08);}},
    {h:'La estrella de doce',t:'Remarcando los trazos convenientes obtienes la estrella de doce puntas inscrita en el hexágono. Este es el módulo que hay que repetir por traslación para cubrir el plano.',c:'Cada lado de las dos estrellas de seis se remarca desde donde se cruza con otro lado de su misma estrella hasta el lado del hexágono.',anim:'draw',
     guia(){return animar(p.modBase().map(t=>[X(t[0]),Y(t[1]),X(t[2]),Y(t[3])]),'#1b1b1b',0.16)+cerrado(hexV,'#1b1b1b',0.12,true);}},
    {h:'Repetir el módulo',t:'El módulo se repite por traslación hasta cubrir el plano. Es posible porque el hexágono regular es uno de los polígonos que teselan el plano.',c:'Si unes los centros de las estrellas aparece una red de triángulos equiláteros.',tipo:'piezas',vt:[C[0]-2.6*k,C[1]-2.2*k,5.2*k,4.4*k]},
    {h:'Las cintas',t:'Da ancho a las líneas con dos paralelas y alterna los cruces por encima y por debajo. En el zaguán es yesería: todo es del color del yeso y el dibujo se lee por el relieve.',c:'Prueba otras combinaciones en la pestaña Colorear.',tipo:'color',vt:[C[0]-2.6*k,C[1]-2.2*k,5.2*k,4.4*k]}]});
})();

(function(){const p=P.taca,{a1,d2,d3,c}=p.Gt,k=p.k,C=[k,k],X=v=>C[0]+v*k,Y=v=>C[1]+v*k;
  const ln=(L,col,w,d)=>guia(L.map(([x1,y1,x2,y2])=>[X(x1),Y(y1),X(x2),Y(y2)]),col,w,d),an=(L,col,w)=>animar(L.map(([x1,y1,x2,y2])=>[X(x1),Y(y1),X(x2),Y(y2)]),col,w);
  // recta a distancia d del centro, con normal en el ángulo t (grados), recortada al cuadrado [-1,1]²
  const recta8=(t,d)=>{const n=[Math.cos(rad(t)),Math.sin(rad(t))],u=[-n[1],n[0]],P0=[n[0]*d,n[1]*d];let t0=-9,t1=9;
    for(const [pp,dd] of [[P0[0],u[0]],[P0[1],u[1]]]){if(Math.abs(dd)<1e-12)continue;let a=(-1-pp)/dd,b=(1-pp)/dd;if(a>b)[a,b]=[b,a];t0=Math.max(t0,a);t1=Math.min(t1,b);}
    return [P0[0]+u[0]*t0,P0[1]+u[1]*t0,P0[0]+u[0]*t1,P0[1]+u[1]*t1];};
  const ocho=(R)=>Array.from({length:8},(_,i)=>[R*Math.cos(rad(22.5+45*i)),R*Math.sin(rad(22.5+45*i))]);
  const estrella=(R)=>{const V=ocho(R);return V.map((v,i)=>[...v,...V[(i+3)%8]]);}; // vértices unidos de tres en tres
  const vt=[-0.04*k,-0.04*k,2.08*k,2.08*k],vtB=[-0.5,-0.5,4*k+1,4*k+1],vtG=[-0.5,-0.5,8*k+1,8*k+1];
  Object.assign(p,{vt,
  resumen:'Estrellas azules de ocho puntas rodeadas de zafates verdes, melados y negros, sobre un fondo de piezas blancas. Reviste las paredes de las tacas, las pequeñas hornacinas del arco de entrada a la Torre de Comares.',
  pie:'Todo sale de un cuadrado con su circunferencia inscrita: dos cuadrados girados 45° dan un octógono, y dos octógonos estrellados, cada vez más pequeños, dan las líneas del módulo. El módulo se replica por simetría y la baldosa resultante, por traslación.',
  pasos:[
    {h:'Cuadrado, ejes y circunferencia',t:'Inicia el dibujo a partir de un cuadrado al que habrás trazado sus diagonales y ejes. Tomando como centro el del cuadrado, dibuja la circunferencia inscrita.',c:'Es la circunferencia inscrita de «Aprender a trazar».',anim:'fade',
     guia(){return ln([[-1,-1,1,1],[-1,1,1,-1],[-1,0,1,0],[0,-1,0,1]],RO,0.05,'0.3 0.2')+circulos([C],k,RO,0.07);}},
    {h:'Dos cuadrados y un octógono',t:'Traza rectas paralelas a los lados por los puntos donde la circunferencia corta a las diagonales. A continuación, une los puntos medios de los lados del cuadrado. Obtienes dos cuadrados girados 45° y, en el centro, un octógono convexo.',c:'Las paralelas quedan a 0,71 del centro, con el radio de la circunferencia como unidad.',anim:'draw',
     guia(){return an([[-1,-a1,1,-a1],[-1,a1,1,a1],[-a1,-1,-a1,1],[a1,-1,a1,1]],RO,0.07)+an([[0,-1,1,0],[1,0,0,1],[0,1,-1,0],[-1,0,0,-1]],RO,0.07);}},
    {h:'Octógono estrellado',t:'Uniendo los vértices del octógono central de modo no consecutivo, de tres en tres, dibuja un octógono estrellado. Observa que en su centro aparece un nuevo octógono convexo.',c:'Sus lados son paralelos a los ejes y a las diagonales.',anim:'draw',
     guia(){return an(estrella(a1/Math.cos(rad(22.5))),RO,0.08);}},
    {h:'Otro octógono estrellado',t:'Dibuja otro octógono estrellado, más pequeño todavía, tomando como vértices los del nuevo octógono central. Prolonga sus lados hasta su intersección con los del cuadrado.',c:'Son ocho rectas muy cerca del centro: dos paralelas a cada eje y a cada diagonal.',anim:'draw',
     guia(){const L=[];for(let i=0;i<8;i++)L.push(recta8(45*i,d3));return ln(estrella(d2/Math.cos(rad(22.5))),'#2b4f73',0.05)+an(L,RO,0.08);}},
    {h:'El módulo básico',t:'De las líneas obtenidas en los pasos anteriores, remarca los trazos adecuados para obtener el módulo básico.',c:'Si divides el cuadrado por sus ejes, las cuatro partes son iguales, aunque giradas 90° alrededor del centro: es la unidad básica mínima.',tipo:'remarcar'},
    {h:'Simetría',t:'Una vez obtenido el módulo, replícalo por simetría tomando como ejes dos de sus lados perpendiculares.',c:'Sale una baldosa de 2 × 2 módulos.',tipo:'piezas',vt:vtB},
    {h:'Repetir la baldosa',t:'Repite por traslación, en sentido vertical y horizontal, la baldosa obtenida en el paso anterior.',c:'En Teselar verás que basta un cuadrado más pequeño, girado 45°, para cubrir el plano.',tipo:'piezas',vt:vtG},
    {h:'Color',t:'En el alicatado, los sinos son azules; los zafates, verdes, melados y negros, y el resto de las piezas, blancas. En el panel los bordes se rematan y se corona con un friso de almenillas blancas y negras, que aquí no se dibujan.',c:'Prueba otras combinaciones en la pestaña Colorear.',tipo:'color',vt:vtG}]});
})();

// Dibuja un paso del trazado de un patrón nuevo
function dibujarPaso(p,n,render,lista){const PS=lista||p.pasos,s=PS[n-1],vt=s.vt||p.vt,[x0,y0,w,h]=vt,pad=w*0.03;
  // p.giro: el alicatado está girado en el muro; los pasos lo enseñan derecho, como en el libro (salvo s.sinGiro)
  const giro=p.giro&&!s.sinGiro?[p.giro,x0+w/2,y0+h/2]:null;
  const marco=`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="none" stroke="#2b2b2b" stroke-width="0.08"/>`;
  if(s.tipo==='cinta'){const o={x0,y0,w,h,cols:Array(p.nombres.length).fill('#ffffff'),over:{},ribbon:'#ffffff',outline:'#222222',rw:p.rw,ow:0.06,interlace:!!s.entrelazar,frame:true,giro};
    const sv=render(p.D,o).replace('<svg ','<svg style="pointer-events:none" ');
    return `<div class="fade">${s.guia?sv.replace(/<\/svg>\s*$/,`<g class="fade">${s.guia(p,vt)}</g></svg>`):sv}</div>`;}
  if(s.tipo==='piezas'||s.tipo==='color'){
    const pal=s.tipo==='color'?Object.values(p.paletas)[0]:{cols:Array(p.nombres.length).fill('#ffffff'),ribbon:'#222222',outline:'#222222'};
    const o={x0,y0,w,h,cols:pal.cols,over:{},ribbon:pal.ribbon,outline:pal.outline,rw:s.tipo==='color'?p.rw:0.1,ow:s.tipo==='color'?p.ow:0,interlace:p.tipo!=='mosaico',frame:true,giro};
    return `<div class="fade">${render(p.D,o).replace('<svg ','<svg style="pointer-events:none" ')}</div>`;}
  let g='';
  PS.slice(0,n).forEach((q,i)=>{if(!q.guia)return;const cur=i===n-1;let gq=q.guia(p,vt);
    // los pasos anteriores ya están dibujados: sin animación, solo el paso actual se traza
    if(!cur)gq=gq.replace(/ class="(draw|fade)"/g,'');
    g+=`<g class="${cur?(q.anim||'fade')+' actual':'previo'}${s.tipo==='remarcar'?' dim':''}">${gq}</g>`;});
  if(s.tipo==='remarcar'){const L=[];for(const [cl,pts] of p.D.S)for(let k=0;k+2<pts.length+(cl?2:0);k+=2){const a=k,b=(k+2)%pts.length;
      const sg=[pts[a],pts[a+1],pts[b],pts[b+1]],mg=giro?w*0.25:1;if(Math.max(sg[0],sg[2])<x0-mg||Math.min(sg[0],sg[2])>x0+w+mg||Math.max(sg[1],sg[3])<y0-mg||Math.min(sg[1],sg[3])>y0+h+mg)continue;L.push(sg);}
    const cx=x0+w/2,cy=y0+h/2;L.sort((a,b)=>Math.hypot((a[0]+a[2])/2-cx,(a[1]+a[3])/2-cy)-Math.hypot((b[0]+b[2])/2-cx,(b[1]+b[3])/2-cy));
    g+=`<g class="actual">`+(giro?`<g transform="rotate(${giro.join(' ')})">${animar(L,'#1b1b1b',0.17)}</g>`:animar(L,'#1b1b1b',0.17))+'</g>';}
  const fz=Math.max(w,h)/24;if(Math.abs(fz-1)>0.2){g=g.replace(/stroke-width="([\d.]+)"/g,(m,v)=>`stroke-width="${+(v*fz).toFixed(3)}"`).replace(/stroke-dasharray="([\d. ]+)"/g,(m,v)=>`stroke-dasharray="${v.split(' ').map(n=>+(n*fz).toFixed(3)).join(' ')}"`);}
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0-pad} ${y0-pad} ${w+2*pad} ${h+2*pad}" width="100%"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#fffefa"/><defs><clipPath id="tzclip2"><rect x="${x0}" y="${y0}" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#tzclip2)">${g}</g>${marco}</svg>`;}
return {P,recta,redTriangulos,poligono,contorno,dibujarPaso};
})();

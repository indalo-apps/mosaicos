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
    return 1;},                                                   // pieza grande (negra, con una muesca)
  nombres:['Estrella de seis','Pieza grande','Estrella de cuatro melada','Estrella de cuatro verde','Estrella de ocho negra','Estrella de ocho melada','Pieza en V','Pieza pequeña'],
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

// ===== LA ALHAMBRA · Sala de los Reyes, muro occidental (alicatado n.º 28) =====
// Cuadrado de lado 2 con ejes, diagonales y circunferencia inscrita (radio 1). Arcos de radio 1 con centro en los vértices: cortan
// las diagonales a √2 − 1 del centro (T). Octógono inscrito con vértices en ejes y diagonales; sus lados prolongados llegan al cuadrado
// en E, a 2 − √2 del eje. Las rectas E–T, prolongadas hasta los ejes, dan la estrella de ocho (módulo A) o la de cuatro (módulo B).
// La baldosa son dos módulos de cada tipo en orden alterno (periodo de 4 × 4). Las prolongaciones del octógono quedan dentro de la
// estrella melada que se forma entre cuatro módulos (es una sola pieza en el despiece), así que no son aristas de pieza.
(function(){const a=Math.SQRT1_2,e=2-Math.SQRT2,t=1-a,ri=(Math.SQRT2-1)*Math.cos(3*Math.PI/8)/Math.cos(Math.PI/8);
const OCT=Array.from({length:8},(_,i)=>[Math.cos(rad(45*i)),Math.sin(rad(45*i))]);
const E8=[];for(const sx of [1,-1])for(const sy of [1,-1])E8.push([[sx*e,sy],[sx*t,sy*t]],[[sx,sy*e],[sx*t,sy*t]]); // de E a la punta T del mismo cuadrante
const est8=Array.from({length:16},(_,i)=>{const r=i%2?ri:Math.SQRT2-1,g=rad(22.5*i);return[r*Math.cos(g),r*Math.sin(g)];});
const c4=3-2*Math.SQRT2; // vértices entrantes de la estrella de cuatro, en los ejes (donde E–T corta al eje)
const est4=Array.from({length:8},(_,i)=>{const g=rad(45*i);return i%2?[t*Math.sign(Math.cos(g)),t*Math.sign(Math.sin(g))]:[c4*Math.round(Math.cos(g)),c4*Math.round(Math.sin(g))];});
function modulo(tipo){const L=[...contorno(OCT)];for(const [p,q] of E8)L.push([...p,...q]);L.push(...contorno(tipo==='A'?est8:est4));return L;}
const area=Q=>{let S=0;for(let i=0;i<Q.length;i++){const p=Q[i],q=Q[(i+1)%Q.length];S+=p[0]*q[1]-q[0]*p[1];}return Math.abs(S)/2;};
const tipoEn=(x,y)=>(Math.floor(x/2)+Math.floor(y/2))%2===0?'A':'B';
P.reyes28=escalar({id:'reyes28',coleccion:'alhambra',num:28,nombre:'Ruedas de zafates y estrellas meladas',lugar:'Muro occidental · Sala de los Reyes · Palacio de los Leones',tipo:'mosaico',
  W:4,H:4,
  lineas(){const L=[];for(let i=-1;i<=2;i++)for(let j=-1;j<=2;j++){const cx=1+2*i,cy=1+2*j,tp=((i+j)%2+2)%2===0?'A':'B';
    for(const s of modulo(tp))L.push([s[0]+cx,s[1]+cy,s[2]+cx,s[3]+cy]);}return L;},
  clase(Q,[x,y]){const n=Q.length,mx=Math.floor(x/2),my=Math.floor(y/2),ux=x-2*mx-1,uy=y-2*my-1,enCentro=Math.hypot(ux,uy)<0.05;
    if(n===16)return enCentro?4:3;              // estrella de ocho: blanca en el centro del módulo A, melada entre cuatro módulos
    if(enCentro)return 5;                        // estrella de cuatro blanca, en el centro del módulo B
    if(n===4)return 6;                           // almendrilla
    if(tipoEn(x,y)==='A')return 0;               // zafates de las ruedas de estrella de ocho: negros
    return ((my%2)+2)%2===0?1:2;},               // ruedas de estrella de cuatro: una fila verde, la siguiente azul
  nombres:['Zafate negro','Zafate verde','Zafate azul','Estrella de ocho melada','Estrella de ocho blanca','Estrella de cuatro blanca','Almendrilla'],
  paletas:{
    'Alhambra':{cols:['#161616','#2f6f68','#4b4fae','#c98b2b','#ffffff','#ffffff','#ffffff'],ribbon:'#ffffff',outline:'#ffffff'},
    'Azul y oro':{cols:['#1d2a55','#3d63a8','#2f4fa3','#e0b04a','#ffffff','#ffffff','#ffffff'],ribbon:'#ffffff',outline:'#ffffff'},
    'Terracota':{cols:['#5a3022','#8a4b36','#b8694d','#e8b49a','#fbf4ec','#fbf4ec','#fbf4ec'],ribbon:'#fbf4ec',outline:'#fbf4ec'},
    'Para colorear':{cols:Array(7).fill('#ffffff'),ribbon:'#222222',outline:'#222222'}}
});
Object.assign(P.reyes28,{Gr:{a,e,t,ri},modBase:modulo,OCT,vistaModulo:[0,0,4*P.reyes28.k,4*P.reyes28.k],
  modulo:{m:4*P.reyes28.k,cx:2*P.reyes28.k,cy:2*P.reyes28.k,giro:0,fig:0.25}}); // la baldosa del paso 7: dos módulos de cada tipo
})();

// ===== LA ALHAMBRA · Sala de los Reyes, zócalos (alicatado n.º 29) =====
// Circunferencia de radio 1 dividida en doce; dos hexágonos (paso 2, con un vértice arriba; paso 3, girado 30°) y dos estrellas de
// dos triángulos (pasos 4 y 5), con sus lados a √3/4 del centro. Los cruces más alejados de los cuatro triángulos (a √3/4 ÷ cos 45°)
// unidos de cinco en cinco dan la estrella de doce del paso 6: sus lados, prolongados, son doce rectas a h del centro, que forman
// las calles de los doce zafates. Las seis paralelas a las diagonales del hexágono del paso 2 llegan a él en sus extremos; unidos (paso 7)
// dan un hexágono cuyos lados forman las muescas de los zafates escotados. El hexágono del paso 8 (vértices en los puntos medios del
// del paso 2) da la punta de los zafates redondos. El módulo es el hexágono del paso 2 y se repite por traslación (paso 10).
(function(){const s3=Math.sqrt(3),r0=s3/4/Math.cos(Math.PI/4),h=r0*Math.cos(5*Math.PI/12);
const tE=1-h/s3,          // la calle llega al lado del hexágono del paso 2 (esquina de la muesca)
      tV=1-2*h/s3,        // fondo de la muesca (lados del hexágono del paso 7)
      tR=s3/2-h/s3,       // esquina del zafate redondo (lados del hexágono del paso 8)
      tP=s3/2;            // punta del zafate redondo (vértice del hexágono del paso 8)
const giro=(p,g)=>{const c=Math.cos(rad(g)),s=Math.sin(rad(g));return[p[0]*c-p[1]*s,p[0]*s+p[1]*c];};
// zafate en la dirección f (grados): en coordenadas propias el eje es +y
function modulo(){const L=[],seg=(a,b,f)=>{const A=giro(a,f),B=giro(b,f);L.push([A[0],A[1],B[0],B[1]]);};
  for(let k=0;k<12;k++){const f=30*k,esc=f%60===30,fin=esc?tE:tR;   // en coordenadas del zafate: eje +x
    for(const sg of [1,-1])seg([h,sg*h],[fin,sg*h],f);               // los dos lados, desde el vértice entrante del sino
    if(esc){seg([tE,h],[tV,0],f);seg([tE,-h],[tV,0],f);}              // la muesca
    else{seg([tR,h],[tP,0],f);seg([tR,-h],[tP,0],f);}}               // la punta
  return L;}
const area=Q=>{let S=0;for(let i=0;i<Q.length;i++){const p=Q[i],q=Q[(i+1)%Q.length];S+=p[0]*q[1]-q[0]*p[1];}return Math.abs(S)/2;};
// centro de la rueda más cercana (red de hexágonos: columnas a √3, filas a 1,5 desplazadas media columna)
function rueda(x,y){let m=null,d=9;for(const j of [Math.floor(y/1.5),Math.ceil(y/1.5)]){const o=j%2?s3/2:0,i=Math.round((x-o)/s3),c=[i*s3+o,j*1.5],e=Math.hypot(x-c[0],y-c[1]);if(e<d){d=e;m=c;}}return m;}
P.reyes29=escalar({id:'reyes29',coleccion:'alhambra',num:29,pags:'146 a 149',nombre:'Ruedas de doce zafates',lugar:'Zócalos · Sala de los Reyes · Palacio de los Leones',tipo:'mosaico',
  W:s3,H:3,
  lineas(){const L=[];for(let i=-1;i<=2;i++)for(let j=-1;j<=2;j++){const cx=i*s3+(j%2?s3/2:0),cy=j*1.5;for(const t of modulo())L.push([t[0]+cx,t[1]+cy,t[2]+cx,t[3]+cy]);}return L;},
  clase(Q,[x,y]){const n=Q.length,A=area(Q)/this.k/this.k;
    if(n>=20)return 0;                                   // sino
    if(n===4)return 6;                                   // almendrilla
    if(A<0.07)return 7;                                  // pieza blanca entre zafates
    if(A<0.1)return 5;                                   // hexágono blanco (en cada vértice del módulo)
    const [cx,cy]=rueda(x,y),dx=x-cx,dy=y-cy;
    if(A<0.122)return Math.abs(dy)<0.2*Math.abs(dx)?3:4; // zafate redondo: azul si es horizontal, negro si no
    // zafate escotado: el color va por grupos de tres, alrededor del hexágono blanco del vértice al que apunta
    const g=Math.atan2(dy,dx),vy=cy+Math.sin(g),f=((Math.round(vy*2)%6)+6)%6; // altura del vértice, en medios
    return f===1||f===5?1:2;},                           // melado a 0,5 y 2,5; verde a 1 y 2
  nombres:['Sino (estrella de doce)','Zafate escotado melado','Zafate escotado verde','Zafate redondo azul','Zafate redondo negro','Hexágono','Almendrilla','Pieza blanca'],
  paletas:{
    'Alhambra':{cols:['#161616','#c98b2b','#48876c','#3c587f','#161616','#ffffff','#ffffff','#ffffff'],ribbon:'#ffffff',outline:'#ffffff'},
    'Azul y oro':{cols:['#1d2a55','#e0b04a','#3d63a8','#2f4fa3','#1d2a55','#ffffff','#ffffff','#ffffff'],ribbon:'#ffffff',outline:'#ffffff'},
    'Terracota':{cols:['#5a3022','#d98e6e','#8a4b36','#b8694d','#5a3022','#fbf4ec','#fbf4ec','#fbf4ec'],ribbon:'#fbf4ec',outline:'#fbf4ec'},
    'Para colorear':{cols:Array(8).fill('#ffffff'),ribbon:'#222222',outline:'#222222'}}
});
Object.assign(P.reyes29,{Gz:{h,r0,tE,tV,tR,tP},modBase:modulo,modulo:{tipo:'hex',R:P.reyes29.k,cx:s3/2*P.reyes29.k,cy:1.5*P.reyes29.k}}); // el módulo es el hexágono del paso 2
})();

// ===== LA ALHAMBRA · Jambas del Palacio de los Leones (alicatado n.º 31) =====
// Cuadrado de lado 2 con su circunferencia inscrita de radio 1 (la unidad). Paso 1: dos cuadrados (vértices en los ejes y en las
// diagonales) que se cortan en 8 puntos a r1 del centro: los centros de las 8 ruedas de ocho. Paso 5: A = (−½, ½), punto medio de un
// lado del cuadrado de pico; B = (0, √2/2); la circunferencia de centro A y radio AB es tangente a la de centro C (el centro) y radio CD
// y a la de centro E (centro de rueda) y radio EF. Con CD salen los sinos (estrella {16/6} en el centro, {8/3} en las ruedas) y con EF,
// el octógono de cada rueda (pasos 6 y 7). Sus lados prolongados (pasos 8 y 9) son las rectas de todo el dibujo.
// Las ruedas de dieciséis están en (i, j) con i + j par: las líneas se repiten al mover (1, 1); el color, cada 2.
// TR: los trazos que se destacan en el paso 10, en el triángulo (0,0), (1,0), (½,½), con las coordenadas de sus cruces; el resto sale por
// simetría (ejes, diagonales y la recta x + y = 1, que lleva el centro a la esquina). En el centro de cada lado está la estrella del paso 12.
(function(){const s2=Math.SQRT2,A=[-0.5,0.5],B=[0,1/s2],r1=Math.hypot(1/s2,1-1/s2),
  AB=Math.hypot(B[0]-A[0],B[1]-A[1]),CD=Math.hypot(A[0],A[1])-AB,EF=AB-Math.hypot(A[0]+1/s2,A[1]-(1-1/s2)),
  w=2*CD*Math.cos(3*Math.PI/8);     // ancho de los zafates: dos rectas de la estrella {16/6}, a CD·cos 67,5° del centro
const TR=[[0.47770483126,0.47770483126,0.47770483126,0.319192163479],[0.47770483126,0.266594274148,0.47770483126,0.129149365689],[0.095021398895,0.063491268887,0.490765038732,0.063491268887],[0.543362928063,0.063491268887,0.680807836521,0.063491268887],[0.733405725852,0.063491268887,0.883910841783,0.063491268887],[0.707106781187,0.224170764584,0.526298944665,0.149277706513],[0.47770483126,0.129149365689,0.292893218813,0.05259788933],[0.290062121707,0.051425210512,0.175576651179,0.004003775925],[0.172745554072,0.002831097107,0.16591068104,0.0],[0.526298944665,0.436508731113,0.429110717854,0.339320504303],[0.391918393633,0.302128180081,0.153281482438,0.063491268887],[0.149277706513,0.059487492962,0.112085382292,0.02229516874],[0.850722293487,0.112085382292,0.802128180081,0.063491268887],[0.638384326957,0.292893218813,0.563491268887,0.112085382292],[0.543362928063,0.063491268887,0.517063983397,0.0],[0.526298944665,0.436508731113,0.589790213552,0.410209786448],[0.244299105408,0.169914456965,0.241468008301,0.168741778147],[0.429110717854,0.246465933324,0.52229516874,0.153281482438],[0.563491268887,0.112085382292,0.675576651179,-0.0],[0.658512667781,0.341487332219,0.47770483126,0.266594274148],[0.429110717854,0.246465933324,0.244299105408,0.169914456965],[0.241468008301,0.168741778147,0.126982537773,0.12132034356],[0.124151440666,0.120147664742,0.117316567635,0.117316567635],[0.365619448968,0.365619448968,0.391918393633,0.302128180081],[0.490765038732,0.063491268887,0.517063983397,-0.0],[0.589790213552,0.410209786448,0.638384326957,0.292893218813],[0.658512667781,0.244299105408,0.733405725852,0.063491268887],[0.126982537773,0.12132034356,0.124151440666,0.120147664742],[0.365619448968,0.365619448968,0.429110717854,0.339320504303],[0.47770483126,0.319192163479,0.658512667781,0.244299105408],[0.707106781187,0.224170764584,0.824423348821,0.175576651179],[0.153281482438,0.063491268887,0.149277706513,0.059487492962],[0.755700894592,0.244299105408,0.680807836521,0.063491268887],[0.47770483126,0.47770483126,0.52229516874,0.47770483126],[0.936508731113,0.063491268887,0.936508731113,0.026298944665],[0.824423348821,0.175576651179,0.827254445928,0.168741778147],[0.828427124746,0.16591068104,0.850722293487,0.112085382292],[0.52229516874,0.153281482438,0.526298944665,0.149277706513],[0.117316567635,0.117316567635,0.095021398895,0.063491268887],[0.112085382292,0.02229516874,0.16591068104,-0.0],[0.827254445928,0.168741778147,0.828427124746,0.16591068104],[0.936508731113,0.026298944665,0.910209786448,0.0],[0.292893218813,0.05259788933,0.290062121707,0.051425210512],[0.175576651179,0.004003775925,0.172745554072,0.002831097107],[0.675576651179,0.0,0.707106781187,0.031530130008],[0.707106781187,0.031530130008,0.738636911195,0.0],[0.759704670517,0.0,0.786003615182,0.063491268887],[0.883910841783,0.063491268887,0.883910841783,0.026298944665],[0.883910841783,0.026298944665,0.910209786448,0.0]];
// las ocho simetrías del cuadrado y la red de las ruedas de dieciséis
const D4=[[1,0,0,1],[0,-1,1,0],[-1,0,0,-1],[0,1,-1,0],[1,0,0,-1],[-1,0,0,1],[0,1,1,0],[0,-1,-1,0]];
function trazos(){const L=[];
  for(const [a,b,c,d] of D4)for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++){if((i+j)%2)continue;
    for(const [x1,y1,x2,y2] of TR){const X1=a*x1+b*y1+i,Y1=c*x1+d*y1+j,X2=a*x2+b*y2+i,Y2=c*x2+d*y2+j;
      if(Math.max(Math.abs(X1+X2),Math.abs(Y1+Y2))/2<1.35)L.push([X1+1,Y1+1,X2+1,Y2+1]);}}   // la tesela va de (0,0) a (2,2)
  return L;}
const area=Q=>{let S=0;for(let i=0;i<Q.length;i++){const p=Q[i],q=Q[(i+1)%Q.length];S+=p[0]*q[1]-q[0]*p[1];}return Math.abs(S)/2;};
// centro de rueda de ocho más cercano (las ruedas, módulo 2) y su color: meladas a 22,5° + 90°·m del centro de la tesela, verdes las otras
const RU=Array.from({length:8},(_,k)=>{const g=(22.5+45*k)*Math.PI/180;return[r1*Math.cos(g),r1*Math.sin(g),k%2];});
function rueda(x,y){const u=((x-1)%2+3)%2-1,v=-(((y-1)%2+3)%2-1);   // v hacia arriba, como en el libro
  let m=null,d=9;
  for(const [cx,cy,k] of RU)for(const ox of [-2,0,2])for(const oy of [-2,0,2]){const e=Math.hypot(u-cx-ox,v-cy-oy);if(e<d){d=e;m=k;}}return [d,m];}
P.jambas31=escalar({id:'jambas31',coleccion:'alhambra',num:31,nombre:'Ruedas de dieciséis y de ocho',lugar:'Jambas · Palacio de los Leones',tipo:'mosaico',
  W:2,H:2,
  lineas(){return trazos();},
  clase(Q,[x,y]){const a=area(Q)/this.k/this.k,es=v=>Math.abs(a-v)<0.003*v;
    if(es(0.059184))return 0;                // sino de la rueda de dieciséis (estrella {16/6})
    if(es(0.033189))return 1;                // zafate de la rueda de dieciséis
    if(es(0.014794))return 2;                // zafate arpado: los cuatro que rodean la estrella del centro de cada lado
    if(es(0.018891))return 3;                // sino de la rueda de ocho y estrella del paso 12 (son iguales)
    if(es(0.014427)){const [d,k]=rueda(x,y);return d<0.23?(k?4:5):6;}   // zafate: de una rueda (verde o melado) o intermedio (violáceo)
    if(es(0.001988))return 7;                // cuadradito (también el que hay entre el zafate arpado y el violáceo)
    if(es(0.017572))return 8;if(es(0.017735))return 9;if(es(0.015995))return 10;if(es(0.008711))return 11;
    if(es(0.006835))return 12;return 13;},   // almendrillas de las ruedas de dieciséis y de ocho
  nombres:['Estrella de dieciséis (sino)','Zafate negro de la rueda de dieciséis','Zafate arpado negro','Sino (estrella de ocho)','Zafate verde','Zafate melado','Zafate violáceo','Cuadradito negro','Candilejo grande','Candilejo del lado','Candilejo junto a la estrella','Candilejo entre ruedas','Almendrilla de la rueda de dieciséis','Almendrilla de la rueda de ocho'],
  paletas:{
    'Alhambra':{cols:['#5b79ad','#161616','#161616','#5b79ad','#2f5e45','#c08a25','#4a4150','#161616','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff'],ribbon:'#ffffff',outline:'#ffffff'},
    'Azul y oro':{cols:['#e0b04a','#1d2a55','#1d2a55','#e0b04a','#3d63a8','#9ab6dc','#2f4fa3','#1d2a55','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff'],ribbon:'#ffffff',outline:'#ffffff'},
    'Terracota':{cols:['#d98e6e','#5a3022','#5a3022','#d98e6e','#8a4b36','#b8694d','#7a3b26','#5a3022','#fbf4ec','#fbf4ec','#fbf4ec','#fbf4ec','#fbf4ec','#fbf4ec'],ribbon:'#fbf4ec',outline:'#fbf4ec'},
    'Para colorear':{cols:Array(14).fill('#ffffff'),ribbon:'#222222',outline:'#222222'}}
});
Object.assign(P.jambas31,{Gj:{r1,AB,CD,EF,w,A,B},TR,modulo:{m:2*P.jambas31.k,cx:P.jambas31.k,cy:P.jambas31.k,giro:0}});
})();

// ===== LA ALHAMBRA · Torre de las Damas, El Partal: alicatados A (n.º 36) y B (n.º 37) =====
// Los dos se trazan en un cuadrado de lado 2 (la unidad es medio lado) que se repite por traslación. T: los ejes de las cintas con el
// punto medio en el triángulo (0,0), (1,0), (1,1), con las coordenadas exactas de sus cruces (y hacia arriba, como en el libro);
// el resto sale por las ocho simetrías del cuadrado. Se sacaron del paso 10 (n.º 36) y del paso 7 (n.º 37) del libro, tramo a tramo
// sobre las rectas de la construcción, y se comprobaron con las páginas de color.
const D4c=[[1,0,0,1],[0,-1,1,0],[-1,0,0,-1],[0,1,-1,0],[1,0,0,-1],[-1,0,0,1],[0,1,1,0],[0,-1,-1,0]];
function simetrizar(T){const L=[],vis=new Set();for(const [a,b,c,d] of D4c)for(const [x1,y1,x2,y2] of T){const p=[a*x1+b*y1,c*x1+d*y1],q=[a*x2+b*y2,c*x2+d*y2];
  const k=[p,q].map(v=>v.map(n=>(n+0).toFixed(6)).join(',')).sort().join('|');if(vis.has(k))continue;vis.add(k);L.push([...p,...q]);}return L;}
const areaD=Q=>{let S=0;for(let i=0;i<Q.length;i++){const p=Q[i],q=Q[(i+1)%Q.length];S+=p[0]*q[1]-q[0]*p[1];}return S/2;};
const entrantesD=Q=>{const s=Math.sign(areaD(Q));let r=0;for(let i=0;i<Q.length;i++){const a=Q[(i+Q.length-1)%Q.length],b=Q[i],c=Q[(i+1)%Q.length],cr=(b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]);if(Math.sign(cr)===-s&&Math.abs(cr)>1e-9)r++;}return r;};
// ¿está el punto (u, v) del módulo sobre alguno de estos tramos?
const sobre=(L,u,v)=>L.some(([x1,y1,x2,y2])=>{const dx=x2-x1,dy=y2-y1,l2=dx*dx+dy*dy,t=((u-x1)*dx+(v-y1)*dy)/l2;return t>-1e-4&&t<1+1e-4&&Math.abs((u-x1)*dy-(v-y1)*dx)/Math.sqrt(l2)<1e-4;});
const enModulo=(k,x,y)=>[((x/k)%2+2)%2-1,1-((y/k)%2+2)%2];   // de la app (y hacia abajo, módulo de 0 a 2) al libro (centro 0, y hacia arriba)

// n.º 36. Circunferencia de radio √2 con dos cuadrados inscritos (el de lados paralelos a los ejes es el módulo). Rectas del trazado:
// a e = 3/√2 − 2 (las barras del paso 4 y la estrella del paso 8), √2 − 1 (octógono estrellado del paso 2), 1/√2 (paso 3),
// 5/√2 − 3 y 3 − 3/√2 (paso 5) y, a 22,5°, 4 − 5/√2 (los cuadrados del paso 7, en la circunferencia de radio AB = 4√2 − 5).
// La cinta mide A/4, con A = 2e (paso 11: cuerda y calle en proporción 1/3). Las cintas verdes son las de los tramos VERDE.
(function(){const s2=Math.SQRT2,e=3/s2-2,AB=4*s2-5,rB=e/Math.sin(rad(22.5)),A=2*e,w=A/4;
const T36=[[0.87867965644,-0.363961030679,0.87867965644,0.363961030679],[0.87867965644,0.535533905933,0.87867965644,1],[0.092854570978,-0.092854570978,0.707106781187,0.161577025208],[0.502734477519,0,0.606854196949,0.251367238759],[1,0.828427124746,0.828427124746,1],[0,0.131316193606,0.614252210208,0.385747789792],[0.614252210208,0.385747789792,0.535533905933,0.464466094067],[0.707106781187,-0.050252531694,1,0.242640687119],[0.606854196949,0.251367238759,0.35548695819,0.35548695819],[0.464466094067,0.535533905933,0.87867965644,0.535533905933],[0.87867965644,0.363961030679,0.363961030679,0.87867965644],[1,0.585786437627,0.585786437627,1],[0.707106781187,0.050252531694,0.707106781187,0.161577025208]];
const VERDE=simetrizar([0,3,8,10,11].map(i=>T36[i]));   // el octógono grande, la estrella que rodea la rueda y las diagonales de las esquinas
const modulo=()=>simetrizar(T36);
P.damas36=escalar({id:'damas36',coleccion:'alhambra',num:36,pags:'177 a 183',nombre:'Cintas verdes y azules',lugar:'Torre de las Damas · Alicatado A · El Partal',tipo:'cinta',
  W:2,H:2,
  lineas(){return modulo().map(([x1,y1,x2,y2])=>[x1+1,1-y1,x2+1,1-y2]);},
  clase(Q){const n=Q.length,a=Math.abs(areaD(Q))/this.k/this.k;
    if(n===12)return entrantesD(Q)===6?0:1;if(n===16)return 3;if(n===6)return 2;
    if(n===3)return a>0.008?8:10;
    if(n===4)return entrantesD(Q)?7:9;
    if(n===8){const r=entrantesD(Q);return r===1?4:r===2?6:5;}
    return 0;},
  cinta(pts){const [u,v]=enModulo(this.k,(pts[0]+pts[2])/2,(pts[1]+pts[3])/2);return sobre(VERDE,u,v)?11:12;},
  nombres:['Pieza grande del borde','Pieza grande junto a la rueda','Alfardón (hexágono alargado)','Estrella de ocho del centro','Pieza del borde','Octógono de la esquina','Punta con muesca','Punta de flecha','Triángulo','Almendrilla','Triángulo pequeño','Cinta verde','Cinta azul'],
  paletas:{
    'Alhambra':{cols:[...Array(11).fill('#fbfaf5'),'#45b994','#26406f'],ribbon:'#fbfaf5',outline:'#1c1c1c'},
    'Azul y oro':{cols:[...Array(11).fill('#fbf7ee'),'#d4a83c','#1d2a55'],ribbon:'#fbf7ee',outline:'#1c1c1c'},
    'Terracota':{cols:[...Array(11).fill('#fbf4ec'),'#d98e6e','#5a3022'],ribbon:'#fbf4ec',outline:'#3a2a20'},
    'Para colorear':{cols:Array(13).fill('#ffffff'),ribbon:'#ffffff',outline:'#222222'}}
});
Object.assign(P.damas36,{rw:+(w*P.damas36.k).toFixed(4),ow:0.06,cintas:[11,12],G36:{e,AB,rB,A,w},modBase:modulo,T:T36,VERDE,
  modulo:{m:2*P.damas36.k,cx:P.damas36.k,cy:P.damas36.k,giro:0}});
})();

// n.º 37. Circunferencia de radio 1 dividida en doce: lados de los dos hexágonos (a √3/2), estrella {12/5} (a cos 75°/√3) y, en las
// esquinas, la estrella de ocho de dos cuadrados inscrita en la circunferencia de radio rc = √2·(1 − √3/2), que pasa por el cruce de las
// prolongaciones de los hexágonos (rectas a 45° a 1 − √3/2 y a (2 − rc)/√2 del centro). La cinta mide A/4, con A = 2·cos 75°/√3.
(function(){const s3=Math.sqrt(3),h=s3/2,dE=Math.cos(rad(75))/s3,rc=Math.SQRT2*(1-h),A=2*dE,w=A/4;
const T37=[[1,0.42264973081,0.5,0.711324865405],[0.105662432703,0.183012701892,0.788675134595,0.366025403784],[0.866025403784,0.866025403784,0.944505905234,0.866025403784],[1,0,0.788675134595,0.366025403784],[0.211324865405,0,0.711324865405,0.5],[0.866025403784,0.07735026919,0.866025403784,0.676556712803],[0.866025403784,-0.07735026919,0.183012701892,0.105662432703],[1,0.810531309018,0.944505905234,0.866025403784],[0.866025403784,0.676556712803,1,0.810531309018]];
const modulo=()=>simetrizar(T37);
P.damas37=escalar({id:'damas37',coleccion:'alhambra',num:37,pags:'184 a 187',nombre:'Rueda de doce',lugar:'Torre de las Damas · Alicatado B · El Partal',tipo:'cinta',
  W:2,H:2,
  lineas(){return modulo().map(([x1,y1,x2,y2])=>[x1+1,1-y1,x2+1,1-y2]);},
  clase(Q){const n=Q.length,a=Math.abs(areaD(Q))/this.k/this.k;
    if(n>=20)return 0;if(n===16)return 4;if(n===10)return 2;if(n===4)return 7;
    return a>0.11?1:a>0.085?3:a>0.065?5:6;},
  nombres:['Sino (estrella de doce)','Zafate','Pieza de la esquina','Pieza del borde con muesca','Estrella de ocho de la esquina','Hexágono del borde','Candilejo','Almendrilla'],
  paletas:{
    'Alhambra':{cols:['#141414','#141414','#141414','#141414','#141414','#141414','#2b7363','#2b7363'],ribbon:'#fbfaf5',outline:'#1c1c1c'},
    'Azul y blanco':{cols:['#1e3a78','#1e3a78','#1e3a78','#1e3a78','#1e3a78','#1e3a78','#9ab6dc','#9ab6dc'],ribbon:'#ffffff',outline:'#1e3a78'},
    'Terracota':{cols:['#5a3022','#5a3022','#5a3022','#5a3022','#5a3022','#5a3022','#d98e6e','#d98e6e'],ribbon:'#fbf4ec',outline:'#3a2a20'},
    'Para colorear':{cols:Array(8).fill('#ffffff'),ribbon:'#ffffff',outline:'#222222'}}
});
Object.assign(P.damas37,{rw:+(w*P.damas37.k).toFixed(4),ow:0.06,G37:{h,dE,rc,A,w},modBase:modulo,T:T37,
  modulo:{m:2*P.damas37.k,cx:P.damas37.k,cy:P.damas37.k,giro:0}});
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
    {h:'Las piezas',t:'Salen seis piezas distintas: las estrellas de ocho, de seis y de cuatro puntas, la pieza grande, la pieza en V y una pieza pequeña de cuatro lados.',c:'El módulo se repite por traslación. Al repetirlo, las estrellas de ocho y de cuatro alternan sus colores.',tipo:'piezas'},
    {h:'La cinta y el color',t:'Da ancho a la cinta con dos paralelas a cada línea y alterna los cruces por encima y por debajo. En el zaguán, las estrellas de seis y las piezas pequeñas son azules y las piezas grandes, negras. Las estrellas de ocho alternan negro y melado, y las de cuatro, melado y verde.',c:'Prueba otras combinaciones en la pestaña Colorear.',tipo:'color'}]});

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

(function(){const p=P.reyes28,{a,e,t}=p.Gr,k=p.k;
  // las guías se dibujan alrededor del centro del recuadro de cada paso (módulo A en el paso 5, módulo B en el 6)
  const Cn=vt=>[vt[0]+vt[2]/2,vt[1]+vt[3]/2];
  const tr=(L,vt)=>{const [cx,cy]=Cn(vt);return L.map(([x1,y1,x2,y2])=>[cx+x1*k,cy+y1*k,cx+x2*k,cy+y2*k]);};
  const ln=(L,vt,col,w,d)=>guia(tr(L,vt),col,w,d),an=(L,vt,col,w)=>animar(tr(L,vt),col,w);
  const arcos=(vt,col,w)=>{const [cx,cy]=Cn(vt),X=v=>+(cx+v*k).toFixed(3),Y=v=>+(cy+v*k).toFixed(3),r=+k.toFixed(3);
    return `<g fill="none" stroke="${col}" stroke-width="${w}">`+[[1,1],[-1,1],[-1,-1],[1,-1]].map(([sx,sy])=>`<path pathLength="1" d="M${X(sx)} ${Y(0)} A${r} ${r} 0 0 ${sx*sy>0?0:1} ${X(0)} ${Y(sy)}"/>`).join('')+'</g>';};
  const oct=p.OCT,ladosOct=contorno(oct),prolong=[];
  for(const sx of [1,-1])for(const sy of [1,-1])prolong.push([sx*a,sy*a,sx*e,sy],[sx*a,sy*a,sx,sy*e]);
  // paso 4: de cada extremo E, por el punto T del mismo cuadrante, hasta el eje más lejano (allí cae la punta de la estrella de ocho)
  const rectas4=[];for(const sx of [1,-1])for(const sy of [1,-1])rectas4.push([sx*e,sy,0,-sy*(Math.SQRT2-1)],[sx,sy*e,-sx*(Math.SQRT2-1),0]);
  const vt=[-0.04*k,-0.04*k,2.08*k,2.08*k],vtB=[1.96*k,-0.04*k,2.08*k,2.08*k],vtT=[-0.5,-0.5,4*k+1,4*k+1],vtG=[-0.5,-0.5,8*k+1,8*k+1];
  Object.assign(p,{vt,
  resumen:'Ruedas de cuatro zafates negros, verdes o azules alrededor de estrellas blancas de ocho o de cuatro puntas, y estrellas meladas de ocho puntas donde se encuentran cuatro ruedas. Decora los zócalos de pilastras y fustes del lateral de la Sala de los Reyes que linda con la galería.',
  pie:'La composición se basa en una red de cuadrados con una circunferencia inscrita en cada uno y, dentro de ella, un octógono convexo. Prolongando los lados del octógono salen las estrellas centrales de cuatro y de ocho puntas: hay dos módulos, que se colocan en orden alterno.',
  pasos:[
    {h:'Cuadrado y circunferencia',t:'En un cuadrado, en el que previamente habremos trazado sus ejes y diagonales, inscribimos una circunferencia.',c:'Es la circunferencia inscrita de «Aprender a trazar».',anim:'fade',
     guia(p,vt){return ln([[-1,-1,1,1],[-1,1,1,-1],[-1,0,1,0],[0,-1,0,1]],vt,RO,0.05,'0.3 0.2')+circulos([Cn(vt)],k,RO,0.07);}},
    {h:'Cuatro arcos',t:'A continuación dibujamos arcos con el mismo radio, tomando como centros los vértices del cuadrado.',c:'Los arcos cortan las diagonales en cuatro puntos: los necesitarás en el paso 4.',anim:'draw',
     guia(p,vt){return arcos(vt,RO,0.07).replace('<g ','<g class="draw" stroke-linecap="round" ');}},
    {h:'El octógono',t:'Dibujamos el octógono inscrito en la circunferencia, para lo cual uniremos los puntos donde ésta corta a las diagonales y los ejes. Prolongamos los lados del octógono hasta su intersección con los del cuadrado.',c:'Cada lado del octógono se prolonga desde su vértice en la diagonal hasta el lado del cuadrado.',anim:'draw',
     guia(p,vt){return an([...ladosOct,...prolong],vt,RO,0.08);}},
    {h:'Las rectas de las estrellas',t:'Unimos los extremos de las prolongaciones de los lados del octógono con los puntos donde los arcos del paso 2 se cortan con las diagonales. Prolongamos estas rectas hasta los ejes del cuadrado.',c:'Son ocho rectas: en el centro forman una estrella de ocho puntas y, más cerca, otra de cuatro.',anim:'draw',
     guia(p,vt){return an(rectas4,vt,'#2b4f73',0.08);}},
    {h:'El módulo con estrella de ocho',t:'Para obtener uno de los módulos remarcamos el octógono y los segmentos necesarios de las líneas anteriores, de modo que formen la estrella de ocho puntas en el centro.',c:'Las puntas de la estrella están en los ejes y en las diagonales, donde los arcos del paso 2 cortan a las diagonales.',tipo:'remarcar'},
    {h:'El módulo con estrella de cuatro',t:'El otro módulo se obtiene de modo similar pero remarcando la estrella central de cuatro puntas.',c:'Las puntas de esta estrella están en las diagonales, en los mismos puntos que las de la estrella de ocho.',tipo:'remarcar',vt:vtB},
    {h:'La baldosa',t:'La baldosa que permite cubrir el plano está formada por cuatro de los módulos anteriores (dos de cada tipo) colocados en orden alterno.',c:'Entre cuatro módulos se forma una estrella de ocho más gruesa: en el despiece es una sola pieza, por eso aquí no se ven las prolongaciones del octógono.',tipo:'piezas',vt:vtT},
    {h:'Color',t:'Los colores empleados son negro, azul, verde, melado y blanco. En el desarrollo podemos observar cómo se distribuyen los colores según la forma de las piezas.',c:'Las ruedas con estrella de ocho son negras; las de estrella de cuatro, verdes en una fila y azules en la siguiente. Las estrellas entre ruedas son meladas y lo demás, blanco.',tipo:'color',vt:vtG}]});
})();

(function(){const p=P.reyes29,{h,r0}=p.Gz,k=p.k,s3=Math.sqrt(3),C=[1.5*s3*k,4.5*k],X=v=>C[0]+v*k,Y=v=>C[1]-v*k; // y hacia arriba, como en el libro
  const T=L=>L.map(([x1,y1,x2,y2])=>[X(x1),Y(y1),X(x2),Y(y2)]);
  const ln=(L,col,w,d)=>guia(T(L),col,w,d),an=(L,col,w)=>animar(T(L),col,w);
  const pol=(n,r,a0)=>Array.from({length:n},(_,i)=>[r*Math.cos(rad(a0+360*i/n)),r*Math.sin(rad(a0+360*i/n))]);
  const lados=V=>V.map((v,i)=>[...v,...V[(i+1)%V.length]]);
  const diag=V=>V.slice(0,V.length/2).map((v,i)=>[...v,...V[i+V.length/2]]);
  const H2=pol(6,1,90),H3=pol(6,1,0);
  const M2=pol(6,s3/2,0),M3=pol(6,s3/2,30);                       // puntos medios de los lados de cada hexágono
  const tri=(M,i)=>lados([M[i],M[i+2],M[i+4]]);
  // estrella de doce del paso 6: lados prolongados = 12 rectas a h del centro, recortadas al hexágono del paso 2
  function recortaHex(nx,ny,d){const u=[-ny,nx],P0=[nx*d,ny*d];let t0=-9,t1=9;
    for(let i=0;i<6;i++){const A=H2[i],B=H2[(i+1)%6],m=[-(B[1]-A[1]),B[0]-A[0]],den=u[0]*m[0]+u[1]*m[1],num=(P0[0]-A[0])*m[0]+(P0[1]-A[1])*m[1];
      if(Math.abs(den)<1e-12)continue;const t=-num/den;if(den>0)t0=Math.max(t0,t);else t1=Math.min(t1,t);}
    return [P0[0]+u[0]*t0,P0[1]+u[1]*t0,P0[0]+u[0]*t1,P0[1]+u[1]*t1];}
  const rectas=a=>a.map(g=>recortaHex(Math.cos(rad(g)),Math.sin(rad(g)),h));
  const P12=pol(12,r0,15),E12=P12.map((v,i)=>[...v,...P12[(i+5)%12]]);
  const a7=s3/2-h,H7=pol(6,a7/Math.cos(Math.PI/6),30),H8=pol(6,s3/2,0);
  const arcos=(col,w)=>{const r=+k.toFixed(3),Q=(x,y)=>`${+X(x).toFixed(3)} ${+Y(y).toFixed(3)}`;
    return `<g class="draw" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round">`+[[0,1],[1,0],[0,-1],[-1,0]].map(([cx,cy])=>{
      const a=Math.atan2(cy,cx),p1=[cx+Math.cos(a+rad(120)),cy+Math.sin(a+rad(120))],p2=[cx+Math.cos(a+rad(240)),cy+Math.sin(a+rad(240))];
      return `<path pathLength="1" d="M${Q(...p1)} A${r} ${r} 0 0 0 ${Q(...p2)}"/>`;}).join('')+'</g>';};
  const vt=[C[0]-1.08*k,C[1]-1.08*k,2.16*k,2.16*k],vtT=[C[0]-2.55*k,C[1]-2.3*k,5.1*k,4.6*k],vtG=[0,0,3*s3*k,4.5*k];
  Object.assign(p,{vt,
  resumen:'Ruedas de doce zafates, redondos y escotados, centradas por un sino negro y con almendrillas blancas. Decoran la parte baja del resto de los muros de la Sala de los Reyes, en unos zócalos más bajos que los colindantes.',
  pie:'La composición se sustenta en una red de hexágonos regulares en cuyos centros se sitúan los sinos de las ruedas que llenan la superficie. Todo sale de dividir una circunferencia en doce partes: dos hexágonos, cuatro triángulos y una estrella de doce puntas.',
  pasos:[
    {h:'La circunferencia en doce',t:'Dividimos una circunferencia en doce partes iguales para lo cual trazaremos arcos del mismo radio de la circunferencia y centros en los extremos de los diámetros perpendiculares.',c:'Es la división en doce de «Aprender a trazar».',anim:'draw',
     guia(){return ln([[-1,0,1,0],[0,-1,0,1]],RO,0.05,'0.3 0.2')+circulos([C],k,RO,0.07)+arcos(RO,0.07);}},
    {h:'El primer hexágono',t:'Dibujamos un primer hexágono regular para lo cual deberemos unir los extremos del diámetro vertical con los puntos de división obtenidos con los arcos trazados desde los extremos de dicho diámetro. Dibujamos también sus diagonales.',c:'Este hexágono, con un vértice arriba, será el módulo que se repite.',anim:'draw',
     guia(){return an([...lados(H2),...diag(H2)],RO,0.08);}},
    {h:'El segundo hexágono',t:'Repetimos la operación tomando ahora el diámetro horizontal y los arcos trazados desde sus extremos. Obtenemos un nuevo hexágono regular y sus diagonales.',c:'Está girado 30° respecto al primero.',anim:'draw',
     guia(){return an([...lados(H3),...diag(H3)],'#2b4f73',0.08);}},
    {h:'Dos triángulos',t:'Unimos, en orden alterno, los puntos medios de los lados del hexágono obtenido en el paso 2. Obtenemos una estrella formada por dos triángulos equiláteros.',c:'Los lados de los triángulos quedan a √3/4 del centro: algo menos de la mitad del radio.',anim:'draw',
     guia(){return an([...tri(M2,0),...tri(M2,1)],RO,0.07);}},
    {h:'Otros dos triángulos',t:'Repetimos la operación con el segundo hexágono obteniendo una nueva estrella formada por dos triángulos equiláteros.',c:'Ahora hay cuatro triángulos que se cortan entre sí.',anim:'draw',
     guia(){return an([...tri(M3,0),...tri(M3,1)],'#2b4f73',0.07);}},
    {h:'La estrella de doce',t:'De los puntos donde se cortan los cuatro triángulos de los pasos anteriores tomamos los más alejados del centro. Los unimos en orden no consecutivo para obtener una estrella de doce puntas. Prolongamos sus lados.',c:'Se unen de cinco en cinco. Los lados prolongados son doce rectas, dos a dos paralelas: las calles de los zafates.',anim:'draw',
     guia(){return ln(E12,'#2b4f73',0.05)+an(rectas(Array.from({length:12},(_,i)=>30*i)),RO,0.07);}},
    {h:'Un hexágono girado',t:'De las rectas anteriores seleccionamos las que son paralelas a las diagonales del hexágono del paso 2 y unimos sus extremos.',c:'Sale otro hexágono con un vértice arriba, algo menor que el del paso 2: sus lados darán las muescas de los zafates escotados.',anim:'draw',
     guia(){return ln(rectas([0,60,120,180,240,300]),'#1d4ed8',0.08)+an(lados(H7),RO,0.09);}},
    {h:'Otro hexágono',t:'Dibujamos un nuevo hexágono regular cuyos vértices sean los puntos medios de los lados del hexágono del paso 2.',c:'Sus vértices darán la punta de los zafates redondos.',anim:'draw',
     guia(){return an(lados(H8),RO,0.09);}},
    {h:'El módulo hexagonal',t:'Finalmente destacamos los trazos adecuados para obtener el módulo hexagonal. Con este método de trazado se da que AB = BC y DE = EF.',c:'AB y BC son lados de la muesca de un zafate escotado; DE y EF, de la punta de un zafate redondo.',tipo:'remarcar'},
    {h:'Repetir el módulo',t:'La repetición del módulo se efectúa por traslación, hasta conseguir rellenar la superficie con los hexágonos.',c:'Podemos dividir el hexágono en seis triángulos iguales. Estos pueden dividirse, a su vez, en dos triángulos rectángulos, que son simétricos. Uno de estos triángulos es la unidad básica mínima.',tipo:'piezas',vt:vtT},
    {h:'Color',t:'Los aliceres que componen el alicatado son de color blanco, negro, verde, melado y azul.',c:'El sino es negro. Los zafates escotados van de tres en tres alrededor de un hexágono blanco, melados o verdes por filas; los redondos son azules si están tumbados y negros si no.',tipo:'color',vt:vtG}]});
})();

(function(){const p=P.jambas31,{r1,AB,CD,EF,w,A,B}=p.Gj,k=p.k,s2=Math.SQRT2,C=[k,k],X=v=>C[0]+v*k,Y=v=>C[1]-v*k; // y hacia arriba, como en el libro
  const T=L=>L.map(([x1,y1,x2,y2])=>[X(x1),Y(y1),X(x2),Y(y2)]);
  const ln=(L,col,wd,d)=>guia(T(L),col,wd,d),an=(L,col,wd)=>animar(T(L),col,wd);
  const pol=(c,n,r,a0)=>Array.from({length:n},(_,i)=>{const g=rad(a0+360*i/n);return[c[0]+r*Math.cos(g),c[1]+r*Math.sin(g)];});
  const une=(V,paso)=>V.map((v,i)=>[...v,...V[(i+paso)%V.length]]);
  // recta (prolongación de un lado) recortada al cuadrado inicial [−1, 1]²
  const corta=([x1,y1,x2,y2])=>{const s=recta([x1,y1],[x2-x1,y2-y1],[-1,-1,1,1]);return s;};
  const prolonga=L=>L.map(corta).filter(Boolean);
  const W8=Array.from({length:8},(_,i)=>{const g=rad(22.5+45*i);return[r1*Math.cos(g),r1*Math.sin(g)];});   // centros de las ruedas de ocho
  const circ=(L,r,col,wd)=>circulos(L.map(([x,y])=>[X(x),Y(y)]),r*k,col,wd);
  const sqA=une(pol([0,0],4,1,0),1),sqB=une(pol([0,0],4,1,45),1);
  const R2=1/Math.cos(rad(22.5)),rad8=Array.from({length:8},(_,i)=>{const g=rad(22.5+45*i);return[0,0,R2*Math.cos(g),R2*Math.sin(g)];}).map(([a,b,c,d])=>corta([a,b,c,d]));
  const sqC=une(pol([0,0],4,R2,22.5),1),sqD=une(pol([0,0],4,R2,67.5),1);
  const lin=(d,a0)=>Array.from({length:8},(_,i)=>{const g=rad(a0+45*i),n=[Math.cos(g),Math.sin(g)];return corta([n[0]*d,n[1]*d,n[0]*d-n[1],n[1]*d+n[0]]);}).filter(Boolean);
  const est16=c=>une(pol(c,16,CD,0),6),est8=c=>une(pol(c,8,CD,0),3),oct=c=>une(pol(c,8,EF,22.5),1);
  const ruedas16=[[0,0],[1,1],[-1,1],[1,-1],[-1,-1]];
  const est12=c=>[...une(pol(c,4,w/2*s2,45),1),...une(pol(c,4,w/2*s2,0),1)]; // estrella del paso 12: dos cuadrados de lado w
  const MID=[[0,1],[1,0],[0,-1],[-1,0]];
  const vt=[-0.04*k,-0.04*k,2.08*k,2.08*k],vtM=[X(-0.34),Y(1.18),0.68*k,0.62*k],vtG=[-0.5,-0.5,4*k+1,4*k+1];
  Object.assign(p,{vt,
  resumen:'Una gran rueda de dieciséis zafates negros alrededor de un sino azul, rodeada de ocho ruedas de ocho con zafates verdes o melados. Reviste las jambas de los arcos que separan las estancias laterales de la sala central; el dibujo seguía en el suelo.',
  pie:'Todo cabe en un cuadrado: en su centro, la rueda de dieciséis puntas, y a su alrededor ocho ruedas de ocho, con los centros en las rectas que unen los puntos medios de los lados. En las esquinas hay cuartos de rueda de dieciséis como la central.',
  pasos:[
    {h:'Dos cuadrados',t:'Dibuja la circunferencia inscrita en un cuadrado. Une los puntos donde corta a los ejes y a las diagonales: salen dos cuadrados concéntricos, girados 45° uno respecto del otro.',c:'Sus lados se cortan en ocho puntos: serán los centros de las ruedas de ocho.',anim:'draw',
     guia(){return ln([[-1,-1,1,-1],[1,-1,1,1],[1,1,-1,1],[-1,1,-1,-1]],'#2b2b2b',0.06)+ln([[-1,-1,1,1],[-1,1,1,-1],[-1,0,1,0],[0,-1,0,1]],RO,0.04,'0.3 0.2')+circ([[0,0]],1,RO,0.06)+an([...sqA,...sqB],RO,0.08);}},
    {h:'Rectas por el centro',t:'Traza rectas que pasen por el centro y por los ocho puntos de corte, y prolóngalas hasta los lados del cuadrado inicial. Uniendo sus extremos de dos en dos salen otros dos cuadrados.',c:'Los dos cuadrados nuevos están girados 22,5° respecto de los del paso 1.',anim:'draw',
     guia(){return an(rad8,'#2b4f73',0.06)+an([...sqC,...sqD],RO,0.07);}},
    {h:'Una estrella de ocho',t:'Por los mismos ocho puntos, traza paralelas a los ejes y a las diagonales. Forman una estrella de ocho puntas.',c:'Las ocho rectas quedan a 0,29 del centro (1 − √2/2), con el radio como unidad.',anim:'draw',
     guia(){return an(lin(1-1/s2,0),RO,0.07);}},
    {h:'Más paralelas',t:'Vuelve a unir los mismos puntos, pero ahora con paralelas a los lados de los cuadrados del paso 2.',c:'Algunas de estas rectas pasan por las esquinas del cuadrado inicial.',anim:'draw',
     guia(){return an(lin(r1*Math.SQRT1_2,22.5),'#2b4f73',0.07);}},
    {h:'Tres circunferencias tangentes',t:'Con centro en A y radio AB, traza una circunferencia. Después, dos circunferencias tangentes a ella: una con centro en C y radio CD, y otra con centro en E y radio EF.',c:'A es el punto medio de un lado del cuadrado de pico; B, el corte del eje con el lado del otro cuadrado; C, el centro, y E, el centro de una rueda.',anim:'fade',
     guia(){const E=W8[3],D=[A[0]*CD/Math.hypot(...A),A[1]*CD/Math.hypot(...A)],F=[E[0]+(E[0]-A[0])*EF/Math.hypot(E[0]-A[0],E[1]-A[1]),E[1]+(E[1]-A[1])*EF/Math.hypot(E[0]-A[0],E[1]-A[1])];
       const pt=(q,t)=>`<circle cx="${X(q[0]).toFixed(3)}" cy="${Y(q[1]).toFixed(3)}" r="0.22" fill="#1b1b1b"/><text x="${(X(q[0])+0.35).toFixed(3)}" y="${(Y(q[1])-0.35).toFixed(3)}" font-size="1.1" fill="#1b1b1b">${t}</text>`;
       return circ([A],AB,'#b5444b',0.08)+circ([[0,0]],CD,'#1d4ed8',0.08)+circ([E],EF,'#1d4ed8',0.08)+'<g class="solo-paso">'+[[A,'A'],[B,'B'],[[0,0],'C'],[D,'D'],[E,'E'],[F,'F']].map(([q,t])=>pt(q,t)).join('')+'</g>';}},
    {h:'Las circunferencias de las ruedas',t:'Dibuja ocho circunferencias de radio EF con centro en los puntos donde se cortan los lados de los cuadrados del paso 1. Después, otras ocho de radio CD con los mismos centros.',c:'La central, de radio CD, es la de la rueda de dieciséis.',anim:'fade',
     guia(){return circ(W8,EF,'#1d4ed8',0.07)+circ(W8,CD,RO,0.07)+circ([[0,0]],CD,RO,0.07);}},
    {h:'Estrellas y octógonos',t:'Inscribe en las circunferencias pequeñas estrellas de ocho puntas y en las grandes, octógonos. Sus vértices están donde las circunferencias cortan a las rectas de los pasos anteriores. En el centro, la estrella tiene dieciséis puntas.',c:'Las estrellas de ocho unen los vértices de tres en tres; la de dieciséis, de seis en seis.',anim:'draw',
     guia(){return an([...W8.flatMap(est8),...est16([0,0])],RO,0.06)+an(W8.flatMap(oct),'#1d4ed8',0.07);}},
    {h:'Prolongar las estrellas',t:'Prolonga los lados de todas las estrellas hasta que lleguen a los lados del cuadrado inicial.',c:'También los de los cuartos de rueda de dieciséis que hay en las esquinas.',anim:'draw',
     guia(){return an(prolonga([...W8.flatMap(est8),...ruedas16.flatMap(est16)]),RO,0.04);}},
    {h:'Prolongar los octógonos',t:'Prolonga también los lados de los ocho octógonos hasta los lados del cuadrado inicial.',c:'Con esto ya está trazada la red sobre la que se dibuja el alicatado.',anim:'draw',
     guia(){return ln(prolonga([...W8.flatMap(est8),...ruedas16.flatMap(est16)]),'#c9a9ab',0.03)+an(prolonga(W8.flatMap(oct)),'#1d4ed8',0.05);}},
    {h:'El dibujo',t:'Con las líneas de los dos pasos anteriores ya está listo el patrón: solo falta destacar los trazos que forman las ruedas de ocho y de dieciséis y los enlaces entre ellas.',c:'Cada trazo es un tramo de una de las rectas prolongadas, entre dos cruces.',tipo:'remarcar'},
    {h:'Los zafates arpados',t:'En la zona central de cada lado se modifican los candilejos y los zafates, que pasan a ser arpados para encajar en una estrella de ocho puntas.',c:'En cada lado se juntan cuatro zafates alrededor de la estrella: el que va hacia el centro, el del otro lado y dos a lo largo del borde.',anim:'draw',
     guia(){return an(MID.flatMap(est12),RO,0.08);}},
    {h:'La estrella del lado',t:'La estrella se forma con dos cuadrados girados 45°, de lado igual al ancho de los zafates. A partir de ella se trazan las demás líneas de los zafates arpados.',c:'La estrella del lado es igual que el sino de las ruedas de ocho.',tipo:'piezas',vt:vtM},
    {h:'Color',t:'Azul para los sinos, negro para los zafates de la rueda grande y verde y melado para los de las pequeñas. Los zafates arpados y los cuadraditos son negros; los otros zafates intermedios, violáceos. Los candilejos y las almendrillas, blancos.',c:'Las ruedas de ocho alternan el verde y el melado alrededor de la central.',tipo:'color',vt:vtG}]});
})();

(function(){const p=P.damas36,{e,AB,rB,A,w}=p.G36,k=p.k,s2=Math.SQRT2,X=v=>k+v*k,Y=v=>k-v*k; // y hacia arriba, como en el libro
  const T=L=>L.map(([x1,y1,x2,y2])=>[X(x1),Y(y1),X(x2),Y(y2)]);
  const ln=(L,col,wd,d)=>guia(T(L),col,wd,d),an=(L,col,wd)=>animar(T(L),col,wd);
  const pol=(n,r,a0)=>Array.from({length:n},(_,i)=>{const g=rad(a0+360*i/n);return[r*Math.cos(g),r*Math.sin(g)];});
  const une=(V,paso)=>V.map((v,i)=>[...v,...V[(i+paso)%V.length]]);
  const circ=(L,r,col,wd)=>circulos(L.map(([x,y])=>[X(x),Y(y)]),r*k,col,wd);
  // rectas a la distancia d del centro, con las direcciones dadas, recortadas a la caja [−b, b]²
  const rectas=(d,dirs,b)=>{const L=[];for(const a of dirs){const t=rad(a),u=[Math.cos(t),Math.sin(t)],n=[-u[1],u[0]];for(const sg of d?[1,-1]:[1]){const q=recta([n[0]*d*sg,n[1]*d*sg],u,[-b,-b,b,b]);if(q)L.push(q);}}return L;};
  const EJ=[0,90],DG=[45,135],G22=[22.5,67.5,112.5,157.5],R=s2,r8=Math.hypot(1,s2-1);
  const sqA=une(pol(4,s2,45),1),sqB=une(pol(4,s2,0),1),oct=pol(8,r8,22.5);
  const Ap=[-1,1],Bp=[-(5/s2-3),5/s2-3];
  const vt=[X(-1.5),Y(1.5),3*k,3*k],vtM=[-0.04*k,-0.04*k,2.08*k,2.08*k],vtG=[-0.5,-0.5,4*k+1,4*k+1];
  Object.assign(p,{vt,
  resumen:'Estrechas cintas verdes y azules que, sobre fondo blanco, se entrelazan formando octógonos y estrellas de ocho puntas. Ocupa dos rincones de la Torre de las Damas, a izquierda y derecha del arco de acceso.',
  pie:'Todo sale de una circunferencia dividida en ocho y de los dos cuadrados inscritos en ella: con sus diagonales, sus lados y las paralelas que pasan por sus cruces se trazan las rectas de la rueda central. El módulo es el cuadrado de lados paralelos a los ejes y se repite por traslación.',
  pasos:[
    {h:'Dos cuadrados',t:'Parte de una circunferencia dividida en ocho partes. Uniendo los puntos de división en orden alterno, obtienes dos cuadrados inscritos.',c:'Es la división en ocho de «Aprender a trazar». El cuadrado de lados paralelos a los ejes será el módulo.',anim:'draw',
     guia(){return ln([[-R,0,R,0],[0,-R,0,R],[-1,-1,1,1],[-1,1,1,-1]],RO,0.04,'0.3 0.2')+circ([[0,0]],R,'#2b4f73',0.06)+an([...sqA,...sqB],RO,0.08);}},
    {h:'El octógono estrellado',t:'Los dos cuadrados se cortan en los ocho vértices de un octógono. Une sus vértices opuestos para trazar sus diagonales y dibuja el octógono estrellado uniendo los vértices de tres en tres.',c:'Las diagonales del octógono están giradas 22,5° respecto de los ejes.',anim:'draw',
     guia(){return ln(une(oct,1),RO,0.04,'0.3 0.2')+ln(oct.slice(0,4).map((v,i)=>[...v,...oct[i+4]]),'#2b4f73',0.05)+an(une(oct,3),RO,0.07);}},
    {h:'Paralelas a los lados',t:'Traza rectas paralelas a los lados de los dos cuadrados. Pasan por los puntos donde las diagonales de cada cuadrado cortan a los lados del otro.',c:'Quedan a 0,71 del centro (√2/2), con el medio lado del módulo como unidad.',anim:'draw',
     guia(){return an([...rectas(1/s2,EJ,R),...rectas(1/s2,DG,R)],'#2b4f73',0.07);}},
    {h:'Las barras',t:'Traza rectas paralelas a las diagonales de los cuadrados. Pasan por los puntos donde las rectas del paso anterior cortan a los lados del octógono estrellado. Une sus extremos: salen cuatro barras que se cruzan en el centro.',c:'Cada barra mide de ancho A = 2 · 0,121: es la medida que dará el ancho de la cinta.',anim:'draw',
     guia(){return an([...rectas(e,EJ,1),...rectas(e,DG,1)],RO,0.07);}},
    {h:'Más paralelas',t:'Traza nuevas paralelas a los lados de los dos cuadrados. Esta vez pasan por los puntos donde se cortan las rectas de los pasos 3 y 4.',c:'Son las que cierran los cuadrados de las esquinas y el octógono grande que rodea la rueda.',anim:'draw',
     guia(){return an([...rectas(5/s2-3,EJ,1),...rectas(3-3/s2,EJ,1),...rectas(5/s2-3,DG,1),...rectas(3-3/s2,DG,1),...rectas(3/s2-1,DG,1),...rectas(2-1/s2,DG,1)],'#2b4f73',0.06);}},
    {h:'Dos circunferencias',t:'Dibuja dos circunferencias concéntricas con la inicial. La mayor tiene como radio la distancia AB; la menor pasa por las puntas de la estrella de ocho que forman las barras del paso 4.',c:'A es una esquina del módulo y B, el cruce de las rectas del paso 5 que tiene más cerca sobre la diagonal.',anim:'fade',
     guia(){const pt=(q,t)=>`<circle cx="${X(q[0]).toFixed(3)}" cy="${Y(q[1]).toFixed(3)}" r="0.22" fill="#1b1b1b"/><text x="${(X(q[0])+0.35).toFixed(3)}" y="${(Y(q[1])-0.35).toFixed(3)}" font-size="1.1" fill="#1b1b1b">${t}</text>`;
       return ln([[...Ap,...Bp]],'#1b1b1b',0.06)+circ([[0,0]],AB,RO,0.08)+circ([[0,0]],rB,'#1d4ed8',0.08)+'<g class="solo-paso">'+pt(Ap,'A')+pt(Bp,'B')+'</g>';}},
    {h:'La estrella de ocho central',t:'Con las diagonales del octógono (paso 2), divide la circunferencia mayor en ocho partes. Dibuja los dos cuadrados inscritos en ella: forman la estrella de ocho puntas central.',c:'Esta estrella está girada 22,5° respecto de los cuadrados del paso 1.',anim:'draw',
     guia(){return an(une(pol(8,AB,22.5),2),RO,0.07);}},
    {h:'La estrella pequeña',t:'Con las diagonales de los cuadrados iniciales, divide la circunferencia menor en ocho partes. Dibuja el octógono estrellado inscrito y prolonga sus lados hasta las rectas del paso 3.',c:'Sus lados prolongados son las rectas largas que forman la rueda.',anim:'draw',
     guia(){return ln(une(pol(8,rB,0),3),'#1d4ed8',0.05)+an(rectas(e,G22,1/s2),RO,0.06);}},
    {h:'Todas las líneas',t:'Con las líneas dibujadas en los pasos anteriores ya tienes todas las necesarias para obtener el motivo principal del alicatado.',c:'Repasa que no te falte ninguna: el paso siguiente solo elige tramos de estas rectas.'},
    {h:'El esquema lineal',t:'Remarca los trazos adecuados para terminar el esquema lineal. Estas líneas son los ejes de las cintas verdes y azules.',c:'En el centro, ocho rectas largas forman una estrella; alrededor, el octógono grande y, en las esquinas, cuadrados.',tipo:'remarcar',vt:vtM},
    {h:'La cinta',t:'La proporción entre cuerda (el ancho de la cinta) y calle (el espacio entre cintas) es de 1/3. Para conseguirla, divide la distancia A en ocho partes iguales y traza paralelas al eje a 1/8 de A a cada lado.',c:'A es el ancho de las barras del paso 4: la cinta mide A/4.',tipo:'cinta',vt:vtM},
    {h:'El efecto de lazo',t:'Remarca los tramos que terminan el diseño y prolonga algunos lados para que unas cintas parezcan pasar sobre otras, en un ritmo alterno.',c:'Cada cinta pasa por encima en un cruce y por debajo en el siguiente.',tipo:'cinta',entrelazar:true,vt:vtM},
    {h:'Color',t:'Aplica el color: verde y azul para las cintas y blanco para las piezas que forman el fondo.',c:'Son verdes el octógono grande, la estrella que rodea la rueda y las diagonales de las esquinas; el resto de las cintas, azules.',tipo:'color',vt:vtM},
    {h:'Repetir el módulo',t:'El módulo se repite por traslación en sentido horizontal y vertical.',c:'En el muro, los extremos del panel tienen variantes (estrellas giradas, cuadrados enlazados en ocho y rectángulos) que aquí no se dibujan.',tipo:'color',vt:vtG}]});
})();

(function(){const p=P.damas37,{h,dE,rc,A,w}=p.G37,k=p.k,s3=Math.sqrt(3),X=v=>k+v*k,Y=v=>k-v*k;
  const T=L=>L.map(([x1,y1,x2,y2])=>[X(x1),Y(y1),X(x2),Y(y2)]);
  const ln=(L,col,wd,d)=>guia(T(L),col,wd,d),an=(L,col,wd)=>animar(T(L),col,wd);
  const pol=(n,r,a0,c=[0,0])=>Array.from({length:n},(_,i)=>{const g=rad(a0+360*i/n);return[c[0]+r*Math.cos(g),c[1]+r*Math.sin(g)];});
  const une=(V,paso)=>V.map((v,i)=>[...v,...V[(i+paso)%V.length]]);
  const circ=(L,r,col,wd)=>circulos(L.map(([x,y])=>[X(x),Y(y)]),r*k,col,wd);
  const rectas=(d,dirs,b)=>{const L=[];for(const a of dirs){const t=rad(a),u=[Math.cos(t),Math.sin(t)],n=[-u[1],u[0]];for(const sg of [1,-1]){const q=recta([n[0]*d*sg,n[1]*d*sg],u,[-b,-b,b,b]);if(q)L.push(q);}}return L;};
  const P12=Array.from({length:12},(_,j)=>{const g=rad(90-30*(j+1));return[Math.cos(g),Math.sin(g)];});   // P12[j] es el punto j+1 (el 12, arriba)
  const tri=j=>une([P12[j],P12[(j+4)%12],P12[(j+8)%12]],1);
  const ESQ=[[1,1],[-1,1],[1,-1],[-1,-1]];
  const arcos=(col,wd)=>{const r=+k.toFixed(3),Q=(x,y)=>`${+X(x).toFixed(3)} ${+Y(y).toFixed(3)}`;
    return `<g class="draw" fill="none" stroke="${col}" stroke-width="${wd}" stroke-linecap="round">`+[[0,1],[1,0],[0,-1],[-1,0]].map(([cx,cy])=>{
      const a=Math.atan2(cy,cx),p1=[cx+Math.cos(a+rad(90)),cy+Math.sin(a+rad(90))],p2=[cx+Math.cos(a-rad(90)),cy+Math.sin(a-rad(90))];
      return `<path pathLength="1" d="M${Q(...p1)} A${r} ${r} 0 0 0 ${Q(...p2)}"/>`;}).join('')+'</g>';};
  const vt=[X(-1.08),Y(1.08),2.16*k,2.16*k],vtM=[-0.04*k,-0.04*k,2.08*k,2.08*k],vtG=[-0.5,-0.5,4*k+1,4*k+1];
  Object.assign(p,{vt,
  resumen:'Una rueda de lazo de doce brazos, menos frecuente en la Alhambra que las de ocho o dieciséis. El sino y los zafates son negros; las almendrillas y los candilejos, verde turquesa, y la lacería es una cinta blanca. Reviste los pilares de los arcos laterales, a este y oeste, del interior de la Torre de las Damas.',
  pie:'Todo sale de una circunferencia inscrita en un cuadrado y dividida en doce: dos hexágonos, cuatro triángulos equiláteros y una estrella de doce puntas. En las esquinas, una estrella de ocho completa el dibujo cuando se juntan cuatro módulos.',
  pasos:[
    {h:'La circunferencia en doce',t:'Parte de una circunferencia inscrita en un cuadrado y divídela en doce partes iguales. Para ello traza cuatro semicircunferencias de radio igual al de la circunferencia, con centro en los puntos medios de los lados del cuadrado.',c:'Es la división en doce de «Aprender a trazar», hecha desde los lados del cuadrado.',anim:'draw',
     guia(){return ln([[-1,-1,1,-1],[1,-1,1,1],[1,1,-1,1],[-1,1,-1,-1]],'#2b2b2b',0.06)+ln([[-1,0,1,0],[0,-1,0,1]],RO,0.04,'0.3 0.2')+circ([[0,0]],1,'#2b4f73',0.06)+arcos(RO,0.07);}},
    {h:'Dos hexágonos',t:'Dibuja dos hexágonos regulares: uniendo los puntos pares sale el primero, y con los impares, el segundo. Prolonga los lados de los hexágonos hasta los bordes del cuadrado.',c:'El primero tiene un vértice arriba (el punto 12); el segundo, uno a la derecha (el punto 3).',anim:'draw',
     guia(){return ln([...une(pol(6,1,90),1),...une(pol(6,1,0),1)],RO,0.07)+an(rectas(h,[0,30,60,90,120,150],1),'#2b4f73',0.05);}},
    {h:'Cuatro triángulos',t:'Dibuja cuatro triángulos equiláteros uniendo los puntos 1-5-9, 2-6-10, 3-7-11 y 4-8-12. Al superponerse forman una estrella.',c:'Los lados de los triángulos quedan a la mitad del radio del centro.',anim:'draw',
     guia(){return an([0,1,2,3].flatMap(tri),RO,0.07);}},
    {h:'La estrella de doce',t:'Traza una nueva estrella de doce puntas uniendo los puntos donde se cortan los lados de los triángulos, de cinco en cinco. Prolonga sus lados hasta las líneas trazadas en el paso 2.',c:'Los puntos están en la circunferencia de radio 1/√3 (0,58). Sus lados prolongados, dos a dos paralelos, son los brazos de la rueda.',anim:'draw',
     guia(){return ln(une(pol(12,1/s3,0),5),'#1d4ed8',0.05)+an(rectas(dE,[15,45,75,105,135,165],h),RO,0.07);}},
    {h:'Las esquinas',t:'Los trazos anteriores ya permiten dibujar la rueda central. Para completar las esquinas, dibuja circunferencias con centro en los vértices del cuadrado que pasen por los puntos donde se cortan las líneas del paso 2.',c:'Su radio es √2 · (1 − √3/2): unas 0,19 veces el radio.',anim:'fade',
     guia(){return circ(ESQ,rc,RO,0.08);}},
    {h:'Las estrellas de las esquinas',t:'Inscribe en cada circunferencia de las esquinas la estrella de ocho puntas formada por dos cuadrados. Prolonga los lados de cada estrella.',c:'Al juntarse cuatro módulos, cada cuarto de estrella completa una estrella de ocho: un sino negro.',anim:'draw',
     guia(){return ln(ESQ.flatMap(c=>[...une(pol(4,rc,0,c),1),...une(pol(4,rc,45,c),1)]),'#1d4ed8',0.05)+an([...rectas(1-h,[45,135],1),...rectas((2-rc)/Math.SQRT2,[45,135],1)],RO,0.07);}},
    {h:'El esquema lineal',t:'Remarca los trazos adecuados para completar el esquema lineal de la composición. Estas líneas son los ejes de las cintas.',c:'Los brazos de la rueda se doblan sobre los lados de los hexágonos; en las esquinas queda un cuarto de estrella de ocho.',tipo:'remarcar',vt:vtM},
    {h:'La cinta',t:'También aquí la proporción entre el ancho de la cinta y el espacio entre cintas es de 1/3. Como en el alicatado anterior, traza paralelas a ambos lados de los ejes a una distancia igual a 1/8 de A.',c:'A es la distancia entre dos brazos paralelos de la estrella de doce: la cinta mide A/4.',tipo:'cinta',vt:vtM},
    {h:'El entrelazado',t:'Remarca los trazos adecuados para conseguir el efecto de entrelazado, de modo que cada cinta pase por encima o por debajo al cruzarse con otra.',c:'En el pilar, un marco exterior completa los sinos de las esquinas; aquí se dibuja solo el módulo que se repite.',tipo:'cinta',entrelazar:true,vt:vtM},
    {h:'Repetir el módulo',t:'El panel que reviste cada pilar está compuesto por cuatro ruedas enlazadas entre sí. El módulo se repite por traslación.',c:'Donde se juntan cuatro módulos aparece la estrella de ocho completa.',tipo:'color',vt:vtG},
    {h:'Color',t:'El sino y los zafates están esmaltados en negro; las almendrillas y los candilejos, en verde turquesa. La lacería es una cinta blanca.',c:'Prueba otras combinaciones en la pestaña Colorear.',tipo:'color',vt:vtM}]});
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
// v2.18: qué se repasa con tinta. El dibujo definitivo va en trazo grueso y continuo; el lápiz de la construcción
// (lo que se borra al final), fino, gris y a rayas. Se distinguen por el grosor y la raya, no por el color.
// Usa el encuadre del paso de remarcar, que es donde las guías y el dibujo final coinciden.
function lapiz(g,fz){return g.replace(/ class="[^"]*"/g,'').replace(/ style="animation-delay:[^"]*"/g,'').replace(/ pathLength="1"/g,'').replace(/ stroke-dasharray="[^"]*"/g,'')
  .replace(/stroke="#[0-9a-fA-F]{3,8}"/g,'stroke="#6f6f6f"').replace(/stroke-width="([\d.]+)"/g,(m,v)=>`stroke-width="${+(Math.min(+v,0.07)*fz).toFixed(3)}"`);}
function dibujarTinta(p,render,lista){const PS=lista||p.pasos;let n=0;PS.forEach((q,i)=>{if(q.tipo==='remarcar')n=i+1;});
  if(!n)PS.forEach((q,i)=>{if(q.guia&&!q.tipo)n=i+1;});
  const s=PS[n-1]||{},vt=s.vt||p.vt,[x0,y0,w,h]=vt,pad=w*0.03,fz=Math.max(w,h)/24,cinta=p.tipo==='cinta';
  const giro=p.giro&&!s.sinGiro?[p.giro,x0+w/2,y0+h/2]:null;
  let g='';PS.slice(0,n).forEach(q=>{if(q.guia&&!q.tipo)g+=lapiz(q.guia(p,vt),fz);});
  const borrar=`<g class="tinta-lapiz" stroke-dasharray="${+(0.22*fz).toFixed(3)} ${+(0.16*fz).toFixed(3)}" clip-path="url(#tzclip3)">${g}</g>`;
  const defs=`<defs><clipPath id="tzclip3"><rect x="${x0}" y="${y0}" width="${w}" height="${h}"/></clipPath></defs>`;
  if(cinta){const o={x0,y0,w,h,cols:Array(p.nombres.length).fill('#ffffff'),over:{},ribbon:'#ffffff',outline:'#111111',rw:p.rw,ow:0.11,interlace:true,frame:true,giro};
    return render(p.D,o).replace('<svg ','<svg style="pointer-events:none" ').replace(/<\/svg>\s*$/,defs+borrar+'</svg>');}
  const L=[];for(const [cl,pts] of p.D.S)for(let k=0;k+2<pts.length+(cl?2:0);k+=2){const a=k,b=(k+2)%pts.length;
    const sg=[pts[a],pts[a+1],pts[b],pts[b+1]],mg=giro?w*0.25:1;if(Math.max(sg[0],sg[2])<x0-mg||Math.min(sg[0],sg[2])>x0+w+mg||Math.max(sg[1],sg[3])<y0-mg||Math.min(sg[1],sg[3])>y0+h+mg)continue;L.push(sg);}
  const lin=L.map(q=>`<line x1="${+q[0].toFixed(3)}" y1="${+q[1].toFixed(3)}" x2="${+q[2].toFixed(3)}" y2="${+q[3].toFixed(3)}"/>`).join('');
  const tinta=`<g class="tinta-tinta" stroke="#111111" stroke-width="${+(0.19*fz).toFixed(3)}" stroke-linecap="round" fill="none" clip-path="url(#tzclip3)"${giro?` transform="rotate(${giro.join(' ')})"`:''}>${lin}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0-pad} ${y0-pad} ${w+2*pad} ${h+2*pad}" width="100%"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#fffefa"/>${defs}${borrar}${tinta}<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="none" stroke="#2b2b2b" stroke-width="0.08"/></svg>`;}
return {P,recta,redTriangulos,poligono,contorno,dibujarPaso,dibujarTinta,lapiz};
})();

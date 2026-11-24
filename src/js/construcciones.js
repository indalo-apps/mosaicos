// ---------- Construcciones básicas (v2.0): págs. 164 a 175 del libro, redibujadas ----------
// Cada construcción: pasos con elementos geométricos calculados (circunferencias, arcos, rectas, puntos y tinta).
// Estilos: 'c' construcción (rojo), 'b' auxiliar (azul), 't' tinta (negro), 'f' relleno.
const CONS=(function(){
const S3=Math.sqrt(3),S2=Math.SQRT2,rd=d=>d*Math.PI/180;
const pol=(c,r,d)=>[c[0]+r*Math.cos(rd(d)),c[1]-r*Math.sin(rd(d))];   // ángulo en grados, en sentido antihorario y con el eje y hacia arriba
const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2],dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const ang=(c,p)=>Math.atan2(c[1]-p[1],p[0]-c[0])*180/Math.PI;
function cc(c1,r1,c2,r2){const d=dist(c1,c2),a=(r1*r1-r2*r2+d*d)/(2*d),h=Math.sqrt(Math.max(0,r1*r1-a*a)),m=[c1[0]+a*(c2[0]-c1[0])/d,c1[1]+a*(c2[1]-c1[1])/d];
  return [[m[0]+h*(c2[1]-c1[1])/d,m[1]-h*(c2[0]-c1[0])/d],[m[0]-h*(c2[1]-c1[1])/d,m[1]+h*(c2[0]-c1[0])/d]];}
function ll(p1,p2,p3,p4){const d=(p1[0]-p2[0])*(p3[1]-p4[1])-(p1[1]-p2[1])*(p3[0]-p4[0]);const t=((p1[0]-p3[0])*(p3[1]-p4[1])-(p1[1]-p3[1])*(p3[0]-p4[0]))/d;return[p1[0]+t*(p2[0]-p1[0]),p1[1]+t*(p2[1]-p1[1])];}
const ext=(a,b,e)=>{const d=dist(a,b),u=[(b[0]-a[0])/d,(b[1]-a[1])/d];return[a[0]-u[0]*e,a[1]-u[1]*e,b[0]+u[0]*e,b[1]+u[1]*e];};
// elementos
const C=(c,r,s='c')=>({k:'C',c,r,s}), A=(c,r,d0,d1,s='c')=>({k:'A',c,r,d0,d1,s}), Lr=(a,b,s='c',e=0)=>({k:'L',p:e?ext(a,b,e):[...a,...b],s});
const T=(pts,cerr=true)=>({k:'P',pts,cerr,s:'t'}), F=(pts,col)=>({k:'P',pts,cerr:true,s:'f',col});
const P=(p,l,dx=3,dy=-3)=>({k:'p',p,l,dx,dy});
const reg=(c,r,n,a0)=>Array.from({length:n},(_,i)=>pol(c,r,a0+360*i/n));
const estrella=(V,k)=>{const n=V.length,out=[];const vis=new Set();for(let s=0;s<n;s++){if(vis.has(s))continue;const ruta=[];let i=s;do{vis.add(i);ruta.push(V[i]);i=(i+k)%n;}while(i!==s);out.push(T(ruta));}return out;};
const arcoPor=(c,p,q,s='c',m=12)=>{let a=ang(c,p),b=ang(c,q);if(b<a)b+=360;return A(c,dist(c,p),a-m,b+m,s);};   // arco de centro c de p a q (antihorario), con margen
const tx=(es,en)=>[es,en];
const L=[];
function add(id,grupo,pags,nombre,vb,pasos){L.push({id,grupo,pags,nombre,vb,pasos});}

// ===== Triángulo y hexágono =====
{const A0=[-25,15],B0=[25,15],[C0,D0]=cc(A0,50,B0,50).sort((p,q)=>p[1]-q[1]);
add('tri-lado','tri','165',tx('Triángulo equilátero a partir del lado','Equilateral triangle from its side'),[-45,-38,90,106],[
 {h:tx('Dos arcos','Two arcs'),t:tx('Con centro en A y radio AB traza un arco. Con centro en B y el mismo radio, traza otro hasta que corte al primero.','Centered on A, draw an arc with radius AB. Centered on B, with the same radius, draw another until it crosses the first.'),
  el:[T([A0,B0],false),A(A0,50,-75,75),A(B0,50,105,255),P(A0,'A',-6,1),P(B0,'B',3,1)]},
 {h:tx('Unir los cortes','Join the crossings'),t:tx('Los arcos se cortan en C y D. Une C (o D) con A y con B: ya tienes el triángulo equilátero.','The arcs cross at C and D. Join C (or D) to A and B: that is the equilateral triangle.'),
  el:[P(C0,'C'),P(D0,'D',3,6),Lr(A0,D0,'b'),Lr(B0,D0,'b'),T([A0,B0,C0])]}]);}
{const O=[0,0],R=40,An=[0,-R],Bn=[0,R],Cn=pol(O,R,210),Dn=pol(O,R,330),En=pol(O,R,150),Fn=pol(O,R,30);
add('tri-hex','tri','165',tx('Triángulo y hexágono inscritos','Inscribed triangle and hexagon'),[-50,-50,100,100],[
 {h:tx('Circunferencia y diámetro','Circle and diameter'),t:tx('Dibuja una circunferencia y uno de sus diámetros, AB.','Draw a circle and one of its diameters, AB.'),el:[C(O,R),Lr(An,Bn),P(O,'',0,0),P(An,'A',3,-3),P(Bn,'B',3,7)]},
 {h:tx('Arco desde B','Arc from B'),t:tx('Con centro en B y el mismo radio de la circunferencia, traza un arco. Corta a la circunferencia en C y D.','Centered on B, with the same radius as the circle, draw an arc. It cuts the circle at C and D.'),el:[A(Bn,R,15,165),P(Cn,'C',-7,4),P(Dn,'D',3,4)]},
 {h:tx('El triángulo','The triangle'),t:tx('Une C y D con A: es el triángulo equilátero inscrito.','Join C and D to A: that is the inscribed equilateral triangle.'),el:[T([An,Cn,Dn])]},
 {h:tx('Seis partes','Six parts'),t:tx('Traza otro arco igual con centro en A. Con los dos arcos, la circunferencia queda dividida en seis partes iguales.','Draw another equal arc centered on A. With both arcs the circle is divided into six equal parts.'),el:[A(An,R,195,345),P(En,'E',-7,0),P(Fn,'F',3,0)]},
 {h:tx('Hexágono y estrella','Hexagon and star'),t:tx('Une los seis puntos en orden: sale el hexágono regular. Si los unes de dos en dos, sale una estrella de seis puntas hecha con dos triángulos.','Join the six points in order: you get the regular hexagon. Join them every other point and you get a six-pointed star made of two triangles.'),el:[T([An,Fn,Dn,Bn,Cn,En]),Lr(Bn,En,'b'),Lr(En,Fn,'b'),Lr(Fn,Bn,'b')]},
 {h:tx('Doce partes','Twelve parts'),t:tx('Traza los diámetros que pasan por los cruces de los lados de los dos triángulos: la circunferencia queda dividida en doce partes iguales.','Draw the diameters through the points where the sides of the two triangles cross: the circle is divided into twelve equal parts.'),
  el:[0,60,120].map(a=>Lr(pol(O,R,a),pol(O,R,a+180),'b')).concat([T(reg(O,R,12,0))])}]);
 L[L.length-1].obj=[T([An,Fn,Dn,Bn,Cn,En]),T([An,Cn,Dn]),T([Bn,En,Fn])];}
// división del triángulo
function triRed(A0,B0,C0,n,s='t'){const out=[];for(let i=1;i<n;i++){const t=i/n;
  const lerp=(p,q,t)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];
  out.push(Lr(lerp(A0,C0,t),lerp(B0,C0,t),s),Lr(lerp(A0,B0,t),lerp(A0,C0,t),s),Lr(lerp(B0,A0,t),lerp(B0,C0,t),s));}return out;}
{const A0=[-40,25],B0=[40,25],C0=[0,25-40*S3],G=[0,25-40/S3],R=80/S3;
 const D0=pol(G,R,150),E0=pol(G,R,30),F0=pol(G,R,270);
add('tri-div','tri','166',tx('Dividir el triángulo en 4, 9 y 36','Dividing the triangle into 4, 9 and 36'),[-55,-65,110,122],[
 {h:tx('Mediatrices','Perpendicular bisectors'),t:tx('Con centro en cada vértice y radio igual al lado, traza arcos; uniendo sus cortes salen las mediatrices de los tres lados.','Centered on each vertex, with the side as radius, draw arcs; joining where they cross gives the perpendicular bisectors of the three sides.'),
  el:[T([A0,B0,C0]),A(A0,80,-10,70),A(B0,80,110,190),A(C0,80,235,305),Lr(C0,mid(A0,B0),'c',14),Lr(A0,mid(B0,C0),'c',14),Lr(B0,mid(A0,C0),'c',14),P(A0,'A',-7,3),P(B0,'B',3,3),P(C0,'C',3,-2)]},
 {h:tx('Cuatro triángulos','Four triangles'),t:tx('Une los puntos medios de los lados: el triángulo queda dividido en cuatro triángulos iguales.','Join the midpoints of the sides: the triangle is divided into four equal triangles.'),el:[T([mid(A0,B0),mid(B0,C0),mid(C0,A0)])]},
 {h:tx('Triángulo girado','Rotated triangle'),t:tx('Traza la circunferencia que pasa por los tres vértices. Las mediatrices la cortan en D, E y F: únelos y tienes un triángulo igual, girado 180°.','Draw the circle through the three vertices. The bisectors cut it at D, E and F: join them for an equal triangle turned 180°.'),
  el:[C(G,R),Lr(D0,E0,'b'),Lr(E0,F0,'b'),Lr(F0,D0,'b'),P(D0,'D',-7,0),P(E0,'E',3,0),P(F0,'F',3,6)]},
 {h:tx('Nueve triángulos','Nine triangles'),t:tx('Los lados de los dos triángulos se cortan en puntos que dividen cada lado en tres. Únelos con paralelas a los lados: salen nueve triángulos iguales.','The sides of the two triangles cross at points that divide each side into three. Join them with parallels to the sides: nine equal triangles appear.'),el:triRed(A0,B0,C0,3)},
 {h:tx('Treinta y seis','Thirty-six'),t:tx('Une los puntos medios de los lados del hexágono central y sigue con paralelas: cada lado queda en seis partes y el triángulo, en 36.','Join the midpoints of the sides of the central hexagon and continue with parallels: each side is in six parts and the triangle in 36.'),el:triRed(A0,B0,C0,6)}]);
 const H=[1,2,4,5,7,8].map(i=>i);   // (solo para documentar el paso intermedio)
add('tri-81','tri','166',tx('Dividir el lado del triángulo en 9','Dividing the triangle side into 9'),[-55,-50,110,80],[
 {h:tx('Dos triángulos en el hexágono','Two triangles in the hexagon'),t:tx('Parte del triángulo dividido en nueve. Une los vértices alternos del hexágono central: salen dos triángulos equiláteros.','Start from the triangle divided into nine. Join alternate vertices of the central hexagon: two equilateral triangles appear.'),
  el:[T([A0,B0,C0])].concat(triRed(A0,B0,C0,3),(()=>{const lerp=(p,q,t)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];const h=[lerp(A0,B0,1/3),lerp(A0,B0,2/3),lerp(B0,C0,1/3),lerp(B0,C0,2/3),lerp(C0,A0,1/3),lerp(C0,A0,2/3)];return[Lr(h[0],h[2]),Lr(h[2],h[4]),Lr(h[4],h[0]),Lr(h[1],h[3]),Lr(h[3],h[5]),Lr(h[5],h[1])];})())},
 {h:tx('Paralelas por los cruces','Parallels through the crossings'),t:tx('Por los puntos donde se cortan esos dos triángulos, traza paralelas a los lados del triángulo grande.','Through the points where those two triangles cross, draw parallels to the sides of the big triangle.'),
  el:(()=>{const out=[];const lerp=(p,q,t)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];for(const i of [4,5]){const t=i/9;out.push(Lr(lerp(A0,C0,t),lerp(B0,C0,t),'b'),Lr(lerp(A0,B0,t),lerp(A0,C0,t),'b'),Lr(lerp(B0,A0,t),lerp(B0,C0,t),'b'));}return out;})()},
 {h:tx('Ochenta y un triángulos','Eighty-one triangles'),t:tx('Une los cortes de esas rectas con las anteriores y completa las paralelas: cada lado queda en nueve partes y el triángulo, en 81.','Join where those lines meet the earlier ones and complete the parallels: each side is in nine parts and the triangle in 81.'),el:triRed(A0,B0,C0,9)}]);}

// ===== Cuadrado y octógono =====
{const A0=[-20,20],B0=[20,20],[D0,C0]=cc(A0,40,B0,40).sort((p,q)=>p[1]-q[1]),E0=[0,20],T0=[0,0],r4=dist(T0,A0),F0=[20,-20],G0=[-20,-20],H0=[0,-r4],R8=dist(H0,A0);
 const oct=reg(H0,R8,8,-67.5);
add('cuad-oct-lado','cuad','167',tx('Cuadrado y octógono a partir del lado','Square and octagon from the side'),[-65,-85,130,174],[
 {h:tx('Dos arcos','Two arcs'),t:tx('Con centro en A y radio AB traza un arco; con centro en B y el mismo radio, otro que lo corte.','Centered on A with radius AB draw an arc; centered on B with the same radius, another that crosses it.'),el:[T([A0,B0],false),A(A0,40,-80,80),A(B0,40,100,260),P(A0,'A',-7,3),P(B0,'B',3,3)]},
 {h:tx('La mediatriz','The perpendicular bisector'),t:tx('Une los cortes C y D: es la mediatriz de AB.','Join the crossings C and D: that is the perpendicular bisector of AB.'),el:[Lr(D0,C0,'c',30),P(C0,'C',3,6),P(D0,'D',3,-2)]},
 {h:tx('Circunferencia en E','Circle on E'),t:tx('Con centro en E, el punto medio de AB, traza la circunferencia que pasa por A y B.','Centered on E, the midpoint of AB, draw the circle through A and B.'),el:[C(E0,20),P(E0,'E',3,-3)]},
 {h:tx('Circunferencia del cuadrado','The square’s circle'),t:tx('Donde esa circunferencia corta a la mediatriz está el centro de otra que pasa por A y B.','Where that circle cuts the bisector is the center of another circle through A and B.'),el:[C(T0,r4)]},
 {h:tx('El cuadrado','The square'),t:tx('Esta circunferencia corta a los arcos del principio en F y G: son los otros dos vértices del cuadrado.','This circle cuts the first arcs at F and G: they are the other two vertices of the square.'),el:[T([A0,B0,F0,G0]),P(F0,'F'),P(G0,'G',-7,-3)]},
 {h:tx('Punto H','Point H'),t:tx('La circunferencia del cuadrado corta a la mediatriz en H.','The square’s circle cuts the bisector at H.'),el:[P(H0,'H')]},
 {h:tx('Circunferencia del octógono','The octagon’s circle'),t:tx('Con centro en H traza la circunferencia que pasa por A y B: contendrá un octógono de lado AB.','Centered on H draw the circle through A and B: it will hold an octagon with side AB.'),el:[C(H0,R8)]},
 {h:tx('Vértices J y K','Vertices J and K'),t:tx('Prolonga los arcos del primer paso hasta esa circunferencia: salen J y K. Los diámetros por A, B, J y K dan los demás vértices.','Extend the first arcs to that circle: J and K appear. The diameters through A, B, J and K give the other vertices.'),
  el:[A(A0,40,80,165),A(B0,40,15,100),P(oct[2],'J'),P(oct[7],'K',-7,-3)].concat([0,1,2,3].map(i=>Lr(oct[i],oct[i+4],'b')))},
 {h:tx('El octógono','The octagon'),t:tx('Une los ocho puntos en orden: es el octógono regular de lado AB.','Join the eight points in order: the regular octagon with side AB.'),el:[T(oct)]}]);
 L[L.length-1].obj=[T(oct),T([A0,B0,F0,G0])];}
{const O=[0,0],R=30,A0=[-R,0],B0=[R,0],[C0,D0]=cc(A0,60,B0,60).sort((p,q)=>p[1]-q[1]),E0=[0,-R],F0=[0,R],oct=reg(O,R,8,0);
add('cuad-oct-circ','cuad','168',tx('Cuadrado y octógono a partir de la circunferencia','Square and octagon from the circle'),[-62,-62,124,124],[
 {h:tx('Circunferencia y diámetro','Circle and diameter'),t:tx('Dibuja una circunferencia con un diámetro horizontal AB.','Draw a circle with a horizontal diameter AB.'),el:[C(O,R),Lr(A0,B0),P(A0,'A',-7,3),P(B0,'B',3,3)]},
 {h:tx('Dos arcos','Two arcs'),t:tx('Con centro en A y en B traza arcos de radio igual al diámetro AB.','Centered on A and on B draw arcs with radius equal to the diameter AB.'),el:[A(A0,60,-65,65),A(B0,60,115,245)]},
 {h:tx('La mediatriz','The perpendicular bisector'),t:tx('Une los cortes C y D: es la mediatriz de AB.','Join the crossings C and D: that is the perpendicular bisector of AB.'),el:[Lr(C0,D0),P(C0,'C'),P(D0,'D',3,6)]},
 {h:tx('El cuadrado','The square'),t:tx('La mediatriz corta a la circunferencia en E y F. Únelos con A y B: es el cuadrado.','The bisector cuts the circle at E and F. Join them to A and B: that is the square.'),el:[T([A0,E0,B0,F0]),P(E0,'E'),P(F0,'F',3,6)]},
 {h:tx('Diámetros a 45°','Diameters at 45°'),t:tx('Con centro en A, B, E y F traza cuatro arcos iguales hasta que se corten: dan otros dos diámetros, a 45° de los anteriores.','Centered on A, B, E and F draw four equal arcs until they cross: they give two more diameters, at 45° to the first ones.'),
  el:[A(A0,R*S2,-60,60),A(B0,R*S2,120,240),A(E0,R*S2,210,330),A(F0,R*S2,30,150),Lr(oct[1],oct[5],'b'),Lr(oct[3],oct[7],'b')]},
 {h:tx('El octógono','The octagon'),t:tx('Une en orden los extremos de los cuatro diámetros: es el octógono regular.','Join the ends of the four diameters in order: that is the regular octagon.'),el:[T(oct)]},
 {h:tx('Dos cuadrados','Two squares'),t:tx('Si los unes saltando uno, salen dos cuadrados girados 45°.','Joining them skipping one gives two squares turned 45°.'),el:estrella(oct,2)},
 {h:tx('Octógono estrellado','Eight-pointed star polygon'),t:tx('Si saltas dos, sale el octógono estrellado. Estas dos estrellas son la base de muchos alicatados del Alcázar.','Skip two and you get the star octagon. These two stars are the basis of many Alcázar tile patterns.'),el:estrella(oct,3)}]);}
{const A0=[-25,0],B0=[25,0],[C0,D0]=cc(A0,50,B0,50).sort((p,q)=>p[1]-q[1]),E0=[0,0],F0=[0,-25],G0=[0,25],H0=[-25,25],I0=[25,25],J0=[25,-25],K0=[-25,-25];
add('cuad-eje','cuad','169',tx('Cuadrado a partir de uno de sus ejes','Square from one of its axes'),[-55,-55,110,110],[
 {h:tx('Dos arcos','Two arcs'),t:tx('El eje AB es lo que mide el lado. Con centro en A y en B traza dos arcos de radio AB.','The axis AB is as long as the side. Centered on A and B draw two arcs with radius AB.'),el:[Lr(A0,B0),A(A0,50,-70,70),A(B0,50,110,250),P(A0,'A',-7,3),P(B0,'B',3,3)]},
 {h:tx('La mediatriz','The perpendicular bisector'),t:tx('Une los cortes C y D: es la mediatriz de AB.','Join the crossings C and D: that is the perpendicular bisector of AB.'),el:[Lr(C0,D0),P(C0,'C'),P(D0,'D',3,6)]},
 {h:tx('Circunferencia en E','Circle on E'),t:tx('Con centro en E, el punto medio, traza la circunferencia que pasa por A y B. Corta a la mediatriz en F y G.','Centered on E, the midpoint, draw the circle through A and B. It cuts the bisector at F and G.'),el:[C(E0,25),P(E0,'E'),P(F0,'F'),P(G0,'G',3,6)]},
 {h:tx('Cuatro circunferencias','Four circles'),t:tx('Con centro en A, B, F y G traza circunferencias que pasen por E.','Centered on A, B, F and G draw circles that pass through E.'),el:[C(A0,25),C(B0,25),C(F0,25),C(G0,25)]},
 {h:tx('El cuadrado','The square'),t:tx('Esas circunferencias se cortan en H, I, J y K: son los vértices del cuadrado.','Those circles cross at H, I, J and K: they are the vertices of the square.'),el:[T([H0,I0,J0,K0]),P(H0,'H',-7,6),P(I0,'I',3,6),P(J0,'J'),P(K0,'K',-7,-3)]}]);}
{const a=30,V=[[-a,-a],[a,-a],[a,a],[-a,a]],r=a*S2,e=r-a,d=a-e;
 const oct=[[-d,-a],[d,-a],[a,-d],[a,d],[d,a],[-d,a],[-a,d],[-a,-d]];
add('oct-cuad','cuad','169',tx('Octógono inscrito en un cuadrado','Octagon inscribed in a square'),[-42,-42,84,84],[
 {h:tx('Arcos desde los vértices','Arcs from the corners'),t:tx('Parte de un cuadrado con sus diagonales. Con centro en cada vértice traza un arco de radio igual a media diagonal.','Start from a square with its diagonals. Centered on each corner draw an arc with radius half the diagonal.'),
  el:[T(V),Lr(V[0],V[2],'b'),Lr(V[1],V[3],'b'),A(V[0],r,-90,0),A(V[1],r,180,270),A(V[2],r,90,180),A(V[3],r,0,90)]},
 {h:tx('El octógono','The octagon'),t:tx('Une los ocho puntos donde los arcos cortan a los lados: es el octógono.','Join the eight points where the arcs cut the sides: that is the octagon.'),el:[T(oct)]},
 {h:tx('Octógono estrellado','Star octagon'),t:tx('Si en lugar de unirlos seguidos lo haces saltándote dos, sale el octógono estrellado.','If instead of joining them in order you skip two, you get the star octagon.'),el:estrella(oct,3)}]);
 L[L.length-1].obj=[T(V),T(oct)];}

// ===== División del cuadrado =====
const a=30,SQ=[[-a,-a],[a,-a],[a,a],[-a,a]];
function rejilla(n,s='t'){const out=[];for(let i=1;i<n;i++){const v=-a+2*a*i/n;out.push(Lr([v,-a],[v,a],s),Lr([-a,v],[a,v],s));}return out;}
function diags(n,s='b'){const out=[];const h=2*a/n;for(let i=0;i<n;i++)for(let j=0;j<n;j++){const x=-a+i*h,y=-a+j*h;out.push(Lr([x,y],[x+h,y+h],s),Lr([x+h,y],[x,y+h],s));}return out;}
const VB=[-40,-40,80,80];
add('div-2','div','170',tx('Dividir el cuadrado en 2 × 2','Dividing the square into 2 × 2'),VB,[
 {h:tx('El cuadrado','The square'),t:tx('Dibuja un cuadrado con cualquiera de los métodos anteriores.','Draw a square with any of the methods above.'),el:[T(SQ)]},
 {h:tx('Cuartos de circunferencia','Quarter circles'),t:tx('Con centro en cada vértice traza un cuarto de circunferencia de radio igual al lado.','Centered on each corner draw a quarter circle with radius equal to the side.'),el:[A(SQ[0],2*a,-90,0),A(SQ[1],2*a,180,270),A(SQ[2],2*a,90,180),A(SQ[3],2*a,0,90)]},
 {h:tx('Unir los cortes','Join the crossings'),t:tx('Une los puntos donde se cortan los arcos: salen dos rectas paralelas a los lados.','Join the points where the arcs cross: two lines parallel to the sides appear.'),el:[Lr([0,-a],[0,a],'b'),Lr([-a,0],[a,0],'b')]},
 {h:tx('Cuatro cuadrados','Four squares'),t:tx('Esas dos rectas dividen el cuadrado en cuatro cuadrados iguales.','Those two lines divide the square into four equal squares.'),el:rejilla(2)}]);
add('div-4','div','170',tx('Dividir el cuadrado en 4 × 4','Dividing the square into 4 × 4'),VB,[
 {h:tx('Cuatro cuadrados','Four squares'),t:tx('Parte del cuadrado dividido en cuatro.','Start from the square divided into four.'),el:[T(SQ)].concat(rejilla(2))},
 {h:tx('Diagonales','Diagonals'),t:tx('Traza las diagonales de los cuatro cuadrados.','Draw the diagonals of the four squares.'),el:diags(2,'c')},
 {h:tx('Unir los cortes','Join the crossings'),t:tx('Une los puntos donde se cortan las diagonales con paralelas a los lados.','Join the points where the diagonals cross with parallels to the sides.'),el:[Lr([-a/2,-a],[-a/2,a],'b'),Lr([a/2,-a],[a/2,a],'b'),Lr([-a,-a/2],[a,-a/2],'b'),Lr([-a,a/2],[a,a/2],'b')]},
 {h:tx('Dieciséis cuadrados','Sixteen squares'),t:tx('El cuadrado queda dividido en 16.','The square is divided into 16.'),el:rejilla(4)}]);
add('div-8','div','170',tx('Dividir el cuadrado en 8 × 8','Dividing the square into 8 × 8'),VB,[
 {h:tx('Dieciséis cuadrados','Sixteen squares'),t:tx('Parte del cuadrado dividido en 16.','Start from the square divided into 16.'),el:[T(SQ)].concat(rejilla(4))},
 {h:tx('Diagonales','Diagonals'),t:tx('Como antes, traza las diagonales de los cuadrados.','As before, draw the diagonals of the squares.'),el:diags(4,'c')},
 {h:tx('Unir los cortes','Join the crossings'),t:tx('Une con paralelas a los lados los puntos donde se cortan las diagonales.','Join with parallels to the sides the points where the diagonals cross.'),el:[1,3,5,7].flatMap(i=>{const v=-a+2*a*i/8;return[Lr([v,-a],[v,a],'b'),Lr([-a,v],[a,v],'b')];})},
 {h:tx('Sesenta y cuatro','Sixty-four'),t:tx('El cuadrado queda dividido en 64.','The square is divided into 64.'),el:rejilla(8)}]);
{const M=[[0,-a],[a,0],[0,a],[-a,0]];const lineas=[[M[0],SQ[3]],[M[0],SQ[2]],[M[1],SQ[0]],[M[1],SQ[3]],[M[2],SQ[0]],[M[2],SQ[1]],[M[3],SQ[1]],[M[3],SQ[2]]];
add('div-3','div','171',tx('Dividir el cuadrado en 3 × 3','Dividing the square into 3 × 3'),VB,[
 {h:tx('Cuatro cuadrados','Four squares'),t:tx('Parte del cuadrado dividido en cuatro.','Start from the square divided into four.'),el:[T(SQ),Lr([0,-a],[0,a],'b'),Lr([-a,0],[a,0],'b')]},
 {h:tx('Un octógono en el centro','An octagon in the center'),t:tx('Une el punto medio de cada lado con los vértices del lado opuesto. En el centro forman un octógono.','Join the midpoint of each side to the corners of the opposite side. In the center they form an octagon.'),el:lineas.map(([p,q])=>Lr(p,q))},
 {h:tx('Paralelas','Parallels'),t:tx('Traza paralelas a los lados que pasen por los vértices del octógono.','Draw parallels to the sides through the corners of the octagon.'),el:[-a/3,a/3].flatMap(v=>[Lr([v,-a],[v,a],'b'),Lr([-a,v],[a,v],'b')])},
 {h:tx('Nueve cuadrados','Nine squares'),t:tx('Esas cuatro rectas dividen el cuadrado en nueve cuadrados iguales.','Those four lines divide the square into nine equal squares.'),el:rejilla(3)}]);
add('div-6','div','171',tx('Dividir el cuadrado en 6 × 6','Dividing the square into 6 × 6'),VB,[
 {h:tx('Nueve cuadrados','Nine squares'),t:tx('Parte del cuadrado dividido en nueve, con las rectas que unen el centro de cada lado con los vértices opuestos.','Start from the square divided into nine, with the lines joining the middle of each side to the opposite corners.'),el:[T(SQ)].concat(rejilla(3),lineas.map(([p,q])=>Lr(p,q,'b')))},
 {h:tx('Nuevas paralelas','New parallels'),t:tx('Esas rectas cortan a las que dividen en 3 × 3 en nuevos puntos. Por ellos traza paralelas a los lados.','Those lines cut the 3 × 3 lines at new points. Draw parallels to the sides through them.'),el:[-4,0,4].map(i=>i*a/6).flatMap(v=>[Lr([v,-a],[v,a],'c'),Lr([-a,v],[a,v],'c')])},
 {h:tx('Treinta y seis','Thirty-six'),t:tx('El cuadrado queda dividido en 36.','The square is divided into 36.'),el:rejilla(6)}]);
add('div-9','div','171',tx('Dividir el cuadrado en 9 × 9','Dividing the square into 9 × 9'),VB,[
 {h:tx('Diagonales en las esquinas','Diagonals in the corners'),t:tx('En el cuadrado dividido en nueve, traza las diagonales de los cuadrados de las esquinas.','In the square divided into nine, draw the diagonals of the corner squares.'),el:[T(SQ)].concat(rejilla(3),lineas.map(([p,q])=>Lr(p,q,'b')),[[-a,-a],[a/3,-a],[-a,a/3],[a/3,a/3]].flatMap(([x,y])=>[Lr([x,y],[x+2*a/3,y+2*a/3]),Lr([x+2*a/3,y],[x,y+2*a/3])]))},
 {h:tx('Primeras paralelas','First parallels'),t:tx('Por los puntos donde esas diagonales cortan a las rectas que unen vértices y centros de los lados, traza paralelas a los lados.','Through the points where those diagonals cut the lines joining corners and side midpoints, draw parallels to the sides.'),el:[-7,-5,5,7].map(i=>i*a/9).flatMap(v=>[Lr([v,-a],[v,a],'c'),Lr([-a,v],[a,v],'c')])},
 {h:tx('Más paralelas','More parallels'),t:tx('Sigue con nuevas paralelas por los cortes de las últimas rectas con las que unen vértices y centros.','Continue with new parallels through the crossings of the latest lines with those joining corners and midpoints.'),el:[-1,1].map(i=>i*a/9).flatMap(v=>[Lr([v,-a],[v,a],'c'),Lr([-a,v],[a,v],'c')])},
 {h:tx('Ochenta y uno','Eighty-one'),t:tx('El cuadrado queda dividido en 81.','The square is divided into 81.'),el:rejilla(9)}]);}

// ===== Pentágono y decágono =====
{const O=[0,0],R=35,A0=[-R,0],E0=[0,R],Lp=[0,-R],[Bp,Cp]=cc(A0,R,O,R).sort((p,q)=>p[1]-q[1]).reverse(),D0=[-R/2,0];
 const u=[(D0[0]-E0[0])/dist(E0,D0),(D0[1]-E0[1])/dist(E0,D0)],F0=[E0[0]+u[0]*(dist(E0,D0)-R/2),E0[1]+u[1]*(dist(E0,D0)-R/2)],G0=[E0[0]+u[0]*(dist(E0,D0)+R/2),E0[1]+u[1]*(dist(E0,D0)+R/2)];
 const pen=reg(O,R,5,90),dec=reg(O,R,10,90),rF=dist(E0,F0),rG=dist(E0,G0);
add('pent-dec','pent','172',tx('Pentágono y decágono a partir de la circunferencia','Pentagon and decagon from the circle'),[-50,-50,100,100],[
 {h:tx('Mediatriz del radio','Bisector of the radius'),t:tx('Parte de la circunferencia dividida en cuatro. Con centro en A y el mismo radio traza un arco; une sus cortes B y C: es la mediatriz del radio OA.','Start from the circle divided into four. Centered on A with the same radius draw an arc; join its crossings B and C: the bisector of the radius OA.'),
  el:[C(O,R,'b'),Lr([-R,0],[R,0],'b'),Lr([0,-R],[0,R],'b'),A(A0,R,-62,62),Lr(Bp,Cp),P(A0,'A',-7,3),P(O,'O',3,-3),P(Bp,'B',3,6),P(Cp,'C',3,-3)]},
 {h:tx('Circunferencia en D','Circle on D'),t:tx('Con centro en D, el punto medio del radio, traza una circunferencia de diámetro igual al radio.','Centered on D, the middle of the radius, draw a circle whose diameter equals the radius.'),el:[C(D0,R/2),P(D0,'D',-3,-4)]},
 {h:tx('Recta por E y D','Line through E and D'),t:tx('Traza la recta que pasa por E (abajo) y por D: corta a la circunferencia pequeña en F y G.','Draw the line through E (bottom) and D: it cuts the small circle at F and G.'),el:[Lr(E0,G0,'c',4),P(E0,'E',3,7),P(F0,'F',3,4),P(G0,'G',-7,-2)]},
 {h:tx('Dos arcos desde E','Two arcs from E'),t:tx('Con centro en E traza dos arcos, de radios EF y EG, hasta la circunferencia grande.','Centered on E draw two arcs, with radii EF and EG, up to the big circle.'),el:[A(E0,rF,20,160),A(E0,rG,40,140)]},
 {h:tx('El pentágono','The pentagon'),t:tx('El arco EG corta a la circunferencia en dos vértices y el arco EF en otros dos; el quinto es el punto de arriba. Únelos: es el pentágono regular.','Arc EG cuts the circle at two vertices and arc EF at two more; the fifth is the top point. Join them: the regular pentagon.'),el:[T(pen)].concat(pen.map((p,i)=>P(p,String(i+1))))},
 {h:tx('El decágono','The decagon'),t:tx('Repite los arcos con centro en el punto de arriba (L): con el diámetro, la circunferencia queda dividida en diez. Une los puntos: es el decágono.','Repeat the arcs centered on the top point (L): with the diameter, the circle is divided into ten. Join the points: the decagon.'),el:[A(Lp,rF,200,340,'b'),A(Lp,rG,220,320,'b'),T(dec)]}]);}
{const A0=[-20,30],B0=[20,30],m=[0,30],Cq=[20,-10],rD=dist(m,Cq),D0=[rD,30],rA=dist(A0,D0);
 const F0=cc(A0,rA,B0,rA).sort((p,q)=>p[1]-q[1])[0],E0=cc(B0,40,A0,rA).sort((p,q)=>p[1]-q[1])[0],G0=cc(A0,40,B0,rA).sort((p,q)=>p[1]-q[1])[0];
add('pent-lado','pent','173',tx('Pentágono a partir del lado','Pentagon from its side'),[-55,-42,110,82],[
 {h:tx('Un cuadrado y un arco','A square and an arc'),t:tx('Dibuja un cuadrado de lado AB (basta con AB y BC). Con centro en m, punto medio de AB, y radio mC traza un arco hasta la prolongación de AB: es D.','Draw a square on AB (AB and BC are enough). Centered on m, the middle of AB, with radius mC draw an arc to the extension of AB: that is D.'),
  el:[T([A0,B0],false),Lr(B0,Cq,'b'),Lr(Cq,[-20,-10],'b'),Lr([-20,-10],A0,'b'),Lr(m,Cq,'b'),A(m,rD,0,64),Lr(B0,D0,'b'),P(A0,'A',-7,6),P(B0,'B',-2,7),P(m,'m',-2,7),P(Cq,'C'),P(D0,'D',2,7)]},
 {h:tx('Vértice F','Vertex F'),t:tx('Con centro en A y radio AD traza un arco; con centro en B y el mismo radio, otro. Se cortan en F.','Centered on A with radius AD draw an arc; centered on B with the same radius, another. They cross at F.'),el:[A(A0,rA,40,80),A(B0,rA,100,140),P(F0,'F')]},
 {h:tx('Vértices E y G','Vertices E and G'),t:tx('Con centros en A y en B traza arcos de radio AB. Cortan a los arcos anteriores en E y G.','Centered on A and B draw arcs with radius AB. They cut the previous arcs at E and G.'),el:[A(B0,40,40,120),A(A0,40,60,140),P(E0,'E'),P(G0,'G',-7,-3)]},
 {h:tx('El pentágono','The pentagon'),t:tx('Une los puntos en orden: es el pentágono regular.','Join the points in order: the regular pentagon.'),el:[T([A0,B0,E0,F0,G0])]}]);}

// ===== Rectángulos =====
{const A0=[-30,30],B0=[10,30],C0=[10,-10],D0=[-30,-10],M0=[-10,30],rE=dist(M0,C0),E0=[-10+rE,30],F0=[E0[0],-10];
add('aureo','rect','173',tx('Rectángulo áureo','Golden rectangle'),[-40,-23,90,84],[
 {h:tx('El cuadrado','The square'),t:tx('Parte de un cuadrado ABCD.','Start from a square ABCD.'),el:[T([A0,B0,C0,D0]),P(A0,'A',-7,6),P(B0,'B',-2,7),P(C0,'C'),P(D0,'D',-7,-3)]},
 {h:tx('Punto medio','Midpoint'),t:tx('Halla el punto medio M de AB con su mediatriz: arcos iguales con centro en A y B, y une sus cortes.','Find the midpoint M of AB with its bisector: equal arcs centered on A and B, and join where they cross.'),el:[A(A0,28,30,75,'b'),A(B0,28,105,150,'b'),A(A0,28,-75,-30,'b'),A(B0,28,210,255,'b'),Lr([-10,10],[-10,50],'b'),P(M0,'M',-2,7)]},
 {h:tx('Arco desde M','Arc from M'),t:tx('Con centro en M y radio MC traza un arco hasta la prolongación de AB: es E.','Centered on M with radius MC draw an arc to the extension of AB: that is E.'),el:[Lr(M0,C0),A(M0,rE,-3,66),Lr(B0,E0,'b'),P(E0,'E',2,7)]},
 {h:tx('El rectángulo','The rectangle'),t:tx('Halla F con dos arcos: de radio AE con centro en D, y de radio AD con centro en E. AE / EF = φ ≈ 1,618, la proporción áurea.','Find F with two arcs: radius AE centered on D, and radius AD centered on E. AE / EF = φ ≈ 1.618, the golden ratio.'),el:[A(D0,dist(A0,E0),-8,8,'b'),A(E0,40,80,100,'b'),T([A0,E0,F0,D0]),P(F0,'F')]}]);}
{const A0=[-30,30],B0=[10,30],C0=[10,-10],D0=[-30,-10],rE=dist(A0,C0),E0=[-30+rE,30],F0=[E0[0],-10],rG=dist(A0,F0),G0=[-30+rG,30],H0=[G0[0],-10];
add('raiz2','rect','174',tx('Rectángulo √2','The √2 rectangle'),[-40,-22,90,62],[
 {h:tx('Arco con la diagonal','Arc with the diagonal'),t:tx('Parte de un cuadrado ABCD. Con centro en A y radio AC (la diagonal) traza un arco hasta la prolongación de AB: es E.','Start from a square ABCD. Centered on A with radius AC (the diagonal) draw an arc to the extension of AB: that is E.'),
  el:[T([A0,B0,C0,D0]),Lr(A0,C0),A(A0,rE,-3,50),Lr(B0,E0,'b'),P(A0,'A',-7,6),P(B0,'B',-2,7),P(C0,'C'),P(D0,'D',-7,-3),P(E0,'E',2,7)]},
 {h:tx('El rectángulo √2','The √2 rectangle'),t:tx('Halla F con dos arcos (centro D y radio AE; centro E y radio AD). AE / AD = √2: es la proporción de los papeles A4 y A3.','Find F with two arcs (center D radius AE; center E radius AD). AE / AD = √2: the proportion of A4 and A3 paper.'),el:[T([A0,E0,F0,D0]),P(F0,'F')]}]);
add('raiz3','rect','174',tx('Rectángulo √3','The √3 rectangle'),[-40,-22,90,62],[
 {h:tx('Desde el rectángulo √2','From the √2 rectangle'),t:tx('Tras el rectángulo √2, traza un arco con centro en A y radio la diagonal AF. Corta a la prolongación de AE en G.','After the √2 rectangle, draw an arc centered on A with the diagonal AF as radius. It cuts the extension of AE at G.'),
  el:[T([A0,E0,F0,D0]),Lr(A0,F0),A(A0,rG,-3,40),Lr(E0,G0,'b'),P(A0,'A',-7,6),P(E0,'E',-2,7),P(F0,'F'),P(D0,'D',-7,-3),P(G0,'G',2,7)]},
 {h:tx('El rectángulo √3','The √3 rectangle'),t:tx('Halla H con dos arcos como antes. AG / AD = √3: la misma proporción que hay entre la altura del triángulo equilátero y la mitad de su lado.','Find H with two arcs as before. AG / AD = √3: the same ratio as the height of an equilateral triangle to half its side.'),el:[T([A0,G0,H0,D0]),P(H0,'H')]}]);}
{const A0=[-40,25],B0=[0,25],C0=[0,-15],D0=[-40,-15],rE=dist(B0,D0),E0=[rE,25],F0=[rE,-15];
add('plata','rect','174',tx('Rectángulo de plata','Silver rectangle'),[-48,-40,110,75],[
 {h:tx('Arco con la diagonal','Arc with the diagonal'),t:tx('Parte de un cuadrado ABCD. Con centro en B y radio la diagonal BD traza un arco hasta la prolongación de AB: es E.','Start from a square ABCD. Centered on B with the diagonal BD as radius draw an arc to the extension of AB: that is E.'),
  el:[T([A0,B0,C0,D0]),Lr(B0,D0),A(B0,rE,-3,140),Lr(B0,E0,'b'),P(A0,'A',-7,6),P(B0,'B',-2,7),P(C0,'C'),P(D0,'D',-7,-3),P(E0,'E',2,7)]},
 {h:tx('El rectángulo de plata','The silver rectangle'),t:tx('Halla F como en los casos anteriores. AE / AD = 1 + √2, la proporción de plata, la que hay en los octógonos.','Find F as before. AE / AD = 1 + √2, the silver ratio, found in octagons.'),el:[T([A0,E0,F0,D0]),P(F0,'F')]}]);}
{const O=[0,0],R=35,oct=reg(O,R,8,0),Ls=dist(oct[0],oct[1]);
add('cordobes','rect','175',tx('Rectángulo cordobés','Cordovan rectangle'),[-45,-45,90,90],[
 {h:tx('Radio y lado del octógono','Radius and side of the octagon'),t:tx('En un octógono regular, compara el radio R con el lado L. R / L ≈ 1,3066 es la proporción cordobesa, que el arquitecto Rafael de la Hoz encontró en muchos monumentos de Córdoba.','In a regular octagon compare the radius R with the side L. R / L ≈ 1.3066 is the Cordovan ratio, found by the architect Rafael de la Hoz in many monuments of Córdoba.'),
  el:[T(oct)].concat(oct.map(p=>Lr(O,p,'b')),[Lr(O,oct[0],'c'),Lr(oct[0],oct[1],'c')])},
 {h:tx('El rectángulo','The rectangle'),t:tx('El rectángulo cordobés tiene sus lados en esa proporción: uno igual al radio y otro igual al lado.','The Cordovan rectangle has its sides in that ratio: one equal to the radius and the other to the side.'),el:[T([O,[R,0],[R,-Ls],[0,-Ls]])]}]);}

// ===== Polígonos estrellados =====
{const O=[0,0],R=35;const est=(n,k,h,t)=>({h,t,solo:true,el:[C(O,R+3,'b'),T(reg(O,R,n,90)),...estrella(reg(O,R,n,90),k)].map((e,i)=>i===1?Object.assign(e,{s:'c'}):e)});
add('estrellas','est','175',tx('Polígonos estrellados y estrellas','Star polygons and stars'),[-45,-45,90,90],[
 est(5,2,tx('Pentágono estrellado','Pentagram'),tx('Une los vértices del pentágono saltando uno: con un solo trazo recorres todos y vuelves al principio. Es un polígono estrellado.','Join the pentagon’s vertices skipping one: in one stroke you pass through all of them and return to the start. It is a star polygon.')),
 est(6,2,tx('Estrella de seis','Six-pointed star'),tx('En el hexágono, saltando uno solo dibujas un triángulo; para los otros tres vértices hace falta otro. Es una estrella formada por dos polígonos.','In the hexagon, skipping one only draws a triangle; the other three vertices need a second one. It is a star made of two polygons.')),
 est(7,2,tx('Heptágono, paso 2','Heptagon, step 2'),tx('Del heptágono salen dos polígonos estrellados: este, saltando un vértice…','The heptagon gives two star polygons: this one, skipping one vertex…')),
 est(7,3,tx('Heptágono, paso 3','Heptagon, step 3'),tx('…y este, saltando dos.','…and this one, skipping two.')),
 est(8,3,tx('Octógono estrellado','Star octagon'),tx('En el octógono, saltando dos sale el octógono estrellado, un polígono estrellado.','In the octagon, skipping two gives the star octagon, a star polygon.')),
 est(8,2,tx('Dos cuadrados','Two squares'),tx('Saltando solo uno salen dos cuadrados superpuestos: una estrella por superposición. Unos polígonos tienen un estrellado, otros varios y otros ninguno.','Skipping only one gives two overlapping squares: a star by superposition. Some polygons have one star polygon, some several, some none.'))]);}

// ===== Movimientos en el plano =====
{const tri=[[-38,10],[-26,10],[-38,-12]],mv=(P,dx,dy)=>P.map(([x,y])=>[x+dx,y+dy]),rot=(P,c,d)=>P.map(p=>{const r=dist(c,p),a=ang(c,p);return pol(c,r,a+d);}),ref=(P,x0)=>P.map(([x,y])=>[2*x0-x,y]);
 const am='#e0b84a';
add('movimientos','mov','164',tx('Movimientos en el plano','Moves in the plane'),[-45,-30,90,60],[
 {h:tx('Traslación','Translation'),t:tx('Todos los puntos se desplazan la misma distancia y en la misma dirección. La figura no gira.','Every point moves the same distance in the same direction. The figure does not turn.'),solo:true,el:[F(tri,am),F(mv(tri,40,-8),am),...tri.map(p=>Lr(p,[p[0]+40,p[1]-8],'b'))]},
 {h:tx('Giro','Rotation'),t:tx('Todos los puntos giran el mismo ángulo alrededor de un punto fijo, el centro de giro.','Every point turns by the same angle around a fixed point, the center of rotation.'),solo:true,el:[F(tri,am),F(rot(tri,[-5,20],-70),am),P([-5,20],'O',3,-3),...tri.map(p=>arcoPor([-5,20],rot([p],[-5,20],-70)[0],p,'b',0))]},
 {h:tx('Simetría','Reflection'),t:tx('Cada punto pasa al otro lado de una recta, el eje, a la misma distancia.','Each point moves to the other side of a line, the axis, at the same distance.'),solo:true,el:[F(tri,am),F(ref(tri,-10),am),Lr([-10,-28],[-10,28],'c'),...tri.map(p=>Lr(p,[2*-10-p[0],p[1]],'b'))]},
 {h:tx('Simetría con deslizamiento','Glide reflection'),t:tx('Una simetría seguida de una traslación paralela al eje. Con estos cuatro movimientos se generan todos los mosaicos.','A reflection followed by a translation along the axis. These four moves generate every tiling.'),solo:true,el:[F(tri,am),F(mv(ref(tri,-10),0,14),am),Lr([-10,-28],[-10,28],'c')]}]);}

return {L,grupos:{mov:tx('Movimientos','Moves'),tri:tx('Triángulo y hexágono','Triangle and hexagon'),cuad:tx('Cuadrado y octógono','Square and octagon'),div:tx('Dividir el cuadrado','Dividing the square'),pent:tx('Pentágono y decágono','Pentagon and decagon'),rect:tx('Rectángulos','Rectangles'),est:tx('Estrellas','Stars')}};
})();
// Dibujo de un paso de una construcción: lo anterior atenuado, lo nuevo animado y la tinta en negro
function consSvg(c,n,soloFinal){const [x0,y0,w,h]=c.vb,u=w/100,lt=t=>EN?t[1]:t[0];
  const f=n=>+n.toFixed(2);
  const pinta=(e,estado)=>{ // estado: 'prev' | 'cur' | 'fin'
    const s=e.s,anim=estado==='cur'&&e.k!=='p'&&s!=='f'?' class="draw actual"':estado==='prev'&&e.k!=='p'&&s!=='f'?' class="previo"':'';
    const tinta=s==='t',col=s==='t'?'#1b1b1b':s==='b'?'#4f7fb0':'#b5444b';
    const sw=(tinta?0.55:0.3)*u*(estado==='prev'&&!tinta?0.85:1),dash=estado==='prev'&&!tinta?` stroke-dasharray="${f(1.4*u)} ${f(0.9*u)}"`:'';
    const op=estado==='prev'&&!tinta?' opacity="0.55"':'';
    const st=`fill="none" stroke="${col}" stroke-width="${f(sw)}"${dash}${op} stroke-linecap="round" stroke-linejoin="round"${anim}`;
    if(e.k==='C')return `<circle cx="${f(e.c[0])}" cy="${f(e.c[1])}" r="${f(e.r)}" pathLength="1" ${st}/>`;
    if(e.k==='L')return `<line x1="${f(e.p[0])}" y1="${f(e.p[1])}" x2="${f(e.p[2])}" y2="${f(e.p[3])}" pathLength="1" ${st}/>`;
    if(e.k==='A'){const p=[e.c[0]+e.r*Math.cos(e.d0*Math.PI/180),e.c[1]-e.r*Math.sin(e.d0*Math.PI/180)],q=[e.c[0]+e.r*Math.cos(e.d1*Math.PI/180),e.c[1]-e.r*Math.sin(e.d1*Math.PI/180)];
      return `<path d="M${f(p[0])} ${f(p[1])}A${f(e.r)} ${f(e.r)} 0 ${(e.d1-e.d0)%360>180?1:0} 0 ${f(q[0])} ${f(q[1])}" pathLength="1" ${st}/>`;}
    if(e.k==='P'){const d='M'+e.pts.map(p=>f(p[0])+' '+f(p[1])).join('L')+(e.cerr?'Z':'');
      if(s==='f')return `<path d="${d}" fill="${e.col}" stroke="#7a5a10" stroke-width="${f(0.25*u)}"${estado==='cur'?' class="fade"':''}/>`;
      return `<path d="${d}" pathLength="1" ${st}/>`;}
    if(e.k==='p'){if(estado==='fin')return '';const r=0.9*u;return `<g${estado==='cur'?' class="fade"':''}><rect x="${f(e.p[0]-r)}" y="${f(e.p[1]-r)}" width="${f(2*r)}" height="${f(2*r)}" transform="rotate(45 ${f(e.p[0])} ${f(e.p[1])})" fill="#e6f0c8" stroke="#3d7a3a" stroke-width="${f(0.2*u)}"/>${e.l?`<text x="${f(e.p[0]+e.dx*u/1.6)}" y="${f(e.p[1]+e.dy*u/1.6)}" font-size="${f(3.6*u)}" font-family="Inter,sans-serif" font-weight="600" fill="#22201c">${e.l}</text>`:''}</g>`;}
    return '';};
  let g='';const ps=c.pasos;
  if(soloFinal){ // objetivo: la tinta de todos los pasos (o el último paso si es «solo»)
    const ult=ps[ps.length-1];const els=c.obj||(ult.solo?ult.el:ult.el.filter(e=>e.s==='t'||e.s==='f'));
    g=els.map(e=>pinta(e,'fin')).join('');}
  else{const cur=ps[n-1];
    if(cur.solo){const ant=n>1&&ps[n-2].solo?new Set(ps[n-2].el.map(e=>JSON.stringify(e))):new Set(); // lo que ya estaba en el paso anterior no se vuelve a animar
      g=cur.el.map(e=>pinta(e,ant.has(JSON.stringify(e))?'quieto':'cur')).join('');}
    else{for(let i=0;i<n-1;i++)g+=ps[i].el.filter(e=>e.k!=='p').map(e=>pinta(e,'prev')).join('');
      g+=cur.el.filter(e=>e.k!=='p').map(e=>pinta(e,'cur')).join('');
      for(let i=0;i<n;i++)g+=ps[i].el.filter(e=>e.k==='p').map(e=>pinta(e,i===n-1?'cur':'prev')).join('');}}
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0} ${y0} ${w} ${h}" width="100%"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#fffefa"/>${g}</svg>`;}


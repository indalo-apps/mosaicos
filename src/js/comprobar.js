// ---------- «Comprueba antes de seguir» (v2.18) ----------
// En papel, un fallo del paso 3 se descubre en el paso 9. Cada comprobación es algo que se puede mirar con la regla o el compás
// antes de pasar al paso siguiente. No vienen de los libros: salen de la propia construcción (lo que tiene que cumplirse si está bien hecha).
// COMPROBAR[id][paso] = [español, inglés]; COMPROBAR_B, para el segundo método (con cuadrícula).
const COMPROBAR={
  lazo8:{1:['5 + 7 + 5 + 7 + 5 suman 29 cuadros por lado, y los nueve cuadrados de 5 × 5 quedan alineados en tres filas y tres columnas.','5 + 7 + 5 + 7 + 5 add up to 29 squares per side, and the nine 5 × 5 squares line up in three rows and three columns.'],
    2:['Cada punta del rombo sobresale un cuadro del cuadrado, justo en mitad de su lado.','Each tip of the rhombus sticks out one square beyond the square, right at the middle of its side.'],
    3:['Cada diagonal, al prolongarla, pasa justo por la punta de un rombo vecino.','Each diagonal, once extended, passes exactly through the tip of a neighboring rhombus.'],
    6:['Sigue cada línea con el dedo: todas forman caminos cerrados, sin cabos sueltos.','Follow each line with your finger: they all form closed paths, with no loose ends.']},
  zaguan:{1:['Pon la regla sobre los cruces: quedan alineados en horizontal y en vertical, todos a la misma distancia.','Lay the ruler across the crossings: they line up horizontally and vertically, all the same distance apart.']},
  toledanos:{1:['En cada cruce se encuentran seis triángulos y pasan tres rectas. Con el compás abierto a un lado, todos los lados miden lo mismo.','Six triangles meet and three lines cross at every crossing. With the compass set to one side, every side measures the same.']},
  cenador6:{1:['En cada cruce se encuentran seis triángulos y pasan tres rectas. Con el compás abierto a un lado, todos los lados miden lo mismo.','Six triangles meet and three lines cross at every crossing. With the compass set to one side, every side measures the same.']},
  munecas17:{1:['Las dos diagonales del cuadrado grande miden lo mismo y pasan por las esquinas del cuadro del centro.','The two diagonals of the big square are equal and pass through the corners of the middle square.'],
    2:['Los cuatro lados inclinados del octógono miden lo mismo que la diagonal de un cuadro, y los otros cuatro, lo mismo que su lado. Las tres franjas tienen el mismo ancho.','The four slanted sides of the octagon measure the same as the diagonal of a square, and the other four the same as its side. The three bands are equally wide.']},
  cubos:{1:['Las diagonales se continúan de un cuadro al siguiente en línea recta, y todas son paralelas.','The diagonals carry on from one square to the next in a straight line, and they are all parallel.']},
  alargadas:{1:['Cada circunferencia toca a sus cuatro vecinas sin cortarlas, justo en un cruce de la cuadrícula.','Each circle touches its four neighbors without cutting them, right on a crossing of the grid.'],
    2:['Los ocho vértices de cada estrella están sobre su circunferencia, repartidos por igual: cuatro en las líneas de la cuadrícula y cuatro en las diagonales.','The eight vertices of each star lie on its circle, evenly spaced: four on the grid lines and four on the diagonals.']},
  alfardones:{1:['Cada grupo de 3,5 + 5 + 3,5 mide 12 cuadros de lado.','Each group of 3.5 + 5 + 3.5 measures 12 squares per side.'],
    2:['Las estrellas vecinas se tocan justo por las puntas, y cada estrella queda igual si giras el papel un cuarto de vuelta.','Neighboring stars touch exactly at their tips, and each star looks the same if you turn the paper a quarter turn.']},
  octogonos:{1:['Cada circunferencia toca los cuatro lados de su cuadro en el punto medio, y a sus vecinas sin cortarlas.','Each circle touches the four sides of its square at the midpoint, and its neighbors without cutting them.']},
  zaguan2:{1:['La circunferencia del centro toca a las cuatro semicircunferencias sin cortarlas.','The center circle touches the four semicircles without cutting them.'],
    2:['Los doce puntos quedan a la misma distancia unos de otros (compruébalo con el compás) y los cuatro triángulos son iguales.','The twelve points are the same distance apart (check with the compass) and the four triangles are equal.'],
    3:['Las rectas nuevas salen iguales en los cuatro lados: si giras el papel un cuarto de vuelta, el dibujo no cambia.','The new lines come out the same on all four sides: turn the paper a quarter turn and the drawing does not change.'],
    4:['Cada arco pasa por la esquina opuesta del cuadro de su esquina.','Each arc passes through the opposite corner of its corner square.']},
  felipe:{1:['Los dos cuadrados son iguales y sus ocho vértices reparten la circunferencia en partes iguales.','The two squares are equal and their eight vertices divide the circle into equal parts.'],
    2:['Los ocho puntos de corte están a la misma distancia del centro: pasa el compás por ellos.','The eight crossing points are the same distance from the center: run the compass through them.'],
    3:['Las ocho rectas quedan a la misma distancia del centro y ninguna pasa por él.','The eight lines are the same distance from the center and none of them passes through it.'],
    4:['Las nueve circunferencias tienen el mismo radio, y las ocho de fuera quedan repartidas por igual alrededor del centro.','The nine circles have the same radius, and the eight outer ones are evenly spaced around the center.']},
  barca:{1:['La circunferencia pasa por los cuatro cruces de la cuadrícula más cercanos al centro.','The circle passes through the four grid crossings nearest the center.'],
    2:['Las cuatro rectas forman un cuadrado de pico con los vértices en los ejes, a un cuadro del centro.','The four lines form a square standing on a corner, with its vertices on the axes, one square from the center.'],
    3:['Con las del paso anterior forman una estrella de ocho puntas: los dos cuadrados son iguales y sus vértices están en la circunferencia.','Together with those of the previous step they form an eight-pointed star: the two squares are equal and their vertices lie on the circle.']},
  arrayanes:{1:['Los cuatro arcos pasan por el centro de la circunferencia.','The four arcs pass through the center of the circle.'],
    2:['El lado del hexágono mide lo mismo que el radio: compruébalo con el compás.','The side of the hexagon measures the same as the radius: check it with the compass.'],
    3:['La circunferencia nueva toca cada lado del hexágono en su punto medio, sin cortarlo.','The new circle touches each side of the hexagon at its midpoint, without cutting it.'],
    4:['Las seis puntas de la estrella tocan la circunferencia del paso 3.','The six points of the star touch the circle from step 3.'],
    5:['Los dos triángulos nuevos son iguales a los del paso 4, girados 30°: sus puntas también están en la circunferencia interior.','The two new triangles are equal to those of step 4, turned 30°: their tips also lie on the inner circle.']},
  taca:{1:['La circunferencia toca los cuatro lados del cuadrado en su punto medio.','The circle touches the four sides of the square at their midpoints.'],
    2:['Los dos cuadrados son iguales: mide un lado de cada uno.','The two squares are equal: measure one side of each.'],
    3:['Las ocho puntas del octógono estrellado son los vértices del octógono del paso 2, y el octógono nuevo del centro tiene los ocho lados iguales.','The eight points of the star octagon are the vertices of the octagon from step 2, and the new octagon in the center has eight equal sides.']},
  reyes28:{1:['La circunferencia toca los cuatro lados del cuadrado en su punto medio.','The circle touches the four sides of the square at their midpoints.'],
    2:['Cada arco pasa por los puntos medios de los dos lados que salen de su vértice.','Each arc passes through the midpoints of the two sides that start at its vertex.'],
    3:['Los ocho lados del octógono miden lo mismo.','The eight sides of the octagon measure the same.']},
  reyes29:{1:['Los arcos pasan por el centro, y los doce puntos quedan a la misma distancia unos de otros.','The arcs pass through the center, and the twelve points are the same distance apart.'],
    2:['El lado del hexágono mide lo mismo que el radio.','The side of the hexagon measures the same as the radius.'],
    3:['El segundo hexágono es igual al primero, girado 30°.','The second hexagon is equal to the first, turned 30°.'],
    4:['Los dos triángulos son iguales y sus lados se cortan formando un hexágono pequeño en el centro.','The two triangles are equal and their sides cross to form a small hexagon in the center.'],
    5:['Esta estrella es igual a la del paso 4, girada 30°.','This star is equal to the one from step 4, turned 30°.']},
  jambas31:{1:['Los dos cuadrados son iguales y sus ocho vértices reparten la circunferencia en partes iguales.','The two squares are equal and their eight vertices divide the circle into equal parts.'],
    7:['Cada estrella y cada octógono tienen sus ocho vértices sobre su circunferencia.','Each star and each octagon has its eight vertices on its circle.']}};
const COMPROBAR_B={
  felipe:{1:['Cada lado del módulo mide 28 cuadros: 5 + 9 + 9 + 5.','Each side of the module measures 28 squares: 5 + 9 + 9 + 5.'],
    2:['La circunferencia pasa por un vértice de cada una de las cuatro estrellas; si no, el centro no está bien puesto.','The circle passes through one vertex of each of the four stars; if it does not, the center is misplaced.'],
    3:['Los ocho radios quedan repartidos por igual, cada 45°.','The eight radii are evenly spaced, every 45°.']}};
// Cuántas piezas de cada tipo hay en el trozo que se repite, reducido a la proporción más pequeña (2 : 4 : 8 → 1 : 2 : 4)
function proporcionPiezas(p){if(p.propPiezas)return p.propPiezas;const n=Array(p.nombres.length).fill(0),d=datos(p);
  if(p.prep&&p.prep.piezas)for(const [k] of p.prep.piezas)n[k]++;
  else for(const [k,q] of d.F){let cx=0,cy=0;for(let i=0;i<q.length;i+=2){cx+=q[i];cy+=q[i+1];}cx/=q.length/2;cy/=q.length/2;if(cx>=0&&cx<p.W&&cy>=0&&cy<p.H)n[k]++;}
  const mcd=(a,b)=>b?mcd(b,a%b):a,g=n.filter(Boolean).reduce(mcd,0)||1;
  return p.propPiezas=n.map((v,k)=>[p.nombres[k],v/g]).filter(x=>x[1]>0);}
// Las comprobaciones del paso: la escrita a mano y las que salen del tipo de paso (piezas, cinta, cruces)
function comprobaciones(p,paso,PS,segundo,anchoCinta){const L=[],s=PS[paso-1];if(!s)return L;
  const T=((segundo?COMPROBAR_B:COMPROBAR)[p.id]||{})[paso];if(T)L.push(EN?T[1]:T[0]);
  const tipo=p.id==='lazo8'?({7:'cinta',8:'cruces'})[paso]:s.tipo,cinta=p.tipo==='cinta';
  if(tipo==='remarcar')L.push(tr('Todas las líneas remarcadas acaban en otra línea: no queda ningún trazo suelto ni ninguna pieza abierta.','Every line you have gone over ends on another line: no loose strokes and no open pieces.'));
  if(tipo==='piezas'){const P=proporcionPiezas(p);
    if(P.length>1&&P.length<=8)L.push(tr('Cuenta las piezas. En el dibujo se repite esta proporción: ','Count the pieces. The drawing repeats this proportion: ')+P.map(([n,v])=>`${v} × ${n}`).join(' · ')+'.');}
  if(tipo==='cinta')L.push(tr('La cinta tiene el mismo ancho en todo el dibujo','The strap is equally wide all over the drawing')+(anchoCinta?tr(`: ${anchoCinta} en tu papel. Mídela en dos o tres sitios.`,`: ${anchoCinta} on your paper. Measure it in two or three places.`):tr(': mídela en dos o tres sitios.',': measure it in two or three places.')));
  if(tipo==='cruces'||(cinta&&(s.entrelazar||(s.tipo==='color'&&!PS.some(q=>q.entrelazar)))))L.push(tr('Sigue una cinta con el dedo: pasa una vez por encima y otra por debajo, alternando, en todos sus cruces.','Follow one strap with your finger: it goes over once and under once, alternating, at every crossing.'));
  return L;}

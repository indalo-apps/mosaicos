// ---------- Patrones (v1.3): el lazo de 8 y los alicatados nuevos ----------
const PATS={lazo8:{id:'lazo8',nombre:'Lazo de 8',lugar:'Patio de las Muñecas',pags:'133 a 136',tipo:'cinta',W:24,H:24,D:D_LAZO,nombres:NAMES,paletas:PRESETS,vistas:VIEWS,rw:0.62,ow:0.07,
  titulo:'Lazo de 8 del Patio de las Muñecas',
  intro:'Es el módulo de las páginas 133 a 136 de <em>El Real Alcázar de Sevilla con regla y compás</em>, trazado sobre la cuadrícula 5-7-5-7.',
  pie:'La geometría sale de la cuadrícula del libro: estrellas de ocho puntas cada 12 cuadros, con cuadrado de 5 y rombo de radio 3,5, prolongadas y remarcadas como en el paso 3 de la página 136. Las líneas rojas discontinuas son las diagonales de construcción y las azules oscuras, las divisiones 5-7.'}};
for(const p of Object.values(PATRONES.P)){const m=+(p.W*0.06).toFixed(2);
  PATS[p.id]=Object.assign(p,{vistas:{mod:[-m,-m,p.W+2*m,p.H+2*m],'2x2':[0,0,2*p.W,2*p.H],'3x2':[0,0,3*p.W,2*p.H],'4x3':[0,0,4*p.W,3*p.H],panel:p.panel?p.panel.campo:[0,0,3*p.W,2*p.H]},
    titulo:p.nombre+' · '+p.lugar,intro:p.coleccion==='alhambra'?`Es el alicatado n.º ${p.num} de <em>La Alhambra con regla y compás</em>. ${p.resumen}`:`Es el alicatado de las páginas ${p.pags} de <em>El Real Alcázar de Sevilla con regla y compás</em>. ${p.resumen}`});}
const MONU={alcazar:['Real Alcázar de Sevilla','Royal Alcázar of Seville'],alhambra:['La Alhambra de Granada','The Alhambra of Granada']};
const monu=p=>tr(...MONU[p.coleccion||'alcazar']);
// ---------- Inglés (v1.5): nombres, textos y pasos de cada alicatado ----------
const LIBRO_EN='<em>El Real Alcázar de Sevilla con regla y compás</em> (“The Royal Alcázar of Seville with ruler and compass”)';
const PAL_EN={'Alcázar':'Alcázar','Alhambra':'Alhambra','Yesería':'Plasterwork','Azul y oro':'Blue & gold','Melado y cobalto':'Honey & cobalt','Terracota':'Terracotta','Azulejo portugués':'Portuguese azulejo','Verde y oro':'Green & gold','Para colorear':'For coloring','Azul y blanco':'Blue & white','Cobalto':'Cobalt','Dos azules':'Two blues','Melado':'Honey','Grises':'Grays','Verde y negro':'Green & black','Azul':'Blue','Verde y melado':'Green & honey'};
const PAT_EN={
 lazo8:{nombre:'Eight-fold knot',lugar:'Patio de las Muñecas',
  nombres:['Corner star','Small piece by the star','Alfardón (long hexagon)','Side V piece','Triangle by the alfardón','Triangle by the central star','Edge star','Central V piece','Central star'],
  intro:'The module on pages 133–136 of '+LIBRO_EN+', drawn on the 5-7-5-7 grid.',
  pie:'The geometry comes from the book’s grid: eight-pointed stars every 12 squares, with a square of 5 and a rhombus of radius 3.5, extended and inked as in step 3 on page 136. The dashed red lines are the construction diagonals and the dark blue ones, the 5-7 divisions.',
  pasos:[
   {h:'The grid',t:'Draw a grid of 29 × 29 squares. Mark the divisions alternating 5 and 7 squares: 5-7-5-7-5. This gives nine 5 × 5 squares, one at each crossing of the narrow bands.',c:'With 6.5 mm squares the module is about 19 cm wide and fits on A4. Use a hard pencil (2H) and a very light touch.'},
   {h:'The eight-pointed stars',t:'In each 5-square draw a star: the square itself and, on top, a rhombus with the same center turned 45°, whose points stick out one square on each side (3.5 squares from the center).',c:'It is the grid version of the two-square star that the book draws with a compass on page 133.'},
   {h:'Extend the sides',t:'Extend the sides of the stars. The sides of the square coincide with the 5-7 lines you already have. Those of the rhombus become diagonals that cross the whole module.',c:'Every line of the final drawing lies on this network: horizontals, verticals and 45° diagonals.'},
   {h:'Ink: straight lines',t:'Start inking the knot. First the horizontal and vertical stretches: they go around the stars and form the square around the central star.',c:'Ink with a softer pencil (HB or 2B). The construction lines stay faded.'},
   {h:'Ink: long diagonals',t:'Ink the long diagonals. They start at the points of the corner rhombuses and cross the module to the stars on the sides.',c:'Notice that each diagonal passes exactly through the point of a neighboring star.'},
   {h:'Ink: short joins',t:'Add the short joins at 45°. They link the straight lines with the diagonals and draw the V points of the stars. Now the knot forms continuous, closed straps.',c:'If a line is left loose, a join is missing: every strap must run without breaks.'},
   {h:'Give the strap its width',t:'Turn each line into a strap: draw a parallel on each side of the line, at the same distance. Then erase the center line and the construction lines.',c:'A strap a little over half a square wide matches the tilework. Work out the width with the box on page 134.'},
   {h:'Interlace',t:'At each crossing one strap goes over and the other under. Follow each strap alternating: over, under, over… and erase the parts of the strap that goes under.',c:'If you alternate correctly along one strap, the others fall into place.'},
   {h:'Color',t:'Now you can paint. Stars and alfardones in black and the V pieces in green reproduce the dado of the patio.',c:'Try out combinations first in the Color tab.'}]},
 zaguan:{nombre:'Squares and straps',lugar:'Zaguán (entrance hall)',
  nombres:['Black square','Green square','Honey square','Small black square','Small green square','Small honey square','Strap (rectangle)'],
  resumen:'White straps crossing at right angles, large squares in the gaps and small squares at the crossings.',
  pie:'It all comes from a grid turned 45°: the lines are inked with the rhythm 1-2-1-2, a one-square lane for the strap and a two-square gap for the square.',
  pasos:[
   {h:'A turned grid',t:'Draw a grid of equal squares turned 45°, like a board standing on a corner. The side of each square will be the width of the white straps.',c:'If it is easier, turn the paper and work with the grid straight: it is the same drawing.'},
   {h:'The 1-2 rhythm',t:'Ink the lines with the rhythm 1-2-1-2…: a one-square lane and a two-square gap, in both directions. The lanes will be the straps; the gaps, the large squares.',c:'Count under your breath: ink, ink, skip two.'},
   {h:'The pieces',t:'Three pieces appear: 2 × 2 squares in the gaps, 1 × 1 squares where the lanes cross and 1 × 2 rectangles that make the straps.',c:'On the dado the straps are white and the squares black, green and honey.'},
   {h:'Color',t:'The black and honey squares are grouped in fours around a small square of the same color, in alternating rows. Everything else is green and the straps, white.',c:'Try other combinations in the Color tab.'}]},
 munecas17:{nombre:'Octagons and squares',lugar:'Patio de las Muñecas',
  nombres:['Central band rectangle','Trapezium','Square between octagons'],
  resumen:'Octagons with unequal sides split into three bands, turning 90° from one to the next, with green squares between them.',
  pie:'Each tile is a 3 × 3 square with an octagon joining the points that divide its sides into thirds; the tile repeats turned 90° around a corner.',
  pasos:[
   {h:'A 3 × 3 square',t:'Draw a square and divide it into 3 × 3 squares. Also draw the diagonals of the squares.',c:'With 2 cm squares each tile is 6 cm and the four-tile block, 12 cm.'},
   {h:'The octagon',t:'Join the points that divide each side into three: you get an octagon with four long sides and four short ones, which are diagonals of the corner squares. Also ink the two lines that split it into three equal bands.',c:'The leftover corners of the square are triangles: four of them together make a square.'},
   {h:'Turn 90°',t:'Repeat the tile turning it 90° around one of its corners. The bands alternate, horizontal and vertical, and four tiles make the repeating module.',c:'Notice that a square standing on its corner is left between four octagons.'},
   {h:'The pieces',t:'There are three pieces: the rectangle of the central band, two trapeziums beside it and the square left between four octagons.',c:'All of them have sides of one square or one square’s diagonal.'},
   {h:'Color',t:'On the dado the rectangles are black, the trapeziums white and the squares green. The drawing looks like a weave of crossing straps.',c:'Try other combinations in the Color tab.'}]},
 toledanos:{nombre:'Hexagons and triangles',lugar:'Toledanos and Sevillanos rooms',
  nombres:['Black hexagon','Green hexagon','Honey hexagon','Triangle'],
  resumen:'Hexagons touching at their corners with white triangles between them; the colors are grouped in rhombuses.',
  pie:'The whole drawing sits on a network of equilateral triangles: the hexagons are groups of six triangles and one triangle is left free between every three hexagons.',
  pasos:[
   {h:'Triangle network',t:'Draw a network of equilateral triangles. You can build it with circles of the same radius, each centered on a crossing of the previous one, or with set squares.',c:'Here the lines of the network are vertical and at 30°, so the hexagons stand on a corner.'},
   {h:'Hexagons',t:'Ink hexagons of six triangles touching at their corners. One triangle is left free between every three hexagons.',c:'If you start with a row, the next one is shifted half a hexagon.'},
   {h:'The pieces',t:'There are only two pieces: the hexagon and the triangle, both with the same side.',c:'It is one of the simplest tile patterns in the Alcázar.'},
   {h:'Color',t:'The color is arranged in rhombuses of 3 × 3 hexagons: a honey one in the middle surrounded by six black ones, and green ones in the acute corners. The triangles are white.',c:'Try other combinations in the Color tab.'}]},
 cenador6:{nombre:'Six-pointed stars',lugar:'Pavilion of Charles V',
  nombres:['Black star','Honey star','Green star','Blue star','Rhombus','Alfardón (long hexagon)'],
  resumen:'Colored six-pointed stars point to point, with white rhombuses and alfardones between them.',
  pie:'Each star is twelve triangles of a network of equilateral triangles: a hexagon and a point on each side. The stars touch at their points.',
  pasos:[
   {h:'Triangle network',t:'Draw a network of equilateral triangles with one family of lines horizontal.',c:'Use a hard pencil and a very light line: the network is only a guide.'},
   {h:'Six-pointed stars',t:'Ink stars of twelve triangles: a hexagon and a point on each side. Place them in rows, point to point, and put each row right under the previous one so they also touch top to bottom.',c:'Between the centers of two neighboring stars in a row there are three triangle sides.'},
   {h:'The pieces',t:'A rhombus is left between two stars in a row, and an alfardón between two rows: a long hexagon of ten triangles.',c:'The three pieces appear by themselves when you draw the stars: no extra line is needed.'},
   {h:'Color',t:'The stars are black, honey, green and blue, and the rhombuses and alfardones white.',c:'In the book there is a variant from the Audience Hall of the Upper Royal Quarters with triangles instead of rhombuses.'}]},
 cubos:{nombre:'Cubes',lugar:'Pavilion of Charles V',
  nombres:['Green square','Honey square','Black square','Top face (white)','Side face (blue)'],
  resumen:'Colored squares with two parallelogram faces, white and blue: they look like cubes seen in perspective.',
  pie:'It is a grid with its descending diagonals: in each row one square in three is left whole and the others are split along the diagonal.',
  pasos:[
   {h:'Grid and diagonals',t:'Draw a grid and in each square draw the diagonal that goes down from left to right.',c:'With 1.5 cm squares, the 3 × 3 module is 4.5 cm.'},
   {h:'Whole squares and faces',t:'In each row leave one square in three whole, moving it one square to the left in the row below. Ink the diagonals of the others and erase the lines joining two triangles of the same face: above each square there is a lying parallelogram and to its left, a standing one.',c:'Each cube is a whole square, the top face and the side face.'},
   {h:'The pieces',t:'Three pieces appear: the square (the front face), the lying parallelogram (the top) and the standing parallelogram (the side).',c:'The two parallelograms are equal; only their position changes.'},
   {h:'Color',t:'The top faces are white and the side faces blue. The squares change color on each staircase: green, honey and black.',c:'Try other combinations in the Color tab.'}]},
 alargadas:{nombre:'Long eight-pointed stars',lugar:'Pavilion of Charles V',
  nombres:['Blue long star','Black long star','Honey long star','White long star (standing)','Dark triangle','Light triangle'],
  resumen:'Colored long eight-pointed stars lying down, and white standing ones, with small squares split in a cross between them.',
  pie:'The base is a network of equal circles, tangent in fours. The pieces come from extending some sides of the eight-pointed stars inscribed in them.',
  pasos:[
   {h:'Grid and circles',t:'Draw a grid with its diagonals. With centers on every other crossing, draw circles that touch in fours: their radius is the side of a square.',c:'The circles are tangent to each other and to the sides of the large 2 × 2 squares.'},
   {h:'Eight-pointed stars',t:'In each circle inscribe an eight-pointed star made of two squares: one with horizontal and vertical sides, and another turned 45°. Extend the horizontal and vertical sides.',c:'The extended sides form a network of lanes; small squares will appear at their crossings.'},
   {h:'Ink',t:'Ink the long stars: around one circle, lying down (with one point up and one down); around its neighbors, standing. A small square is left between four stars; draw its diagonals.',c:'Each long star fits its neighbors with no gaps: the point of one goes into the notch of the other.'},
   {h:'The pieces',t:'There are two pieces: the long star, the same lying down or standing, and the triangle of the small square split in a cross.',c:'At the edges of the panel the stars are cut.'},
   {h:'Color',t:'The standing stars are white. The lying ones go in rows: one of honey stars and another alternating blue and black. In the small squares, the top and bottom triangles are dark.',c:'Try other combinations in the Color tab.'}]},
 alfardones:{nombre:'Four-pointed stars and alfardones',lugar:'Patio de las Muñecas',
  nombres:['Lying alfardón','Standing alfardón','Four-pointed star'],
  resumen:'Alfardones (long hexagons) lying and standing that interweave like a fabric, with white four-pointed stars between them.',
  pie:'It comes from second-crossing eight-pointed stars drawn on a grid with the rhythm 3.5-5-3.5: from each star only the strokes forming the alfardones and the four-pointed star are inked.',
  pasos:[
   {h:'3.5-5-3.5 grid',t:'Draw a grid and ink the lines with the rhythm 3.5 - 5 - 3.5 squares. Each group of 12 squares will hold one star.',c:'The half squares are marked by eye in the middle of the square.'},
   {h:'Eight-pointed stars',t:'In each 12-square draw a second-crossing eight-pointed star: the horizontal and vertical sides run along the inked lines and the slanted ones, at 45°, join the points two by two. Neighboring stars touch at their points.',c:'Each point is 6 squares from the center of its star.'},
   {h:'Ink',t:'From each star ink only the strokes forming the alfardones: long hexagons with 45° ends, lying and standing alternately. The end of each alfardón touches the long side of its neighbor. What is left between them are the four-pointed stars.',c:'Each star mirrors the next: if one turns right, its neighbor turns left.'},
   {h:'The pieces',t:'There are only two pieces: the alfardón, the same lying or standing, and the four-pointed star.',c:'It is the same motif as in the palace entrance, among the tiles of the zaguán.'},
   {h:'Color',t:'On the door jambs almost all the alfardones are black, with some green or honey rows drawing a cross in the middle of the panel. The stars are white.',c:'Try other combinations in the Color tab.'}]},
 octogonos:{nombre:'Octagons and four-pointed stars',lugar:'Skirting of the dados',
  nombres:['Octagon of the dark rows','Octagon of the green rows','Four-pointed star'],
  resumen:'Regular octagons touching at their corners, in dark and green rows, with white four-pointed stars in the gaps.',
  pie:'The base is a grid with its diagonals: a circle is inscribed in each square and in it, a regular octagon.',
  pasos:[
   {h:'Grid and circles',t:'Draw a grid with its diagonals and, in each square, the inscribed circle.',c:'The axes and diagonals divide each circle into eight equal parts.'},
   {h:'Octagons',t:'Join in order the eight points where the axes and diagonals cut each circle: you get a regular octagon with one point up. Neighboring octagons touch at their points.',c:'The gaps left between four octagons are four-pointed stars.'},
   {h:'The pieces',t:'Two pieces: the octagon and the four-pointed star.',c:'At the edges of the panel half stars and quarter stars are used.'},
   {h:'Color',t:'The rows of octagons alternate green and black, and the stars are always white.',c:'Try other combinations in the Color tab.'}]},
 arrayanes:{nombre:'Twelve-pointed stars',lugar:'Entrance to the Court of the Myrtles · plasterwork of the hall',
  nombres:['Twelve-pointed star','Zafate (pentagon)','Four-sided piece','Triangle'],
  resumen:'Twelve-pointed stars inscribed in circles that touch one another, ringed by zafates, on a network of hexagons and another of equilateral triangles.',
  pie:'It all comes from a circle divided into twelve parts: an inscribed hexagon, the circle touching its sides and two six-pointed stars, whose extended sides make the twelve-pointed star.',
  pasos:[
   {h:'Circle and four arcs',t:'Start from a circle with two perpendicular diameters. Centered on the ends of the diameters and with the same radius as the circle, draw four arcs.',c:'It is the division of the circle into 12 from “Learn to draw”.'},
   {h:'Twelve parts and a hexagon',t:'The arcs and diameters divide the circle into twelve equal parts. Draw the diameters through the division points and one of the inscribed hexagons.',c:'The hexagon has one corner at the top and one at the bottom.'},
   {h:'Touching circle',t:'Draw a circle with the same center that touches the sides of the hexagon.',c:'Its radius is the apothem of the hexagon.'},
   {h:'First six-pointed star',t:'Join the midpoints of the hexagon’s sides, every other one, to get a star made of two equilateral triangles.',c:'The midpoints lie on the circle from step 3.'},
   {h:'Second six-pointed star',t:'Now join the ends of the diameters of the inner circle that pass through the corners of the hexagon. You get two new equilateral triangles. Extend their sides until they meet the hexagon’s sides.',c:'Together, the two six-pointed stars give twelve points.'},
   {h:'The twelve-pointed star',t:'Inking the right strokes you get the twelve-pointed star inscribed in the hexagon. This is the module to repeat by translation to cover the plane.',c:'Each side of the two six-pointed stars is inked from where it crosses another side of the same star to the side of the hexagon.'},
   {h:'Repeat the module',t:'The module repeats by translation until it covers the plane. This works because the regular hexagon is one of the polygons that tile the plane.',c:'If you join the centers of the stars, a network of equilateral triangles appears.'},
   {h:'The straps',t:'Give the lines their width with two parallels and alternate the crossings over and under. In the hall it is plasterwork: everything is plaster-colored and the design reads through the relief.',c:'Try other combinations in the Color tab.'}]},
 taca:{nombre:'Eight-pointed stars and zafates',lugar:'Niches of the Comares Tower · Court of the Myrtles',
  nombres:['Large sino (eight-pointed star)','Small sino (eight-pointed star)','Zafate (honey groups)','Zafate (green groups)','Black zafate','Four-pointed star','Small piece'],
  resumen:'Blue eight-pointed stars surrounded by green, honey and black zafates on a background of white pieces. It lines the walls of the tacas, the small niches in the entrance arch of the Comares Tower.',
  pie:'It all comes from a square with its inscribed circle: two squares turned 45° give an octagon, and two ever smaller star octagons give the lines of the module. The module is mirrored and the resulting tile is repeated by translation.',
  pasos:[
   {h:'Square, axes and circle',t:'Start from a square with its diagonals and axes drawn. Centered on the center of the square, draw the inscribed circle.',c:'It is the inscribed circle from “Learn to draw”.'},
   {h:'Two squares and an octagon',t:'Draw lines parallel to the sides through the points where the circle cuts the diagonals. Then join the midpoints of the sides of the square. You get two squares turned 45° and, in the center, a convex octagon.',c:'The parallels are 0.71 from the center, taking the radius of the circle as the unit.'},
   {h:'Star octagon',t:'Joining the vertices of the central octagon non-consecutively, every third one, draw a star octagon. Notice that a new convex octagon appears in its center.',c:'Its sides are parallel to the axes and to the diagonals.'},
   {h:'Another star octagon',t:'Draw another star octagon, smaller still, using the vertices of the new central octagon. Extend its sides until they meet those of the square.',c:'They are eight lines very close to the center: two parallel to each axis and to each diagonal.'},
   {h:'The basic module',t:'From the lines obtained in the previous steps, ink the right strokes to get the basic module.',c:'If you divide the square by its axes, the four parts are equal but turned 90° around the center: it is the smallest basic unit.'},
   {h:'Symmetry',t:'Once you have the module, mirror it using two of its perpendicular sides as axes.',c:'You get a tile of 2 × 2 modules.'},
   {h:'Repeat the tile',t:'Repeat the tile from the previous step by translation, vertically and horizontally.',c:'In Tessellate you will see that a smaller square, turned 45°, is enough to cover the plane.'},
   {h:'Color',t:'In the tilework the sinos are blue; the zafates, green, honey and black, and the rest of the pieces, white. On the panel the edges are finished off and it is crowned with a frieze of white and black merlons, not drawn here.',c:'Try other combinations in the Color tab.'}]},
 barca:{nombre:'Eight-pointed stars and Y pieces',lugar:'Hall of the Boat · Comares Palace',
  nombres:['Blue sino','Honey sino','Black sino','Alfardón (long four-pointed star)','Y piece','Square piece'],
  resumen:'White straps interlace into overlapping octagons, with blue, black and honey eight-pointed stars at their centers, green alfardones and black Y-shaped pieces.',
  pie:'It all comes from an 8 × 8 square with a circle of radius 1: parallels are drawn through where it cuts the axes and diagonals, and more through their crossings. On the wall the module is turned 45°.',
  pasos:[
   {h:'8 × 8 square and circle',t:'Start from a square divided into 8 × 8 squares and ink its axes and diagonals. Draw a circle centered on the square, with a radius of 1/8 of the side.',c:'It is the grid from “Learn to draw” (dividing the square into 8).'},
   {h:'Parallels to the diagonals',t:'Through the points where the circle cuts the axes, draw parallels to the diagonals up to the edge of the square.',c:'You get four lines, two in each direction.'},
   {h:'Parallels to the axes',t:'Through the points where the circle cuts the diagonals, draw lines parallel to the axes.',c:'They are 0.71 squares from the center.'},
   {h:'Parallels to the sides',t:'Through the points where the lines of the two previous steps cross, draw parallels to the sides of the square.',c:'They are the sides of the square around the central star.'},
   {h:'Parallels to the diagonals',t:'Through those same points, now draw parallels to the diagonals.',c:'They cross on the axes: they will be the points of the star.'},
   {h:'More parallels to the sides',t:'Through the points where the lines of step 3 cross those of step 5, draw lines parallel to the sides of the square.',c:'These are the last ones: all the lines of the module are there.'},
   {h:'The structure of the module',t:'With the previous strokes you can now draw the line structure of the module that generates the composition.',c:'An eight-pointed star in the center, surrounded by overlapping octagons, and an arm towards each corner.'},
   {h:'The strap',t:'To draw the strap, whose width is 2B, draw parallels on both sides of the axis at a distance B = A/10, A being the distance between the two lines of step 4. The ratio between strap and gap is 1/4.',c:'The blue mark shows A.'},
   {h:'The straps cross',t:'Once the outline is drawn, just extend some of its sides to create the interlace effect: some straps seem to pass over others in turn.',c:'Each strap goes over at one crossing and under at the next.'},
   {h:'Repeat the module',t:'Repeating the module by translation covers the plane.',c:'Looking only at the outline, the module can be divided into eight equal, symmetrical parts.'},
   {h:'Turn 45°',t:'To place the design as it appears on the wall, turn it 45°. On the dado the sinos are blue, black and honey, the alfardones green and the Y pieces black.',c:'Try other combinations in the Color tab.'}]},
 felipe:{nombre:'Skewed eight-fold rosette',lugar:'Hall of the Philip II Ceiling',
  nombres:['Black sino (central star)','Green sino (central star)','Blue zafate','Green zafate','Arrow','Small corner star','Piece between two rosettes','Small piece'],
  resumen:'An eight-fold rosette whose central star is “skewed”: its points cross as they turn, ringed by eight zafates, with small stars and arrows between the rosettes.',
  pie:'It all comes from a circle divided into eight parts: two star octagons give the eight turned lines of the star, and eight small circles give the frame. The module repeats by translation.',
  pasosB:[
   {h:'5-9-9-5 grid',t:'To draw the module on a grid, ink the 5-9-9-5 sequence and draw the stars at the four corners: a 5 × 5 square and a rhombus with the same center.',c:'The center of each small star is a corner of the module.'},
   {h:'Circle and two squares',t:'Draw a circle through the corners of the four stars nearest the center. Draw the two squares inscribed in it.',c:'The upright square lies on the inked 9 lines.'},
   {h:'Diagonals of the octagon',t:'The two squares cross and make an octagon. Draw its diagonals: eight radii from the center to its corners.',c:'They are 22.5° from the grid axes.'},
   {h:'Central circle',t:'Draw a central circle whose radius equals that of the circle around one of the corner stars.',c:'Take the radius from a corner star with the compass and carry it to the center.'},
   {h:'Parallels to the diagonals',t:'Draw parallels to the diagonals of step 3 through the points where they cut the circle of the previous step.',c:'Through each point runs a parallel to the diagonal 45° away: these are the eight turned lines of the star.'},
   {h:'Ink',t:'Ink the right strokes to get the line scheme of the composition.',c:'It is the same module as with the compass: the grid gives a very good approximation.'}],
  pasos:[
   {h:'Circle and two squares',t:'Draw a circle and divide it into eight equal parts with its axes and diagonals. Join every other point: you get two inscribed squares, one upright and one standing on a corner.',c:'It is the construction on p. 168 in “Learn to draw”. The upright square will be the edge of the module.'},
   {h:'First star octagon',t:'The sides of the two squares cross at eight points. Take them as the vertices of a star octagon: join each point to the third one after it.',c:'Its sides come out horizontal, vertical and at 45°.'},
   {h:'Second star octagon, skewed',t:'The sides of that octagon cross on the axes and diagonals. Join those eight points in the same way and extend the sides: you get eight slightly turned lines that do not pass through the center.',c:'That turn is what gives the “skewed” rosette its name.'},
   {h:'Nine small circles',t:'The sides of the previous octagon make two small squares: draw the circle through their corners. With the same radius, draw eight more centered on the corners of the two first squares.',c:'All nine have the same radius.'},
   {h:'The frame',t:'Those circles cut the axes and diagonals: a square and a rhombus pass through those points and make an octagon around the rosette. At each corner, also join the two points where the circle cuts the sides of the first square.',c:'The short strokes at the corners will be half a small star.'},
   {h:'Ink',t:'From the lines drawn in the previous steps, ink the ones shown: they give the generating module of the composition.',c:'The points of the star cross and run on to the octagon, where they bend; at the corners, half a small star is left.'},
   {h:'Repeat the module',t:'The module repeats by translation in the direction of the square’s sides.',c:'When it repeats, a small star appears where four rosettes meet, and an arrow on each side between two of them.'},
   {h:'The strap',t:'The strap is drawn with parallels equidistant from the axes defined in step 6. The inner line of the strap passes through the midpoints of the sides of the first squares.',c:'The red dots are those midpoints: they set the width of the strap.'},
   {h:'Parallels and crossings',t:'At that same distance, draw parallels to the rest of the axes. Ink the right strokes so that, at the crossings, the straps pass over and under in turn.',c:'On the dado the sinos alternate black and green; the zafates are green beside the black sino and blue beside the green one, and the arrows are black. The same design is on some door jambs in the Patio de las Doncellas.'}]},
 zaguan2:{nombre:'Six- and eight-pointed stars',lugar:'Zaguán, second room',
  nombres:['Six-pointed star','Large octagon','Honey four-pointed star','Green four-pointed star','Black eight-pointed star','Honey eight-pointed star','V piece','Small piece'],
  resumen:'Eight-pointed stars at the corners of the module, six-pointed ones at the middle of its sides and a four-pointed one in the center, joined by an interlacing white strap.',
  pie:'It all comes from an 8 × 8 square with five circles of radius 2: the sides of four equilateral triangles, eight lines from the edges and a 45° line at each corner.',
  pasos:[
   {h:'8 × 8 square and circles',t:'Draw a square divided into 8 × 8 squares. Centered on the midpoint of each side draw a semicircle with a radius of 2 squares, and another equal circle centered on the square’s center.',c:'The central circle touches the four semicircles.'},
   {h:'Four triangles',t:'The grid lines cut the central circle at twelve evenly spaced points. Join them every fourth point: you get four equilateral triangles. Extend their sides to the edge of the square.',c:'Each side is one square away from the center; four of them lie on grid lines.'},
   {h:'Lines from the edges',t:'Mark where the semicircles cut the grid lines nearest the edge. Draw a line through each of those points and the nearest end of the extended sides.',c:'You get eight lines, two for each side of the square, slanted like the sides of the triangles.'},
   {h:'The corners',t:'Centered on each corner draw a quarter circle with a radius equal to the diagonal of one square. Join the ends of each arc with a 45° line.',c:'These lines close the points of the eight-pointed stars at the corners.'},
   {h:'Ink',t:'Ink only the strokes of the design: an eight-pointed star around each corner, a six-pointed one at the middle of each side and a four-pointed one in the center. The lines link into one continuous network.',c:'The points of the four-pointed star touch the central circle.'},
   {h:'The pieces',t:'Six different pieces appear: the eight-, six- and four-pointed stars, the large octagon, the V piece and a small four-sided piece.',c:'The module repeats by translation. When it repeats, the eight- and four-pointed stars alternate their colors.'},
   {h:'Strap and color',t:'Give the strap its width with two parallels to each line and alternate the crossings over and under. In the zaguán the six-pointed stars and the small pieces are blue and the octagons, black. The eight-pointed stars alternate black and honey, and the four-pointed ones, honey and green.',c:'Try other combinations in the Color tab.'}]}
};
if(EN){
  for(const [id,e] of Object.entries(PAT_EN)){const p=PATS[id];if(!p)continue;
    for(const k of ['nombre','lugar','resumen','pie','intro'])if(e[k])p[k]=e[k];
    if(e.nombres&&e.nombres.length===p.nombres.length)p.nombres=e.nombres;
    if(e.pasos&&p.pasos)p.pasos=p.pasos.map((q,i)=>Object.assign({},q,e.pasos[i]||{}));
    if(p.pasosB)p.pasosB=p.pasosB.map((q,i)=>Object.assign({},q,(e.pasosB||[])[i]||(i>=6?e.pasos[i]:{})||{}));
    p.titulo=p.nombre+' · '+p.lugar;
    if(id!=='lazo8')p.intro=p.coleccion==='alhambra'?`Tile pattern no. ${p.num} in <em>La Alhambra con regla y compás</em> (“The Alhambra with ruler and compass”). ${p.resumen}`:`The tile pattern on pages ${p.pags.replace(/ (a|y) /,'–')} of ${LIBRO_EN}. ${p.resumen}`;}
}
const palNombre=n=>EN?(PAL_EN[n]||n):n;


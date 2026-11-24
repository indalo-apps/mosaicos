/* ===== Ajustes, novedades y actualización automática (Guía común de indalo-apps) ===== */
(function(){
  const q=s=>document.querySelector(s);
  const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
  const VERSION=(q('meta[name="app-version"]')||{}).content||'dev';
  const NOVEDADES=EN?[
    ["2.9.2",["🔧 Zaguán, second room: the large black piece is no longer called “octagon” (it has a notch, as in the book)","🧪 Behind the scenes: a new test checks that every piece is what its name says and has the book’s color"]],
    ["2.9.1",["🎨 More palettes in every tile pattern: Blue & white, Green & gold, Garnet & gold, Earth, Night, Pastel and Grays (by lightness)","🔧 Niches of the Comares Tower: the X crosses are white, as in the book, and “Module” shows the square from step 5, upright","📏 Measurements in cm with one decimal"]],
    ["2.9",["📄 On paper › Actual-size template: a PDF of your paper with margins, modules, starting figure and a 5 cm bar to check the scale","📏 Each Draw step tells you its measurements in cm for your paper (radius, distances, strap width)","⭕ The paper preview draws the starting circle or square with its size","📐 All measurements in centimeters","🧱 Color › Panel: the niche from the Comares Tower with its frieze of merlons and green borders, as in the book","🎨 The Alhambra in blue and the Alcázar in green","⚡ Opens faster: the gallery and the home screen remember their drawings"]],
    ["2.8",["🧩 New Alhambra tile pattern: eight-pointed stars and zafates from the niches of the Comares Tower (no. 15), with its 8 steps from the book","📏 Tessellate › On paper: choose A5, A4, A3 or a custom size and see how big each module and the starting circle or square must be, with the margins drawn to scale","🔍 Zoom in on the drawing with two fingers, Ctrl + wheel or the + button; “Normal size” puts it back","🖼️ Gallery in book order, with page or number, steps, pieces and difficulty","📚 Settings: the two books by Manuel Martínez Vela, contact and privacy","🔤 The fonts come with the app: titles always look right, even offline","✨ A short fade when changing stage or screen"]],
    ["2.7",["🏷️ Each tile pattern opens with its own cover: the wall in color, the book and page, the place, the steps and the pieces","✏️ Drawn icons instead of emojis on buttons: they look the same on every phone","🖥️ On iPad and computer the drawing sits beside the steps and colors, and always fits on screen","🧪 Behind the scenes: an automatic test checks every pattern against the book's measurements"]],
    ["2.6.1",["👆 In Tessellate, Color and Print the drawing is higher up: the long introduction only appears in Draw","📌 Color on the phone: the drawing stays at the top while you scroll through the options","✏️ “Your tile” folds away until you open it","🔧 Small fixes: Alhambra colors in the goal step, “Mark the modules” next to columns and rows"]],
    ["2.6",["✏️ Your tile: in Tessellate, draw on the design and your stroke repeats in every module. Choose color and width, use your colors and save it as a phone wallpaper","🎨 Same design, other colors: in Color, see the pattern colored in several ways and discover how stars and rosettes appear"]],
    ["2.5.4",["△ Tessellate the twelve-pointed stars with the hexagon or with the book’s minimal triangle, which is reflected into a rhombus"]],
    ["2.5.3",["⚙️ New settings button, with sliders","🧩 Color › Module now shows the book’s minimal module: the 8 × 8 square for the eight-pointed stars and the hexagon for the twelve-pointed ones"]],
    ["2.5.2",["📲 Install help updated for iOS 27: the three-line button inside the address bar","✏️ Draw: the current step is now drawn in blue, thicker than what is already drawn"]],
    ["2.5.1",["📐 Twelve-pointed stars of the Court of the Myrtles: the star and the steps now follow the book exactly","🖼️ New icon: the twelve-pointed stars in plaster-white straps on blue"]],
    ["2.5",["🧩 New Alhambra tile pattern: twelve-pointed stars from the entrance to the Court of the Myrtles (no. 7), with its steps from the book and hexagonal modules in Tessellate","🖼️ New app icon: the twelve-pointed star of the Court of the Myrtles","📄 Coloring sheet also in A5"]],
    ["2.4.1",["✏️ Draw: what is already drawn turns light gray and the current step is drawn in black and thicker, so it stands out without relying on color","🏛️ “The Alhambra of Granada”","🧱 Tessellate: the eight-pointed stars of the Alhambra, the skewed rosette and the six- and eight-pointed stars now repeat their minimal module, one by one"]],
    ["2.4",["🏛️ New home screen with the two monuments: the Royal Alcázar of Seville and the Alhambra","🧩 First Alhambra tile pattern: eight-pointed stars and Y pieces from the Hall of the Boat (no. 16), with its 11 steps from the book","📖 The glossary button now says “Glossary”"]],
    ["2.3",["▦ Skewed rosette: a second way to draw it, on the 5-9-9-5 grid (p. 113), next to the compass one","🔁 “Repeat the module” now shows several rosettes"]],
    ["2.2.1",["🧭 The back button now says where it takes you: “‹ Home”, “‹ Learn to draw” or “‹ Tile patterns”"]],
    ["2.2",["🛒 New shopping list: a card with a swatch, the reference and the pieces of each paint, and boxes to tick in the shop. Share it as an image, copy it as text or save it as a PDF to print","✏️ Draw: in the color steps the new drawing fades in over the previous one, without going blank","🔺 Moves in the plane: the original figure stays still from one move to the next","📐 Learn to draw: five constructions that went past the edge of the drawing now fit (the equilateral triangle from its side among them)"]],
    ["2.1.1",["📏 Skewed rosette: the strap width and steps 6 to 9 now follow the book exactly (pp. 111–112)","✏️ Draw: going to the next step only draws the new lines; the earlier ones stay in place","🐞 Opening a link straight to the eight-fold knot no longer shows an empty drawing"]],
    ["2.1",["🧩 New tile pattern: the skewed eight-fold rosette from the Hall of the Philip II Ceiling (pp. 110–114), with its eight-step drawing, tessellation and colors"]],
    ["2.0",["🏠 New name, Mosaicos, and a home screen: Continue, Learn to draw, Alcázar tile patterns and My drawings","📐 Learn to draw: the 23 basic ruler-and-compass constructions from the book (pp. 164–175), step by step","🖼️ Each drawing starts with the finished figure, so you know the goal","4️⃣ Each tile pattern in four stages: Draw → Tessellate → Color → Print","🧱 New Tessellate stage: repeat the module and see how it covers the wall","📖 Glossary of terms, with search"]],
    ["1.6.2",["🔠 Larger text on phones and tablets, following the system text size"]],
    ["1.6.1",["↶ Undo in Color","⬇️ Export is now right under the drawing","🧭 The Step-by-step / Color tabs stay at the top","👉 Swipe the drawing to change step","🔢 The step number is shown on the drawing","🛡️ Reset asks for a second tap"]],
    ["1.6",["🎨 In Palettes, choose the brand (Van Gogh, Daniel Smith or Winsor & Newton Cotman): the colors switch to its paints, with name and reference","🧾 “What to paint with”: the paints your coloring uses, the pieces each one goes on and a shopping list to copy or share","🔁 Switch your colors (or any palette) to the nearest paint in the chart","📄 The sheet to paint can include the list of paints"]],
    ["1.5",["🧩 New tile pattern: six- and eight-pointed stars from the second room of the zaguán, with its step-by-step drawing","✏️ Trace by hand: go over each step with your finger or a stylus; your lines are saved","📄 Sheet to paint: A4 or A3 PDF with the drawing in line only, ready for watercolor","🌍 The app is now in English too (Settings › Language)"]],
    ["1.4.2",["♿ Paint piece by piece with the keyboard","🗣️ The screen reader announces each step, tab, view and brush color","👆 Easier to tap controls on phones","🌗 The chosen theme also applies to the install help"]],
    ["1.4",["🧩 Four more tile patterns from the Pavilion of Charles V, the Patio de las Muñecas and the skirting","✏️ Each with its step-by-step drawing"]],
    ["1.3",["🧩 Four new tile patterns from the Alcázar","🖼️ Choose the pattern in the gallery at the top","🎨 Color and export any of them"]],
    ["1.2",["⬇️ Export: SVG, PNG and laser cutting files"]],
    ["1.1",["📲 Installs on your phone like an app","📶 Works offline","🔄 Updates itself"]],
  ]:[
    ["2.9.2",["🔧 Zaguán, segunda sala: la pieza negra grande ya no se llama «octógono» (tiene una muesca, como en el libro)","🧪 Por dentro: una prueba nueva comprueba que cada pieza es lo que dice su nombre y tiene el color del libro"]],
    ["2.9.1",["🎨 Más paletas en todos los alicatados: Azul y blanco, Verde y oro, Granate y oro, Tierra, Noche, Pastel y Grises (por claridad)","🔧 Tacas de la Torre de Comares: las cruces en X son blancas, como en el libro, y «Módulo» enseña el cuadrado del paso 5, derecho","📏 Medidas en cm con un decimal"]],
    ["2.9",["📄 En papel › Plantilla a tamaño real: un PDF de tu papel con márgenes, módulos, figura de partida y una raya de 5 cm para comprobar la escala","📏 Cada paso de Trazar te dice sus medidas en cm para tu papel (radios, distancias, ancho de la cinta)","⭕ En la vista del papel se dibuja la circunferencia o el cuadrado de partida con su medida","📐 Todas las medidas, en centímetros","🧱 Colorear › Panel: la taca de la Torre de Comares con su friso de almenillas y sus cenefas verdes, como en el libro","🎨 La Alhambra en azul y el Alcázar en verde","⚡ Abre más rápido: la galería y la portada recuerdan sus dibujos"]],
    ["2.8",["🧩 Alicatado nuevo de la Alhambra: estrellas de ocho y zafates de las tacas de la Torre de Comares (n.º 15), con sus 8 pasos del libro","📏 Teselar › En papel: elige A5, A4, A3 o un papel a medida y verás cuánto miden el módulo y la circunferencia o el cuadrado de partida, con los márgenes a escala","🔍 Amplía el dibujo con dos dedos, Ctrl + rueda o el botón +; «Tamaño normal» lo deja como estaba","🖼️ Galería en el orden del libro, con página o número, pasos, piezas y dificultad","📚 Ajustes: los dos libros de Manuel Martínez Vela, contacto y privacidad","🔤 Los tipos de letra van dentro de la app: los títulos se ven siempre bien, también sin conexión","✨ Un fundido corto al cambiar de etapa o de pantalla"]],
    ["2.7",["🏷️ Cada alicatado empieza con su portada: el muro en color, el libro y la página, el lugar, los pasos y las piezas","✏️ Iconos dibujados en vez de emojis en los botones: se ven igual en todos los móviles","🖥️ En el iPad y el ordenador el dibujo va al lado de los pasos y los colores, y cabe siempre entero","🧪 Por dentro: una prueba automática comprueba cada alicatado con las medidas del libro"]],
    ["2.6.1",["👆 En Teselar, Colorear e Imprimir el dibujo queda más arriba: la presentación larga solo sale en Trazar","📌 Colorear en el móvil: el dibujo se queda arriba mientras bajas por las opciones","✏️ «Tu tesela» va plegada hasta que la abras","🔧 Arreglos: colores de la Alhambra en el objetivo, «Marcar los módulos» junto a columnas y filas"]],
    ["2.6",["✏️ Tu tesela: en Teselar, dibuja sobre el dibujo y tu trazo se repite en todos los módulos. Elige color y grosor, usa tus colores y guárdalo como fondo de pantalla del móvil","🎨 Mismo dibujo, otro color: en Colorear, mira la trama coloreada de varias maneras y descubre cómo aparecen estrellas y rosetas"]],
    ["2.5.4",["△ Teselar las estrellas de doce con el hexágono o con el triángulo mínimo del libro, que se refleja formando un rombo"]],
    ["2.5.3",["⚙️ Botón de ajustes nuevo, con deslizadores","🧩 Colorear › Módulo enseña ahora el módulo mínimo del libro: el cuadrado de 8 × 8 en las estrellas de ocho y el hexágono en las de doce"]],
    ["2.5.2",["📲 Ayuda para instalar al día con iOS 27: el botón de tres rayas dentro de la barra de la dirección","✏️ Trazar: el paso actual se dibuja ahora en azul, más grueso que lo ya trazado"]],
    ["2.5.1",["📐 Estrellas de doce del Patio de los Arrayanes: la estrella y los pasos siguen ahora exactamente al libro","🖼️ Icono nuevo: las estrellas de doce con la cinta de yeso sobre azul"]],
    ["2.5",["🧩 Alicatado nuevo de la Alhambra: estrellas de doce del acceso al Patio de los Arrayanes (n.º 7), con sus pasos del libro y módulos hexagonales en Teselar","🖼️ Icono nuevo de la app: la estrella de doce del Patio de los Arrayanes","📄 Lámina para pintar también en A5"]],
    ["2.4.1",["✏️ Trazar: lo ya trazado pasa a gris claro y el paso actual se dibuja en negro y más grueso, para distinguirlo sin depender del color","🏛️ «La Alhambra de Granada»","🧱 Teselar: las estrellas de ocho de la Alhambra, la rueda sesgada y las estrellas de seis y de ocho repiten ahora su módulo mínimo, de uno en uno"]],
    ["2.4",["🏛️ Portada nueva con los dos monumentos: el Real Alcázar de Sevilla y la Alhambra","🧩 Primer alicatado de la Alhambra: estrellas de ocho y piezas en Y de la Sala de la Barca (n.º 16), con sus 11 pasos del libro","📖 El botón del glosario dice ahora «Glosario»"]],
    ["2.3",["▦ Rueda sesgada: segunda forma de trazarla, con la cuadrícula 5-9-9-5 (pág. 113), junto a la del compás","🔁 «Repetir el módulo» enseña ahora varias ruedas"]],
    ["2.2.1",["🧭 El botón de volver dice ahora a dónde vuelves: «‹ Inicio», «‹ Aprender a trazar» o «‹ Alicatados»"]],
    ["2.2",["🛒 Lista de la compra nueva: una tarjeta con la muestra, la referencia y las piezas de cada pintura, y casillas para marcar en la tienda. Compártela como imagen, cópiala como texto o guárdala en PDF para imprimir","✏️ Trazar: en los pasos de color el dibujo nuevo aparece sobre el anterior, sin pasar por blanco","🔺 Movimientos en el plano: la figura original se queda quieta de un movimiento a otro","📐 Aprender a trazar: cinco construcciones que se salían del dibujo ya caben enteras (entre ellas, el triángulo equilátero a partir del lado)"]],
    ["2.1.1",["📏 Rueda sesgada: el ancho de la cinta y los pasos 6 a 9 siguen ahora exactamente al libro (págs. 111 y 112)","✏️ Trazar: al pasar de paso solo se dibujan las líneas nuevas; las anteriores se quedan quietas","🐞 Al abrir un enlace directo al lazo de 8 ya no sale el dibujo vacío"]],
    ["2.1",["🧩 Alicatado nuevo: la rueda de ocho sesgada del Salón del techo de Felipe II (págs. 110 a 114), con su trazado en ocho pasos, el teselado y los colores del zócalo"]],
    ["2.0",["🏠 La app pasa a llamarse Mosaicos y estrena portada: Seguir, Aprender a trazar, Alicatados del Alcázar y Mis dibujos","📐 Aprender a trazar: las 23 construcciones básicas con regla y compás del libro (págs. 164 a 175), paso a paso","🖼️ Cada dibujo empieza por la figura terminada, para saber cuál es el objetivo","4️⃣ Cada alicatado en cuatro etapas: Trazar → Teselar → Colorear → Imprimir","🧱 Etapa nueva, Teselar: repite el módulo y mira cómo cubre la pared","📖 Glosario de términos, con buscador"]],
    ["1.6.2",["🔠 Letra más grande en el móvil y la tablet, que sigue el tamaño de texto del sistema"]],
    ["1.6.1",["↶ Deshacer en Colorear","⬇️ Exportar está ahora justo debajo del dibujo","🧭 Las pestañas Trazado y Colorear se quedan fijas arriba","👉 Desliza el dibujo para cambiar de paso","🔢 El número del paso se ve sobre el dibujo","🛡️ Restablecer pide un segundo toque"]],
    ["1.6",["🎨 En Paletas, elige la marca (Van Gogh, Daniel Smith o Cotman de Winsor & Newton): los colores pasan a sus pinturas, con nombre y referencia","🧾 «Con qué pintar»: las pinturas que usa tu coloreado, en qué piezas va cada una y la lista de la compra para copiar o compartir","🔁 Pasa tus colores (o cualquier paleta) a la pintura más parecida de la carta","📄 La lámina para pintar puede llevar la lista de pinturas"]],
    ["1.5",["🧩 Alicatado nuevo: estrellas de seis y de ocho de la segunda sala del zaguán, con su trazado paso a paso","✏️ Repasar a mano: repasa cada paso con el dedo o el lápiz; tu trazo se guarda","📄 Lámina para pintar: PDF en A4 o A3 con el dibujo solo en línea, lista para la acuarela","🌍 La app ya está también en inglés (Ajustes › Idioma)","🧵 Los cruces de las cintas se ven más limpios"]],
    ["1.4.2",["♿ Se puede pintar pieza a pieza con el teclado: flechas para moverse e Intro para pintar","🗣️ El lector de pantalla anuncia cada paso, la pestaña, la vista y el color del pincel","👆 Casillas y deslizador más fáciles de tocar en el móvil","📐 En el móvil el dibujo ocupa menos y las vistas caben en una línea","🌗 El tema elegido en Ajustes se aplica también a la ayuda de instalar y a la barra del móvil","🛠️ Arreglos para que la copia sin conexión siempre sea buena"]],
    ["1.4.1",["🏷️ La app pasa a llamarse «Lacería · Alicatados del Alcázar»"]],
    ["1.4",["🧩 Cuatro alicatados más: cubos y estrellas de ocho alargadas del Cenador de Carlos V, estrellas de cuatro y alfardones del Patio de las Muñecas y octógonos del rodapié","✏️ Cada uno con su trazado paso a paso"]],
    ["1.3",["🧩 Cuatro alicatados nuevos del Alcázar: cuadrados y cintas del zaguán, octógonos del Patio de las Muñecas, hexágonos de las salas de Toledanos y Sevillanos y estrellas de seis del Cenador de Carlos V","🖼️ Elige el alicatado en la galería de arriba","✏️ Cada uno con su trazado paso a paso","🎨 Colorea y exporta cualquiera de ellos; cada uno guarda sus colores"]],
    ["1.2",["⬇️ Botón Exportar en Colorear: descarga el dibujo en lugar de solo copiarlo","🎨 SVG en color en milímetros, para imprimir o cortar vinilo","🖼️ Imagen PNG de 2000 o 4000 píxeles","✂️ Láser: piezas del mosaico o celosía con marco, en líneas rojas de 0,1 mm","🔁 Elige cuántos módulos repetir: encajan sin costuras"]],
    ["1.1",["📲 Se instala en el móvil como una app, con su icono","📶 Funciona sin conexión","🔄 Se actualiza sola y te cuenta las novedades","⚙️ Ajustes: tamaño de letra, tema claro u oscuro, instalar, autores y versión","💾 El coloreado y el paso del trazado se guardan en el móvil","👆 Botones más grandes en el móvil"]],
  ];
  const verCmp=(a,b)=>{const x=String(a).split('.').map(Number),y=String(b).split('.').map(Number);for(let i=0;i<3;i++){const d=(x[i]||0)-(y[i]||0);if(d)return d}return 0};
  const EN_WEB=/\.github\.io$/.test(location.hostname)||location.hostname==='localhost';
  // ---- Preferencias: letra y tema ----
  const PREF=Object.assign({letra:'normal',tema:'auto',idioma:'auto'},store.get('laceria-pref-v1',{}));
  function aplicarPref(){
    const r=document.documentElement;
    if(PREF.letra==='normal')r.removeAttribute('data-letra');else r.setAttribute('data-letra',PREF.letra);
    // Tamaño de texto del sistema (Dynamic Type en iPhone/iPad): 17 pt por defecto
    try{const t=document.createElement('span');t.style.font='-apple-system-body';if(t.style.font){t.style.position='absolute';t.style.visibility='hidden';document.body.appendChild(t);const fs=parseFloat(getComputedStyle(t).fontSize);t.remove();
      if(fs>0)r.style.setProperty('--esc-sis',Math.min(1.9,Math.max(1.2,fs/14.2)).toFixed(3));}}catch(e){}
    if(PREF.tema==='auto')r.removeAttribute('data-tema');else r.setAttribute('data-tema',PREF.tema);
    document.querySelectorAll('meta[name="theme-color"]').forEach((m,i)=>m.setAttribute('content',PREF.tema==='claro'?'#1f5f5b':PREF.tema==='oscuro'?'#15191a':(i?'#15191a':'#1f5f5b')));
    document.querySelectorAll('[data-op]').forEach(g=>g.querySelectorAll('button').forEach(b=>{const on=b.dataset.val===PREF[g.dataset.op];b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)}));
  }
  document.querySelectorAll('[data-op]').forEach(g=>g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const antes=PREF[g.dataset.op];PREF[g.dataset.op]=b.dataset.val;store.set('laceria-pref-v1',PREF);aplicarPref();
    // el idioma se aplica al cargar: se recarga la página (el coloreado y el trazado ya están guardados)
    if(g.dataset.op==='idioma'&&antes!==b.dataset.val)setTimeout(()=>location.reload(),150);}));
  aplicarPref();
  // ---- Ventanas ----
  let foco=null;
  window.abrirDlg=id=>abrir(id);window.cerrarDlg=id=>cerrar(id);
  function abrir(id){foco=document.activeElement;q('#'+id).hidden=false;q('#'+id+' .x').focus()}
  function cerrar(id){q('#'+id).hidden=true;if(foco&&foco.focus)try{foco.focus()}catch(e){}}
  q('#aj-ver').textContent=VERSION;q('#aj-ver2').textContent=VERSION;
  q('#btn-version').textContent=tr('Ajustes · Versión ','Settings · Version ')+VERSION+tr(' · Novedades',' · What’s new');
  q('#btn-ajustes').onclick=()=>abrir('dlg-ajustes');
  q('#btn-version').onclick=()=>abrir('dlg-ajustes');
  ['aj-x','aj-cerrar'].forEach(id=>q('#'+id).onclick=()=>cerrar('dlg-ajustes'));
  ['nov-x','nov-cerrar'].forEach(id=>q('#'+id).onclick=()=>cerrar('dlg-novedades'));
  q('#aj-instalar').onclick=()=>IK.abrirInstalar();
  q('#aj-buscar').onclick=()=>IK.buscar(q('#aj-buscar'),q('#aj-upd-msg'));
  q('#aj-novedades').onclick=()=>{cerrar('dlg-ajustes');verNovedades(null)};
  // ---- Los libros, contacto y privacidad (v2.8) ----
  const LIBROS=[['El Real Alcázar de Sevilla con regla y compás','El trazado paso a paso de los alicatados','Editorial Almizate','2019','The Royal Alcázar of Seville with ruler and compass'],
    ['La Alhambra con regla y compás','El trazado paso a paso de alicatados y yeserías','Editorial Almizate y Patronato de la Alhambra y Generalife','2017','The Alhambra with ruler and compass']];
  q('#aj-fuentes-t').textContent=tr('Los libros','The books');
  q('#aj-fuentes').innerHTML=`<p>${tr('Los pasos, las medidas y los colores siguen estos dos libros de <b>Manuel Martínez Vela</b>:','The steps, measurements and colors follow these two books by <b>Manuel Martínez Vela</b>:')}</p><ul class="libros">`+
    LIBROS.map(l=>`<li><i>${l[0]}</i>${EN?` (“${l[4]}”)`:''}. ${l[1]}. ${l[2]}, ${l[3]}${tr(' (1.ª edición).',' (1st edition).')}</li>`).join('')+'</ul>'+
    `<p class="muted">${tr('Los dibujos y los textos de la app están rehechos a partir de las construcciones de los libros. Para conocer cada alicatado a fondo, con su historia y sus fotografías, consulta los libros.','The app’s drawings and texts are redrawn from the books’ constructions. To learn about each tile pattern in depth, with its history and photographs, see the books.')}</p>`;
  q('#aj-contacto').onclick=()=>{try{window.open('https://github.com/indalo-apps/mosaicos/issues','_blank','noopener')}catch(e){}};
  q('#priv-texto').innerHTML=tr(
    '<p>Mosaicos <b>no recoge ningún dato personal</b>. No hay cuentas, ni anuncios, ni compras, ni estadísticas de uso, ni rastreo.</p><p>Lo que coloreas y repasas, el paso del trazado y tus ajustes se guardan <b>solo en este dispositivo</b> (en el almacenamiento del navegador) y no se envían a nadie. Si borras los datos del navegador o desinstalas la app, se borran también.</p><p class="muted">La app, con sus tipos de letra, se descarga de GitHub Pages (GitHub, Inc.), que como cualquier servidor web recibe la dirección IP al abrirla. Después funciona sin conexión.</p>',
    '<p>Mosaicos <b>does not collect any personal data</b>. There are no accounts, ads, purchases, usage statistics or tracking.</p><p>What you color and trace, your drawing step and your settings are saved <b>only on this device</b> (in the browser’s storage) and are not sent to anyone. If you clear the browser’s data or uninstall the app, they are deleted too.</p><p class="muted">The app, fonts included, is downloaded from GitHub Pages (GitHub, Inc.), which like any web server receives your IP address when you open it. After that it works offline.</p>');
  q('#aj-privacidad').onclick=()=>{cerrar('dlg-ajustes');abrir('dlg-privacidad')};
  ['priv-x','priv-cerrar'].forEach(id=>q('#'+id).onclick=()=>{cerrar('dlg-privacidad');abrir('dlg-ajustes')});
  document.querySelectorAll('.dlg').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)cerrar(d.id)}));
  document.addEventListener('keydown',e=>{
    const d=[...document.querySelectorAll('.dlg')].find(x=>!x.hidden);if(!d)return;
    if(e.key==='Escape'){cerrar(d.id);return}
    if(e.key!=='Tab')return;const f=[...d.querySelectorAll('button:not([hidden]),input')].filter(x=>!x.closest('[hidden]'));const a=f[0],z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}
  });
  // Arrastrar la ventana hacia abajo para cerrarla
  document.querySelectorAll('.hoja').forEach(h=>{let y0=null;
    h.addEventListener('touchstart',e=>{y0=h.scrollTop<=0?e.touches[0].clientY:null},{passive:true});
    h.addEventListener('touchmove',e=>{if(y0==null)return;const dy=e.touches[0].clientY-y0;if(dy>0)h.style.transform=`translateY(${dy}px)`},{passive:true});
    h.addEventListener('touchend',e=>{if(y0==null)return;const dy=e.changedTouches[0].clientY-y0;h.style.transform='';y0=null;if(dy>90)cerrar(h.parentNode.id)});
  });
  // ---- Novedades ----
  function verNovedades(desde){
    const todas=NOVEDADES.filter(([v])=>!desde||verCmp(v,desde)>0);if(!todas.length)return;
    const lista=todas.slice(0,4),mas=todas.length-lista.length;
    q('#nov-titulo').textContent=desde?tr('¡La app se ha actualizado!','The app has been updated!'):tr('Novedades','What’s new');
    q('#nov-lista').innerHTML=lista.map(([v,items])=>`<h4>${tr('Versión','Version')} ${v}</h4><ul>${items.map(t=>`<li>${t}</li>`).join('')}</ul>`).join('')
      +(mas>0?`<p class="muted">${tr(`…y ${mas} ${mas===1?'versión':'versiones'} más.`,`…and ${mas} more ${mas===1?'version':'versions'}.`)}</p>`:'');
    abrir('dlg-novedades');
  }
  (function(){const vista=store.get('laceria-version',null);store.set('laceria-version',VERSION);if(vista&&verCmp(VERSION,vista)>0)setTimeout(()=>verNovedades(vista),700)})();
  // ---- Actualización automática ----
  // No se recarga con una ventana abierta; el coloreado y el paso ya están guardados en el móvil
  let pulsando=false;
  addEventListener('pointerdown',()=>pulsando=true,true);addEventListener('pointerup',()=>pulsando=false,true);addEventListener('pointercancel',()=>pulsando=false,true);
  const seguroRecargar=()=>!document.querySelector('.dlg:not([hidden])')&&!document.getElementById('ik-sheet')&&!pulsando&&!(document.activeElement&&document.activeElement.type==='color');
  let pendiente=false;
  function actualizar(){
    if(!seguroRecargar()){pendiente=true;return}
    pendiente=false;q('#barra-act').hidden=false;
    setTimeout(()=>location.replace(location.pathname+'?u='+Date.now()+location.hash),900);
  }
  if(/[?&]u=\d/.test(location.search))history.replaceState(null,'',location.pathname+location.search.replace(/[?&]u=\d+/,'').replace(/^&/,'?')+location.hash);
  async function buscarVersion(){const v=await IK.versionPublicada();if(v&&verCmp(v,VERSION)>0)actualizar()}
  new MutationObserver(()=>{if(pendiente&&seguroRecargar())actualizar()}).observe(document.body,{subtree:true,attributes:true,childList:true,attributeFilter:['hidden']});
  addEventListener('pointerup',()=>setTimeout(()=>{if(pendiente&&seguroRecargar())actualizar()},300));
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')buscarVersion()});
  addEventListener('focus',buscarVersion);
  setInterval(buscarVersion,90*1000);
  setTimeout(buscarVersion,3000);
  IK.init({nombre:'Mosaicos',clave:'laceria',version:VERSION,onNueva:()=>actualizar(),esInicio:()=>!document.querySelector('.dlg:not([hidden])')});
  if(EN_WEB&&'serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').then(r=>r.update()).catch(()=>{}));
})();

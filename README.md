# Mosaicos · Lacería con regla y compás

© 2026 **Carlos Moreno Otto**. Todos los derechos reservados (ver [LICENSE](LICENSE)).

App de dibujo geométrico con regla y compás basada en el libro *El Real Alcázar de Sevilla con regla y compás*. Hasta la versión 1.6 se llamó «Lacería · Alicatados del Alcázar».

Desde la versión 2.0 se organiza así (rutas con `#` en el enlace):

- **Inicio** (`#inicio`): seguir donde se dejó, Aprender a trazar, Alicatados del Alcázar y Mis dibujos. El glosario y los ajustes están en la cabecera.
- **Aprender a trazar** (`#aprender`, cada una en `#c/<id>`): las 23 construcciones básicas de las págs. 164 a 175 (objeto `CONS`), agrupadas, paso a paso. El glosario de la pág. 176 está en `GLOSARIO`, con definiciones propias.
- **Alicatados del Alcázar** (`#alicatados`, cada uno en `#a/<id>/<etapa>`): cuatro etapas, Trazar → Teselar → Colorear → Imprimir.
- **Mis dibujos** (`#mis`): lo coloreado o repasado a mano.

Cada dibujo empieza por la figura terminada (paso ★), para que se vea el objetivo. Cada alicatado tiene su trazado paso a paso, que se puede repasar a mano con el dedo o el lápiz, y una pestaña para colorearlo como un alicatado y exportarlo: SVG en color, imagen PNG, lámina para pintar en PDF (A4 o A3, solo en línea) y archivos para corte láser (piezas del mosaico o celosía), con tantas repeticiones del módulo como se quiera.

Con «Carta de acuarela» se pinta con los colores de Van Gogh (Royal Talens), Daniel Smith o Cotman (Winsor & Newton), con su nombre y número, y la app dice qué pintura va en cada pieza; los colores están en `CARTAS` y para añadir otra marca basta con otra entrada.

Está en español y en inglés (Ajustes › Idioma; «Automático» sigue al idioma del móvil). Los textos en inglés de cada alicatado están en `PAT_EN` y los de la página, en `ES_EN`.

Alicatados (versión 2.1):

| Alicatado | Lugar | Páginas del libro |
| --- | --- | --- |
| Lazo de 8 | Patio de las Muñecas | 133 a 136 |
| Cuadrados y cintas | Zaguán | 29 a 31 |
| Hexágonos y triángulos | Salas de Toledanos y Sevillanos | 75 a 77 |
| Estrellas de seis | Cenador de Carlos V | 145 y 146 |
| Octógonos y cuadrados | Patio de las Muñecas | 123 a 125 |
| Cubos | Cenador de Carlos V | 143 y 144 |
| Estrellas de ocho alargadas | Cenador de Carlos V | 147 a 149 |
| Estrellas de cuatro y alfardones | Patio de las Muñecas | 138 a 141 |
| Octógonos y estrellas de cuatro | Rodapié de los zócalos | 158 y 159 |
| Estrellas de seis y de ocho | Zaguán, segunda sala | 32 a 35 |
| Rueda de ocho sesgada | Salón del techo de Felipe II | 110 a 114 |

Alicatados de *La Alhambra con regla y compás* (colección `alhambra`, `#alhambra`):

| Alicatado | Lugar | N.º en el libro |
| --- | --- | --- |
| Estrellas de doce (yesería) | Acceso al Patio de los Arrayanes, zaguán | 7 |
| Estrellas de ocho y piezas en Y | Sala de la Barca (Palacio de Comares) | 16 |

El lazo de 8 lleva sus piezas calculadas de antemano. Los demás se describen en el `index.html` (objeto `PATRONES`) solo con las líneas de un módulo; el motor (`MOTOR`) corta las líneas en sus cruces, saca las piezas, encadena las cintas y, en los de cinta, decide qué cinta pasa por encima en cada cruce. Para añadir un alicatado basta con sus líneas, los nombres de sus piezas, sus paletas y los pasos del trazado. Con `#a/<id>/trazado` en el enlace se abre directamente uno de ellos (el antiguo `?patron=<id>` sigue funcionando).

Se publica con GitHub Pages: https://indalo-apps.github.io/mosaicos/  
Enlace para instalarla en el móvil: https://indalo-apps.github.io/mosaicos/?instalar

Sigue la «Guía común para nuestras apps» (proyecto APPS de Claude): se instala como app, funciona sin conexión, se actualiza sola y enseña sus novedades.

## Cómo sacar una versión nueva

1. Subir el número en `<meta name="app-version">` (index.html) y en `CACHE` (sw.js).
2. Añadir sus novedades arriba del todo en `NOVEDADES` (index.html).
3. El mensaje del commit empieza por la versión: `v1.2: …`.

La app comprueba la versión al abrirse, al volver a ella y cada 90 segundos, y se recarga sola cuando no hay ninguna ventana abierta. Los datos se guardan con claves `laceria-…` (se mantienen de la 1.x). El coloreado, el paso del trazado y lo repasado a mano se guardan en el móvil, así que no se pierden al actualizar.

## Autor
Carlos Moreno Otto.

## Licencia
Todos los derechos reservados. Se permite usar la app publicada con fines personales y educativos; no se permite copiar, modificar ni distribuir el código o los contenidos sin autorización de los autores. Texto completo en [LICENSE](LICENSE).

## Aviso
Esta app es una ayuda para practicar el dibujo geométrico y puede contener errores. En caso de error o duda, la fuente fiable son los libros «El Real Alcázar de Sevilla con regla y compás» y «La Alhambra con regla y compás».

## Cómo está hecho el código (desde la 2.7)

La app se publica en un solo `index.html`, pero se escribe por partes en `src/`:

- `src/plantilla.html`: la página, con marcas `@incluir` donde va cada parte.
- `src/cuerpo.html`, `src/css/` y `src/js/` (motor de lacería, patrones, construcciones, vistas, ajustes, iconos, textos en inglés…).

Después de cambiar algo en `src/`:

```
node herramientas/construir.js        # junta las partes en index.html
node pruebas/geometria.js             # 400 comprobaciones de los alicatados con las medidas del libro
node pruebas/con-servidor.js pruebas/navegador.js   # todas las pantallas, accesibilidad y errores (necesita Playwright y axe-core)
```

`npm test` hace las tres cosas y además avisa si `index.html` no está al día con `src/`.

## Fuentes

Los pasos, las medidas y los colores siguen los libros de **Manuel Martínez Vela**:

- *El Real Alcázar de Sevilla con regla y compás. El trazado paso a paso de los alicatados.* Editorial Almizate, 2019.
- *La Alhambra con regla y compás. El trazado paso a paso de alicatados y yeserías.* Editorial Almizate y Patronato de la Alhambra y Generalife, 2017.

Los dibujos y los textos de la app están rehechos a partir de las construcciones de los libros.

Tipos de letra: Inter y Cormorant Garamond, incluidos en `fonts/` con licencia SIL Open Font License (`fonts/OFL.txt`).

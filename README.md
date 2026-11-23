# Lacería · Lazo de 8

© 2026 **Adela Moreno Vega** y **Carlos Moreno Otto**. Todos los derechos reservados (ver [LICENSE](LICENSE)).

App de dibujo geométrico: el lazo de 8 del Patio de las Muñecas (Real Alcázar de Sevilla), con el trazado paso a paso sobre la cuadrícula 5-7-5-7 y una pestaña para colorearlo como un alicatado y copiarlo en SVG.

Se publica con GitHub Pages: https://indalo-apps.github.io/laceria/  
Enlace para instalarla en el móvil: https://indalo-apps.github.io/laceria/?instalar

Sigue la «Guía común para nuestras apps» (proyecto APPS de Claude): se instala como app, funciona sin conexión, se actualiza sola y enseña sus novedades.

## Cómo sacar una versión nueva

1. Subir el número en `<meta name="app-version">` (index.html) y en `CACHE` (sw.js).
2. Añadir sus novedades arriba del todo en `NOVEDADES` (index.html).
3. El mensaje del commit empieza por la versión: `v1.2: …`.

La app comprueba la versión al abrirse, al volver a ella y cada 90 segundos, y se recarga sola cuando no hay ninguna ventana abierta. El coloreado y el paso del trazado se guardan en el móvil, así que no se pierden al actualizar.

## Autores
Adela Moreno Vega y Carlos Moreno Otto.

## Licencia
Todos los derechos reservados. Se permite usar la app publicada con fines personales y educativos; no se permite copiar, modificar ni distribuir el código o los contenidos sin autorización de los autores. Texto completo en [LICENSE](LICENSE).

## Aviso
Esta app es una ayuda para practicar el dibujo geométrico y puede contener errores. En caso de error o duda, la fuente fiable es el libro «El Real Alcázar de Sevilla con regla y compás».

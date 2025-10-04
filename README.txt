Cómo aplicar el patch de 'Materiales'

1) Copia la carpeta 'assets' de este ZIP dentro de tu proyecto (sobrescribe si te pregunta).
2) En tu 'style.css', pega el contenido de 'css/badges.css' (al final del bloque Media).
   Bump en index.html: <link rel="stylesheet" href="style.css?v=4.1.2">
3) En 'index.html', en la sección #materiales, reemplaza los <div class="ph media-16x9 small"></div>
   por el contenido de 'snippets/materiales.html' (PLA primero, luego PETG).
4) Publica en Netlify y haz Hard Reload (Ctrl/Cmd+Shift+R).

Archivos generados (16:9):
- material-pla-{1280,960,640}.{jpg,webp}
- material-petg-{1280,960,640}.{jpg,webp}

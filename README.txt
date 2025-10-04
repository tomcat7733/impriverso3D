Cómo usar este patch (Tipos de fabricación):

1) Copia la carpeta 'assets' de este ZIP dentro de tu proyecto (sobrescribe si te pregunta).
2) En tu index.html, ve a la sección "Tipos de fabricación" y, dentro de cada <article class="card">,
   reemplaza el <div class="ph media-4x3"></div> por cada bloque de 'snippets/tipos.html' en ese mismo orden.
3) Asegúrate de tener en style.css estas reglas (ya deberías, pero por si acaso):

   .media-4x3{ aspect-ratio:4/3 }
   picture.media-4x3{ display:block;width:100%;overflow:hidden;border-radius:12px;border:1px solid var(--line);background:#eef4f8 }
   .media-4x3 > img{ width:100%;height:100%;display:block;object-fit:cover }

4) Haz deploy en Netlify y fuerza recarga (Ctrl/Cmd+Shift+R).

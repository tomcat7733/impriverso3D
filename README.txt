Impriverso3D — Patch cache-busting v4.0.1

Qué hace
- Mata automáticamente cualquier Service Worker y caches antiguos en la primera visita.
- Fuerza recarga de assets (version bump ?v=4.0.1).
- Suma cabeceras de caché recomendadas para Netlify.

Cómo aplicar
1) Reemplaza tu archivo `script.js` por el de este patch.
2) En tu `index.html`, cambia:
   - <link rel="stylesheet" href="style.css?v=4.0.0">  ->  style.css?v=4.0.1
   - <script src="script.js?v=4.0.0"></script>        ->  script.js?v=4.0.1
   (Si tu index usa otra versión, pon igualmente ?v=4.0.1)
   Si lo prefieres, pega el contenido de `index_patch_snippet.html`.
3) (Opcional pero recomendado) Mezcla el contenido de `netlify_headers_addition.toml`
   con tu `netlify.toml` y despliega.
4) En Netlify: Clear cache and deploy.
5) En tu navegador: Hard reload (Ctrl/Cmd+Shift+R).

Variables de entorno (por si acaso)
- YT_CHANNEL_ID=UClHzwBQlvEPxXcPOFC8bfKw (o YT_HANDLE=Impriverso3D)

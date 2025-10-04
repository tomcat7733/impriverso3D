Impriverso3D — Patch HERO vídeo local (v4.1.2)

Qué hace
- Reemplaza el hero por un vídeo HTML5 local (autoplay, loop, muted).
- Incluye CSS actualizado para video full-bleed + accesibilidad (prefers-reduced-motion).
- Añade imagen 'hero-poster.jpg' (1920×1080), helper JS y cabeceras Netlify.

Pasos
1) Sube tu vídeo a /assets/: hero.mp4 (y opcionalmente hero.webm).
2) Copia 'assets/hero-poster.jpg' (o substitúyelo por el tuyo).
3) Reemplaza tu 'style.css' por el de este patch y en index.html referencia:
   <link rel="stylesheet" href="style.css?v=4.1.2">
4) En index.html, dentro del HERO, pega el bloque de 'snippets/hero_video.html' en lugar del placeholder.
5) (Opcional) Añade el helper al final del body:
   <script src="scripts/hero-video-helper.js?v=4.1.2"></script>
6) (Opcional) Mergea 'netlify_headers_video.toml' en tu netlify.toml.
7) Publica y haz Hard Reload.

Notas
- autoplay en móvil solo funciona con muted + playsinline.
- Si no incluyes hero.webm, se usará hero.mp4 como fallback.

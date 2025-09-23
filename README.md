# Impriverso3D — Landing

Web estática para **diseño e impresión 3D personalizada**. Lista para GitHub y deploy en **Netlify**.

## Puntos clave
- ✅ **Responsive** y moderna
- 🎯 **Configurador** con estimación de precio (client-side)
- 🧩 **Visor 3D STL** (three.js) sin subir archivos
- ▶️ **YouTube**: botón de suscripción + carrusel de vídeos embebidos
- 📸 **Instagram**: botón de follow + zona de embeds para tus posts
- ✉️ **Formulario** con **Netlify Forms** (sin backend)

## Estructura
```
impriverso3d/
├─ index.html
├─ style.css
├─ script.js
└─ assets/
   └─ logo.svg
```

## Local
Abre `index.html` en tu navegador.

## YouTube
- El botón de suscripción usa `<div class="g-ytsubscribe">`. Si no aparece, reemplaza el atributo `data-channel` por `data-channelid` con tu Channel ID.
- Edita los IDs del array `videoIds` en `script.js` para que apunten a tus vídeos.

## Instagram
- La cuadrícula muestra un placeholder. Para embeber **posts concretos**, copia el *embed* que ofrece Instagram en cada publicación y pégalo dentro de la sección `#instagram` (hay un comentario con el ejemplo).
- Para feed dinámico, puedes integrar un widget externo (p. ej. LightWidget/SnapWidget) o el Graph API (requiere token).

## Netlify Forms
- El formulario `#contacto` ya está preparado.
- En Netlify > Site settings > Forms verás los envíos y adjuntos.

## Deploy — GitHub + Netlify
1) **Sube el repo a GitHub**
```bash
git init
git add .
git commit -m "Impriverso3D initial commit"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/impriverso3d.git
git push -u origin main
```
2) **Netlify**
- Entra en https://app.netlify.com/ → **Add new site** → **Import an existing project** → GitHub → elige tu repo.
- Build command: *(vacío)*
- Publish directory: `/`
- Deploy y listo. Los formularios empezarán a registrar envíos al primer submit.

## Customización
- Colores, sombras y radios en `:root` (CSS variables).
- Imágenes de galería: reemplaza URLs por tus fotos.
- Logo: `assets/logo.svg` (puedes sustituir por PNG/SVG propio).

---

**Licencia:** MIT

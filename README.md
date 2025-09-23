# Impriverso3D — Landing + Agente IA (FDM/FFF)

Web estática para **diseño e impresión 3D personalizada** con:
- ✅ Responsive y moderna
- 🧩 Visor 3D **STL** (three.js) sin backend
- 🎯 **Configurador** con estimación de precio (client-side)
- ▶️ **YouTube**: botón de suscripción + carrusel de vídeos
- 📸 **Instagram**: botón de follow + zona para embeds
- 🤖 **Asistente IA** sobre impresión 3D con filamento (Netlify Function + OpenAI)

## Estructura
```
impriverso3d_ai/
├─ index.html
├─ style.css
├─ script.js
├─ netlify.toml
├─ netlify/
│  └─ functions/
│     └─ ai-chat.mjs
├─ assets/
│  └─ logo.svg
└─ package.json
```

## Deploy — GitHub + Netlify
1) **Sube a GitHub**
```bash
git init
git add .
git commit -m "Impriverso3D + AI agent"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/impriverso3d.git
git push -u origin main
```
2) **Netlify**
- Entra en https://app.netlify.com/ → **Add new site** → **Import an existing project** → GitHub → elige repo.
- **Build command:** *(vacío)*
- **Publish directory:** `/`
- En **Site settings → Environment variables**, añade:
  - `OPENAI_API_KEY` = tu API key de OpenAI.
- Deploy y listo. La web usa `/api/ai-chat` → proxy a `/.netlify/functions/ai-chat` (definido en `netlify.toml`).

## Desarrollo local
```bash
npm i -g netlify-cli
netlify dev
# abre http://localhost:8888 (sirve Functions y redirects)
```

## Cómo funciona el agente
- **Front:** widget flotante (FAB) que abre un panel de chat.
- **Back:** Netlify Function `ai-chat.mjs` que llama a **OpenAI Responses API** (modelo por defecto `gpt-4o-mini`).
- **Dominio:** respuestas acotadas a **impresión 3D con filamento**: calibración, materiales, parámetros, troubleshooting y seguridad.
- Si no hay datos críticos (impresora, material, temps), los pide amablemente para darte una solución precisa.

## Personalización rápida
- Cambia colores / radios en `:root` (CSS).
- Sustituye `videoIds` en `script.js` por tus vídeos reales.
- Añade embeds de posts IG dentro de la sección `#instagram`.

**Licencia:** MIT

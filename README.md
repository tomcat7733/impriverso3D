# Impriverso3D — PRO (Landing + IA + i18n + Stripe + PWA + YT/IG)

Todo lo que pediste, shippeado:
- 🤖 **Agente IA** (Netlify Function + OpenAI Responses API) — `OPENAI_API_KEY`.
- 🌐 **i18n ES/EN** (JSON + toggle) persistente.
- ▶️ **YouTube Latest** via RSS — `YT_CHANNEL_ID` o `YT_HANDLE`.
- 📸 **Instagram Feed** (Graph API) — `IG_TOKEN` (long-lived) + `IG_USER_ID`.
- 💳 **Stripe Checkout** (3 packs) — `STRIPE_SECRET_KEY` + `STRIPE_PRICE_*`.
- 📦 **PWA** (manifest + service worker) — offline básico.
- 🧰 Configurador + visor **STL**.
- 📝 **Netlify Forms** con snapshot del configurador.
- 🔍 SEO: robots.txt + sitemap.xml.

## ENV necesarios (Netlify → Site settings → Environment variables)
- `OPENAI_API_KEY`
- `YT_CHANNEL_ID` **o** `YT_HANDLE` (p.ej. `Impriverso3D`)
- `IG_TOKEN`, `IG_USER_ID` (IG Graph API)
- `STRIPE_SECRET_KEY`, `STRIPE_PRICE_PROTO`, `STRIPE_PRICE_RESINA`, `STRIPE_PRICE_EXPRESS`

## Deploy
1) Sube a GitHub:
```bash
git init && git add .
git commit -m "Impriverso3D PRO"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/impriverso3d.git
git push -u origin main
```
2) Netlify: Import from GitHub → Build command: *(vacío)*, Publish dir: `/` → añade las **ENV** de arriba → Deploy.

## Dev local
```bash
npm i -g netlify-cli
netlify dev
# http://localhost:8888 (Functions/redirects/PWA)
```

## Notas
- Si IG falla por permisos/token, la grilla muestra un placeholder y el resto de la página sigue funcional.
- Si no fijas `YT_CHANNEL_ID`, setea `YT_HANDLE=Impriverso3D` y la función intentará resolver el ID del canal.
- Para Stripe, crea 3 **Prices** en tu Dashboard y pega sus IDs en las ENV.

# Impriverso3D — Innova-style Theme
Landing estilo Innova3D, con IA, i18n, YouTube, Instagram (token rotatorio con Netlify Blobs), Stripe y PWA.

## ENV necesarias (Netlify)
- OPENAI_API_KEY
- YT_CHANNEL_ID (o YT_HANDLE)
- IG_USER_ID, IG_TOKEN, IG_REFRESH_SECRET
- STRIPE_SECRET_KEY, STRIPE_PRICE_PROTO, STRIPE_PRICE_RESINA, STRIPE_PRICE_EXPRESS

## Deploy
- Import from GitHub en Netlify (publish dir: `/`, build vacío).
- `netlify.toml` ya mapea las Functions a `/api/*`.

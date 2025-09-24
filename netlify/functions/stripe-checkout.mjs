export default async (req) => {
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  try{
    const body = await req.json();
    const product = body.product;
    const key = (globalThis.Netlify?.env?.get?.("STRIPE_SECRET_KEY")) ?? process.env.STRIPE_SECRET_KEY;
    const priceMap = {
      proto: (globalThis.Netlify?.env?.get?.("STRIPE_PRICE_PROTO")) ?? process.env.STRIPE_PRICE_PROTO,
      resina: (globalThis.Netlify?.env?.get?.("STRIPE_PRICE_RESINA")) ?? process.env.STRIPE_PRICE_RESINA,
      express: (globalThis.Netlify?.env?.get?.("STRIPE_PRICE_EXPRESS")) ?? process.env.STRIPE_PRICE_EXPRESS
    };
    const price = priceMap[product];
    if(!key || !price) return new Response(JSON.stringify({ error: "Missing Stripe env vars" }), { status: 500 });
    const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\\/$/, '') || 'https://impriverso3d.netlify.app';
    const params = new URLSearchParams();
    params.append('mode','payment');
    params.append('success_url', `${origin}/?checkout=success`);
    params.append('cancel_url', `${origin}/?checkout=cancel`);
    params.append('line_items[0][price]', price);
    params.append('line_items[0][quantity]', '1');
    const r = await fetch('https://api.stripe.com/v1/checkout/sessions', { method: 'POST', headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: params.toString() });
    const data = await r.json();
    if(!r.ok) return new Response(JSON.stringify({ error: "Stripe error", detail: data }), { status: 502, headers: { "content-type": "application/json" } });
    return new Response(JSON.stringify({ id: data.id, url: data.url }), { headers: { "content-type": "application/json" } });
  }catch(e){ return new Response(JSON.stringify({ error: String(e) }), { status: 500 }); }
};

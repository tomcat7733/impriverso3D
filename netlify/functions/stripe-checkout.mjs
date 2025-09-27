export default async (req) => {
  if (req.method !== "POST") { return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "content-type": "application/json" } }); }
  try{
    const body = await req.json();
    const product = body && body.product; // 'pla' | 'petg' | 'express'
    const key = process.env.STRIPE_SECRET_KEY;
    const priceMap = {
      pla: process.env.STRIPE_PRICE_PLA || process.env.STRIPE_PRICE_PROTO,
      petg: process.env.STRIPE_PRICE_PETG || process.env.STRIPE_PRICE_RESINA,
      express: process.env.STRIPE_PRICE_EXPRESS
    };
    const price = priceMap[product];
    if(!key || !price){ return new Response(JSON.stringify({ error: "Missing Stripe env vars" }), { status: 500, headers: { "content-type": "application/json" } }); }
    const originHeader = req.headers.get("origin"); const referer = req.headers.get("referer");
    let origin = originHeader || (referer ? referer.replace(/\/$/, "") : "https://impriverso3d.netlify.app");
    const params = new URLSearchParams();
    params.set("mode","payment");
    params.set("success_url", origin + "/?checkout=success");
    params.set("cancel_url", origin + "/?checkout=cancel");
    params.set("line_items[0][price]", price);
    params.set("line_items[0][quantity]", "1");
    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { "Authorization": "Bearer " + key, "Content-Type": "application/x-www-form-urlencoded" }, body: params.toString() });
    const data = await r.json();
    if(!r.ok) return new Response(JSON.stringify({ error: "Stripe error", detail: data }), { status: 502, headers: { "content-type": "application/json" } });
    return new Response(JSON.stringify({ id: data.id, url: data.url }), { status: 200, headers: { "content-type": "application/json" } });
  }catch(e){ return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { "content-type": "application/json" } }); }
};
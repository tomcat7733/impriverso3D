import { getStore } from '@netlify/blobs';
export default async (req) => {
  const secret = req.headers.get('x-refresh-secret');
  if (!secret || secret !== process.env.IG_REFRESH_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "content-type": "application/json" }});
  }
  try{
    const store = getStore('secrets');
    let token = await store.get('ig_token');
    if(!token) token = process.env.IG_TOKEN;
    if(!token) return new Response(JSON.stringify({ error: "Missing IG_TOKEN seed" }), { status: 500, headers: { "content-type": "application/json" }});
    const r = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`);
    const data = await r.json();
    if(!r.ok || !data.access_token) return new Response(JSON.stringify({ error: "IG refresh failed", detail: data }), { status: 502, headers: { "content-type": "application/json" }});
    await store.set('ig_token', data.access_token);
    return new Response(JSON.stringify({ ok:true, expires_in: data.expires_in || 5184000 }), { status: 200, headers: { "content-type": "application/json" }});
  }catch(e){
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { "content-type": "application/json" }});
  }
};
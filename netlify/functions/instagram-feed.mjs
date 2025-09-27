import { getStore } from '@netlify/blobs';
export default async (req) => {
  try{
    const url = new URL(req.url);
    const limit = url.searchParams.get('limit') || '9';
    const userId = process.env.IG_USER_ID;
    if(!userId) return new Response(JSON.stringify({ error: "Missing IG_USER_ID" }), { status: 500 });

    const store = getStore('secrets');
    let token = await store.get('ig_token');
    if(!token) token = process.env.IG_TOKEN;
    if(!token) return new Response(JSON.stringify({ error: "Missing IG_TOKEN" }), { status: 500 });

    const resp = await fetch(`https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}&limit=${limit}`);
    const data = await resp.json();
    if(!resp.ok) return new Response(JSON.stringify({ error: "IG error", detail: data }), { status: 502, headers: { "content-type": "application/json" } });
    const items = (data.data || []).map(p => ({ id:p.id, caption:p.caption, media_type:p.media_type, media_url:p.media_url, thumbnail_url:p.thumbnail_url, permalink:p.permalink, timestamp:p.timestamp }));
    return new Response(JSON.stringify({ items }), { headers: { "content-type": "application/json" } });
  }catch(e){ return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { "content-type": "application/json" } }); }
};
export default async (req) => {
  try{
    const url = new URL(req.url);
    const limit = url.searchParams.get('limit') || '9';
    const token = (globalThis.Netlify?.env?.get?.("IG_TOKEN")) ?? process.env.IG_TOKEN;
    const userId = (globalThis.Netlify?.env?.get?.("IG_USER_ID")) ?? process.env.IG_USER_ID;
    if(!token || !userId) return new Response(JSON.stringify({ error: "Missing IG_TOKEN or IG_USER_ID" }), { status: 500 });
    const resp = await fetch(`https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}&limit=${limit}`);
    const data = await resp.json();
    if(!resp.ok) return new Response(JSON.stringify({ error: "IG error", detail: data }), { status: 502 });
    const items = (data.data || []).map(p => ({ id:p.id, caption:p.caption, media_type:p.media_type, media_url:p.media_url, thumbnail_url:p.thumbnail_url, permalink:p.permalink, timestamp:p.timestamp }));
    return new Response(JSON.stringify({ items }), { headers: { "content-type": "application/json" } });
  }catch(e){ return new Response(JSON.stringify({ error: String(e) }), { status: 500 }); }
};

export default async (req) => {
  try{
    const YT_CHANNEL_ID = (globalThis.Netlify?.env?.get?.("YT_CHANNEL_ID")) ?? process.env.YT_CHANNEL_ID;
    let channelId = YT_CHANNEL_ID;
    if(!channelId){
      const handle = (globalThis.Netlify?.env?.get?.("YT_HANDLE")) ?? process.env.YT_HANDLE;
      if(!handle) return new Response(JSON.stringify({ error: "Missing YT_CHANNEL_ID or YT_HANDLE" }), { status: 500 });
      const res = await fetch(`https://www.youtube.com/@${handle}`);
      const html = await res.text();
      const m = html.match(/"channelId":"(UC[a-zA-Z0-9_-]+)"/);
      if(m) channelId = m[1];
    }
    if(!channelId) return new Response(JSON.stringify({ error: "Channel ID not found" }), { status: 500 });
    const feed = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
    const xml = await feed.text();
    const idMatch = xml.match(/<yt:videoId>([a-zA-Z0-9_-]{6,})<\/yt:videoId>/);
    const videoId = idMatch ? idMatch[1] : null;
    return new Response(JSON.stringify({ videoId }), { headers: { "content-type": "application/json" } });
  }catch(e){ return new Response(JSON.stringify({ error: String(e) }), { status: 500 }); }
};

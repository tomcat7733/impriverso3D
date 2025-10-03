export default async () => {
  try{
    let channelId = process.env.YT_CHANNEL_ID;
    if(!channelId && process.env.YT_HANDLE){
      const res = await fetch('https://www.youtube.com/@'+process.env.YT_HANDLE); const html = await res.text();
      const m = html.match(/\"channelId\":\"(UC[\w-]+)\"/); if(m) channelId = m[1];
    }
    if(!channelId) return new Response(JSON.stringify({ error: 'Missing channel' }), { status: 500 });
    const feed = await fetch('https://www.youtube.com/feeds/videos.xml?channel_id='+channelId); const xml = await feed.text();
    const id = (xml.match(/<yt:videoId>([\w-]{6,})<\/yt:videoId>/) || [])[1] || null;
    return new Response(JSON.stringify({ videoId: id }), { headers: { 'content-type':'application/json', 'cache-control':'public, max-age=300' } });
  }catch(e){ return new Response(JSON.stringify({ error: String(e) }), { status: 500 }); }
};
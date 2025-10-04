export default async () => {
  try{
    let channelId = process.env.YT_CHANNEL_ID;
    if(!channelId){
      const handle = process.env.YT_HANDLE;
      if(!handle) return new Response(JSON.stringify({ error: 'Missing YT_CHANNEL_ID or YT_HANDLE' }), { status: 500 });
      const res = await fetch('https://www.youtube.com/@'+handle);
      const html = await res.text();
      const m = html.match(/\"channelId\":\"(UC[\w-]+)\"/);
      if (m) channelId = m[1];
    }
    if(!channelId) return new Response(JSON.stringify({ error: 'Channel ID not found' }), { status: 500 });
    const feed = await fetch('https://www.youtube.com/feeds/videos.xml?channel_id='+channelId);
    const xml = await feed.text();
    const idMatch = xml.match(/<yt:videoId>([\w-]{6,})<\/yt:videoId>/);
    const videoId = idMatch ? idMatch[1] : null;
    return new Response(JSON.stringify({ videoId }), { headers: { 'content-type': 'application/json' } });
  }catch(e){
    return new Response(JSON.stringify({ error:String(e) }), { status: 500 });
  }
};
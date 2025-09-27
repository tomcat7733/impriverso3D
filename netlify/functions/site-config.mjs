export default async () => {
  const idFromUrl = (u='') => { try{ const x = new URL(u); if(x.hostname==='youtu.be') return x.pathname.slice(1); const v=x.searchParams.get('v'); if(v) return v; const m=x.pathname.match(/embed\/([\w-]{6,})|shorts\/([\w-]{6,})/); return (m && (m[1]||m[2])) || null; }catch{ return null; } };
  const id = process.env.YT_HERO_VIDEO_ID || idFromUrl(process.env.YT_HERO_VIDEO_URL || '');
  const cfg = { brandName: process.env.SITE_BRAND || 'Impriverso3D', youtubeHeroVideoId: id || null, youtubeHeroAutoplay: process.env.YT_HERO_AUTOPLAY==='1' };
  return new Response(JSON.stringify(cfg), { headers: { 'content-type':'application/json', 'cache-control':'public, max-age=300' } });
};
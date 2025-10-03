async function loadSiteConfig(){
  try{
    const cfg = await (await fetch('/api/site-config')).json();
    if(cfg.brandName){ const b=document.querySelector('.brand span'); if(b) b.textContent=cfg.brandName; document.title = cfg.brandName + ' | Impresión 3D en PLA y PETG'; }
    if(cfg.youtubeHeroVideoId){ const f=document.getElementById('ytPlayer'); if(f){ f.dataset.fixed='1'; f.src='https://www.youtube.com/embed/'+cfg.youtubeHeroVideoId+'?rel=0'+(cfg.youtubeHeroAutoplay?'&autoplay=1&mute=1':''); } }
  }catch(e){ console.warn('site-config', e); }
}
async function setLatestYouTube(){
  try{
    const data = await (await fetch('/api/youtube-latest')).json();
    if(data && data.videoId){ ['ytPlayer','ytPlayer2'].forEach(id=>{ const f=document.getElementById(id); if(f && !f.dataset.fixed){ f.src='https://www.youtube.com/embed/'+data.videoId+'?rel=0'; } }); }
  }catch(e){ console.warn('yt-latest', e); }
}
(async()=>{ await loadSiteConfig(); await setLatestYouTube(); })();
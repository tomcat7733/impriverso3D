// 🔪 Kill SW & caches from any previous site (one-shot)
(async () => {
  if (!localStorage.getItem('sw_cleared_once')) {
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const r of regs) await r.unregister();
      }
      if (window.caches) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
    } catch {}
    localStorage.setItem('sw_cleared_once', '1');
  }
})();

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// YouTube: carga el último vídeo del canal (usa YT_CHANNEL_ID o YT_HANDLE en Netlify)
(async function setLatestYouTube(){
  try{
    const r = await fetch('/api/youtube-latest');
    const data = await r.json();
    if (data && data.videoId) {
      const iframe = document.getElementById('ytPlayer');
      if (iframe) iframe.src = 'https://www.youtube.com/embed/' + data.videoId + '?rel=0';
    }
  }catch(e){
    const iframe = document.getElementById('ytPlayer');
    if (iframe && !iframe.src.includes('embed')) {
      // Fallback a un vídeo conocido si la API falla
      iframe.src = 'https://www.youtube.com/embed/VjZc9nk2jdg?rel=0';
    }
  }
})();
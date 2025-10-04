/* Impriverso3D scripts v4.3.3 */
(function(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('mainnav');
  if (toggle && nav){
    toggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
      const open = nav.classList.contains('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false');
    }));
  }

  const wrap = document.querySelector('.video-wrap');
  const vid = document.getElementById('heroVideo');
  if (wrap && vid){
    wrap.classList.add('video-loading');
    const ready = () => wrap.classList.remove('video-loading');
    vid.addEventListener('canplay', ready, {once:true});
    vid.addEventListener('loadeddata', ready, {once:true});
  }

  const email = 'impriverso3d@gmail.com';
  const copyBtn = document.getElementById('copyEmail');
  if (copyBtn){
    copyBtn.addEventListener('click', async () => {
      try{ await navigator.clipboard.writeText(email); copyBtn.textContent='Copiado ✓'; }
      catch{ copyBtn.textContent='No se pudo copiar'; }
      setTimeout(()=>copyBtn.textContent='Copiar', 1800);
    });
  }
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  const yt = document.getElementById('ytPlayer');
  if (yt){
    const fallbackId = yt.getAttribute('data-video-id') || 'VjZc9nk2jdg';
    const channelId  = yt.getAttribute('data-channel-id');
    const buildSingle  = (id) => `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;
    const buildUploads = (cid) => {
      if (!cid || !/^UC/.test(cid)) return null;
      const uploads = 'UU' + cid.slice(2);
      return `https://www.youtube.com/embed/videoseries?list=${uploads}&rel=0&modestbranding=1&playsinline=1`;
    };
    const setSrc = (url) => { yt.src = url; };
    let set = false;
    fetch('/api/youtube-latest?t=' + Date.now(), { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        const id = d.id || d.videoId || (d.items && d.items[0] && (d.items[0].id?.videoId || d.items[0].id)) || null;
        if (id) { setSrc(buildSingle(id)); set = true; }
        else throw 0;
      })
      .catch(() => {
        const pl = buildUploads(channelId);
        if (pl){ setSrc(pl); set = true; }
      })
      .finally(() => {
        if (!set) setSrc(buildSingle(fallbackId));
      });
  }
})();
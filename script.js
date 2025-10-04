/* Impriverso3D scripts v4.2.4 */
(function(){
  // --- Mobile nav toggle ---
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

  // --- Hero video poster fallback ---
  const wrap = document.querySelector('.video-wrap');
  const vid = document.getElementById('heroVideo');
  if (wrap && vid){
    wrap.classList.add('video-loading');
    const ready = () => wrap.classList.remove('video-loading');
    vid.addEventListener('canplay', ready, {once:true});
    vid.addEventListener('loadeddata', ready, {once:true});
  }

  // --- Copy email + footer year ---
  const email = 'impriverso3d@gmail.com';
  const copyBtn = document.getElementById('copyEmail');
  if (copyBtn){
    copyBtn.addEventListener('click', async () => {
      try{
        await navigator.clipboard.writeText(email);
        copyBtn.textContent='Copiado ✓';
      }catch{
        copyBtn.textContent='No se pudo copiar';
      }
      setTimeout(()=>copyBtn.textContent='Copiar', 1800);
    });
  }
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // --- YouTube embed (dinámico con fallback) ---
  const yt = document.getElementById('ytPlayer');
  if (yt){
    const fallbackId = yt.getAttribute('data-video-id') || 'VjZc9nk2jdg';
    const build = (id) => `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;

    fetch('/api/youtube-latest', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        const id = d.id || d.videoId || (d && d.items && d.items[0] && (d.items[0].id.videoId || d.items[0].id)) || fallbackId;
        yt.src = build(id);
      })
      .catch(() => { yt.src = build(fallbackId); });
  }
})();

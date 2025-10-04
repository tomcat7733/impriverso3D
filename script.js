/* Impriverso3D scripts v4.2.0 */
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
})();
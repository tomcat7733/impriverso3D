// Background video helper v4.3.0
(function(){
  const bg = document.querySelector('.site-bg');
  const v  = document.getElementById('bgVideo');
  if (!bg || !v) return;

  const usePosterFallback = () => bg.classList.add('bg-video-fallback');

  const tryPlay = () => {
    const p = v.play();
    if (p && typeof p.then === 'function'){
      p.catch(() => usePosterFallback());
    }
  };

  v.addEventListener('error', usePosterFallback, { once:true });
  v.addEventListener('loadeddata', () => {}, { once:true });

  tryPlay();
  ['click','touchstart'].forEach(evt => {
    window.addEventListener(evt, tryPlay, { once:true, passive:true });
  });
})();
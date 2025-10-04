// Reanuda el vídeo cuando vuelves a la pestaña
document.addEventListener('visibilitychange', () => {
  const v = document.getElementById('heroVideo');
  if (!v) return;
  if (document.visibilityState === 'visible' && v.paused) {
    v.play().catch(()=>{});
  }
});

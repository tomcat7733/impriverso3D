
document.getElementById('year').textContent = new Date().getFullYear();

// Cargar último vídeo de YouTube (usa env YT_CHANNEL_ID o YT_HANDLE)
(async function setLatestYouTube(){
  try{
    const r = await fetch('/api/youtube-latest');
    const data = await r.json();
    if (data && data.videoId) {
      const iframe = document.getElementById('ytPlayer');
      iframe.src = 'https://www.youtube.com/embed/' + data.videoId + '?rel=0';
    }
  }catch(e){
    // fallback: vídeo fijo
    const iframe = document.getElementById('ytPlayer');
    if (iframe && !iframe.src.includes('embed')) {
      iframe.src = 'https://www.youtube.com/embed/VjZc9nk2jdg?rel=0';
    }
  }
})();

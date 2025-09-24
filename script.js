
// PWA registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(console.warn); });
}

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle?.addEventListener('click', ()=> nav.classList.toggle('show'));

// i18n
const I18N = { current: localStorage.getItem('lang') || 'es', data: {} };
async function loadI18n(lang){
  try{
    const r = await fetch(`/assets/i18n/${lang}.json`);
    I18N.data = await r.json();
    I18N.current = lang;
    localStorage.setItem('lang', lang);
    applyI18n();
  }catch(e){ console.warn('i18n load error', e); }
}
function applyI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.getAttribute('data-i18n');
    if(I18N.data[k]) el.textContent = I18N.data[k];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el=>{
    const k = el.getAttribute('data-i18n-html');
    if(I18N.data[k]) el.innerHTML = I18N.data[k];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    const k = el.getAttribute('data-i18n-placeholder');
    if(I18N.data[k]) el.setAttribute('placeholder', I18N.data[k]);
  });
}
document.getElementById('langToggle')?.addEventListener('click', ()=>{
  loadI18n(I18N.current === 'es' ? 'en' : 'es');
});
loadI18n(I18N.current);

// Configurator
const size = document.getElementById('size');
const sizeVal = document.getElementById('sizeVal');
const infill = document.getElementById('infill');
const infillVal = document.getElementById('infillVal');
const material = document.getElementById('material');
const finish = document.getElementById('finish');
const priceEl = document.getElementById('price');
const addToQuote = document.getElementById('addToQuote');

function calcPrice(){
  const s = Number(size.value);
  const d = Number(infill.value);
  const mat = material.value;
  const fin = finish.value;
  const matK = { 'PLA': 1.0, 'PETG': 1.2, 'ABS': 1.3, 'RESINA': 1.6 }[mat] || 1.0;
  const finishK = (fin === 'premium') ? 1.35 : 1.0;
  let base = Math.pow(s, 2) * (0.08 + d/300) * matK;
  base = base * finishK;
  const price = Math.max(12, Math.round(base));
  priceEl.textContent = price.toString();
  localStorage.setItem('impriverso_cfg', JSON.stringify({s,d,mat,fin,price}));
  return price;
}
[size, infill, material, finish].forEach(el => el?.addEventListener('input', ()=>{
  sizeVal.textContent = size.value;
  infillVal.textContent = infill.value;
  calcPrice();
}));
sizeVal.textContent = size.value;
infillVal.textContent = infill.value;
calcPrice();
addToQuote?.addEventListener('click', ()=>{
  const p = calcPrice();
  alert(`Añadido a solicitud. Estimación: €${p}. Completa el formulario de contacto y adjunta tu STL si quieres ▶`);
});

// Contact snapshot
const contactForm = document.querySelector('form[name="contact"]');
const configSnapshot = document.getElementById('configSnapshot');
contactForm?.addEventListener('submit', ()=>{
  const snap = {
    size_cm: Number(size?.value || 0),
    infill_percent: Number(infill?.value || 0),
    material: material?.value || 'PLA',
    finish: finish?.value || 'estandar',
    estimated_price_eur: Number((document.getElementById('price')?.textContent || '0').replace(/[^0-9.]/g,''))
  };
  if (configSnapshot) configSnapshot.value = JSON.stringify(snap);
});

// STL Viewer (guarded)
const canvas = document.getElementById('stlCanvas');
try{
  if (typeof THREE !== 'undefined' && canvas){
    const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
    const scene = new THREE.Scene();
    function resize3D(){
      const w = canvas.clientWidth;
      const h = canvas.clientHeight || 380;
      renderer.setSize(w, h, false);
      camera.aspect = w/h; camera.updateProjectionMatrix();
    }
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    resize3D();
    camera.position.set(2.2,1.8,2.6);
    const controls = new THREE.OrbitControls(camera, canvas); controls.enableDamping = true;
    const dir = new THREE.DirectionalLight(0xffffff, 1.0); dir.position.set(2,2,3);
    scene.add(dir); scene.add(new THREE.AmbientLight(0xffffff, .45));
    const grid = new THREE.GridHelper(6,12,0x333333,0x222222); grid.position.y=-0.5; scene.add(grid);
    let mesh=null;
    function animate(){ requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); } animate();
    window.addEventListener('resize', resize3D);

    function loadSTLFromFile(file){
      const reader = new FileReader();
      reader.onload = function(e){
        const arrayBuffer = e.target.result;
        const loader = new THREE.STLLoader();
        const geometry = loader.parse(arrayBuffer);
        geometry.computeVertexNormals();
        const mat = new THREE.MeshStandardMaterial({ color: 0x88aaff, metalness: 0.1, roughness: 0.6 });
        if(mesh){ scene.remove(mesh); mesh.geometry.dispose(); }
        mesh = new THREE.Mesh(geometry, mat);
        geometry.computeBoundingBox();
        const bb = geometry.boundingBox;
        const sizeX = bb.max.x - bb.min.x, sizeY = bb.max.y - bb.min.y, sizeZ = bb.max.z - bb.min.z;
        const maxDim = Math.max(sizeX, sizeY, sizeZ);
        const scale = 1.5 / maxDim;
        mesh.scale.setScalar(scale);
        mesh.position.set(-(bb.min.x + sizeX/2)*scale, -(bb.min.y + sizeY/2)*scale, -(bb.min.z + sizeZ/2)*scale);
        scene.add(mesh);
      };
      reader.readAsArrayBuffer(file);
    }
    const stlInput = document.getElementById('stlInput');
    const drop = document.getElementById('fileDrop');
    stlInput?.addEventListener('change', (e)=>{
      const file = e.target.files?.[0];
      if(file && /\.stl$/i.test(file.name)) loadSTLFromFile(file);
      else alert("Sube un archivo .stl válido");
    });
    drop?.addEventListener('click', ()=> stlInput?.click());
    ['dragenter','dragover'].forEach(evt=> drop?.addEventListener(evt, e=>{e.preventDefault(); drop.style.borderColor = 'var(--accent)'}));
    ['dragleave','drop'].forEach(evt=> drop?.addEventListener(evt, e=>{e.preventDefault(); drop.style.borderColor = 'rgba(255,255,255,.25)'}));
    drop?.addEventListener('drop', e=>{
      const file = e.dataTransfer.files?.[0];
      if(file && /\.stl$/i.test(file.name)) loadSTLFromFile(file);
    });
  }
}catch(e){ console.warn('Viewer 3D deshabilitado:', e); }

// Lightbox
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lightboxImg');
const lbClose = document.getElementById('lightboxClose');
document.querySelectorAll('.g-item').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    lbImg.src = a.getAttribute('href');
    lb.classList.add('show'); lb.setAttribute('aria-hidden','false');
  });
});
lbClose?.addEventListener('click', ()=>{ lb.classList.remove('show'); lb.setAttribute('aria-hidden','true'); });
lb?.addEventListener('click', (e)=>{ if(e.target===lb){ lb.classList.remove('show'); lb.setAttribute('aria-hidden','true'); }});

// YouTube latest via Function
async function setLatestYouTube(){
  try{
    const r = await fetch('/api/youtube-latest');
    const data = await r.json();
    if(data?.videoId){
      const frame = document.getElementById('ytPlayer');
      frame && (frame.src = `https://www.youtube.com/embed/${data.videoId}`);
    }
  }catch(e){ console.warn('YT latest failed', e); }
}
setLatestYouTube();

// Instagram Feed via Function
async function loadInstagramFeed(limit=9){
  try{
    const r = await fetch(`/api/instagram-feed?limit=${limit}`);
    const data = await r.json();
    if(Array.isArray(data?.items)){
      const grid = document.querySelector('.ig-grid');
      if(grid){ grid.innerHTML = '';
        data.items.forEach(post=>{
          const a = document.createElement('a');
          a.href = post.permalink; a.target='_blank'; a.rel='noopener'; a.className='g-item';
          const img = document.createElement('img');
          img.src = post.thumbnail_url || post.media_url; img.alt = (post.caption || 'Instagram post').slice(0,120);
          a.appendChild(img); grid.appendChild(a);
        });
      }
    }
  }catch(e){ console.warn('IG feed fail', e); }
}
loadInstagramFeed(9);

// Stripe Checkout buttons
async function startCheckout(product){
  try{
    const r = await fetch('/api/stripe-checkout', { method:'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ product }) });
    const data = await r.json();
    if(data?.url) window.location.href = data.url; else alert('No se pudo iniciar el pago.');
  }catch(e){ alert('Error iniciando pago'); console.error(e); }
}
document.querySelectorAll('#pricing [data-product]').forEach(btn=> btn.addEventListener('click', ()=> startCheckout(btn.getAttribute('data-product'))));

// AI Assistant Widget
const aiFab = document.getElementById('ai-fab');
const aiPanel = document.getElementById('ai-panel');
const aiCloseBtn = document.getElementById('ai-close');
const aiForm = document.getElementById('ai-form');
const aiInput = document.getElementById('ai-input');
const aiMessages = document.getElementById('ai-messages');
const aiMessagesState = [];

function aiOpen(){ aiPanel?.classList.add('show'); aiPanel?.setAttribute('aria-hidden','false'); aiFab?.setAttribute('aria-expanded','true'); aiInput?.focus(); }
function aiCloseFn(){ aiPanel?.classList.remove('show'); aiPanel?.setAttribute('aria-hidden','true'); aiFab?.setAttribute('aria-expanded','false'); }
aiFab?.addEventListener('click', aiOpen);
aiCloseBtn?.addEventListener('click', aiCloseFn);

function pushMsg(role, text){
  const wrapper = document.createElement('div');
  wrapper.className = 'ai-msg ' + (role === 'user' ? 'ai-user' : 'ai-bot');
  const bubble = document.createElement('div');
  bubble.className = 'ai-bubble';
  bubble.textContent = text;
  wrapper.appendChild(bubble);
  aiMessages.appendChild(wrapper);
  aiMessages.scrollTop = aiMessages.scrollHeight;
  aiMessagesState.push({ role, content: text });
}
function setTyping(on){
  if(on){
    const w = document.createElement('div');
    w.className = 'ai-msg ai-bot ai-typing';
    const b = document.createElement('div'); b.className = 'ai-bubble'; b.textContent = 'Escribiendo…';
    w.appendChild(b); w.id='ai-typing'; aiMessages.appendChild(w);
  } else { document.getElementById('ai-typing')?.remove(); }
  aiMessages.scrollTop = aiMessages.scrollHeight;
}
aiForm?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const q = aiInput.value.trim(); if(!q) return;
  pushMsg('user', q); aiInput.value=''; setTyping(true);
  try{
    const res = await fetch('/api/ai-chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ messages: aiMessagesState }) });
    const data = await res.json(); setTyping(false);
    if(data?.reply) pushMsg('assistant', data.reply); else pushMsg('assistant', 'Ups, no pude procesar tu consulta ahora 😅');
  }catch(err){ setTyping(false); pushMsg('assistant','Error de red.'); console.error(err); }
});

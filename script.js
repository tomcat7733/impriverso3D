// UX sugar for year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle?.addEventListener('click', ()=> nav.classList.toggle('show'));

// Configurator state
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

// STL Viewer
let renderer, scene, camera, controls, mesh;
const canvas = document.getElementById('stlCanvas');

function init3D(){
  renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  resize3D();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, canvas.clientWidth/canvas.clientHeight, 0.1, 1000);
  camera.position.set(2.2, 1.8, 2.6);
  controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const dir = new THREE.DirectionalLight(0xffffff, 1.0);
  dir.position.set(2,2,3);
  scene.add(dir);
  scene.add(new THREE.AmbientLight(0xffffff, 0.45));

  const grid = new THREE.GridHelper(6, 12, 0x333333, 0x222222);
  grid.position.y = -0.5;
  scene.add(grid);

  animate();
}
function animate(){
  requestAnimationFrame(animate);
  controls?.update();
  renderer?.render(scene, camera);
}
function resize3D(){
  const w = canvas.clientWidth;
  const h = canvas.clientHeight || 380;
  renderer?.setSize(w, h, false);
  camera && (camera.aspect = w/h, camera.updateProjectionMatrix());
}
window.addEventListener('resize', resize3D);
init3D();

function loadSTLFromFile(file){
  const reader = new FileReader();
  reader.onload = function(e){
    const arrayBuffer = e.target.result;
    const loader = new THREE.STLLoader();
    const geometry = loader.parse(arrayBuffer);
    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({ color: 0x88aaff, metalness: 0.1, roughness: 0.6 });
    if(mesh){ scene.remove(mesh); mesh.geometry.dispose(); }
    mesh = new THREE.Mesh(geometry, material);
    geometry.computeBoundingBox();
    const bb = geometry.boundingBox;
    const sizeX = bb.max.x - bb.min.x;
    const sizeY = bb.max.y - bb.min.y;
    const sizeZ = bb.max.z - bb.min.z;
    const maxDim = Math.max(sizeX, sizeY, sizeZ);
    const scale = 1.5 / maxDim;
    mesh.scale.setScalar(scale);
    mesh.position.set(-(bb.min.x + sizeX/2)*scale, -(bb.min.y + sizeY/2)*scale, -(bb.min.z + sizeZ/2)*scale);
    scene.add(mesh);
  };
  reader.readAsArrayBuffer(file);
}

const stlInput = document.getElementById('stlInput');
stlInput?.addEventListener('change', (e)=>{
  const file = e.target.files?.[0];
  if(file && /\.stl$/i.test(file.name)) loadSTLFromFile(file);
  else alert("Sube un archivo .stl válido");
});
const drop = document.getElementById('fileDrop');
drop?.addEventListener('click', ()=> stlInput.click());
['dragenter','dragover'].forEach(evt=> drop?.addEventListener(evt, e=>{e.preventDefault(); drop.style.borderColor = 'var(--accent)'}));
['dragleave','drop'].forEach(evt=> drop?.addEventListener(evt, e=>{e.preventDefault(); drop.style.borderColor = 'rgba(255,255,255,.25)'}));
drop?.addEventListener('drop', e=>{
  const file = e.dataTransfer.files?.[0];
  if(file && /\.stl$/i.test(file.name)) loadSTLFromFile(file);
});

// Lightbox
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lightboxImg');
const lbClose = document.getElementById('lightboxClose');
document.querySelectorAll('.g-item').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    lbImg.src = a.getAttribute('href');
    lb.classList.add('show');
    lb.setAttribute('aria-hidden','false');
  });
});
lbClose?.addEventListener('click', ()=>{
  lb.classList.remove('show');
  lb.setAttribute('aria-hidden','true');
});
lb?.addEventListener('click', (e)=>{
  if(e.target===lb) { lb.classList.remove('show'); lb.setAttribute('aria-hidden','true'); }
});

// YouTube simple carousel
const videoIds = [
  'dQw4w9WgXcQ', // TODO: reemplaza por tus IDs reales
  'M7lc1UVf-VE',
  'ysz5S6PUM-U'
];
let vidIdx = 0;
const player = document.getElementById('ytPlayer');
function setVid(i){
  vidIdx = (i + videoIds.length) % videoIds.length;
  player.src = `https://www.youtube.com/embed/${videoIds[vidIdx]}`;
}
document.getElementById('prevVid')?.addEventListener('click', ()=> setVid(vidIdx-1));
document.getElementById('nextVid')?.addEventListener('click', ()=> setVid(vidIdx+1));

// Restore persisted config if present
try{
  const saved = JSON.parse(localStorage.getItem('impriverso_cfg')||'null');
  if(saved){
    size.value = saved.s; infill.value = saved.d; material.value = saved.mat; finish.value = saved.fin;
    sizeVal.textContent = saved.s; infillVal.textContent = saved.d; calcPrice();
  }
}catch{}

// === AI Assistant Widget ===
const aiFab = document.getElementById('ai-fab');
const aiPanel = document.getElementById('ai-panel');
const aiClose = document.getElementById('ai-close');
const aiForm = document.getElementById('ai-form');
const aiInput = document.getElementById('ai-input');
const aiMessages = document.getElementById('ai-messages');
const aiMessagesState = [];

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
    const b = document.createElement('div');
    b.className = 'ai-bubble';
    b.textContent = 'Escribiendo…';
    w.appendChild(b);
    w.id = 'ai-typing';
    aiMessages.appendChild(w);
  } else {
    document.getElementById('ai-typing')?.remove();
  }
  aiMessages.scrollTop = aiMessages.scrollHeight;
}
aiFab?.addEventListener('click', ()=>{ aiPanel.classList.toggle('show'); aiPanel.setAttribute('aria-hidden', aiPanel.classList.contains('show') ? 'false':'true'); aiInput?.focus(); });
aiClose?.addEventListener('click', ()=>{ aiPanel.classList.remove('show'); aiPanel.setAttribute('aria-hidden', 'true'); });

aiForm?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const q = aiInput.value.trim();
  if(!q) return;
  pushMsg('user', q);
  aiInput.value = '';
  setTyping(true);
  try{
    const res = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: aiMessagesState })
    });
    const data = await res.json();
    setTyping(false);
    if(data?.reply){
      pushMsg('assistant', data.reply);
    } else {
      pushMsg('assistant', 'Ups, no pude procesar tu consulta ahora 😅 Intenta de nuevo en unos segundos.');
      console.error('AI error', data);
    }
  } catch(err){
    setTyping(false);
    pushMsg('assistant', 'Error de red. Revisa tu conexión.');
    console.error(err);
  }
});
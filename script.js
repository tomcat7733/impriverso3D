
if ('serviceWorker' in navigator) { window.addEventListener('load', ()=> navigator.serviceWorker.register('/sw.js').catch(console.warn)); }
document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle'); const nav = document.getElementById('nav');
navToggle?.addEventListener('click', ()=> nav.classList.toggle('show'));

// i18n
const I18N = { current: localStorage.getItem('lang') || 'es', data: {} };
async function loadI18n(lang){ try{ const r = await fetch(`/assets/i18n/${lang}.json`); I18N.data = await r.json(); I18N.current = lang; localStorage.setItem('lang', lang); applyI18n(); }catch(e){ console.warn('i18n', e);}}
function applyI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{ const k=el.getAttribute('data-i18n'); if(I18N.data[k]) el.textContent = I18N.data[k]; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{ const k=el.getAttribute('data-i18n-placeholder'); if(I18N.data[k]) el.setAttribute('placeholder', I18N.data[k]); });
}
document.getElementById('langToggle')?.addEventListener('click', ()=> loadI18n(I18N.current==='es'?'en':'es')); loadI18n(I18N.current);

// === NUEVO ESTIMADOR por dimensiones + colores ===
const wmm = document.getElementById('wmm');
const hmm = document.getElementById('hmm');
const dmm = document.getElementById('dmm');
const colorsSel = document.getElementById('colors');
const materialSel = document.getElementById('material');
const finishSel = document.getElementById('finish');
const priceEl = document.getElementById('price');

function calcPriceDims(){
  const w = Math.max(5, Number(wmm?.value || 0));
  const h = Math.max(5, Number(hmm?.value || 0));
  const d = Math.max(1, Number(dmm?.value || 0));
  const colors = Math.min(4, Math.max(1, Number(colorsSel?.value || 1)));
  const mat = (materialSel?.value || 'PLA');
  const fin = (finishSel?.value || 'estandar');

  const area_cm2 = (w * h) / 100.0;
  const vol_cm3 = area_cm2 * (d / 10.0);

  const rate_per_cm3 = 0.10;     // €/cm³
  const base_fee = 0.60;         // € setup
  const color_fee = 0.20 * (colors - 1);
  const matK = mat === 'PETG' ? 1.15 : 1.00;
  const finK = fin === 'premium' ? 1.35 : 1.00;

  let price = (vol_cm3 * rate_per_cm3 * matK) + base_fee + color_fee;
  price *= finK;
  price = Math.max(2, Math.round(price)); // mínimo 2€ y redondeo a entero

  if (priceEl) priceEl.textContent = String(price);
  localStorage.setItem('impriverso_cfg', JSON.stringify({ w, h, d, colors, mat, fin, price }));
  return price;
}
[wmm, hmm, dmm, colorsSel, materialSel, finishSel].forEach(el => el?.addEventListener('input', calcPriceDims));
calcPriceDims();

document.getElementById('addToQuote')?.addEventListener('click', ()=>{ const p = calcPriceDims(); alert('Añadido. Estimación €'+p+'. Completa el formulario.'); });

// Contact snapshot al enviar el form
document.getElementById('configSnapshot')?.closest('form')?.addEventListener('submit', () => {
  const w = Number(wmm?.value || 0), h = Number(hmm?.value || 0), d = Number(dmm?.value || 0);
  const colors = Number(colorsSel?.value || 1);
  const mat = materialSel?.value || 'PLA';
  const fin = finishSel?.value || 'estandar';
  const price = Number((priceEl?.textContent || '0').replace(/[^0-9.]/g, ''));
  const snap = { width_mm: w, height_mm: h, depth_mm: d, colors, material: mat, finish: fin, estimated_price_eur: price };
  const input = document.getElementById('configSnapshot');
  if (input) input.value = JSON.stringify(snap);
});

// YouTube latest para el bloque secundario
async function setLatestYouTube(){
  try{ const r = await fetch('/api/youtube-latest'); const data = await r.json(); if(data?.videoId){ const f=document.getElementById('ytPlayer2'); if(f) f.src='https://www.youtube.com/embed/'+data.videoId+'?rel=0'; } }catch(e){ console.warn('YT', e); }
}
setLatestYouTube();

// Instagram feed
async function loadIG(limit=8){
  try{ const r=await fetch('/api/instagram-feed?limit='+limit); const data=await r.json(); const grid=document.querySelector('.ig-grid'); if(Array.isArray(data?.items) && grid){ grid.innerHTML=''; data.items.forEach(p=>{ const a=document.createElement('a'); a.className='g-item'; a.href=p.permalink; a.target='_blank'; a.rel='noopener'; const img=document.createElement('img'); img.src=p.thumbnail_url||p.media_url; img.alt=(p.caption||'Instagram'); a.appendChild(img); grid.appendChild(a); }); } }catch(e){ console.warn('IG', e); }
}
loadIG(8);

// Stripe Checkout
async function startCheckout(product){ try{ const r=await fetch('/api/stripe-checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({product})}); const data=await r.json(); if(data?.url) window.location.href=data.url; else alert('No se pudo iniciar el pago.'); }catch(e){ alert('Error iniciando pago'); } }
document.querySelectorAll('[data-product]').forEach(b=> b.addEventListener('click', ()=> startCheckout(b.getAttribute('data-product'))));

// IA widget
const aiFab=document.getElementById('ai-fab'), aiPanel=document.getElementById('ai-panel'), aiClose=document.getElementById('ai-close'), aiForm=document.getElementById('ai-form'), aiInput=document.getElementById('ai-input'), aiMessages=document.getElementById('ai-messages'); const aiState=[];
function aiOpen(){ aiPanel.classList.add('show'); aiPanel.setAttribute('aria-hidden','false'); aiFab.setAttribute('aria-expanded','true'); aiInput.focus(); }
function aiCloseFn(){ aiPanel.classList.remove('show'); aiPanel.setAttribute('aria-hidden','true'); aiFab.setAttribute('aria-expanded','false'); }
aiFab?.addEventListener('click', aiOpen); aiClose?.addEventListener('click', aiCloseFn);
function pushMsg(role,text){ const w=document.createElement('div'); w.className='ai-msg '+(role==='user'?'ai-user':'ai-bot'); const b=document.createElement('div'); b.className='ai-bubble'; b.textContent=text; w.appendChild(b); aiMessages.appendChild(w); aiMessages.scrollTop=aiMessages.scrollHeight; aiState.push({role,content:text}); }
function setTyping(on){ if(on){ const w=document.createElement('div'); w.className='ai-msg ai-bot ai-typing'; const b=document.createElement('div'); b.className='ai-bubble'; b.textContent='Escribiendo…'; w.appendChild(b); w.id='ai-typing'; aiMessages.appendChild(w);} else { document.getElementById('ai-typing')?.remove(); } aiMessages.scrollTop=aiMessages.scrollHeight; }
aiForm?.addEventListener('submit', async (e)=>{ e.preventDefault(); const q=aiInput.value.trim(); if(!q) return; pushMsg('user', q); aiInput.value=''; setTyping(true);
  try{ const res=await fetch('/api/ai-chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:aiState})}); const data=await res.json(); setTyping(false); pushMsg('assistant', data?.reply || 'No pude procesar tu consulta ahora.'); }catch(err){ setTyping(false); pushMsg('assistant','Error de red.'); }
});

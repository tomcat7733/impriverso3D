/* Añadir/actualizar en script.js: calcula precio por dimensiones + colores */
const wmm = document.getElementById('wmm');
const hmm = document.getElementById('hmm');
const dmm = document.getElementById('dmm');
const colorsSel = document.getElementById('colors');
const materialSel = document.getElementById('material');
const finishSel = document.getElementById('finish');
const priceEl = document.getElementById('price');

function calcPriceDims(){
  const w = Math.max(10, Number(wmm?.value || 0));
  const h = Math.max(10, Number(hmm?.value || 0));
  const d = Math.max(1, Number(dmm?.value || 0));
  const colors = Math.min(4, Math.max(1, Number(colorsSel?.value || 1)));
  const mat = (materialSel?.value || 'PLA');
  const fin = (finishSel?.value || 'estandar');

  // Conversión a volumen (cm³): (mm*mm)/100 -> cm² ; mm/10 -> cm
  const area_cm2 = (w * h) / 100.0;
  const vol_cm3 = area_cm2 * (d / 10.0);

  // Tarifa base calibrada para que 60×75×2 mm con 2 colores ≈ 2 €
  const rate_per_cm3 = 0.10;     // €/cm³
  const base_fee = 0.60;         // € setup
  const color_fee = 0.20 * (colors - 1); // € por color extra
  const matK = mat === 'PETG' ? 1.15 : 1.00;
  const finK = fin === 'premium' ? 1.35 : 1.00;

  let price = (vol_cm3 * rate_per_cm3 * matK) + base_fee + color_fee;
  price *= finK;

  // Redondeo comercial y mínimos
  price = Math.max(2, Math.round(price)); // mínimo 2€ y redondeo a entero
  if (priceEl) priceEl.textContent = String(price);

  // Persistimos para el formulario
  localStorage.setItem('impriverso_cfg', JSON.stringify({ w, h, d, colors, mat, fin, price }));
  return price;
}

[wmm, hmm, dmm, colorsSel, materialSel, finishSel].forEach(el => el?.addEventListener('input', calcPriceDims));
calcPriceDims();

// Si sigues enviando la instantánea en el form de contacto:
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
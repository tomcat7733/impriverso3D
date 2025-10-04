Patch: Presupuesto por dimensiones + colores (sin subida de STL)

1) En `index.html`, reemplaza TODO el bloque `<section id="presupuesto"> ... </section>` por el contenido de `index.html` de este patch.
2) En `script.js`, pega el fragmento de `script.js` de este patch al final (o sustituye la lógica anterior de cálculo).
3) Deploy en Netlify y hard refresh.

Fórmula (calibrada a tu referencia de precios):
- volumen = (ancho*alto)/100 * (profundidad/10)  [cm³]
- precio = volumen * 0,10 € + 0,60 € + 0,20 € * (colores - 1)
- multiplicadores: PETG ×1,15; Premium ×1,35
- redondeo a entero y mínimo 2 €

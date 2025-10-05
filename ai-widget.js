/* Impriverso3D · AI Widget v1.0 */
(() => {
  // Crear UI
  const fab = document.createElement('button');
  fab.className = 'aiw-fab';
  fab.type = 'button';
  fab.title = 'Asistente IA de impresión 3D';
  fab.setAttribute('aria-controls','aiw-panel');
  fab.innerHTML = '🤖';

  const panel = document.createElement('section');
  panel.className = 'aiw-panel';
  panel.id = 'aiw-panel';
  panel.innerHTML = `
    <div class="aiw-head">
      <strong>Asistente Impriverso3D</strong>
      <button class="aiw-close" aria-label="Cerrar">✕</button>
    </div>
    <div class="aiw-messages" aria-live="polite"></div>
    <form class="aiw-form">
      <input class="aiw-input" type="text" placeholder="Pregunta sobre PLA, PETG, capas, infill…" aria-label="Tu pregunta">
      <button class="aiw-send">Enviar</button>
    </form>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  const messagesEl = panel.querySelector('.aiw-messages');
  const input = panel.querySelector('.aiw-input');
  const sendBtn = panel.querySelector('.aiw-send');

  // Estado (persistencia simple)
  let history = [];
  try { history = JSON.parse(localStorage.getItem('aiw_history')||'[]'); } catch {}
  const save = () => localStorage.setItem('aiw_history', JSON.stringify(history.slice(-12)));

  const render = () => {
    messagesEl.innerHTML = '';
    history.forEach(m => {
      const el = document.createElement('div');
      el.className = 'aiw-msg ' + (m.role === 'user' ? 'user' : 'bot');
      el.textContent = m.content;
      messagesEl.appendChild(el);
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };
  render();

  // Abrir/cerrar
  const open = () => { panel.classList.add('is-open'); fab.setAttribute('aria-expanded','true'); input.focus(); };
  const close = () => { panel.classList.remove('is-open'); fab.setAttribute('aria-expanded','false'); };
  fab.addEventListener('click', () => panel.classList.contains('is-open') ? close() : open());
  panel.querySelector('.aiw-close').addEventListener('click', close);

  // Enviar
  const ask = async (text) => {
    const msg = String(text||'').trim();
    if (!msg) return;
    history.push({ role: 'user', content: msg });
    render(); save();
    input.value = ''; input.focus();
    sendBtn.disabled = true;

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          // Enviamos un historial corto al backend
          history: history.slice(-10),
          message: msg
        })
      });
      const data = await res.json();
      const reply = data?.reply || 'Ahora mismo no puedo responder. Vuelve a intentarlo en unos segundos.';
      history.push({ role: 'assistant', content: reply });
    } catch (e) {
      history.push({ role: 'assistant', content: 'Hubo un error de conexión 😅' });
    }
    render(); save();
    sendBtn.disabled = false;
  };

  panel.querySelector('.aiw-form').addEventListener('submit', (e) => {
    e.preventDefault();
    ask(input.value);
  });
})();
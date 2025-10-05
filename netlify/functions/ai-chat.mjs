// netlify/functions/ai-chat.mjs  (ruta final: /.netlify/functions/ai-chat)
export default async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ reply: 'Asistente no configurado (falta OPENAI_API_KEY).' }), {
        headers: { 'content-type': 'application/json' }, status: 200
      });
    }

    const { history = [], message = '' } = await req.json();

    const system = `Eres "Asistente Impriverso3D", experto en impresión 3D FDM.
- Prioriza PLA y PETG. 
- Responde conciso, en español neutro, con pasos y parámetros (altura de capa, temperatura, infill, velocidad, retracción).
- Si te piden compra, sugiere opciones genéricas (sin afiliados). 
- Si falta info, indica qué medir o probar.`;

    // Normaliza historial
    const msgs = [{ role: 'system', content: system }];
    for (const m of history.slice(-10)) {
      if (m?.role && m?.content) msgs.push({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content) });
    }
    msgs.push({ role: 'user', content: String(message) });

    // Llamada a OpenAI (chat completions)
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        messages: msgs
      })
    });

    if (!r.ok) {
      const errText = await r.text();
      return new Response(JSON.stringify({ reply: 'No pude generar respuesta.', error: errText }), {
        headers: { 'content-type': 'application/json' }, status: 200
      });
    }

    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content || '…';
    return new Response(JSON.stringify({ reply }), { headers: { 'content-type': 'application/json' } });

  } catch (e) {
    return new Response(JSON.stringify({ reply: 'Error interno del asistente.', error: String(e) }), {
      headers: { 'content-type': 'application/json' }, status: 200
    });
  }
};

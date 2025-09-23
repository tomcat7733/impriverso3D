export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "content-type": "application/json" } });
  }

  // Netlify env (v2) — fallback a process.env por compatibilidad
  const OPENAI_API_KEY = (globalThis.Netlify?.env?.get?.("OPENAI_API_KEY")) ?? process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY env var" }), { status: 500, headers: { "content-type": "application/json" } });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: { "content-type": "application/json" } });
  }

  const { messages = [], temperature = 0.6, model = "gpt-4o-mini" } = body;

  const systemPrompt = `Eres un agente de soporte experto en IMPRESIÓN 3D CON FILAMENTO (FDM/FFF).
- Responde en español neutral, tono profesional cercano.
- Sé práctico y accionable. Incluye parámetros como altura de capa, temperatura de boquilla y cama, retracciones, velocidades, ventilación, tipo de boquilla, materiales (PLA, PETG, ABS, TPU, Nylon) y marcas comunes.
- Guía sobre calibración (flow, e-steps, PID, bed leveling), problemas (warping, stringing, under/over-extrusion, elephant foot), adhesión, soportes (árbol/normal), infill y patrones, orientación de pieza, tolerancias y postprocesado.
- No inventes especificaciones de máquinas; si faltan datos, pide los mínimos: impresora, material/marca, temperaturas, altura capa, velocidad, ventilador, boquilla y foto si aplica.
- Seguridad: ventilación, emisiones, temperatura, corte de energía y riesgos mecánicos.
- Si la pregunta no es de impresión 3D con filamento, indícalo y redirige brevemente.
`;

  const input = [
    { role: "system", content: systemPrompt },
    ...messages.map(m => ({ role: m.role || "user", content: String(m.content || "") })),
  ];

  try {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({ model, input, temperature })
    });

    if (!r.ok) {
      const text = await r.text();
      return new Response(JSON.stringify({ error: "Upstream error", detail: text }), { status: 502, headers: { "content-type": "application/json" } });
    }
    const data = await r.json();
    const reply = data.output_text ?? (data.output?.[0]?.content?.[0]?.text ?? "");
    return new Response(JSON.stringify({ reply }), { status: 200, headers: { "content-type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Request failed", detail: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
  }
};

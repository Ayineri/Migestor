import { useState, useEffect, useRef } from 'react';

const services = [
{ id: ‘facturas’, icon: ‘💡’, title: ‘Reclamar facturas’, desc: ‘Luz, gas, agua, teléfono… Te ayudo a pagar menos.’, color: ‘#2B7FFF’ },
{ id: ‘citas’, icon: ‘🏥’, title: ‘Pedir cita médica’, desc: ‘Médico, especialista o urgencias. Lo gestiono yo.’, color: ‘#0EA5E9’ },
{ id: ‘ayudas’, icon: ‘🏠’, title: ‘Ayuda a domicilio’, desc: ‘Dependencia, teleasistencia y ayudas del ayuntamiento.’, color: ‘#6366F1’ },
{ id: ‘tramites’, icon: ‘📄’, title: ‘Trámites y papeleos’, desc: ‘Certificados, renovaciones, gestiones oficiales.’, color: ‘#14B8A6’ },
{ id: ‘seguros’, icon: ‘🛡️’, title: ‘Reclamar al seguro’, desc: ‘Siniestros o cobros que no corresponden.’, color: ‘#F59E0B’ },
{ id: ‘compras’, icon: ‘📦’, title: ‘Devoluciones’, desc: ‘Productos defectuosos o pedidos que no llegaron.’, color: ‘#EC4899’ },
];

function ChatScreen({ service, onClose }) {
const [messages, setMessages] = useState([
{
from: ‘bot’,
text: service
? ‘Hola 👋 Cuéntame tu situación con “’ + service.title + ‘” y me pongo con ello.’
: ‘Hola 👋 Soy tu gestor personal. ¿Qué necesitas hoy?’,
},
]);
const [input, setInput] = useState(’’);
const [loading, setLoading] = useState(false);
const bottomRef = useRef(null);

useEffect(() => {
bottomRef.current?.scrollIntoView({ behavior: ‘smooth’ });
}, [messages, loading]);

const systemPrompt = ‘Eres un gestor personal cercano y de confianza que ayuda a personas en España con sus trámites del día a día. Hablas de tú a tú, con palabras sencillas, sin tecnicismos. Eres paciente, empático y práctico. Cuando alguien te cuenta un problema, primero lo escuchas, luego le das pasos concretos y si hace falta redactas cartas o correos listos para enviar. Eres especialista en: reclamar facturas de luz, gas, agua y teléfono; pedir citas médicas; tramitar ayudas a domicilio y dependencia; gestionar papeleos con administraciones; reclamar a seguros; y gestionar devoluciones.’ + (service ? ’ El usuario necesita ayuda con: ’ + service.title + ‘.’ : ‘’);

const send = async () => {
if (!input.trim() || loading) return;
const text = input.trim();
const next = […messages, { from: ‘user’, text }];
setMessages(next);
setInput(’’);
setLoading(true);
try {
const res = await fetch(’/api/chat’, {
method: ‘POST’,
headers: { ‘Content-Type’: ‘application/json’ },
body: JSON.stringify({
systemPrompt,
messages: next.map((m) => ({
role: m.from === ‘bot’ ? ‘assistant’ : ‘user’,
content: m.text,
})),
}),
});
const data = await res.json();
setMessages((p) => […p, { from: ‘bot’, text: data.reply || ‘Ha habido un error, inténtalo de nuevo.’ }]);
} catch (e) {
setMessages((p) => […p, { from: ‘bot’, text: ‘Sin conexión. Inténtalo de nuevo.’ }]);
}
setLoading(false);
};

return (
<div style={{ position: ‘fixed’, inset: 0, background: ‘#F7FAFF’, display: ‘flex’, flexDirection: ‘column’, zIndex: 200 }}>
<style>{`@keyframes blink{0%,80%,100%{opacity:.3}40%{opacity:1}}`}</style>
<div style={{ background: ‘#fff’, borderBottom: ‘1.5px solid #E2EEFF’, padding: ‘14px 18px’, display: ‘flex’, alignItems: ‘center’, gap: 12 }}>
<button onClick={onClose} style={{ background: ‘none’, border: ‘none’, fontSize: 22, cursor: ‘pointer’, color: ‘#3B82F6’, padding: ‘0 4px’, lineHeight: 1 }}>←</button>
<div style={{ width: 40, height: 40, borderRadius: 50, background: ‘#DBEAFE’, display: ‘flex’, alignItems: ‘center’, justifyContent: ‘center’, fontSize: 20 }}>
{service ? service.icon : ‘🤝’}
</div>
<div>
<div style={{ fontFamily: ‘Georgia, serif’, fontWeight: 700, fontSize: 16, color: ‘#1a2e4a’, lineHeight: 1.2 }}>
{service ? service.title : ‘Tu gestor’}
</div>
<div style={{ fontSize: 11, color: ‘#60A5FA’, fontWeight: 600, display: ‘flex’, alignItems: ‘center’, gap: 4 }}>
<span style={{ width: 6, height: 6, borderRadius: ‘50%’, background: ‘#34D399’, display: ‘inline-block’ }} />
En línea ahora
</div>
</div>
</div>

```
  <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px 12px', display: 'flex', flexDirection: 'column', gap: 16 }}>
    {messages.map((m, i) => (
      <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start', gap: 10, alignItems: 'flex-end' }}>
        {m.from === 'bot' && (
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, marginBottom: 2 }}>🤝</div>
        )}
        <div style={{
          maxWidth: '75%', padding: '13px 16px',
          borderRadius: m.from === 'user' ? '18px 6px 18px 18px' : '6px 18px 18px 18px',
          background: m.from === 'user' ? '#2B7FFF' : '#fff',
          color: m.from === 'user' ? '#fff' : '#1a2e4a',
          fontSize: 15, lineHeight: 1.7, fontFamily: 'system-ui, sans-serif', fontWeight: 500,
          boxShadow: m.from === 'user' ? '0 4px 14px rgba(43,127,255,0.28)' : '0 2px 10px rgba(0,0,0,0.07)',
          whiteSpace: 'pre-wrap',
        }}>
          {m.text}
        </div>
      </div>
    ))}
    {loading && (
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤝</div>
        <div style={{ background: '#fff', borderRadius: '6px 18px 18px 18px', padding: '14px 18px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', display: 'flex', gap: 5, alignItems: 'center' }}>
          {[0,1,2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#93C5FD', display: 'inline-block', animation: 'blink 1.2s ' + (i*0.2) + 's infinite' }} />)}
        </div>
      </div>
    )}
    <div ref={bottomRef} />
  </div>

  <div style={{ background: '#fff', borderTop: '1.5px solid #E2EEFF', padding: '12px 14px 30px', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
    <textarea
      value={input}
      onChange={e => setInput(e.target.value)}
      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
      placeholder='Escribe aquí...'
      rows={2}
      style={{ flex: 1, background: '#F0F6FF', border: '1.5px solid #BFDBFE', borderRadius: 14, color: '#1a2e4a', padding: '11px 14px', fontSize: 15, fontFamily: 'system-ui, sans-serif', fontWeight: 500, resize: 'none', outline: 'none', lineHeight: 1.5 }}
    />
    <button onClick={send} disabled={!input.trim() || loading} style={{ width: 48, height: 48, borderRadius: 14, background: input.trim() && !loading ? '#2B7FFF' : '#BFDBFE', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', flexShrink: 0, transition: 'background .2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      ↑
    </button>
  </div>
</div>
```

);
}

export default function App() {
const [chat, setChat] = useState(null);
const [chatOpen, setChatOpen] = useState(false);
const [ready, setReady] = useState(false);

useEffect(() => { setTimeout(() => setReady(true), 80); }, []);

const open = (s) => { setChat(s || null); setChatOpen(true); };

return (
<div style={{ minHeight: ‘100vh’, background: ‘#F7FAFF’, fontFamily: ‘system-ui, sans-serif’, color: ‘#1a2e4a’ }}>
<style>{`*{box-sizing:border-box;margin:0;padding:0} @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}} .scard{transition:transform .18s,box-shadow .18s;cursor:pointer} .scard:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(43,127,255,.13)!important} textarea:focus{border-color:#93C5FD!important;background:#fff!important;outline:none} textarea::placeholder{color:#BFDBFE} ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:#BFDBFE;border-radius:4px}`}</style>

```
  {chatOpen && <ChatScreen service={chat} onClose={() => setChatOpen(false)} />}

  <nav style={{ background: '#fff', borderBottom: '1.5px solid #E2EEFF', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 38, height: 38, borderRadius: 12, background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, animation: 'float 3s ease-in-out infinite' }}>🤝</div>
      <span style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 19, color: '#1a2e4a' }}>MiGestor</span>
    </div>
    <button onClick={() => open(null)} style={{ background: '#2B7FFF', border: 'none', color: '#fff', padding: '9px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'system-ui, sans-serif', boxShadow: '0 4px 12px rgba(43,127,255,.3)' }}>
      Pedir ayuda
    </button>
  </nav>

  <section style={{ padding: '48px 22px 36px', maxWidth: 580, margin: '0 auto', textAlign: 'center', opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(18px)', transition: 'all .55s ease' }}>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: 100, padding: '6px 16px', marginBottom: 26, fontSize: 13, color: '#3B82F6', fontWeight: 700 }}>
      <span>💙</span> Como tener a alguien de confianza siempre disponible
    </div>
    <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 8vw, 52px)', fontWeight: 700, lineHeight: 1.2, color: '#1a2e4a', marginBottom: 18 }}>
      El gestor personal<br />
      <em style={{ color: '#2B7FFF', fontStyle: 'italic' }}>que siempre quisiste</em>
    </h1>
    <p style={{ fontSize: 16, color: '#4B7BB5', lineHeight: 1.85, marginBottom: 34, fontWeight: 500, maxWidth: 440, margin: '0 auto 34px' }}>
      Reclamaciones, citas médicas, ayudas, trámites... Todo lo que un hijo atento haría por ti — sin esperas, sin agobios, a cualquier hora.
    </p>
    <button onClick={() => open(null)} style={{ background: '#2B7FFF', border: 'none', color: '#fff', padding: '17px 38px', borderRadius: 16, fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 22px rgba(43,127,255,.38)', fontFamily: 'system-ui, sans-serif' }}>
      Hablar con mi gestor →
    </button>
    <p style={{ marginTop: 12, fontSize: 12, color: '#93C5FD', fontWeight: 600 }}>Sin registro · Gratis · Respuesta inmediata</p>
  </section>

  <div style={{ textAlign: 'center', color: '#BFDBFE', fontSize: 22, letterSpacing: 8, marginBottom: 28 }}>· · ·</div>

  <section style={{ padding: '0 14px 28px', maxWidth: 660, margin: '0 auto' }}>
    <p style={{ textAlign: 'center', fontSize: 12, color: '#93C5FD', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 18 }}>¿En qué puedo ayudarte?</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 11 }}>
      {services.map((s, i) => (
        <button key={s.id} className='scard' onClick={() => open(s)}
          style={{ background: '#fff', border: '1.5px solid #E2EEFF', borderRadius: 18, padding: '18px 14px', textAlign: 'left', boxShadow: '0 2px 10px rgba(43,127,255,.06)', opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(14px)', transition: 'opacity .45s ' + (.08 + i*.06) + 's ease, transform .45s ' + (.08 + i*.06) + 's ease, box-shadow .18s' }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: s.color + '16', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 11 }}>{s.icon}</div>
          <div style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 14, color: '#1a2e4a', marginBottom: 5, lineHeight: 1.3 }}>{s.title}</div>
          <div style={{ fontSize: 12, color: '#6B9ED2', lineHeight: 1.6, fontWeight: 500 }}>{s.desc}</div>
        </button>
      ))}
    </div>
  </section>

  <section style={{ background: '#fff', margin: '0 14px 22px', borderRadius: 22, padding: '26px 20px', maxWidth: 632, marginLeft: 'auto', marginRight: 'auto', border: '1.5px solid #E2EEFF', boxShadow: '0 2px 14px rgba(43,127,255,.06)' }}>
    <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 20, textAlign: 'center', marginBottom: 24, color: '#1a2e4a' }}>Así de fácil</h2>
    {[
      { emoji: '💬', step: 'Cuéntame', text: 'Explícame tu situación como lo harías a un familiar, sin tecnicismos.' },
      { emoji: '🔎', step: 'Analizo', text: 'Reviso tu caso y te digo exactamente qué podemos hacer.' },
      { emoji: '✅', step: 'Resolvemos', text: 'Te doy los pasos, cartas o llamadas que necesitas. Juntos lo solucionamos.' },
    ].map((s, i) => (
      <div key={i} style={{ display: 'flex', gap: 14, marginBottom: i < 2 ? 20 : 0, alignItems: 'flex-start' }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{s.emoji}</div>
        <div style={{ paddingTop: 2 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 15, color: '#2B7FFF', marginBottom: 3 }}>{s.step}</div>
          <div style={{ fontSize: 14, color: '#4B7BB5', lineHeight: 1.65, fontWeight: 500 }}>{s.text}</div>
        </div>
      </div>
    ))}
  </section>

  <section style={{ padding: '0 14px 110px', maxWidth: 660, margin: '0 auto' }}>
    <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 18, textAlign: 'center', marginBottom: 16, color: '#1a2e4a' }}>Quienes ya lo usan</h2>
    {[
      { avatar: '👵', name: 'Carmen, 71 años', location: 'Sevilla', text: 'Ahorré 340 euros al año en el gas. Solo tuve que contarle el problema, fue muy sencillo.' },
      { avatar: '👨', name: 'Marcos, 45 años', location: 'Madrid', text: 'En 3 días tenía cita con el especialista. Llevaba semanas sin conseguirla por mi cuenta.' },
      { avatar: '👩', name: 'Lola, 58 años', location: 'Valencia', text: 'Me ayudó a tramitar la ayuda a domicilio para mi madre. Nunca lo habría logrado sola.' },
    ].map((t, i) => (
      <div key={i} style={{ background: '#fff', border: '1.5px solid #E2EEFF', borderRadius: 18, padding: '16px', marginBottom: 11, display: 'flex', gap: 14, boxShadow: '0 2px 10px rgba(43,127,255,.05)' }}>
        <div style={{ fontSize: 38, flexShrink: 0, lineHeight: 1 }}>{t.avatar}</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 5 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 14, color: '#1a2e4a' }}>{t.name}</span>
            <span style={{ fontSize: 11, color: '#93C5FD', fontWeight: 600 }}>{t.location}</span>
          </div>
          <div style={{ fontSize: 13, color: '#4B7BB5', lineHeight: 1.7, fontStyle: 'italic', fontWeight: 500 }}>"{t.text}"</div>
        </div>
      </div>
    ))}
  </section>

  <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '10px 14px 26px', background: 'linear-gradient(to top, #F7FAFF 65%, transparent)', textAlign: 'center' }}>
    <button onClick={() => open(null)} style={{ background: '#2B7FFF', border: 'none', color: '#fff', padding: '16px 28px', borderRadius: 16, fontSize: 15, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 22px rgba(43,127,255,.38)', width: '100%', maxWidth: 420, fontFamily: 'system-ui, sans-serif' }}>
      🤝 Hablar con mi gestor
    </button>
  </div>
</div>
```

);
}

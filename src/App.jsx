import { useState } from "react";

const services = [
  {
    id: "reclamaciones",
    icon: "⚡",
    title: "Reclamar facturas",
    desc: "Abarata tus facturas de luz, gas, agua o teléfono reclamando a las compañías",
    color: "#FF6B35",
    tag: "Ahorro garantizado",
  },
  {
    id: "citas",
    icon: "🏥",
    title: "Pedir cita médica",
    desc: "Solicito citas con tu médico de cabecera, especialistas o centros de salud",
    color: "#2EC4B6",
    tag: "Sanidad pública y privada",
  },
  {
    id: "ayudas",
    icon: "🏠",
    title: "Ayuda a domicilio",
    desc: "Tramito ayudas del ayuntamiento, dependencia, teleasistencia y servicios sociales",
    color: "#9B5DE5",
    tag: "Servicios sociales",
  },
  {
    id: "burocracia",
    icon: "📋",
    title: "Trámites y papeleos",
    desc: "Gestiono documentos, renovaciones, certificados y trámites con administraciones",
    color: "#F15BB5",
    tag: "Sin esperas ni colas",
  },
  {
    id: "seguros",
    icon: "🛡️",
    title: "Reclamar al seguro",
    desc: "Presento reclamaciones a compañías de seguro por siniestros, retrasos o cobros indebidos",
    color: "#00BBF9",
    tag: "Defensa del consumidor",
  },
  {
    id: "compras",
    icon: "🛒",
    title: "Compras y devoluciones",
    desc: "Hago pedidos online, gestiono devoluciones y reclamo productos defectuosos",
    color: "#FEE440",
    textDark: true,
    tag: "E-commerce y tiendas",
  },
];

const steps = [
  { n: "1", text: "Cuéntame qué necesitas en un mensaje sencillo" },
  { n: "2", text: "Analizo tu caso y te digo exactamente qué puedo hacer" },
  { n: "3", text: "Tú apruebas y yo me encargo de todo lo demás" },
];

const testimonials = [
  {
    name: "Carmen, 71 años",
    text: "Me ahorró 340€ al año en la factura del gas. Solo tuve que decirle el problema.",
    avatar: "👵",
  },
  {
    name: "Marcos, 45 años",
    text: "Consiguió cita con el especialista en 3 días. Yo llevaba semanas intentándolo.",
    avatar: "👨",
  },
  {
    name: "Lola, 58 años",
    text: "Tramitó la ayuda a domicilio para mi madre. Sin él nunca lo habría conseguido.",
    avatar: "👩",
  },
];

const AIChat = ({ service, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: service
        ? `Hola, voy a ayudarte con "${service.title}". Cuéntame tu situación con el mayor detalle posible y me encargo de todo. 😊`
        : "Hola, soy tu gestor personal. ¿En qué puedo ayudarte hoy? Puedo reclamar facturas, pedir citas médicas, tramitar ayudas y mucho más.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const systemPrompt = `Eres MiGestor, un asistente personal amable y empático que ayuda a personas con trámites cotidianos en España.
Tu especialidad es: reclamar facturas de luz/gas/agua/teléfono para abaratar costes, pedir citas médicas (médico de cabecera, especialistas), tramitar ayudas a domicilio y dependencia, gestionar papeleos con administraciones públicas, reclamar a compañías de seguros, y gestionar compras y devoluciones.
Habla en español, de forma cercana y sencilla. Cuando el usuario te explique su problema, analízalo, haz preguntas si necesitas más información, y proporciona un plan de acción claro con pasos concretos. Si puedes, redacta borradores de cartas o emails de reclamación. Sé proactivo y tranquilizador — tu objetivo es que el usuario sienta que tiene a alguien de confianza gestionando sus problemas.${
    service ? ` El usuario quiere ayuda específicamente con: ${service.title} - ${service.desc}` : ""
  }`;

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text,
      }));

      // Calls our own backend — API key stays safe on the server
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, systemPrompt }),
      });

      const data = await res.json();
      const reply = data.reply || "Lo siento, hubo un error. Inténtalo de nuevo.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Hubo un problema de conexión. Por favor, inténtalo de nuevo." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          background: "#0F0F1A",
          width: "100%",
          maxWidth: 560,
          borderRadius: "24px 24px 0 0",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
          borderBottom: "none",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            background: service ? service.color + "22" : "transparent",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: service ? service.color : "#FF6B35",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            {service ? service.icon : "🤝"}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {service ? service.title : "MiGestor"}
            </div>
            <div style={{ color: "#aaa", fontSize: 12 }}>Tu gestor personal · Online ahora</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#fff",
              width: 36,
              height: 36,
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}
            >
              <div
                style={{
                  maxWidth: "82%",
                  padding: "12px 16px",
                  borderRadius:
                    m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background:
                    m.role === "user"
                      ? service
                        ? service.color
                        : "#FF6B35"
                      : "rgba(255,255,255,0.08)",
                  color: "#fff",
                  fontSize: 14,
                  lineHeight: 1.55,
                  fontFamily: "'DM Sans', sans-serif",
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 6, padding: "10px 16px" }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: service ? service.color : "#FF6B35",
                    animation: `bounce 1s ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div
          style={{
            padding: "12px 16px 20px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            gap: 10,
            alignItems: "flex-end",
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Escribe tu consulta aquí..."
            rows={2}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 14,
              color: "#fff",
              padding: "12px 14px",
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              resize: "none",
              outline: "none",
              lineHeight: 1.5,
            }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            style={{
              background: service ? service.color : "#FF6B35",
              border: "none",
              borderRadius: 14,
              width: 48,
              height: 48,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              opacity: loading || !input.trim() ? 0.5 : 1,
              fontSize: 20,
              flexShrink: 0,
              color: "#fff",
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [chat, setChat] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  const openService = (service) => {
    setChat(service);
    setChatOpen(true);
  };
  const openGeneral = () => {
    setChat(null);
    setChatOpen(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07070F",
        fontFamily: "'DM Sans', sans-serif",
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .card-hover { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
        .btn-main:hover { filter: brightness(1.1); transform: scale(1.02); }
        .btn-main { transition: all 0.2s; }
        textarea::placeholder { color: #555; }
        textarea:focus { border-color: rgba(255,107,53,0.5) !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
      `}</style>

      {/* Hero */}
      <div
        style={{
          padding: "60px 24px 48px",
          textAlign: "center",
          maxWidth: 640,
          margin: "0 auto",
          animation: "fadeUp 0.6s ease forwards",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,107,53,0.12)",
            border: "1px solid rgba(255,107,53,0.25)",
            borderRadius: 100,
            padding: "6px 16px",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#FF6B35",
              display: "inline-block",
              animation: "pulse 2s infinite",
            }}
          />
          <span style={{ fontSize: 13, color: "#FF6B35", fontWeight: 500 }}>
            Disponible ahora · Respuesta en segundos
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(38px, 8vw, 60px)",
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          Tu gestor personal,
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #FF6B35, #F15BB5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            siempre disponible
          </span>
        </h1>

        <p
          style={{
            fontSize: 17,
            color: "#aaa",
            lineHeight: 1.7,
            marginBottom: 36,
            fontWeight: 300,
          }}
        >
          Todo lo que haría un hijo atento por ti — reclamar facturas, pedir citas médicas,
          tramitar ayudas — pero disponible las 24 horas, sin esperas.
        </p>

        <button
          className="btn-main"
          onClick={openGeneral}
          style={{
            background: "linear-gradient(135deg, #FF6B35, #F15BB5)",
            border: "none",
            color: "#fff",
            padding: "16px 36px",
            borderRadius: 16,
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(255,107,53,0.35)",
          }}
        >
          Empieza gratis ahora →
        </button>

        <p style={{ marginTop: 14, fontSize: 13, color: "#555" }}>
          Sin registro · Sin tarjeta · Inmediato
        </p>
      </div>

      {/* Services Grid */}
      <div style={{ padding: "0 16px 20px", maxWidth: 700, margin: "0 auto" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: 13,
            color: "#555",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: 3,
            marginBottom: 24,
          }}
        >
          ¿Qué puedo hacer por ti?
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {services.map((s) => (
            <button
              key={s.id}
              className="card-hover"
              onClick={() => openService(s)}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: "20px 16px",
                textAlign: "left",
                cursor: "pointer",
                color: "#fff",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 80,
                  height: 80,
                  background: s.color + "15",
                  borderRadius: "0 20px 0 80px",
                }}
              />
              <div
                style={{
                  fontSize: 28,
                  marginBottom: 10,
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: s.color + "20",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {s.icon}
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  marginBottom: 6,
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                {s.title}
              </div>
              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5, marginBottom: 10 }}>
                {s.desc}
              </div>
              <div
                style={{
                  display: "inline-block",
                  background: s.color + "20",
                  color: s.color,
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 100,
                }}
              >
                {s.tag}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: "40px 24px", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, marginBottom: 32 }}>
          Así de sencillo
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                textAlign: "left",
                animation: `fadeUp 0.5s ${i * 0.1}s ease both`,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #FF6B35, #F15BB5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                {s.n}
              </div>
              <div style={{ paddingTop: 6, fontSize: 15, color: "#ccc", lineHeight: 1.6 }}>
                {s.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ padding: "20px 16px 100px", maxWidth: 700, margin: "0 auto" }}>
        <h2
          style={{
            textAlign: "center",
            fontFamily: "'Playfair Display', serif",
            fontSize: 22,
            marginBottom: 24,
          }}
        >
          Lo que dicen nuestros usuarios
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 12,
          }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 18,
                padding: "18px 16px",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{t.avatar}</div>
              <div
                style={{
                  fontSize: 13,
                  color: "#ccc",
                  lineHeight: 1.6,
                  marginBottom: 10,
                  fontStyle: "italic",
                }}
              >
                "{t.text}"
              </div>
              <div style={{ fontSize: 12, color: "#FF6B35", fontWeight: 600 }}>{t.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 16px 24px",
          background: "linear-gradient(to top, #07070F 60%, transparent)",
          textAlign: "center",
        }}
      >
        <button
          className="btn-main"
          onClick={openGeneral}
          style={{
            background: "linear-gradient(135deg, #FF6B35, #F15BB5)",
            border: "none",
            color: "#fff",
            padding: "14px 32px",
            borderRadius: 16,
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(255,107,53,0.4)",
            width: "100%",
            maxWidth: 400,
          }}
        >
          🤝 Hablar con mi gestor
        </button>
      </div>

      {/* Chat Modal */}
      {chatOpen && <AIChat service={chat} onClose={() => setChatOpen(false)} />}
    </div>
  );
}

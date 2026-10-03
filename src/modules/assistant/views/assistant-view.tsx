"use client";

import { useState } from "react";
import { Sparkles, Store, MapPin, CalendarDays, Gift, BriefcaseBusiness, Package, ChevronRight, ArrowRight, Plus, Send, Volume2 } from "lucide-react";
import { useStore } from "@/providers/store-provider";
import { useSaved } from "@/hooks/use-saved";

export function AssistantView({
  go,
  setMapView,
}: {
  go: (tab: string) => void;
  setMapView: (val: boolean) => void;
}) {
  const { profile, notify } = useStore();
  const [messages, setMessages] = useSaved<{ role: string; text: string }[]>("paseo-chat-v1", []);
  const [chatInput, setChatInput] = useState("");
  const [chatLanguage, setChatLanguage] = useState("Español");

  const askJarvis = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setChatInput("");
    setTimeout(() => {
      let reply = "No estoy seguro, pero en Paseo Aranjuez siempre hay algo por descubrir.";
      const t = text.toLowerCase();
      if (t.includes("regalo") || t.includes("comprar"))
        reply = "Te sugiero revisar PaseoYa. Tienen opciones excelentes para regalar o darte un gusto.";
      else if (t.includes("café"))
        reply = "Cayenna Bistro Café y Roaster tienen opciones deliciosas en la planta baja y cuarto piso.";
      else if (t.includes("evento"))
        reply = "Hay música en vivo y talleres de arte este fin de semana. ¿Te muestro la agenda?";
      else if (t.includes("puma"))
        reply = "PUMA está en el primer piso. Puedes verlo en el mapa interactivo.";
      else if (t.includes("puntos"))
        reply = "Tus Paseo Points sirven para canjear cafés, descuentos y experiencias.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    }, 600);
  };

  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">JARVIS PASEO · ASISTENTE</span>
        <h2>Tu Paseo, con un poco de magia.</h2>
        <p>Encuentra lo que necesitas, descubre algo nuevo y deja que el plan empiece aquí.</p>
      </div>
      <div className="chat-layout">
        <div className="chat-card">
          <div className="chat-header">
            <span className="jarvis-orb">
              <Sparkles size={23} />
            </span>
            <div>
              <strong>Jarvis Paseo</strong>
              <small>
                <span className="green-dot" />
                Asistente de demostración
              </small>
            </div>
            <select
              aria-label="Idioma del asistente"
              value={chatLanguage}
              onChange={(e) => setChatLanguage(e.target.value)}
            >
              <option>Español</option>
              <option>English</option>
            </select>
            <button
              className="button icon-button"
              aria-label="Nueva conversación"
              onClick={() => {
                setMessages([]);
                notify("Nueva conversación iniciada.");
              }}
            >
              <Plus size={20} />
            </button>
          </div>
          <div
            className="chat-messages"
            ref={(element) => {
              if (element) element.scrollTop = element.scrollHeight;
            }}
          >
            <div className="chat-welcome">
              <Sparkles size={35} />
              <h3>Hola, {profile.name}. ¿Qué hacemos hoy?</h3>
              <p>
                Un regalo especial, tu café favorito o un plan distinto.<br />
                Estoy aquí para ayudarte a encontrarlo.
              </p>
            </div>
            {messages.map((m, i) => (
              <div className={`chat-message ${m.role}`} key={i}>
                {m.role === "assistant" && <Sparkles size={17} />}
                <div>
                  <p>{m.text}</p>
                  {m.role === "assistant" && (
                    <div className="chat-response-actions">
                      <button className="button small-link" onClick={() => go("PaseoYa")}>
                        Ver productos <ArrowRight size={13} />
                      </button>
                      <button className="button small-link" onClick={() => {
                        go("Explorar el Paseo");
                        setMapView(true);
                      }}>
                        Ver mapa <MapPin size={13} />
                      </button>
                      <button
                        className="button icon-button"
                        aria-label="Escuchar respuesta"
                        onClick={() => {
                          if (!("speechSynthesis" in window))
                            return notify("Tu navegador no admite lectura por voz.");
                          const speech = new SpeechSynthesisUtterance(m.text);
                          speech.lang = chatLanguage === "English" ? "en-US" : "es-BO";
                          window.speechSynthesis.speak(speech);
                        }}
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="chat-suggestions">
            {["Busco un regalo", "Quiero un café", "¿Qué eventos hay?", "¿Y mis puntos?"].map((q) => (
              <button key={q} className="button" onClick={() => askJarvis(q)}>
                {q}
              </button>
            ))}
          </div>
          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              askJarvis(chatInput);
            }}
          >
            <input
              placeholder="Cuéntame, ¿qué te gustaría hacer?"
              aria-label="Mensaje para Jarvis"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button
              className="button primary icon-button"
              type="submit"
              aria-label="Enviar mensaje"
              disabled={!chatInput.trim()}
            >
              <Send size={18} />
            </button>
          </form>
          <p className="chat-disclaimer">
            Respuestas basadas en reglas y datos de ejemplo. Sin conexión a una IA o información en tiempo real.
          </p>
        </div>
        <div className="jarvis-side">
          <div className="white-card">
            <span className="eyebrow">UN ASISTENTE, TODO EL PASEO</span>
            <h3>¿En qué puedo ayudarte?</h3>
            {[
              { icon: Store, text: "Tiendas, productos y servicios", query: "Busco un regalo" },
              { icon: MapPin, text: "Ubicaciones y mapa", query: "¿Dónde está PUMA?" },
              { icon: CalendarDays, text: "Eventos y actividades", query: "¿Qué eventos hay?" },
              { icon: Gift, text: "Promociones y beneficios", query: "¿Qué promociones hay?" },
              { icon: BriefcaseBusiness, text: "Oficinas y cowork", query: "Necesito una oficina" },
              { icon: Package, text: "Mis pedidos y retiros", query: "¿Cómo va mi pedido?" },
            ].map((a) => (
              <button className="button jarvis-help" key={a.text} onClick={() => askJarvis(a.query)}>
                <a.icon size={18} />
                {a.text}
                <ChevronRight size={14} />
              </button>
            ))}
          </div>
          <div className="integration-card">
            <Sparkles size={23} />
            <h3>Todo se conecta</h3>
            <p>
              Jarvis encuentra tu plan.<br />
              PaseoYa hace posible tu compra.<br />
              Paseo Points premia tu visita.
            </p>
            <div className="tags">
              <span>Jarvis</span>
              <ArrowRight size={13} />
              <span>PaseoYa</span>
              <ArrowRight size={13} />
              <span>Points</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import GlobalCityBg from "@/components/GlobalCityBg";
import { getMensagens, setMensagens as setMensagensDB, onMensagensChange } from "@/lib/db";

const K = "#f0a0d0";
const T = "#48c0b8";

type Msg = { author: string; role: "cliente" | "admin"; text: string; date: string; time: string };

const inputStyle = {
  width: "100%",
  background: "rgba(8,7,20,0.92)",
  border: "2px solid rgba(208,88,160,0.4)",
  color: "#f0ebfa",
  fontFamily: "'VT323', monospace",
  fontSize: 18,
  padding: "10px 14px",
  outline: "none",
  boxSizing: "border-box" as const,
  transition: "border-color 0.2s",
  resize: "none" as const,
};

export default function MensagensPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [chatEmail, setChatEmail] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  const messagesInitRef = useRef(false);
  const skipNextSync = useRef(false);

  useEffect(() => {
    const raw = localStorage.getItem("pigeonz_user");
    if (!raw) { router.push("/login"); return; }
    const parsed = JSON.parse(raw);
    setUser(parsed);

    // Admin chats on the client's document; client/parceiro uses their own
    const isAdm = parsed.role === "admin";
    const manage = localStorage.getItem("pigeonz_admin_manage");
    const targetEmail = isAdm && manage ? manage : parsed.email;
    setChatEmail(targetEmail);

    // Load from Firestore + real-time listener
    getMensagens(targetEmail).then(items => {
      setMessages(items as Msg[]);
      messagesInitRef.current = true;
    });

    const unsub = onMensagensChange(targetEmail, items => {
      if (skipNextSync.current) { skipNextSync.current = false; return; }
      setMessages(items as Msg[]);
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!user || !messagesInitRef.current || !chatEmail) return;
    skipNextSync.current = true;
    setMensagensDB(chatEmail, messages);
  }, [messages, user, chatEmail]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMsg = () => {
    if (!newMsg.trim() || !user) return;
    const now = new Date();
    setMessages(prev => [...prev, {
      author: user.name,
      role: user.role as "cliente" | "admin",
      text: newMsg.trim(),
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().slice(0, 5),
    }]);
    setNewMsg("");
  };

  const isAdmin = user?.role === "admin";

  if (!user) return null;

  return (
    <>
    <GlobalCityBg />
    <div style={{
      minHeight: "100vh",
      background: "transparent",
      padding: "60px 24px", paddingTop: 48,
      position: "relative",
      zIndex: 1,
    }}>
      <div style={{ maxWidth: 700, margin: "0 auto", marginBottom: 32 }}>
        <a
          onClick={() => router.push(isAdmin ? "/admin" : "/painel")}
          style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000", cursor: "pointer" }}
        >
          &larr; Voltar ao painel
        </a>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(12px, 2.5vw, 18px)",
          color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000",
          margin: "0 0 24px",
          lineHeight: 1.6,
        }}>
          Mensagens
        </h1>

        <div className="pixel-box" style={{
          background: "rgba(10,8,20,0.95)",
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 240px)",
          minHeight: 400,
        }}>
          {/* Chat messages */}
          <div
            ref={chatRef}
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginBottom: 16,
              paddingRight: 4,
            }}
          >
            {messages.length === 0 && (
              <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#6b5c85", textAlign: "center", marginTop: 40 }}>
                Nenhuma mensagem ainda. Comece a conversa!
              </p>
            )}
            {messages.map((m, i) => {
              const isMe = m.role === user.role;
              return (
                <div key={i} style={{
                  alignSelf: isMe ? "flex-end" : "flex-start",
                  maxWidth: "75%",
                }}>
                  <div style={{
                    padding: "10px 14px",
                    background: isMe
                      ? (m.role === "admin" ? "rgba(72,192,184,0.15)" : "rgba(240,160,208,0.15)")
                      : "rgba(96,64,160,0.15)",
                    borderLeft: isMe ? "none" : `3px solid ${m.role === "admin" ? T : K}`,
                    borderRight: isMe ? `3px solid ${m.role === "admin" ? T : K}` : "none",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
                      <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: m.role === "admin" ? T : K }}>
                        {m.role === "admin" ? "Desenvolvedor(a)" : m.author}
                      </span>
                      <span style={{ fontFamily: "'VT323', monospace", fontSize: 13, color: "#6b5c85", whiteSpace: "nowrap" }}>
                        {m.time}
                      </span>
                    </div>
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#c8b8e0", margin: 0, lineHeight: 1.4 }}>
                      {m.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div style={{ display: "flex", gap: 10 }}>
            <textarea
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              placeholder="Digite sua mensagem..."
              rows={2}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = K}
              onBlur={e => e.target.style.borderColor = "rgba(208,88,160,0.4)"}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
            />
            <button
              onClick={sendMsg}
              style={{
                fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                padding: "10px 16px", color: K, border: `2px solid ${K}`,
                background: "rgba(240,160,208,0.1)", cursor: "pointer",
                whiteSpace: "nowrap", alignSelf: "flex-end", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(240,160,208,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(240,160,208,0.1)"; }}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

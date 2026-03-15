"use client";
import { useEffect, useState, useRef } from "react";
import { getProjectChat, setProjectChat, onProjectChatChange } from "@/lib/db";

const K = "#f0a0d0";

const STEPS = [
  "Plano",
  "Pagamento",
  "Briefing",
  "Proposta",
  "Domínio",
  "Desenvolvimento",
  "Aprovação",
  "Produção",
  "Entregue",
  "Geral",
];

type ChatMsg = {
  author: string;
  role: string;
  text: string;
  step: string;
  descricao?: string;
  time: string;
  date: string;
};

type Props = {
  projectKey: string;
  userName: string;
  userRole: string;
};

export default function ProjectChat({ projectKey, userName, userRole }: Props) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [showStepPicker, setShowStepPicker] = useState(false);
  const [pendingMsg, setPendingMsg] = useState("");
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [descricao, setDescricao] = useState("");
  const [unread, setUnread] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);
  const skipSync = useRef(false);
  const lastCount = useRef(0);

  useEffect(() => {
    if (!projectKey) return;
    getProjectChat(projectKey).then(data => {
      const d = data as ChatMsg[];
      setMsgs(d);
      lastCount.current = d.length;
    });

    const unsub = onProjectChatChange(projectKey, data => {
      if (skipSync.current) { skipSync.current = false; return; }
      const d = data as ChatMsg[];
      setMsgs(d);
      if (!open && d.length > lastCount.current) {
        setUnread(prev => prev + (d.length - lastCount.current));
      }
      lastCount.current = d.length;
    });
    return () => unsub();
  }, [projectKey, open]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs, open]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  /* User clicks send → save text, show step picker */
  const handleSend = () => {
    if (!newMsg.trim() || !projectKey) return;
    setPendingMsg(newMsg.trim());
    setNewMsg("");
    setShowStepPicker(true);
  };

  /* User selected step and optionally wrote description → send */
  const confirmSend = () => {
    if (!pendingMsg || !projectKey || !selectedStep) return;
    const now = new Date();
    const msg: ChatMsg = {
      author: userName,
      role: userRole,
      text: pendingMsg,
      step: selectedStep,
      descricao: descricao.trim() || undefined,
      time: now.toTimeString().slice(0, 5),
      date: now.toISOString().split("T")[0],
    };
    const updated = [...msgs, msg];
    setMsgs(updated);
    setPendingMsg("");
    setSelectedStep(null);
    setDescricao("");
    setShowStepPicker(false);
    skipSync.current = true;
    setProjectChat(projectKey, updated);
  };

  const cancelSend = () => {
    setNewMsg(pendingMsg);
    setPendingMsg("");
    setSelectedStep(null);
    setDescricao("");
    setShowStepPicker(false);
  };

  return (
    <>
      {/* Floating bubble — bottom LEFT */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: 24,
            left: 24,
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${K}, #e870b0)`,
            border: "none",
            cursor: "pointer",
            boxShadow: `0 4px 20px rgba(240,160,208,0.4), 0 0 40px rgba(240,160,208,0.2)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9998,
            transition: "transform 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#1c1030" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {unread > 0 && (
            <span style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "#ff4060",
              color: "#fff",
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 8,
              width: 22,
              height: 22,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(255,64,96,0.5)",
            }}>
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed",
          bottom: 24,
          left: 24,
          width: 380,
          maxWidth: "calc(100vw - 32px)",
          height: 520,
          maxHeight: "calc(100vh - 48px)",
          background: "rgba(10,8,20,0.98)",
          border: `2px solid ${K}44`,
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          zIndex: 9998,
          boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 30px rgba(240,160,208,0.15)`,
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            padding: "12px 16px",
            background: `linear-gradient(135deg, rgba(240,160,208,0.15), rgba(240,160,208,0.05))`,
            borderBottom: `1px solid ${K}33`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: `linear-gradient(135deg, ${K}, #e870b0)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#1c1030" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: K, display: "block" }}>
                  Chat do Projeto
                </span>
                <span style={{ fontFamily: "'VT323', monospace", fontSize: 13, color: "#8878a8" }}>
                  {msgs.length} mensagens
                </span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                color: "#8878a8", fontSize: 20, padding: 4,
                fontFamily: "'VT323', monospace",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#ff6060"}
              onMouseLeave={e => e.currentTarget.style.color = "#8878a8"}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            ref={chatRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {msgs.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 16px" }}>
                <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#6b5c85", margin: 0 }}>
                  Nenhuma mensagem ainda.
                </p>
              </div>
            )}
            {msgs.map((m, i) => {
              const isMe = m.role === userRole;
              return (
                <div key={i} style={{
                  alignSelf: isMe ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                }}>
                  {!isMe && (
                    <span style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 6,
                      color: K,
                      display: "block",
                      marginBottom: 3,
                      marginLeft: 4,
                    }}>
                      {m.author}
                    </span>
                  )}
                  {/* Step badge */}
                  <span style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 5,
                    color: "#8878a8",
                    background: "rgba(136,120,168,0.1)",
                    padding: "2px 6px",
                    display: "inline-block",
                    marginBottom: 3,
                    marginLeft: isMe ? 0 : 4,
                    letterSpacing: 0.5,
                  }}>
                    {m.step}
                  </span>
                  <div style={{
                    background: isMe
                      ? `linear-gradient(135deg, ${K}22, ${K}11)`
                      : `rgba(136,120,168,0.1)`,
                    border: `1px solid ${isMe ? K + "33" : "#8878a822"}`,
                    borderRadius: isMe ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                    padding: "8px 12px",
                  }}>
                    <p style={{
                      fontFamily: "'VT323', monospace",
                      fontSize: 17,
                      color: "#f0ebfa",
                      margin: 0,
                      wordBreak: "break-word",
                      lineHeight: 1.3,
                    }}>
                      {m.text}
                    </p>
                    {m.descricao && (
                      <p style={{
                        fontFamily: "'VT323', monospace",
                        fontSize: 14,
                        color: "#a090b8",
                        margin: "4px 0 0",
                        wordBreak: "break-word",
                        lineHeight: 1.2,
                        fontStyle: "italic",
                      }}>
                        {m.descricao}
                      </p>
                    )}
                    <span style={{
                      fontFamily: "'VT323', monospace",
                      fontSize: 12,
                      color: "#6b5c85",
                      display: "block",
                      textAlign: "right",
                      marginTop: 2,
                    }}>
                      {m.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step picker overlay — appears after user sends */}
          {showStepPicker && (
            <div style={{
              padding: "14px 12px",
              borderTop: `1px solid ${K}33`,
              background: "rgba(20,15,40,0.98)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: K }}>
                  {selectedStep ? `Tema: ${selectedStep}` : "Selecione o tema:"}
                </span>
                <button onClick={cancelSend} style={{
                  background: "transparent", border: "none", cursor: "pointer",
                  fontFamily: "'VT323', monospace", fontSize: 16, color: "#8878a8",
                }}>
                  Cancelar
                </button>
              </div>

              {/* Step 1: Select tema */}
              {!selectedStep && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 6,
                }}>
                  {STEPS.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedStep(s)}
                      style={{
                        fontFamily: "'Press Start 2P', monospace", fontSize: 6,
                        padding: "8px 6px", cursor: "pointer",
                        color: "#f0ebfa",
                        background: `rgba(240,160,208,0.08)`,
                        border: `1px solid ${K}33`,
                        borderRadius: 6,
                        transition: "all 0.15s",
                        letterSpacing: 0.5,
                        textAlign: "center",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = K; e.currentTarget.style.color = "#1c1030"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = `rgba(240,160,208,0.08)`; e.currentTarget.style.color = "#f0ebfa"; }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Description + send */}
              {selectedStep && (
                <div>
                  <textarea
                    value={descricao}
                    onChange={e => setDescricao(e.target.value)}
                    placeholder="Breve descrição (opcional)..."
                    rows={3}
                    style={{
                      width: "100%",
                      background: "rgba(8,7,20,0.92)",
                      border: `1px solid ${K}33`,
                      color: "#f0ebfa",
                      fontFamily: "'VT323', monospace",
                      fontSize: 16,
                      padding: "8px 10px",
                      outline: "none",
                      borderRadius: 8,
                      resize: "none",
                      marginBottom: 8,
                      boxSizing: "border-box",
                    }}
                    onFocus={e => e.target.style.borderColor = K}
                    onBlur={e => e.target.style.borderColor = `${K}33`}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => setSelectedStep(null)}
                      style={{
                        flex: 1, padding: "8px", cursor: "pointer",
                        fontFamily: "'Press Start 2P', monospace", fontSize: 6,
                        color: "#8878a8", background: "transparent",
                        border: `1px solid #8878a833`, borderRadius: 6,
                      }}
                    >
                      Trocar tema
                    </button>
                    <button
                      onClick={confirmSend}
                      style={{
                        flex: 1, padding: "8px", cursor: "pointer",
                        fontFamily: "'Press Start 2P', monospace", fontSize: 6,
                        color: "#1c1030", background: `linear-gradient(135deg, ${K}, #e870b0)`,
                        border: "none", borderRadius: 6,
                      }}
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}

              <p style={{
                fontFamily: "'VT323', monospace", fontSize: 14, color: "#6b5c85",
                margin: "8px 0 0", textAlign: "center",
              }}>
                &quot;{pendingMsg.length > 40 ? pendingMsg.slice(0, 40) + "..." : pendingMsg}&quot;
              </p>
            </div>
          )}

          {/* Input area — hidden while step picker is open */}
          {!showStepPicker && (
            <div style={{
              padding: "10px 12px",
              borderTop: `1px solid ${K}22`,
              background: "rgba(10,8,20,0.95)",
            }}>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Mensagem..."
                  style={{
                    flex: 1,
                    background: "rgba(8,7,20,0.92)",
                    border: `1px solid ${K}33`,
                    color: "#f0ebfa",
                    fontFamily: "'VT323', monospace",
                    fontSize: 17,
                    padding: "8px 12px",
                    outline: "none",
                    borderRadius: 8,
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = K}
                  onBlur={e => e.target.style.borderColor = `${K}33`}
                />
                <button
                  onClick={handleSend}
                  disabled={!newMsg.trim()}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: newMsg.trim() ? `linear-gradient(135deg, ${K}, #e870b0)` : "rgba(240,160,208,0.1)",
                    border: "none",
                    cursor: newMsg.trim() ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={newMsg.trim() ? "#1c1030" : "#6b5c85"} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

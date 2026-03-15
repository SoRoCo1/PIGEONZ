"use client";
import { useEffect, useState, useRef } from "react";
import { getChatGeral, setChatGeral, onChatGeralChange } from "@/lib/db";

const T = "#48c0b8";
const K = "#f0a0d0";

type ChatMsg = {
  author: string;
  role: string;
  text: string;
  time: string;
  date: string;
};

export default function AdminChat({ userName }: { userName: string }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [unread, setUnread] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);
  const skipSync = useRef(false);
  const lastCount = useRef(0);

  useEffect(() => {
    getChatGeral().then(data => {
      const d = data as ChatMsg[];
      setMsgs(d);
      lastCount.current = d.length;
    });

    const unsub = onChatGeralChange(data => {
      if (skipSync.current) { skipSync.current = false; return; }
      const d = data as ChatMsg[];
      setMsgs(d);
      if (!open && d.length > lastCount.current) {
        setUnread(prev => prev + (d.length - lastCount.current));
      }
      lastCount.current = d.length;
    });
    return () => unsub();
  }, [open]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs, open]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const sendMsg = () => {
    if (!newMsg.trim()) return;
    const now = new Date();
    const msg: ChatMsg = {
      author: userName,
      role: "admin",
      text: newMsg.trim(),
      time: now.toTimeString().slice(0, 5),
      date: now.toISOString().split("T")[0],
    };
    const updated = [...msgs, msg];
    setMsgs(updated);
    setNewMsg("");
    skipSync.current = true;
    setChatGeral(updated);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${T}, ${K})`,
            border: "none",
            cursor: "pointer",
            boxShadow: `0 4px 20px rgba(72,192,184,0.4), 0 0 40px rgba(240,160,208,0.2)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
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

      {open && (
        <div style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 380,
          maxWidth: "calc(100vw - 32px)",
          height: 520,
          maxHeight: "calc(100vh - 48px)",
          background: "rgba(10,8,20,0.98)",
          border: `2px solid ${T}44`,
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          zIndex: 9999,
          boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 30px rgba(72,192,184,0.15)`,
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            padding: "12px 16px",
            background: `linear-gradient(135deg, rgba(72,192,184,0.15), rgba(240,160,208,0.1))`,
            borderBottom: `1px solid ${T}33`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: `linear-gradient(135deg, ${T}, ${K})`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#1c1030" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: T, display: "block" }}>
                  Chat Geral
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
              const isAdmin = m.role === "admin";
              return (
                <div key={i} style={{
                  alignSelf: isAdmin ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                }}>
                  {!isAdmin && (
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
                  <div style={{
                    background: isAdmin
                      ? `linear-gradient(135deg, ${T}22, ${T}11)`
                      : `rgba(240,160,208,0.08)`,
                    border: `1px solid ${isAdmin ? T + "33" : K + "22"}`,
                    borderRadius: isAdmin ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
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

          {/* Input */}
          <div style={{
            padding: "10px 12px",
            borderTop: `1px solid ${T}22`,
            display: "flex",
            gap: 8,
            background: "rgba(10,8,20,0.95)",
          }}>
            <input
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
              placeholder="Mensagem..."
              style={{
                flex: 1,
                background: "rgba(8,7,20,0.92)",
                border: `1px solid ${T}33`,
                color: "#f0ebfa",
                fontFamily: "'VT323', monospace",
                fontSize: 17,
                padding: "8px 12px",
                outline: "none",
                borderRadius: 8,
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = T}
              onBlur={e => e.target.style.borderColor = `${T}33`}
            />
            <button
              onClick={sendMsg}
              disabled={!newMsg.trim()}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: newMsg.trim() ? `linear-gradient(135deg, ${T}, ${K})` : "rgba(72,192,184,0.1)",
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
    </>
  );
}

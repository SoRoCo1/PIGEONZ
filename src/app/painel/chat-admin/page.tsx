"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import GlobalCityBg from "@/components/GlobalCityBg";
import { getAllChatsParceiro, onAllChatsParceiro, setChatParceiro } from "@/lib/db";

const K = "#f0a0d0";
const T = "#48c0b8";

type ChatMsg = {
  author: string;
  role: string;
  text: string;
  time: string;
  date: string;
};

export default function ChatAdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [allChats, setAllChats] = useState<Record<string, ChatMsg[]>>({});
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [newMsg, setNewMsg] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const skipSync = useRef(false);

  useEffect(() => {
    const raw = localStorage.getItem("pigeonz_user");
    if (!raw) { router.push("/login"); return; }
    const parsed = JSON.parse(raw);
    if (parsed.role !== "admin") { router.push("/login"); return; }
    setUser(parsed);

    getAllChatsParceiro().then(data => setAllChats(data as Record<string, ChatMsg[]>));

    const unsub = onAllChatsParceiro(data => {
      if (skipSync.current) { skipSync.current = false; return; }
      setAllChats(data as Record<string, ChatMsg[]>);
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [allChats, selectedEmail]);

  const sendMsg = () => {
    if (!newMsg.trim() || !user || !selectedEmail) return;
    const now = new Date();
    const msg: ChatMsg = {
      author: user.name,
      role: "admin",
      text: newMsg.trim(),
      time: now.toTimeString().slice(0, 5),
      date: now.toISOString().split("T")[0],
    };
    const updated = [...(allChats[selectedEmail] || []), msg];
    setAllChats(prev => ({ ...prev, [selectedEmail]: updated }));
    setNewMsg("");
    skipSync.current = true;
    setChatParceiro(selectedEmail, updated);
  };

  const chatEmails = Object.keys(allChats).filter(e => allChats[e].length > 0);
  const selectedMsgs = selectedEmail ? (allChats[selectedEmail] || []) : [];

  // Get last message for preview
  const getLastMsg = (email: string) => {
    const msgs = allChats[email] || [];
    return msgs.length > 0 ? msgs[msgs.length - 1] : null;
  };

  // Get partner name from their messages
  const getPartnerName = (email: string) => {
    const msgs = allChats[email] || [];
    const partnerMsg = msgs.find(m => m.role === "parceiro");
    return partnerMsg?.author || email;
  };

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
      <div style={{ maxWidth: 1000, margin: "0 auto", marginBottom: 32 }}>
        <a
          onClick={() => router.push("/admin")}
          style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000", cursor: "pointer" }}
        >
          &larr; Voltar ao painel
        </a>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h1 style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(12px, 2.5vw, 18px)",
          color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000",
          margin: "0 0 8px",
          lineHeight: 1.6,
        }}>
          Chat Parceiros
        </h1>
        <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000", marginBottom: 24 }}>
          Conversas com parceiros em tempo real.
        </p>

        <div style={{ display: "flex", gap: 16, height: "calc(100vh - 260px)", minHeight: 400 }}>
          {/* Sidebar - list of conversations */}
          <div className="pixel-box" style={{
            width: 280, minWidth: 220, flexShrink: 0,
            background: "rgba(10,8,20,0.95)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T}22` }}>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: T, letterSpacing: 1 }}>
                CONVERSAS ({chatEmails.length})
              </span>
            </div>
            {chatEmails.length === 0 ? (
              <div style={{ padding: "24px 16px", textAlign: "center" }}>
                <p style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#6b5c85", margin: 0 }}>
                  Nenhuma conversa ainda.
                </p>
              </div>
            ) : (
              chatEmails.map(email => {
                const last = getLastMsg(email);
                const name = getPartnerName(email);
                const isSelected = selectedEmail === email;
                return (
                  <div
                    key={email}
                    onClick={() => setSelectedEmail(email)}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      background: isSelected ? `${T}15` : "transparent",
                      borderLeft: isSelected ? `3px solid ${T}` : "3px solid transparent",
                      borderBottom: `1px solid rgba(72,192,184,0.08)`,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = `${T}08`; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                      <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: isSelected ? T : "#b8a8d8" }}>
                        {name}
                      </span>
                      {last && (
                        <span style={{ fontFamily: "'VT323', monospace", fontSize: 12, color: "#6b5c85" }}>
                          {last.time}
                        </span>
                      )}
                    </div>
                    <p style={{
                      fontFamily: "'VT323', monospace", fontSize: 14, color: "#8878a8",
                      margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {last ? `${last.author}: ${last.text}` : "..."}
                    </p>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: 12, color: "#6b5c85" }}>
                      {email}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Chat area */}
          <div className="pixel-box" style={{
            flex: 1,
            background: "rgba(10,8,20,0.95)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}>
            {!selectedEmail ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="#6b5c85" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12, opacity: 0.5 }}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#6b5c85", margin: 0 }}>
                    Selecione uma conversa
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div style={{
                  padding: "12px 16px",
                  borderBottom: `1px solid ${T}22`,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${T}44, ${K}44)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: T }}>
                      {getPartnerName(selectedEmail).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: T, display: "block" }}>
                      {getPartnerName(selectedEmail)}
                    </span>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: 14, color: "#8878a8" }}>
                      {selectedEmail}
                    </span>
                  </div>
                </div>

                {/* Messages */}
                <div
                  ref={chatRef}
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "16px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {selectedMsgs.map((m, i) => {
                    const isAdmin = m.role === "admin";
                    return (
                      <div key={i} style={{
                        alignSelf: isAdmin ? "flex-end" : "flex-start",
                        maxWidth: "75%",
                      }}>
                        {!isAdmin && (
                          <span style={{
                            fontFamily: "'Press Start 2P', monospace",
                            fontSize: 6,
                            color: T,
                            display: "block",
                            marginBottom: 3,
                            marginLeft: 4,
                          }}>
                            {m.author}
                          </span>
                        )}
                        <div style={{
                          background: isAdmin
                            ? `linear-gradient(135deg, ${K}22, ${K}11)`
                            : `${T}11`,
                          border: `1px solid ${isAdmin ? K + "33" : T + "22"}`,
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
                  padding: "12px 16px",
                  borderTop: `1px solid ${T}22`,
                  display: "flex",
                  gap: 10,
                }}>
                  <input
                    value={newMsg}
                    onChange={e => setNewMsg(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
                    placeholder="Responder..."
                    style={{
                      flex: 1,
                      background: "rgba(8,7,20,0.92)",
                      border: `2px solid ${T}33`,
                      color: "#f0ebfa",
                      fontFamily: "'VT323', monospace",
                      fontSize: 18,
                      padding: "10px 14px",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={e => e.target.style.borderColor = T}
                    onBlur={e => e.target.style.borderColor = `${T}33`}
                  />
                  <button
                    onClick={sendMsg}
                    disabled={!newMsg.trim()}
                    style={{
                      fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                      padding: "10px 20px", letterSpacing: 1,
                      color: newMsg.trim() ? "#1c1030" : "#6b5c85",
                      background: newMsg.trim() ? T : "transparent",
                      border: `2px solid ${newMsg.trim() ? T : "#6b5c85"}`,
                      cursor: newMsg.trim() ? "pointer" : "not-allowed",
                      transition: "all 0.2s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ENVIAR
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import GlobalCityBg from "@/components/GlobalCityBg";
import { getTickets, setTickets as setTicketsDB, onTicketsChange } from "@/lib/db";

const K = "#f0a0d0";
const T = "#48c0b8";

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
};

type Reply = {
  autor: string;
  role: "admin" | "cliente" | "parceiro";
  texto: string;
  data: string;
};

type Ticket = {
  assunto: string;
  categoria: string;
  mensagem: string;
  data: string;
  autor: string;
  email: string;
  status: "aberto" | "respondido" | "fechado";
  respostas?: Reply[];
};

const statusColors: Record<string, string> = {
  aberto: "#f0c848",
  respondido: "#48e8a0",
  fechado: "#8878a8",
};

const categorias = [
  { value: "duvida", label: "Dúvida" },
  { value: "bug", label: "Bug / Problema" },
  { value: "alteracao", label: "Alteração no site" },
  { value: "financeiro", label: "Financeiro" },
  { value: "outro", label: "Outro" },
];

export default function SuportePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Form state (client/partner only)
  const [assunto, setAssunto] = useState("");
  const [categoria, setCategoria] = useState("duvida");
  const [mensagem, setMensagem] = useState("");
  const [enviado, setEnviado] = useState(false);

  // Detail view (admin clicks a ticket)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("pigeonz_user");
    if (!raw) { router.push("/login"); return; }
    setUser(JSON.parse(raw));

    // Load tickets from Firestore
    getTickets().then(t => setTickets(t as Ticket[]));

    // Real-time sync from other devices
    const unsub = onTicketsChange(t => {
      if (!skipNextSync.current) {
        setTickets(t as Ticket[]);
      }
      skipNextSync.current = false;
    });
    return () => unsub();
  }, [router]);

  // Save to Firestore when tickets change
  const skipNextSync = useRef(false);
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!user) return;
    if (!initialized) { setInitialized(true); return; }
    skipNextSync.current = true;
    setTicketsDB(tickets);
  }, [tickets, user, initialized]);

  const isAdmin = user?.role === "admin";

  const enviarTicket = () => {
    if (!assunto.trim() || !mensagem.trim() || !user) return;

    const now = new Date().toISOString().split("T")[0];
    const novoTicket: Ticket = {
      assunto: assunto.trim(),
      categoria,
      mensagem: mensagem.trim(),
      data: now,
      autor: user.name,
      email: user.email,
      status: "aberto",
      respostas: [],
    };
    setTickets(prev => [novoTicket, ...prev]);

    setAssunto("");
    setMensagem("");
    setCategoria("duvida");
    setEnviado(true);
    setTimeout(() => setEnviado(false), 4000);
  };

  const updateStatus = (idx: number, status: Ticket["status"]) => {
    setTickets(prev => prev.map((t, i) => i === idx ? { ...t, status } : t));
  };

  const removeTicket = (idx: number) => {
    setTickets(prev => prev.filter((_, i) => i !== idx));
    if (selectedIdx === idx) setSelectedIdx(null);
  };

  const enviarResposta = (idx: number) => {
    if (!replyText.trim() || !user) return;
    const now = new Date().toISOString().split("T")[0];
    const reply: Reply = {
      autor: user.name,
      role: user.role as Reply["role"],
      texto: replyText.trim(),
      data: now,
    };
    setTickets(prev => prev.map((t, i) => {
      if (i !== idx) return t;
      const newStatus = isAdmin ? "respondido" : t.status;
      return { ...t, respostas: [...(t.respostas || []), reply], status: newStatus };
    }));
    setReplyText("");
  };

  if (!user) return null;

  const selectedTicket = selectedIdx !== null ? tickets[selectedIdx] : null;

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
          onClick={() => {
            if (selectedIdx !== null) { setSelectedIdx(null); setReplyText(""); }
            else router.push(isAdmin ? "/admin" : "/painel");
          }}
          style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000", cursor: "pointer" }}
        >
          &larr; {selectedIdx !== null ? "Voltar aos chamados" : "Voltar ao painel"}
        </a>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(12px, 2.5vw, 18px)",
          color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000",
          margin: "0 0 8px",
          lineHeight: 1.6,
        }}>
          Suporte
        </h1>
        <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000", marginBottom: 32 }}>
          {isAdmin ? "Gerencie os chamados dos clientes e parceiros." : "Abra um chamado e nossa equipe responderá o mais breve possível."}
        </p>

        {/* ═══ DETAIL VIEW (when a ticket is selected) ═══ */}
        {selectedTicket && selectedIdx !== null ? (
          <div>
            {/* Ticket header */}
            <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "20px 20px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                <div>
                  <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: K }}>
                    {selectedTicket.assunto}
                  </span>
                  <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#8878a8" }}>
                      {categorias.find(c => c.value === selectedTicket.categoria)?.label || selectedTicket.categoria}
                    </span>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#6b5c85" }}>
                      {selectedTicket.data}
                    </span>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: T }}>
                      {selectedTicket.autor} ({selectedTicket.email})
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {isAdmin ? (
                    <div style={{ display: "flex", gap: 4 }}>
                      {(["aberto", "respondido", "fechado"] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => updateStatus(selectedIdx, s)}
                          style={{
                            fontFamily: "'VT323', monospace", fontSize: 13,
                            padding: "2px 8px", cursor: "pointer",
                            color: selectedTicket.status === s ? "#1c1030" : statusColors[s],
                            background: selectedTicket.status === s ? statusColors[s] : "transparent",
                            border: `1px solid ${statusColors[s]}`,
                            transition: "all 0.2s",
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span style={{
                      fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                      color: statusColors[selectedTicket.status],
                      border: `1px solid ${statusColors[selectedTicket.status]}`,
                      padding: "4px 8px", letterSpacing: 1, textTransform: "uppercase",
                    }}>
                      {selectedTicket.status}
                    </span>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => removeTicket(selectedIdx)}
                      style={{
                        fontFamily: "'VT323', monospace", fontSize: 16, color: "#ff6060",
                        background: "transparent", border: "1px solid #ff6060",
                        padding: "2px 8px", cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Original message */}
              <div style={{ padding: "12px 14px", background: "rgba(240,160,208,0.06)", borderLeft: `3px solid ${K}44`, marginBottom: 4 }}>
                <p style={{ fontFamily: "'VT323', monospace", fontSize: 14, color: K, margin: "0 0 4px" }}>
                  {selectedTicket.autor} — {selectedTicket.data}
                </p>
                <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#d8c8f0", margin: 0, lineHeight: 1.4, whiteSpace: "pre-wrap" }}>
                  {selectedTicket.mensagem}
                </p>
              </div>
            </div>

            {/* Replies / conversation */}
            {(selectedTicket.respostas || []).length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {(selectedTicket.respostas || []).map((r, ri) => {
                  const isAdminReply = r.role === "admin";
                  return (
                    <div key={ri} style={{
                      padding: "12px 14px",
                      background: isAdminReply ? "rgba(72,192,184,0.06)" : "rgba(240,160,208,0.06)",
                      borderLeft: `3px solid ${isAdminReply ? T : K}44`,
                    }}>
                      <p style={{ fontFamily: "'VT323', monospace", fontSize: 14, color: isAdminReply ? T : K, margin: "0 0 4px" }}>
                        {r.autor} ({r.role}) — {r.data}
                      </p>
                      <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#d8c8f0", margin: 0, lineHeight: 1.4, whiteSpace: "pre-wrap" }}>
                        {r.texto}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Reply form */}
            {selectedTicket.status !== "fechado" && (
              <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "16px 20px" }}>
                <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: isAdmin ? T : K, display: "block", marginBottom: 8 }}>
                  {isAdmin ? "Responder ao cliente" : "Enviar mensagem"}
                </label>
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Digite sua resposta..."
                  rows={4}
                  style={{ ...inputStyle, borderColor: isAdmin ? `${T}66` : `${K}66`, resize: "vertical" as const, marginBottom: 12 }}
                  onFocus={e => e.target.style.borderColor = isAdmin ? T : K}
                  onBlur={e => e.target.style.borderColor = isAdmin ? `${T}66` : `${K}66`}
                />
                <button
                  onClick={() => enviarResposta(selectedIdx)}
                  disabled={!replyText.trim()}
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 9, padding: "12px 24px", letterSpacing: 2,
                    color: "#1c1030",
                    background: isAdmin ? T : K,
                    border: `2px solid ${isAdmin ? T : K}`,
                    cursor: !replyText.trim() ? "not-allowed" : "pointer",
                    boxShadow: `4px 4px 0 ${isAdmin ? T : K}44`,
                    transition: "all 0.2s",
                    opacity: !replyText.trim() ? 0.5 : 1,
                  }}
                >
                  ENVIAR RESPOSTA
                </button>
              </div>
            )}

            {selectedTicket.status === "fechado" && (
              <div style={{ padding: "12px 16px", background: "rgba(136,120,168,0.1)", borderLeft: "3px solid #8878a8" }}>
                <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#8878a8", margin: 0 }}>
                  Este chamado foi fechado.
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* ═══ FORM (client/partner only) ═══ */}
            {!isAdmin && (
              <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <svg width={28} height={28} viewBox="0 0 12 12" shapeRendering="crispEdges">
                    <rect x={4} y={0} width={4} height={1} fill={K}/>
                    <rect x={2} y={1} width={2} height={1} fill={K}/><rect x={8} y={1} width={2} height={1} fill={K}/>
                    <rect x={1} y={2} width={1} height={2} fill={K}/><rect x={10} y={2} width={1} height={2} fill={K}/>
                    <rect x={5} y={2} width={2} height={1} fill={K}/>
                    <rect x={6} y={3} width={2} height={1} fill={K}/>
                    <rect x={7} y={4} width={1} height={1} fill={K}/>
                    <rect x={6} y={5} width={1} height={1} fill={K}/>
                    <rect x={5} y={6} width={2} height={1} fill={K}/>
                    <rect x={1} y={4} width={1} height={3} fill={K}/><rect x={10} y={4} width={1} height={3} fill={K}/>
                    <rect x={2} y={7} width={2} height={1} fill={K}/><rect x={8} y={7} width={2} height={1} fill={K}/>
                    <rect x={4} y={8} width={4} height={1} fill={K}/>
                    <rect x={5} y={9} width={2} height={1} fill={K}/>
                    <rect x={5} y={11} width={2} height={1} fill={K}/>
                  </svg>
                  <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: K, letterSpacing: 1 }}>
                    ABRIR CHAMADO
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {/* Categoria */}
                  <div>
                    <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: K, display: "block", marginBottom: 6 }}>
                      Categoria
                    </label>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {categorias.map(cat => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setCategoria(cat.value)}
                          style={{
                            fontFamily: "'VT323', monospace",
                            fontSize: 16,
                            padding: "6px 14px",
                            cursor: "pointer",
                            color: categoria === cat.value ? "#1c1030" : K,
                            background: categoria === cat.value ? K : "transparent",
                            border: `2px solid ${K}`,
                            transition: "all 0.2s",
                          }}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Assunto */}
                  <div>
                    <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: K, display: "block", marginBottom: 6 }}>
                      Assunto
                    </label>
                    <input
                      value={assunto}
                      onChange={e => setAssunto(e.target.value)}
                      placeholder="Resumo do chamado"
                      style={{ ...inputStyle, borderColor: `${K}66` }}
                      onFocus={e => e.target.style.borderColor = K}
                      onBlur={e => e.target.style.borderColor = `${K}66`}
                    />
                  </div>

                  {/* Mensagem */}
                  <div>
                    <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: K, display: "block", marginBottom: 6 }}>
                      Mensagem
                    </label>
                    <textarea
                      value={mensagem}
                      onChange={e => setMensagem(e.target.value)}
                      placeholder="Descreva seu problema ou dúvida em detalhes..."
                      rows={5}
                      style={{ ...inputStyle, borderColor: `${K}66`, resize: "vertical" as const }}
                      onFocus={e => e.target.style.borderColor = K}
                      onBlur={e => e.target.style.borderColor = `${K}66`}
                    />
                  </div>

                  {/* Sucesso */}
                  {enviado && (
                    <div style={{ padding: "12px 16px", background: "rgba(72,232,160,0.1)", borderLeft: "3px solid #48e8a0" }}>
                      <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#48e8a0", margin: 0 }}>
                        ✓ Chamado enviado com sucesso! Nossa equipe vai analisar e responder em breve.
                      </p>
                    </div>
                  )}

                  {/* Botão enviar */}
                  <button
                    onClick={enviarTicket}
                    disabled={!assunto.trim() || !mensagem.trim()}
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 9,
                      padding: "14px 28px",
                      letterSpacing: 2,
                      color: "#1c1030",
                      background: K,
                      border: `2px solid ${K}`,
                      cursor: (!assunto.trim() || !mensagem.trim()) ? "not-allowed" : "pointer",
                      boxShadow: `4px 4px 0 ${K}44`,
                      transition: "all 0.2s",
                      alignSelf: "flex-start",
                      opacity: (!assunto.trim() || !mensagem.trim()) ? 0.5 : 1,
                    }}
                  >
                    ENVIAR CHAMADO
                  </button>
                </div>
              </div>
            )}

            {/* ═══ TICKET LIST ═══ */}
            {tickets.length > 0 ? (
              <>
                <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: T, margin: "0 0 16px", letterSpacing: 1 }}>
                  {isAdmin ? "CHAMADOS" : "HISTÓRICO DE CHAMADOS"}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {tickets.map((ticket, i) => {
                    const unreadReplies = (ticket.respostas || []).filter(r => isAdmin ? r.role !== "admin" : r.role === "admin").length;
                    return (
                      <div
                        key={i}
                        className="pixel-box"
                        onClick={() => { setSelectedIdx(i); setReplyText(""); }}
                        style={{
                          background: "rgba(10,8,20,0.95)",
                          padding: "16px 20px",
                          cursor: "pointer",
                          transition: "border-color 0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = T}
                        onMouseLeave={e => e.currentTarget.style.borderColor = ""}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                          <div>
                            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: K }}>
                              {ticket.assunto}
                            </span>
                            <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap", alignItems: "center" }}>
                              <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#8878a8" }}>
                                {categorias.find(c => c.value === ticket.categoria)?.label || ticket.categoria}
                              </span>
                              <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#6b5c85" }}>
                                {ticket.data}
                              </span>
                              {isAdmin && ticket.autor && (
                                <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: T }}>
                                  {ticket.autor} ({ticket.email})
                                </span>
                              )}
                              {unreadReplies > 0 && (
                                <span style={{
                                  fontFamily: "'VT323', monospace", fontSize: 14,
                                  color: "#f0c848", padding: "1px 8px",
                                  border: "1px solid #f0c84844",
                                  background: "rgba(240,200,72,0.08)",
                                }}>
                                  {unreadReplies} resposta(s)
                                </span>
                              )}
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{
                              fontFamily: "'Press Start 2P', monospace",
                              fontSize: 7,
                              color: statusColors[ticket.status],
                              border: `1px solid ${statusColors[ticket.status]}`,
                              padding: "4px 8px",
                              letterSpacing: 1,
                              textTransform: "uppercase",
                            }}>
                              {ticket.status}
                            </span>
                            {isAdmin && (
                              <button
                                onClick={(e) => { e.stopPropagation(); removeTicket(i); }}
                                style={{
                                  fontFamily: "'VT323', monospace", fontSize: 16, color: "#ff6060",
                                  background: "transparent", border: "1px solid #ff6060",
                                  padding: "2px 8px", cursor: "pointer",
                                }}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                        <p style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: "#b8a8d8", margin: 0, lineHeight: 1.4,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {ticket.mensagem}
                        </p>
                        <span style={{ fontFamily: "'VT323', monospace", fontSize: 14, color: T, marginTop: 4, display: "inline-block" }}>
                          Clique para abrir →
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              isAdmin && (
                <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "32px 20px", textAlign: "center" }}>
                  <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#6b5c85", margin: 0 }}>
                    Nenhum chamado aberto.
                  </p>
                </div>
              )
            )}
          </>
        )}

        <button
          onClick={() => {
            if (selectedIdx !== null) { setSelectedIdx(null); setReplyText(""); }
            else router.push(isAdmin ? "/admin" : "/painel");
          }}
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 10, padding: "14px 32px", letterSpacing: 2, cursor: "pointer",
            background: K, color: "#1c1030", border: `2px solid ${K}`,
            boxShadow: `4px 4px 0 ${K}44`, transition: "all 0.2s",
            width: "100%", marginTop: 32,
          }}
        >
          {selectedIdx !== null ? "VOLTAR AOS CHAMADOS" : "VOLTAR AO PAINEL"}
        </button>
      </div>
    </div>
    </>
  );
}

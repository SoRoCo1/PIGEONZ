"use client";
import { useEffect, useState, useRef } from "react";
import { getProposta, getAllPropostas, getTickets, getComprovantes, getParceiros, getComissoes, getParceiroPix, getNotifRead, setNotifRead } from "@/lib/db";

const K = "#f0a0d0";
const T = "#48c0b8";
const G = "#48e8a0";

type Notif = {
  id: string;
  text: string;
  type: "pagamento" | "projeto" | "parceiro" | "comprovante" | "comissao" | "sistema" | "mensagem";
  date: string;
  read: boolean;
  href?: string;
  adminManage?: string; // email to set in pigeonz_admin_manage before navigating
};

const typeColors: Record<string, string> = {
  pagamento: G,
  projeto: T,
  parceiro: K,
  comprovante: "#f0a050",
  comissao: G,
  sistema: "#b8a8d8",
  mensagem: "#f0c848",
};

const typeLabels: Record<string, string> = {
  pagamento: "PAGAMENTO",
  projeto: "PROJETO",
  parceiro: "PARCEIRO",
  comprovante: "COMPROVANTE",
  comissao: "COMISSÃO",
  sistema: "SISTEMA",
  mensagem: "MENSAGEM",
};

async function generateNotifications(role: string): Promise<Notif[]> {
  const notifs: Notif[] = [];
  const now = new Date().toISOString().split("T")[0];
  const userRaw = localStorage.getItem("pigeonz_user");
  const userEmail = userRaw ? JSON.parse(userRaw).email : "";

  if (role === "cliente") {
    notifs.push({ id: "cli_welcome", text: "Bem-vindo(a) à pigeonz.ai! Configure seu perfil nas configurações.", type: "sistema", date: now, read: false });

    const p = await getProposta(userEmail);
    if (p) {
      const step = p.currentStep as string;
      if (step === "pagamento") notifs.push({ id: "cli_pag_pending", text: "Pagamento pendente. Escolha um método e finalize.", type: "pagamento", date: now, read: false, href: "/painel/proposta" });
      if (p.comprovanteSent && !p.pagamentoConfirmado) notifs.push({ id: "cli_comp_sent", text: "Comprovante enviado. Aguardando confirmação da equipe.", type: "comprovante", date: now, read: false, href: "/painel/proposta" });
      if (p.pagamentoConfirmado) notifs.push({ id: "cli_pag_ok", text: "Pagamento confirmado!", type: "pagamento", date: now, read: false, href: "/painel/proposta" });
      if (p.notaFiscal) notifs.push({ id: "cli_nf", text: "Nota fiscal disponível para download.", type: "pagamento", date: now, read: false, href: "/painel/proposta" });
      if (step === "descrever_projeto") notifs.push({ id: "cli_brief", text: "Descreva seu projeto para iniciarmos o desenvolvimento.", type: "projeto", date: now, read: false, href: "/painel/proposta" });
      if (step === "proposta_enviada") notifs.push({ id: "cli_proposta", text: "Proposta enviada! Aguardando revisão da equipe.", type: "projeto", date: now, read: false, href: "/painel/proposta" });
      if (step === "desenvolvimento") {
        const devDone = (p.devDone || []) as (string | boolean)[];
        const done = devDone.filter(v => v === "concluido" || v === true).length;
        notifs.push({ id: "cli_dev", text: `Projeto em desenvolvimento: ${done}/7 etapas concluídas.`, type: "projeto", date: now, read: false, href: "/painel/proposta" });
      }
      if (step === "aguardando_aprovacao") notifs.push({ id: "cli_aprov", text: "Seu site está pronto para aprovação!", type: "projeto", date: now, read: false, href: "/painel/proposta" });
      if (step === "em_producao") notifs.push({ id: "cli_prod", text: "Seu site está sendo publicado em produção.", type: "projeto", date: now, read: false, href: "/painel/proposta" });
      if (step === "entregue") notifs.push({ id: "cli_entregue", text: "Projeto entregue! Seu site está no ar.", type: "projeto", date: now, read: false, href: "/painel/proposta" });

      const comments = ((p.comments || []) as { role: string; author: string; date: string }[]);
      const adminMsgs = comments.filter(c => c.role === "admin");
      if (adminMsgs.length > 0) {
        const last = adminMsgs[adminMsgs.length - 1];
        notifs.push({ id: `cli_msg_${adminMsgs.length}`, text: `Você recebeu ${adminMsgs.length} mensagem(ns) do desenvolvedor no projeto.`, type: "mensagem", date: last.date || now, read: false, href: "/painel/proposta" });
      }
    }

    const tickets = await getTickets() as { assunto: string; email: string; status: string; data: string; respostas?: { role: string }[] }[];
    tickets.filter(t => t.email === userEmail).forEach((t, idx) => {
      const adminReplies = (t.respostas || []).filter(r => r.role === "admin");
      if (adminReplies.length > 0) {
        notifs.push({ id: `cli_suporte_reply_${idx}_${adminReplies.length}`, text: `Desenvolvedor respondeu seu chamado "${t.assunto}".`, type: "mensagem", date: t.data || now, read: false, href: "/painel/suporte" });
      }
    });

  } else if (role === "parceiro") {
    notifs.push({ id: "par_welcome", text: "Compartilhe seu link de indicação para ganhar comissões!", type: "sistema", date: now, read: false });

    const pixData = await getParceiroPix();
    if (!pixData[userEmail]) {
      notifs.push({ id: "par_pix_pending", text: "Preencha seus dados Pix em Comissões para receber pagamentos.", type: "comissao", date: now, read: false, href: "/painel/comissoes" });
    }

    const comissoes = await getComissoes() as { pago: boolean; status: string; comissao: string }[];
    const pendentes = comissoes.filter(c => !c.pago && c.status !== "cancelado");
    const pagas = comissoes.filter(c => c.pago);
    if (pendentes.length > 0) {
      const totalPend = pendentes.reduce((s, c) => s + (parseFloat((c.comissao || "0").replace(/[^\d,.]/g, "").replace(",", ".")) || 0), 0);
      notifs.push({ id: "par_com_pend", text: `${pendentes.length} comissão(ões) com saldo pendente: R$ ${totalPend.toFixed(2).replace(".", ",")}.`, type: "comissao", date: now, read: false, href: "/painel/comissoes" });
    }
    if (pagas.length > 0) {
      notifs.push({ id: "par_com_paga", text: `${pagas.length} comissão(ões) paga(s). NF disponível para download.`, type: "comissao", date: now, read: false, href: "/painel/comissoes" });
    }

    const p = await getProposta(userEmail);
    if (p) {
      if (p.currentStep && p.currentStep !== "selecionar_plano") {
        notifs.push({ id: "par_proj", text: `Seu projeto está na etapa: ${(p.currentStep as string).replace(/_/g, " ")}.`, type: "projeto", date: now, read: false, href: "/painel/proposta" });
      }
      const comments = ((p.comments || []) as { role: string; author: string; date: string }[]);
      const adminMsgs = comments.filter(c => c.role === "admin");
      if (adminMsgs.length > 0) {
        const last = adminMsgs[adminMsgs.length - 1];
        notifs.push({ id: `par_msg_${adminMsgs.length}`, text: `Você recebeu ${adminMsgs.length} mensagem(ns) do desenvolvedor no projeto.`, type: "mensagem", date: last.date || now, read: false, href: "/painel/proposta" });
      }
    }

    const tickets = await getTickets() as { assunto: string; email: string; status: string; data: string; respostas?: { role: string }[] }[];
    tickets.filter(t => t.email === userEmail).forEach((t, idx) => {
      const adminReplies = (t.respostas || []).filter(r => r.role === "admin");
      if (adminReplies.length > 0) {
        notifs.push({ id: `par_suporte_reply_${idx}_${adminReplies.length}`, text: `Desenvolvedor respondeu seu chamado "${t.assunto}".`, type: "mensagem", date: t.data || now, read: false, href: "/painel/suporte" });
      }
    });

  } else if (role === "admin") {
    notifs.push({ id: "adm_welcome", text: "Painel administrativo ativo.", type: "sistema", date: now, read: false });

    const comps = await getComprovantes() as { status: string }[];
    const pendentes = comps.filter(c => c.status === "pendente");
    const confirmados = comps.filter(c => c.status === "confirmado");
    if (pendentes.length > 0) notifs.push({ id: "adm_comp_pend", text: `${pendentes.length} comprovante(s) aguardando confirmação.`, type: "comprovante", date: now, read: false, href: "/painel/comprovantes" });
    if (confirmados.length > 0) notifs.push({ id: "adm_comp_ok", text: `${confirmados.length} pagamento(s) confirmado(s).`, type: "pagamento", date: now, read: false, href: "/painel/comprovantes" });

    const parceiros = await getParceiros() as unknown[];
    if (parceiros.length > 0) notifs.push({ id: "adm_par", text: `${parceiros.length} parceiro(s) cadastrado(s).`, type: "parceiro", date: now, read: false, href: "/painel/parceiros" });

    const allPropostas = await getAllPropostas();
    Object.entries(allPropostas).forEach(([email, proposta]) => {
      const p = proposta as { comments?: { role: string; author: string; date: string }[]; userName?: string; currentStep?: string };
      const comments = p.comments || [];
      const clientMsgs = comments.filter(c => c.role === "cliente" || c.role === "parceiro");
      if (clientMsgs.length > 0) {
        const name = p.userName || email;
        const last = clientMsgs[clientMsgs.length - 1];
        notifs.push({ id: `adm_msg_${email}_${clientMsgs.length}`, text: `Mensagem de ${name} no projeto.`, type: "mensagem", date: last.date || now, read: false, href: "/painel/proposta", adminManage: email });
      }
      if (p.currentStep === "proposta_enviada") {
        notifs.push({ id: `adm_brief_${email}`, text: `Briefing de ${p.userName || email} recebido. Revise a proposta.`, type: "projeto", date: now, read: false, href: "/painel/proposta", adminManage: email });
      }
    });

    const tickets = await getTickets() as { assunto: string; autor: string; email: string; status: string; data: string; respostas?: { role: string; autor: string }[] }[];
    const openTickets = tickets.filter(t => t.status === "aberto");
    if (openTickets.length > 0) notifs.push({ id: `adm_tickets_open_${openTickets.length}`, text: `${openTickets.length} chamado(s) aberto(s) no suporte.`, type: "sistema", date: now, read: false, href: "/painel/suporte" });
    tickets.forEach((t, idx) => {
      const clientReplies = (t.respostas || []).filter(r => r.role === "cliente" || r.role === "parceiro");
      if (clientReplies.length > 0) {
        notifs.push({ id: `adm_ticket_reply_${idx}_${clientReplies.length}`, text: `${t.autor} respondeu no chamado "${t.assunto}".`, type: "mensagem", date: t.data || now, read: false, href: "/painel/suporte" });
      }
    });
  }

  // Load read state from Firestore
  const readIds = userEmail ? await getNotifRead(userEmail) : [];
  return notifs.map(n => ({ ...n, read: readIds.includes(n.id) }));
}

export default function Notifications({ role }: { role: string }) {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generateNotifications(role).then(setNotifs);
    // Poll every 30s for real-time-ish notifications
    const interval = setInterval(() => {
      generateNotifications(role).then(setNotifs);
    }, 30000);
    return () => clearInterval(interval);
  }, [role]);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifs.filter(n => !n.read).length;

  const getUserEmail = () => {
    const raw = localStorage.getItem("pigeonz_user");
    return raw ? JSON.parse(raw).email : "";
  };

  const markAllRead = () => {
    const ids = notifs.map(n => n.id);
    const email = getUserEmail();
    if (email) setNotifRead(email, ids);
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    const email = getUserEmail();
    const currentIds = notifs.filter(n => n.read).map(n => n.id);
    if (!currentIds.includes(id)) currentIds.push(id);
    if (email) setNotifRead(email, currentIds);
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClick = (n: Notif) => {
    // Mark ALL as read when clicking any notification (clears badge)
    markAllRead();
    if (n.href) {
      if (n.adminManage) {
        localStorage.setItem("pigeonz_admin_manage", n.adminManage);
      }
      setOpen(false);
      // Full page navigation to avoid SPA flickering
      window.location.href = n.href;
    }
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        title="Notificações"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 4,
          display: "flex",
          alignItems: "center",
          position: "relative",
          transition: "opacity 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        {/* Bell icon */}
        <svg width={22} height={22} viewBox="0 0 12 14" shapeRendering="crispEdges">
          <rect x={5} y={0} width={2} height={1} fill="#f0ebfa"/>
          <rect x={4} y={1} width={4} height={1} fill="#f0ebfa"/>
          <rect x={3} y={2} width={6} height={1} fill="#f0ebfa"/>
          <rect x={2} y={3} width={8} height={1} fill="#f0ebfa"/>
          <rect x={2} y={4} width={8} height={1} fill="#f0ebfa"/>
          <rect x={2} y={5} width={8} height={1} fill="#f0ebfa"/>
          <rect x={2} y={6} width={8} height={1} fill="#f0ebfa"/>
          <rect x={1} y={7} width={10} height={1} fill="#f0ebfa"/>
          <rect x={1} y={8} width={10} height={1} fill="#f0ebfa"/>
          <rect x={0} y={9} width={12} height={1} fill="#f0ebfa"/>
          <rect x={0} y={10} width={12} height={1} fill="#f0ebfa"/>
          <rect x={4} y={12} width={4} height={1} fill="#f0ebfa"/>
          <rect x={5} y={13} width={2} height={1} fill="#f0ebfa"/>
        </svg>
        {/* Badge */}
        {unread > 0 && (
          <div style={{
            position: "absolute", top: -2, right: -4,
            width: 16, height: 16,
            background: "#ff6060",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 7, color: "#fff",
            border: "2px solid #1a0e38",
          }}>
            {unread > 9 ? "9+" : unread}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          right: 0,
          width: 340,
          maxHeight: 420,
          overflowY: "auto",
          background: "rgba(10,8,20,0.98)",
          border: `2px solid ${K}44`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          zIndex: 1000,
        }}>
          {/* Header */}
          <div style={{
            padding: "12px 14px",
            borderBottom: `1px solid ${K}33`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: K, letterSpacing: 1 }}>
              NOTIFICAÇÕES
            </span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  fontFamily: "'VT323', monospace", fontSize: 14,
                  color: T, background: "transparent",
                  border: "none", cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          {/* Notifications list */}
          {notifs.length === 0 ? (
            <div style={{ padding: "24px 14px", textAlign: "center" }}>
              <p style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: "#6b5c85" }}>
                Nenhuma notificação.
              </p>
            </div>
          ) : (
            notifs.map(n => (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                style={{
                  padding: "10px 14px",
                  borderBottom: "1px solid rgba(96,64,160,0.15)",
                  background: n.read ? "transparent" : "rgba(240,160,208,0.04)",
                  cursor: n.href ? "pointer" : "default",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => { if (n.href) e.currentTarget.style.background = "rgba(240,160,208,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = n.read ? "transparent" : "rgba(240,160,208,0.04)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  {!n.read && (
                    <div style={{ width: 6, height: 6, background: K, flexShrink: 0 }} />
                  )}
                  <span style={{
                    fontFamily: "'Press Start 2P', monospace", fontSize: 6,
                    color: typeColors[n.type], letterSpacing: 1,
                    padding: "1px 6px",
                    border: `1px solid ${typeColors[n.type]}44`,
                  }}>
                    {typeLabels[n.type]}
                  </span>
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: 13, color: "#6b5c85", marginLeft: "auto" }}>
                    {n.date}
                  </span>
                </div>
                <p style={{
                  fontFamily: "'VT323', monospace", fontSize: 16,
                  color: n.read ? "#8878a8" : "#d8c8f0",
                  margin: 0, lineHeight: 1.3,
                }}>
                  {n.text}
                </p>
                {n.href && (
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: 13, color: T, marginTop: 2, display: "inline-block" }}>
                    Clique para ver →
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GlobalCityBg from "@/components/GlobalCityBg";
import Notifications from "@/components/Notifications";
import PartnerChat from "@/components/PartnerChat";

const K = "#f0a0d0";
const T = "#48c0b8";

const featherIcons = {
  proposal: () => (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  globe: () => (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={10}/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  chat: () => (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  card: () => (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x={1} y={4} width={22} height={16} rx={2} ry={2}/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  support: () => (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={10}/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  comissao: () => (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
};

export default function PainelPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("pigeonz_user");
    if (!raw) { router.push("/login"); return; }
    const parsed = JSON.parse(raw);
    if (parsed.role !== "cliente" && parsed.role !== "parceiro") { router.push("/login"); return; }
    // Fix cached name
    if (parsed.name === "Blue Zone") { parsed.name = "BlueZone"; localStorage.setItem("pigeonz_user", JSON.stringify(parsed)); }
    setUser(parsed);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("pigeonz_user");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <>
    <GlobalCityBg />
    <div style={{
      minHeight: "100vh",
      background: "transparent",
      padding: "60px 24px",
      paddingTop: 48,
      position: "relative",
      zIndex: 1,
    }}>
      {/* Header */}
      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 40,
      }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 4, filter: "drop-shadow(0 0 12px rgba(255,80,192,0.5)) drop-shadow(0 0 28px rgba(72,232,208,0.3))" }} className="a-float">
          <svg width={52} height={24} style={{ imageRendering: "pixelated", shapeRendering: "crispEdges", marginRight: -2 }}>
            <rect x={16} y={0} width={16} height={4} fill="#100818" />
            <rect x={12} y={4} width={24} height={4} fill="#100818" />
            <rect x={12} y={8} width={4} height={4} fill="#06020c" />
            <rect x={16} y={8} width={16} height={4} fill="#f0eef8" />
            <rect x={32} y={8} width={4} height={4} fill="#06020c" />
            <rect x={4} y={12} width={36} height={6} fill="#06020c" />
          </svg>
          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14 }}>
            <span style={{ color: "#ff50c0" }}>pigeonz</span>
            <span style={{ color: "#48e8d0" }}>.ai</span>
          </span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#b8a8d8" }}>
            {user.name}
          </span>
          <Notifications role={user.role} />
          <button
            onClick={() => router.push("/painel/config")}
            title="Configurações da conta"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx={12} cy={12} r={3}/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
          <button
            onClick={logout}
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: 16,
              padding: "4px 12px",
              color: "#ff6060",
              border: "1px solid #ff6060",
              background: "transparent",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Sair
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(14px, 2.5vw, 22px)",
          color: K,
          textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000",
          marginBottom: 8,
        }}>
          {user.role === "parceiro" ? "Painel do Parceiro" : "Painel do Cliente"}
        </h1>
        <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000", marginBottom: 40 }}>
          Bem-vindo(a), {user.name}! Aqui você acompanha tudo sobre o seu projeto.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20,
        }}>
          {[
            { title: "Proposta e Projeto", desc: "Acompanhe sua proposta e etapas do projeto", icon: "proposal" as const, color: K, href: "/painel/proposta" },
            { title: "Meu Site", desc: "Status, preview e link do seu site", icon: "globe" as const, color: T, href: "/painel/meusite" },
            ...(user.role !== "parceiro" ? [{ title: "Pagamentos", desc: "Faturas e histórico de pagamento", icon: "card" as const, color: T, href: "/painel/pagamentos" }] : []),
            ...(user.role === "parceiro" ? [{ title: "Comissões", desc: "Clientes indicados, comissões e sites", icon: "comissao" as const, color: T, href: "/painel/comissoes" }] : []),
            ...(user.role === "parceiro" ? [{ title: "Financeiro", desc: "Pagamentos, cobranças e notas fiscais", icon: "card" as const, color: T, href: "/painel/financeiro" }] : []),
            { title: "Suporte", desc: "Abrir chamado ou tirar dúvidas", icon: "support" as const, color: K, href: "/painel/suporte" },
          ].map((card, i) => (
            <div key={i} className="pixel-box" style={{
              background: "rgba(10,8,20,0.95)",
              padding: "24px 20px",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onClick={() => { if ("href" in card && card.href) router.push(card.href); }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 0 20px rgba(208,88,160,0.25)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ marginBottom: 12 }}>{featherIcons[card.icon]()}</div>
              <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: "#48e8d0", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000", margin: 0, lineHeight: 1.6 }}>
                {card.title}
              </h3>
              <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000", margin: "8px 0 0" }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
    {user.role === "parceiro" && (
      <PartnerChat userName={user.name} userEmail={user.email} userRole={user.role} />
    )}
    </>
  );
}

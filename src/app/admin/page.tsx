"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GlobalCityBg from "@/components/GlobalCityBg";
import Notifications from "@/components/Notifications";
import AdminChat from "@/components/AdminChat";

const K = "#f0a0d0";
const T = "#48c0b8";

const featherIcons = {
  users: () => (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx={9} cy={7} r={4}/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  rocket: () => (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  money: () => (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  chat: () => (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  chart: () => (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  gear: () => (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={3}/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  nf: () => (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/><path d="M8 9h1"/>
    </svg>
  ),
  handshake: () => (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6"/><path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 16"/>
    </svg>
  ),
  bulb: () => (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>
    </svg>
  ),
  glasses: () => (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={6} cy={15} r={4}/><circle cx={18} cy={15} r={4}/><path d="M10 15h4"/><path d="M2 15V9a4 4 0 0 1 4-4"/><path d="M22 15V9a4 4 0 0 0-4-4"/>
    </svg>
  ),
};

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("pigeonz_user");
    if (!raw) { router.push("/login"); return; }
    const parsed = JSON.parse(raw);
    if (parsed.role !== "admin") { router.push("/login"); return; }
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
        maxWidth: 1000,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 40,
      }}>
        <a href="/" className="a-float" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 4, filter: "drop-shadow(0 0 12px rgba(255,80,192,0.5)) drop-shadow(0 0 28px rgba(72,232,208,0.3))" }}>
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
          <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#ff6060", border: "1px solid #ff6060", padding: "2px 8px", marginLeft: 8 }}>
            ADMIN
          </span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#b8a8d8" }}>
            Sarah
          </span>
          <Notifications role="admin" />
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
            }}
          >
            Sair
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h1 style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(14px, 2.5vw, 22px)",
          color: K,
          textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000",
          marginBottom: 8,
        }}>
          Painel Administrativo
        </h1>
        <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000", marginBottom: 40 }}>
          Gerencie clientes, projetos e configurações do sistema.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
        }}>
          {[
            { title: "Fin. Clientes", desc: "Receitas, faturas e cobranças de clientes", icon: "money" as const, color: T, href: "/painel/pagamentos" },
            { title: "Parceiros", desc: "Gerenciar parceiros e links", icon: "glasses" as const, color: T, href: "/painel/parceiros" },
            { title: "Gerenciar Projetos", desc: "Visão geral de todos os projetos", icon: "bulb" as const, color: K, href: "/painel/projetos" },
            { title: "Proj. Parceiros", desc: "Projetos de parceiros", icon: "handshake" as const, color: T, href: "/painel/projetos-parceiros" },
            { title: "Projeto de Clientes", desc: "Projetos ativos de clientes", icon: "users" as const, color: K, href: "/painel/projetos" },
            { title: "Suporte", desc: "Tickets de clientes", icon: "chat" as const, color: K, href: "/painel/suporte" },
            { title: "Comissões", desc: "Gerenciar comissões de parceiros", icon: "money" as const, color: T, href: "/painel/comissoes-admin" },
            { title: "Fin. Parceiros", desc: "Pagamentos e cobranças de parceiros", icon: "handshake" as const, color: K, href: "/painel/financeiro-admin" },
            { title: "Comprovantes", desc: "Comprovantes e notas fiscais", icon: "nf" as const, color: K, href: "/painel/comprovantes" },
            { title: "Analytics", desc: "Métricas e relatórios gerais", icon: "chart" as const, color: T },
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
    {user && <AdminChat userName={user.name} />}
    </>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GlobalCityBg from "@/components/GlobalCityBg";
import { getAllPropostas, onAllPropostasChange, getAllUsers, setProposta as setPropostaDB } from "@/lib/db";

const K = "#f0a0d0";
const T = "#48c0b8";
const G = "#48e8a0";

type Step =
  | "selecionar_plano"
  | "descrever_projeto"
  | "pagamento"
  | "proposta_enviada"
  | "desenvolvimento"
  | "aguardando_aprovacao"
  | "aprovada"
  | "dominio_host"
  | "em_producao"
  | "entregue";

const PLANS = ["Starter", "Pro", "Parceria", "Enterprise"];

const stepLabels: Record<Step, string> = {
  selecionar_plano: "Selecionando plano",
  pagamento: "Pagamento",
  descrever_projeto: "Briefing",
  proposta_enviada: "Proposta",
  desenvolvimento: "Desenvolvimento",
  aguardando_aprovacao: "Aguardando aprovação",
  aprovada: "Aprovada",
  dominio_host: "Domínio & Host",
  em_producao: "Em produção",
  entregue: "Entregue",
};

const stepColors: Record<string, string> = {
  selecionar_plano: "#8878a8",
  pagamento: "#f0c848",
  descrever_projeto: K,
  proposta_enviada: K,
  desenvolvimento: T,
  aguardando_aprovacao: "#f0c848",
  aprovada: G,
  dominio_host: T,
  em_producao: T,
  entregue: G,
};

type PropostaEntry = {
  userName: string;
  userEmail: string;
  userRole: string;
  currentStep: Step;
  selectedPlan: number | null;
  briefing: string;
  siteLink: string;
  cupomRef: string;
  cupomAplicado: boolean;
  pagamentoConfirmado: boolean;
  updatedAt: string | { toDate: () => Date };
};

export default function ProjetosParceiroPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [projetos, setProjetos] = useState<PropostaEntry[]>([]);
  const [filter, setFilter] = useState<"todos" | "ativos" | "entregues">("todos");

  // Create new project
  const [showCreate, setShowCreate] = useState(false);
  const [allUsers, setAllUsers] = useState<{ email: string; name: string; role: string }[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newPlano, setNewPlano] = useState(2); // default Parceria
  const [creating, setCreating] = useState(false);

  const processPropostas = (allData: Record<string, Record<string, unknown>>) => {
    const list = (Object.values(allData) as unknown as PropostaEntry[])
      .filter(p => p.userRole === "parceiro")
      .sort((a, b) => {
        const getTime = (v: unknown) => {
          if (!v) return 0;
          if (typeof v === "string") return new Date(v).getTime();
          if (typeof v === "object" && v !== null && "toDate" in v) return (v as { toDate: () => Date }).toDate().getTime();
          return 0;
        };
        return getTime(b.updatedAt) - getTime(a.updatedAt);
      });
    setProjetos(list);
  };

  useEffect(() => {
    const raw = localStorage.getItem("pigeonz_user");
    if (!raw) { router.push("/login"); return; }
    const parsed = JSON.parse(raw);
    if (parsed.role !== "admin") { router.push("/login"); return; }
    setUser(parsed);

    // Load from Firestore
    getAllPropostas().then(data => processPropostas(data));
    getAllUsers().then(users => setAllUsers(users.map(u => ({ email: u.email, name: u.name, role: u.role }))));

    // Real-time sync
    const unsub = onAllPropostasChange(data => processPropostas(data));
    return () => unsub();
  }, [router]);

  const criarProjeto = async () => {
    if (!newEmail.trim()) return;
    setCreating(true);
    const userInfo = allUsers.find(u => u.email === newEmail);
    await setPropostaDB(newEmail, {
      userName: userInfo?.name || newEmail.split("@")[0],
      userEmail: newEmail,
      userRole: "parceiro",
      currentStep: "descrever_projeto",
      selectedPlan: newPlano,
      briefing: "",
      siteLink: "",
      cupomRef: "",
      cupomAplicado: false,
      pagamentoConfirmado: newPlano === 2,
      comments: [],
      devDone: ["pendente", "pendente", "pendente", "pendente", "pendente", "pendente", "pendente"],
    });
    setCreating(false);
    setShowCreate(false);
    localStorage.setItem("pigeonz_admin_manage", newEmail);
    router.push("/painel/proposta");
  };

  const gerenciarProjeto = (email: string) => {
    localStorage.setItem("pigeonz_admin_manage", email);
    router.push("/painel/proposta");
  };

  const filtered = projetos.filter(p => {
    if (filter === "ativos") return p.currentStep !== "entregue";
    if (filter === "entregues") return p.currentStep === "entregue";
    return true;
  });

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
      <div style={{ maxWidth: 900, margin: "0 auto", marginBottom: 32 }}>
        <a
          onClick={() => router.push("/admin")}
          style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000", cursor: "pointer" }}
        >
          &larr; Voltar ao painel
        </a>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 17a4 4 0 0 0 8 0c0-2-2-3-2-3H7s-2 1-2 3a4 4 0 0 0 8 0"/><path d="M7 14l-2-2 3-3"/><path d="M17 14l2-2-3-3"/><path d="M12 2v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M19.07 4.93l-2.83 2.83"/>
          </svg>
          <h1 style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(12px, 2.5vw, 18px)",
            color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000",
            margin: 0,
            lineHeight: 1.6,
          }}>
            Projetos Parceiros
          </h1>
        </div>
        <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000", marginBottom: 24 }}>
          Projetos de parceiros que contrataram desenvolvimento pigeonz.ai.
        </p>

        {/* Resumo */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "16px 20px", textAlign: "center" }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#8878a8", letterSpacing: 1, display: "block", marginBottom: 8 }}>
              TOTAL
            </span>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 18, color: T }}>
              {projetos.length}
            </span>
          </div>
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "16px 20px", textAlign: "center" }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#8878a8", letterSpacing: 1, display: "block", marginBottom: 8 }}>
              ATIVOS
            </span>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 18, color: K }}>
              {projetos.filter(p => p.currentStep !== "entregue").length}
            </span>
          </div>
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "16px 20px", textAlign: "center" }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#8878a8", letterSpacing: 1, display: "block", marginBottom: 8 }}>
              ENTREGUES
            </span>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 18, color: G }}>
              {projetos.filter(p => p.currentStep === "entregue").length}
            </span>
          </div>
        </div>

        {/* Filtros + Criar */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          {([["todos", "Todos"], ["ativos", "Ativos"], ["entregues", "Entregues"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                fontFamily: "'VT323', monospace", fontSize: 16,
                padding: "6px 16px", cursor: "pointer",
                color: filter === key ? "#1c1030" : T,
                background: filter === key ? T : "transparent",
                border: `2px solid ${T}`, transition: "all 0.2s",
              }}
            >
              {label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button
            onClick={() => setShowCreate(!showCreate)}
            style={{
              fontFamily: "'Press Start 2P', monospace", fontSize: 8,
              padding: "10px 18px", letterSpacing: 1,
              color: "#1c1030", background: T,
              border: `2px solid ${T}`, cursor: "pointer",
              boxShadow: `4px 4px 0 ${T}44`, transition: "all 0.2s",
            }}
          >
            {showCreate ? "FECHAR" : "+ NOVO PROJETO"}
          </button>
        </div>

        {/* Create new project form */}
        {showCreate && (
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: T, letterSpacing: 1, marginBottom: 16 }}>
              CRIAR PROJETO PARCEIRO
            </h3>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#8878a8", display: "block", marginBottom: 6, letterSpacing: 1 }}>
                EMAIL DO PARCEIRO
              </label>
              <select
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                style={{
                  width: "100%", background: "rgba(8,7,20,0.92)",
                  border: "2px solid rgba(72,192,184,0.4)", color: "#f0ebfa",
                  fontFamily: "'VT323', monospace", fontSize: 18,
                  padding: "10px 14px", outline: "none", boxSizing: "border-box",
                }}
              >
                <option value="">Selecione...</option>
                {allUsers
                  .filter(u => u.role === "parceiro")
                  .map(u => (
                    <option key={u.email} value={u.email}>{u.name} ({u.email})</option>
                  ))
                }
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#8878a8", display: "block", marginBottom: 6, letterSpacing: 1 }}>
                PLANO
              </label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {PLANS.map((p, i) => (
                  <button key={p} onClick={() => setNewPlano(i)}
                    style={{
                      fontFamily: "'VT323', monospace", fontSize: 16,
                      padding: "6px 14px", cursor: "pointer",
                      color: newPlano === i ? "#1c1030" : T,
                      background: newPlano === i ? T : "transparent",
                      border: `2px solid ${T}`, transition: "all 0.2s",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={criarProjeto}
              disabled={!newEmail || creating}
              style={{
                fontFamily: "'Press Start 2P', monospace", fontSize: 9,
                padding: "12px 24px", letterSpacing: 2,
                color: (!newEmail || creating) ? "#6b5c85" : "#1c1030",
                background: (!newEmail || creating) ? "transparent" : G,
                border: `2px solid ${(!newEmail || creating) ? "#6b5c85" : G}`,
                cursor: (!newEmail || creating) ? "not-allowed" : "pointer",
                boxShadow: (!newEmail || creating) ? "none" : `4px 4px 0 ${G}44`,
                transition: "all 0.2s",
              }}
            >
              {creating ? "CRIANDO..." : "CRIAR E GERENCIAR"}
            </button>
          </div>
        )}

        {/* Lista */}
        {filtered.length === 0 ? (
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", textAlign: "center" }}>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#8878a8", margin: 0 }}>
              Nenhum projeto de parceiro encontrado.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((p, i) => {
              const planName = p.selectedPlan !== null ? PLANS[p.selectedPlan] || "—" : "—";
              const stepColor = stepColors[p.currentStep] || "#8878a8";
              return (
                <div key={i} className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: T }}>
                          {p.userName}
                        </span>
                        <span style={{
                          fontFamily: "'VT323', monospace", fontSize: 13,
                          color: T,
                          border: `1px solid ${T}`,
                          padding: "1px 6px",
                        }}>
                          Parceiro
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#b8a8d8" }}>
                          {p.userEmail}
                        </span>
                        <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#6b5c85" }}>
                          Plano: <strong style={{ color: T }}>{planName}</strong>
                        </span>
                      </div>
                      {p.briefing && (
                        <p style={{
                          fontFamily: "'VT323', monospace", fontSize: 15, color: "#6b5c85",
                          margin: "6px 0 0", maxWidth: 500,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          Briefing: {p.briefing}
                        </p>
                      )}
                      {p.siteLink && (
                        <div style={{ marginTop: 4 }}>
                          <a href={p.siteLink} target="_blank" rel="noopener noreferrer"
                            style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: T, textDecoration: "underline" }}>
                            {p.siteLink}
                          </a>
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                      {/* Status badge */}
                      <span style={{
                        fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                        color: stepColor,
                        border: `1px solid ${stepColor}`,
                        padding: "4px 8px", letterSpacing: 1,
                        whiteSpace: "nowrap",
                      }}>
                        {stepLabels[p.currentStep] || p.currentStep}
                      </span>

                      {p.updatedAt && (
                        <span style={{ fontFamily: "'VT323', monospace", fontSize: 13, color: "#6b5c85" }}>
                          {typeof p.updatedAt === "string" ? p.updatedAt.split("T")[0] : typeof p.updatedAt?.toDate === "function" ? p.updatedAt.toDate().toISOString().split("T")[0] : ""}
                        </span>
                      )}

                      <button
                        onClick={() => gerenciarProjeto(p.userEmail)}
                        style={{
                          fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                          padding: "8px 14px", letterSpacing: 1,
                          color: "#1c1030", background: T,
                          border: `2px solid ${T}`,
                          cursor: "pointer", transition: "all 0.2s",
                          boxShadow: `4px 4px 0 ${T}44`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        GERENCIAR
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

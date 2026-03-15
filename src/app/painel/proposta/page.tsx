"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import GlobalCityBg from "@/components/GlobalCityBg";
import ProjectChat from "@/components/ProjectChat";
import { getProposta, setProposta as setPropostaDB, onPropostaChange, getAllPropostas, getComprovantes, setComprovantes as setComprovantesDB } from "@/lib/db";

const K = "#f0a0d0";
const T = "#48c0b8";

type Comment = { author: string; role: "cliente" | "admin" | "parceiro"; text: string; date: string };

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

const ALL_STEPS: { key: Step; label: string }[] = [
  { key: "selecionar_plano", label: "Plano" },
  { key: "pagamento", label: "Pagamento" },
  { key: "descrever_projeto", label: "Briefing" },
  { key: "proposta_enviada", label: "Proposta" },
  { key: "dominio_host", label: "Domínio" },
  { key: "desenvolvimento", label: "Dev" },
  { key: "aguardando_aprovacao", label: "Aprovação" },
  { key: "aprovada", label: "Aprovada" },
  { key: "em_producao", label: "Produção" },
  { key: "entregue", label: "Entregue" },
];

const PLANS = [
  { name: "Starter", price: "R$ 2.567", color: T, features: ["Site institucional", "Até 5 páginas", "Design responsivo", "SEO básico", "1 mês de suporte"], parceria: false },
  { name: "Pro", price: "R$ 5.123", color: K, features: ["Tudo do Starter", "Loja online", "Painel admin", "Integração pagamento", "2 meses de suporte"], parceria: false },
  { name: "Parceria", price: "R$ 0", color: T, features: ["Tudo do Pro", "Loja online", "Painel admin", "Integração pagamento", "2 meses de suporte", "Plano exclusivo parceiros"], parceria: true },
  { name: "Enterprise", price: "Sob consulta", color: K, features: ["Tudo do Pro", "SaaS / sistema sob medida", "API customizada", "Infraestrutura cloud", "Suporte dedicado"], parceria: false },
];

const DEV_STEPS_ADMIN = [
  "Wireframe e layout",
  "Design das páginas",
  "Frontend (React/Next.js)",
  "Backend (Django + API)",
  "Integrações",
  "Testes e ajustes",
  "Deploy em produção",
];

const DEV_STEPS_CLIENT = [
  { title: "Planejamento", desc: "Montando a estrutura do seu site", icon: "1", bg: "#d4a017", border: "#f0c848" },
  { title: "Design", desc: "Criando o visual das páginas", icon: "2", bg: "#2e8b57", border: "#48d080" },
  { title: "Construção", desc: "Programando tudo pra funcionar", icon: "3", bg: "#6c3fc7", border: "#8b6ad4" },
  { title: "Recursos", desc: "Adicionando funções especiais", icon: "4", bg: "#2e6dd1", border: "#5a9de0" },
  { title: "Conexões", desc: "Pagamento, email, etc.", icon: "5", bg: "#c73f6c", border: "#e06090" },
  { title: "Revisão", desc: "Testando tudo antes de entregar", icon: "6", bg: "#7a5230", border: "#b07848" },
  { title: "Publicação", desc: "Colocando seu site no ar!", icon: "7", bg: "#1a1a2e", border: "#4a4a68" },
];

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
  resize: "vertical" as const,
};

export default function PropostaPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  // State persisted in localStorage
  const [currentStep, setCurrentStep] = useState<Step>("selecionar_plano");
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [briefing, setBriefing] = useState("");
  type DevStatus = "pendente" | "em_andamento" | "concluido";
  const [devDone, setDevDone] = useState<DevStatus[]>(DEV_STEPS_ADMIN.map(() => "pendente"));

  // Payment state
  const [payMethod, setPayMethod] = useState<"cartao" | "pix" | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState("");
  const [paySuccess, setPaySuccess] = useState(false);
  const [comprovante, setComprovante] = useState<{ name: string; dataUrl: string } | null>(null);
  const [comprovanteSent, setComprovanteSent] = useState(false);
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false);
  const [notaFiscal, setNotaFiscal] = useState<{ name: string; dataUrl: string } | null>(null);
  const [briefingSent, setBriefingSent] = useState(false);
  const [propostaPdf, setPropostaPdf] = useState<{ name: string; url: string } | null>(null);
  const [siteLink, setSiteLink] = useState("");
  const [dominio, setDominio] = useState("");
  const [hospedagem, setHospedagem] = useState("");
  const [firebaseEmail, setFirebaseEmail] = useState("");
  const [firebaseSenha, setFirebaseSenha] = useState("");
  const [propostaLink, setPropostaLink] = useState("");
  const [showFirebasePass, setShowFirebasePass] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [showTermos, setShowTermos] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [cupomRef, setCupomRef] = useState("");
  const [cupomAplicado, setCupomAplicado] = useState(false);
  const [cupomError, setCupomError] = useState("");
  const [devNotes, setDevNotes] = useState("");
  const [adminProjectNotes, setAdminProjectNotes] = useState("");
  const [devDropOpen, setDevDropOpen] = useState<number | null>(null);

  // Track if admin is managing another user's project
  const [managingEmail, setManagingEmail] = useState<string | null>(null);
  const [managingName, setManagingName] = useState<string | null>(null);

  const loadPropostaData = (data: Record<string, unknown>) => {
    setCurrentStep((data.currentStep as Step) || "selecionar_plano");
    setSelectedPlan((data.selectedPlan as number | null) ?? null);
    setBriefing((data.briefing as string) || "");
    const rawDev = (data.devDone as (boolean | DevStatus)[]) || DEV_STEPS_ADMIN.map(() => "pendente");
    setDevDone(rawDev.map(v => typeof v === "boolean" ? (v ? "concluido" : "pendente") : (v || "pendente")) as DevStatus[]);
    setComments((data.comments as Comment[]) || []);
    if (data.propostaPdf) setPropostaPdf(data.propostaPdf as { name: string; url: string });
    if (data.siteLink) setSiteLink(data.siteLink as string);
    if (data.dominio) setDominio(data.dominio as string);
    if (data.hospedagem) setHospedagem(data.hospedagem as string);
    if (data.firebaseEmail) setFirebaseEmail(data.firebaseEmail as string);
    if (data.firebaseSenha) setFirebaseSenha(data.firebaseSenha as string);
    if (data.propostaLink) setPropostaLink(data.propostaLink as string);
    if (data.aceitouTermos) setAceitouTermos(data.aceitouTermos as boolean);
    if (data.cupomAplicado) setCupomAplicado(data.cupomAplicado as boolean);
    if (data.cupomRef) setCupomRef(data.cupomRef as string);
    if (data.comprovante) setComprovante(data.comprovante as { name: string; dataUrl: string });
    if (data.comprovanteSent) setComprovanteSent(data.comprovanteSent as boolean);
    if (data.pagamentoConfirmado) setPagamentoConfirmado(data.pagamentoConfirmado as boolean);
    if (data.notaFiscal) setNotaFiscal(data.notaFiscal as { name: string; dataUrl: string });
    if (data.devNotes) setDevNotes(data.devNotes as string);
    if (data.adminProjectNotes) setAdminProjectNotes(data.adminProjectNotes as string);
  };

  const initialized = useRef(false);
  const skipNextSync = useRef(false);

  useEffect(() => {
    const raw = localStorage.getItem("pigeonz_user");
    if (!raw) { router.push("/login"); return; }
    const userData = JSON.parse(raw);
    setUser(userData);

    // Check if admin is managing a specific user's project
    const adminManage = localStorage.getItem("pigeonz_admin_manage");
    let loadEmail = userData.email;

    const loadFromFirestore = async () => {
      if (userData.role === "admin" && adminManage) {
        loadEmail = adminManage;
        setManagingEmail(adminManage);
        localStorage.removeItem("pigeonz_admin_manage");

        // Load from Firestore
        const target = await getProposta(adminManage);
        if (target) {
          setManagingName((target.userName as string) || adminManage);
          loadPropostaData(target);
          const step = target.currentStep as string;
          if (step === "selecionar_plano" || step === "pagamento") {
            setCurrentStep("descrever_projeto");
          }
          if (adminManage === "bluezonesalesmkt@gmail.com" && !target.propostaLink) {
            setPropostaLink("/propostas/plano-blue-zone.html");
          }
          initialized.current = true;
          return;
        }
      }

      // Load from Firestore
      const dataToLoad = await getProposta(loadEmail);
      if (dataToLoad) {
        loadPropostaData(dataToLoad);
        const step = dataToLoad.currentStep as string;
        if (step !== "selecionar_plano" && step !== "pagamento" && step !== "descrever_projeto") {
        setCurrentStep("descrever_projeto");
      }
    }

      // Auto-fill referral from user data
      if (userData.ref && !cupomAplicado) {
        setCupomRef(userData.ref);
      }

      // Blue Zone: auto-select Enterprise (grátis) and skip to briefing
      if (userData.email === "bluezonesalesmkt@gmail.com" && !dataToLoad) {
        setSelectedPlan(3); // Enterprise
        setCurrentStep("descrever_projeto");
        setPropostaLink("/propostas/plano-blue-zone.html");
      }
      if (userData.email === "bluezonesalesmkt@gmail.com" && dataToLoad && !dataToLoad.propostaLink) {
        setPropostaLink("/propostas/plano-blue-zone.html");
      }

      // Auto-check if admin confirmed payment (from Firestore)
      const comps = await getComprovantes();
      const mine = (comps as { email: string; status: string; notaFiscal?: { name: string; dataUrl: string } }[]).find(c => c.email === loadEmail && c.status === "confirmado");
      if (mine) {
        setPagamentoConfirmado(true);
        setComprovanteSent(true);
        if (mine.notaFiscal) setNotaFiscal(mine.notaFiscal);
      }

      initialized.current = true;
    };

    loadFromFirestore();

    // Real-time sync: listen for changes from OTHER devices
    const targetEmail = (userData.role === "admin" && adminManage) ? adminManage : userData.email;
    const unsub = onPropostaChange(targetEmail, (data) => {
      if (data && initialized.current) {
        // Skip if this update was triggered by our own save
        if (skipNextSync.current) {
          skipNextSync.current = false;
          return;
        }
        loadPropostaData(data);
      }
    });
    return () => unsub();
  }, [router]);

  // Save state to Firestore
  useEffect(() => {
    if (!user || !initialized.current) return;
    const propostaData = {
      currentStep, selectedPlan, briefing, devDone, comments, propostaPdf, propostaLink, aceitouTermos, siteLink, dominio, hospedagem, firebaseEmail, firebaseSenha, cupomAplicado, cupomRef, comprovante, comprovanteSent, pagamentoConfirmado, notaFiscal, devNotes, adminProjectNotes,
    };

    const targetEmail = managingEmail || user.email;
    const targetName = managingName || user.name;

    // Save to Firestore — skip the next onSnapshot to avoid loop
    skipNextSync.current = true;
    setPropostaDB(targetEmail, {
      ...propostaData,
      userName: targetName,
      userEmail: targetEmail,
      userRole: managingEmail ? "parceiro" : user.role,
    });
  }, [currentStep, selectedPlan, briefing, devDone, comments, propostaPdf, propostaLink, aceitouTermos, siteLink, dominio, hospedagem, firebaseEmail, firebaseSenha, cupomAplicado, cupomRef, comprovante, comprovanteSent, pagamentoConfirmado, notaFiscal, devNotes, adminProjectNotes, user, managingEmail, managingName]);

  const isAdmin = user?.role === "admin";
  const isBlueZone = user?.email === "bluezonesalesmkt@gmail.com";
  const isParceria = selectedPlan !== null && PLANS[selectedPlan]?.parceria;

  // Desconto parceria
  const calcDesconto = (priceStr: string) => {
    const num = parseFloat(priceStr.replace(/[^\d,]/g, "").replace(",", "."));
    if (isNaN(num)) return priceStr;
    const desc = num * 0.7;
    return "R$ " + desc.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };
  const precoFinal = isBlueZone ? "R$ 0" :
    selectedPlan !== null && cupomAplicado && !PLANS[selectedPlan].parceria && PLANS[selectedPlan].name !== "Enterprise"
    ? calcDesconto(PLANS[selectedPlan].price) : (selectedPlan !== null ? PLANS[selectedPlan].price : "");
  const isManaging = isAdmin && !!managingEmail;
  const visibleSteps = isManaging
    ? ALL_STEPS.filter(s => s.key !== "selecionar_plano" && s.key !== "pagamento")
    : isBlueZone
      ? ALL_STEPS.filter(s => s.key !== "selecionar_plano" && s.key !== "pagamento")
      : isParceria
        ? ALL_STEPS.filter(s => s.key !== "pagamento")
        : ALL_STEPS;
  const currentStepIdx = visibleSteps.findIndex(s => s.key === currentStep);

  const goBack = () => {
    const idx = visibleSteps.findIndex(s => s.key === currentStep);
    if (idx > 0) setCurrentStep(visibleSteps[idx - 1].key);
  };

  const backBtn = (
    <button
      onClick={goBack}
      style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#6b5c85", background: "transparent", border: "none", cursor: "pointer", marginTop: 16, transition: "color 0.2s", display: "block" }}
      onMouseEnter={e => e.currentTarget.style.color = T}
      onMouseLeave={e => e.currentTarget.style.color = "#6b5c85"}
    >
      ← Voltar ao passo anterior
    </button>
  );

  const addComment = () => {
    if (!newComment.trim() || !user) return;
    setComments(prev => [...prev, {
      author: user.name,
      role: user.role as "cliente" | "admin" | "parceiro",
      text: newComment.trim(),
      date: new Date().toISOString().split("T")[0],
    }]);
    setNewComment("");
  };

  // Admin: advance step
  const advanceStep = () => {
    const idx = visibleSteps.findIndex(s => s.key === currentStep);
    if (idx < visibleSteps.length - 1) setCurrentStep(visibleSteps[idx + 1].key);
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
      <div style={{ maxWidth: 900, margin: "0 auto", marginBottom: 32 }}>
        <a
          onClick={() => router.push(isAdmin ? (managingEmail ? "/painel/projetos" : "/admin") : "/painel")}
          style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000", cursor: "pointer" }}
        >
          &larr; {managingEmail ? "Voltar aos projetos" : "Voltar ao painel"}
        </a>
      </div>

      <div className="a-fadeup" style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Admin managing banner */}
        {managingEmail && (
          <div style={{
            padding: "12px 16px", marginBottom: 16,
            background: "rgba(240,160,208,0.1)", border: `2px solid ${K}44`,
            display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          }}>
            <span style={{ fontFamily: "'VT323', monospace", fontSize: 14, color: "#ff6060", border: "1px solid #ff6060", padding: "2px 8px" }}>
              ADMIN
            </span>
            <span style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#b8a8d8" }}>
              Gerenciando projeto de: <strong style={{ color: K }}>{managingName || managingEmail}</strong>
            </span>
          </div>
        )}

        {/* Title */}
        <h1 style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(12px, 2.5vw, 20px)",
          color: K,
          margin: "0 0 8px",
          lineHeight: 1.6,
        }}>
          {managingEmail ? `Projeto: ${managingName}` : "Proposta e Projeto"}
        </h1>
        {/* Botão novo plano — visível quando já passou da seleção */}
        {!isBlueZone && currentStep !== "selecionar_plano" && currentStep !== "entregue" && (
          <button
            onClick={() => {
              if (!confirm("Tem certeza? Isso vai iniciar uma nova contratação.")) return;
              setCurrentStep("selecionar_plano");
              setSelectedPlan(null);
              setBriefing("");
              setBriefingSent(false);
              setPayMethod(null);
              setPaySuccess(false);
              setComprovante(null);
              setComprovanteSent(false);
              setPagamentoConfirmado(false);
              setNotaFiscal(null);
              setCupomRef("");
              setCupomAplicado(false);
              setPropostaPdf(null);
              setPropostaLink("");
              setSiteLink("");
              setDominio("");
              setHospedagem("");
              setFirebaseEmail("");
              setFirebaseSenha("");
              setAceitouTermos(false);
              setDevDone(DEV_STEPS_ADMIN.map(() => "pendente"));
              setComments([]);
              // State reset triggers Firestore save via effect
            }}
            style={{
              fontFamily: "'VT323', monospace", fontSize: 16,
              padding: "6px 14px", color: T, background: "transparent",
              border: `1px solid ${T}66`, cursor: "pointer",
              transition: "all 0.2s", marginBottom: 16,
            }}
          >
            + Contratar novo plano
          </button>
        )}

        {selectedPlan !== null && (
          <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#6b5c85", marginBottom: 24 }}>
            Plano: <span style={{ color: PLANS[selectedPlan].color }}>{PLANS[selectedPlan].name}</span> —{" "}
            {cupomAplicado && !PLANS[selectedPlan].parceria && PLANS[selectedPlan].name !== "Enterprise" ? (
              <>
                <span style={{ textDecoration: "line-through", marginRight: 6 }}>{PLANS[selectedPlan].price}</span>
                <span style={{ color: "#48e8a0" }}>{precoFinal}</span>
              </>
            ) : (
              PLANS[selectedPlan].price
            )}
          </p>
        )}

        {/* Progress bar */}
        <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "20px 16px", marginBottom: 24, overflowX: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 0, minWidth: 700 }}>
            {visibleSteps.map((step, i) => {
              const done = i < currentStepIdx;
              const active = i === currentStepIdx;
              const clickable = true;
              return (
                <div key={step.key} style={{ display: "flex", alignItems: "center", flex: i < visibleSteps.length - 1 ? 1 : "none" }}>
                  <div
                    onClick={() => { if (clickable) setCurrentStep(step.key); }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 50, cursor: clickable ? "pointer" : "default", transition: "opacity 0.2s" }}
                    onMouseEnter={e => { if (clickable) e.currentTarget.style.opacity = "0.75"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                  >
                    <div style={{
                      width: 22, height: 22,
                      background: done ? T : active ? K : "rgba(96,64,160,0.3)",
                      border: `2px solid ${done ? T : active ? K : "#4a3070"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'VT323', monospace", fontSize: 13,
                      color: done || active ? "#0f0c1e" : "#6b5c85",
                      boxShadow: active ? `0 0 12px ${K}66` : "none",
                    }}>
                      {done ? "✓" : i + 1}
                    </div>
                    <span style={{
                      fontFamily: "'VT323', monospace", fontSize: 11,
                      color: done ? T : active ? K : "#6b5c85",
                      textAlign: "center", whiteSpace: "nowrap",
                    }}>
                      {step.label}
                    </span>
                  </div>
                  {i < ALL_STEPS.length - 1 && (
                    <div style={{ flex: 1, height: 2, background: done ? T : "rgba(96,64,160,0.3)", minWidth: 10, marginBottom: 18 }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── STEP: Selecionar Plano ── */}
        {currentStep === "selecionar_plano" && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: 22, color: K, letterSpacing: 4, marginBottom: 8 }}>
                {"// PASSO 1"}
              </div>
              <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(12px, 2vw, 18px)", color: T, margin: 0, lineHeight: 1.4 }}>
                SELECIONE SEU PLANO
              </h3>
              <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#ffffff", marginTop: 12, maxWidth: 600, marginLeft: "auto", marginRight: "auto", textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}>
                Escolha o plano que melhor se encaixa no seu projeto. Você pode mudar depois conversando com a equipe.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, alignItems: "stretch", justifyItems: "center" }}>
              {PLANS.map((plan, i) => {
                // Parceria só aparece para parceiros e admin
                if (plan.parceria && !isAdmin && user?.role !== "parceiro") return null;
                const highlight = plan.parceria ? true : i === 1;
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedPlan(i)}
                    style={{
                      background: highlight ? "rgba(240,160,208,0.1)" : "rgba(22,14,40,0.85)",
                      border: `2px solid ${selectedPlan === i ? plan.color : plan.color + "55"}`,
                      padding: "12px 14px",
                      position: "relative",
                      transform: highlight ? "scale(1.02)" : "scale(1)",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      width: "100%",
                      transition: "all 0.2s",
                      boxShadow: selectedPlan === i ? `0 0 24px ${plan.color}44, 0 0 48px ${plan.color}22` : "none",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = highlight ? "scale(1.02) translateY(-6px)" : "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 0 32px ${plan.color}88, 0 0 64px ${plan.color}33`; e.currentTarget.style.borderColor = plan.color + "cc"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = highlight ? "scale(1.02)" : "scale(1)"; e.currentTarget.style.boxShadow = selectedPlan === i ? `0 0 24px ${plan.color}44` : "none"; e.currentTarget.style.borderColor = selectedPlan === i ? plan.color : plan.color + "55"; }}
                  >
                    {/* Badge */}
                    {(i === 1 || plan.parceria) && (
                      <div style={{
                        position: "absolute",
                        top: -14, left: "50%",
                        transform: "translateX(-50%)",
                        background: plan.parceria ? T : K,
                        color: "#1c1030",
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 8,
                        padding: "5px 10px",
                        border: `2px solid ${plan.parceria ? T : K}`,
                        whiteSpace: "nowrap",
                      }}>
                        {plan.parceria ? "PARCERIA" : "MAIS POPULAR"}
                      </div>
                    )}

                    <div style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: plan.color, letterSpacing: 2, marginBottom: 0 }}>
                      {plan.name === "Starter" ? "// básico" : plan.name === "Pro" ? "// recomendado" : plan.parceria ? "// exclusivo" : "// escalável"}
                    </div>

                    <h4 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 16, color: plan.color, margin: "0 0 8px" }}>
                      {plan.name}
                    </h4>

                    <div style={{ marginBottom: 8, paddingBottom: 8, borderBottom: `2px dashed ${plan.color}44` }}>
                      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 13, color: "#fce8f8", marginBottom: 2, lineHeight: 1.4 }}>
                        {plan.price}
                      </div>
                      <div style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: plan.color + "99" }}>
                        {plan.parceria ? "Sem custo para parceiros" : plan.name === "Enterprise" ? "Projeto personalizado" : "Pagamento único"}
                      </div>
                    </div>

                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 8px 0", display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
                      {plan.features.map((f, fi) => (
                        <li key={fi} style={{
                          fontFamily: "'VT323', monospace",
                          fontSize: 18,
                          color: "#c4b9e0",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                        }}>
                          <span style={{ color: plan.color, flexShrink: 0 }}>▸</span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    {plan.name === "Enterprise" ? (
                      <a
                        href="https://wa.me/5531999999999?text=Olá! Tenho interesse no plano Enterprise."
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="btn btn-p"
                        style={{
                          display: "block",
                          textAlign: "center",
                          background: "transparent",
                          color: plan.color,
                          borderColor: plan.color,
                          boxShadow: `4px 4px 0 ${plan.color}44`,
                          fontSize: 11,
                          padding: "14px 32px",
                          letterSpacing: 2,
                          marginTop: "auto",
                          textDecoration: "none",
                        }}
                      >
                        FALE COM O COMERCIAL
                      </a>
                    ) : (
                      <button
                        onClick={e => { e.stopPropagation(); setSelectedPlan(i); setCurrentStep(PLANS[i].parceria ? "descrever_projeto" : "pagamento"); }}
                        className="btn btn-p"
                        style={{
                          display: "block",
                          textAlign: "center",
                          width: "100%",
                          background: highlight ? plan.color : "transparent",
                          color: highlight ? "#1c1030" : plan.color,
                          borderColor: plan.color,
                          boxShadow: `4px 4px 0 ${plan.color}44`,
                          fontSize: 11,
                          padding: "14px 32px",
                          letterSpacing: 2,
                          marginTop: "auto",
                        }}
                      >
                        CONTRATAR PLANO
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP: Descrever projeto ── */}
        {currentStep === "descrever_projeto" && (
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: K, margin: "0 0 6px", letterSpacing: 1 }}>
              3. BRIEFING DO PROJETO
            </h3>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 19, color: "#ffffff", margin: "0 0 16px", lineHeight: 1.4, textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}>
              {isAdmin ? "Aqui fica o briefing que o cliente enviou descrevendo o que ele precisa." : "Conte com suas palavras o que você precisa. Pode ser simples, tipo: \"Quero um site pra minha loja\" ou \"Preciso de uma plataforma de cursos\". A gente entende e transforma em realidade!"}
            </p>

            {(isManaging || isAdmin) ? (
              /* Admin view: read-only briefing */
              <>
                <div style={{
                  padding: "10px 14px", marginBottom: 16,
                  background: briefing.trim() ? "rgba(72,232,160,0.08)" : "rgba(240,200,72,0.08)",
                  borderLeft: `3px solid ${briefing.trim() ? "#48e8a0" : "#f0c848"}`,
                }}>
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: briefing.trim() ? "#48e8a0" : "#f0c848" }}>
                    {briefing.trim() ? "✓ Briefing recebido" : "⏳ Aguardando briefing do cliente"}
                  </span>
                  {briefing.trim() && (
                    <div style={{
                      marginTop: 12, padding: "14px 16px",
                      background: "rgba(240,160,208,0.06)",
                      border: `1px solid ${K}33`,
                    }}>
                      <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#c8b8e0", margin: 0, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                        {briefing}
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setCurrentStep("proposta_enviada")}
                  className="btn btn-p"
                  style={{}}
                >
                  PRÓXIMA PÁGINA →
                </button>
                {backBtn}
              </>
            ) : (
              /* Client view */
              <>
                {!briefingSent ? (
                  <>
                    <textarea
                      value={briefing}
                      onChange={e => setBriefing(e.target.value)}
                      placeholder="Descreva aqui o que você imagina pro seu projeto..."
                      rows={5}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = K}
                      onBlur={e => e.target.style.borderColor = "rgba(208,88,160,0.4)"}
                    />
                    <button
                      onClick={() => { if (briefing.trim().length > 10) setBriefingSent(true); }}
                      className="btn btn-p"
                      style={{
                        marginTop: 16,
                        opacity: briefing.trim().length > 10 ? 1 : 0.5,
                      }}
                      disabled={briefing.trim().length <= 10}
                    >
                      ENVIAR BRIEFING
                    </button>
                    {backBtn}
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "24px 0" }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 56, height: 56, marginBottom: 16,
                      background: "rgba(240,160,208,0.15)", border: `3px solid ${K}`,
                    }}>
                      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 12, color: K, margin: "0 0 8px" }}>
                      BRIEFING ENVIADO!
                    </p>
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#c8b8e0", margin: "0 0 20px" }}>
                      Recebemos sua descrição. Vamos analisar e iniciar o projeto!
                    </p>
                    <button
                      onClick={() => { setBriefingSent(false); setCurrentStep("proposta_enviada"); }}
                      className="btn btn-p"
                      style={{}}
                    >
                      PRÓXIMO PASSO →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── STEP: Pagamento ── */}
        {currentStep === "pagamento" && selectedPlan !== null && (
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: T, margin: "0 0 6px", letterSpacing: 1 }}>
              2. PAGAMENTO
            </h3>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 19, color: "#ffffff", margin: "0 0 12px", lineHeight: 1.4, textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}>
              Realize o pagamento do plano escolhido. Após confirmação, vamos iniciar o seu projeto.
            </p>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#c8b8e0", marginBottom: 4 }}>
              Plano: <span style={{ color: PLANS[selectedPlan].color }}>{PLANS[selectedPlan].name}</span> —{" "}
              {cupomAplicado ? (
                <>
                  <span style={{ color: "#6b5c85", textDecoration: "line-through", marginRight: 8 }}>{PLANS[selectedPlan].price}</span>
                  <span style={{ color: "#48e8a0", fontWeight: "bold" }}>{precoFinal}</span>
                  <span style={{ color: "#48e8a0", fontSize: 16, marginLeft: 6 }}></span>
                </>
              ) : (
                <span style={{ color: "#f0ebfa" }}>{PLANS[selectedPlan].price}</span>
              )}
            </p>

            {/* Link de parceria / Cupom */}
            {!isAdmin && (
              <div style={{
                padding: "14px 16px",
                background: cupomAplicado ? "rgba(72,232,160,0.08)" : "rgba(72,192,184,0.04)",
                border: `1px solid ${cupomAplicado ? "#48e8a044" : T + "33"}`,
                marginBottom: 16,
                marginTop: 8,
              }}>
                <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: T, margin: "0 0 8px" }}>
                  Tem um link de parceria? Cole abaixo para ganhar 30% de desconto!
                </p>
                {cupomAplicado ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#48e8a0" }}>
                      ✓ Desconto de 30% aplicado! Indicado por: <strong>{cupomRef}</strong>
                    </span>
                    <button
                      onClick={() => { setCupomAplicado(false); setCupomRef(""); setCupomError(""); }}
                      style={{
                        fontFamily: "'VT323', monospace", fontSize: 14, color: "#ff6060",
                        background: "transparent", border: "none", cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                    <input
                      value={cupomRef}
                      onChange={e => { setCupomRef(e.target.value); setCupomError(""); }}
                      placeholder="Cole o link ou email do parceiro"
                      style={{
                        ...inputStyle,
                        flex: 1,
                        fontSize: 16,
                        padding: "8px 12px",
                        borderColor: `${T}66`,
                      }}
                      onFocus={e => e.target.style.borderColor = T}
                      onBlur={e => e.target.style.borderColor = `${T}66`}
                    />
                    <button
                      onClick={() => {
                        if (!cupomRef.trim()) { setCupomError("Cole o link ou email do parceiro."); return; }
                        // Extrair email do link ou usar direto
                        let refEmail = cupomRef.trim();
                        const match = refEmail.match(/[?&]ref=([^&]+)/);
                        if (match) refEmail = decodeURIComponent(match[1]);
                        if (!refEmail.includes("@")) { setCupomError("Link ou email inválido."); return; }
                        setCupomRef(refEmail);
                        setCupomAplicado(true);
                        setCupomError("");
                      }}
                      style={{
                        fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                        padding: "8px 16px", letterSpacing: 1,
                        color: "#1c1030", background: T, border: `2px solid ${T}`,
                        cursor: "pointer", whiteSpace: "nowrap",
                        transition: "all 0.2s",
                      }}
                    >
                      APLICAR
                    </button>
                  </div>
                )}
                {cupomError && (
                  <p style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#ff6060", margin: "6px 0 0" }}>
                    {cupomError}
                  </p>
                )}
              </div>
            )}

            {isAdmin ? (
              <button
                onClick={() => setCurrentStep("proposta_enviada")}
                className="btn btn-p"
                style={{ marginTop: 12 }}
              >
                CONFIRMAR PAGAMENTO (ADM)
              </button>
            ) : (
              <>
                {/* Método de pagamento */}
                {!paySuccess && !comprovanteSent && !pagamentoConfirmado && (
                <div style={{ marginTop: 12 }}>
                  <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: "#8878a8", margin: "0 0 16px", letterSpacing: 1 }}>
                    Método de pagamento:
                  </p>
                  <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                    {/* Pix - habilitado */}
                    <button
                      onClick={() => { setPayMethod("pix"); setPayError(""); }}
                      style={{
                        flex: 1, padding: "20px 14px", cursor: "pointer",
                        border: `3px solid ${payMethod === "pix" ? T : "rgba(96,64,160,0.3)"}`,
                        background: payMethod === "pix" ? "rgba(72,192,184,0.12)" : "transparent",
                        color: payMethod === "pix" ? T : "#6b5c85",
                        transition: "all 0.2s",
                        boxShadow: payMethod === "pix" ? `0 0 20px ${T}33, inset 0 0 20px ${T}11` : "none",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <rect x={2} y={2} width={20} height={20} rx={2} transform="rotate(45 12 12)"/>
                          <line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                        </svg>
                        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, color: "#fff" }}>Pix</span>
                      </div>
                    </button>
                    {/* Cartão - indisponível */}
                    <div
                      style={{
                        flex: 1, padding: "20px 14px",
                        border: "3px solid rgba(96,64,160,0.15)",
                        background: "rgba(96,64,160,0.03)",
                        color: "#3a2860",
                        opacity: 0.45,
                        cursor: "not-allowed",
                        position: "relative",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <svg width={56} height={40} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <rect x={1} y={4} width={22} height={16} rx={2} ry={2}/><line x1="1" y1="10" x2="23" y2="10"/>
                        </svg>
                        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, color: "#fff" }}>Cartão</span>
                        <span style={{
                          fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                          color: "#f0a050", border: "1px solid #f0a050",
                          padding: "3px 10px", letterSpacing: 1,
                          opacity: 2.2,
                        }}>
                          EM BREVE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                )}

                {/* Pix */}
                {payMethod === "pix" && !paySuccess && (
                  <div style={{ textAlign: "center" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        selectedPlan === 0
                          ? (cupomAplicado ? "/qr-starter-desc.jpg" : "/qr-starter.jpg")
                          : (cupomAplicado ? "/qr-pro-desc.jpg" : "/qr-pro.jpg")
                      }
                      alt="QR Code Pix"
                      style={{
                        width: 280, height: "auto",
                        margin: "0 auto 16px",
                        display: "block",
                        borderRadius: 4,
                      }}
                    />
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#f0ebfa", marginBottom: 4 }}>
                      Valor: <strong style={{ color: "#48e8a0" }}>{precoFinal}</strong>
                      {cupomAplicado && (
                        <span style={{ color: "#6b5c85", fontSize: 16, marginLeft: 8, textDecoration: "line-through" }}>
                          {PLANS[selectedPlan].price}
                        </span>
                      )}
                    </p>
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#8878a8", marginBottom: 4 }}>
                      SARAH FIGUEIREDO B SANTIAGO
                    </p>
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#8878a8", marginBottom: 20 }}>
                      Escaneie o QR Code com o app do seu banco para pagar via Pix.
                    </p>
                    <button
                      onClick={() => {
                        setPayLoading(true);
                        setTimeout(() => { setPayLoading(false); setPaySuccess(true); }, 2000);
                      }}
                      className="btn btn-p"
                      disabled={payLoading}
                      style={{ opacity: payLoading ? 0.7 : 1 }}
                    >
                      {payLoading ? "CONFIRMANDO..." : "JÁ PAGUEI"}
                    </button>
                  </div>
                )}

                {/* Upload comprovante */}
                {paySuccess && !comprovanteSent && (
                  <div style={{ textAlign: "center", padding: "24px 0" }}>
                    <svg width={42} height={42} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: T, margin: "0 0 8px", lineHeight: 1.6 }}>
                      ENVIAR COMPROVANTE
                    </p>
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#8878a8", margin: "0 0 20px" }}>
                      Envie o comprovante de pagamento (PDF, PNG, JPG) para validarmos.
                    </p>

                    {comprovante ? (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 10,
                          padding: "10px 16px", background: "rgba(72,232,160,0.08)",
                          border: "1px solid #48e8a044",
                        }}>
                          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          <span style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: "#48e8a0" }}>
                            {comprovante.name}
                          </span>
                          <button
                            onClick={() => setComprovante(null)}
                            style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#ff6060", background: "transparent", border: "none", cursor: "pointer" }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label style={{
                        display: "inline-block",
                        fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                        padding: "14px 28px", letterSpacing: 1,
                        color: T, border: `2px dashed ${T}66`,
                        cursor: "pointer", transition: "all 0.2s",
                        marginBottom: 16,
                      }}>
                        SELECIONAR ARQUIVO
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          style={{ display: "none" }}
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = async () => {
                              const raw = reader.result as string;
                              const compressed = raw.startsWith("data:image") ? await new Promise<string>(resolve => {
                                const img = new Image();
                                img.onload = () => {
                                  const c = document.createElement("canvas");
                                  const r = Math.min(1024 / img.width, 1);
                                  c.width = img.width * r; c.height = img.height * r;
                                  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
                                  resolve(c.toDataURL("image/jpeg", 0.5));
                                };
                                img.onerror = () => resolve(raw);
                                img.src = raw;
                              }) : raw;
                              setComprovante({ name: file.name, dataUrl: compressed });
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    )}

                    <div>
                      <button
                        onClick={() => {
                          if (!comprovante || !user) return;
                          // Save comprovante to Firestore
                          const userData = JSON.parse(localStorage.getItem("pigeonz_user") || "{}");
                          getComprovantes().then(existing => {
                            const arr = existing as unknown[];
                            arr.push({
                              cliente: user.name,
                              email: user.email,
                              plano: selectedPlan !== null ? PLANS[selectedPlan].name : "",
                              valorPlano: selectedPlan !== null ? PLANS[selectedPlan].price : "",
                              valor: precoFinal,
                              comprovante,
                              data: new Date().toISOString().split("T")[0],
                              status: "pendente",
                              notaFiscal: null,
                              cupomRef: cupomRef || null,
                              cpfCnpj: userData.cpfCnpj || "",
                              razaoSocial: userData.razaoSocial || "",
                              endereco: userData.endereco || "",
                              municipio: userData.municipio || "",
                              uf: userData.uf || "",
                            });
                            setComprovantesDB(arr);
                          });
                          setComprovanteSent(true);
                        }}
                        className="btn btn-p"
                        disabled={!comprovante}
                        style={{
                          opacity: comprovante ? 1 : 0.5,
                          cursor: comprovante ? "pointer" : "not-allowed",
                        }}
                      >
                        ENVIAR COMPROVANTE
                      </button>
                    </div>
                  </div>
                )}

                {/* Aguardando confirmação do admin */}
                {comprovanteSent && !pagamentoConfirmado && (
                  <div style={{ textAlign: "center", padding: "24px 0" }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 56, height: 56, marginBottom: 16,
                      background: "rgba(240,160,208,0.1)", border: `3px solid ${K}`,
                      animation: "pulse 2s ease-in-out infinite",
                    }}>
                      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx={12} cy={12} r={10}/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                    </div>
                    <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: K, margin: "0 0 8px", lineHeight: 1.6 }}>
                      COMPROVANTE ENVIADO!
                    </p>
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#c8b8e0", margin: "0 0 8px" }}>
                      Aguardando confirmação da equipe pigeonz.ai.
                    </p>
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: "#8878a8", margin: "0 0 20px" }}>
                      Você receberá a nota fiscal assim que o pagamento for confirmado.
                    </p>
                    <a
                      href="https://wa.me/5531999999999?text=Ol%C3%A1%2C%20enviei%20o%20comprovante%20de%20pagamento%20na%20plataforma%20pigeonz.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        fontFamily: "'VT323', monospace", fontSize: 18,
                        padding: "10px 20px", color: "#25D366", background: "transparent",
                        border: "1px solid #25D36666", cursor: "pointer",
                        textDecoration: "none", transition: "all 0.2s", marginBottom: 16,
                      }}
                    >
                      <svg width={18} height={18} viewBox="0 0 24 24" fill="#25D366">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Fale com o comercial
                    </a>
                    <div>
                    </div>
                    <button
                      onClick={() => {
                        // Check if admin confirmed (from Firestore)
                        getComprovantes().then(comps => {
                          const mine = (comps as { email: string; status: string; notaFiscal?: { name: string; dataUrl: string } }[]).find(c => c.email === user?.email && c.status === "confirmado");
                          if (mine) {
                            setPagamentoConfirmado(true);
                            if (mine.notaFiscal) setNotaFiscal(mine.notaFiscal);
                          } else {
                            alert("Ainda não confirmado. Tente novamente em breve.");
                          }
                        });
                      }}
                      style={{
                        fontFamily: "'VT323', monospace", fontSize: 18,
                        padding: "10px 24px", color: T, background: "transparent",
                        border: `1px solid ${T}66`, cursor: "pointer", transition: "all 0.2s",
                      }}
                    >
                      ↻ Verificar status
                    </button>
                  </div>
                )}

                {/* Pagamento confirmado + nota fiscal */}
                {pagamentoConfirmado && (
                  <div style={{ textAlign: "center", padding: "24px 0" }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 56, height: 56, marginBottom: 16,
                      background: "rgba(72,232,160,0.15)", border: "3px solid #48e8a0",
                    }}>
                      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#48e8a0" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 12, color: "#48e8a0", margin: "0 0 8px" }}>
                      PAGAMENTO CONFIRMADO!
                    </p>
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#c8b8e0", margin: "0 0 12px" }}>
                      Tudo certo! Agora descreva seu projeto para iniciarmos.
                    </p>

                    {notaFiscal && (
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 10,
                        padding: "10px 16px", background: "rgba(72,192,184,0.08)",
                        border: `1px solid ${T}44`, marginBottom: 16,
                        cursor: "pointer",
                      }}
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = notaFiscal.dataUrl;
                          a.download = notaFiscal.name;
                          a.click();
                        }}
                      >
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        <span style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: T }}>
                          Baixar Nota Fiscal: {notaFiscal.name}
                        </span>
                      </div>
                    )}

                    <div>
                      <button
                        onClick={() => { setCurrentStep("descrever_projeto"); }}
                        className="btn btn-p"
                        style={{}}
                      >
                        PRÓXIMO PASSO →
                      </button>
                    </div>
                  </div>
                )}

                {/* Voltar */}
                {!paySuccess && !payLoading && !comprovanteSent && !pagamentoConfirmado && backBtn}
              </>
            )}
          </div>
        )}

        {/* ── STEP: Proposta enviada ── */}
        {currentStep === "proposta_enviada" && (
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: K, margin: "0 0 6px", letterSpacing: 1 }}>
              4. PROPOSTA
            </h3>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 19, color: "#ffffff", margin: "0 0 16px", lineHeight: 1.4, textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}>
              {isAdmin ? "Envie a proposta para o cliente em PDF ou link web. O cliente precisa revisar e aceitar os termos para avançar." : "Aqui você recebe a proposta do seu projeto. Leia com atenção, veja todos os detalhes e, se estiver de acordo, aceite os termos para seguir em frente."}
            </p>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#8878a8", marginBottom: 12 }}>
              {isAdmin ? "Briefing do cliente:" : "Seu briefing:"}
            </p>
            <div style={{ padding: "12px 16px", background: "rgba(240,160,208,0.08)", borderLeft: `3px solid ${K}`, marginBottom: 16 }}>
              <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#c8b8e0", margin: 0, lineHeight: 1.5 }}>
                {briefing}
              </p>
            </div>
            {/* PDF da proposta */}
            <div style={{ padding: "16px", background: "rgba(72,192,184,0.06)", border: `2px dashed ${T}55`, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <svg width={24} height={30} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: T, letterSpacing: 1 }}>
                  PROPOSTA
                </span>
              </div>

              {isAdmin && (
                <>
                  <label
                    style={{
                      display: "inline-block",
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 9,
                      padding: "10px 20px",
                      color: T,
                      border: `2px solid ${T}`,
                      background: "rgba(72,192,184,0.1)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(72,192,184,0.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(72,192,184,0.1)"; }}
                  >
                    {propostaPdf ? "TROCAR PDF" : "ENVIAR PDF"}
                    <input
                      type="file"
                      accept=".pdf"
                      style={{ display: "none" }}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          setPropostaPdf({ name: file.name, url: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                  {propostaPdf && (
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#48e8a0", marginLeft: 12 }}>
                      ✓ {propostaPdf.name}
                    </span>
                  )}
                </>
              )}

              {/* PDF da proposta — admin envia, cliente/parceiro baixa */}
              {isAdmin && (
                <>
                  {propostaPdf && (
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#48e8a0", marginLeft: 12 }}>
                      ✓ {propostaPdf.name}
                    </span>
                  )}
                </>
              )}

              {!isAdmin && !propostaPdf && (
                <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#8878a8", margin: 0 }}>
                  Nenhum PDF enviado ainda.
                </p>
              )}

              {!isAdmin && propostaPdf && (
                <div style={{ marginTop: 0 }}>
                  <a
                    href={propostaPdf.url}
                    download={propostaPdf.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 9,
                      padding: "10px 20px",
                      color: "#1c1030",
                      background: T,
                      border: `2px solid ${T}`,
                      textDecoration: "none",
                      cursor: "pointer",
                      boxShadow: `4px 4px 0 ${T}44`,
                      transition: "all 0.2s",
                    }}
                  >
                    <svg width={14} height={18} viewBox="0 0 24 24" fill="none" stroke="#1c1030" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                    BAIXAR PROPOSTA PDF
                  </a>
                </div>
              )}

              {/* Link da proposta HTML — admin insere URL */}
              {isAdmin && (
                <div style={{ marginTop: 16 }}>
                  <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: K, display: "block", marginBottom: 6 }}>
                    Link da proposta (página web):
                  </label>
                  <input
                    value={propostaLink}
                    onChange={e => setPropostaLink(e.target.value)}
                    placeholder="https://seusite.com/proposta-cliente"
                    style={{ ...inputStyle, borderColor: `${K}66` }}
                    onFocus={e => e.target.style.borderColor = K}
                    onBlur={e => e.target.style.borderColor = `${K}66`}
                  />
                </div>
              )}
            </div>

            {isAdmin && (
              <>
                {/* Client acceptance status */}
                <div style={{
                  padding: "12px 16px", marginBottom: 16,
                  background: aceitouTermos ? "rgba(72,232,160,0.08)" : "rgba(240,200,72,0.08)",
                  borderLeft: `3px solid ${aceitouTermos ? "#48e8a0" : "#f0c848"}`,
                }}>
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: aceitouTermos ? "#48e8a0" : "#f0c848" }}>
                    {aceitouTermos ? "✓ Cliente aceitou a proposta" : "⏳ Aguardando aceite do cliente"}
                  </span>
                </div>
                <button
                  onClick={() => { if (aceitouTermos) setCurrentStep("dominio_host"); }}
                  className="btn btn-p"
                  style={{
                    opacity: aceitouTermos ? 1 : 0.5,
                    cursor: aceitouTermos ? "pointer" : "not-allowed",
                  }}
                  disabled={!aceitouTermos}
                >
                  SEGUIR PRO PRÓXIMO PASSO →
                </button>
              </>
            )}
            {!isAdmin && (() => {
              const temProposta = !!(propostaPdf || propostaLink);
              const podeAprovar = temProposta && aceitouTermos;
              return (
              <>
                {!temProposta && (
                  <div style={{
                    padding: "16px", marginBottom: 16,
                    background: "rgba(240,200,72,0.08)",
                    borderLeft: "3px solid #f0c848",
                  }}>
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#f0c848", margin: 0 }}>
                      ⏳ Aguardando a equipe preparar e enviar a proposta...
                    </p>
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: "#8878a8", margin: "6px 0 0" }}>
                      Assim que a proposta estiver pronta, ela aparecerá aqui para você revisar e aprovar.
                    </p>
                  </div>
                )}

                {propostaLink && (
                  <div style={{
                    padding: "16px", marginBottom: 16,
                    background: "rgba(72,232,160,0.08)",
                    borderLeft: "3px solid #48e8a0",
                  }}>
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#48e8a0", margin: "0 0 12px" }}>
                      ✓ Proposta disponível! Revise os detalhes antes de aprovar.
                    </p>
                    <a
                      href={propostaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        fontFamily: "'Press Start 2P', monospace", fontSize: 9,
                        padding: "12px 20px", color: "#1c1030", background: K,
                        border: `2px solid ${K}`, textDecoration: "none",
                        cursor: "pointer", boxShadow: `4px 4px 0 ${K}44`,
                        transition: "all 0.2s",
                      }}
                    >
                      VER PROPOSTA →
                    </a>
                  </div>
                )}

                {/* Termos e Condições */}
                <div style={{ marginBottom: 16, padding: "16px", background: "rgba(240,160,208,0.06)", border: `2px dashed ${K}55`, opacity: temProposta ? 1 : 0.4 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div
                        onClick={() => { if (temProposta) setAceitouTermos(!aceitouTermos); }}
                        style={{
                          width: 22, height: 22, flexShrink: 0, marginTop: 2,
                          border: `2px solid ${aceitouTermos ? "#48e8a0" : K}`,
                          background: aceitouTermos ? "#48e8a0" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: temProposta ? "pointer" : "not-allowed", transition: "all 0.2s",
                        }}
                      >
                        {aceitouTermos && <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#0f0c1e" }}>✓</span>}
                      </div>
                      <div>
                        <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#f0ebfa", margin: "0 0 4px" }}>
                          Li e aceito os{" "}
                          <span
                            onClick={() => setShowTermos(!showTermos)}
                            style={{ color: K, cursor: "pointer", textDecoration: "underline" }}
                          >
                            Termos e Condições
                          </span>
                        </p>
                        <p style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: "#8878a8", margin: 0 }}>
                          {temProposta ? "Você precisa aceitar os termos para prosseguir com a aprovação." : "Revise a proposta primeiro antes de aceitar os termos."}
                        </p>
                      </div>
                    </div>

                    {showTermos && (
                      <div style={{
                        marginTop: 16, padding: "16px 20px",
                        background: "rgba(8,7,20,0.92)",
                        border: `1px solid ${K}44`,
                        maxHeight: 300, overflowY: "auto",
                      }}>
                        <h4 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: K, margin: "0 0 12px", letterSpacing: 1 }}>
                          TERMOS E CONDIÇÕES DE SERVIÇO
                        </h4>
                        <div style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: "#b8a8d8", lineHeight: 1.5 }}>
                          <p style={{ margin: "0 0 10px" }}><strong style={{ color: K }}>1. Objeto do Contrato</strong><br/>
                          O presente contrato refere-se à prestação de serviços de desenvolvimento web pela pigeonz.ai, conforme especificado na proposta aprovada pelo cliente.</p>

                          <p style={{ margin: "0 0 10px" }}><strong style={{ color: K }}>2. Prazo de Entrega</strong><br/>
                          O prazo estimado será informado na proposta. Atrasos por parte do cliente (envio de conteúdo, feedbacks, aprovações) poderão impactar o cronograma sem responsabilidade da pigeonz.ai.</p>

                          <p style={{ margin: "0 0 10px" }}><strong style={{ color: K }}>3. Pagamento e Política de Reembolso</strong><br/>
                          O pagamento deverá ser realizado conforme plano selecionado antes do início do desenvolvimento. <strong style={{ color: "#ff6060" }}>Não realizamos reembolsos em nenhuma hipótese após a confirmação do pagamento e início do projeto.</strong> Em caso de desistência, o valor pago não será devolvido, pois recursos já foram alocados para o desenvolvimento.</p>

                          <p style={{ margin: "0 0 10px" }}><strong style={{ color: K }}>4. Revisões e Alterações</strong><br/>
                          O plano inclui até 3 rodadas de revisão. Alterações adicionais ou fora do escopo original poderão ser cobradas separadamente mediante orçamento prévio.</p>

                          <p style={{ margin: "0 0 10px" }}><strong style={{ color: K }}>5. Propriedade Intelectual</strong><br/>
                          Após pagamento integral, o código-fonte e assets desenvolvidos serão de propriedade do cliente. Bibliotecas e frameworks de terceiros permanecem sob suas respectivas licenças.</p>

                          <p style={{ margin: "0 0 10px" }}><strong style={{ color: K }}>6. Hospedagem e Domínio</strong><br/>
                          A configuração de hospedagem (Firebase ou similar) e registro de domínio são de responsabilidade do cliente, com suporte da pigeonz.ai durante o período de suporte contratado.</p>

                          <p style={{ margin: "0 0 10px" }}><strong style={{ color: K }}>7. Suporte Pós-Entrega</strong><br/>
                          O período de suporte varia conforme o plano contratado. Correções de bugs reportados durante o período de suporte serão atendidas sem custo adicional.</p>

                          <p style={{ margin: "0 0 10px" }}><strong style={{ color: K }}>8. Confidencialidade</strong><br/>
                          Ambas as partes se comprometem a manter sigilo sobre informações confidenciais trocadas durante o projeto, incluindo credenciais de acesso e dados sensíveis.</p>

                          <p style={{ margin: "0 0 10px" }}><strong style={{ color: K }}>9. Rescisão</strong><br/>
                          O contrato pode ser rescindido por qualquer parte mediante comunicação escrita com 15 dias de antecedência. Os valores correspondentes ao trabalho já realizado não serão reembolsados.</p>

                          <p style={{ margin: 0 }}><strong style={{ color: K }}>10. Foro</strong><br/>
                          Fica eleito o foro da comarca do prestador de serviço para dirimir quaisquer questões oriundas deste contrato.</p>
                        </div>
                      </div>
                    )}
                  </div>

                <button
                  onClick={() => { if (podeAprovar) setCurrentStep("dominio_host"); }}
                  className="btn btn-p"
                  style={{
                    opacity: podeAprovar ? 1 : 0.5,
                    cursor: podeAprovar ? "pointer" : "not-allowed",
                  }}
                  disabled={!podeAprovar}
                >
                  {!temProposta ? "AGUARDANDO PROPOSTA..." : !aceitouTermos ? "ACEITE OS TERMOS PARA APROVAR" : "APROVAR PROPOSTA →"}
                </button>
              </>
              );
            })()}
            {backBtn}
          </div>
        )}

        {/* ── STEP: Desenvolvimento ── */}
        {(currentStep === "desenvolvimento" || currentStep === "aguardando_aprovacao") && (
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", marginBottom: 24 }}>
            {/* Domain & Hosting summary */}
            {(dominio || firebaseEmail) && (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                {dominio && (
                  <div style={{ flex: "1 1 200px", padding: "10px 14px", background: "rgba(240,160,208,0.06)", borderLeft: `3px solid ${K}` }}>
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: K, letterSpacing: 1 }}>DOMÍNIO</span>
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#f0ebfa", margin: "4px 0 0" }}>{dominio}</p>
                  </div>
                )}
                {firebaseEmail && (
                  <div style={{ flex: "1 1 200px", padding: "10px 14px", background: "rgba(72,192,184,0.06)", borderLeft: `3px solid ${T}` }}>
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: T, letterSpacing: 1 }}>FIREBASE</span>
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#f0ebfa", margin: "4px 0 0" }}>{firebaseEmail}</p>
                    {isAdmin && <p style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#8878a8", margin: "2px 0 0" }}>Senha: {firebaseSenha}</p>}
                  </div>
                )}
              </div>
            )}

            <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: T, margin: "0 0 6px", letterSpacing: 1 }}>
              ETAPAS DO DESENVOLVIMENTO
            </h3>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 19, color: "#ffffff", margin: "0 0 16px", lineHeight: 1.4, textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}>
              {isAdmin ? "Marque cada etapa conforme for concluindo. O cliente acompanha o progresso em tempo real." : "Acompanhe aqui o progresso do desenvolvimento do seu site. Cada etapa vai sendo marcada conforme avançamos. Fique tranquilo(a), estamos cuidando de tudo!"}
            </p>

            {/* Progress bar */}
            {(() => {
              const doneCount = devDone.filter(v => v === "concluido").length;
              const pct = Math.round((doneCount / DEV_STEPS_ADMIN.length) * 100);
              return (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: T }}>
                      Progresso: {doneCount}/{DEV_STEPS_ADMIN.length}
                    </span>
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: pct === 100 ? "#48e8a0" : T }}>
                      {pct}%
                    </span>
                  </div>
                  <div style={{ width: "100%", height: 12, background: "rgba(96,64,160,0.2)", border: `1px solid ${T}44` }}>
                    <div style={{
                      width: `${pct}%`, height: "100%",
                      background: pct === 100 ? "#48e8a0" : T,
                      transition: "width 0.4s ease",
                    }} />
                  </div>
                </div>
              );
            })()}

            {/* Last update */}
            {isManaging && (
              <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#6b5c85" }}>
                  Última atualização: {new Date().toISOString().split("T")[0]}
                </span>
              </div>
            )}

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(105px, 1fr))",
              gap: 8,
            }}>
              {DEV_STEPS_CLIENT.map((step, i) => {
                const status = devDone[i] || "pendente";
                const cardBg = "rgba(10,8,20,0.95)";
                const borderColor = status === "concluido" ? "#48e8a0" : status === "em_andamento" ? "#f0c848" : "#ff4040";
                const selectBg = status === "concluido" ? "#48e8a0" : status === "em_andamento" ? "#f0c848" : "#ff4040";
                const selectColor = status === "concluido" ? "#0f0c1e" : status === "em_andamento" ? "#0f0c1e" : "#ffffff";
                return (
                  <div key={i} style={{
                    padding: "12px 8px 10px",
                    background: cardBg,
                    border: `2px solid ${borderColor}`,
                    textAlign: "center",
                    transition: "all 0.3s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minHeight: 140,
                  }}>
                    <div>
                      {/* Número */}
                      <div style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 16,
                        color: status === "concluido" ? "#48e8a0" : "#ffffff",
                        textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                        marginBottom: 6,
                      }}>
                        {status === "concluido" ? "✓" : step.icon}
                      </div>
                      {/* Título */}
                      <div style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 7,
                        color: "#ffffff",
                        textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                        letterSpacing: 0.5,
                        marginBottom: 4,
                        lineHeight: 1.4,
                      }}>
                        {step.title}
                      </div>
                      {/* Descrição */}
                      <div style={{
                        fontFamily: "'VT323', monospace",
                        fontSize: 14,
                        color: "#ffffff",
                        textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                        lineHeight: 1.3,
                      }}>
                        {step.desc}
                      </div>
                    </div>
                    {/* Status badge/dropdown — alinhado embaixo */}
                    {isAdmin ? (
                      <div style={{ width: "100%", marginTop: 10, position: "relative" }}>
                        <button
                          type="button"
                          onClick={() => setDevDropOpen(devDropOpen === i ? null : i)}
                          style={{
                            fontFamily: "'VT323', monospace",
                            fontSize: 15,
                            fontWeight: "bold",
                            padding: "5px 8px",
                            color: selectColor,
                            background: selectBg,
                            border: "none",
                            cursor: "pointer",
                            letterSpacing: 1,
                            outline: "none",
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          {status === "concluido" ? "CONCLUÍDO" : status === "em_andamento" ? "EM ANDAMENTO" : "PENDENTE"} ▾
                        </button>
                        {devDropOpen === i && (
                          <div style={{
                            position: "absolute",
                            bottom: "100%",
                            left: 0,
                            width: "100%",
                            background: "rgba(10,8,20,0.98)",
                            border: `2px solid ${T}`,
                            zIndex: 20,
                            display: "flex",
                            flexDirection: "column",
                          }}>
                            {([
                              { val: "pendente" as DevStatus, label: "PENDENTE", color: "#ffffff" },
                              { val: "em_andamento" as DevStatus, label: "EM ANDAMENTO", color: "#f0c848" },
                              { val: "concluido" as DevStatus, label: "CONCLUÍDO", color: "#48e8a0" },
                            ]).map(opt => (
                              <button
                                key={opt.val}
                                type="button"
                                onClick={() => {
                                  setDevDone(prev => { const n = [...prev]; n[i] = opt.val; return n; });
                                  setDevDropOpen(null);
                                }}
                                style={{
                                  fontFamily: "'VT323', monospace",
                                  fontSize: 18,
                                  padding: "10px 12px",
                                  color: opt.color,
                                  background: status === opt.val ? "rgba(72,192,184,0.15)" : "transparent",
                                  border: "none",
                                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                                  cursor: "pointer",
                                  textAlign: "center",
                                  letterSpacing: 1,
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(72,192,184,0.12)"}
                                onMouseLeave={e => e.currentTarget.style.background = status === opt.val ? "rgba(72,192,184,0.15)" : "transparent"}
                              >
                                {status === opt.val && "✓ "}{opt.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{
                        fontFamily: "'VT323', monospace",
                        fontSize: 15,
                        fontWeight: "bold",
                        padding: "5px 8px",
                        color: selectColor,
                        background: selectBg,
                        width: "100%",
                        textAlign: "center",
                        marginTop: 10,
                        letterSpacing: 1,
                        boxSizing: "border-box",
                      }}>
                        {status === "concluido" ? "CONCLUÍDO" : status === "em_andamento" ? "EM ANDAMENTO" : "PENDENTE"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Admin dev notes */}
            {isAdmin && (
              <div style={{ marginTop: 16, padding: "14px 16px", background: "rgba(240,160,208,0.06)", border: `1px solid ${K}33` }}>
                <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: K, letterSpacing: 1, display: "block", marginBottom: 8 }}>
                  NOTAS DO DESENVOLVIMENTO (ADM)
                </label>
                <textarea
                  value={devNotes}
                  onChange={e => setDevNotes(e.target.value)}
                  placeholder="Observações sobre o desenvolvimento deste projeto..."
                  rows={3}
                  style={{ ...inputStyle, fontSize: 16, borderColor: `${K}33` }}
                  onFocus={e => e.target.style.borderColor = K}
                  onBlur={e => e.target.style.borderColor = `${K}33`}
                />
              </div>
            )}

            {isAdmin && currentStep === "desenvolvimento" && (
              <button
                onClick={() => setCurrentStep("aguardando_aprovacao")}
                className="btn btn-p"
                style={{ marginTop: 16 }}
              >
                ENVIAR PRA APROVAÇÃO (ADM)
              </button>
            )}
            {!isAdmin && currentStep === "desenvolvimento" && (
              <button
                onClick={() => setCurrentStep("aguardando_aprovacao")}
                className="btn btn-p"
                style={{ marginTop: 16 }}
              >
                PRÓXIMO PASSO →
              </button>
            )}
            {backBtn}
          </div>
        )}

        {/* ── STEP: Aguardando aprovação ── */}
        {currentStep === "aguardando_aprovacao" && (
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: T, margin: "0 0 6px", letterSpacing: 1 }}>
              APROVAÇÃO DO PROJETO
            </h3>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 19, color: "#ffffff", margin: "0 0 16px", lineHeight: 1.4, textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}>
              {isAdmin ? "Coloque o link do site em staging para o cliente revisar e aprovar." : "Seu site está pronto para revisão! Acesse o link abaixo, navegue pelo site e, se estiver tudo certo, aprove para irmos para a fase final."}
            </p>

            {/* Link do site — admin edita, cliente vê */}
            <div style={{ padding: "16px", background: "rgba(72,192,184,0.06)", border: `2px dashed ${T}55`, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx={12} cy={12} r={10}/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: T, letterSpacing: 1 }}>
                  LINK DO SITE (PREVIEW)
                </span>
              </div>

              {isAdmin && (
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    value={siteLink}
                    onChange={e => setSiteLink(e.target.value)}
                    placeholder="https://seucliente.pigeonz.ai"
                    style={{ ...inputStyle, borderColor: `${T}66` }}
                    onFocus={e => e.target.style.borderColor = T}
                    onBlur={e => e.target.style.borderColor = `${T}66`}
                  />
                </div>
              )}

              {!isAdmin && !siteLink && (
                <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#8878a8", margin: 0 }}>
                  A equipe ainda não publicou o link de preview...
                </p>
              )}

              {siteLink && (
                <a
                  href={siteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 9,
                    padding: "10px 20px",
                    color: "#1c1030",
                    background: T,
                    border: `2px solid ${T}`,
                    textDecoration: "none",
                    cursor: "pointer",
                    boxShadow: `4px 4px 0 ${T}44`,
                    transition: "all 0.2s",
                    marginTop: isAdmin ? 12 : 0,
                  }}
                >
                  ABRIR SITE →
                </a>
              )}
            </div>

            {!isAdmin && (
              <button
                onClick={() => setCurrentStep("aprovada")}
                className="btn btn-p"
                style={{}}
              >
                APROVAR PROJETO →
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => setCurrentStep("aprovada")}
                className="btn btn-p"
                style={{}}
              >
                AVANÇAR PRA APROVADA (ADM)
              </button>
            )}
            {backBtn}
          </div>
        )}

        {/* Status messages */}
        {currentStep === "aprovada" && (
          <div className="pixel-box" style={{ background: "rgba(72,232,160,0.08)", padding: "16px 20px", marginBottom: 24, borderLeft: `3px solid #48e8a0` }}>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#48e8a0", margin: "0 0 8px" }}>
              ✓ Projeto aprovado! {isAdmin ? "Enviar para produção." : "Seu projeto está sendo finalizado."}
            </p>
            {isAdmin && (
              <button onClick={() => setCurrentStep("em_producao")} className="btn btn-p" style={{ marginTop: 12 }}>
                ENVIAR PRA PRODUÇÃO (ADM)
              </button>
            )}
            {!isAdmin && (
              <button
                onClick={() => setCurrentStep("em_producao")}
                className="btn btn-p"
                style={{ marginTop: 12 }}
              >
                PRÓXIMO PASSO →
              </button>
            )}
            {backBtn}
          </div>
        )}

        {/* ── STEP: Domínio e Hospedagem ── */}
        {currentStep === "dominio_host" && (
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: K, margin: "0 0 6px", letterSpacing: 1 }}>
              DOMÍNIO & HOSPEDAGEM
            </h3>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 19, color: "#ffffff", margin: "0 0 16px", lineHeight: 1.4, textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}>
              {isAdmin ? "Aqui ficam o domínio e as credenciais de hospedagem que o cliente informou." : "Nesta etapa você configura o endereço do seu site (domínio) e a hospedagem. É simples: registre seu domínio no Registro.br e crie uma conta gratuita no Firebase. Depois é só informar os dados aqui que a gente cuida do resto!"}
            </p>

            {(isManaging || isAdmin) ? (
              /* Admin view: read-only, no external buttons, no editable fields */
              <>
                {/* Status card */}
                <div style={{
                  padding: "14px 16px", marginBottom: 20,
                  background: "rgba(15,12,30,0.6)", border: "1px solid rgba(136,120,168,0.3)",
                }}>
                  <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#8878a8", letterSpacing: 1, display: "block", marginBottom: 10 }}>
                    STATUS DO CLIENTE
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: dominio ? "#48e8a0" : "#f0c848" }}>
                        {dominio ? "✓" : "⏳"}
                      </span>
                      <span style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: dominio ? "#48e8a0" : "#f0c848" }}>
                        Domínio: {dominio || "Aguardando cliente informar domínio"}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: firebaseEmail ? "#48e8a0" : "#f0c848" }}>
                        {firebaseEmail ? "✓" : "⏳"}
                      </span>
                      <span style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: firebaseEmail ? "#48e8a0" : "#f0c848" }}>
                        Firebase email: {firebaseEmail || "Aguardando cliente informar"}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: firebaseSenha ? "#48e8a0" : "#f0c848" }}>
                        {firebaseSenha ? "✓" : "⏳"}
                      </span>
                      <span style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: firebaseSenha ? "#48e8a0" : "#f0c848" }}>
                        Firebase senha: {firebaseSenha || "Aguardando"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep("desenvolvimento")}
                  className="btn btn-p"
                  style={{}}
                >
                  PRÓXIMA PÁGINA →
                </button>
                {backBtn}
              </>
            ) : (
              /* Client view */
              <>
                {/* Domínio */}
                <div style={{ padding: "16px", background: "rgba(240,160,208,0.06)", border: `2px dashed ${K}55`, marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: K, letterSpacing: 1 }}>
                      DOMÍNIO
                    </span>
                  </div>
                  <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#8878a8", margin: "0 0 12px" }}>
                    Registre seu domínio .com.br no Registro.br:
                  </p>
                  <a
                    href="https://registro.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 9,
                      padding: "10px 20px",
                      color: "#1c1030",
                      background: K,
                      border: `2px solid ${K}`,
                      textDecoration: "none",
                      cursor: "pointer",
                      boxShadow: `4px 4px 0 ${K}44`,
                      transition: "all 0.2s",
                      marginBottom: 16,
                    }}
                  >
                    ACESSAR REGISTRO.BR →
                  </a>
                  <div style={{ marginTop: 4 }}>
                    <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: K, display: "block", marginBottom: 6 }}>
                      Qual domínio você registrou?
                    </label>
                    <input
                      value={dominio}
                      onChange={e => setDominio(e.target.value)}
                      placeholder="www.seusite.com.br"
                      style={{ ...inputStyle, borderColor: `${K}66` }}
                      onFocus={e => e.target.style.borderColor = K}
                      onBlur={e => e.target.style.borderColor = `${K}66`}
                    />
                  </div>
                  {dominio && (
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#48e8a0", marginTop: 8, margin: "8px 0 0" }}>
                      ✓ Domínio: {dominio}
                    </p>
                  )}
                </div>

                {/* Hospedagem */}
                <div style={{ padding: "16px", background: "rgba(72,192,184,0.06)", border: `2px dashed ${T}55`, marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <rect x={2} y={2} width={20} height={8} rx={2} ry={2}/><rect x={2} y={14} width={20} height={8} rx={2} ry={2}/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
                    </svg>
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: T, letterSpacing: 1 }}>
                      HOSPEDAGEM
                    </span>
                  </div>
                  <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#8878a8", margin: "0 0 12px" }}>
                    Crie sua conta gratuita no Firebase para hospedarmos seu site:
                  </p>
                  <a
                    href="https://firebase.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 9,
                      padding: "10px 20px",
                      color: "#1c1030",
                      background: T,
                      border: `2px solid ${T}`,
                      textDecoration: "none",
                      cursor: "pointer",
                      boxShadow: `4px 4px 0 ${T}44`,
                      transition: "all 0.2s",
                      marginBottom: 16,
                    }}
                  >
                    CRIAR CONTA NO FIREBASE →
                  </a>

                  <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 12 }}>
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: T, margin: 0 }}>
                      Após criar sua conta, informe o email e senha para que possamos configurar a hospedagem:
                    </p>
                    <div>
                      <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: T, display: "block", marginBottom: 4 }}>Email do Firebase</label>
                      <input
                        value={firebaseEmail}
                        onChange={e => setFirebaseEmail(e.target.value)}
                        placeholder="seu@email.com"
                        style={{ ...inputStyle, borderColor: `${T}66` }}
                        onFocus={e => e.target.style.borderColor = T}
                        onBlur={e => e.target.style.borderColor = `${T}66`}
                      />
                    </div>
                    <div>
                      <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: T, display: "block", marginBottom: 4 }}>Senha do Firebase</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showFirebasePass ? "text" : "password"}
                          value={firebaseSenha}
                          onChange={e => setFirebaseSenha(e.target.value)}
                          placeholder="••••••••"
                          style={{ ...inputStyle, borderColor: `${T}66`, paddingRight: 44 }}
                          onFocus={e => e.target.style.borderColor = T}
                          onBlur={e => e.target.style.borderColor = `${T}66`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowFirebasePass(!showFirebasePass)}
                          style={{
                            position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                            background: "transparent", border: "none", cursor: "pointer",
                            fontFamily: "'VT323', monospace", fontSize: 16, color: "#8878a8",
                            padding: "4px 6px",
                          }}
                        >
                          {showFirebasePass ? "OCULTAR" : "VER"}
                        </button>
                      </div>
                    </div>
                    {firebaseEmail && firebaseSenha && (
                      <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#48e8a0", margin: 0 }}>
                        ✓ Credenciais salvas! A equipe vai configurar sua hospedagem.
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep("desenvolvimento")}
                  className="btn btn-p"
                  style={{}}
                >
                  PRÓXIMO PASSO →
                </button>
                {backBtn}
              </>
            )}
          </div>
        )}

        {currentStep === "em_producao" && (
          <div className="pixel-box" style={{ background: "rgba(72,192,184,0.08)", padding: "20px", marginBottom: 24, borderLeft: `3px solid ${T}` }}>
            <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: T, margin: "0 0 6px", letterSpacing: 1 }}>
              EM PRODUÇÃO
            </h3>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 19, color: "#ffffff", margin: "0 0 16px", lineHeight: 1.4, textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}>
              {isAdmin ? "Configure o link final de produção e marque como entregue quando estiver pronto." : "Estamos colocando seu site no ar! Em breve você receberá o link final do seu site funcionando."}
            </p>

            {/* Admin: edit siteLink + domain status */}
            {isAdmin && (
              <div style={{ marginBottom: 16, padding: "14px 16px", background: "rgba(15,12,30,0.4)", border: "1px solid rgba(136,120,168,0.3)" }}>
                <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: T, letterSpacing: 1, display: "block", marginBottom: 8 }}>
                  URL DE PRODUÇÃO (ADM)
                </label>
                <input
                  value={siteLink}
                  onChange={e => setSiteLink(e.target.value)}
                  placeholder="https://www.seucliente.com.br"
                  style={{ ...inputStyle, fontSize: 16, padding: "8px 12px", borderColor: `${T}44` }}
                  onFocus={e => e.target.style.borderColor = T}
                  onBlur={e => e.target.style.borderColor = `${T}44`}
                />
                <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: dominio ? "#48e8a0" : "#f0c848" }}>
                    {dominio ? "✓" : "⏳"}
                  </span>
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: dominio ? "#48e8a0" : "#f0c848" }}>
                    Domínio: {dominio ? `Configurado (${dominio})` : "Não configurado"}
                  </span>
                </div>
              </div>
            )}

            {/* Site do cliente */}
            {(dominio || siteLink) && (
              <div style={{ padding: "16px", background: "rgba(72,192,184,0.06)", border: `2px dashed ${T}55`, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx={12} cy={12} r={10}/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: T, letterSpacing: 1 }}>
                    SEU SITE
                  </span>
                </div>
                {dominio && (
                  <a
                    href={dominio.startsWith("http") ? dominio : `https://${dominio}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 9,
                      padding: "10px 20px",
                      color: "#1c1030",
                      background: K,
                      border: `2px solid ${K}`,
                      textDecoration: "none",
                      cursor: "pointer",
                      boxShadow: `4px 4px 0 ${K}44`,
                      marginBottom: 8,
                      animation: "badgePulse 2s ease-in-out infinite",
                    }}
                  >
                    {dominio}
                  </a>
                )}
                {siteLink && (
                  <a
                    href={siteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 9,
                      padding: "10px 20px",
                      color: "#1c1030",
                      background: T,
                      border: `2px solid ${T}`,
                      textDecoration: "none",
                      cursor: "pointer",
                      boxShadow: `4px 4px 0 ${T}44`,
                    }}
                  >
                    ACESSAR MEU SITE →
                  </a>
                )}
              </div>
            )}
            {isAdmin && (
              <button onClick={() => setCurrentStep("entregue")} className="btn btn-p" style={{ marginTop: 12 }}>
                MARCAR COMO ENTREGUE (ADM)
              </button>
            )}
            {!isAdmin && (
              <button
                onClick={() => setCurrentStep("entregue")}
                className="btn btn-p"
                style={{ marginTop: 12 }}
              >
                PRÓXIMO PASSO →
              </button>
            )}
            {backBtn}
          </div>
        )}

        {currentStep === "entregue" && (
          <div className="pixel-box" style={{ background: "rgba(72,232,160,0.08)", padding: "20px", marginBottom: 24, borderLeft: "3px solid #48e8a0" }}>
            <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, color: "#48e8a0", margin: 0 }}>
              ✓ PROJETO ENTREGUE!
            </p>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 19, color: "#ffffff", marginTop: 8, marginBottom: 16, lineHeight: 1.4, textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}>
              Obrigada por confiar na pigeonz.ai! Seu site está no ar e pronto para o mundo. Qualquer dúvida, use o suporte.
            </p>

            <div style={{ padding: "16px", background: "rgba(72,232,160,0.06)", border: `2px dashed #48e8a055`, marginTop: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#48e8a0" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx={12} cy={12} r={10}/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "#48e8a0", letterSpacing: 1 }}>
                    SEU SITE
                  </span>
                </div>

                {isAdmin && (
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#48e8a0", display: "block", marginBottom: 6 }}>
                      URL do site do cliente:
                    </label>
                    <input
                      value={siteLink}
                      onChange={e => setSiteLink(e.target.value)}
                      placeholder="https://www.seucliente.com.br"
                      style={{ ...inputStyle, borderColor: "#48e8a066" }}
                      onFocus={e => e.target.style.borderColor = "#48e8a0"}
                      onBlur={e => e.target.style.borderColor = "#48e8a066"}
                    />
                  </div>
                )}

                {dominio && (
                  <a
                    href={dominio.startsWith("http") ? dominio : `https://${dominio}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 9,
                      padding: "10px 20px",
                      color: "#1c1030",
                      background: K,
                      border: `2px solid ${K}`,
                      textDecoration: "none",
                      cursor: "pointer",
                      boxShadow: `4px 4px 0 ${K}44`,
                      marginBottom: 8,
                      animation: "badgePulse 2s ease-in-out infinite",
                    }}
                  >
                    {dominio}
                  </a>
                )}
                {siteLink && (
                  <a
                    href={siteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 9,
                      padding: "10px 20px",
                      color: "#1c1030",
                      background: "#48e8a0",
                      border: "2px solid #48e8a0",
                      textDecoration: "none",
                      cursor: "pointer",
                      boxShadow: "4px 4px 0 rgba(72,232,160,0.3)",
                    }}
                  >
                    ACESSAR MEU SITE →
                  </a>
                )}
                {!siteLink && !isAdmin && (
                  <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#8878a8", margin: 0 }}>
                    O link do seu site será adicionado em breve.
                  </p>
                )}
              </div>

            <button
              onClick={() => router.push(isAdmin ? "/admin" : "/painel")}
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 10, padding: "14px 32px", letterSpacing: 2, cursor: "pointer",
                background: K,
                color: "#1c1030",
                border: `2px solid ${K}`,
                boxShadow: `4px 4px 0 ${K}44`,
                transition: "all 0.2s",
                width: "100%",
                marginTop: 16,
              }}
            >
              VOLTAR AO PAINEL
            </button>

            {!isBlueZone && !isAdmin && (
              <button
                onClick={() => {
                  // Reset proposta state for new purchase
                  setCurrentStep("selecionar_plano");
                  setSelectedPlan(null);
                  setBriefing("");
                  setBriefingSent(false);
                  setPayMethod(null);
                  setPaySuccess(false);
                  setComprovante(null);
                  setComprovanteSent(false);
                  setPagamentoConfirmado(false);
                  setNotaFiscal(null);
                  setCupomRef("");
                  setCupomAplicado(false);
                  setPropostaPdf(null);
                  setPropostaLink("");
                  setSiteLink("");
                  setDominio("");
                  setHospedagem("");
                  setFirebaseEmail("");
                  setFirebaseSenha("");
                  setAceitouTermos(false);
                  setDevDone(DEV_STEPS_ADMIN.map(() => "pendente"));
                  setComments([]);
                  // State reset triggers Firestore save via effect
                }}
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 10, padding: "14px 32px", letterSpacing: 2, cursor: "pointer",
                  background: "transparent",
                  color: T,
                  border: `2px solid ${T}`,
                  boxShadow: `4px 4px 0 ${T}44`,
                  transition: "all 0.2s",
                  width: "100%",
                  marginTop: 12,
                }}
              >
                CONTRATAR NOVO PLANO
              </button>
            )}
            {backBtn}
          </div>
        )}

        {/* Chat do projeto removido — usa Chat do Projeto (floating button) */}

        {/* Admin project notes — always visible at bottom when managing */}
        {isManaging && (
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", marginTop: 16 }}>
            <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: "#ff6060", margin: "0 0 12px", letterSpacing: 1 }}>
              NOTAS INTERNAS DO PROJETO (ADM)
            </h3>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#6b5c85", margin: "0 0 8px" }}>
              Anotações internas sobre este projeto. Visível apenas para admin.
            </p>
            <textarea
              value={adminProjectNotes}
              onChange={e => setAdminProjectNotes(e.target.value)}
              placeholder="Escreva notas internas sobre este projeto..."
              rows={4}
              style={{ ...inputStyle, fontSize: 16, borderColor: "#ff606044" }}
              onFocus={e => e.target.style.borderColor = "#ff6060"}
              onBlur={e => e.target.style.borderColor = "#ff606044"}
            />
          </div>
        )}

        {/* Admin: advance step manually */}
        {isAdmin && currentStep !== "entregue" && (
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <button
              onClick={advanceStep}
              style={{
                fontFamily: "'VT323', monospace", fontSize: 16,
                padding: "8px 20px", color: "#ff6060", border: "1px solid #ff6060",
                background: "transparent", cursor: "pointer",
              }}
            >
              Avançar etapa manualmente (ADM)
            </button>
          </div>
        )}
      </div>
    </div>
    {user && (
      <ProjectChat
        projectKey={`${managingEmail || user.email}_${selectedPlan !== null ? PLANS[selectedPlan]?.name || "projeto" : "projeto"}`}
        userName={user.name}
        userRole={managingEmail ? "parceiro" : user.role}
      />
    )}
    </>
  );
}

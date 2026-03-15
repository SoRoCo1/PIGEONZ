"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import GlobalCityBg from "@/components/GlobalCityBg";
import { FlyingPigeon } from "@/components/Pigeon";
import ReCAPTCHA from "react-google-recaptcha";
import { getUser, setUser as setUserDB, getAllUsers } from "@/lib/db";
import { setProposta } from "@/lib/db";

const RECAPTCHA_SITEKEY = "6LcpvIgsAAAAAIBY90RvhDfuIVKZz8d5kso-6awU";

const T = "#48c0b8";
const K = "#f0a0d0";

const inputStyle = {
  width: "100%",
  background: "rgba(8,7,20,0.92)",
  border: "2px solid rgba(208,88,160,0.4)",
  color: "#f0ebfa",
  fontFamily: "'VT323', monospace",
  fontSize: 20,
  padding: "12px 16px",
  outline: "none",
  boxSizing: "border-box" as const,
  transition: "border-color 0.2s",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [isProd, setIsProd] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<"cliente" | "parceiro" | "admin" | "criar">("parceiro");
  const isLogin = tab === "cliente" || tab === "parceiro" || tab === "admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [telefone, setTelefone] = useState("");
  const [docTipo, setDocTipo] = useState<"cpf" | "cnpj">("cpf");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [endereco, setEndereco] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [uf, setUf] = useState("");
  const [accountType, setAccountType] = useState<"cliente" | "parceiro">("cliente");
  const [showPass, setShowPass] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [showTermosParceria, setShowTermosParceria] = useState(false);
  const [aceitouTermosParceria, setAceitouTermosParceria] = useState(false);
  const [showTermosDetalhes, setShowTermosDetalhes] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaOk, setCaptchaOk] = useState(false);

  const refParam = (mounted && searchParams.get("ref")) || "";

  // Masks
  const maskTelefone = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : "";
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };
  const maskCPF = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  };
  const maskCNPJ = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 14);
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
    if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
    if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
  };
  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validateTelefone = (t: string) => t.replace(/\D/g, "").length >= 10;
  const validateCPF = (c: string) => c.replace(/\D/g, "").length === 11;
  const validateCNPJ = (c: string) => c.replace(/\D/g, "").length === 14;

  useEffect(() => {
    setMounted(true);
    const h = window.location.hostname;
    setIsProd(h.includes("pigeonz") || h.includes("web.app") || h.includes("run.app"));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isProd) {
      if (searchParams.get("plano") !== null) setTab("criar");
      if (refParam) setTab("criar");
    }
  }, [mounted, searchParams, refParam, isProd]);

  const USERS = [
    { email: "bluezonesalesmkt@gmail.com", password: "Blue123@", role: "parceiro", name: "BlueZone" },
    { email: "sarahsantiago100@gmail.com", password: "S@rinha1009910", role: "admin", name: "Sarah" },
  ];

  const finalizarLogin = async (role: string, userName: string, userEmail: string) => {
    const userData: Record<string, string> = { email: userEmail, role, name: userName, telefone, cpfCnpj, razaoSocial, endereco, municipio, uf };
    if (refParam) userData.ref = refParam;
    localStorage.setItem("pigeonz_user", JSON.stringify(userData));
    const plano = searchParams.get("plano");
    if (plano !== null && (role === "cliente" || role === "parceiro")) {
      const proposta = { currentStep: "pagamento", selectedPlan: Number(plano), briefing: "", devDone: [], comments: [] };
      await setProposta(userEmail, proposta);
      window.location.href = "/painel/proposta";
      return;
    }
    window.location.href = role === "admin" ? "/admin" : "/painel";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!captchaOk) {
      setError("Complete o captcha antes de continuar.");
      return;
    }
    setLoading(true);

    try {
      if (tab === "criar") {
        // Criar conta — validações
        if (!name.trim()) { setError("Preencha seu nome."); setLoading(false); return; }
        if (!email.trim() || !validateEmail(email)) { setError("Email inválido. Use o formato email@exemplo.com"); setLoading(false); return; }
        if (password.length < 6) { setError("A senha deve ter pelo menos 6 caracteres."); setLoading(false); return; }
        if (telefone && !validateTelefone(telefone)) { setError("Telefone inválido. Use o formato (XX) XXXXX-XXXX"); setLoading(false); return; }
        if (cpfCnpj) {
          if (docTipo === "cpf" && !validateCPF(cpfCnpj)) { setError("CPF inválido. Deve ter 11 dígitos."); setLoading(false); return; }
          if (docTipo === "cnpj" && !validateCNPJ(cpfCnpj)) { setError("CNPJ inválido. Deve ter 14 dígitos."); setLoading(false); return; }
        }

        // Verificar se conta já existe no Firestore
        const existing = await getUser(email.trim());
        if (existing) { setError("Este email já está cadastrado. Faça login."); setLoading(false); return; }

        // Salvar conta no Firestore
        await setUserDB(email.trim(), { email: email.trim(), password, role: accountType, name: name.trim(), telefone, cpfCnpj, razaoSocial, endereco, municipio, uf });

        if (accountType === "parceiro") {
          localStorage.setItem("pigeonz_user_pending", JSON.stringify({ email: email.trim(), role: "parceiro", name: name.trim(), telefone, cpfCnpj, razaoSocial, endereco, municipio, uf }));
          setShowTermosParceria(true);
          setLoading(false);
          return;
        }

        await finalizarLogin("cliente", name.trim(), email.trim());
      } else {
        // Login — buscar no Firestore + fallback USERS hardcoded
        const emailTrimmed = email.trim();
        const passTrimmed = password.trim();

        // Hardcoded users check first
        const hardcoded = USERS.find(u => u.email === emailTrimmed && u.password === passTrimmed);
        let foundUser = hardcoded ? { email: hardcoded.email, password: hardcoded.password, role: hardcoded.role, name: hardcoded.name } : null;

        if (!foundUser) {
          // Check Firestore
          const dbUser = await getUser(emailTrimmed);
          if (dbUser && dbUser.password === passTrimmed) {
            foundUser = dbUser;
          }
        }

        if (!foundUser) {
          setError("Email ou senha incorretos.");
          setLoading(false);
          return;
        }
        if (tab === "admin" && foundUser.role !== "admin") {
          setError("Este usuário não tem permissão de administrador.");
          setLoading(false);
          return;
        }
        if (tab === "parceiro" && foundUser.role !== "parceiro") {
          setError("Este email não está cadastrado como parceiro.");
          setLoading(false);
          return;
        }
        if (tab === "cliente" && foundUser.role !== "cliente") {
          setError("Este email não está cadastrado como cliente.");
          setLoading(false);
          return;
        }
        await finalizarLogin(foundUser.role, foundUser.name, foundUser.email);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
      <GlobalCityBg />
      <div style={{
        minHeight: "100vh",
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        position: "relative",
        zIndex: 1,
      }}>
        <FlyingPigeon size={5} />
        <p style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 12,
          color: "#f0a0d0",
          textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
          animation: "blink 1.2s step-start infinite",
        }}>
          Carregando...
        </p>
      </div>
      </>
    );
  }

  // Tela de termos de parceria
  if (showTermosParceria) {
    return (
      <>
      <GlobalCityBg />
      <div style={{
        minHeight: "100vh",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{ maxWidth: 550, width: "100%" }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <a href="/" className="a-float" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, filter: "drop-shadow(0 0 12px rgba(255,80,192,0.5)) drop-shadow(0 0 28px rgba(72,232,208,0.3))" }}>
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
          </div>

          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "32px 24px" }}>
            <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 12, color: T, margin: "0 0 8px", lineHeight: 1.6 }}>
              Termo de Parceria
            </h2>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#b8a8d8", margin: "0 0 20px" }}>
              Para criar sua conta de parceiro, leia e aceite os termos abaixo.
            </p>

            <div style={{
              maxHeight: 350, overflowY: "auto",
              padding: "16px 20px",
              background: "rgba(8,7,20,0.92)",
              border: `1px solid ${T}44`,
              marginBottom: 20,
            }}>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: "#b8a8d8", lineHeight: 1.5 }}>
                <p style={{ margin: "0 0 12px" }}><strong style={{ color: T }}>1. Objeto da Parceria</strong><br/>
                O presente termo estabelece as condições da parceria entre o Parceiro e a pigeonz.ai para indicação de clientes interessados em serviços de desenvolvimento web. O Parceiro atuará como intermediário na captação de novos clientes.</p>

                <p style={{ margin: "0 0 12px" }}><strong style={{ color: T }}>2. Link de Indicação e Comissão</strong><br/>
                O Parceiro receberá um link de indicação exclusivo disponível no painel de comissões. Quando um cliente se cadastrar e contratar um plano através desse link, o Parceiro receberá <strong style={{ color: "#48e8a0" }}>10% (dez por cento) do valor do plano contratado</strong> como comissão. O link é pessoal e intransferível.</p>

                <p style={{ margin: "0 0 12px" }}><strong style={{ color: T }}>3. Condições de Pagamento da Comissão</strong><br/>
                A comissão será devida somente após a confirmação do pagamento integral do cliente indicado. O pagamento da comissão ao Parceiro será realizado em até 30 dias úteis após a confirmação. <strong style={{ color: "#ff6060" }}>Não há comissão em caso de cancelamento, desistência ou inadimplência do cliente indicado.</strong></p>

                <p style={{ margin: "0 0 12px" }}><strong style={{ color: T }}>4. Obrigações do Parceiro</strong><br/>
                O Parceiro se compromete a: apresentar a pigeonz.ai de forma ética e verdadeira; não fazer promessas de entregas, prazos ou funcionalidades em nome da pigeonz.ai; fornecer dados corretos dos clientes indicados; não utilizar práticas de spam ou marketing abusivo.</p>

                <p style={{ margin: "0 0 12px" }}><strong style={{ color: T }}>5. Obrigações da pigeonz.ai</strong><br/>
                A pigeonz.ai se compromete a: prestar os serviços contratados pelo cliente indicado com qualidade; manter o Parceiro informado sobre o status dos projetos dos seus indicados; efetuar o pagamento das comissões conforme acordado.</p>

                <p style={{ margin: "0 0 12px" }}><strong style={{ color: T }}>6. Exclusividade</strong><br/>
                Este termo não estabelece exclusividade. O Parceiro pode indicar clientes para outros prestadores de serviço, assim como a pigeonz.ai pode manter parcerias com outros parceiros.</p>

                <p style={{ margin: "0 0 12px" }}><strong style={{ color: T }}>7. Confidencialidade</strong><br/>
                Ambas as partes se comprometem a manter sigilo sobre informações comerciais, financeiras e técnicas compartilhadas durante a parceria, incluindo valores de comissão, dados de clientes e estratégias de negócio.</p>

                <p style={{ margin: "0 0 12px" }}><strong style={{ color: T }}>8. Propriedade Intelectual</strong><br/>
                O Parceiro não poderá utilizar a marca, logotipo ou materiais da pigeonz.ai sem autorização prévia por escrito. Materiais de divulgação devem ser aprovados antes do uso.</p>

                <p style={{ margin: "0 0 12px" }}><strong style={{ color: T }}>9. Vigência e Rescisão</strong><br/>
                A parceria tem vigência indeterminada e pode ser rescindida por qualquer parte mediante comunicação com 30 dias de antecedência. Comissões de indicações já realizadas e confirmadas antes da rescisão permanecem devidas.</p>

                <p style={{ margin: 0 }}><strong style={{ color: T }}>10. Foro</strong><br/>
                Fica eleito o foro da comarca do prestador de serviço para dirimir quaisquer questões oriundas deste termo de parceria.</p>
              </div>
            </div>

            {/* Checkbox aceitar */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 20 }}>
              <div
                onClick={() => setAceitouTermosParceria(!aceitouTermosParceria)}
                style={{
                  width: 22, height: 22, flexShrink: 0, marginTop: 2,
                  border: `2px solid ${aceitouTermosParceria ? "#48e8a0" : T}`,
                  background: aceitouTermosParceria ? "#48e8a0" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {aceitouTermosParceria && <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#0f0c1e" }}>✓</span>}
              </div>
              <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#f0ebfa", margin: 0 }}>
                Li e aceito os <strong style={{ color: T }}>Termos de Parceria</strong> da pigeonz.ai
              </p>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => { setShowTermosParceria(false); setAceitouTermosParceria(false); }}
                style={{
                  flex: 1, fontFamily: "'Press Start 2P', monospace", fontSize: 9,
                  padding: "14px 16px", letterSpacing: 1, cursor: "pointer",
                  color: "#8878a8", background: "transparent",
                  border: "2px solid #4a3070", transition: "all 0.2s",
                }}
              >
                VOLTAR
              </button>
              <button
                onClick={() => {
                  if (!aceitouTermosParceria) return;
                  const pending = localStorage.getItem("pigeonz_user_pending");
                  if (pending) {
                    const data = JSON.parse(pending);
                    localStorage.removeItem("pigeonz_user_pending");
                    finalizarLogin(data.role, data.name, data.email);
                  }
                }}
                style={{
                  flex: 2, fontFamily: "'Press Start 2P', monospace", fontSize: 9,
                  padding: "14px 16px", letterSpacing: 1,
                  cursor: aceitouTermosParceria ? "pointer" : "not-allowed",
                  color: aceitouTermosParceria ? "#1c1030" : "#4a3070",
                  background: aceitouTermosParceria ? T : "transparent",
                  border: `2px solid ${aceitouTermosParceria ? T : "#4a3070"}`,
                  boxShadow: aceitouTermosParceria ? `4px 4px 0 ${T}44` : "none",
                  opacity: aceitouTermosParceria ? 1 : 0.5,
                  transition: "all 0.2s",
                }}
              >
                ACEITAR E CRIAR CONTA
              </button>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
    <GlobalCityBg />
    <div style={{
      minHeight: "100vh",
      background: "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      position: "relative",
      zIndex: 1,
    }}>

      <div style={{
        maxWidth: 420,
        width: "100%",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Logo */}
        <a href="/" className="a-float" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginBottom: 36, marginTop: 24, filter: "drop-shadow(0 0 18px rgba(255,80,192,0.65)) drop-shadow(0 0 38px rgba(72,232,208,0.45)) drop-shadow(0 0 60px rgba(255,80,192,0.25))" }}>
          <svg width={64} height={30} style={{ imageRendering: "pixelated", shapeRendering: "crispEdges", marginRight: -2 }}>
            <rect x={20} y={0} width={20} height={5} fill="#100818" />
            <rect x={15} y={5} width={30} height={5} fill="#100818" />
            <rect x={15} y={10} width={5} height={5} fill="#06020c" />
            <rect x={20} y={10} width={20} height={5} fill="#f0eef8" />
            <rect x={40} y={10} width={5} height={5} fill="#06020c" />
            <rect x={5} y={15} width={45} height={7} fill="#06020c" />
          </svg>
          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20 }}>
            <span style={{ color: "#ff50c0" }}>pigeonz</span>
            <span style={{ color: "#48e8d0" }}>.ai</span>
          </span>
        </a>

        {/* Card */}
        <div className="pixel-box" style={{
          background: "rgba(10,8,20,0.95)",
          padding: "40px 32px",
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginBottom: 32 }}>
            {([
              { key: "cliente" as const, label: "Cliente", color: K, disabled: isProd },
              { key: "parceiro" as const, label: "Parceiro", color: T, disabled: false },
              { key: "admin" as const, label: "Admin", color: "#ff6060", disabled: false },
              { key: "criar" as const, label: "Criar conta", color: T, disabled: isProd },
            ]).map(t => (
              <button
                key={t.key}
                onClick={() => { if (!t.disabled) { setTab(t.key); setError(""); } }}
                style={{
                  flex: 1,
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 8,
                  padding: t.disabled ? "6px 4px 16px" : "12px 4px",
                  cursor: t.disabled ? "not-allowed" : "pointer",
                  background: tab === t.key ? `${t.color}22` : "transparent",
                  border: "2px solid",
                  borderColor: t.disabled ? "rgba(96,64,160,0.2)" : (tab === t.key ? t.color : "rgba(96,64,160,0.4)"),
                  color: t.disabled ? "#4a3070" : (tab === t.key ? t.color : "#6b5c85"),
                  transition: "all 0.2s",
                  opacity: t.disabled ? 0.5 : 1,
                  position: "relative" as const,
                  display: "flex",
                  flexDirection: "column" as const,
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {t.label}
                {t.disabled && (
                  <span style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 5,
                    color: "#f0a050",
                    letterSpacing: 1,
                  }}>
                    EM BREVE
                  </span>
                )}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {!isLogin && (
              <>
              {refParam && (
                <div style={{
                  padding: "10px 14px",
                  background: "rgba(72,232,160,0.08)",
                  borderLeft: "3px solid #48e8a0",
                  marginBottom: 4,
                }}>
                  <p style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: "#48e8a0", margin: 0 }}>
                    Indicado por: <strong style={{ color: T }}>{decodeURIComponent(refParam)}</strong>
                  </p>
                  <p style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: "#8878a8", margin: "4px 0 0" }}>
                    Você tem direito a <strong style={{ color: "#48e8a0" }}>30% de desconto</strong> no seu plano!
                  </p>
                </div>
              )}
              <div>
                <label style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: T, display: "block", marginBottom: 6 }}>
                  Tipo de conta
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {([{ value: "cliente" as const, label: "Cliente" }, { value: "parceiro" as const, label: "Parceiro" }]).map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAccountType(opt.value)}
                      style={{
                        flex: 1,
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 9,
                        padding: "10px 8px",
                        cursor: "pointer",
                        color: accountType === opt.value ? "#1c1030" : (opt.value === "cliente" ? K : T),
                        background: accountType === opt.value ? (opt.value === "cliente" ? K : T) : "transparent",
                        border: `2px solid ${opt.value === "cliente" ? K : T}`,
                        transition: "all 0.2s",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: T, display: "block", marginBottom: 6 }}>
                  Nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = T}
                  onBlur={e => e.target.style.borderColor = "rgba(208,88,160,0.4)"}
                />
              </div>
              <div>
                <label style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: T, display: "block", marginBottom: 6 }}>
                  Telefone
                </label>
                <input
                  type="tel"
                  value={telefone}
                  onChange={e => setTelefone(maskTelefone(e.target.value))}
                  placeholder="(31) 99999-9999"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = T}
                  onBlur={e => e.target.style.borderColor = "rgba(208,88,160,0.4)"}
                />
              </div>
              <div>
                <label style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: T, display: "block", marginBottom: 6 }}>
                  Documento
                </label>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <button
                    type="button"
                    onClick={() => { setDocTipo("cpf"); setCpfCnpj(""); }}
                    style={{
                      fontFamily: "'VT323', monospace", fontSize: 16,
                      padding: "4px 14px", cursor: "pointer",
                      color: docTipo === "cpf" ? "#1c1030" : T,
                      background: docTipo === "cpf" ? T : "transparent",
                      border: `2px solid ${T}`, transition: "all 0.2s",
                    }}
                  >
                    CPF
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDocTipo("cnpj"); setCpfCnpj(""); }}
                    style={{
                      fontFamily: "'VT323', monospace", fontSize: 16,
                      padding: "4px 14px", cursor: "pointer",
                      color: docTipo === "cnpj" ? "#1c1030" : K,
                      background: docTipo === "cnpj" ? K : "transparent",
                      border: `2px solid ${K}`, transition: "all 0.2s",
                    }}
                  >
                    CNPJ
                  </button>
                </div>
                <input
                  type="text"
                  value={cpfCnpj}
                  onChange={e => setCpfCnpj(docTipo === "cpf" ? maskCPF(e.target.value) : maskCNPJ(e.target.value))}
                  placeholder={docTipo === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = T}
                  onBlur={e => e.target.style.borderColor = "rgba(208,88,160,0.4)"}
                />
              </div>
              <div>
                <label style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: T, display: "block", marginBottom: 6 }}>
                  {accountType === "parceiro" ? "Nome da empresa / Razão Social / Nome completo" : "Nome completo"}
                </label>
                <input
                  type="text"
                  value={razaoSocial}
                  onChange={e => setRazaoSocial(e.target.value)}
                  placeholder={accountType === "parceiro" ? "Razão social da empresa" : "Seu nome completo"}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = T}
                  onBlur={e => e.target.style.borderColor = "rgba(208,88,160,0.4)"}
                />
              </div>
              <div>
                <label style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: T, display: "block", marginBottom: 6 }}>
                  Endereço
                </label>
                <input
                  type="text"
                  value={endereco}
                  onChange={e => setEndereco(e.target.value)}
                  placeholder="Rua, número, bairro"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = T}
                  onBlur={e => e.target.style.borderColor = "rgba(208,88,160,0.4)"}
                />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 2 }}>
                  <label style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: T, display: "block", marginBottom: 6 }}>
                    Município
                  </label>
                  <input
                    type="text"
                    value={municipio}
                    onChange={e => setMunicipio(e.target.value)}
                    placeholder="Cidade"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = T}
                    onBlur={e => e.target.style.borderColor = "rgba(208,88,160,0.4)"}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: T, display: "block", marginBottom: 6 }}>
                    UF
                  </label>
                  <input
                    type="text"
                    value={uf}
                    onChange={e => setUf(e.target.value.toUpperCase().slice(0, 2))}
                    placeholder="MG"
                    maxLength={2}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = T}
                    onBlur={e => e.target.style.borderColor = "rgba(208,88,160,0.4)"}
                  />
                </div>
              </div>
              </>
            )}

            <div>
              <label style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: K, display: "block", marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value.replace(/\s/g, ""))}
                placeholder="seu@email.com"
                required
                autoComplete="off"
                name="pigeonz-email-field"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = K}
                onBlur={e => e.target.style.borderColor = "rgba(208,88,160,0.4)"}
              />
            </div>

            <div>
              <label style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: K, display: "block", marginBottom: 6 }}>
                Senha
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value.replace(/\s/g, ""))}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  name="pigeonz-pass-field"
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => e.target.style.borderColor = K}
                  onBlur={e => e.target.style.borderColor = "rgba(208,88,160,0.4)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                    background: "transparent", border: "none", cursor: "pointer",
                    fontFamily: "'VT323', monospace", fontSize: 16, color: "#8878a8",
                    padding: "4px 6px", transition: "color 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = K}
                  onMouseLeave={e => e.currentTarget.style.color = "#8878a8"}
                >
                  {showPass ? "OCULTAR" : "VER"}
                </button>
              </div>
            </div>

            {isLogin && (
              <div style={{ textAlign: "right", marginTop: -8 }}>
                <button
                  type="button"
                  onClick={() => {
                    if (!email.trim()) { setError("Digite seu email para recuperar a senha."); return; }
                    setForgotSent(true);
                    setError("");
                    setTimeout(() => setForgotSent(false), 5000);
                  }}
                  style={{
                    fontFamily: "'VT323', monospace", fontSize: 16, color: "#8878a8",
                    background: "transparent", border: "none", cursor: "pointer",
                    textDecoration: "underline", padding: 0, transition: "color 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = K}
                  onMouseLeave={e => e.currentTarget.style.color = "#8878a8"}
                >
                  Esqueceu a senha?
                </button>
                {forgotSent && (
                  <p style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#48e8a0", margin: "6px 0 0", textAlign: "right" }}>
                    ✓ Link de recuperação enviado para {email}
                  </p>
                )}
              </div>
            )}

            {/* reCAPTCHA */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ReCAPTCHA
                sitekey={RECAPTCHA_SITEKEY}
                onChange={(token: string | null) => setCaptchaOk(!!token)}
                onExpired={() => setCaptchaOk(false)}
                theme="dark"
              />
            </div>

            {error && (
              <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#ff6060", margin: 0 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-p"
              style={{
                width: "100%",
                fontSize: 12,
                padding: "16px",
                marginTop: 8,
                letterSpacing: 2,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "..." : tab === "criar" ? "Criar conta" : "Entrar"}
            </button>
          </form>

          {/* Voltar */}
          <a
            href="/"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: 24,
              fontFamily: "'VT323', monospace",
              fontSize: 18,
              color: "#6b5c85",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = T}
            onMouseLeave={e => e.currentTarget.style.color = "#6b5c85"}
          >
            &larr; Voltar ao site
          </a>
        </div>

        {/* Incentivo criar conta */}
        <p style={{
          fontFamily: "'VT323', monospace",
          fontSize: 17,
          color: "#ffffff",
          textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 8px rgba(0,0,0,0.5)",
          textAlign: "center",
          marginTop: 32,
          lineHeight: 1.5,
          maxWidth: 380,
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          Crie sua conta para acompanhar seus pedidos, conversar com a equipe, acessar seu painel e ter tudo do seu projeto em um só lugar.
        </p>
      </div>
    </div>
    </>
  );
}

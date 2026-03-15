"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import GlobalCityBg from "@/components/GlobalCityBg";
import { getComprovantes, setComprovantes as setComprovantesDB, onComprovantesChange, getAllPropostas, setProposta, getComissoes, setComissoes as setComissoesDB } from "@/lib/db";

const K = "#f0a0d0";
const T = "#48c0b8";
const G = "#48e8a0";

function decodeBase64UTF8(dataUrl: string): string {
  const base64 = dataUrl.split(",")[1];
  const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

function maskBRL(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (!digits) return "";
  while (digits.length < 3) digits = "0" + digits;
  const cents = digits.slice(-2);
  const intPart = digits.slice(0, -2).replace(/^0+/, "") || "0";
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${formatted},${cents}`;
}

type Comprovante = {
  cliente: string;
  email: string;
  plano: string;
  valorPlano?: string;
  valor: string;
  comprovante: { name: string; dataUrl: string };
  data: string;
  status: "pendente" | "confirmado";
  notaFiscal: { name: string; dataUrl: string } | null;
  cupomRef: string | null;
  // client info for nota fiscal
  cpfCnpj?: string;
  razaoSocial?: string;
  endereco?: string;
  municipio?: string;
  uf?: string;
};

const PRESTADOR = {
  cpf: "138.424.386-05",
  nome: "SARAH FIGUEIREDO BRANDAO SANTIAGO",
  empresa: "pigeonz.ai",
  endereco: "Rua Padre Francisco Arantes, 141",
  municipio: "BELO HORIZONTE",
  uf: "MG",
  email: "sarahsantiago100@gmail.com",
};

function gerarNumeroNota() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function gerarCodigoVerificacao() {
  const chars = "0123456789ABCDEF";
  let code = "";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function gerarNotaFiscalHTML(c: Comprovante, numero: string, codigo: string) {
  const agora = new Date();
  const dataEmissao = `${agora.getDate().toString().padStart(2, "0")}/${(agora.getMonth() + 1).toString().padStart(2, "0")}/${agora.getFullYear()} ${agora.getHours().toString().padStart(2, "0")}:${agora.getMinutes().toString().padStart(2, "0")}:${agora.getSeconds().toString().padStart(2, "0")}`;
  const valorNum = c.valor.replace(/[^\d,]/g, "").replace(",", ".");
  const planoDesc = `Desenvolvimento de site - Plano ${c.plano}`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>NFS-e pigeonz.ai</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #222; background: #fff; padding: 20px; }
  .nf-container { max-width: 800px; margin: 0 auto; border: 2px solid #333; }
  .nf-header { display: flex; align-items: center; border-bottom: 2px solid #333; }
  .nf-logo { padding: 12px 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 120px; border-right: 2px solid #333; }
  .nf-logo-text { font-family: 'Courier New', monospace; font-weight: bold; }
  .nf-logo-pigeonz { color: #ff50c0; font-size: 18px; }
  .nf-logo-ai { color: #48c0b8; font-size: 18px; }
  .nf-header-center { flex: 1; padding: 8px 16px; text-align: center; }
  .nf-header-center h2 { font-size: 13px; color: #333; margin-bottom: 2px; }
  .nf-header-center h3 { font-size: 11px; color: #555; margin-bottom: 6px; }
  .nf-header-center h1 { font-size: 14px; color: #222; }
  .nf-header-right { min-width: 180px; border-left: 2px solid #333; padding: 8px 12px; font-size: 11px; }
  .nf-header-right .label { color: #666; font-size: 10px; }
  .nf-header-right .value { font-weight: bold; font-size: 14px; }
  .nf-section-title { background: #48c0b8; color: #fff; font-weight: bold; font-size: 12px; padding: 4px 12px; letter-spacing: 0.5px; }
  .nf-section { padding: 10px 12px; border-bottom: 1px solid #ccc; }
  .nf-row { display: flex; gap: 24px; margin-bottom: 4px; }
  .nf-field .label { color: #666; font-size: 10px; }
  .nf-field .value { font-weight: bold; font-size: 12px; }
  .nf-total { background: #f0f8f7; padding: 12px; text-align: right; border-top: 2px solid #48c0b8; }
  .nf-total .label { font-size: 11px; color: #555; }
  .nf-total .value { font-size: 20px; font-weight: bold; color: #222; }
  .nf-footer { padding: 8px 12px; text-align: center; font-size: 10px; color: #888; border-top: 1px solid #ddd; }
  @media print { body { padding: 0; } .nf-container { border: 1px solid #999; } }
</style>
</head><body>
<div class="nf-container">
  <div class="nf-header">
    <div class="nf-logo">
      <div class="nf-logo-text">
        <span class="nf-logo-pigeonz">pigeonz</span><span class="nf-logo-ai">.ai</span>
      </div>
      <div style="font-size:9px;color:#888;margin-top:4px;">FULLSTACK STUDIO</div>
    </div>
    <div class="nf-header-center">
      <h2>pigeonz.ai - Desenvolvimento Web</h2>
      <h3>Prestação de Serviços de Tecnologia</h3>
      <h1>NOTA FISCAL DE SERVIÇOS ELETRÔNICA - NFS-e</h1>
    </div>
    <div class="nf-header-right">
      <div class="label">Data e Hora da Emissão</div>
      <div class="value" style="font-size:12px;">${dataEmissao}</div>
    </div>
  </div>

  <div class="nf-section-title">PRESTADOR DE SERVIÇOS</div>
  <div class="nf-section">
    <div class="nf-row">
      <div class="nf-field"><div class="label">CPF:</div><div class="value">${PRESTADOR.cpf}</div></div>
    </div>
    <div class="nf-row">
      <div class="nf-field"><div class="label">Nome / Razão Social:</div><div class="value">${PRESTADOR.nome}</div></div>
    </div>
    <div class="nf-row">
      <div class="nf-field"><div class="label">Nome da Empresa / Prestador de Serviço:</div><div class="value">${PRESTADOR.empresa}</div></div>
    </div>
    <div class="nf-row">
      <div class="nf-field"><div class="label">Endereço:</div><div class="value">${PRESTADOR.endereco}</div></div>
    </div>
    <div class="nf-row">
      <div class="nf-field" style="margin-right:40px;"><div class="label">Município:</div><div class="value">${PRESTADOR.municipio}</div></div>
      <div class="nf-field" style="margin-right:40px;"><div class="label">UF:</div><div class="value">${PRESTADOR.uf}</div></div>
      <div class="nf-field"><div class="label">E-mail:</div><div class="value">${PRESTADOR.email}</div></div>
    </div>
  </div>

  <div class="nf-section-title">TOMADOR DE SERVIÇOS</div>
  <div class="nf-section">
    <div class="nf-row">
      <div class="nf-field"><div class="label">CPF/CNPJ:</div><div class="value">${c.cpfCnpj || "Não informado"}</div></div>
    </div>
    <div class="nf-row">
      <div class="nf-field"><div class="label">Nome / Razão Social:</div><div class="value">${(c.razaoSocial || c.cliente).toUpperCase()}</div></div>
    </div>
    <div class="nf-row">
      <div class="nf-field"><div class="label">Endereço:</div><div class="value">${c.endereco || "Não informado"}</div></div>
    </div>
    <div class="nf-row">
      <div class="nf-field" style="margin-right:40px;"><div class="label">Município:</div><div class="value">${(c.municipio || "Não informado").toUpperCase()}</div></div>
      <div class="nf-field" style="margin-right:40px;"><div class="label">UF:</div><div class="value">${(c.uf || "—").toUpperCase()}</div></div>
      <div class="nf-field"><div class="label">E-mail:</div><div class="value">${c.email}</div></div>
    </div>
  </div>

  <div class="nf-section-title">DISCRIMINAÇÃO DOS SERVIÇOS</div>
  <div class="nf-section">
    <div class="nf-field">
      <div class="value">${planoDesc}; Qtde.: 01; Preço Unitário: ${valorNum}</div>
    </div>
  </div>

  <div class="nf-total">
    <div class="label">VALOR TOTAL DA NOTA</div>
    <div class="value">${c.valor}</div>
  </div>

  <div class="nf-footer">
    Documento gerado por pigeonz.ai · ${dataEmissao}
  </div>
</div>
</body></html>`;
}

function compressImage(dataUrl: string, maxWidth = 1024, quality = 0.5): Promise<string> {
  return new Promise((resolve) => {
    if (!dataUrl.startsWith("data:image")) { resolve(dataUrl); return; }
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ratio = Math.min(maxWidth / img.width, 1);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export default function ComprovantesPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [comprovantes, setComprovantes] = useState<Comprovante[]>([]);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [notaFiles, setNotaFiles] = useState<Record<number, { name: string; dataUrl: string }>>({});
  const [gerandoNota, setGerandoNota] = useState<number | null>(null);
  const notaIframeRef = useRef<HTMLIFrameElement>(null);
  const [showManual, setShowManual] = useState(false);
  const [manualNome, setManualNome] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualPlano, setManualPlano] = useState("Starter");
  const [manualValor, setManualValor] = useState("");
  const [manualFile, setManualFile] = useState<{ name: string; dataUrl: string } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("pigeonz_user");
    if (!raw) { router.push("/login"); return; }
    const parsed = JSON.parse(raw);
    if (parsed.role !== "admin") { router.push("/login"); return; }
    setUser(parsed);

    // Load from Firestore
    getComprovantes().then(items => setComprovantes(items as Comprovante[]));

    // Real-time sync
    const unsub = onComprovantesChange(items => {
      if (skipCompSync.current) { skipCompSync.current = false; return; }
      setComprovantes(items as Comprovante[]);
    });
    return () => unsub();
  }, [router]);

  const skipCompSync = useRef(false);

  const save = async (updated: Comprovante[]) => {
    setComprovantes(updated);
    skipCompSync.current = true;
    try {
      await setComprovantesDB(updated);
    } catch (err) {
      console.error("Firestore save failed:", err);
      // If save failed, don't let listener overwrite
      skipCompSync.current = false;
    }
  };

  const gerarNotaFiscal = (idx: number) => {
    const c = comprovantes[idx];
    const numero = gerarNumeroNota();
    const codigo = gerarCodigoVerificacao();
    const html = gerarNotaFiscalHTML(c, numero, codigo);

    // Convert HTML to data URL for storage and sending to client
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const fileName = `NFS-e_${numero}_${c.cliente.replace(/\s+/g, "_")}.html`;
      setNotaFiles(prev => ({ ...prev, [idx]: { name: fileName, dataUrl } }));
      setGerandoNota(null);
    };
    reader.readAsDataURL(blob);
  };

  const previewNota = (idx: number) => {
    const c = comprovantes[idx];
    const numero = gerarNumeroNota();
    const codigo = gerarCodigoVerificacao();
    const html = gerarNotaFiscalHTML(c, numero, codigo);
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  const confirmar = (idx: number) => {
    const updated = [...comprovantes];
    const comp = updated[idx];
    updated[idx] = {
      ...comp,
      status: "confirmado",
      notaFiscal: notaFiles[idx] || null,
    };
    save(updated);
    setExpandedIdx(null);

    // Auto-insert into Clientes/Projetos (Firestore propostas)
    (async () => {
      const allPropostas = await getAllPropostas();
      if (!allPropostas[comp.email]) {
        const planIdx = comp.plano === "Starter" ? 0 : comp.plano === "Pro" ? 1 : comp.plano === "Enterprise" ? 3 : null;
        await setProposta(comp.email, {
          userName: comp.cliente,
          userEmail: comp.email,
          userRole: "cliente",
          currentStep: "descrever_projeto",
          selectedPlan: planIdx,
          briefing: "",
          devDone: [false, false, false, false, false, false, false],
          comments: [],
          propostaPdf: null,
          propostaLink: "",
          aceitouTermos: false,
          siteLink: "",
          dominio: "",
          hospedagem: "",
          firebaseEmail: "",
          firebaseSenha: "",
          cupomAplicado: !!comp.cupomRef,
          cupomRef: comp.cupomRef || "",
          comprovante: comp.comprovante,
          comprovanteSent: true,
          pagamentoConfirmado: true,
          notaFiscal: notaFiles[idx] || null,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await setProposta(comp.email, {
          ...allPropostas[comp.email],
          pagamentoConfirmado: true,
          comprovanteSent: true,
          notaFiscal: notaFiles[idx] || allPropostas[comp.email].notaFiscal || null,
          updatedAt: new Date().toISOString(),
        });
      }

      // Auto-create comissão for partner if client came via referral
      if (comp.cupomRef) {
        const comissoesArr = await getComissoes();
        const alreadyExists = (comissoesArr as any[]).find((c: any) => c.email === comp.email);
        if (!alreadyExists) {
          const valorNum = parseFloat(comp.valor.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
          const comissaoValor = valorNum * 0.1;
          const updated = [...comissoesArr, {
            nome: comp.cliente,
            email: comp.email,
            telefone: "",
            plano: comp.plano,
            site: "",
            status: "em_andamento",
            valorPlano: comp.valorPlano || comp.valor,
            valorCliente: comp.valor,
            comissao: `R$ ${comissaoValor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
            pago: false,
            data: new Date().toISOString().split("T")[0],
          }];
          await setComissoesDB(updated);
        }
      }
    })();
  };

  const registrarManual = () => {
    if (!manualNome.trim() || !manualEmail.trim() || !manualValor.trim() || !manualFile) return;
    const novo: Comprovante = {
      cliente: manualNome.trim(),
      email: manualEmail.trim(),
      plano: manualPlano,
      valor: manualValor.trim(),
      comprovante: manualFile,
      data: new Date().toISOString().split("T")[0],
      status: "pendente",
      notaFiscal: null,
      cupomRef: null,
    };
    save([novo, ...comprovantes]);
    setManualNome(""); setManualEmail(""); setManualPlano("Starter"); setManualValor(""); setManualFile(null); setShowManual(false);
  };

  const pendentes = comprovantes.filter(c => c.status === "pendente");
  const confirmados = comprovantes.filter(c => c.status === "confirmado");

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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <h1 style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(12px, 2.5vw, 20px)",
            color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000",
            margin: 0,
            lineHeight: 1.6,
          }}>
            Comprovantes
          </h1>
        </div>
        <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000", marginBottom: 32 }}>
          Revise comprovantes de pagamento, gere notas fiscais e confirme pagamentos.
        </p>

        {/* Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "16px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, color: K }}>{pendentes.length}</div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: "#8878a8", marginTop: 4 }}>Pendentes</div>
          </div>
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "16px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, color: G }}>{confirmados.length}</div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: "#8878a8", marginTop: 4 }}>Confirmados</div>
          </div>
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "16px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, color: T }}>{comprovantes.length}</div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: "#8878a8", marginTop: 4 }}>Total</div>
          </div>
        </div>

        {/* Registrar Manualmente */}
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={() => setShowManual(!showManual)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "'Press Start 2P', monospace", fontSize: 8,
              padding: "10px 18px", letterSpacing: 1,
              color: showManual ? "#1c1030" : T,
              background: showManual ? T : "transparent",
              border: `2px solid ${T}`,
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={showManual ? "#1c1030" : T} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            REGISTRAR MANUALMENTE
          </button>

          {showManual && (
            <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", marginTop: 12 }}>
              <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: T, margin: "0 0 16px", letterSpacing: 1 }}>
                NOVO COMPROVANTE
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#8878a8", display: "block", marginBottom: 4 }}>Nome do cliente</label>
                    <input
                      type="text" value={manualNome} onChange={e => setManualNome(e.target.value)}
                      placeholder="Nome completo"
                      style={{ width: "100%", background: "rgba(8,7,20,0.92)", border: `2px solid ${T}44`, color: "#f0ebfa", fontFamily: "'VT323', monospace", fontSize: 18, padding: "8px 12px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#8878a8", display: "block", marginBottom: 4 }}>Email</label>
                    <input
                      type="email" value={manualEmail} onChange={e => setManualEmail(e.target.value)}
                      placeholder="email@exemplo.com"
                      style={{ width: "100%", background: "rgba(8,7,20,0.92)", border: `2px solid ${T}44`, color: "#f0ebfa", fontFamily: "'VT323', monospace", fontSize: 18, padding: "8px 12px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#8878a8", display: "block", marginBottom: 4 }}>Plano</label>
                    <select
                      value={manualPlano} onChange={e => setManualPlano(e.target.value)}
                      style={{ width: "100%", background: "rgba(8,7,20,0.92)", border: `2px solid ${T}44`, color: "#f0ebfa", fontFamily: "'VT323', monospace", fontSize: 18, padding: "8px 12px", outline: "none" }}
                    >
                      <option value="Starter">Starter</option>
                      <option value="Pro">Pro</option>
                      <option value="Parceria">Parceria</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#8878a8", display: "block", marginBottom: 4 }}>Valor</label>
                    <input
                      type="text" value={manualValor} onChange={e => setManualValor(maskBRL(e.target.value))}
                      placeholder="R$ 2.567,00"
                      style={{ width: "100%", background: "rgba(8,7,20,0.92)", border: `2px solid ${T}44`, color: "#f0ebfa", fontFamily: "'VT323', monospace", fontSize: 18, padding: "8px 12px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#8878a8", display: "block", marginBottom: 4 }}>Comprovante (imagem ou PDF)</label>
                  {!manualFile ? (
                    <label style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      padding: "14px 20px",
                      border: `2px dashed ${K}44`,
                      cursor: "pointer", transition: "all 0.2s",
                    }}>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={K} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: K }}>Clique para anexar arquivo</span>
                      <input
                        type="file" accept=".pdf,.png,.jpg,.jpeg" style={{ display: "none" }}
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = async () => {
                            const compressed = await compressImage(reader.result as string);
                            setManualFile({ name: file.name, dataUrl: compressed });
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "rgba(72,232,160,0.06)", border: `1px solid ${G}33` }}>
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: G, flex: 1 }}>{manualFile.name}</span>
                      <button onClick={() => setManualFile(null)} style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#ff6060", background: "transparent", border: "none", cursor: "pointer" }}>✕</button>
                    </div>
                  )}
                </div>
                <button
                  onClick={registrarManual}
                  disabled={!manualNome.trim() || !manualEmail.trim() || !manualValor.trim() || !manualFile}
                  style={{
                    fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                    padding: "12px 20px", letterSpacing: 1,
                    color: "#1c1030", background: K,
                    border: `2px solid ${K}`,
                    cursor: (!manualNome.trim() || !manualEmail.trim() || !manualValor.trim() || !manualFile) ? "not-allowed" : "pointer",
                    opacity: (!manualNome.trim() || !manualEmail.trim() || !manualValor.trim() || !manualFile) ? 0.5 : 1,
                    transition: "all 0.2s",
                    alignSelf: "flex-start",
                  }}
                >
                  REGISTRAR COMPROVANTE
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pendentes */}
        <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: K, margin: "0 0 16px", letterSpacing: 1 }}>
            AGUARDANDO CONFIRMAÇÃO
          </h3>

          {pendentes.length === 0 ? (
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#6b5c85" }}>
              Nenhum comprovante pendente.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {comprovantes.map((c, i) => {
                if (c.status !== "pendente") return null;
                const isExpanded = expandedIdx === i;
                return (
                  <div key={i} style={{
                    padding: "16px",
                    background: "rgba(8,7,20,0.75)",
                    border: `1px solid ${isExpanded ? K + "88" : K + "33"}`,
                    transition: "all 0.2s",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: K }}>
                            {c.cliente}
                          </span>
                          <span style={{
                            fontFamily: "'VT323', monospace", fontSize: 14,
                            padding: "2px 8px", color: "#f0a050", border: "1px solid #f0a050",
                          }}>
                            PENDENTE
                          </span>
                        </div>
                        <p style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#b8a8d8", margin: 0 }}>
                          {c.email} · Plano: <strong style={{ color: T }}>{c.plano}</strong> · Valor: <strong style={{ color: G }}>{c.valor}</strong>
                        </p>
                        <p style={{ fontFamily: "'VT323', monospace", fontSize: 14, color: "#6b5c85", margin: "2px 0 0" }}>
                          Enviado: {c.data}
                          {c.cupomRef && <span> · Indicado por: <strong style={{ color: T }}>{c.cupomRef}</strong></span>}
                        </p>
                      </div>
                      <button
                        onClick={() => setExpandedIdx(isExpanded ? null : i)}
                        style={{
                          fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                          padding: "6px 10px", letterSpacing: 1,
                          color: isExpanded ? "#1c1030" : K,
                          background: isExpanded ? K : "transparent",
                          border: `2px solid ${K}`,
                          cursor: "pointer", transition: "all 0.2s",
                        }}
                      >
                        {isExpanded ? "FECHAR" : "REVISAR"}
                      </button>
                    </div>

                    {isExpanded && (
                      <div style={{ marginTop: 16, padding: "16px", background: "rgba(240,160,208,0.04)", border: `1px solid ${K}33` }}>
                        {/* Comprovante preview */}
                        <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#8878a8", display: "block", marginBottom: 8 }}>
                          Comprovante: <strong style={{ color: T }}>{c.comprovante.name}</strong>
                        </label>
                        <div style={{ marginBottom: 16 }}>
                          {c.comprovante.name.toLowerCase().endsWith(".pdf") ? (
                            <a
                              href={c.comprovante.dataUrl}
                              download={c.comprovante.name}
                              style={{
                                fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                                padding: "8px 14px", letterSpacing: 1,
                                color: T, border: `1px solid ${T}`,
                                textDecoration: "none", display: "inline-block",
                              }}
                            >
                              BAIXAR PDF
                            </a>
                          ) : (
                            <img
                              src={c.comprovante.dataUrl}
                              alt="Comprovante"
                              style={{ maxWidth: "100%", maxHeight: 400, border: `1px solid ${T}33` }}
                            />
                          )}
                        </div>

                        {/* Client info */}
                        {(c.cpfCnpj || c.razaoSocial || c.endereco) && (
                          <div style={{ marginBottom: 16, padding: "10px 14px", background: "rgba(72,192,184,0.06)", border: `1px solid ${T}22` }}>
                            <label style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: T, display: "block", marginBottom: 6 }}>
                              Dados do cliente:
                            </label>
                            {c.cpfCnpj && <p style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: "#b8a8d8", margin: "2px 0" }}>CPF/CNPJ: <strong>{c.cpfCnpj}</strong></p>}
                            {c.razaoSocial && <p style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: "#b8a8d8", margin: "2px 0" }}>Razão Social: <strong>{c.razaoSocial}</strong></p>}
                            {c.endereco && <p style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: "#b8a8d8", margin: "2px 0" }}>Endereço: <strong>{c.endereco}</strong></p>}
                            {c.municipio && <p style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: "#b8a8d8", margin: "2px 0" }}>Município: <strong>{c.municipio}</strong> {c.uf && `- ${c.uf}`}</p>}
                          </div>
                        )}

                        {/* Nota Fiscal section */}
                        <div style={{ marginBottom: 16, padding: "12px 14px", background: "rgba(72,232,160,0.04)", border: `1px solid ${G}22` }}>
                          <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: G, display: "block", marginBottom: 10, letterSpacing: 1 }}>
                            NOTA FISCAL
                          </label>

                          {!notaFiles[i] ? (
                            <>
                              {gerandoNota === i ? (
                                <div style={{ textAlign: "center", padding: "16px 0" }}>
                                  <div style={{
                                    display: "inline-block", width: 28, height: 28,
                                    border: `3px solid ${G}33`, borderTop: `3px solid ${G}`,
                                    borderRadius: "50%",
                                    animation: "spin 1s linear infinite",
                                    marginBottom: 8,
                                  }} />
                                  <p style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: G, margin: 0 }}>
                                    Gerando nota fiscal...
                                  </p>
                                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                </div>
                              ) : (
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                  <button
                                    onClick={() => {
                                      setGerandoNota(i);
                                      setTimeout(() => gerarNotaFiscal(i), 1500);
                                    }}
                                    style={{
                                      fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                                      padding: "12px 20px", letterSpacing: 1,
                                      color: "#1c1030", background: G,
                                      border: `2px solid ${G}`,
                                      cursor: "pointer", transition: "all 0.2s",
                                      boxShadow: `4px 4px 0 ${G}44`,
                                    }}
                                  >
                                    GERAR NF
                                  </button>
                                  <label style={{
                                    display: "inline-flex", alignItems: "center",
                                    fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                                    padding: "10px 14px", letterSpacing: 1,
                                    color: K, border: `2px dashed ${K}44`,
                                    cursor: "pointer", transition: "all 0.2s",
                                  }}>
                                    OU ANEXAR ARQUIVO
                                    <input
                                      type="file"
                                      accept=".pdf,.png,.jpg,.jpeg,.html"
                                      style={{ display: "none" }}
                                      onChange={e => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                          setNotaFiles(prev => ({ ...prev, [i]: { name: file.name, dataUrl: reader.result as string } }));
                                        };
                                        reader.readAsDataURL(file);
                                      }}
                                    />
                                  </label>
                                </div>
                              )}
                            </>
                          ) : (
                            <div>
                              {/* NF gerada */}
                              <div style={{
                                display: "flex", alignItems: "center", gap: 10,
                                padding: "10px 14px", background: "rgba(72,232,160,0.08)",
                                border: "1px solid #48e8a044", marginBottom: 12,
                              }}>
                                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                <span style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: G, flex: 1 }}>
                                  NF gerada: {notaFiles[i].name}
                                </span>
                                <button
                                  onClick={() => setNotaFiles(prev => { const n = { ...prev }; delete n[i]; return n; })}
                                  style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#ff6060", background: "transparent", border: "none", cursor: "pointer" }}
                                >
                                  ✕
                                </button>
                              </div>
                              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                <button
                                  onClick={() => {
                                    const nf = notaFiles[i];
                                    if (!nf) return;
                                    if (nf.dataUrl.startsWith("data:text/html")) {
                                      // Decode and open in new tab
                                      const html = decodeBase64UTF8(nf.dataUrl);
                                      const win = window.open("", "_blank");
                                      if (win) { win.document.write(html); win.document.close(); }
                                    } else {
                                      const win = window.open("", "_blank");
                                      if (win) {
                                        win.document.write(`<img src="${nf.dataUrl}" style="max-width:100%"/>`);
                                        win.document.close();
                                      }
                                    }
                                  }}
                                  style={{
                                    fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                                    padding: "10px 16px", letterSpacing: 1,
                                    color: T, background: "transparent",
                                    border: `2px solid ${T}`,
                                    cursor: "pointer", transition: "all 0.2s",
                                  }}
                                >
                                  VISUALIZAR
                                </button>
                                <button
                                  onClick={() => {
                                    // Send NF to client (save in comprovante and confirm)
                                    confirmar(i);
                                  }}
                                  style={{
                                    fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                                    padding: "10px 16px", letterSpacing: 1,
                                    color: "#1c1030", background: K,
                                    border: `2px solid ${K}`,
                                    cursor: "pointer", transition: "all 0.2s",
                                    boxShadow: `4px 4px 0 ${K}44`,
                                  }}
                                >
                                  ENVIAR NF E CONFIRMAR PAGAMENTO
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Confirmados */}
        {confirmados.length > 0 && (
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: G, margin: "0 0 16px", letterSpacing: 1 }}>
              CONFIRMADOS
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {comprovantes.map((c, i) => {
                if (c.status !== "confirmado") return null;
                return (
                  <div key={i} style={{
                    padding: "16px",
                    background: "rgba(8,7,20,0.75)",
                    border: `1px solid ${G}33`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: G }}>
                            {c.cliente}
                          </span>
                          <span style={{
                            fontFamily: "'VT323', monospace", fontSize: 14,
                            padding: "2px 8px", color: G, border: `1px solid ${G}`,
                          }}>
                            CONFIRMADO
                          </span>
                        </div>
                        <p style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#b8a8d8", margin: 0 }}>
                          {c.email} · Plano: <strong style={{ color: T }}>{c.plano}</strong> · Valor: <strong style={{ color: G }}>{c.valor}</strong>
                        </p>
                        <p style={{ fontFamily: "'VT323', monospace", fontSize: 14, color: "#6b5c85", margin: "2px 0 0" }}>
                          {c.data}
                          {c.notaFiscal && <span> · NF: {c.notaFiscal.name}</span>}
                          {c.cupomRef && <span> · Parceiro: {c.cupomRef}</span>}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                        <button
                          onClick={() => {
                            if (c.comprovante.dataUrl.startsWith("data:application/pdf") || c.comprovante.name.toLowerCase().endsWith(".pdf")) {
                              const a = document.createElement("a"); a.href = c.comprovante.dataUrl; a.download = c.comprovante.name; a.click();
                            } else {
                              const win = window.open("", "_blank");
                              if (win) { win.document.write(`<img src="${c.comprovante.dataUrl}" style="max-width:100%"/>`); win.document.close(); }
                            }
                          }}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                            padding: "8px 14px", letterSpacing: 1,
                            color: T, background: "transparent",
                            border: `2px solid ${T}`, cursor: "pointer", transition: "all 0.2s",
                          }}
                        >
                          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx={12} cy={12} r={3}/>
                          </svg>
                          COMPROVANTE
                        </button>
                        {c.notaFiscal && (
                          <button
                            onClick={() => {
                              const nf = c.notaFiscal!;
                              if (nf.dataUrl.startsWith("data:text/html")) {
                                const html = decodeBase64UTF8(nf.dataUrl);
                                const win = window.open("", "_blank");
                                if (win) { win.document.write(html); win.document.close(); }
                              } else {
                                const a = document.createElement("a"); a.href = nf.dataUrl; a.download = nf.name; a.click();
                              }
                            }}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 6,
                              fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                              padding: "8px 14px", letterSpacing: 1,
                              color: G, background: "transparent",
                              border: `2px solid ${G}`, cursor: "pointer", transition: "all 0.2s",
                            }}
                          >
                            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                            </svg>
                            NOTA FISCAL
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={() => router.push("/admin")}
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 10, padding: "14px 32px", letterSpacing: 2, cursor: "pointer",
            background: K, color: "#1c1030", border: `2px solid ${K}`,
            boxShadow: `4px 4px 0 ${K}44`, transition: "all 0.2s",
            width: "100%", marginTop: 8,
          }}
        >
          VOLTAR AO PAINEL
        </button>
      </div>
    </div>
    </>
  );
}

"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import GlobalCityBg from "@/components/GlobalCityBg";
import { getParceiros, setParceiros as setParceirosDB, onParceirosChange, getComissoes, setComissoes as setComissoesDB, getParceiroPix } from "@/lib/db";

const K = "#f0a0d0";
const T = "#48c0b8";
const G = "#48e8a0";

function decodeBase64UTF8(dataUrl: string): string {
  const base64 = dataUrl.split(",")[1];
  const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

const TOMADOR_ADMIN = {
  cpf: "138.424.386-05",
  nome: "SARAH FIGUEIREDO BRANDAO SANTIAGO",
  empresa: "pigeonz.ai",
  endereco: "Rua Padre Francisco Arantes, 141",
  municipio: "BELO HORIZONTE",
  uf: "MG",
  email: "sarahsantiago100@gmail.com",
};

type Parceiro = {
  nome: string;
  email: string;
  telefone: string;
  data: string;
  auto: boolean;
};

type DadosPix = {
  chavePix: string;
  nomeCompleto: string;
  cpfCnpj: string;
};

type Comissao = {
  nome: string;
  email: string;
  telefone: string;
  plano: string;
  site: string;
  status: "em_andamento" | "entregue" | "cancelado";
  comissao: string;
  valorPlano?: string;
  valorCliente?: string;
  pago: boolean;
  data: string;
  dataPagamento?: string;
  notaFiscalComissao?: { name: string; dataUrl: string } | null;
};

const inputStyle = {
  width: "100%",
  background: "rgba(8,7,20,0.92)",
  border: `2px solid ${T}66`,
  color: "#f0ebfa",
  fontFamily: "'VT323', monospace",
  fontSize: 18,
  padding: "10px 14px",
  outline: "none",
  boxSizing: "border-box" as const,
  transition: "border-color 0.2s",
};

const DEFAULT_PARCEIROS: Parceiro[] = [
  { nome: "BlueZone", email: "bluezonesalesmkt@gmail.com", telefone: "", data: "2026-03-12", auto: false },
];

function gerarNumeroNota() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function gerarCodigoVerificacao() {
  const chars = "0123456789ABCDEF";
  let code = "";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function gerarNFComissaoHTML(parceiro: DadosPix, valorComissao: string, clienteNome: string, plano: string, numero: string, codigo: string) {
  const agora = new Date();
  const dataEmissao = `${agora.getDate().toString().padStart(2, "0")}/${(agora.getMonth() + 1).toString().padStart(2, "0")}/${agora.getFullYear()} ${agora.getHours().toString().padStart(2, "0")}:${agora.getMinutes().toString().padStart(2, "0")}:${agora.getSeconds().toString().padStart(2, "0")}`;
  const valorNum = valorComissao.replace(/[^\d,]/g, "").replace(",", ".");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>NFS-e ${numero} - Comissão</title>
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
  .nf-section-title { background: #48c0b8; color: #fff; font-weight: bold; font-size: 12px; padding: 4px 12px; }
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
      <div class="nf-logo-text"><span class="nf-logo-pigeonz">pigeonz</span><span class="nf-logo-ai">.ai</span></div>
      <div style="font-size:9px;color:#888;margin-top:4px;">FULLSTACK STUDIO</div>
    </div>
    <div class="nf-header-center">
      <h2>pigeonz.ai - Pagamento de Comissão</h2>
      <h3>Comissão por Indicação de Cliente</h3>
      <h1>NOTA FISCAL DE SERVIÇOS ELETRÔNICA - NFS-e</h1>
    </div>
    <div class="nf-header-right">
      <div class="label">Número da Nota</div><div class="value">${numero}</div>
      <div class="label" style="margin-top:6px;">Data e Hora da Emissão</div><div class="value" style="font-size:12px;">${dataEmissao}</div>
      <div class="label" style="margin-top:6px;">Código Verificação</div><div class="value">${codigo}</div>
    </div>
  </div>
  <div class="nf-section-title">PRESTADOR DE SERVIÇOS (PARCEIRO)</div>
  <div class="nf-section">
    <div class="nf-row"><div class="nf-field"><div class="label">CPF/CNPJ:</div><div class="value">${parceiro.cpfCnpj || "Não informado"}</div></div></div>
    <div class="nf-row"><div class="nf-field"><div class="label">Nome / Razão Social:</div><div class="value">${parceiro.nomeCompleto.toUpperCase()}</div></div></div>
  </div>
  <div class="nf-section-title">TOMADOR DE SERVIÇOS</div>
  <div class="nf-section">
    <div class="nf-row"><div class="nf-field"><div class="label">CPF:</div><div class="value">${TOMADOR_ADMIN.cpf}</div></div></div>
    <div class="nf-row"><div class="nf-field"><div class="label">Nome / Razão Social:</div><div class="value">${TOMADOR_ADMIN.nome}</div></div></div>
    <div class="nf-row"><div class="nf-field"><div class="label">Empresa:</div><div class="value">${TOMADOR_ADMIN.empresa}</div></div></div>
    <div class="nf-row"><div class="nf-field"><div class="label">Endereço:</div><div class="value">${TOMADOR_ADMIN.endereco}</div></div></div>
    <div class="nf-row">
      <div class="nf-field" style="margin-right:40px;"><div class="label">Município:</div><div class="value">${TOMADOR_ADMIN.municipio}</div></div>
      <div class="nf-field" style="margin-right:40px;"><div class="label">UF:</div><div class="value">${TOMADOR_ADMIN.uf}</div></div>
      <div class="nf-field"><div class="label">E-mail:</div><div class="value">${TOMADOR_ADMIN.email}</div></div>
    </div>
  </div>
  <div class="nf-section-title">DISCRIMINAÇÃO DOS SERVIÇOS</div>
  <div class="nf-section">
    <div class="nf-field"><div class="value">Comissão por indicação de cliente: ${clienteNome} - Plano ${plano} (10%); Qtde.: 01; Preço Unitário: ${valorNum}</div></div>
  </div>
  <div class="nf-total"><div class="label">VALOR TOTAL DA NOTA</div><div class="value">${valorComissao}</div></div>
  <div class="nf-footer">Documento gerado por pigeonz.ai · ${dataEmissao}</div>
</div>
</body></html>`;
}

export default function ParceirosPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [comissoes, setComissoes] = useState<Comissao[]>([]);

  // Form novo parceiro
  const [showForm, setShowForm] = useState(false);
  const [fNome, setFNome] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fTelefone, setFTelefone] = useState("");

  // Link
  const [linkIdx, setLinkIdx] = useState<number | null>(null);
  const [linkCopiado, setLinkCopiado] = useState(false);

  // Gerar link manual
  const [manualEmail, setManualEmail] = useState("");
  const [manualLink, setManualLink] = useState("");
  const [manualCopiado, setManualCopiado] = useState(false);

  // Comissão: expanded parceiro for commission view
  const [comissaoIdx, setComissaoIdx] = useState<number | null>(null);

  // NF generation
  const [gerandoNF, setGerandoNF] = useState<string | null>(null); // key = "parceiroIdx-comissaoIdx"
  const [nfFiles, setNfFiles] = useState<Record<string, { name: string; dataUrl: string }>>({});

  const parceirosInitRef = useRef(false);
  const comissoesInitRef = useRef(false);
  const [allPixCache, setAllPixCache] = useState<Record<string, DadosPix>>({});

  useEffect(() => {
    const raw = localStorage.getItem("pigeonz_user");
    if (!raw) { router.push("/login"); return; }
    const parsed = JSON.parse(raw);
    if (parsed.role !== "admin") { router.push("/login"); return; }
    setUser(parsed);

    // Load parceiros from Firestore — seed with default if empty
    getParceiros().then(items => {
      const list = items as Parceiro[];
      if (list.length > 0) {
        const hasBlue = list.some(p => p.email === "bluezonesalesmkt@gmail.com");
        if (!hasBlue) list.unshift(DEFAULT_PARCEIROS[0]);
        setParceiros(list);
      } else {
        setParceiros(DEFAULT_PARCEIROS);
      }
      parceirosInitRef.current = true;
    });

    // Load comissoes from Firestore
    getComissoes().then(items => { setComissoes(items as Comissao[]); comissoesInitRef.current = true; });

    // Load pix data
    getParceiroPix().then(data => setAllPixCache(data as Record<string, DadosPix>));

    // Real-time sync
    const unsub = onParceirosChange(items => { setParceiros(items as Parceiro[]); parceirosInitRef.current = true; });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (user && parceirosInitRef.current) setParceirosDB(parceiros);
  }, [parceiros, user]);

  useEffect(() => {
    if (user && comissoesInitRef.current) setComissoesDB(comissoes);
  }, [comissoes, user]);

  const getPixData = (email: string): DadosPix | null => {
    return allPixCache[email] || null;
  };

  const getParceiroComissoes = (email: string) => {
    // All comissões belong to the partner (single-partner demo, or filter by cupomRef in comprovantes)
    return comissoes;
  };

  const addParceiro = () => {
    if (!fNome.trim() || !fEmail.trim()) return;
    setParceiros(prev => [...prev, {
      nome: fNome.trim(),
      email: fEmail.trim(),
      telefone: fTelefone.trim(),
      data: new Date().toISOString().split("T")[0],
      auto: false,
    }]);
    setFNome(""); setFEmail(""); setFTelefone("");
    setShowForm(false);
  };

  const removeParceiro = (idx: number) => {
    setParceiros(prev => prev.filter((_, i) => i !== idx));
    if (linkIdx === idx) setLinkIdx(null);
    if (comissaoIdx === idx) setComissaoIdx(null);
  };

  const getLink = (email: string) => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/login?ref=${encodeURIComponent(email)}`;
  };

  const copyLink = (link: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(link);
    setFn(true);
    setTimeout(() => setFn(false), 3000);
  };

  // NF generation for a specific comissão
  const gerarNF = (parceiroEmail: string, comIdx: number) => {
    const pix = getPixData(parceiroEmail);
    if (!pix) return;
    const c = comissoes[comIdx];
    const numero = gerarNumeroNota();
    const codigo = gerarCodigoVerificacao();
    const html = gerarNFComissaoHTML(pix, c.comissao, c.nome, c.plano, numero, codigo);
    const key = `${parceiroEmail}-${comIdx}`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const fileName = `NFS-e_Comissao_${numero}_${pix.nomeCompleto.replace(/\s+/g, "_")}.html`;
      setNfFiles(prev => ({ ...prev, [key]: { name: fileName, dataUrl } }));
      setGerandoNF(null);
    };
    reader.readAsDataURL(blob);
  };

  const confirmarPagamento = (parceiroEmail: string, comIdx: number) => {
    const key = `${parceiroEmail}-${comIdx}`;
    const nf = nfFiles[key] || null;
    setComissoes(prev => prev.map((c, i) => i === comIdx ? {
      ...c,
      pago: true,
      dataPagamento: new Date().toISOString().split("T")[0],
      notaFiscalComissao: nf,
    } : c));
    setNfFiles(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const totalComissao = comissoes.filter(c => c.status !== "cancelado").reduce((s, c) => s + (parseFloat(c.comissao.replace(/[^\d,.]/g, "").replace(",", ".")) || 0), 0);
  const totalPago = comissoes.filter(c => c.pago).reduce((s, c) => s + (parseFloat(c.comissao.replace(/[^\d,.]/g, "").replace(",", ".")) || 0), 0);
  const totalPendente = totalComissao - totalPago;

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
        <h1 style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(12px, 2.5vw, 20px)",
          color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000",
          margin: "0 0 8px",
          lineHeight: 1.6,
        }}>
          Gerenciar Parceiros
        </h1>
        <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000", marginBottom: 32 }}>
          Parceiros registrados, links de indicação e comissões.
        </p>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 28 }}>
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "16px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, color: T }}>{parceiros.length}</div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: "#8878a8", marginTop: 4 }}>Parceiros</div>
          </div>
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "16px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 18, color: G }}>R$ {totalComissao.toFixed(2).replace(".", ",")}</div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: "#8878a8", marginTop: 4 }}>Comissão Total</div>
          </div>
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "16px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 18, color: G }}>R$ {totalPago.toFixed(2).replace(".", ",")}</div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: "#8878a8", marginTop: 4 }}>Pago</div>
          </div>
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "16px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 18, color: totalPendente > 0 ? "#f0c848" : "#8878a8" }}>R$ {totalPendente.toFixed(2).replace(".", ",")}</div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: "#8878a8", marginTop: 4 }}>Pendente</div>
          </div>
        </div>

        {/* Parceiros cadastrados */}
        <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showForm ? 16 : 0 }}>
            <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: K, margin: 0, letterSpacing: 1 }}>
              PARCEIROS CADASTRADOS
            </h3>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                padding: "8px 14px", letterSpacing: 1,
                color: showForm ? "#8878a8" : "#1c1030",
                background: showForm ? "transparent" : K,
                border: `2px solid ${showForm ? "#4a3070" : K}`,
                cursor: "pointer", transition: "all 0.2s",
              }}
            >
              {showForm ? "CANCELAR" : "+ NOVO PARCEIRO"}
            </button>
          </div>

          {showForm && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px", background: "rgba(8,7,20,0.75)", border: `1px solid ${K}33`, marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: K, display: "block", marginBottom: 4 }}>Nome *</label>
                  <input value={fNome} onChange={e => setFNome(e.target.value)} placeholder="Nome do parceiro" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = K} onBlur={e => e.target.style.borderColor = `${T}66`} />
                </div>
                <div>
                  <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: K, display: "block", marginBottom: 4 }}>Email *</label>
                  <input type="email" value={fEmail} onChange={e => setFEmail(e.target.value)} placeholder="email@parceiro.com" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = K} onBlur={e => e.target.style.borderColor = `${T}66`} />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: K, display: "block", marginBottom: 4 }}>Telefone</label>
                <input type="tel" value={fTelefone} onChange={e => setFTelefone(e.target.value)} placeholder="(31) 99999-9999" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = K} onBlur={e => e.target.style.borderColor = `${T}66`} />
              </div>
              <button
                onClick={addParceiro}
                style={{
                  fontFamily: "'Press Start 2P', monospace", fontSize: 9,
                  padding: "12px 24px", letterSpacing: 1, alignSelf: "flex-start",
                  color: "#1c1030", background: K, border: `2px solid ${K}`,
                  cursor: fNome.trim() && fEmail.trim() ? "pointer" : "not-allowed",
                  boxShadow: `4px 4px 0 ${K}44`,
                  opacity: fNome.trim() && fEmail.trim() ? 1 : 0.5,
                  transition: "all 0.2s",
                }}
              >
                CADASTRAR PARCEIRO
              </button>
            </div>
          )}

          {/* Lista de parceiros */}
          {parceiros.length === 0 ? (
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#6b5c85", marginTop: 16 }}>
              Nenhum parceiro cadastrado ainda.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
              {parceiros.map((p, i) => {
                const link = getLink(p.email);
                const isLinkExpanded = linkIdx === i;
                const isComExpanded = comissaoIdx === i;
                const pix = getPixData(p.email);
                const parceiroComissoes = getParceiroComissoes(p.email);
                const comPendentes = parceiroComissoes.filter(c => !c.pago && c.status !== "cancelado");
                const comPagas = parceiroComissoes.filter(c => c.pago);

                return (
                  <div key={i} style={{
                    padding: "16px",
                    background: "rgba(8,7,20,0.75)",
                    border: `1px solid ${(isLinkExpanded || isComExpanded) ? T + "88" : T + "33"}`,
                    transition: "all 0.2s",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: T }}>
                            {p.nome}
                          </span>
                          <span style={{
                            fontFamily: "'VT323', monospace", fontSize: 14,
                            padding: "2px 8px",
                            color: p.auto ? G : K,
                            border: `1px solid ${p.auto ? G : K}`,
                          }}>
                            {p.auto ? "AUTO" : "MANUAL"}
                          </span>
                          {comPendentes.length > 0 && (
                            <span style={{
                              fontFamily: "'VT323', monospace", fontSize: 14,
                              padding: "2px 8px", color: "#f0c848", border: "1px solid #f0c848",
                            }}>
                              {comPendentes.length} pendente(s)
                            </span>
                          )}
                        </div>
                        <p style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#b8a8d8", margin: 0 }}>
                          {p.email} {p.telefone && `· ${p.telefone}`}
                        </p>
                        <p style={{ fontFamily: "'VT323', monospace", fontSize: 14, color: "#6b5c85", margin: "2px 0 0" }}>
                          Desde: {p.data}
                          {pix && <span> · Pix: <strong style={{ color: G }}>{pix.chavePix}</strong></span>}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <button
                          onClick={() => { setLinkIdx(isLinkExpanded ? null : i); setComissaoIdx(null); }}
                          style={{
                            fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                            padding: "6px 10px", letterSpacing: 1,
                            color: isLinkExpanded ? "#1c1030" : T,
                            background: isLinkExpanded ? T : "transparent",
                            border: `2px solid ${T}`,
                            cursor: "pointer", transition: "all 0.2s",
                          }}
                        >
                          LINK
                        </button>
                        <button
                          onClick={() => { setComissaoIdx(isComExpanded ? null : i); setLinkIdx(null); }}
                          style={{
                            fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                            padding: "6px 10px", letterSpacing: 1,
                            color: isComExpanded ? "#1c1030" : G,
                            background: isComExpanded ? G : "transparent",
                            border: `2px solid ${G}`,
                            cursor: "pointer", transition: "all 0.2s",
                          }}
                        >
                          COMISSÕES
                        </button>
                        <button
                          onClick={() => removeParceiro(i)}
                          style={{
                            fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                            padding: "6px 10px",
                            color: "#ff6060",
                            background: "transparent",
                            border: "2px solid #ff606066",
                            cursor: "pointer", transition: "all 0.2s",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Link expanded */}
                    {isLinkExpanded && (
                      <div style={{ marginTop: 12, padding: "12px", background: "rgba(72,192,184,0.04)", border: `1px solid ${T}33` }}>
                        <label style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: "#8878a8", display: "block", marginBottom: 6 }}>
                          Link de indicação de <strong style={{ color: T }}>{p.nome}</strong>:
                        </label>
                        <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                          <div style={{
                            flex: 1, background: "rgba(8,7,20,0.92)", border: `1px solid ${T}44`,
                            padding: "10px 12px", fontFamily: "'VT323', monospace", fontSize: 15,
                            color: G, wordBreak: "break-all", lineHeight: 1.4,
                          }}>
                            {link}
                          </div>
                          <button
                            onClick={() => copyLink(link, setLinkCopiado)}
                            style={{
                              fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                              padding: "8px 12px", letterSpacing: 1,
                              color: linkCopiado ? "#1c1030" : K,
                              background: linkCopiado ? G : "transparent",
                              border: `2px solid ${linkCopiado ? G : K}`,
                              cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
                            }}
                          >
                            {linkCopiado ? "COPIADO!" : "COPIAR"}
                          </button>
                        </div>
                        <p style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: "#8878a8", margin: "8px 0 0" }}>
                          Cliente ganha <strong style={{ color: G }}>30% de desconto</strong> · Parceiro recebe <strong style={{ color: G }}>10% de comissão</strong>
                        </p>
                      </div>
                    )}

                    {/* Comissões expanded */}
                    {isComExpanded && (
                      <div style={{ marginTop: 12, padding: "12px", background: "rgba(72,232,160,0.04)", border: `1px solid ${G}33` }}>
                        {/* Pix data */}
                        {pix ? (
                          <div style={{ marginBottom: 14, padding: "10px 14px", background: "rgba(72,232,160,0.06)", border: `1px solid ${G}22` }}>
                            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: G, letterSpacing: 1, display: "block", marginBottom: 8 }}>
                              DADOS PIX DO PARCEIRO
                            </span>
                            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                              <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#b8a8d8" }}>
                                Chave: <strong style={{ color: "#f0ebfa" }}>{pix.chavePix}</strong>
                              </span>
                              <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#b8a8d8" }}>
                                Nome: <strong style={{ color: "#f0ebfa" }}>{pix.nomeCompleto}</strong>
                              </span>
                              <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#b8a8d8" }}>
                                CPF/CNPJ: <strong style={{ color: "#f0ebfa" }}>{pix.cpfCnpj}</strong>
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div style={{ marginBottom: 14, padding: "10px 14px", background: "rgba(240,200,72,0.06)", border: "1px solid #f0c84822" }}>
                            <p style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#f0c848", margin: 0 }}>
                              Parceiro ainda não preencheu os dados Pix.
                            </p>
                          </div>
                        )}

                        {/* Commission list */}
                        {parceiroComissoes.length === 0 ? (
                          <p style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: "#6b5c85", margin: 0 }}>
                            Nenhuma comissão registrada ainda.
                          </p>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {parceiroComissoes.map((c, ci) => {
                              const nfKey = `${p.email}-${ci}`;
                              return (
                                <div key={ci} style={{
                                  padding: "12px",
                                  background: "rgba(8,7,20,0.75)",
                                  border: `1px solid ${c.pago ? G + "44" : "#f0c84844"}`,
                                }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                                    <div>
                                      <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: K }}>
                                        {c.nome}
                                      </span>
                                      <span style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: T, marginLeft: 10 }}>
                                        {c.plano}
                                      </span>
                                      <span style={{ fontFamily: "'VT323', monospace", fontSize: 14, color: "#6b5c85", marginLeft: 10 }}>
                                        {c.data}
                                      </span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                      {c.valorPlano && (
                                        <span style={{ fontFamily: "'VT323', monospace", fontSize: 14, color: "#6b5c85" }}>
                                          Plano: {c.valorPlano}
                                        </span>
                                      )}
                                      {c.valorCliente && (
                                        <span style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: "#b8a8d8" }}>
                                          Pago: <strong style={{ color: T }}>{c.valorCliente}</strong>
                                        </span>
                                      )}
                                      <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, color: G }}>
                                        10%: {c.comissao}
                                      </span>
                                      <span style={{
                                        fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                                        padding: "3px 8px", letterSpacing: 1,
                                        color: c.pago ? G : "#f0c848",
                                        border: `1px solid ${c.pago ? G : "#f0c848"}`,
                                      }}>
                                        {c.pago ? "PAGO" : "PENDENTE"}
                                      </span>
                                    </div>
                                  </div>

                                  {c.email && (
                                    <p style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: "#8878a8", margin: "0 0 6px" }}>
                                      {c.email}
                                    </p>
                                  )}

                                  {/* Already paid */}
                                  {c.pago && (
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                                      {c.dataPagamento && (
                                        <span style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: G }}>
                                          Pago em: {c.dataPagamento}
                                        </span>
                                      )}
                                      {c.notaFiscalComissao && (
                                        <button
                                          onClick={() => {
                                            const nf = c.notaFiscalComissao;
                                            if (!nf) return;
                                            if (nf.dataUrl.startsWith("data:text/html")) {
                                              const html = decodeBase64UTF8(nf.dataUrl);
                                              const win = window.open("", "_blank");
                                              if (win) { win.document.write(html); win.document.close(); }
                                            }
                                          }}
                                          style={{
                                            fontFamily: "'VT323', monospace", fontSize: 14,
                                            padding: "3px 10px", color: T, background: "transparent",
                                            border: `1px solid ${T}`, cursor: "pointer",
                                          }}
                                        >
                                          Ver NF
                                        </button>
                                      )}
                                    </div>
                                  )}

                                  {/* Not paid — NF + pay flow */}
                                  {!c.pago && (
                                    <div style={{ marginTop: 8 }}>
                                      {!nfFiles[nfKey] ? (
                                        <>
                                          {gerandoNF === nfKey ? (
                                            <div style={{ textAlign: "center", padding: "10px 0" }}>
                                              <div style={{
                                                display: "inline-block", width: 24, height: 24,
                                                border: `3px solid ${G}33`, borderTop: `3px solid ${G}`,
                                                borderRadius: "50%", animation: "spin 1s linear infinite",
                                                marginBottom: 6,
                                              }} />
                                              <p style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: G, margin: 0 }}>
                                                Gerando NF...
                                              </p>
                                              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                            </div>
                                          ) : (
                                            <button
                                              onClick={() => {
                                                if (!pix) return;
                                                setGerandoNF(nfKey);
                                                setTimeout(() => gerarNF(p.email, ci), 1500);
                                              }}
                                              disabled={!pix}
                                              style={{
                                                fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                                                padding: "10px 16px", letterSpacing: 1,
                                                color: pix ? "#1c1030" : "#6b5c85",
                                                background: pix ? G : "transparent",
                                                border: `2px solid ${pix ? G : "#6b5c85"}`,
                                                cursor: pix ? "pointer" : "not-allowed",
                                                boxShadow: pix ? `3px 3px 0 ${G}44` : "none",
                                                transition: "all 0.2s",
                                              }}
                                            >
                                              GERAR NF
                                            </button>
                                          )}
                                        </>
                                      ) : (
                                        <div>
                                          <div style={{
                                            display: "flex", alignItems: "center", gap: 10,
                                            padding: "8px 12px", background: "rgba(72,232,160,0.08)",
                                            border: "1px solid #48e8a044", marginBottom: 10,
                                          }}>
                                            <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: G, flex: 1 }}>
                                              NF: {nfFiles[nfKey].name}
                                            </span>
                                            <button
                                              onClick={() => setNfFiles(prev => { const n = { ...prev }; delete n[nfKey]; return n; })}
                                              style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#ff6060", background: "transparent", border: "none", cursor: "pointer" }}
                                            >
                                              ✕
                                            </button>
                                          </div>
                                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                            <button
                                              onClick={() => {
                                                const nf = nfFiles[nfKey];
                                                if (!nf) return;
                                                if (nf.dataUrl.startsWith("data:text/html")) {
                                                  const html = decodeBase64UTF8(nf.dataUrl);
                                                  const win = window.open("", "_blank");
                                                  if (win) { win.document.write(html); win.document.close(); }
                                                }
                                              }}
                                              style={{
                                                fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                                                padding: "8px 14px", letterSpacing: 1,
                                                color: T, background: "transparent",
                                                border: `2px solid ${T}`, cursor: "pointer",
                                              }}
                                            >
                                              VISUALIZAR
                                            </button>
                                            <button
                                              onClick={() => confirmarPagamento(p.email, ci)}
                                              style={{
                                                fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                                                padding: "8px 14px", letterSpacing: 1,
                                                color: "#1c1030", background: G,
                                                border: `2px solid ${G}`, cursor: "pointer",
                                                boxShadow: `3px 3px 0 ${G}44`,
                                              }}
                                            >
                                              ENVIAR NF E CONFIRMAR PAGAMENTO
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Gerar Link Manual */}
        <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: T, margin: "0 0 8px", letterSpacing: 1 }}>
            GERAR LINK DE PARCERIA
          </h3>
          <p style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: "#8878a8", margin: "0 0 16px" }}>
            Gere um link rápido com email do parceiro. O cliente que se cadastrar pelo link ganha 30% de desconto e o parceiro recebe 10% de comissão.
          </p>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: T, display: "block", marginBottom: 4 }}>
                Email do parceiro
              </label>
              <input
                type="email"
                value={manualEmail}
                onChange={e => { setManualEmail(e.target.value); setManualLink(""); setManualCopiado(false); }}
                placeholder="parceiro@email.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = T}
                onBlur={e => e.target.style.borderColor = `${T}66`}
              />
            </div>
            <button
              onClick={() => {
                if (!manualEmail.trim()) return;
                setManualLink(getLink(manualEmail.trim()));
                setManualCopiado(false);
              }}
              style={{
                fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                padding: "12px 18px", letterSpacing: 1,
                color: "#1c1030", background: T, border: `2px solid ${T}`,
                cursor: manualEmail.trim() ? "pointer" : "not-allowed",
                boxShadow: `4px 4px 0 ${T}44`,
                opacity: manualEmail.trim() ? 1 : 0.5,
                transition: "all 0.2s", whiteSpace: "nowrap",
              }}
            >
              GERAR LINK
            </button>
          </div>
          {manualLink && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                <div style={{
                  flex: 1, background: "rgba(8,7,20,0.92)", border: `1px solid ${T}44`,
                  padding: "10px 14px", fontFamily: "'VT323', monospace", fontSize: 15,
                  color: G, wordBreak: "break-all", lineHeight: 1.4,
                }}>
                  {manualLink}
                </div>
                <button
                  onClick={() => copyLink(manualLink, setManualCopiado)}
                  style={{
                    fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                    padding: "10px 14px", letterSpacing: 1,
                    color: manualCopiado ? "#1c1030" : K,
                    background: manualCopiado ? G : "transparent",
                    border: `2px solid ${manualCopiado ? G : K}`,
                    cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
                  }}
                >
                  {manualCopiado ? "COPIADO!" : "COPIAR"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Voltar */}
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

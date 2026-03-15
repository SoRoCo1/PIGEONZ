"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import GlobalCityBg from "@/components/GlobalCityBg";
import {
  getComissoes, setComissoes as setComissoesDB, onComissoesChange,
  getParceiroPix, onParceiroPixChange, getAllUsers,
} from "@/lib/db";

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

const inputStyle = {
  width: "100%",
  background: "rgba(8,7,20,0.92)",
  border: "2px solid rgba(72,192,184,0.4)",
  color: "#f0ebfa",
  fontFamily: "'VT323', monospace",
  fontSize: 18,
  padding: "10px 14px",
  outline: "none",
  boxSizing: "border-box" as const,
  transition: "border-color 0.2s",
};

const PLAN_PRICES: Record<string, number> = {
  Starter: 2567,
  Pro: 5123,
};

const TOMADOR_ADMIN = {
  cpf: "138.424.386-05",
  nome: "SARAH FIGUEIREDO BRANDAO SANTIAGO",
  empresa: "pigeonz.ai",
  endereco: "Rua Padre Francisco Arantes, 141",
  municipio: "BELO HORIZONTE",
  uf: "MG",
  email: "sarahsantiago100@gmail.com",
};

type DadosPix = {
  chavePix: string;
  nomeCompleto: string;
  cpfCnpj: string;
  docTipo?: "cpf" | "cnpj";
  endereco?: string;
  emailParceiro?: string;
};

type ClienteIndicado = {
  nome: string;
  email: string;
  telefone: string;
  plano: string;
  site: string;
  status: "pendente" | "aprovado" | "concluido";
  comissao: string;
  valorPlano?: string;
  valorCliente?: string;
  pago: boolean;
  data: string;
  dataPagamento?: string;
  notaFiscalComissao?: { name: string; dataUrl: string } | null;
  parceiroEmail: string;
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
      <h2>pigeonz.ai - Pagamento de Comissão</h2>
      <h3>Comissão por Indicação de Cliente</h3>
      <h1>NOTA FISCAL DE SERVIÇOS ELETRÔNICA - NFS-e</h1>
    </div>
    <div class="nf-header-right">
      <div class="label">Número da Nota</div>
      <div class="value">${numero}</div>
      <div class="label" style="margin-top:6px;">Data e Hora da Emissão</div>
      <div class="value" style="font-size:12px;">${dataEmissao}</div>
      <div class="label" style="margin-top:6px;">Código Verificação</div>
      <div class="value">${codigo}</div>
    </div>
  </div>

  <div class="nf-section-title">PRESTADOR DE SERVIÇOS</div>
  <div class="nf-section">
    <div class="nf-row">
      <div class="nf-field"><div class="label">CPF:</div><div class="value">${TOMADOR_ADMIN.cpf}</div></div>
    </div>
    <div class="nf-row">
      <div class="nf-field"><div class="label">Nome / Razão Social:</div><div class="value">${TOMADOR_ADMIN.nome}</div></div>
    </div>
    <div class="nf-row">
      <div class="nf-field"><div class="label">Nome da Empresa / Prestador de Serviço:</div><div class="value">${TOMADOR_ADMIN.empresa}</div></div>
    </div>
    <div class="nf-row">
      <div class="nf-field"><div class="label">Endereço:</div><div class="value">${TOMADOR_ADMIN.endereco}</div></div>
    </div>
    <div class="nf-row">
      <div class="nf-field" style="margin-right:40px;"><div class="label">Município:</div><div class="value">${TOMADOR_ADMIN.municipio}</div></div>
      <div class="nf-field" style="margin-right:40px;"><div class="label">UF:</div><div class="value">${TOMADOR_ADMIN.uf}</div></div>
      <div class="nf-field"><div class="label">E-mail:</div><div class="value">${TOMADOR_ADMIN.email}</div></div>
    </div>
  </div>

  <div class="nf-section-title">BENEFICIÁRIO (PARCEIRO)</div>
  <div class="nf-section">
    <div class="nf-row">
      <div class="nf-field"><div class="label">${parceiro.docTipo === "cnpj" ? "CNPJ" : "CPF"}:</div><div class="value">${parceiro.cpfCnpj || "Não informado"}</div></div>
    </div>
    <div class="nf-row">
      <div class="nf-field"><div class="label">Nome / Razão Social:</div><div class="value">${parceiro.nomeCompleto.toUpperCase()}</div></div>
    </div>
    ${parceiro.endereco ? `<div class="nf-row"><div class="nf-field"><div class="label">Endereço:</div><div class="value">${parceiro.endereco}</div></div></div>` : ""}
    ${parceiro.emailParceiro ? `<div class="nf-row"><div class="nf-field"><div class="label">E-mail:</div><div class="value">${parceiro.emailParceiro}</div></div></div>` : ""}
  </div>

  <div class="nf-section-title">DISCRIMINAÇÃO DOS SERVIÇOS</div>
  <div class="nf-section">
    <div class="nf-field">
      <div class="value">Comissão por indicação de cliente: ${clienteNome} - Plano ${plano} (10%); Qtde.: 01; Preço Unitário: ${valorNum}</div>
    </div>
  </div>

  <div class="nf-total">
    <div class="label">VALOR TOTAL DA NOTA</div>
    <div class="value">${valorComissao}</div>
  </div>

  <div class="nf-footer">
    Documento gerado por pigeonz.ai · ${dataEmissao}
  </div>
</div>
</body></html>`;
}

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  aprovado: "Aprovado",
  concluido: "Concluído",
};

const statusColors: Record<string, string> = {
  pendente: "#f0c848",
  aprovado: T,
  concluido: G,
};

export default function ComissoesAdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [clientes, setClientes] = useState<ClienteIndicado[]>([]);
  const [allPixCache, setAllPixCache] = useState<Record<string, DadosPix>>({});
  const [parceirosEmails, setParceirosEmails] = useState<string[]>([]);

  // Form state
  const [novoParceiroEmail, setNovoParceiroEmail] = useState("");
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novoTel, setNovoTel] = useState("");
  const [novoPlano, setNovoPlano] = useState("Starter");
  const [novoSite, setNovoSite] = useState("");
  const [novoComissao, setNovoComissao] = useState("");
  const [comissaoManual, setComissaoManual] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // NF state
  const [gerandoNF, setGerandoNF] = useState<number | null>(null);
  const [nfFiles, setNfFiles] = useState<Record<number, { name: string; dataUrl: string }>>({});

  // Filter
  const [filterParceiro, setFilterParceiro] = useState<string>("todos");
  const [filterStatus, setFilterStatus] = useState<string>("todos");

  // Edit state
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editTel, setEditTel] = useState("");
  const [editPlano, setEditPlano] = useState("");
  const [editSite, setEditSite] = useState("");
  const [editComissao, setEditComissao] = useState("");
  const [editStatus, setEditStatus] = useState<ClienteIndicado["status"]>("pendente");
  const [editPago, setEditPago] = useState(false);

  const comissoesInitRef = useRef(false);
  const skipComissoesSync = useRef(false);

  useEffect(() => {
    const raw = localStorage.getItem("pigeonz_user");
    if (!raw) { router.push("/login"); return; }
    const parsed = JSON.parse(raw);
    if (parsed.role !== "admin") { router.push("/login"); return; }
    setUser(parsed);

    // Load comissoes
    getComissoes().then(items => { setClientes(items as ClienteIndicado[]); comissoesInitRef.current = true; });

    // Load parceiro pix data
    getParceiroPix().then(data => setAllPixCache(data as Record<string, DadosPix>));

    // Load parceiro emails from users collection
    getAllUsers().then(users => {
      const emails = users.filter(u => u.role === "parceiro").map(u => u.email);
      setParceirosEmails(emails);
    });

    // Real-time sync
    const unsub1 = onComissoesChange(items => {
      if (skipComissoesSync.current) { skipComissoesSync.current = false; return; }
      setClientes(items as ClienteIndicado[]); comissoesInitRef.current = true;
    });
    const unsub2 = onParceiroPixChange(data => {
      setAllPixCache(data as Record<string, DadosPix>);
    });
    return () => { unsub1(); unsub2(); };
  }, [router]);

  // Save to Firestore on changes
  useEffect(() => {
    if (!user || !comissoesInitRef.current) return;
    skipComissoesSync.current = true;
    setComissoesDB(clientes);
  }, [clientes, user]);

  const calcComissao10 = (plano: string) => {
    const price = PLAN_PRICES[plano];
    if (!price) return "";
    return `R$ ${(price * 0.1).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  };

  const addComissao = () => {
    if (!novoNome.trim() || !novoParceiroEmail.trim()) return;
    const now = new Date().toISOString().split("T")[0];
    const comissaoFinal = comissaoManual && novoComissao.trim()
      ? novoComissao.trim()
      : (calcComissao10(novoPlano) || "R$ 0");
    setClientes(prev => [...prev, {
      nome: novoNome.trim(),
      email: novoEmail.trim(),
      telefone: novoTel.trim(),
      plano: novoPlano,
      site: novoSite.trim(),
      status: "pendente",
      comissao: comissaoFinal,
      pago: false,
      data: now,
      parceiroEmail: novoParceiroEmail.trim(),
    }]);
    setNovoNome("");
    setNovoEmail("");
    setNovoTel("");
    setNovoSite("");
    setNovoComissao("");
    setComissaoManual(false);
    setNovoParceiroEmail("");
    setShowForm(false);
  };

  const updateStatus = (idx: number, status: ClienteIndicado["status"]) => {
    setClientes(prev => prev.map((c, i) => i === idx ? { ...c, status } : c));
  };

  const updateComissao = (idx: number, val: string) => {
    setClientes(prev => prev.map((c, i) => i === idx ? { ...c, comissao: val } : c));
  };

  const updateSite = (idx: number, site: string) => {
    setClientes(prev => prev.map((c, i) => i === idx ? { ...c, site } : c));
  };

  const removeCliente = (idx: number) => {
    setClientes(prev => prev.filter((_, i) => i !== idx));
  };

  const startEditCliente = (idx: number) => {
    const c = clientes[idx];
    if (!c) return;
    setEditingIdx(idx);
    setEditNome(c.nome);
    setEditEmail(c.email);
    setEditTel(c.telefone);
    setEditPlano(c.plano);
    setEditSite(c.site);
    setEditComissao(c.comissao);
    setEditStatus(c.status);
    setEditPago(c.pago);
  };

  const saveEditCliente = () => {
    if (editingIdx === null) return;
    setClientes(prev => prev.map((c, i) => i === editingIdx ? {
      ...c,
      nome: editNome.trim(),
      email: editEmail.trim(),
      telefone: editTel.trim(),
      plano: editPlano,
      site: editSite.trim(),
      comissao: editComissao.trim(),
      status: editStatus,
      pago: editPago,
      ...(editPago && !c.dataPagamento ? { dataPagamento: new Date().toISOString().split("T")[0] } : {}),
    } : c));
    setEditingIdx(null);
  };

  const getParceiroPixData = (parceiroEmail: string): DadosPix | null => {
    return allPixCache[parceiroEmail] || null;
  };

  const gerarNFComissao = (idx: number) => {
    const c = clientes[idx];
    const parceiroPix = getParceiroPixData(c.parceiroEmail);
    if (!parceiroPix) return;
    const numero = gerarNumeroNota();
    const codigo = gerarCodigoVerificacao();
    const html = gerarNFComissaoHTML(parceiroPix, c.comissao, c.nome, c.plano, numero, codigo);

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const fileName = `NFS-e_Comissao_${numero}_${parceiroPix.nomeCompleto.replace(/\s+/g, "_")}.html`;
      setNfFiles(prev => ({ ...prev, [idx]: { name: fileName, dataUrl } }));
      setGerandoNF(null);
    };
    reader.readAsDataURL(blob);
  };

  const confirmarPagamento = (idx: number) => {
    const nf = nfFiles[idx] || null;
    setClientes(prev => prev.map((c, i) => i === idx ? {
      ...c,
      status: "concluido" as const,
      pago: true,
      dataPagamento: new Date().toISOString().split("T")[0],
      notaFiscalComissao: nf,
    } : c));
    setNfFiles(prev => { const n = { ...prev }; delete n[idx]; return n; });
  };

  // Get unique parceiro emails from comissoes
  const uniqueParceiros = [...new Set(clientes.map(c => c.parceiroEmail).filter(Boolean))];

  // Stats
  const totalComissao = clientes
    .filter(c => c.status !== "concluido" || c.pago)
    .reduce((sum, c) => sum + (parseFloat(c.comissao.replace(/[^\d,.]/g, "").replace(",", ".")) || 0), 0);

  const totalPago = clientes
    .filter(c => c.pago)
    .reduce((sum, c) => sum + (parseFloat(c.comissao.replace(/[^\d,.]/g, "").replace(",", ".")) || 0), 0);

  const totalPendente = totalComissao - totalPago;

  // Filtered list
  const filtered = clientes.filter((c, _i) => {
    if (filterParceiro !== "todos" && c.parceiroEmail !== filterParceiro) return false;
    if (filterStatus !== "todos" && c.status !== filterStatus) return false;
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
        <h1 style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(12px, 2.5vw, 18px)",
          color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000",
          margin: "0 0 8px",
          lineHeight: 1.6,
        }}>
          Gerenciar Comissões
        </h1>
        <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000", marginBottom: 32 }}>
          Crie e gerencie comissões de parceiros. Atualizações em tempo real.
        </p>

        {/* Resumo */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "16px 20px", textAlign: "center" }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#8878a8", letterSpacing: 1, display: "block", marginBottom: 8 }}>
              TOTAL
            </span>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 18, color: T }}>
              {clientes.length}
            </span>
          </div>
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "16px 20px", textAlign: "center" }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#8878a8", letterSpacing: 1, display: "block", marginBottom: 8 }}>
              COMISSÃO TOTAL
            </span>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 16, color: G }}>
              R$ {totalComissao.toFixed(2).replace(".", ",")}
            </span>
          </div>
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "16px 20px", textAlign: "center" }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#8878a8", letterSpacing: 1, display: "block", marginBottom: 8 }}>
              PAGO
            </span>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 16, color: G }}>
              R$ {totalPago.toFixed(2).replace(".", ",")}
            </span>
          </div>
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "16px 20px", textAlign: "center" }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#8878a8", letterSpacing: 1, display: "block", marginBottom: 8 }}>
              SALDO PENDENTE
            </span>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 16, color: totalPendente > 0 ? "#f0c848" : "#8878a8" }}>
              R$ {totalPendente.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>

        {/* Botão nova comissão */}
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9, padding: "14px 28px", letterSpacing: 2,
            color: showForm ? "#1c1030" : K,
            background: showForm ? K : "transparent",
            border: `2px solid ${K}`,
            cursor: "pointer", boxShadow: `4px 4px 0 ${K}44`,
            transition: "all 0.2s", width: "100%", marginBottom: 20,
          }}
        >
          {showForm ? "FECHAR FORMULÁRIO ▲" : "+ NOVA COMISSÃO ▼"}
        </button>

        {/* Form: Nova comissão */}
        {showForm && (
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: K, margin: "0 0 16px", letterSpacing: 1 }}>
              REGISTRAR NOVA COMISSÃO
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Parceiro email */}
              <div>
                <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: G, display: "block", marginBottom: 4 }}>
                  Email do Parceiro *
                </label>
                {parceirosEmails.length > 0 ? (
                  <select
                    value={novoParceiroEmail}
                    onChange={e => setNovoParceiroEmail(e.target.value)}
                    style={{ ...inputStyle, borderColor: `${G}66`, cursor: "pointer" }}
                  >
                    <option value="">Selecione o parceiro...</option>
                    {parceirosEmails.map(email => (
                      <option key={email} value={email}>
                        {email} {allPixCache[email] ? `(${allPixCache[email].nomeCompleto})` : ""}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={novoParceiroEmail}
                    onChange={e => setNovoParceiroEmail(e.target.value)}
                    placeholder="parceiro@email.com"
                    style={{ ...inputStyle, borderColor: `${G}66` }}
                    onFocus={e => e.target.style.borderColor = G}
                    onBlur={e => e.target.style.borderColor = `${G}66`}
                  />
                )}
                {novoParceiroEmail && allPixCache[novoParceiroEmail] && (
                  <div style={{ marginTop: 8, padding: "8px 12px", background: "rgba(72,232,160,0.06)", border: `1px solid ${G}22` }}>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: G }}>
                      Parceiro: <strong style={{ color: "#f0ebfa" }}>{allPixCache[novoParceiroEmail].nomeCompleto}</strong>
                      {" · "}CPF/CNPJ: <strong style={{ color: "#f0ebfa" }}>{allPixCache[novoParceiroEmail].cpfCnpj}</strong>
                      {" · "}Pix: <strong style={{ color: "#f0ebfa" }}>{allPixCache[novoParceiroEmail].chavePix}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Client info */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: K, display: "block", marginBottom: 4 }}>Nome do cliente indicado *</label>
                  <input
                    value={novoNome}
                    onChange={e => setNovoNome(e.target.value)}
                    placeholder="Nome do cliente"
                    style={{ ...inputStyle, borderColor: `${K}66` }}
                    onFocus={e => e.target.style.borderColor = K}
                    onBlur={e => e.target.style.borderColor = `${K}66`}
                  />
                </div>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: K, display: "block", marginBottom: 4 }}>Email do cliente</label>
                  <input
                    value={novoEmail}
                    onChange={e => setNovoEmail(e.target.value)}
                    placeholder="cliente@email.com"
                    style={{ ...inputStyle, borderColor: `${K}66` }}
                    onFocus={e => e.target.style.borderColor = K}
                    onBlur={e => e.target.style.borderColor = `${K}66`}
                  />
                </div>
                <div style={{ flex: "1 1 150px" }}>
                  <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: K, display: "block", marginBottom: 4 }}>Telefone</label>
                  <input
                    value={novoTel}
                    onChange={e => setNovoTel(e.target.value)}
                    placeholder="(31) 99999-9999"
                    style={{ ...inputStyle, borderColor: `${K}66` }}
                    onFocus={e => e.target.style.borderColor = K}
                    onBlur={e => e.target.style.borderColor = `${K}66`}
                  />
                </div>
              </div>

              {/* Plan */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 150px" }}>
                  <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: K, display: "block", marginBottom: 4 }}>Plano</label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["Starter", "Pro", "Enterprise"].map(p => (
                      <button
                        key={p}
                        onClick={() => setNovoPlano(p)}
                        style={{
                          fontFamily: "'VT323', monospace", fontSize: 14,
                          padding: "4px 10px", cursor: "pointer",
                          color: novoPlano === p ? "#1c1030" : T,
                          background: novoPlano === p ? T : "transparent",
                          border: `1px solid ${T}`, transition: "all 0.2s",
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Site */}
              <div>
                <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: K, display: "block", marginBottom: 4 }}>Site do cliente</label>
                <input
                  value={novoSite}
                  onChange={e => setNovoSite(e.target.value)}
                  placeholder="https://..."
                  style={{ ...inputStyle, borderColor: `${K}66` }}
                  onFocus={e => e.target.style.borderColor = K}
                  onBlur={e => e.target.style.borderColor = `${K}66`}
                />
              </div>

              {/* Comissão */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: K }}>Comissão:</label>
                  <button
                    type="button"
                    onClick={() => setComissaoManual(false)}
                    style={{
                      fontFamily: "'VT323', monospace", fontSize: 14,
                      padding: "2px 10px", cursor: "pointer",
                      color: !comissaoManual ? "#1c1030" : G,
                      background: !comissaoManual ? G : "transparent",
                      border: `1px solid ${G}`, transition: "all 0.2s",
                    }}
                  >
                    Auto (10%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setComissaoManual(true)}
                    style={{
                      fontFamily: "'VT323', monospace", fontSize: 14,
                      padding: "2px 10px", cursor: "pointer",
                      color: comissaoManual ? "#1c1030" : K,
                      background: comissaoManual ? K : "transparent",
                      border: `1px solid ${K}`, transition: "all 0.2s",
                    }}
                  >
                    Manual
                  </button>
                </div>
                {comissaoManual ? (
                  <input
                    value={novoComissao}
                    onChange={e => setNovoComissao(maskBRL(e.target.value))}
                    placeholder="R$ 500"
                    style={{ ...inputStyle, borderColor: `${K}66`, maxWidth: 200 }}
                    onFocus={e => e.target.style.borderColor = K}
                    onBlur={e => e.target.style.borderColor = `${K}66`}
                  />
                ) : (
                  <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: G, margin: 0 }}>
                    {calcComissao10(novoPlano) || "Plano sem preço fixo — use manual"}
                    <span style={{ color: "#6b5c85", fontSize: 15, marginLeft: 8 }}>
                      (10% de {PLAN_PRICES[novoPlano] ? `R$ ${PLAN_PRICES[novoPlano].toLocaleString("pt-BR")}` : novoPlano})
                    </span>
                  </p>
                )}
              </div>

              <button
                onClick={addComissao}
                disabled={!novoNome.trim() || !novoParceiroEmail.trim()}
                style={{
                  fontFamily: "'Press Start 2P', monospace", fontSize: 9,
                  padding: "12px 24px", letterSpacing: 2,
                  color: (!novoNome.trim() || !novoParceiroEmail.trim()) ? "#6b5c85" : "#1c1030",
                  background: (!novoNome.trim() || !novoParceiroEmail.trim()) ? "transparent" : K,
                  border: `2px solid ${(!novoNome.trim() || !novoParceiroEmail.trim()) ? "#6b5c85" : K}`,
                  cursor: (!novoNome.trim() || !novoParceiroEmail.trim()) ? "not-allowed" : "pointer",
                  boxShadow: (!novoNome.trim() || !novoParceiroEmail.trim()) ? "none" : `4px 4px 0 ${K}44`,
                  transition: "all 0.2s", alignSelf: "flex-start",
                }}
              >
                REGISTRAR COMISSÃO
              </button>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#8878a8" }}>Filtrar:</span>
          <select
            value={filterParceiro}
            onChange={e => setFilterParceiro(e.target.value)}
            style={{ ...inputStyle, width: "auto", minWidth: 180, fontSize: 16, padding: "6px 10px", cursor: "pointer" }}
          >
            <option value="todos">Todos parceiros</option>
            {uniqueParceiros.map(email => (
              <option key={email} value={email}>
                {allPixCache[email] ? allPixCache[email].nomeCompleto : email}
              </option>
            ))}
          </select>
          <div style={{ display: "flex", gap: 4 }}>
            {[["todos", "Todos"], ["pendente", "Pendente"], ["aprovado", "Aprovado"], ["concluido", "Concluído"]].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                style={{
                  fontFamily: "'VT323', monospace", fontSize: 14,
                  padding: "4px 12px", cursor: "pointer",
                  color: filterStatus === key ? "#1c1030" : T,
                  background: filterStatus === key ? T : "transparent",
                  border: `1px solid ${T}`, transition: "all 0.2s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista */}
        {filtered.length === 0 ? (
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", textAlign: "center" }}>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#8878a8", margin: 0 }}>
              Nenhuma comissão encontrada.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((c, _fi) => {
              const realIdx = clientes.indexOf(c);
              const parceiroPix = getParceiroPixData(c.parceiroEmail);
              const sColor = statusColors[c.status] || "#8878a8";

              return (
                <div key={realIdx} className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "16px 20px" }}>
                  {/* Header: parceiro + client name + status */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontFamily: "'VT323', monospace", fontSize: 14, color: G, border: `1px solid ${G}44`, padding: "1px 8px" }}>
                          Parceiro: {allPixCache[c.parceiroEmail]?.nomeCompleto || c.parceiroEmail}
                        </span>
                      </div>
                      <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: K }}>
                        {c.nome}
                      </span>
                      <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: T }}>{c.plano}</span>
                        <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#6b5c85" }}>{c.data}</span>
                      </div>
                      {(c.email || c.telefone) && (
                        <div style={{ display: "flex", gap: 12, marginTop: 2, flexWrap: "wrap" }}>
                          {c.email && <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#b8a8d8" }}>{c.email}</span>}
                          {c.telefone && <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#b8a8d8" }}>{c.telefone}</span>}
                        </div>
                      )}
                    </div>

                    {/* Status buttons */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                      {!c.pago ? (
                        <div style={{ display: "flex", gap: 4 }}>
                          {(["pendente", "aprovado"] as const).map(s => (
                            <button
                              key={s}
                              onClick={() => updateStatus(realIdx, s)}
                              style={{
                                fontFamily: "'VT323', monospace", fontSize: 13,
                                padding: "2px 8px", cursor: "pointer",
                                color: c.status === s ? "#1c1030" : statusColors[s],
                                background: c.status === s ? statusColors[s] : "transparent",
                                border: `1px solid ${statusColors[s]}`,
                                transition: "all 0.2s",
                              }}
                            >
                              {statusLabels[s]}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span style={{
                          fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                          color: "#1c1030", background: G,
                          padding: "4px 8px", letterSpacing: 1,
                        }}>
                          CONCLUÍDO
                        </span>
                      )}
                      <span style={{
                        fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                        color: c.pago ? G : "#f0c848",
                        border: `1px solid ${c.pago ? G : "#f0c848"}`,
                        padding: "4px 8px", letterSpacing: 1,
                      }}>
                        {c.pago ? "PAGO" : "SALDO PENDENTE"}
                      </span>
                    </div>
                  </div>

                  {/* Comissão value */}
                  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#8878a8" }}>Comissão:</span>
                      {!c.pago ? (
                        <>
                          <input
                            value={c.comissao}
                            onChange={e => updateComissao(realIdx, maskBRL(e.target.value))}
                            style={{ ...inputStyle, width: 120, fontSize: 16, padding: "4px 8px", borderColor: `${G}66` }}
                            onFocus={e => e.target.style.borderColor = G}
                            onBlur={e => e.target.style.borderColor = `${G}66`}
                          />
                          <button
                            onClick={() => {
                              const auto = calcComissao10(c.plano);
                              if (auto) updateComissao(realIdx, auto);
                            }}
                            style={{
                              fontFamily: "'VT323', monospace", fontSize: 13,
                              padding: "4px 8px", cursor: "pointer",
                              color: T, background: "transparent",
                              border: `1px solid ${T}`, transition: "all 0.2s",
                            }}
                            title="Calcular 10% do plano"
                          >
                            Calc 10%
                          </button>
                        </>
                      ) : (
                        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: G }}>
                          {c.comissao}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Site */}
                  {!c.pago && (
                    <div style={{ marginBottom: 8 }}>
                      <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: T, display: "block", marginBottom: 4 }}>
                        Site do cliente:
                      </label>
                      <input
                        value={c.site}
                        onChange={e => updateSite(realIdx, e.target.value)}
                        placeholder="https://..."
                        style={{ ...inputStyle, borderColor: `${T}66`, fontSize: 16 }}
                        onFocus={e => e.target.style.borderColor = T}
                        onBlur={e => e.target.style.borderColor = `${T}66`}
                      />
                    </div>
                  )}
                  {c.pago && c.site && (
                    <div style={{ marginBottom: 8 }}>
                      <a href={c.site} target="_blank" rel="noopener noreferrer"
                        style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: T, textDecoration: "underline" }}>
                        {c.site}
                      </a>
                    </div>
                  )}

                  {/* NF + Pagamento flow (when not paid) */}
                  {!c.pago && (
                    <div style={{ marginTop: 8, padding: "12px 14px", background: "rgba(72,232,160,0.04)", border: `1px solid ${G}22` }}>
                      {/* Parceiro Pix info */}
                      {parceiroPix ? (
                        <div style={{ marginBottom: 12, padding: "8px 12px", background: "rgba(72,232,160,0.06)", border: `1px solid ${G}22` }}>
                          <span style={{ fontFamily: "'VT323', monospace", fontSize: 14, color: G, display: "block", marginBottom: 6 }}>
                            Dados Pix do parceiro:
                          </span>
                          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#b8a8d8" }}>
                              Chave: <strong style={{ color: "#f0ebfa" }}>{parceiroPix.chavePix}</strong>
                            </span>
                            <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#b8a8d8" }}>
                              Nome: <strong style={{ color: "#f0ebfa" }}>{parceiroPix.nomeCompleto}</strong>
                            </span>
                            <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#b8a8d8" }}>
                              CPF/CNPJ: <strong style={{ color: "#f0ebfa" }}>{parceiroPix.cpfCnpj}</strong>
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#f0c848", margin: "0 0 12px" }}>
                          Parceiro ainda não preencheu os dados Pix.
                        </p>
                      )}

                      {/* NF Generation */}
                      <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: G, display: "block", marginBottom: 10, letterSpacing: 1 }}>
                        GERAR NF E CONCLUIR PAGAMENTO
                      </label>

                      {!nfFiles[realIdx] ? (
                        <>
                          {gerandoNF === realIdx ? (
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
                            <button
                              onClick={() => {
                                if (!parceiroPix) return;
                                setGerandoNF(realIdx);
                                setTimeout(() => gerarNFComissao(realIdx), 1500);
                              }}
                              disabled={!parceiroPix}
                              style={{
                                fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                                padding: "12px 20px", letterSpacing: 1,
                                color: parceiroPix ? "#1c1030" : "#6b5c85",
                                background: parceiroPix ? G : "transparent",
                                border: `2px solid ${parceiroPix ? G : "#6b5c85"}`,
                                cursor: parceiroPix ? "pointer" : "not-allowed",
                                transition: "all 0.2s",
                                boxShadow: parceiroPix ? `4px 4px 0 ${G}44` : "none",
                              }}
                            >
                              GERAR NOTA FISCAL
                            </button>
                          )}
                        </>
                      ) : (
                        <div>
                          <div style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "10px 14px", background: "rgba(72,232,160,0.08)",
                            border: "1px solid #48e8a044", marginBottom: 12,
                          }}>
                            <svg width={16} height={16} viewBox="0 0 10 10" shapeRendering="crispEdges">
                              <rect x={8} y={1} width={1} height={1} fill={G}/>
                              <rect x={7} y={2} width={1} height={1} fill={G}/>
                              <rect x={6} y={3} width={1} height={1} fill={G}/>
                              <rect x={5} y={4} width={1} height={1} fill={G}/>
                              <rect x={4} y={5} width={1} height={1} fill={G}/>
                              <rect x={3} y={6} width={1} height={1} fill={G}/>
                              <rect x={2} y={5} width={1} height={1} fill={G}/>
                              <rect x={1} y={4} width={1} height={1} fill={G}/>
                            </svg>
                            <span style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: G, flex: 1 }}>
                              NF gerada: {nfFiles[realIdx].name}
                            </span>
                            <button
                              onClick={() => setNfFiles(prev => { const n = { ...prev }; delete n[realIdx]; return n; })}
                              style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#ff6060", background: "transparent", border: "none", cursor: "pointer" }}
                            >
                              ✕
                            </button>
                          </div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <button
                              onClick={() => {
                                const nf = nfFiles[realIdx];
                                if (!nf) return;
                                if (nf.dataUrl.startsWith("data:text/html")) {
                                  const html = decodeBase64UTF8(nf.dataUrl);
                                  const win = window.open("", "_blank");
                                  if (win) { win.document.write(html); win.document.close(); }
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
                              onClick={() => confirmarPagamento(realIdx)}
                              style={{
                                fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                                padding: "10px 16px", letterSpacing: 1,
                                color: "#1c1030", background: K,
                                border: `2px solid ${K}`,
                                cursor: "pointer", transition: "all 0.2s",
                                boxShadow: `4px 4px 0 ${K}44`,
                              }}
                            >
                              CONFIRMAR PAGAMENTO (CONCLUIR)
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Paid status */}
                  {c.pago && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
                      <span style={{
                        fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                        color: "#1c1030", background: G,
                        padding: "6px 14px", letterSpacing: 1,
                      }}>
                        ✓ PAGO
                      </span>
                      {c.dataPagamento && (
                        <span style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: G }}>
                          em {c.dataPagamento}
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
                            padding: "4px 10px", color: T, background: "transparent",
                            border: `1px solid ${T}`, cursor: "pointer",
                          }}
                        >
                          Ver NF
                        </button>
                      )}
                    </div>
                  )}

                  {/* Edit mode */}
                  {editingIdx === realIdx && (
                    <div style={{ marginTop: 10, padding: "14px", background: "rgba(72,192,184,0.05)", border: `1px solid ${T}22` }}>
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
                        <div style={{ flex: "1 1 200px" }}>
                          <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: "#8878a8", display: "block", marginBottom: 4 }}>NOME CLIENTE</label>
                          <input value={editNome} onChange={e => setEditNome(e.target.value)} style={{ ...inputStyle, fontSize: 16, padding: "6px 10px" }} />
                        </div>
                        <div style={{ flex: "1 1 200px" }}>
                          <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: "#8878a8", display: "block", marginBottom: 4 }}>EMAIL</label>
                          <input value={editEmail} onChange={e => setEditEmail(e.target.value)} style={{ ...inputStyle, fontSize: 16, padding: "6px 10px" }} />
                        </div>
                        <div style={{ flex: "0 0 150px" }}>
                          <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: "#8878a8", display: "block", marginBottom: 4 }}>TELEFONE</label>
                          <input value={editTel} onChange={e => setEditTel(e.target.value)} style={{ ...inputStyle, fontSize: 16, padding: "6px 10px" }} />
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
                        <div style={{ flex: "0 0 180px" }}>
                          <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: "#8878a8", display: "block", marginBottom: 4 }}>COMISSÃO</label>
                          <input value={editComissao} onChange={e => setEditComissao(maskBRL(e.target.value))} style={{ ...inputStyle, fontSize: 16, padding: "6px 10px" }} />
                        </div>
                        <div style={{ flex: "1 1 200px" }}>
                          <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: "#8878a8", display: "block", marginBottom: 4 }}>SITE</label>
                          <input value={editSite} onChange={e => setEditSite(e.target.value)} style={{ ...inputStyle, fontSize: 16, padding: "6px 10px" }} />
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
                        <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: "#8878a8" }}>STATUS:</label>
                        {(["pendente", "aprovado", "concluido"] as const).map(s => (
                          <button key={s} onClick={() => setEditStatus(s)} style={{
                            fontFamily: "'VT323', monospace", fontSize: 14, padding: "3px 10px", cursor: "pointer",
                            color: editStatus === s ? "#1c1030" : statusColors[s],
                            background: editStatus === s ? statusColors[s] : "transparent",
                            border: `1px solid ${statusColors[s]}`, transition: "all 0.2s",
                          }}>
                            {statusLabels[s]}
                          </button>
                        ))}
                        <span style={{ margin: "0 4px", color: "#6b5c85" }}>|</span>
                        <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: "#8878a8" }}>PAGO:</label>
                        <button onClick={() => setEditPago(!editPago)} style={{
                          fontFamily: "'VT323', monospace", fontSize: 14, padding: "3px 10px", cursor: "pointer",
                          color: editPago ? "#1c1030" : G,
                          background: editPago ? G : "transparent",
                          border: `1px solid ${G}`, transition: "all 0.2s",
                        }}>
                          {editPago ? "Sim" : "Não"}
                        </button>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={saveEditCliente} style={{
                          fontFamily: "'Press Start 2P', monospace", fontSize: 7, padding: "8px 16px",
                          color: "#1c1030", background: G, border: `2px solid ${G}`, cursor: "pointer",
                        }}>SALVAR</button>
                        <button onClick={() => setEditingIdx(null)} style={{
                          fontFamily: "'VT323', monospace", fontSize: 16, padding: "6px 14px",
                          color: "#ff6060", background: "transparent", border: "1px solid #ff6060", cursor: "pointer",
                        }}>Cancelar</button>
                      </div>
                    </div>
                  )}

                  {/* Edit + Remove buttons */}
                  {editingIdx !== realIdx && (
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button
                        onClick={() => startEditCliente(realIdx)}
                        style={{
                          fontFamily: "'VT323', monospace", fontSize: 14, color: "#f0c848",
                          background: "transparent", border: "1px solid #f0c848",
                          padding: "2px 8px", cursor: "pointer",
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => removeCliente(realIdx)}
                        style={{
                          fontFamily: "'VT323', monospace", fontSize: 14, color: "#ff6060",
                          background: "transparent", border: "1px solid #ff6060",
                          padding: "2px 8px", cursor: "pointer",
                        }}
                      >
                        ✕ Remover
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={() => router.push("/admin")}
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 10, padding: "14px 32px", letterSpacing: 2, cursor: "pointer",
            background: K, color: "#1c1030", border: `2px solid ${K}`,
            boxShadow: `4px 4px 0 ${K}44`, transition: "all 0.2s",
            width: "100%", marginTop: 20,
          }}
        >
          VOLTAR AO PAINEL
        </button>
      </div>
    </div>
    </>
  );
}

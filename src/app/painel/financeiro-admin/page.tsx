"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import GlobalCityBg from "@/components/GlobalCityBg";
import {
  getFinanceiro, setFinanceiro as setFinanceiroDB, onFinanceiroChange,
  getParceiroPix, onParceiroPixChange, getAllUsers, getUser,
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

const PRESTADOR = {
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
};

type FinanceiroEntry = {
  tipo: "pagamento" | "cobranca";
  descricao: string;
  valor: string;
  status: "pendente" | "concluido";
  data: string;
  dataConclusao?: string;
  notaFiscal?: { name: string; dataUrl: string } | null;
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

function gerarNFFinanceiroHTML(
  parceiro: { nomeCompleto: string; cpfCnpj: string; endereco?: string; municipio?: string; uf?: string; email?: string },
  descricao: string,
  valor: string,
  numero: string,
  codigo: string
) {
  const agora = new Date();
  const dataEmissao = `${agora.getDate().toString().padStart(2, "0")}/${(agora.getMonth() + 1).toString().padStart(2, "0")}/${agora.getFullYear()} ${agora.getHours().toString().padStart(2, "0")}:${agora.getMinutes().toString().padStart(2, "0")}:${agora.getSeconds().toString().padStart(2, "0")}`;
  const valorNum = valor.replace(/[^\d,]/g, "").replace(",", ".");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>NFS-e ${numero} - Financeiro</title>
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
      <h2>pigeonz.ai - Nota Fiscal</h2>
      <h3>Presta\u00e7\u00e3o de Servi\u00e7os de Tecnologia</h3>
      <h1>NOTA FISCAL DE SERVI\u00c7OS ELETR\u00d4NICA - NFS-e</h1>
    </div>
    <div class="nf-header-right">
      <div class="label">N\u00famero da Nota</div>
      <div class="value">${numero}</div>
      <div class="label" style="margin-top:6px;">Data e Hora da Emiss\u00e3o</div>
      <div class="value" style="font-size:12px;">${dataEmissao}</div>
      <div class="label" style="margin-top:6px;">C\u00f3digo Verifica\u00e7\u00e3o</div>
      <div class="value">${codigo}</div>
    </div>
  </div>

  <div class="nf-section-title">PRESTADOR DE SERVI\u00c7OS</div>
  <div class="nf-section">
    <div class="nf-row">
      <div class="nf-field"><div class="label">CPF:</div><div class="value">${PRESTADOR.cpf}</div></div>
    </div>
    <div class="nf-row">
      <div class="nf-field"><div class="label">Nome / Raz\u00e3o Social:</div><div class="value">${PRESTADOR.nome}</div></div>
    </div>
    <div class="nf-row">
      <div class="nf-field"><div class="label">Empresa:</div><div class="value">${PRESTADOR.empresa}</div></div>
    </div>
    <div class="nf-row">
      <div class="nf-field"><div class="label">Endere\u00e7o:</div><div class="value">${PRESTADOR.endereco}</div></div>
    </div>
    <div class="nf-row">
      <div class="nf-field" style="margin-right:40px;"><div class="label">Munic\u00edpio:</div><div class="value">${PRESTADOR.municipio}</div></div>
      <div class="nf-field" style="margin-right:40px;"><div class="label">UF:</div><div class="value">${PRESTADOR.uf}</div></div>
      <div class="nf-field"><div class="label">E-mail:</div><div class="value">${PRESTADOR.email}</div></div>
    </div>
  </div>

  <div class="nf-section-title">TOMADOR DE SERVI\u00c7OS</div>
  <div class="nf-section">
    <div class="nf-row">
      <div class="nf-field"><div class="label">CPF/CNPJ:</div><div class="value">${parceiro.cpfCnpj || "N\u00e3o informado"}</div></div>
    </div>
    <div class="nf-row">
      <div class="nf-field"><div class="label">Nome / Raz\u00e3o Social:</div><div class="value">${parceiro.nomeCompleto.toUpperCase()}</div></div>
    </div>
    ${parceiro.endereco ? `<div class="nf-row"><div class="nf-field"><div class="label">Endere\u00e7o:</div><div class="value">${parceiro.endereco}</div></div></div>` : ""}
    <div class="nf-row">
      ${parceiro.municipio ? `<div class="nf-field" style="margin-right:40px;"><div class="label">Munic\u00edpio:</div><div class="value">${parceiro.municipio}</div></div>` : ""}
      ${parceiro.uf ? `<div class="nf-field" style="margin-right:40px;"><div class="label">UF:</div><div class="value">${parceiro.uf}</div></div>` : ""}
      ${parceiro.email ? `<div class="nf-field"><div class="label">E-mail:</div><div class="value">${parceiro.email}</div></div>` : ""}
    </div>
  </div>

  <div class="nf-section-title">DISCRIMINA\u00c7\u00c3O DOS SERVI\u00c7OS</div>
  <div class="nf-section">
    <div class="nf-field">
      <div class="value">${descricao}; Qtde.: 01; Pre\u00e7o Unit\u00e1rio: ${valorNum}</div>
    </div>
  </div>

  <div class="nf-total">
    <div class="label">VALOR TOTAL DA NOTA</div>
    <div class="value">${valor}</div>
  </div>

  <div class="nf-footer">
    Documento gerado por pigeonz.ai \u00b7 ${dataEmissao}
  </div>
</div>
</body></html>`;
}

export default function FinanceiroAdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  // All entries keyed by parceiro email
  const [allEntries, setAllEntries] = useState<Record<string, FinanceiroEntry[]>>({});
  const [parceirosEmails, setParceirosEmails] = useState<string[]>([]);
  const [allPixCache, setAllPixCache] = useState<Record<string, DadosPix>>({});

  // Form
  const [showForm, setShowForm] = useState(false);
  const [novoParceiroEmail, setNovoParceiroEmail] = useState("");
  const [novoTipo, setNovoTipo] = useState<"pagamento" | "cobranca">("pagamento");
  const [novoDescricao, setNovoDescricao] = useState("");
  const [novoValor, setNovoValor] = useState("");

  // Filter
  const [filterParceiro, setFilterParceiro] = useState<string>("todos");
  const [filterStatus, setFilterStatus] = useState<string>("todos");

  // NF generation
  const [gerandoNF, setGerandoNF] = useState<string | null>(null);

  // Edit state
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState("");
  const [editValor, setEditValor] = useState("");
  const [editStatus, setEditStatus] = useState<"pendente" | "concluido">("pendente");

  const initRef = useRef(false);
  const skipSync = useRef(false);
  const unsubRefs = useRef<Record<string, () => void>>({});

  useEffect(() => {
    const raw = localStorage.getItem("pigeonz_user");
    if (!raw) { router.push("/login"); return; }
    const parsed = JSON.parse(raw);
    if (parsed.role !== "admin") { router.push("/login"); return; }
    setUser(parsed);
  }, [router]);

  // Load parceiros list + pix data
  useEffect(() => {
    if (!user) return;
    (async () => {
      const allUsers = await getAllUsers();
      const emails = allUsers.filter(u => u.role === "parceiro").map(u => u.email);
      setParceirosEmails(emails);
      if (emails.length > 0 && !novoParceiroEmail) setNovoParceiroEmail(emails[0]);
    })();

    const unsub = onParceiroPixChange(data => {
      const cache: Record<string, DadosPix> = {};
      for (const key of Object.keys(data)) {
        if (key === "updatedAt") continue;
        const val = data[key];
        if (val && typeof val === "object" && "chavePix" in (val as Record<string, unknown>)) {
          cache[key] = val as unknown as DadosPix;
        }
      }
      setAllPixCache(cache);
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Subscribe to each parceiro's financeiro
  useEffect(() => {
    if (!user || parceirosEmails.length === 0) return;

    // Clean old subs
    Object.values(unsubRefs.current).forEach(u => u());
    unsubRefs.current = {};

    for (const email of parceirosEmails) {
      const unsub = onFinanceiroChange(email, items => {
        if (skipSync.current) return;
        setAllEntries(prev => ({ ...prev, [email]: items as FinanceiroEntry[] }));
      });
      unsubRefs.current[email] = unsub;
    }

    if (!initRef.current) {
      initRef.current = true;
      (async () => {
        const result: Record<string, FinanceiroEntry[]> = {};
        for (const email of parceirosEmails) {
          const items = await getFinanceiro(email);
          result[email] = items as FinanceiroEntry[];
        }
        setAllEntries(result);
      })();
    }

    return () => {
      Object.values(unsubRefs.current).forEach(u => u());
      unsubRefs.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, parceirosEmails]);

  const saveEntries = async (email: string, items: FinanceiroEntry[]) => {
    skipSync.current = true;
    setAllEntries(prev => ({ ...prev, [email]: items }));
    await setFinanceiroDB(email, items);
    setTimeout(() => { skipSync.current = false; }, 500);
  };

  const addEntry = async () => {
    if (!novoParceiroEmail || !novoDescricao.trim() || !novoValor.trim()) return;
    const entry: FinanceiroEntry = {
      tipo: novoTipo,
      descricao: novoDescricao.trim(),
      valor: novoValor.trim(),
      status: "pendente",
      data: new Date().toISOString().slice(0, 10),
      parceiroEmail: novoParceiroEmail,
    };
    const current = allEntries[novoParceiroEmail] || [];
    await saveEntries(novoParceiroEmail, [...current, entry]);
    setNovoDescricao("");
    setNovoValor("");
    setShowForm(false);
  };

  const concluirEntry = async (email: string, idx: number, nf?: { name: string; dataUrl: string } | null) => {
    const items = [...(allEntries[email] || [])];
    items[idx] = {
      ...items[idx],
      status: "concluido",
      dataConclusao: new Date().toISOString().slice(0, 10),
      ...(nf ? { notaFiscal: nf } : {}),
    };
    await saveEntries(email, items);
  };

  const gerarNFAndConcluir = async (email: string, idx: number) => {
    const key = `${email}-${idx}`;
    setGerandoNF(key);

    const entry = (allEntries[email] || [])[idx];
    if (!entry) { setGerandoNF(null); return; }

    // Get parceiro data
    const pix = allPixCache[email];
    const userInfo = await getUser(email);

    const parceiroData = {
      nomeCompleto: pix?.nomeCompleto || userInfo?.name || email,
      cpfCnpj: pix?.cpfCnpj || userInfo?.cpfCnpj || "",
      endereco: userInfo?.endereco,
      municipio: userInfo?.municipio,
      uf: userInfo?.uf,
      email: email,
    };

    const numero = gerarNumeroNota();
    const codigo = gerarCodigoVerificacao();
    const html = gerarNFFinanceiroHTML(parceiroData, entry.descricao, entry.valor, numero, codigo);

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const fileName = `NFS-e_Fin_${numero}_${parceiroData.nomeCompleto.replace(/\s+/g, "_")}.html`;
      await concluirEntry(email, idx, { name: fileName, dataUrl });
      setGerandoNF(null);
    };
    reader.readAsDataURL(blob);
  };

  const removeEntry = async (email: string, idx: number) => {
    const items = [...(allEntries[email] || [])];
    items.splice(idx, 1);
    await saveEntries(email, items);
  };

  const startEdit = (email: string, idx: number) => {
    const entry = (allEntries[email] || [])[idx];
    if (!entry) return;
    setEditingKey(`${email}-${idx}`);
    setEditDesc(entry.descricao);
    setEditValor(entry.valor);
    setEditStatus(entry.status);
  };

  const saveEdit = async (email: string, idx: number) => {
    const items = [...(allEntries[email] || [])];
    items[idx] = {
      ...items[idx],
      descricao: editDesc.trim(),
      valor: editValor.trim(),
      status: editStatus,
      ...(editStatus === "concluido" && !items[idx].dataConclusao ? { dataConclusao: new Date().toISOString().slice(0, 10) } : {}),
    };
    await saveEntries(email, items);
    setEditingKey(null);
  };

  const gerarNFOnly = async (email: string, idx: number) => {
    const key = `${email}-${idx}`;
    setGerandoNF(key);

    const entry = (allEntries[email] || [])[idx];
    if (!entry) { setGerandoNF(null); return; }

    const pix = allPixCache[email];
    const userInfo = await getUser(email);

    const parceiroData = {
      nomeCompleto: pix?.nomeCompleto || userInfo?.name || email,
      cpfCnpj: pix?.cpfCnpj || userInfo?.cpfCnpj || "",
      endereco: userInfo?.endereco,
      municipio: userInfo?.municipio,
      uf: userInfo?.uf,
      email: email,
    };

    const numero = gerarNumeroNota();
    const codigo = gerarCodigoVerificacao();
    const html = gerarNFFinanceiroHTML(parceiroData, entry.descricao, entry.valor, numero, codigo);

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const fileName = `NFS-e_Fin_${numero}_${parceiroData.nomeCompleto.replace(/\s+/g, "_")}.html`;
      const items = [...(allEntries[email] || [])];
      items[idx] = { ...items[idx], notaFiscal: { name: fileName, dataUrl } };
      await saveEntries(email, items);
      setGerandoNF(null);
    };
    reader.readAsDataURL(blob);
  };

  // Flatten all entries for display
  const flatEntries: { entry: FinanceiroEntry; email: string; idx: number }[] = [];
  for (const email of Object.keys(allEntries)) {
    (allEntries[email] || []).forEach((entry, idx) => {
      flatEntries.push({ entry, email, idx });
    });
  }

  const filtered = flatEntries.filter(({ entry }) => {
    if (filterParceiro !== "todos" && entry.parceiroEmail !== filterParceiro) return false;
    if (filterStatus !== "todos" && entry.status !== filterStatus) return false;
    return true;
  }).sort((a, b) => b.entry.data.localeCompare(a.entry.data));

  const totalEntries = flatEntries.length;
  const pendentes = flatEntries.filter(f => f.entry.status === "pendente").length;
  const concluidos = flatEntries.filter(f => f.entry.status === "concluido").length;

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
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Back button */}
        <a
          href="/admin"
          style={{
            fontFamily: "'VT323', monospace", fontSize: 18,
            color: T, background: "transparent", border: "none",
            cursor: "pointer", marginBottom: 24, padding: 0,
            display: "flex", alignItems: "center", gap: 6,
            textDecoration: "none",
          }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Voltar ao Admin
        </a>

        <h1 style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(10px, 2vw, 18px)",
          color: K,
          textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000",
          marginBottom: 8,
        }}>
          Financeiro Parceiros
        </h1>
        <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000", marginBottom: 32 }}>
          Pagamentos e cobranças de clientes e parceiros
        </p>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Total", value: totalEntries, color: T },
            { label: "Pendentes", value: pendentes, color: "#f0c848" },
            { label: "Concluídos", value: concluidos, color: G },
          ].map((s, i) => (
            <div key={i} className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "16px 14px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: s.color, letterSpacing: 1, marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, color: "#f0ebfa" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <select
            value={filterParceiro}
            onChange={e => setFilterParceiro(e.target.value)}
            style={{ ...inputStyle, width: "auto", minWidth: 200 }}
          >
            <option value="todos">Todos os parceiros</option>
            {parceirosEmails.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ ...inputStyle, width: "auto", minWidth: 160 }}
          >
            <option value="todos">Todos status</option>
            <option value="pendente">Pendentes</option>
            <option value="concluido">Concluídos</option>
          </select>
        </div>

        {/* New entry form toggle */}
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            fontFamily: "'Press Start 2P', monospace", fontSize: 9,
            padding: "12px 24px", letterSpacing: 2,
            color: "#1c1030", background: K,
            border: `2px solid ${K}`,
            cursor: "pointer", transition: "all 0.2s",
            boxShadow: `4px 4px 0 ${K}44`,
            marginBottom: 20,
          }}
        >
          {showForm ? "FECHAR" : "+ NOVO LANÇAMENTO"}
        </button>

        {showForm && (
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: T, letterSpacing: 1, marginBottom: 16 }}>
              NOVO LANÇAMENTO
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#8878a8", display: "block", marginBottom: 6, letterSpacing: 1 }}>
                  PARCEIRO
                </label>
                <select
                  value={novoParceiroEmail}
                  onChange={e => setNovoParceiroEmail(e.target.value)}
                  style={{ ...inputStyle }}
                >
                  {parceirosEmails.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#8878a8", display: "block", marginBottom: 6, letterSpacing: 1 }}>
                  TIPO
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setNovoTipo("pagamento")}
                    style={{
                      fontFamily: "'VT323', monospace", fontSize: 16,
                      padding: "8px 16px", cursor: "pointer",
                      color: novoTipo === "pagamento" ? "#1c1030" : T,
                      background: novoTipo === "pagamento" ? T : "transparent",
                      border: `1px solid ${T}`, transition: "all 0.2s",
                      flex: 1,
                    }}
                  >
                    Pagamento
                  </button>
                  <button
                    type="button"
                    onClick={() => setNovoTipo("cobranca")}
                    style={{
                      fontFamily: "'VT323', monospace", fontSize: 16,
                      padding: "8px 16px", cursor: "pointer",
                      color: novoTipo === "cobranca" ? "#1c1030" : K,
                      background: novoTipo === "cobranca" ? K : "transparent",
                      border: `1px solid ${K}`, transition: "all 0.2s",
                      flex: 1,
                    }}
                  >
                    Cobrança
                  </button>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#8878a8", display: "block", marginBottom: 6, letterSpacing: 1 }}>
                DESCRIÇÃO
              </label>
              <input
                value={novoDescricao}
                onChange={e => setNovoDescricao(e.target.value)}
                placeholder="Descrição do lançamento..."
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = T}
                onBlur={e => e.target.style.borderColor = "rgba(72,192,184,0.4)"}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#8878a8", display: "block", marginBottom: 6, letterSpacing: 1 }}>
                VALOR
              </label>
              <input
                value={novoValor}
                onChange={e => setNovoValor(maskBRL(e.target.value))}
                placeholder="R$ 0,00"
                style={{ ...inputStyle, maxWidth: 240 }}
                onFocus={e => e.target.style.borderColor = T}
                onBlur={e => e.target.style.borderColor = "rgba(72,192,184,0.4)"}
              />
            </div>

            <button
              onClick={addEntry}
              disabled={!novoParceiroEmail || !novoDescricao.trim() || !novoValor.trim()}
              style={{
                fontFamily: "'Press Start 2P', monospace", fontSize: 9,
                padding: "12px 24px", letterSpacing: 2,
                color: (!novoParceiroEmail || !novoDescricao.trim() || !novoValor.trim()) ? "#6b5c85" : "#1c1030",
                background: (!novoParceiroEmail || !novoDescricao.trim() || !novoValor.trim()) ? "transparent" : T,
                border: `2px solid ${(!novoParceiroEmail || !novoDescricao.trim() || !novoValor.trim()) ? "#6b5c85" : T}`,
                cursor: (!novoParceiroEmail || !novoDescricao.trim() || !novoValor.trim()) ? "not-allowed" : "pointer",
                boxShadow: (!novoParceiroEmail || !novoDescricao.trim() || !novoValor.trim()) ? "none" : `4px 4px 0 ${T}44`,
                transition: "all 0.2s",
              }}
            >
              REGISTRAR
            </button>
          </div>
        )}

        {/* List */}
        {filtered.length === 0 ? (
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: 40, textAlign: "center" }}>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#6b5c85" }}>
              Nenhum lançamento encontrado.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map(({ entry, email, idx }) => {
              const key = `${email}-${idx}`;
              const isPending = entry.status === "pendente";
              const isCobranca = entry.tipo === "cobranca";

              return (
                <div key={key} className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      {/* Tipo badge */}
                      <span style={{
                        fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                        padding: "4px 10px", letterSpacing: 1,
                        color: "#1c1030",
                        background: isCobranca ? K : T,
                      }}>
                        {isCobranca ? "COBRANÇA" : "PAGAMENTO"}
                      </span>
                      {/* Status badge */}
                      <span style={{
                        fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                        padding: "4px 10px", letterSpacing: 1,
                        color: "#1c1030",
                        background: isPending ? "#f0c848" : G,
                      }}>
                        {isPending ? "PENDENTE" : "CONCLUÍDO"}
                      </span>
                    </div>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#6b5c85" }}>
                      {entry.data}
                    </span>
                  </div>

                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: "#8878a8" }}>Parceiro: </span>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: T }}>
                      {entry.parceiroEmail}
                    </span>
                  </div>

                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: "#8878a8" }}>Descrição: </span>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: "#f0ebfa" }}>
                      {entry.descricao}
                    </span>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: "#8878a8" }}>Valor: </span>
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 12, color: G }}>
                      {entry.valor}
                    </span>
                  </div>

                  {entry.dataConclusao && (
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: "#8878a8" }}>Concluído em: </span>
                      <span style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: G }}>
                        {entry.dataConclusao}
                      </span>
                    </div>
                  )}

                  {/* Edit mode */}
                  {editingKey === key ? (
                    <div style={{ marginTop: 10, padding: "14px", background: "rgba(72,192,184,0.05)", border: `1px solid ${T}22` }}>
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
                        <div style={{ flex: "1 1 300px" }}>
                          <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: "#8878a8", display: "block", marginBottom: 4 }}>DESCRIÇÃO</label>
                          <input value={editDesc} onChange={e => setEditDesc(e.target.value)} style={{ ...inputStyle, fontSize: 16, padding: "6px 10px" }} />
                        </div>
                        <div style={{ flex: "0 0 180px" }}>
                          <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: "#8878a8", display: "block", marginBottom: 4 }}>VALOR</label>
                          <input value={editValor} onChange={e => setEditValor(maskBRL(e.target.value))} style={{ ...inputStyle, fontSize: 16, padding: "6px 10px" }} />
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                        <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: "#8878a8" }}>STATUS:</label>
                        {(["pendente", "concluido"] as const).map(s => (
                          <button key={s} onClick={() => setEditStatus(s)} style={{
                            fontFamily: "'VT323', monospace", fontSize: 15, padding: "4px 12px", cursor: "pointer",
                            color: editStatus === s ? "#1c1030" : (s === "pendente" ? "#f0c848" : G),
                            background: editStatus === s ? (s === "pendente" ? "#f0c848" : G) : "transparent",
                            border: `1px solid ${s === "pendente" ? "#f0c848" : G}`, transition: "all 0.2s",
                          }}>
                            {s === "pendente" ? "Pendente" : "Concluído"}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => saveEdit(email, idx)} style={{
                          fontFamily: "'Press Start 2P', monospace", fontSize: 7, padding: "8px 16px",
                          color: "#1c1030", background: G, border: `2px solid ${G}`, cursor: "pointer",
                        }}>SALVAR</button>
                        <button onClick={() => setEditingKey(null)} style={{
                          fontFamily: "'VT323', monospace", fontSize: 16, padding: "6px 14px",
                          color: "#ff6060", background: "transparent", border: "1px solid #ff6060", cursor: "pointer",
                        }}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    /* Actions */
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                      {isPending && (
                        <>
                          {gerandoNF === key ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{
                                display: "inline-block", width: 20, height: 20,
                                border: `3px solid ${G}33`, borderTop: `3px solid ${G}`,
                                borderRadius: "50%",
                                animation: "spin 1s linear infinite",
                              }} />
                              <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: G }}>
                                {isCobranca ? "Gerando NF..." : "Concluindo..."}
                              </span>
                              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                if (isCobranca) {
                                  gerarNFAndConcluir(email, idx);
                                } else {
                                  setGerandoNF(key);
                                  setTimeout(() => {
                                    concluirEntry(email, idx);
                                    setGerandoNF(null);
                                  }, 600);
                                }
                              }}
                              style={{
                                fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                                padding: "10px 18px", letterSpacing: 1,
                                color: "#1c1030", background: G,
                                border: `2px solid ${G}`,
                                cursor: "pointer", transition: "all 0.2s",
                                boxShadow: `4px 4px 0 ${G}44`,
                              }}
                            >
                              CONCLUIR
                            </button>
                          )}
                        </>
                      )}

                      {/* Generate NF (any status) */}
                      {!entry.notaFiscal && gerandoNF !== key && (
                        <button
                          onClick={() => gerarNFOnly(email, idx)}
                          style={{
                            fontFamily: "'Press Start 2P', monospace", fontSize: 7,
                            padding: "8px 14px", letterSpacing: 1,
                            color: T, background: "transparent",
                            border: `2px solid ${T}`, cursor: "pointer", transition: "all 0.2s",
                          }}
                        >
                          GERAR NF
                        </button>
                      )}

                      {entry.notaFiscal && (
                        <button
                          onClick={() => {
                            const nf = entry.notaFiscal;
                            if (!nf) return;
                            if (nf.dataUrl.startsWith("data:text/html")) {
                              const html = decodeBase64UTF8(nf.dataUrl);
                              const win = window.open("", "_blank");
                              if (win) { win.document.write(html); win.document.close(); }
                            }
                          }}
                          style={{
                            fontFamily: "'VT323', monospace", fontSize: 16,
                            padding: "6px 14px",
                            color: T, background: "transparent",
                            border: `1px solid ${T}`,
                            cursor: "pointer", transition: "all 0.2s",
                          }}
                        >
                          Ver NF
                        </button>
                      )}

                      {/* Edit + Remove */}
                      <button
                        onClick={() => startEdit(email, idx)}
                        style={{
                          fontFamily: "'VT323', monospace", fontSize: 16,
                          padding: "6px 14px",
                          color: "#f0c848", background: "transparent",
                          border: "1px solid #f0c848",
                          cursor: "pointer", transition: "all 0.2s",
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => removeEntry(email, idx)}
                        style={{
                          fontFamily: "'VT323', monospace", fontSize: 16,
                          padding: "6px 14px",
                          color: "#ff6060", background: "transparent",
                          border: "1px solid #ff6060",
                          cursor: "pointer", transition: "all 0.2s",
                        }}
                      >
                        Remover
                      </button>
                    </div>
                  )}
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

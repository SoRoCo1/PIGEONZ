"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import GlobalCityBg from "@/components/GlobalCityBg";
import { getPagamentos, setPagamentos as setPagamentosDB, onPagamentosChange, getComprovantes } from "@/lib/db";

const K = "#f0a0d0";
const T = "#48c0b8";

type Pagamento = {
  plano: string;
  valor: string;
  metodo: "cartao" | "pix";
  data: string;
  status: "aprovado" | "pendente" | "cancelado";
  userEmail?: string;
  userName?: string;
};

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
};

const statusColors: Record<string, string> = {
  aprovado: "#48e8a0",
  pendente: "#f0c848",
  cancelado: "#ff6060",
};

export default function PagamentosPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);

  // Admin: add new payment
  const [novoPlano, setNovoPlano] = useState("");
  const [novoValor, setNovoValor] = useState("");
  const [novoMetodo, setNovoMetodo] = useState<"cartao" | "pix">("cartao");
  const [novoStatus, setNovoStatus] = useState<"aprovado" | "pendente" | "cancelado">("aprovado");
  const [novoClienteEmail, setNovoClienteEmail] = useState("");
  const [novoClienteNome, setNovoClienteNome] = useState("");

  const pagamentosInitRef = useRef(false);
  const skipPagSync = useRef(false);

  useEffect(() => {
    const raw = localStorage.getItem("pigeonz_user");
    if (!raw) { router.push("/login"); return; }
    const parsed = JSON.parse(raw);
    setUser(parsed);

    // Load from Firestore
    getPagamentos(parsed.email).then(items => { setPagamentos(items as Pagamento[]); pagamentosInitRef.current = true; });

    // Real-time sync
    const unsub = onPagamentosChange(parsed.email, items => {
      if (skipPagSync.current) { skipPagSync.current = false; return; }
      setPagamentos(items as Pagamento[]); pagamentosInitRef.current = true;
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!user || !pagamentosInitRef.current) return;
    skipPagSync.current = true;
    setPagamentosDB(user.email, pagamentos);
  }, [pagamentos, user]);

  // Sync confirmed comprovantes to pagamentos list
  useEffect(() => {
    if (!user) return;
    getComprovantes().then(compItems => {
      const comps = compItems as { cliente: string; email: string; plano: string; valor: string; data: string; status: string }[];
      const confirmados = comps.filter(c => c.status === "confirmado");
      if (confirmados.length === 0) return;

      setPagamentos(prev => {
        const updated = [...prev];
        let changed = false;
        for (const c of confirmados) {
          const key = `${c.email}_${c.plano}_${c.data}`;
          const exists = updated.some(p => (p.userEmail === c.email && p.plano === c.plano && p.data === c.data) || (p as any)._compKey === key);
          if (!exists) {
            updated.push({
              plano: c.plano,
              valor: c.valor,
              metodo: "pix" as const,
              data: c.data,
              status: "aprovado" as const,
              userEmail: c.email,
              userName: c.cliente,
            });
            changed = true;
          }
        }
        return changed ? updated : prev;
      });
    });
  }, [user]);

  const isAdmin = user?.role === "admin";

  // Filter: each user sees only their own payments; admin sees all
  const myPagamentos = isAdmin
    ? pagamentos
    : pagamentos.filter(p => p.userEmail === user?.email || !p.userEmail);

  const addPagamento = () => {
    if (!novoPlano.trim() || !novoValor.trim()) return;
    const now = new Date().toISOString().split("T")[0];
    setPagamentos(prev => [...prev, {
      plano: novoPlano.trim(),
      valor: novoValor.trim(),
      metodo: novoMetodo,
      data: now,
      status: novoStatus,
      userEmail: novoClienteEmail.trim() || undefined,
      userName: novoClienteNome.trim() || undefined,
    }]);
    setNovoPlano("");
    setNovoValor("");
    setNovoClienteEmail("");
    setNovoClienteNome("");
  };

  const removePagamento = (idx: number) => {
    setPagamentos(prev => prev.filter((_, i) => i !== idx));
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
      <div style={{ maxWidth: 700, margin: "0 auto", marginBottom: 32 }}>
        <a
          onClick={() => router.push(isAdmin ? "/admin" : "/painel")}
          style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000", cursor: "pointer" }}
        >
          &larr; Voltar ao painel
        </a>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(12px, 2.5vw, 18px)",
          color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000",
          margin: "0 0 24px",
          lineHeight: 1.6,
        }}>
          Pagamentos
        </h1>

        {/* Payment list */}
        {myPagamentos.length === 0 ? (
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", marginBottom: 20 }}>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#8878a8", margin: 0, textAlign: "center" }}>
              Nenhum pagamento registrado ainda.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {myPagamentos.map((p, i) => (
              <div key={i} className="pixel-box" style={{
                background: "rgba(10,8,20,0.95)",
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}>
                <div style={{ flex: "1 1 200px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    {/* Pixel card/pix icon */}
                    {p.metodo === "cartao" ? (
                      <svg width={24} height={18} viewBox="0 0 14 10" shapeRendering="crispEdges">
                        <rect x={0} y={0} width={14} height={1} fill={T}/>
                        <rect x={0} y={0} width={1} height={10} fill={T}/><rect x={13} y={0} width={1} height={10} fill={T}/>
                        <rect x={0} y={9} width={14} height={1} fill={T}/>
                        <rect x={0} y={2} width={14} height={2} fill={T}/>
                        <rect x={2} y={6} width={4} height={1} fill={T}/><rect x={2} y={7} width={3} height={1} fill={T}/>
                      </svg>
                    ) : (
                      <svg width={20} height={20} viewBox="0 0 12 12" shapeRendering="crispEdges">
                        <rect x={5} y={0} width={2} height={1} fill={T}/>
                        <rect x={4} y={1} width={1} height={1} fill={T}/><rect x={7} y={1} width={1} height={1} fill={T}/>
                        <rect x={3} y={2} width={1} height={1} fill={T}/><rect x={8} y={2} width={1} height={1} fill={T}/>
                        <rect x={2} y={3} width={1} height={1} fill={T}/><rect x={9} y={3} width={1} height={1} fill={T}/>
                        <rect x={1} y={4} width={1} height={1} fill={T}/><rect x={10} y={4} width={1} height={1} fill={T}/>
                        <rect x={0} y={5} width={1} height={2} fill={T}/><rect x={11} y={5} width={1} height={2} fill={T}/>
                        <rect x={1} y={7} width={1} height={1} fill={T}/><rect x={10} y={7} width={1} height={1} fill={T}/>
                        <rect x={2} y={8} width={1} height={1} fill={T}/><rect x={9} y={8} width={1} height={1} fill={T}/>
                        <rect x={3} y={9} width={1} height={1} fill={T}/><rect x={8} y={9} width={1} height={1} fill={T}/>
                        <rect x={4} y={10} width={1} height={1} fill={T}/><rect x={7} y={10} width={1} height={1} fill={T}/>
                        <rect x={5} y={11} width={2} height={1} fill={T}/>
                      </svg>
                    )}
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: T }}>
                      {p.plano}
                    </span>
                  </div>
                  {isAdmin && p.userName && (
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: K, margin: "2px 0 0" }}>
                      Cliente: <strong>{p.userName}</strong> ({p.userEmail})
                    </p>
                  )}
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#f0ebfa" }}>
                      {p.valor}
                    </span>
                    <span style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#8878a8" }}>
                      {p.metodo === "cartao" ? "Cartão" : "Pix"} · {p.data}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 7,
                    color: statusColors[p.status],
                    border: `1px solid ${statusColors[p.status]}`,
                    padding: "4px 8px",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}>
                    {p.status}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        const realIdx = pagamentos.indexOf(p);
                        if (realIdx >= 0) removePagamento(realIdx);
                      }}
                      style={{
                        fontFamily: "'VT323', monospace", fontSize: 16, color: "#ff6060",
                        background: "transparent", border: "1px solid #ff6060",
                        padding: "2px 8px", cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Admin: add payment */}
        {isAdmin && (
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px" }}>
            <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: K, margin: "0 0 16px", letterSpacing: 1 }}>
              REGISTRAR PAGAMENTO
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: K, display: "block", marginBottom: 4 }}>Email do Cliente</label>
                  <input
                    value={novoClienteEmail}
                    onChange={e => setNovoClienteEmail(e.target.value.replace(/\s/g, ""))}
                    placeholder="cliente@email.com"
                    style={{ ...inputStyle, borderColor: `${K}66` }}
                    onFocus={e => e.target.style.borderColor = K}
                    onBlur={e => e.target.style.borderColor = `${K}66`}
                  />
                </div>
                <div style={{ flex: "1 1 150px" }}>
                  <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: K, display: "block", marginBottom: 4 }}>Nome do Cliente</label>
                  <input
                    value={novoClienteNome}
                    onChange={e => setNovoClienteNome(e.target.value)}
                    placeholder="Nome do cliente"
                    style={{ ...inputStyle, borderColor: `${K}66` }}
                    onFocus={e => e.target.style.borderColor = K}
                    onBlur={e => e.target.style.borderColor = `${K}66`}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: K, display: "block", marginBottom: 4 }}>Plano / Descrição</label>
                  <input
                    value={novoPlano}
                    onChange={e => setNovoPlano(e.target.value)}
                    placeholder="Starter, Pro, Ajuste extra..."
                    style={{ ...inputStyle, borderColor: `${K}66` }}
                    onFocus={e => e.target.style.borderColor = K}
                    onBlur={e => e.target.style.borderColor = `${K}66`}
                  />
                </div>
                <div style={{ flex: "1 1 150px" }}>
                  <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: K, display: "block", marginBottom: 4 }}>Valor</label>
                  <input
                    value={novoValor}
                    onChange={e => setNovoValor(e.target.value)}
                    placeholder="R$ 2.567"
                    style={{ ...inputStyle, borderColor: `${K}66` }}
                    onFocus={e => e.target.style.borderColor = K}
                    onBlur={e => e.target.style.borderColor = `${K}66`}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 150px" }}>
                  <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: K, display: "block", marginBottom: 4 }}>Método</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {(["cartao", "pix"] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => setNovoMetodo(m)}
                        style={{
                          fontFamily: "'VT323', monospace", fontSize: 16,
                          padding: "6px 14px", cursor: "pointer",
                          color: novoMetodo === m ? "#1c1030" : T,
                          background: novoMetodo === m ? T : "transparent",
                          border: `2px solid ${T}`,
                          transition: "all 0.2s",
                        }}
                      >
                        {m === "cartao" ? "Cartão" : "Pix"}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ flex: "1 1 150px" }}>
                  <label style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: K, display: "block", marginBottom: 4 }}>Status</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {(["aprovado", "pendente", "cancelado"] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => setNovoStatus(s)}
                        style={{
                          fontFamily: "'VT323', monospace", fontSize: 14,
                          padding: "4px 10px", cursor: "pointer",
                          color: novoStatus === s ? "#1c1030" : statusColors[s],
                          background: novoStatus === s ? statusColors[s] : "transparent",
                          border: `1px solid ${statusColors[s]}`,
                          transition: "all 0.2s",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={addPagamento}
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 9, padding: "12px 24px", letterSpacing: 2,
                  color: "#1c1030", background: K, border: `2px solid ${K}`,
                  cursor: "pointer", boxShadow: `4px 4px 0 ${K}44`,
                  transition: "all 0.2s", alignSelf: "flex-start",
                }}
              >
                ADICIONAR PAGAMENTO
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import GlobalCityBg from "@/components/GlobalCityBg";
import { onFinanceiroChange } from "@/lib/db";

const K = "#f0a0d0";
const T = "#48c0b8";
const G = "#48e8a0";

function decodeBase64UTF8(dataUrl: string): string {
  const base64 = dataUrl.split(",")[1];
  const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

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

export default function FinanceiroPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [entries, setEntries] = useState<FinanceiroEntry[]>([]);
  const initRef = useRef(false);

  useEffect(() => {
    const raw = localStorage.getItem("pigeonz_user");
    if (!raw) { router.push("/login"); return; }
    const parsed = JSON.parse(raw);
    if (parsed.role !== "parceiro") { router.push("/login"); return; }
    setUser(parsed);
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const unsub = onFinanceiroChange(user.email, items => {
      setEntries(items as FinanceiroEntry[]);
    });
    if (!initRef.current) {
      initRef.current = true;
    }
    return () => unsub();
  }, [user]);

  const totalEntries = entries.length;
  const pendentes = entries.filter(e => e.status === "pendente").length;
  const concluidos = entries.filter(e => e.status === "concluido").length;

  const sorted = [...entries].sort((a, b) => b.data.localeCompare(a.data));

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
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Back button */}
        <button
          onClick={() => router.push("/painel")}
          style={{
            fontFamily: "'VT323', monospace", fontSize: 18,
            color: T, background: "transparent", border: "none",
            cursor: "pointer", marginBottom: 24, padding: 0,
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Voltar ao Painel
        </button>

        <h1 style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(10px, 2vw, 18px)",
          color: K,
          textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000",
          marginBottom: 8,
        }}>
          Financeiro
        </h1>
        <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000", marginBottom: 32 }}>
          Pagamentos, cobranças e notas fiscais
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

        {/* List */}
        {sorted.length === 0 ? (
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: 40, textAlign: "center" }}>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#6b5c85" }}>
              Nenhum lançamento financeiro.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {sorted.map((entry, i) => {
              const isPending = entry.status === "pendente";
              const isCobranca = entry.tipo === "cobranca";

              return (
                <div key={i} className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "18px 20px" }}>
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

                  {/* NF buttons */}
                  {entry.notaFiscal && (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
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
                      <button
                        onClick={() => {
                          const nf = entry.notaFiscal;
                          if (!nf) return;
                          const a = document.createElement("a");
                          a.href = nf.dataUrl;
                          a.download = nf.name;
                          a.click();
                        }}
                        style={{
                          fontFamily: "'VT323', monospace", fontSize: 16,
                          padding: "6px 14px",
                          color: G, background: "transparent",
                          border: `1px solid ${G}`,
                          cursor: "pointer", transition: "all 0.2s",
                        }}
                      >
                        Baixar NF
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

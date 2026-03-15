"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import GlobalCityBg from "@/components/GlobalCityBg";
import { getMeuSite, setMeuSite as setMeuSiteDB, onMeuSiteChange } from "@/lib/db";

const K = "#f0a0d0";
const T = "#48c0b8";

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

export default function MeuSitePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [dominioOficial, setDominioOficial] = useState("");
  const [dominioTemp, setDominioTemp] = useState("");

  const meusiteInitRef = useRef(false);
  const skipSiteSync = useRef(false);

  useEffect(() => {
    const raw = localStorage.getItem("pigeonz_user");
    if (!raw) { router.push("/login"); return; }
    const parsed = JSON.parse(raw);
    setUser(parsed);

    // Admin edits the client's site via admin_manage
    const isAdm = parsed.role === "admin";
    const manage = localStorage.getItem("pigeonz_admin_manage");
    const targetEmail = isAdm && manage ? manage : parsed.email;

    // Load from Firestore
    getMeuSite(targetEmail).then(data => {
      if (data) {
        if (data.dominioOficial) setDominioOficial(data.dominioOficial as string);
        if (data.dominioTemp) setDominioTemp(data.dominioTemp as string);
      }
      meusiteInitRef.current = true;
    });

    // Real-time sync
    const unsub = onMeuSiteChange(targetEmail, data => {
      if (skipSiteSync.current) { skipSiteSync.current = false; return; }
      if (data) {
        if (data.dominioOficial) setDominioOficial(data.dominioOficial as string);
        if (data.dominioTemp) setDominioTemp(data.dominioTemp as string);
      }
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!user || !meusiteInitRef.current) return;
    const isAdm = user.role === "admin";
    const manage = localStorage.getItem("pigeonz_admin_manage");
    const targetEmail = isAdm && manage ? manage : user.email;
    skipSiteSync.current = true;
    setMeuSiteDB(targetEmail, { dominioOficial, dominioTemp });
  }, [dominioOficial, dominioTemp, user]);

  const isAdmin = user?.role === "admin";

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
          Meu Site
        </h1>

        {/* Domínio Oficial */}
        <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <svg width={24} height={24} viewBox="0 0 12 12" shapeRendering="crispEdges">
              <rect x={3} y={0} width={6} height={1} fill={K}/>
              <rect x={1} y={1} width={2} height={1} fill={K}/><rect x={9} y={1} width={2} height={1} fill={K}/>
              <rect x={0} y={2} width={1} height={8} fill={K}/><rect x={11} y={2} width={1} height={8} fill={K}/>
              <rect x={1} y={10} width={2} height={1} fill={K}/><rect x={9} y={10} width={2} height={1} fill={K}/>
              <rect x={3} y={11} width={6} height={1} fill={K}/>
              <rect x={2} y={5} width={8} height={1} fill={K}/>
              <rect x={5} y={3} width={2} height={1} fill={K}/>
              <rect x={5} y={8} width={2} height={1} fill={K}/>
            </svg>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: K, letterSpacing: 1 }}>
              SITE OFICIAL (DOMÍNIO)
            </span>
          </div>

          {isAdmin ? (
            <div>
              <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: K, display: "block", marginBottom: 6 }}>
                URL do domínio oficial:
              </label>
              <input
                value={dominioOficial}
                onChange={e => setDominioOficial(e.target.value)}
                placeholder="https://www.seucliente.com.br"
                style={{ ...inputStyle, borderColor: `${K}66` }}
                onFocus={e => e.target.style.borderColor = K}
                onBlur={e => e.target.style.borderColor = `${K}66`}
              />
            </div>
          ) : dominioOficial ? (
            <div>
              <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#f0ebfa", margin: "0 0 12px" }}>
                {dominioOficial}
              </p>
              <a
                href={dominioOficial}
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
                }}
              >
                ACESSAR SITE OFICIAL →
              </a>
            </div>
          ) : (
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#8878a8", margin: 0 }}>
              Domínio oficial ainda não configurado.
            </p>
          )}
        </div>

        {/* Domínio Temporário Firebase */}
        <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <svg width={24} height={24} viewBox="0 0 12 12" shapeRendering="crispEdges">
              <rect x={3} y={0} width={6} height={1} fill={T}/>
              <rect x={1} y={1} width={2} height={1} fill={T}/><rect x={5} y={1} width={2} height={1} fill={T}/><rect x={9} y={1} width={2} height={1} fill={T}/>
              <rect x={0} y={2} width={1} height={2} fill={T}/><rect x={5} y={2} width={2} height={2} fill={T}/><rect x={11} y={2} width={1} height={2} fill={T}/>
              <rect x={0} y={4} width={12} height={1} fill={T}/>
              <rect x={0} y={5} width={1} height={2} fill={T}/><rect x={5} y={5} width={2} height={2} fill={T}/><rect x={11} y={5} width={1} height={2} fill={T}/>
              <rect x={0} y={7} width={12} height={1} fill={T}/>
              <rect x={0} y={8} width={1} height={2} fill={T}/><rect x={5} y={8} width={2} height={2} fill={T}/><rect x={11} y={8} width={1} height={2} fill={T}/>
              <rect x={1} y={10} width={2} height={1} fill={T}/><rect x={5} y={10} width={2} height={1} fill={T}/><rect x={9} y={10} width={2} height={1} fill={T}/>
              <rect x={3} y={11} width={6} height={1} fill={T}/>
            </svg>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: T, letterSpacing: 1 }}>
              SITE TEMPORÁRIO (FIREBASE)
            </span>
          </div>

          {isAdmin ? (
            <div>
              <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: T, display: "block", marginBottom: 6 }}>
                URL do Firebase Hosting:
              </label>
              <input
                value={dominioTemp}
                onChange={e => setDominioTemp(e.target.value)}
                placeholder="https://seucliente.web.app"
                style={{ ...inputStyle, borderColor: `${T}66` }}
                onFocus={e => e.target.style.borderColor = T}
                onBlur={e => e.target.style.borderColor = `${T}66`}
              />
            </div>
          ) : dominioTemp ? (
            <div>
              <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#f0ebfa", margin: "0 0 12px" }}>
                {dominioTemp}
              </p>
              <a
                href={dominioTemp}
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
                ACESSAR SITE TEMPORÁRIO →
              </a>
            </div>
          ) : (
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#8878a8", margin: 0 }}>
              Link temporário ainda não disponível.
            </p>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

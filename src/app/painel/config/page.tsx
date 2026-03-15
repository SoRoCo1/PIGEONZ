"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GlobalCityBg from "@/components/GlobalCityBg";
import { setUser as setUserDB, getUser as getUserDB } from "@/lib/db";

const K = "#f0a0d0";
const T = "#48c0b8";
const G = "#48e8a0";

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

export default function ConfigPage() {
  const router = useRouter();
  const [user, setUser] = useState<Record<string, string> | null>(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [endereco, setEndereco] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [uf, setUf] = useState("");

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"ok" | "err">("ok");
  const [showCancelar, setShowCancelar] = useState(false);
  const [confirmCancelar, setConfirmCancelar] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("pigeonz_user");
    if (!raw) { router.push("/login"); return; }
    const parsed = JSON.parse(raw);
    setUser(parsed);
    setNome(parsed.name || "");
    setEmail(parsed.email || "");
    setTelefone(parsed.telefone || "");
    setCpfCnpj(parsed.cpfCnpj || "");
    setRazaoSocial(parsed.razaoSocial || "");
    setEndereco(parsed.endereco || "");
    setMunicipio(parsed.municipio || "");
    setUf(parsed.uf || "");
  }, [router]);

  const isAdmin = user?.role === "admin";
  const isParceiro = user?.role === "parceiro";

  const salvarDados = () => {
    if (!nome.trim() || !email.trim()) {
      setMsg("Nome e email são obrigatórios."); setMsgType("err"); return;
    }
    const updated = { ...user!, name: nome.trim(), email: email.trim(), telefone, cpfCnpj, razaoSocial, endereco, municipio, uf };
    localStorage.setItem("pigeonz_user", JSON.stringify(updated));
    setUserDB(email.trim(), updated);
    setUser(updated);
    setMsg("Dados atualizados com sucesso!"); setMsgType("ok");
    setTimeout(() => setMsg(""), 3000);
  };

  const mudarSenha = async () => {
    if (!senhaAtual.trim()) {
      setMsg("Digite sua senha atual."); setMsgType("err"); return;
    }
    // Verify current password against Firestore
    const dbUser = await getUserDB(email.trim());
    const storedPassword = dbUser?.password || user?.password;
    if (storedPassword && senhaAtual !== storedPassword) {
      setMsg("Senha atual incorreta."); setMsgType("err"); return;
    }
    if (novaSenha.length < 6) {
      setMsg("A nova senha deve ter pelo menos 6 caracteres."); setMsgType("err"); return;
    }
    if (novaSenha !== confirmSenha) {
      setMsg("As senhas não coincidem."); setMsgType("err"); return;
    }
    // Save new password to Firestore
    await setUserDB(email.trim(), { password: novaSenha });
    const updated = { ...user!, password: novaSenha };
    localStorage.setItem("pigeonz_user", JSON.stringify(updated));
    setUser(updated);
    setSenhaAtual(""); setNovaSenha(""); setConfirmSenha("");
    setMsg("Senha alterada com sucesso!"); setMsgType("ok");
    setTimeout(() => setMsg(""), 3000);
  };

  const cancelarConta = () => {
    if (confirmCancelar !== "CANCELAR") return;
    localStorage.removeItem("pigeonz_user");
    localStorage.removeItem("pigeonz_proposta");
    localStorage.removeItem("pigeonz_proposta_v");
    localStorage.removeItem("pigeonz_pagamentos");
    localStorage.removeItem("pigeonz_mensagens");
    router.push("/login");
  };

  if (!user) return null;

  const backPath = isAdmin ? "/admin" : "/painel";

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
      <div style={{ maxWidth: 600, margin: "0 auto", marginBottom: 32 }}>
        <a
          onClick={() => router.push(backPath)}
          style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000", cursor: "pointer" }}
        >
          &larr; Voltar ao painel
        </a>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h1 style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(12px, 2.5vw, 18px)",
          color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000",
          margin: "0 0 8px",
          lineHeight: 1.6,
        }}>
          Configurações
        </h1>
        <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#ffffff", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000", marginBottom: 32 }}>
          Gerencie seus dados pessoais, senha e conta.
        </p>

        {/* Mensagem */}
        {msg && (
          <div style={{
            padding: "10px 16px", marginBottom: 16,
            background: msgType === "ok" ? "rgba(72,232,160,0.1)" : "rgba(255,96,96,0.1)",
            borderLeft: `3px solid ${msgType === "ok" ? G : "#ff6060"}`,
          }}>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: msgType === "ok" ? G : "#ff6060", margin: 0 }}>
              {msgType === "ok" ? "✓" : "✕"} {msg}
            </p>
          </div>
        )}

        {/* Informações pessoais */}
        <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: T, margin: "0 0 16px", letterSpacing: 1 }}>
            INFORMAÇÕES PESSOAIS
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: T, display: "block", marginBottom: 6 }}>
                Nome
              </label>
              <input
                value={nome}
                onChange={e => setNome(e.target.value)}
                style={{ ...inputStyle, borderColor: `${T}66` }}
                onFocus={e => e.target.style.borderColor = T}
                onBlur={e => e.target.style.borderColor = `${T}66`}
              />
            </div>
            <div>
              <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: T, display: "block", marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ ...inputStyle, borderColor: `${T}66` }}
                onFocus={e => e.target.style.borderColor = T}
                onBlur={e => e.target.style.borderColor = `${T}66`}
              />
            </div>
            <div>
              <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: T, display: "block", marginBottom: 6 }}>
                Telefone
              </label>
              <input
                type="tel"
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
                placeholder="(31) 99999-9999"
                style={{ ...inputStyle, borderColor: `${T}66` }}
                onFocus={e => e.target.style.borderColor = T}
                onBlur={e => e.target.style.borderColor = `${T}66`}
              />
            </div>
            <div>
              <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: T, display: "block", marginBottom: 6 }}>
                CPF / CNPJ
              </label>
              <input
                value={cpfCnpj}
                onChange={e => setCpfCnpj(e.target.value)}
                placeholder="000.000.000-00"
                style={{ ...inputStyle, borderColor: `${T}66` }}
                onFocus={e => e.target.style.borderColor = T}
                onBlur={e => e.target.style.borderColor = `${T}66`}
              />
            </div>
            <div>
              <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: T, display: "block", marginBottom: 6 }}>
                {isParceiro ? "Nome da empresa / Razão Social / Nome completo" : "Nome completo / Razão Social"}
              </label>
              <input
                value={razaoSocial}
                onChange={e => setRazaoSocial(e.target.value)}
                placeholder={isParceiro ? "Razão social da empresa" : "Seu nome completo"}
                style={{ ...inputStyle, borderColor: `${T}66` }}
                onFocus={e => e.target.style.borderColor = T}
                onBlur={e => e.target.style.borderColor = `${T}66`}
              />
            </div>
            <div>
              <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: T, display: "block", marginBottom: 6 }}>
                Endereço
              </label>
              <input
                value={endereco}
                onChange={e => setEndereco(e.target.value)}
                placeholder="Rua, número, bairro"
                style={{ ...inputStyle, borderColor: `${T}66` }}
                onFocus={e => e.target.style.borderColor = T}
                onBlur={e => e.target.style.borderColor = `${T}66`}
              />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 2 }}>
                <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: T, display: "block", marginBottom: 6 }}>
                  Município
                </label>
                <input
                  value={municipio}
                  onChange={e => setMunicipio(e.target.value)}
                  placeholder="Cidade"
                  style={{ ...inputStyle, borderColor: `${T}66` }}
                  onFocus={e => e.target.style.borderColor = T}
                  onBlur={e => e.target.style.borderColor = `${T}66`}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: T, display: "block", marginBottom: 6 }}>
                  UF
                </label>
                <input
                  value={uf}
                  onChange={e => setUf(e.target.value.toUpperCase().slice(0, 2))}
                  placeholder="MG"
                  maxLength={2}
                  style={{ ...inputStyle, borderColor: `${T}66` }}
                  onFocus={e => e.target.style.borderColor = T}
                  onBlur={e => e.target.style.borderColor = `${T}66`}
                />
              </div>
            </div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#6b5c85" }}>
              Tipo de conta: <span style={{ color: K }}>{user.role === "admin" ? "Administrador" : user.role === "parceiro" ? "Parceiro" : "Cliente"}</span>
            </div>
            <button
              onClick={salvarDados}
              style={{
                fontFamily: "'Press Start 2P', monospace", fontSize: 9,
                padding: "12px 24px", letterSpacing: 2,
                color: "#1c1030", background: T, border: `2px solid ${T}`,
                cursor: "pointer", boxShadow: `4px 4px 0 ${T}44`,
                transition: "all 0.2s", alignSelf: "flex-start",
              }}
            >
              SALVAR DADOS
            </button>
          </div>
        </div>

        {/* Senha e Segurança */}
        <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: K, margin: "0 0 16px", letterSpacing: 1 }}>
            SENHA E SEGURANÇA
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: K, display: "block", marginBottom: 6 }}>
                Senha atual
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showSenhaAtual ? "text" : "password"}
                  value={senhaAtual}
                  onChange={e => setSenhaAtual(e.target.value)}
                  placeholder="••••••••"
                  style={{ ...inputStyle, borderColor: `${K}66`, paddingRight: 44 }}
                  onFocus={e => e.target.style.borderColor = K}
                  onBlur={e => e.target.style.borderColor = `${K}66`}
                />
                <button
                  type="button"
                  onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                  style={{
                    position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                    background: "transparent", border: "none", cursor: "pointer",
                    fontFamily: "'VT323', monospace", fontSize: 16, color: "#8878a8", padding: "4px 6px",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = K}
                  onMouseLeave={e => e.currentTarget.style.color = "#8878a8"}
                >
                  {showSenhaAtual ? "OCULTAR" : "VER"}
                </button>
              </div>
            </div>
            <div>
              <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: K, display: "block", marginBottom: 6 }}>
                Nova senha
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showNovaSenha ? "text" : "password"}
                  value={novaSenha}
                  onChange={e => setNovaSenha(e.target.value)}
                  placeholder="••••••••"
                  style={{ ...inputStyle, borderColor: `${K}66`, paddingRight: 44 }}
                  onFocus={e => e.target.style.borderColor = K}
                  onBlur={e => e.target.style.borderColor = `${K}66`}
                />
                <button
                  type="button"
                  onClick={() => setShowNovaSenha(!showNovaSenha)}
                  style={{
                    position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                    background: "transparent", border: "none", cursor: "pointer",
                    fontFamily: "'VT323', monospace", fontSize: 16, color: "#8878a8", padding: "4px 6px",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = K}
                  onMouseLeave={e => e.currentTarget.style.color = "#8878a8"}
                >
                  {showNovaSenha ? "OCULTAR" : "VER"}
                </button>
              </div>
            </div>
            <div>
              <label style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: K, display: "block", marginBottom: 6 }}>
                Confirmar nova senha
              </label>
              <input
                type="password"
                value={confirmSenha}
                onChange={e => setConfirmSenha(e.target.value)}
                placeholder="••••••••"
                style={{ ...inputStyle, borderColor: `${K}66` }}
                onFocus={e => e.target.style.borderColor = K}
                onBlur={e => e.target.style.borderColor = `${K}66`}
              />
            </div>
            <button
              onClick={mudarSenha}
              style={{
                fontFamily: "'Press Start 2P', monospace", fontSize: 9,
                padding: "12px 24px", letterSpacing: 2,
                color: "#1c1030", background: K, border: `2px solid ${K}`,
                cursor: "pointer", boxShadow: `4px 4px 0 ${K}44`,
                transition: "all 0.2s", alignSelf: "flex-start",
              }}
            >
              ALTERAR SENHA
            </button>
          </div>
        </div>

        {/* Cancelar conta */}
        {!isAdmin && (
          <div className="pixel-box" style={{ background: "rgba(10,8,20,0.95)", padding: "24px 20px", marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "#ff6060", margin: "0 0 12px", letterSpacing: 1 }}>
              CANCELAR MINHA CONTA
            </h3>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: "#8878a8", margin: "0 0 16px" }}>
              Ao cancelar sua conta, todos os seus dados serão excluídos permanentemente. Esta ação não pode ser desfeita.
            </p>

            {!showCancelar ? (
              <button
                onClick={() => setShowCancelar(true)}
                style={{
                  fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                  padding: "10px 20px", letterSpacing: 1,
                  color: "#ff6060", background: "transparent",
                  border: "2px solid #ff606066",
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                CANCELAR MINHA CONTA
              </button>
            ) : (
              <div style={{ padding: "16px", background: "rgba(255,96,96,0.05)", border: "1px solid #ff606033" }}>
                <p style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: "#ff6060", margin: "0 0 12px" }}>
                  Digite <strong>CANCELAR</strong> para confirmar a exclusão da sua conta:
                </p>
                <input
                  value={confirmCancelar}
                  onChange={e => setConfirmCancelar(e.target.value)}
                  placeholder="Digite CANCELAR"
                  style={{ ...inputStyle, borderColor: "#ff606066", marginBottom: 12 }}
                  onFocus={e => e.target.style.borderColor = "#ff6060"}
                  onBlur={e => e.target.style.borderColor = "#ff606066"}
                />
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => { setShowCancelar(false); setConfirmCancelar(""); }}
                    style={{
                      fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                      padding: "10px 16px", letterSpacing: 1,
                      color: "#8878a8", background: "transparent",
                      border: "2px solid #4a3070",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    VOLTAR
                  </button>
                  <button
                    onClick={cancelarConta}
                    disabled={confirmCancelar !== "CANCELAR"}
                    style={{
                      fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                      padding: "10px 20px", letterSpacing: 1,
                      color: confirmCancelar === "CANCELAR" ? "#fff" : "#ff606066",
                      background: confirmCancelar === "CANCELAR" ? "#ff6060" : "transparent",
                      border: "2px solid #ff6060",
                      cursor: confirmCancelar === "CANCELAR" ? "pointer" : "not-allowed",
                      opacity: confirmCancelar === "CANCELAR" ? 1 : 0.5,
                      transition: "all 0.2s",
                    }}
                  >
                    EXCLUIR CONTA PERMANENTEMENTE
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => router.push(backPath)}
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

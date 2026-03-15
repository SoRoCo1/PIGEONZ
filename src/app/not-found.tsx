export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#5a4080",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
    }}>
      <h1 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 24, color: "#f0a0d0" }}>404</h1>
      <p style={{ fontFamily: "'VT323', monospace", fontSize: 22, color: "#fce8f8" }}>Página não encontrada.</p>
      <a href="/" style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#48c0b8" }}>← Voltar ao site</a>
    </div>
  );
}

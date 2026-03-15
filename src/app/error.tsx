"use client";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#1a0e38",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      gap: 16,
    }}>
      <h1 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 18, color: "#ff6060" }}>
        ERRO
      </h1>
      <div style={{
        background: "rgba(255,96,96,0.1)",
        border: "2px solid #ff6060",
        padding: 20,
        maxWidth: 600,
        width: "100%",
        wordBreak: "break-all",
      }}>
        <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#ff6060", margin: "0 0 8px" }}>
          {error.message}
        </p>
        <pre style={{ fontFamily: "'VT323', monospace", fontSize: 14, color: "#8878a8", margin: 0, whiteSpace: "pre-wrap", maxHeight: 300, overflow: "auto" }}>
          {error.stack}
        </pre>
      </div>
      <button
        onClick={reset}
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 10,
          padding: "12px 24px",
          color: "#1c1030",
          background: "#48c0b8",
          border: "2px solid #48c0b8",
          cursor: "pointer",
        }}
      >
        TENTAR NOVAMENTE
      </button>
    </div>
  );
}

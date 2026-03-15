"use client";
import { useEffect, useState } from "react";
import Rooftop from "./Rooftop";
import AmbientPigeon from "./AmbientPigeon";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Hero() {
  const { lang, t } = useLanguage();
  const [typed, setTyped] = useState("");
  const [done, setDone]   = useState(false);

  useEffect(() => {
    const full = t.hero.typed;
    let timeout: ReturnType<typeof setTimeout>;
    let mounted = true;
    setTyped("");
    setDone(false);

    function typeForward(i: number) {
      if (!mounted) return;
      if (i > full.length) {
        setDone(true);
        timeout = setTimeout(() => deleteBack(full.length), 1800);
        return;
      }
      setTyped(full.slice(0, i));
      timeout = setTimeout(() => typeForward(i + 1), 95);
    }

    function deleteBack(i: number) {
      if (!mounted) return;
      if (i < 0) { timeout = setTimeout(() => typeForward(0), 500); return; }
      setTyped(full.slice(0, i));
      timeout = setTimeout(() => deleteBack(i - 1), 55);
    }

    typeForward(0);
    return () => { mounted = false; clearTimeout(timeout); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const shown = {
    transition: "opacity 0.5s ease, transform 0.5s ease",
    opacity: done ? 1 : 0,
    transform: done ? "none" : "translateY(16px)",
  };

  return (
    <section
      id="home"
      style={{
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #6a4898 0%, #5a4080 55%, rgba(75,45,105,0.18) 88%, transparent 100%)",
      }}
    >
      <AmbientPigeon />
      <Rooftop />

      <div
        style={{
          position: "relative",
          zIndex: 5,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          padding: "0 48px",
          paddingTop: 72,
          maxWidth: 1200,
          width: "100%",
        }}
        className="hero-layout"
      >
        {/* LEFT — text (all static once appeared) */}
        <div className="hero-text" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>

          {/* Badge */}
          <div
            className="hero-badge"
            style={{
              ...shown,
              transitionDelay: "0.1s",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(58,40,88,0.85)",
              border: "2px solid rgba(240,160,208,0.5)",
              backdropFilter: "blur(4px)",
              padding: "7px 18px",
              fontFamily: "'VT323', monospace",
              fontSize: 18,
              color: "#c4b0e8",
              letterSpacing: 3,
            }}
          >
            <span style={{
              width: 8, height: 8, background: "#48c0b8", display: "inline-block",
              animation: "blink 1.5s infinite",
            }} />
            {t.hero.badge}
          </div>

          {/* Headline */}
          <div>
            <h1 style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "clamp(24px, 3vw, 42px)",
              lineHeight: 1.5,
              color: "#f0ebfa",
              margin: 0,
              textShadow: "0 0 20px rgba(240,160,208,0.8), 0 4px 16px rgba(0,0,0,0.6)",
            }}>
              {typed}
              <span style={{
                display: "inline-block", width: 6, height: "0.85em",
                background: "#f0a0d0", marginLeft: 6, verticalAlign: "middle",
                animation: "blink 0.75s step-start infinite",
                boxShadow: "0 0 8px #f0a0d0",
              }} />
            </h1>

            <h2
              style={{
                ...shown,
                transitionDelay: "0.25s",
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "clamp(11px, 1.6vw, 20px)",
                color: "#48c0b8",
                margin: "16px 0 0",
                lineHeight: 1.8,
                textShadow: "0 0 12px rgba(72,192,184,0.7), 0 3px 10px rgba(0,0,0,0.5)",
              }}
            >
              {t.hero.subHeadline}
            </h2>
          </div>

          {/* Subtitle */}
          <p
            style={{
              ...shown,
              transitionDelay: "0.4s",
              fontFamily: "'VT323', monospace",
              fontSize: "clamp(18px, 1.8vw, 24px)",
              color: "#d4cce8",
              maxWidth: 500,
              marginTop: 48,
              marginBottom: 0,
              lineHeight: 1.6,
              textShadow: "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 2px 8px rgba(0,0,0,0.7)",
            }}
          >
            {t.hero.subtitle}{" "}
            <span style={{ color: "#fbbf24", textShadow: "0 0 8px #fbbf2488" }}>{t.hero.subtitleHighlight}</span>.
          </p>

          {/* CTA — static links, no motion effects */}
          <div
            className="hero-cta"
            style={{
              ...shown,
              transitionDelay: "0.6s",
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <a
              href="#pricing"
              className="btn btn-p"
              style={{ width: 200, textAlign: "center", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 16px" }}
            >
              {t.hero.ctaPricing}
            </a>
            <a
              href="#contact"
              className="btn btn-p"
              style={{ width: 200, textAlign: "center", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 16px" }}
            >
              {t.hero.ctaContact}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

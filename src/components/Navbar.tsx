"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lang } from "@/lib/translations";

const LANGS: { code: Lang; label: string }[] = [
  { code: "pt", label: "PT" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "zh", label: "ZH" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = [
    { label: t.nav.services,   href: "#services" },
    { label: t.nav.howItWorks, href: "#how" },
    { label: t.nav.pricing,    href: "#pricing" },
    { label: t.nav.templates,   href: "#templates" },
    { label: t.nav.contact,    href: "#contact" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(68,38,108,0.72)" : "rgba(60,32,96,0.35)",
      backdropFilter: "blur(10px)",
      borderBottom: `2px solid ${scrolled ? "rgba(180,120,240,0.35)" : "rgba(150,90,210,0.2)"}`,
      transition: "all 0.3s",
      padding: "14px 40px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      {/* Logo */}
      <a href="#home" className="a-float" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 4, filter: "drop-shadow(0 0 12px rgba(255,80,192,0.5)) drop-shadow(0 0 28px rgba(72,232,208,0.3))" }}>
        {/* Pixel top hat — s=5 */}
        <svg width={52} height={24} style={{ imageRendering: "pixelated", shapeRendering: "crispEdges", marginRight: -2 }}>
          <rect x={20} y={0}  width={20} height={5} fill="#100818" />
          <rect x={15} y={5}  width={30} height={5} fill="#100818" />
          <rect x={15} y={10} width={5}  height={5} fill="#06020c" />
          <rect x={20} y={10} width={20} height={5} fill="#f0eef8" />
          <rect x={40} y={10} width={5}  height={5} fill="#06020c" />
          <rect x={5}  y={15} width={45} height={7} fill="#06020c" />
        </svg>
        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 13, letterSpacing: 1 }}>
          <span style={{ color: "#ff50c0", textShadow: "0 0 16px #ff40b8, 0 0 36px #cc0090aa, 0 0 64px rgba(180,0,120,0.3)" }}>pigeonz</span>
          <span style={{ color: "#48e8d0", textShadow: "0 0 16px #30c8b0, 0 0 36px rgba(0,180,150,0.5)" }}>.ai</span>
        </span>
      </a>

      {/* Desktop links + lang selector */}
      <div className="hidden md:flex" style={{ gap: 36, alignItems: "center" }}>
        {navLinks.map(item => (
          <motion.a
            key={item.href}
            href={item.href}
            initial="rest"
            whileHover="hover"
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: 18,
              color: "#b8a8d8",
              textDecoration: "none",
              letterSpacing: 1,
              position: "relative",
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <motion.span
              variants={{
                rest:  { color: "#b8a8d8", textShadow: "none" },
                hover: { color: "#f0a0d0", textShadow: "0 0 10px rgba(240,160,208,0.7)" },
              }}
              transition={{ duration: 0.18 }}
            >
              {item.label}
            </motion.span>
            <motion.span
              variants={{
                rest:  { scaleX: 0, opacity: 0 },
                hover: { scaleX: 1, opacity: 1 },
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                display: "block",
                height: 2,
                width: "100%",
                background: "#f0a0d0",
                boxShadow: "0 0 6px #f0a0d0aa",
                transformOrigin: "left",
                marginTop: 2,
              }}
            />
          </motion.a>
        ))}

        {/* Language selector */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: 18,
                padding: "3px 8px",
                cursor: "pointer",
                background: lang === code ? "rgba(240,160,208,0.15)" : "transparent",
                border: lang === code ? "1px solid #f0a0d0" : "1px solid transparent",
                color: lang === code ? "#f0a0d0" : "#b8a8d8",
                transition: "all 0.15s",
                lineHeight: 1,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Login button */}
        <a
          href="/login"
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: 16,
            padding: "4px 12px",
            textDecoration: "none",
            color: "#f0a0d0",
            border: "1px solid #f0a0d0",
            transition: "all 0.2s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(240,160,208,0.15)"; e.currentTarget.style.boxShadow = "0 0 10px rgba(240,160,208,0.3)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}
        >
          Login
        </a>

      </div>

      {/* Mobile toggle */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden" style={{
        background: "none", border: "2px solid #6040a0",
        color: "#f0a0d0", padding: "6px 10px", cursor: "pointer",
        fontFamily: "'Press Start 2P', monospace", fontSize: 10,
      }}>
        {menuOpen ? "✕" : "☰"}
      </button>

      {menuOpen && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "rgba(16,10,32,0.98)",
          borderBottom: "2px solid rgba(96,64,160,0.5)",
          padding: "28px 32px",
          display: "flex", flexDirection: "column", gap: 20,
        }}>
          {navLinks.map(item => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{
              fontFamily: "'VT323', monospace", fontSize: 22,
              color: "#b8a8d8", textDecoration: "none",
            }}>
              {">"} {item.label}
            </a>
          ))}

          {/* Mobile login */}
          <a
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="btn btn-p"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              padding: "14px 20px",
              textDecoration: "none",
              textAlign: "center",
              letterSpacing: 1,
            }}
          >
            Login
          </a>

          {/* Mobile language selector */}
          <div style={{ display: "flex", gap: 8, paddingTop: 8, borderTop: "1px solid rgba(96,64,160,0.3)" }}>
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => { setLang(code); setMenuOpen(false); }}
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: 18,
                  padding: "4px 10px",
                  cursor: "pointer",
                  background: lang === code ? "rgba(240,160,208,0.15)" : "transparent",
                  border: lang === code ? "1px solid #f0a0d0" : "1px solid rgba(96,64,160,0.4)",
                  color: lang === code ? "#f0a0d0" : "#b8a8d8",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

/* ── Pixel art Teubaldo (pigeon) — simplified silhouette ── */
function TeubaldoSVG({ size = 80 }: { size?: number }) {
  const s = size / 16;
  const _ = null;
  const B = "#3a2860";  // body dark
  const Bl = "#604878"; // body light
  const W = "#f0eef8";  // white
  const G = "#28a848";  // green iris
  const Bk = "#1a0e2e"; // beak/eye
  const P = "#c83890";  // pink chest
  const F = "#e06848";  // feet

  const grid: (string | null)[][] = [
    [_,_,_,_,_,B,B,B,B,_,_,_,_,_,_,_],
    [_,_,_,_,B,Bl,Bl,Bl,B,_,_,_,_,_,_,_],
    [_,_,_,B,Bl,W,Bk,Bl,Bl,B,_,_,_,_,_,_],
    [_,_,_,B,Bl,G,Bk,Bl,Bl,B,Bk,Bk,_,_,_,_],
    [_,_,_,B,Bl,Bl,Bl,Bl,B,_,_,_,_,_,_,_],
    [_,_,_,_,B,B,P,P,B,_,_,_,_,_,_,_],
    [_,_,_,B,P,P,P,P,P,B,_,_,_,_,_,_],
    [_,_,B,Bl,P,P,P,P,P,Bl,B,_,_,_,_,_],
    [_,B,Bl,Bl,B,B,B,B,Bl,Bl,B,_,_,_,_,_],
    [_,B,Bl,B,Bl,Bl,Bl,Bl,B,Bl,B,_,_,_,_,_],
    [_,B,B,Bl,Bl,Bl,Bl,Bl,Bl,B,B,_,_,_,_,_],
    [_,_,B,B,Bl,Bl,Bl,Bl,B,B,_,_,_,_,_,_],
    [_,_,_,B,B,B,B,B,B,_,_,_,_,_,_,_],
    [_,_,_,_,F,_,_,_,F,_,_,_,_,_,_,_],
    [_,_,_,F,F,F,_,F,F,F,_,_,_,_,_,_],
  ];

  return (
    <svg width={16 * s} height={15 * s} viewBox={`0 0 ${16 * s} ${15 * s}`} shapeRendering="crispEdges" style={{ imageRendering: "pixelated" }}>
      {grid.map((row, ri) =>
        row.map((c, ci) => c ? <rect key={`${ri}-${ci}`} x={ci * s} y={ri * s} width={s} height={s} fill={c} /> : null)
      )}
    </svg>
  );
}

export default function AboutDev() {
  const { t, lang } = useLanguage();
  return (
    <section
      id="about-dev"
      style={{
        padding: "60px 24px 50px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: 800, margin: "0 auto" }}
      >
        {/* Title */}
        <h2
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(12px, 2vw, 18px)",
            color: "#f0a0d0",
            textShadow: "0 0 20px rgba(240,160,208,0.4)",
            textAlign: "center",
            marginBottom: 36,
          }}
        >
          {t.aboutDev.title}
        </h2>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{
            background: "rgba(10,5,28,0.75)",
            border: "2px solid rgba(240,160,208,0.25)",
            borderRadius: 8,
            padding: "36px 32px",
            backdropFilter: "blur(12px)",
            display: "flex",
            gap: 32,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* Left column: Photo + Teubaldo vertical */}
          <div
            style={{
              flex: "0 0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* Sarah photo */}
            <div
              style={{
                width: 180,
                height: 220,
                borderRadius: 6,
                border: "2px solid rgba(72,192,184,0.4)",
                background: "linear-gradient(135deg, rgba(90,64,128,0.6), rgba(30,14,56,0.8))",
                overflow: "hidden",
                boxShadow: "0 0 20px rgba(240,160,208,0.15)",
              }}
            >
              <img
                src="/sarah.png"
                alt="Sarah Santiago"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 20%",
                  transform: "scale(1.3)",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: 16,
                color: "#48c0b8",
                letterSpacing: 1,
              }}
            >
              Sarah Santiago
            </span>
          </div>

          {/* Right column: Bio + Skills */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <p
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: 20,
                color: "#fce8f8",
                lineHeight: 1.6,
                marginBottom: 16,
              }}
            >
              {t.aboutDev.bio1}{" "}
              <span style={{ color: "#f0a0d0" }}>{t.aboutDev.bio1Psychology}</span> {lang === "pt" ? "e em" : lang === "es" ? "y en" : lang === "zh" ? "和" : "and"}{" "}
              <span style={{ color: "#48c0b8" }}>{t.aboutDev.bio1CompSci}</span>.
              {" "}{t.aboutDev.bio3post}
            </p>

            <p
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: 20,
                color: "#fce8f8",
                lineHeight: 1.6,
                marginBottom: 16,
              }}
            >
              {t.aboutDev.bio2}
            </p>

            <p
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: 20,
                color: "#fce8f8",
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              {lang === "pt" ? "O nome" : lang === "es" ? "El nombre" : lang === "zh" ? "名字" : "The name"}{" "}
              <span style={{ color: "#f0a0d0", fontWeight: 700 }}>pigeonz</span>
              <span style={{ color: "#48c0b8", fontWeight: 700 }}>.ai</span>{" "}
              {t.aboutDev.bio3pre}{" "}
              <span style={{ color: "#f0a0d0" }}>Teubaldo</span>, {t.aboutDev.bio3mid}
            </p>

            {/* Skills tags */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {[
                "Next.js",
                "React",
                "Django",
                "TypeScript",
                "PostgreSQL",
                "Google Cloud",
                "Pixel Art",
                "UX Design",
              ].map((skill) => (
                <span
                  key={skill}
                  style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: 15,
                    color: "#48c0b8",
                    background: "rgba(72,192,184,0.1)",
                    border: "1px solid rgba(72,192,184,0.25)",
                    padding: "4px 12px",
                    borderRadius: 4,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Teubaldo — horizontal, outside the card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginTop: 24,
            padding: "18px 24px",
            background: "rgba(72,192,184,0.06)",
            border: "1px solid rgba(72,192,184,0.2)",
            borderRadius: 8,
          }}
        >
          {/* Video circle */}
          <div
            style={{
              flexShrink: 0,
              width: 100,
              height: 100,
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid rgba(72,192,184,0.45)",
              boxShadow: "0 0 24px rgba(72,192,184,0.25), 0 0 48px rgba(240,160,208,0.1)",
            }}
          >
            <video
              src="/teubaldo.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Pixel art + text */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
            <TeubaldoSVG size={56} />
            <div>
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 12,
                  color: "#48c0b8",
                  marginBottom: 6,
                }}
              >
                Teubaldo
              </div>
              <div
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: 18,
                  color: "#a090b8",
                  lineHeight: 1.5,
                }}
              >
                {t.aboutDev.teubaldoDesc}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

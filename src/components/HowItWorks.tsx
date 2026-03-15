"use client";
import { useState, useEffect, useRef } from "react";
import { PixelIcon, ICONS, type IconGrid } from "./PixelIcon";
import { PigeonSVG } from "./Pigeon";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

// 2-colour palette only
const T = "#48c0b8";
const K = "#f0a0d0";

/* ── Teubaldo — walk 4 steps forward with head bob (resets every time user scrolls back) ── */
function AnimatedTeubaldo() {
  const [step, setStep] = useState(0); // 0=parado, 1-4=passos
  const [bobbing, setBobbing] = useState(false);
  const [lookingDown, setLookingDown] = useState(false);
  const [blinkCount, setBlinkCount] = useState(0); // 0=aberto, positivo=fechado
  const [spark, setSpark] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [wingsOpen, setWingsOpen] = useState(false);
  const [flyAway, setFlyAway] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const running = useRef(false);
  const wasVisible = useRef(false);

  const startAnimation = () => {
    // Reset tudo
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStep(0);
    setBobbing(false);
    setLookingDown(false);
    setBlinkCount(0);
    setSpark(false);
    setFlipped(false);
    setWingsOpen(false);
    setFlyAway(false);
    running.current = true;

    const stepTime = 650;
    // 4 passos
    for (let i = 1; i <= 4; i++) {
      timers.current.push(setTimeout(() => setBobbing(true), (i - 1) * stepTime));
      timers.current.push(setTimeout(() => { setStep(i); setBobbing(false); }, (i - 1) * stepTime + 300));
    }
    // Olha pra baixo
    const afterWalk = 4 * stepTime + 300;
    timers.current.push(setTimeout(() => setLookingDown(true), afterWalk));
    // Pisca 3 vezes olhando pra baixo
    const blinkStart = afterWalk + 600;
    for (let b = 0; b < 3; b++) {
      timers.current.push(setTimeout(() => setBlinkCount(b + 1), blinkStart + b * 500));
      timers.current.push(setTimeout(() => setBlinkCount(-(b + 1)), blinkStart + b * 500 + 250));
    }
    // Volta pra posição reta
    const upTime = blinkStart + 1700;
    timers.current.push(setTimeout(() => { setLookingDown(false); setBlinkCount(0); }, upTime));
    // Ereto: fecha olho com cílios + faísca
    timers.current.push(setTimeout(() => { setBlinkCount(99); setSpark(true); }, upTime + 600));
    // Abre olho, apaga faísca
    timers.current.push(setTimeout(() => { setSpark(false); setBlinkCount(0); }, upTime + 2600));
    // Vira pro outro lado
    timers.current.push(setTimeout(() => setFlipped(true), upTime + 3200));
    // Abre as asas
    timers.current.push(setTimeout(() => setWingsOpen(true), upTime + 3800));
    // Voa pra fora na diagonal (pra cima e pro lado)
    timers.current.push(setTimeout(() => setFlyAway(true), upTime + 4600));
    // Reinicia o loop
    timers.current.push(setTimeout(() => startAnimation(), upTime + 6800));
  };

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running.current) {
        startAnimation();
      }
      if (!e.isIntersecting) {
        timers.current.forEach(clearTimeout);
        timers.current = [];
        running.current = false;
      }
    }, { threshold: 0.1 });
    obs.observe(ref.current);
    return () => { obs.disconnect(); timers.current.forEach(clearTimeout); };
  }, []);

  const feet = step === 0 ? 'neutral' : (step % 2 === 1 ? 'right' : 'left') as 'neutral'|'right'|'left';
  const walkOffset = step * 20;
  // Bob durante caminhada / olhar pra baixo
  const bodyTransform = lookingDown
    ? 'rotate(-40deg) translateY(14px)'
    : bobbing ? 'translateY(3px) rotate(8deg)' : 'translateY(0) rotate(0deg)';
  const eyeClosed = blinkCount > 0; // positivo = fechado

  return (
    <>
    {/* Ref invisível dentro do code box pra trigger do observer */}
    <div ref={ref} style={{ position: "absolute", top: 10, right: 40, width: 1, height: 1 }} />
    <div
      style={{
        position: "absolute",
        bottom: "100%",
        marginBottom: -6,
        right: 40 + walkOffset,
        filter: "drop-shadow(0 4px 16px rgba(18,10,30,0.7))",
        zIndex: 10,
        transform: flyAway
          ? "scaleX(-1) translate(-500px, -400px)"
          : flipped ? "scaleX(-1)" : "scaleX(1)",
        transition: flyAway
          ? "transform 2s ease-in"
          : "right 0.3s ease-in-out, transform 0.4s ease-in-out",
      }}
    >
      <div
        style={{
          transform: bodyTransform,
          transition: "transform 0.4s ease-in-out",
          transformOrigin: "50% 100%",
          position: "relative",
        }}
      >
        <PigeonSVG s={5} feet={feet} />
        {/* Eyelid overlay — cobre o olho quando pisca */}
        {eyeClosed && (
          <div style={{
            position: "absolute",
            top: 33,
            left: 20,
            width: 22,
            height: 22,
            pointerEvents: "none",
          }}>
            {/* Pálpebra */}
            <div style={{
              width: "100%",
              height: "100%",
              background: "#7c6e8c",
              borderRadius: "50%",
            }} />
            {/* Cílios pixel art — 3 cílios pretos juntos */}
            <svg width={18} height={10} style={{ position: "absolute", bottom: -5, left: 2, imageRendering: "pixelated", shapeRendering: "crispEdges" }}>
              <rect x={0}  y={0} width={3} height={10} fill="#0c0808" />
              <rect x={7}  y={0} width={3} height={10} fill="#0c0808" />
              <rect x={14} y={0} width={3} height={10} fill="#0c0808" />
            </svg>
          </div>
        )}

        {/* Faísca na cabeça */}
        {spark && (
          <div style={{
            position: "absolute",
            top: -8,
            left: 10,
            pointerEvents: "none",
          }}>
            <svg width={36} height={36} style={{ overflow: "visible" }}>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const x1 = 18 + Math.cos(rad) * 5;
                const y1 = 18 + Math.sin(rad) * 5;
                const x2 = 18 + Math.cos(rad) * 13;
                const y2 = 18 + Math.sin(rad) * 13;
                return (
                  <line
                    key={i}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="#f0e070"
                    strokeWidth={2}
                    strokeLinecap="round"
                    style={{ animation: `twinkle 0.5s ease-in-out ${i * 0.06}s infinite` }}
                  />
                );
              })}
              <circle cx={18} cy={18} r={3} fill="#f0e070" style={{ animation: "twinkle 0.4s ease-in-out infinite" }} />
            </svg>
          </div>
        )}

        {/* Asas abertas pixel art */}
        {wingsOpen && (
          <>
            {/* Asa esquerda */}
            <svg
              width={45} height={40}
              style={{
                position: "absolute",
                top: 45,
                left: -35,
                imageRendering: "pixelated",
                shapeRendering: "crispEdges",
                animation: "pigeon-wing-flap 0.35s ease-in-out infinite",
              }}
            >
              <rect x={30} y={8}  width={5} height={5} fill="#887098" />
              <rect x={25} y={4}  width={5} height={5} fill="#9882a8" />
              <rect x={20} y={0}  width={5} height={5} fill="#d0c4dc" />
              <rect x={30} y={13} width={5} height={5} fill="#705880" />
              <rect x={25} y={13} width={5} height={5} fill="#887098" />
              <rect x={20} y={9}  width={5} height={5} fill="#9882a8" />
              <rect x={15} y={5}  width={5} height={5} fill="#d0c4dc" />
              <rect x={10} y={1}  width={5} height={5} fill="#d0c4dc" />
              <rect x={30} y={18} width={5} height={5} fill="#705880" />
              <rect x={25} y={18} width={5} height={5} fill="#887098" />
              <rect x={20} y={18} width={5} height={5} fill="#9882a8" />
              <rect x={15} y={14} width={5} height={5} fill="#9882a8" />
              <rect x={10} y={10} width={5} height={5} fill="#d0c4dc" />
              <rect x={5}  y={6}  width={5} height={5} fill="#d0c4dc" />
              <rect x={0}  y={2}  width={5} height={5} fill="#d0c4dc" />
              <rect x={30} y={23} width={5} height={5} fill="#887098" />
              <rect x={25} y={23} width={5} height={5} fill="#9882a8" />
              <rect x={20} y={23} width={5} height={5} fill="#d0c4dc" />
            </svg>
            {/* Asa direita */}
            <svg
              width={45} height={40}
              style={{
                position: "absolute",
                top: 55,
                right: 5,
                imageRendering: "pixelated",
                shapeRendering: "crispEdges",
                scale: "-1 1",
                animation: "pigeon-wing-flap 0.35s ease-in-out infinite",
              }}
            >
              <rect x={30} y={8}  width={5} height={5} fill="#887098" />
              <rect x={25} y={4}  width={5} height={5} fill="#9882a8" />
              <rect x={20} y={0}  width={5} height={5} fill="#d0c4dc" />
              <rect x={30} y={13} width={5} height={5} fill="#705880" />
              <rect x={25} y={13} width={5} height={5} fill="#887098" />
              <rect x={20} y={9}  width={5} height={5} fill="#9882a8" />
              <rect x={15} y={5}  width={5} height={5} fill="#d0c4dc" />
              <rect x={10} y={1}  width={5} height={5} fill="#d0c4dc" />
              <rect x={30} y={18} width={5} height={5} fill="#705880" />
              <rect x={25} y={18} width={5} height={5} fill="#887098" />
              <rect x={20} y={18} width={5} height={5} fill="#9882a8" />
              <rect x={15} y={14} width={5} height={5} fill="#9882a8" />
              <rect x={10} y={10} width={5} height={5} fill="#d0c4dc" />
              <rect x={5}  y={6}  width={5} height={5} fill="#d0c4dc" />
              <rect x={0}  y={2}  width={5} height={5} fill="#d0c4dc" />
              <rect x={30} y={23} width={5} height={5} fill="#887098" />
              <rect x={25} y={23} width={5} height={5} fill="#9882a8" />
              <rect x={20} y={23} width={5} height={5} fill="#d0c4dc" />
            </svg>
          </>
        )}
      </div>
    </div>
    </>
  );
}

const STEP_ICONS = ['chat', 'clipboard', 'lightning', 'rocket'] as const;
const STEP_COLORS = [T, K, T, K] as const;
const STEP_NUMS   = ["01", "02", "03", "04"] as const;

const BEHIND_COLORS = [K, T, K, T, K, T, K, T, K, T] as const;
const BEHIND_ICONS: (keyof typeof ICONS)[] = [
  'pencil', 'code', 'database', 'link', 'globe', 'server', 'shield', 'scale', 'cyber', 'flask',
];

/* ── Typing animation for last line of code ── */
function TypingLine({ text, color = "#98c379" }: { text: string; color?: string }) {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let i = 0;
          const iv = setInterval(() => {
            i++;
            setDisplayed(text.slice(0, i));
            if (i >= text.length) clearInterval(iv);
          }, 45);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [text]);

  useEffect(() => {
    const iv = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(iv);
  }, []);

  return (
    <div ref={ref} style={{ minHeight: "1.7em" }}>
      <span style={{ color }}>{displayed}</span>
      <span
        style={{
          display: "inline-block",
          width: 8,
          height: 16,
          background: showCursor ? T : "transparent",
          marginLeft: 2,
          verticalAlign: "middle",
          transition: "background 0.1s",
        }}
      />
    </div>
  );
}

/* ── Mini code viewer for card backs ── */
function CodeBack({ lines, color }: { lines: string[]; color: string }) {
  const allButLast = lines.slice(0, -1);
  const lastLine = lines[lines.length - 1] || "";

  return (
    <div
      style={{
        background: "rgba(8,4,20,0.95)",
        borderRadius: 4,
        padding: "14px 16px",
        fontFamily: "'VT323', monospace",
        fontSize: 14,
        lineHeight: 1.6,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* title bar dots */}
      <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
      </div>
      {allButLast.map((line, i) => (
        <div key={i} style={{ color: line.startsWith("//") || line.startsWith("#") || line.startsWith("$") || line.startsWith("PASS") || line.startsWith("Tests") || line.startsWith("Time") || line.includes("\u2713") ? "#5c6370" : color, whiteSpace: "pre", overflow: "hidden", textOverflow: "ellipsis" }}>
          {line || "\u00A0"}
        </div>
      ))}
      <TypingLine text={lastLine} color={color} />
    </div>
  );
}

/* ── Flip card ── */
function FlipCard({
  front,
  back,
  color,
  index,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  color: string;
  index: number;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onClick={() => setFlipped(!flipped)}
      style={{
        perspective: 800,
        cursor: "pointer",
        minHeight: 300,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          minHeight: 300,
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            background: "rgba(15,12,30,0.85)",
            border: `2px solid ${color}44`,
            padding: "24px 22px",
            display: "flex",
            flexDirection: "column",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = `${color}88`;
            e.currentTarget.style.boxShadow = `0 0 24px ${color}44`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = `${color}44`;
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, background: color }} />
          <div style={{ position: "absolute", bottom: -2, left: -2, width: 8, height: 8, background: color }} />
          {front}
          {/* Click hint */}
          <div
            style={{
              marginTop: "auto",
              paddingTop: 12,
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: "#fff",
                background: "linear-gradient(180deg, #e060b0 0%, #c04890 100%)",
                border: "2px solid #f0a0d0",
                padding: "8px 16px",
                letterSpacing: 1,
                boxShadow: "3px 3px 0 rgba(90,30,70,0.5), 0 0 12px rgba(208,88,160,0.3)",
                cursor: "pointer",
              }}
            >
              ▸ CLIQUE AQUI
            </span>
          </div>
        </div>

        {/* Back */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "rgba(10,5,28,0.95)",
            border: `2px solid ${color}66`,
            padding: 0,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: -2, left: -2, width: 8, height: 8, background: color }} />
          <div style={{ position: "absolute", bottom: -2, right: -2, width: 8, height: 8, background: color }} />
          {back}
          <div
            style={{
              position: "absolute",
              bottom: 8,
              right: 12,
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
              color: `${color}aa`,
              letterSpacing: 1,
            }}
          >
            ▸ VOLTAR
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── White text with black outline style ── */
const outlineText = (color: string = "#ffffff"): React.CSSProperties => ({
  fontFamily: "'Press Start 2P', monospace",
  fontSize: 9,
  color: color,
  margin: 0,
  lineHeight: 1.6,
  textShadow: `-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 8px ${color}44`,
});

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = t.how.steps.map((step, i) => ({
    num: STEP_NUMS[i],
    color: STEP_COLORS[i],
    icon: STEP_ICONS[i],
    title: step.title,
    desc: step.desc,
  }));

  const bc = t.behindCode;

  return (
    <section id="how" style={{
      background: "linear-gradient(180deg, #6a4898 0%, #5a4080 55%, rgba(80,55,115,0.25) 80%, transparent 100%)",
      padding: "100px 24px 320px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div style={{ fontFamily: "'VT323', monospace", fontSize: 24, color: "#f0a0d0", letterSpacing: 4, marginBottom: 16 }}>
            {t.how.commentLabel}
          </div>
          <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(16px, 3vw, 28px)", color: "#48c0b8", margin: 0, lineHeight: 1.6 }}>
            {t.how.title}
          </h2>
        </motion.div>

        <div className="pdiv" style={{ marginBottom: 64 }} />

        {/* ── Original 4 steps ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              style={{ display: "flex", gap: 32, alignItems: "flex-start", position: "relative" }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 80 }}>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 28,
                  color: step.color,
                  textShadow: `0 0 16px ${step.color}88`,
                  lineHeight: 1,
                  padding: "16px 0",
                }}>
                  {step.num}
                </div>
                {i < steps.length - 1 && (
                  <div style={{
                    width: 4, flex: 1, minHeight: 60,
                    background: `repeating-linear-gradient(180deg, ${step.color}55 0px, ${step.color}55 8px, transparent 8px, transparent 16px)`,
                  }} />
                )}
              </div>

              <motion.div
                whileHover={{ y: -5, boxShadow: `0 0 28px ${step.color}77, 0 0 56px ${step.color}22` }}
                transition={{ duration: 0.2 }}
                style={{
                  background: "rgba(15,12,30,0.8)",
                  border: `2px solid ${step.color}44`,
                  padding: "24px 28px",
                  marginBottom: 24,
                  flex: 1,
                  position: "relative",
                }}
              >
                <div style={{ position: "absolute", top: -2, left: -2, width: 8, height: 8, background: step.color }} />

                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                  <PixelIcon grid={ICONS[step.icon]} accent={step.color} size={3.2} />
                  <h3 style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 10,
                    color: step.color,
                    margin: 0,
                    lineHeight: 1.6,
                  }}>
                    {step.title}
                  </h3>
                </div>

                <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#a09bb8", margin: 0, lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* ── Behind the Code ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          style={{ marginTop: 80, textAlign: "center" }}
        >
          <h3 style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(11px, 2.2vw, 18px)",
            color: "#f0a0d0",
            textShadow: "0 0 20px rgba(240,160,208,0.4)",
            marginBottom: 16,
            lineHeight: 1.8,
          }}>
            {bc.title}
          </h3>
          <p style={{
            fontFamily: "'VT323', monospace",
            fontSize: 24,
            color: "#fce8f8",
            maxWidth: 700,
            margin: "0 auto 48px",
            lineHeight: 1.5,
            textShadow: "0 0 12px rgba(252,232,248,0.3)",
          }}>
            {bc.subtitle}
          </p>
        </motion.div>

        <div className="pdiv" style={{ marginBottom: 48 }} />

        {/* Code snippet visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          style={{
            background: "rgba(10,5,28,0.9)",
            border: "2px solid rgba(72,192,184,0.3)",
            borderRadius: 8,
            padding: "20px 24px",
            marginBottom: 48,
            fontFamily: "'VT323', monospace",
            fontSize: 16,
            lineHeight: 1.7,
            overflow: "visible",
            position: "relative",
          }}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
            paddingBottom: 12,
            borderBottom: "1px solid rgba(72,192,184,0.15)",
          }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
            <span style={{ color: "#a090b8", marginLeft: 12, fontSize: 14 }}>app/page.tsx — pigeonz.ai</span>
          </div>
          <div>
            <span style={{ color: "#c678dd" }}>import</span> <span style={{ color: "#e5c07b" }}>{"{ NextResponse }"}</span> <span style={{ color: "#c678dd" }}>from</span> <span style={{ color: "#98c379" }}>{'"next/server"'}</span><span style={{ color: "#636d83" }}>;</span>
          </div>
          <div>
            <span style={{ color: "#c678dd" }}>import</span> <span style={{ color: "#e5c07b" }}>{"{ db, paymentProvider, auth }"}</span> <span style={{ color: "#c678dd" }}>from</span> <span style={{ color: "#98c379" }}>{'"@/lib"'}</span><span style={{ color: "#636d83" }}>;</span>
          </div>
          <div style={{ height: 8 }} />
          <div>
            <span style={{ color: "#c678dd" }}>export async function</span> <span style={{ color: "#61afef" }}>POST</span><span style={{ color: "#636d83" }}>(</span><span style={{ color: "#e06c75" }}>req</span><span style={{ color: "#636d83" }}>)</span> <span style={{ color: "#636d83" }}>{"{"}</span>
          </div>
          <div style={{ paddingLeft: 20 }}>
            <span style={{ color: "#c678dd" }}>const</span> <span style={{ color: "#e5c07b" }}>session</span> <span style={{ color: "#636d83" }}>=</span> <span style={{ color: "#c678dd" }}>await</span> <span style={{ color: "#61afef" }}>auth</span><span style={{ color: "#636d83" }}>();</span>
          </div>
          <div style={{ paddingLeft: 20 }}>
            <span style={{ color: "#c678dd" }}>const</span> <span style={{ color: "#e5c07b" }}>payment</span> <span style={{ color: "#636d83" }}>=</span> <span style={{ color: "#c678dd" }}>await</span> <span style={{ color: "#61afef" }}>paymentProvider</span><span style={{ color: "#636d83" }}>.</span><span style={{ color: "#61afef" }}>charges</span><span style={{ color: "#636d83" }}>.</span><span style={{ color: "#61afef" }}>create</span><span style={{ color: "#636d83" }}>({"{"}</span><span style={{ color: "#636d83" }}>...</span><span style={{ color: "#636d83" }}>{"}"});</span>
          </div>
          <div style={{ paddingLeft: 20 }}>
            <span style={{ color: "#c678dd" }}>await</span> <span style={{ color: "#61afef" }}>db</span><span style={{ color: "#636d83" }}>.</span><span style={{ color: "#61afef" }}>orders</span><span style={{ color: "#636d83" }}>.</span><span style={{ color: "#61afef" }}>insert</span><span style={{ color: "#636d83" }}>({"{"}</span> <span style={{ color: "#e06c75" }}>userId</span><span style={{ color: "#636d83" }}>,</span> <span style={{ color: "#e06c75" }}>payment</span> <span style={{ color: "#636d83" }}>{"}"});</span>
          </div>
          <div style={{ paddingLeft: 20 }}>
            <span style={{ color: "#c678dd" }}>return</span> <span style={{ color: "#61afef" }}>NextResponse</span><span style={{ color: "#636d83" }}>.</span><span style={{ color: "#61afef" }}>json</span><span style={{ color: "#636d83" }}>({"{"}</span> <span style={{ color: "#e06c75" }}>ok</span><span style={{ color: "#636d83" }}>:</span> <span style={{ color: "#d19a66" }}>true</span> <span style={{ color: "#636d83" }}>{"}"});</span>
          </div>
          <div><span style={{ color: "#636d83" }}>{"}"}</span></div>
          <div style={{ height: 4 }} />
          <div><span style={{ color: "#5c6370" }}>{"// auth → payment → database → response"}</span></div>
          <TypingLine text="// ...and this is just ONE endpoint." color="#5c6370" />

          {/* Teubaldo animado — sequência completa */}
          <AnimatedTeubaldo />
        </motion.div>

        {/* Steps grid — flip cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          marginBottom: 48,
        }}>
          {bc.steps.map((step, i) => {
            const color = BEHIND_COLORS[i];
            const iconKey = BEHIND_ICONS[i];
            return (
              <FlipCard
                key={i}
                index={i}
                color={color}
                front={
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                      <PixelIcon grid={ICONS[iconKey]} accent={color} size={4} />
                      <h4 style={outlineText()}>
                        {step.title}
                      </h4>
                    </div>
                    <p style={{
                      fontFamily: "'VT323', monospace",
                      fontSize: 18,
                      color: "#a09bb8",
                      margin: 0,
                      lineHeight: 1.5,
                    }}>
                      {step.desc}
                    </p>
                  </>
                }
                back={
                  <CodeBack lines={step.backLines} color={color} />
                }
              />
            );
          })}
        </div>

        {/* Registro.br card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          style={{
            background: "rgba(10,5,28,0.85)",
            border: "2px solid rgba(72,192,184,0.35)",
            borderRadius: 8,
            padding: "32px 28px",
            marginBottom: 48,
            display: "flex",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 250 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <PixelIcon grid={ICONS.globe} accent={T} size={4} />
              <h4 style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "clamp(9px, 1.5vw, 12px)",
                color: T,
                margin: 0,
                lineHeight: 1.8,
              }}>
                {bc.registroBr.title}
              </h4>
            </div>
            <p style={{
              fontFamily: "'VT323', monospace",
              fontSize: 20,
              color: "#a090b8",
              margin: 0,
              lineHeight: 1.5,
            }}>
              {bc.registroBr.desc}
            </p>
          </div>
          <a
            href="https://registro.br/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#ffffff",
              border: "3px solid #48c0b8",
              borderRadius: 4,
              padding: "10px 22px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              boxShadow: "4px 4px 0 #48c0b844",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "4px 7px 0 #48c0b866, 0 0 20px #48c0b844";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "4px 4px 0 #48c0b844";
            }}
          >
            {/* Registro.br logo */}
            <span style={{ display: "inline-flex", alignItems: "baseline", fontFamily: "'Arial Narrow', 'Helvetica Neue', Helvetica, Arial, sans-serif", fontStretch: "condensed", lineHeight: 1 }}>
              <span style={{ fontSize: 22, fontWeight: 300, color: "#8faa58", letterSpacing: "-0.5px" }}>registro</span>
              <span style={{ position: "relative", fontSize: 22, fontWeight: 700, color: "#8faa58", letterSpacing: "-0.5px" }}>
                <span style={{ position: "relative" }}>
                  .
                  <span style={{ position: "absolute", top: "0.12em", left: "0.05em", width: 6, height: 6, borderRadius: "50%", background: "#c8d830", display: "block" }} />
                </span>
                br
              </span>
            </span>
          </a>
        </motion.div>

        {/* Closing message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: "center",
            padding: "28px 20px",
            background: "linear-gradient(135deg, rgba(240,160,208,0.1), rgba(72,192,184,0.08))",
            border: "2px solid rgba(240,160,208,0.3)",
            borderRadius: 8,
          }}
        >
          <p style={{
            fontFamily: "'VT323', monospace",
            fontSize: 24,
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.6,
            maxWidth: 700,
            marginLeft: "auto",
            marginRight: "auto",
            textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 8px rgba(0,0,0,0.5)",
          }}>
            {bc.closing}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

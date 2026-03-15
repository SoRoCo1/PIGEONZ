"use client";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const T = "#48c0b8";
const K = "#f0a0d0";
const s = 3; // pixel size for icons

const pixelIcons = [
  // Cart (loja)
  <svg key="cart" width={s*12} height={s*12} viewBox="0 0 12 12" shapeRendering="crispEdges">
    <rect x={0} y={1} width={2} height={1} fill={T}/>
    <rect x={2} y={2} width={10} height={1} fill={T}/>
    <rect x={3} y={3} width={8} height={4} fill={T}/>
    <rect x={4} y={7} width={6} height={1} fill={T}/>
    <rect x={5} y={8} width={4} height={1} fill={T}/>
    <rect x={4} y={10} width={2} height={2} fill={K}/>
    <rect x={8} y={10} width={2} height={2} fill={K}/>
  </svg>,
  // Phone (app mobile)
  <svg key="phone" width={s*10} height={s*14} viewBox="0 0 10 14" shapeRendering="crispEdges">
    <rect x={1} y={0} width={8} height={1} fill={T}/>
    <rect x={0} y={1} width={1} height={12} fill={T}/>
    <rect x={9} y={1} width={1} height={12} fill={T}/>
    <rect x={1} y={13} width={8} height={1} fill={T}/>
    <rect x={1} y={1} width={8} height={1} fill="#1a0e38"/>
    <rect x={1} y={2} width={8} height={9} fill="#1a0e38"/>
    <rect x={4} y={11} width={2} height={1} fill={K}/>
  </svg>,
  // Globe (site)
  <svg key="globe" width={s*12} height={s*12} viewBox="0 0 12 12" shapeRendering="crispEdges">
    <rect x={3} y={0} width={6} height={1} fill={T}/>
    <rect x={1} y={1} width={2} height={1} fill={T}/><rect x={5} y={1} width={2} height={1} fill={T}/><rect x={9} y={1} width={2} height={1} fill={T}/>
    <rect x={0} y={2} width={1} height={2} fill={T}/><rect x={5} y={2} width={2} height={2} fill={T}/><rect x={11} y={2} width={1} height={2} fill={T}/>
    <rect x={0} y={4} width={12} height={1} fill={K}/>
    <rect x={0} y={5} width={1} height={2} fill={T}/><rect x={5} y={5} width={2} height={2} fill={T}/><rect x={11} y={5} width={1} height={2} fill={T}/>
    <rect x={0} y={7} width={12} height={1} fill={K}/>
    <rect x={0} y={8} width={1} height={2} fill={T}/><rect x={5} y={8} width={2} height={2} fill={T}/><rect x={11} y={8} width={1} height={2} fill={T}/>
    <rect x={1} y={10} width={2} height={1} fill={T}/><rect x={5} y={10} width={2} height={1} fill={T}/><rect x={9} y={10} width={2} height={1} fill={T}/>
    <rect x={3} y={11} width={6} height={1} fill={T}/>
  </svg>,
  // Robot (IA)
  <svg key="robot" width={s*12} height={s*12} viewBox="0 0 12 12" shapeRendering="crispEdges">
    <rect x={5} y={0} width={2} height={1} fill={K}/>
    <rect x={3} y={1} width={6} height={1} fill={T}/>
    <rect x={2} y={2} width={8} height={1} fill={T}/>
    <rect x={2} y={3} width={1} height={3} fill={T}/><rect x={9} y={3} width={1} height={3} fill={T}/>
    <rect x={3} y={3} width={2} height={2} fill={K}/><rect x={7} y={3} width={2} height={2} fill={K}/>
    <rect x={5} y={5} width={2} height={1} fill={K}/>
    <rect x={2} y={6} width={8} height={1} fill={T}/>
    <rect x={0} y={7} width={1} height={2} fill={T}/><rect x={11} y={7} width={1} height={2} fill={T}/>
    <rect x={3} y={7} width={6} height={3} fill={T}/>
    <rect x={3} y={10} width={2} height={2} fill={T}/><rect x={7} y={10} width={2} height={2} fill={T}/>
  </svg>,
  // Chart (painel)
  <svg key="chart" width={s*12} height={s*12} viewBox="0 0 12 12" shapeRendering="crispEdges">
    <rect x={0} y={0} width={1} height={12} fill={T}/>
    <rect x={0} y={11} width={12} height={1} fill={T}/>
    <rect x={2} y={8} width={2} height={3} fill={K}/>
    <rect x={5} y={5} width={2} height={6} fill={T}/>
    <rect x={8} y={2} width={2} height={9} fill={K}/>
    <rect x={3} y={1} width={1} height={1} fill={T}/><rect x={5} y={3} width={1} height={1} fill={T}/><rect x={9} y={0} width={1} height={1} fill={T}/>
  </svg>,
  // Cloud/SaaS (plataforma)
  <svg key="saas" width={s*14} height={s*12} viewBox="0 0 14 12" shapeRendering="crispEdges">
    <rect x={4} y={0} width={4} height={1} fill={T}/>
    <rect x={2} y={1} width={2} height={1} fill={T}/><rect x={8} y={1} width={2} height={1} fill={T}/>
    <rect x={1} y={2} width={1} height={2} fill={T}/><rect x={10} y={2} width={3} height={1} fill={T}/>
    <rect x={0} y={4} width={1} height={2} fill={T}/><rect x={13} y={3} width={1} height={3} fill={T}/>
    <rect x={0} y={6} width={14} height={1} fill={T}/>
    <rect x={2} y={8} width={2} height={3} fill={K}/><rect x={4} y={9} width={1} height={2} fill={K}/>
    <rect x={6} y={8} width={2} height={3} fill={T}/><rect x={8} y={9} width={1} height={2} fill={T}/>
    <rect x={10} y={8} width={2} height={3} fill={K}/>
  </svg>,
];

export default function WhoWeAre() {
  const { t } = useLanguage();
  const { whoWeAre: w } = t;

  return (
    <section
      id="who-we-are"
      style={{
        background: "linear-gradient(180deg, #4a3070 0%, #5a4080 40%, rgba(70,48,105,0.25) 80%, transparent 100%)",
        padding: "100px 24px 320px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none" }} />

      <motion.div
        style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            fontFamily: "'VT323', monospace",
            fontSize: 20,
            color: "#d058a0",
            letterSpacing: 4,
            marginBottom: 16,
          }}>
            {w.commentLabel}
          </div>
          <h2
            className="glow-purple"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "clamp(16px, 3vw, 26px)",
              color: K,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {w.title}
          </h2>
          <p style={{
            fontFamily: "'VT323', monospace",
            fontSize: 22,
            color: "#c8b8e0",
            marginTop: 20,
            maxWidth: 600,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.5,
          }}>
            {w.subtitle}
          </p>
        </div>

        <div className="pixel-divider" style={{ marginBottom: 48 }} />

        {/* Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 24,
        }}>
          {w.items.map((item, i) => (
            <motion.div
              key={i}
              className="pixel-box"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: `0 0 24px rgba(208,88,160,0.3)` }}
              style={{
                background: "rgba(15,12,30,0.8)",
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                cursor: "default",
              }}
            >
              <div style={{ marginBottom: 4 }}>{pixelIcons[i]}</div>
              <h3 style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 11,
                color: T,
                lineHeight: 1.8,
                margin: 0,
              }}>
                {item.title}
              </h3>
              <p style={{
                fontFamily: "'VT323', monospace",
                fontSize: 20,
                color: "#b8a8d8",
                lineHeight: 1.4,
                margin: 0,
              }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Closing */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: 24,
            color: "#ffffff",
            textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 8px rgba(0,0,0,0.5)",
            textAlign: "center",
            marginTop: 48,
            maxWidth: 700,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.5,
          }}
        >
          {w.closing}
        </motion.p>
      </motion.div>
    </section>
  );
}

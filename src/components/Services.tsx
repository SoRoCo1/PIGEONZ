"use client";
import { PixelIcon, ICONS } from "./PixelIcon";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

// ── 2-colour clean palette: teal + pink only ──────────────────────────────────
const T = "#48c0b8";
const K = "#f0a0d0";

const ICON_KEYS = ['screen', 'cart', 'gear', 'robot', 'link', 'cloud', 'shield'] as const;
const ACCENTS   = [T, K, T, K, T, K, T] as const;
const TAGS      = [
  ["Next.js", "React", "Tailwind"],
  ["Pagamentos", "Estoque", "Pedidos"],
  ["Django", "REST API", "PostgreSQL"],
  ["Anthropic", "OpenAI", "Automação"],
  ["REST", "Webhooks", "OAuth2"],
  ["GCP", "Cloud Run", "Firebase"],
  ["OWASP", "HTTPS", "Headers"],
] as const;

type ServiceItem = {
  icon: typeof ICON_KEYS[number];
  accent: string;
  title: string;
  desc: string;
  tags: readonly string[];
};

function Card({ s, i }: { s: ServiceItem; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: i * 0.08, ease: "easeOut" }}
      whileHover={{
        y: -8,
        boxShadow: `0 0 32px ${s.accent}88, 0 0 64px ${s.accent}33, 4px 4px 0 ${s.accent}55`,
        borderColor: `${s.accent}cc`,
        transition: { duration: 0.2 },
      }}
      style={{
        background: "rgba(12,9,28,.88)",
        border: `2px solid ${s.accent}55`,
        padding: "28px 24px",
        display: "flex", flexDirection: "column", gap: 16,
        position: "relative", overflow: "hidden",
        cursor: "default",
        backdropFilter: "blur(4px)",
      }}
    >
      {/* Pixel corner accents */}
      <div style={{ position:"absolute", top:0, right:0, width:8, height:8, background:s.accent }} />
      <div style={{ position:"absolute", bottom:0, left:0, width:8, height:8, background:s.accent }} />

      <PixelIcon grid={ICONS[s.icon]} accent={s.accent} size={2.8} />

      <h3 style={{
        fontFamily:"'Press Start 2P',monospace", fontSize:10,
        color:s.accent, lineHeight:1.7,
      }}>{s.title}</h3>

      <p style={{ fontFamily:"'VT323',monospace", fontSize:20, color:"#a090b8", lineHeight:1.55 }}>
        {s.desc}
      </p>

      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:"auto" }}>
        {s.tags.map(tag => (
          <span key={tag} style={{
            fontFamily:"'VT323',monospace", fontSize:15,
            color:s.accent,
            background:`${s.accent}12`,
            border:`1px solid ${s.accent}44`,
            padding:"2px 8px",
          }}>{tag}</span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Services() {
  const { t } = useLanguage();

  const services: ServiceItem[] = t.services.items.map((item, i) => ({
    icon: ICON_KEYS[i],
    accent: ACCENTS[i],
    title: item.title,
    desc: item.desc,
    tags: TAGS[i],
  }));

  return (
    <section id="services" style={{
      background:"linear-gradient(180deg, #887098 0%, #6a4890 18%, #5a4080 55%, rgba(80,55,110,0.25) 80%, transparent 100%)",
      padding:"100px 24px 320px",
      position:"relative", overflow:"hidden",
    }}>
      <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign:"center", marginBottom:64 }}
        >
          <div style={{ fontFamily:"'VT323',monospace", fontSize:20, color:"#f0a0d0", letterSpacing:4, marginBottom:16 }}>
            {t.services.commentLabel}
          </div>
          <h2 className="pf" style={{ fontSize:"clamp(16px,3vw,28px)", lineHeight:1.6, color:"#48c0b8" }}>
            {t.services.title}
          </h2>
        </motion.div>

        <div className="pdiv" style={{ marginBottom:56 }} />

        <div className="services-grid" style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",
          gap:24,
        }}>
          {services.map((s, i) => <Card key={i} s={s} i={i} />)}
        </div>
      </div>
    </section>
  );
}

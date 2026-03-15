"use client";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

// 2-colour clean palette
const T = "#48c0b8";
const K = "#f0a0d0";

const PLAN_COLORS  = [T, K, K] as const;
const PLAN_HIGHLIGHTS = [false, true, false] as const;

export default function Pricing() {
  const { t } = useLanguage();

  const plans = t.pricing.plans.map((plan, i) => ({
    ...plan,
    color: PLAN_COLORS[i],
    highlight: PLAN_HIGHLIGHTS[i],
  }));

  return (
    <section
      id="pricing"
      style={{
        background: "linear-gradient(180deg, #6a4898 0%, #5a4088 55%, rgba(80,55,120,0.25) 80%, transparent 100%)",
        paddingTop: 40,
        paddingLeft: 60,
        paddingRight: 60,
        paddingBottom: 320,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64, width: "100%" }}
        >
          <div style={{
            fontFamily: "'VT323', monospace",
            fontSize: 28,
            color: "#f0a0d0",
            letterSpacing: 4,
            marginBottom: 12,
          }}>
            {t.pricing.commentLabel}
          </div>
          <h2 style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(20px, 3vw, 32px)",
            color: "#48c0b8",
            margin: "0 0 12px 0",
            lineHeight: 1.4,
          }}>
            {t.pricing.title}
          </h2>
          <p style={{
            fontFamily: "'VT323', monospace",
            fontSize: 26,
            color: "#a090c0",
            margin: 0,
          }}>
            {t.pricing.subtitle}
          </p>
        </motion.div>

        <div className="pdiv" style={{ marginBottom: 160 }} />

        <div className="pricing-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          alignItems: "stretch",
        }}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{ y: -8, boxShadow: `0 0 32px ${plan.color}88, 0 0 64px ${plan.color}33`, borderColor: `${plan.color}cc`, transition: { duration: 0.2 } }}
              style={{
                background: plan.highlight ? "rgba(240,160,208,0.1)" : "rgba(22,14,40,0.85)",
                border: `2px solid ${plan.color}55`,
                padding: "12px 14px",
                position: "relative",
                transform: plan.highlight ? "scale(1.02)" : "scale(1)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div style={{
                  position: "absolute",
                  top: -14, left: "50%",
                  transform: "translateX(-50%)",
                  background: plan.highlight ? K : T,
                  color: plan.highlight ? "#1c1030" : "#0a0a14",
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 9,
                  padding: "6px 12px",
                  border: `2px solid ${plan.color}`,
                  whiteSpace: "nowrap",
                }}>
                  {plan.badge}
                </div>
              )}

              <div style={{
                fontFamily: "'VT323', monospace",
                fontSize: 22,
                color: plan.color,
                letterSpacing: 2,
                marginBottom: 0,
              }}>
                {plan.tag}
              </div>

              <h3 style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 18,
                color: plan.color,
                margin: "0 0 8px 0",
              }}>
                {plan.name}
              </h3>

              <div style={{ marginBottom: 8, paddingBottom: 8, borderBottom: `2px dashed ${plan.color}44` }}>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 14,
                  color: "#fce8f8",
                  marginBottom: 2,
                  lineHeight: 1.4,
                }}>
                  {plan.price}
                </div>
                <div style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: 19,
                  color: plan.color + "99",
                }}>
                  {plan.priceNote}
                </div>
              </div>

              <ul style={{
                listStyle: "none", padding: 0,
                margin: "0 0 8px 0",
                display: "flex", flexDirection: "column", gap: 3,
                flex: 1,
              }}>
                {plan.features.map((f, fi) => (
                  <li key={fi} style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: 19,
                    color: "#c4b9e0",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                  }}>
                    <span style={{ color: plan.color, flexShrink: 0 }}>▸</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="btn btn-p"
                style={{
                  display: "block",
                  textAlign: "center",
                  background: plan.highlight ? plan.color : "transparent",
                  color: plan.highlight ? "#1c1030" : plan.color,
                  borderColor: plan.color,
                  boxShadow: `4px 4px 0 ${plan.color}44`,
                  fontSize: 12,
                  marginTop: "auto",
                }}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

        <div style={{
          textAlign: "center",
          marginTop: 48,
          fontFamily: "'VT323', monospace",
          fontSize: 20,
          color: "#6b5c85",
        }}>
          {t.pricing.footnote}
        </div>
      </div>
    </section>
  );
}

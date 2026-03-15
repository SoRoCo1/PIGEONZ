"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type FormData = {
  name: string;
  email: string;
  whatsapp?: string;
  business?: string;
  message: string;
};

const T = "#48c0b8";
const K = "#f0a0d0";

const inputStyle = {
  width: "100%",
  background: "rgba(8,7,20,0.8)",
  border: "2px solid rgba(208,88,160,0.4)",
  color: "#f0ebfa",
  fontFamily: "'VT323', monospace",
  fontSize: 20,
  padding: "12px 16px",
  outline: "none",
  boxSizing: "border-box" as const,
  transition: "border-color 0.2s",
};

export default function Contact() {
  const { t } = useLanguage();

  const schema = useMemo(() => z.object({
    name:     z.string().min(2, t.contact.errors.nameShort),
    email:    z.string().email(t.contact.errors.emailInvalid),
    whatsapp: z.string().optional(),
    business: z.string().optional(),
    message:  z.string().min(10, t.contact.errors.messageShort),
  }), [t]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("https://formsubmit.co/ajax/sarahsantiago100@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          whatsapp: data.whatsapp || "—",
          business: data.business || "—",
          message: data.message,
          _subject: `Contato pigeonz.ai — ${data.name}`,
          _captcha: "false",
          _template: "table",
        }),
      });
      if (!res.ok) throw new Error("Formspree error");
      toast.success(t.contact.toast.success, {
        duration: 5000,
        style: { fontFamily: "'VT323', monospace", fontSize: 20, background: "#1a0d2e", color: K, border: `2px solid ${K}` },
      });
      reset();
    } catch {
      toast.error(t.contact.toast.error, {
        duration: 5000,
        style: { fontFamily: "'VT323', monospace", fontSize: 20, background: "#1a0d2e", color: "#ff6060", border: "2px solid #ff4040" },
      });
    }
  };

  return (
    <section
      id="contact"
      style={{
        background: "linear-gradient(180deg, #5a4080 0%, #6a4898 55%, rgba(80,58,115,0.25) 80%, transparent 100%)",
        padding: "100px 24px 320px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none" }} />

      <motion.div
        style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            fontFamily: "'VT323', monospace",
            fontSize: 20,
            color: "#d058a0",
            letterSpacing: 4,
            marginBottom: 16,
          }}>
            {t.contact.commentLabel}
          </div>
          <h2
            className="glow-purple"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "clamp(16px, 3vw, 24px)",
              color: K,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {t.contact.title}
          </h2>
          <p style={{
            fontFamily: "'VT323', monospace",
            fontSize: 20,
            color: "#6b5c85",
            marginTop: 16,
          }}>
            {t.contact.subtitle}
          </p>
        </div>

        <div className="pixel-divider" style={{ marginBottom: 48 }} />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="pixel-box"
          style={{
            background: "rgba(15,12,30,0.8)",
            padding: "40px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ fontFamily: "'VT323', monospace", fontSize: 22, color: K, display: "block", marginBottom: 6 }}>
                {t.contact.labels.name}
              </label>
              <input
                {...register("name")}
                placeholder={t.contact.placeholders.name}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = K}
                onBlur={e => e.target.style.borderColor = "rgba(208,88,160,0.4)"}
              />
              {errors.name && (
                <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#ff6060", marginTop: 4 }}>
                  ▸ {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label style={{ fontFamily: "'VT323', monospace", fontSize: 22, color: K, display: "block", marginBottom: 6 }}>
                {t.contact.labels.whatsapp}
              </label>
              <input
                {...register("whatsapp")}
                placeholder={t.contact.placeholders.whatsapp}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = K}
                onBlur={e => e.target.style.borderColor = "rgba(208,88,160,0.4)"}
              />
            </div>
          </div>

          <div>
            <label style={{ fontFamily: "'VT323', monospace", fontSize: 22, color: K, display: "block", marginBottom: 6 }}>
              {t.contact.labels.email}
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder={t.contact.placeholders.email}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = K}
              onBlur={e => e.target.style.borderColor = "rgba(208,88,160,0.4)"}
            />
            {errors.email && (
              <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#ff6060", marginTop: 4 }}>
                ▸ {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label style={{ fontFamily: "'VT323', monospace", fontSize: 22, color: K, display: "block", marginBottom: 6 }}>
              {t.contact.labels.business}
            </label>
            <select
              {...register("business")}
              style={{ ...inputStyle, cursor: "pointer" }}
              onFocus={e => e.target.style.borderColor = K}
              onBlur={e => e.target.style.borderColor = "rgba(208,88,160,0.4)"}
            >
              {t.contact.businessOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontFamily: "'VT323', monospace", fontSize: 22, color: K, display: "block", marginBottom: 6 }}>
              {t.contact.labels.message}
            </label>
            <textarea
              {...register("message")}
              placeholder={t.contact.placeholders.message}
              rows={5}
              style={{ ...inputStyle, resize: "vertical" }}
              onFocus={e => e.target.style.borderColor = K}
              onBlur={e => e.target.style.borderColor = "rgba(208,88,160,0.4)"}
            />
            {errors.message && (
              <p style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#ff6060", marginTop: 4 }}>
                ▸ {errors.message.message}
              </p>
            )}
          </div>

          {/* Security badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: "'VT323', monospace", fontSize: 17,
            color: T, opacity: 0.75,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" style={{ flexShrink: 0 }}>
              <path d="M7 0L0 3v5c0 4.4 3 8.5 7 9.5C11 16.5 14 12.4 14 8V3L7 0z" fill="#48c0b8" opacity={0.25} />
              <path d="M7 0L0 3v5c0 4.4 3 8.5 7 9.5C11 16.5 14 12.4 14 8V3L7 0z" fill="none" stroke="#48c0b8" strokeWidth={1.5} />
              <path d="M4 8l2 2 4-4" stroke="#48c0b8" strokeWidth={1.5} fill="none" strokeLinecap="round" />
            </svg>
            {t.contact.security}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-p"
            style={{
              width: "100%",
              opacity: isSubmitting ? 0.7 : 1,
              fontSize: 14,
              padding: "22px 16px",
              marginTop: 8,
              letterSpacing: 2,
              boxShadow: `0 0 32px rgba(208,88,160,0.4), 6px 6px 0 #8c2068`,
            }}
          >
            {isSubmitting ? t.contact.submitting : t.contact.submit}
          </button>

          {/* Parceria Blue Zone */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            marginTop: 24,
            paddingTop: 20,
            borderTop: "1px solid rgba(72,192,184,0.15)",
          }}>
            <span style={{
              fontFamily: "'VT323', monospace",
              fontSize: 18,
              color: "#a090b8",
              letterSpacing: 1,
            }}>
              Parceria
            </span>
            {/* Blue Zone Logo — imagem com fundo removido via mix-blend-mode */}
            <a
              href="https://bluezone.com.br"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "#ffffff",
                border: "3px solid #40c8a8",
                boxShadow: "5px 5px 0 #40c8a8, 0 0 30px rgba(72,192,184,.6)",
                animation: "float 3s ease-in-out infinite",
                padding: "8px 12px",
                cursor: "pointer",
                transition: "box-shadow 0.15s, transform 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "7px 7px 0 #40c8a8, 0 0 40px rgba(72,192,184,.7)"; e.currentTarget.style.transform = "translate(-1px, -1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "5px 5px 0 #40c8a8, 0 0 30px rgba(72,192,184,.6)"; e.currentTarget.style.transform = "none"; }}
            >
              <img
                src="/bluezone.png"
                alt="BlueZone"
                style={{
                  height: 28,
                  width: "auto",
                  display: "block",
                }}
              />
            </a>
          </div>
        </form>
      </motion.div>
    </section>
  );
}

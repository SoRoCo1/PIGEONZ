// Shared site preview renderer used by assinar/page.tsx and painel/page.tsx
// Renders a full mock browser with all section types
// Each style template produces a genuinely distinct visual treatment

import { PixelIcon, ICONS, type IconGrid } from "@/components/PixelIcon";

/* eslint-disable @typescript-eslint/no-explicit-any */

type SitePreviewProps = {
  content: any;
  slug: string;
  logoPreview?: string | null;
  photos?: { preview: string; name?: string }[];
};

// ---------------------------------------------------------------------------
// Theme system
// ---------------------------------------------------------------------------

type ThemeConfig = {
  fontHeading: string;
  fontBody: string;
  borderRadius: number;
  shadow: string;
  headingTransform: string;
  headingWeight: number;
  sectionPadding: string;
  cardBg: (primary: string) => string;
  cardBorder: (primary: string) => string;
  buttonRadius: number;
  heroPadding: string;
  heroTextAlign: "center" | "left";
  navStyle: "transparent" | "solid" | "minimal";
  pageBg: string;
  textColor: string;
  mutedColor: string;
  subtleColor: string;
};

const THEMES: Record<string, ThemeConfig> = {
  elegant: {
    fontHeading: "Georgia, 'Times New Roman', serif",
    fontBody: "'Inter', 'Segoe UI', system-ui, sans-serif",
    borderRadius: 6,
    shadow: "0 2px 12px rgba(0,0,0,0.08)",
    headingTransform: "none",
    headingWeight: 700,
    sectionPadding: "40px 32px",
    cardBg: (p) => `${p}06`,
    cardBorder: (p) => `1px solid ${p}18`,
    buttonRadius: 4,
    heroPadding: "56px 32px 52px",
    heroTextAlign: "center",
    navStyle: "transparent",
    pageBg: "#faf9f7",
    textColor: "#1a1a1a",
    mutedColor: "#666",
    subtleColor: "#e8e4de",
  },
  clean: {
    fontHeading: "'Inter', 'Segoe UI', system-ui, sans-serif",
    fontBody: "'Inter', 'Segoe UI', system-ui, sans-serif",
    borderRadius: 12,
    shadow: "0 4px 20px rgba(0,0,0,0.06)",
    headingTransform: "none",
    headingWeight: 700,
    sectionPadding: "36px 28px",
    cardBg: () => "#ffffff",
    cardBorder: () => "1px solid #eee",
    buttonRadius: 24,
    heroPadding: "48px 28px 44px",
    heroTextAlign: "center",
    navStyle: "solid",
    pageBg: "#f5f7fa",
    textColor: "#1a1a1a",
    mutedColor: "#777",
    subtleColor: "#e9ecf0",
  },
  bold: {
    fontHeading: "'Inter', 'Segoe UI', system-ui, sans-serif",
    fontBody: "'Inter', 'Segoe UI', system-ui, sans-serif",
    borderRadius: 0,
    shadow: "none",
    headingTransform: "uppercase",
    headingWeight: 800,
    sectionPadding: "36px 28px",
    cardBg: () => "rgba(255,255,255,0.04)",
    cardBorder: (p) => `2px solid ${p}`,
    buttonRadius: 0,
    heroPadding: "52px 28px 48px",
    heroTextAlign: "left",
    navStyle: "solid",
    pageBg: "#0a0a0a",
    textColor: "#ffffff",
    mutedColor: "#999",
    subtleColor: "#222",
  },
  modern: {
    fontHeading: "'Inter', 'Segoe UI', system-ui, sans-serif",
    fontBody: "'Inter', 'Segoe UI', system-ui, sans-serif",
    borderRadius: 8,
    shadow: "0 2px 16px rgba(0,0,0,0.07)",
    headingTransform: "none",
    headingWeight: 700,
    sectionPadding: "36px 28px",
    cardBg: () => "#ffffff",
    cardBorder: () => "1px solid #e5e5e5",
    buttonRadius: 8,
    heroPadding: "48px 28px 44px",
    heroTextAlign: "left",
    navStyle: "solid",
    pageBg: "#f9fafb",
    textColor: "#111827",
    mutedColor: "#6b7280",
    subtleColor: "#e5e7eb",
  },
  vibrant: {
    fontHeading: "'Inter', 'Segoe UI', system-ui, sans-serif",
    fontBody: "'Inter', 'Segoe UI', system-ui, sans-serif",
    borderRadius: 16,
    shadow: "0 6px 24px rgba(0,0,0,0.1)",
    headingTransform: "none",
    headingWeight: 700,
    sectionPadding: "36px 28px",
    cardBg: () => "#ffffff",
    cardBorder: () => "1px solid rgba(0,0,0,0.06)",
    buttonRadius: 28,
    heroPadding: "52px 28px 48px",
    heroTextAlign: "center",
    navStyle: "solid",
    pageBg: "#fffbf7",
    textColor: "#1a1a1a",
    mutedColor: "#666",
    subtleColor: "#f0e6dc",
  },
  corporate: {
    fontHeading: "'Inter', 'Segoe UI', system-ui, sans-serif",
    fontBody: "'Inter', 'Segoe UI', system-ui, sans-serif",
    borderRadius: 4,
    shadow: "0 1px 8px rgba(0,0,0,0.06)",
    headingTransform: "uppercase",
    headingWeight: 700,
    sectionPadding: "40px 32px",
    cardBg: () => "#ffffff",
    cardBorder: () => "1px solid #d1d5db",
    buttonRadius: 4,
    heroPadding: "52px 32px 48px",
    heroTextAlign: "left",
    navStyle: "solid",
    pageBg: "#f3f4f6",
    textColor: "#111827",
    mutedColor: "#6b7280",
    subtleColor: "#d1d5db",
  },
  warm: {
    fontHeading: "Georgia, 'Times New Roman', serif",
    fontBody: "'Inter', 'Segoe UI', system-ui, sans-serif",
    borderRadius: 4,
    shadow: "0 4px 16px rgba(0,0,0,0.06)",
    headingTransform: "none",
    headingWeight: 700,
    sectionPadding: "40px 28px",
    cardBg: () => "#faf3ee",
    cardBorder: () => "1px solid #e0d4c8",
    buttonRadius: 4,
    heroPadding: "52px 28px 48px",
    heroTextAlign: "center",
    navStyle: "solid",
    pageBg: "#eec8c2",
    textColor: "#2d2319",
    mutedColor: "#6a5c4e",
    subtleColor: "#e0d0c4",
  },
  retro: {
    fontHeading: "'Press Start 2P', 'Courier New', monospace",
    fontBody: "'VT323', 'Courier New', monospace",
    borderRadius: 0,
    shadow: "2px 2px 0 rgba(0,0,0,0.3)",
    headingTransform: "none",
    headingWeight: 400,
    sectionPadding: "28px 24px",
    cardBg: () => "#fef3f8",
    cardBorder: () => "2px solid #c084fc",
    buttonRadius: 0,
    heroPadding: "36px 24px 32px",
    heroTextAlign: "center" as const,
    navStyle: "solid" as const,
    pageBg: "#fdf2f8",
    textColor: "#581c87",
    mutedColor: "#9333ea",
    subtleColor: "#e9d5ff",
  },
  minimal: {
    fontHeading: "'Inter', 'Segoe UI', system-ui, sans-serif",
    fontBody: "'Inter', 'Segoe UI', system-ui, sans-serif",
    borderRadius: 0,
    shadow: "none",
    headingTransform: "none",
    headingWeight: 500,
    sectionPadding: "44px 32px",
    cardBg: () => "transparent",
    cardBorder: () => "1px solid #e5e5e5",
    buttonRadius: 0,
    heroPadding: "60px 32px 56px",
    heroTextAlign: "center",
    navStyle: "minimal",
    pageBg: "#ffffff",
    textColor: "#1a1a1a",
    mutedColor: "#888",
    subtleColor: "#eee",
  },
};

function getTheme(style: string): ThemeConfig {
  return THEMES[style] || THEMES.modern;
}

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return { r, g, b };
  }
  if (clean.length >= 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

function isColorDark(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance < 0.55;
}

function rgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
}

function lighten(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const r = Math.min(255, rgb.r + Math.round((255 - rgb.r) * amount));
  const g = Math.min(255, rgb.g + Math.round((255 - rgb.g) * amount));
  const b = Math.min(255, rgb.b + Math.round((255 - rgb.b) * amount));
  return `rgb(${r},${g},${b})`;
}

function darken(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const r = Math.max(0, Math.round(rgb.r * (1 - amount)));
  const g = Math.max(0, Math.round(rgb.g * (1 - amount)));
  const b = Math.max(0, Math.round(rgb.b * (1 - amount)));
  return `rgb(${r},${g},${b})`;
}

// ---------------------------------------------------------------------------
// Retro window frame wrapper (Y2K / Windows 98 aesthetic)
// ---------------------------------------------------------------------------

function RetroWindowFrame({ title, children, accent }: { title: string; children: React.ReactNode; accent: string }) {
  return (
    <div style={{
      border: "2px solid #a78bfa",
      background: "#fef3f8",
      marginBottom: 0,
    }}>
      {/* Title bar */}
      <div style={{
        background: "linear-gradient(90deg, #c084fc, #a78bfa, #818cf8)",
        padding: "4px 6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{
          fontFamily: "'Press Start 2P', 'Courier New', monospace",
          fontSize: 7,
          color: "#fff",
          textShadow: "1px 1px 0 rgba(0,0,0,0.3)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "70%",
        }}>
          {title}
        </span>
        <div style={{ display: "flex", gap: 3 }}>
          <div style={{ width: 10, height: 10, background: "#fde68a", border: "1px outset #ddd", fontSize: 6, lineHeight: "10px", textAlign: "center" as const, color: "#333" }}>_</div>
          <div style={{ width: 10, height: 10, background: "#fde68a", border: "1px outset #ddd", fontSize: 6, lineHeight: "10px", textAlign: "center" as const, color: "#333" }}>&#9633;</div>
          <div style={{ width: 10, height: 10, background: "#f9a8d4", border: "1px outset #ddd", fontSize: 7, lineHeight: "10px", textAlign: "center" as const, color: "#333" }}>x</div>
        </div>
      </div>
      {/* Content */}
      <div style={{ padding: "12px" }}>
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function SitePreview({ content, slug, logoPreview, photos }: SitePreviewProps) {
  if (!content) return null;

  const style = content.style || "modern";
  const theme = getTheme(style);
  const primary = content.colors?.primary || "#333333";
  const accent = content.colors?.accent || "#0066ff";
  const isDarkBg = style === "bold";
  const textColor = theme.textColor;
  const mutedColor = theme.mutedColor;

  // Hero background logic per style
  const heroBackground = (() => {
    switch (style) {
      case "elegant":
        return `linear-gradient(135deg, ${darken(primary, 0.3)}, ${darken(primary, 0.5)})`;
      case "clean":
        return `linear-gradient(135deg, ${lighten(primary, 0.88)}, ${lighten(accent, 0.85)})`;
      case "bold":
        return `linear-gradient(135deg, #0a0a0a, ${darken(primary, 0.6)})`;
      case "modern":
        return `linear-gradient(135deg, ${primary}, ${darken(primary, 0.2)})`;
      case "vibrant":
        return `linear-gradient(135deg, ${primary}, ${accent})`;
      case "corporate":
        return `linear-gradient(135deg, #0f172a, ${darken(primary, 0.4)})`;
      case "warm":
        return `linear-gradient(135deg, ${lighten(primary, 0.75)}, ${lighten(accent, 0.7)})`;
      case "retro":
        return `repeating-conic-gradient(#f3e8ff 0% 25%, #fdf2f8 0% 50%) 0 0 / 20px 20px`;
      case "minimal":
        return "#ffffff";
      default:
        return `linear-gradient(135deg, ${primary}, ${accent})`;
    }
  })();

  const heroTextIsDark = style === "clean" || style === "warm" || style === "minimal" || style === "retro";
  const hasHeroBg = !!(content.hero_images?.length > 0 || content.hero_image);

  // Nav background per style
  const navBg = (() => {
    switch (theme.navStyle) {
      case "transparent":
        return "rgba(0,0,0,0.25)";
      case "minimal":
        return "transparent";
      case "solid":
      default:
        return isDarkBg ? "#111" : "#ffffff";
    }
  })();

  const navTextColor = (() => {
    if (theme.navStyle === "transparent") return "#fff";
    if (isDarkBg) return "#fff";
    return textColor;
  })();

  const businessName = content.hero_title?.split(" ").slice(0, 3).join(" ") || slug;

  // Section alternating backgrounds
  const sectionBg = (index: number): string => {
    if (isDarkBg) {
      return index % 2 === 0 ? "#0a0a0a" : "#111";
    }
    return index % 2 === 0 ? theme.pageBg : (style === "minimal" ? "#fafafa" : lighten(primary, 0.96));
  };

  return (
    <div style={{
      border: `1px solid ${isDarkBg ? "#333" : "#ddd"}`,
      borderRadius: theme.borderRadius,
      overflow: "hidden",
      background: theme.pageBg,
      fontFamily: theme.fontBody,
      color: textColor,
      fontSize: 14,
      lineHeight: 1.5,
    }}>

      {/* ── Browser chrome bar ── */}
      <div style={{
        background: isDarkBg ? "#1a1a1a" : "#f0f0f0",
        padding: "8px 14px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        borderBottom: `1px solid ${isDarkBg ? "#333" : "#ddd"}`,
      }}>
        <div style={{ display: "flex", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f56" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#27ca41" }} />
        </div>
        <div style={{
          flex: 1,
          background: isDarkBg ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
          padding: "4px 12px",
          borderRadius: 6,
          fontSize: 12,
          fontFamily: "system-ui, sans-serif",
          color: isDarkBg ? "#888" : "#666",
          textAlign: "center",
        }}>
          {slug}.pigeonz.ai
        </div>
      </div>

      {/* ── Navbar ── */}
      {style === "retro" ? (
        <div style={{
          background: "linear-gradient(180deg, #c0c0c0, #a0a0a0)",
          padding: "3px 6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "2px solid #808080",
          borderTop: "1px solid #fff",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {(logoPreview || content.logo_url) && (
              <img src={logoPreview || content.logo_url} alt="Logo" style={{ width: 16, height: 16, objectFit: "contain" }} />
            )}
            <span style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
              color: "#1a0533",
              textShadow: "1px 1px 0 rgba(255,255,255,0.5)",
            }}>
              {businessName}
            </span>
          </div>
          <div style={{ display: "flex", gap: 3 }}>
            <div style={{ width: 12, height: 12, background: "#ddd", border: "2px outset #eee", fontSize: 8, lineHeight: "10px", textAlign: "center" as const, color: "#333" }}>_</div>
            <div style={{ width: 12, height: 12, background: "#ddd", border: "2px outset #eee", fontSize: 7, lineHeight: "10px", textAlign: "center" as const, color: "#333" }}>&#9633;</div>
            <div style={{ width: 12, height: 12, background: "#ddd", border: "2px outset #eee", fontSize: 8, lineHeight: "10px", textAlign: "center" as const, color: "#333" }}>x</div>
          </div>
        </div>
      ) : (
        <div style={{
          background: hasHeroBg ? "transparent" : navBg,
          padding: hasHeroBg ? "6px 24px" : (style === "minimal" ? "16px 32px" : "10px 24px"),
          display: "flex",
          alignItems: "center",
          justifyContent: hasHeroBg ? "flex-end" : "space-between",
          borderBottom: hasHeroBg
            ? "none"
            : theme.navStyle === "minimal"
              ? "none"
              : `1px solid ${isDarkBg ? "#222" : "#eee"}`,
          ...(hasHeroBg || theme.navStyle === "transparent" ? { position: "relative" as const, zIndex: 2 } : {}),
        }}>
          {!hasHeroBg && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {(logoPreview || content.logo_url) && (
                <img
                  src={logoPreview || content.logo_url}
                  alt="Logo"
                  style={{
                    width: 28,
                    height: 28,
                    objectFit: "contain",
                    borderRadius: theme.borderRadius / 2,
                  }}
                />
              )}
              <span style={{
                fontFamily: theme.fontHeading,
                fontSize: style === "minimal" ? 14 : 13,
                fontWeight: theme.headingWeight,
                color: navTextColor,
                textTransform: theme.headingTransform as any,
                letterSpacing: theme.headingTransform === "uppercase" ? "0.05em" : "0",
              }}>
                {businessName}
              </span>
            </div>
          )}
          <div style={{ display: "flex", gap: 16 }}>
            {["Inicio", "Servicos", "Contato"].map((link) => (
              <span key={link} style={{
                fontFamily: theme.fontBody,
                fontSize: 11,
                color: hasHeroBg
                  ? "rgba(255,255,255,0.7)"
                  : theme.navStyle === "transparent"
                    ? "rgba(255,255,255,0.7)"
                    : isDarkBg ? "#999" : mutedColor,
                fontWeight: 500,
              }}>
                {link}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Hero section ── */}
      <div style={{
        background: hasHeroBg ? "#000" : heroBackground,
        padding: theme.heroPadding,
        textAlign: theme.heroTextAlign,
        position: "relative",
        overflow: "hidden",
        ...(style === "retro" ? { border: "2px inset #c084fc" } : {}),
      }}>
        {/* Hero background image (from template hero_images or user upload hero_image) */}
        {hasHeroBg && (
          <>
            <img src={content.hero_image || content.hero_images?.[0]} alt="" style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 20%", opacity: 0.5,
            }} />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)",
              zIndex: 1,
            }} />
          </>
        )}
        {/* Retro decorative hearts */}
        {style === "retro" && (
          <div style={{
            position: "absolute",
            top: 6,
            right: 10,
            fontFamily: "'VT323', monospace",
            fontSize: 14,
            color: "#f9a8d4",
            opacity: 0.6,
          }}>
            &#9829; &#9829; &#9829;
          </div>
        )}
        {/* Subtle overlay for depth */}
        {style !== "minimal" && style !== "retro" && (
          <div style={{
            position: "absolute",
            inset: 0,
            background: style === "vibrant"
              ? "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)"
              : style === "elegant"
                ? "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 70%)"
                : "none",
            pointerEvents: "none",
          }} />
        )}
        <div style={{ position: "relative", zIndex: 2, maxWidth: 540 , margin: "0 auto", textAlign: "center" as const }}>
          {/* Logo in hero — all templates, centered above title */}
          {(logoPreview || content.logo_url) && (
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <img
                src={logoPreview || content.logo_url}
                alt="Logo"
                style={{
                  maxWidth: 100,
                  maxHeight: 100,
                  objectFit: "contain",
                  display: "inline-block",
                }}
              />
            </div>
          )}
          {hasHeroBg ? (
            <div style={{ height: (logoPreview || content.logo_url) ? 70 : 110, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" as const, gap: 5 }}>
              {/* Per-template hero icon (shown when no logo uploaded) */}
              {!(logoPreview || content.logo_url) && content.hero_icon === "diamond" && (
                <svg width={32} height={28} viewBox="0 0 28 24" fill="none">
                  <polygon points="7,0 21,0 28,8 14,24 0,8" fill="none" stroke="#fff" strokeWidth="0.8" />
                  <line x1={0} y1={8} x2={28} y2={8} stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
                  <line x1={7} y1={0} x2={10} y2={8} stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" />
                  <line x1={21} y1={0} x2={18} y2={8} stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" />
                  <line x1={14} y1={0} x2={14} y2={8} stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" />
                  <line x1={10} y1={8} x2={14} y2={24} stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" />
                  <line x1={18} y1={8} x2={14} y2={24} stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" />
                </svg>
              )}
              {!(logoPreview || content.logo_url) && content.hero_icon === "circuit" && (
                <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
                  <rect x={12} y={12} width={8} height={8} rx={1} stroke="#fff" strokeWidth="0.8" />
                  <line x1={16} y1={4} x2={16} y2={12} stroke="rgba(255,255,255,0.6)" strokeWidth="0.6" />
                  <line x1={16} y1={20} x2={16} y2={28} stroke="rgba(255,255,255,0.6)" strokeWidth="0.6" />
                  <line x1={4} y1={16} x2={12} y2={16} stroke="rgba(255,255,255,0.6)" strokeWidth="0.6" />
                  <line x1={20} y1={16} x2={28} y2={16} stroke="rgba(255,255,255,0.6)" strokeWidth="0.6" />
                  <circle cx={16} cy={4} r={1.5} fill="#fff" opacity={0.5} />
                  <circle cx={16} cy={28} r={1.5} fill="#fff" opacity={0.5} />
                  <circle cx={4} cy={16} r={1.5} fill="#fff" opacity={0.5} />
                  <circle cx={28} cy={16} r={1.5} fill="#fff" opacity={0.5} />
                  <line x1={8} y1={8} x2={12} y2={12} stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" />
                  <line x1={24} y1={8} x2={20} y2={12} stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" />
                  <line x1={8} y1={24} x2={12} y2={20} stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" />
                  <line x1={24} y1={24} x2={20} y2={20} stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" />
                </svg>
              )}
              {!(logoPreview || content.logo_url) && content.hero_icon === "barber" && (
                <svg width={80} height={50} viewBox="0 0 80 50" fill="none">
                  {/* Outer shield shape */}
                  <path d="M40,2 L72,10 L72,30 Q72,46 40,48 Q8,46 8,30 L8,10 Z" stroke="#fff" strokeWidth="1" fill="none" />
                  <path d="M40,6 L68,13 L68,29 Q68,43 40,45 Q12,43 12,29 L12,13 Z" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" fill="none" />
                  {/* Crossed razor + scissors */}
                  <line x1={26} y1={14} x2={54} y2={32} stroke="#fff" strokeWidth="0.8" />
                  <rect x={22} y={12} width={6} height={4} rx={1} fill="none" stroke="#fff" strokeWidth="0.6" transform="rotate(-30 25 14)" />
                  <line x1={54} y1={14} x2={26} y2={32} stroke="#fff" strokeWidth="0.8" />
                  <circle cx={24} cy={33} r={2.5} stroke="#fff" strokeWidth="0.6" fill="none" />
                  <circle cx={28} cy={30} r={2.5} stroke="#fff" strokeWidth="0.6" fill="none" />
                  <circle cx={40} cy={23} r={1.5} fill="#d4a44c" />
                  <text x={18} y={25} fill="#d4a44c" fontSize="5">&#9733;</text>
                  <text x={58} y={25} fill="#d4a44c" fontSize="5">&#9733;</text>
                  <text x={40} y={42} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="5" fontFamily="Georgia, serif" letterSpacing="0.15em">EST. 2018</text>
                </svg>
              )}
              <span style={{
                fontFamily: content.hero_icon === "diamond" || content.hero_icon === "barber"
                  ? "Georgia, 'Times New Roman', serif"
                  : "'Inter', system-ui, sans-serif",
                fontSize: content.hero_icon === "diamond" ? 22 : content.hero_icon === "barber" ? 20 : 20,
                fontWeight: content.hero_icon === "diamond" ? 400 : content.hero_icon === "barber" ? 400 : 700,
                letterSpacing: content.hero_icon === "diamond" ? "0.3em" : content.hero_icon === "barber" ? "0.25em" : "0.15em",
                color: "#fff", textTransform: "uppercase" as const, lineHeight: 1,
              }}>
                {content.hero_title || ""}
              </span>
              {content.hero_icon === "barber" && (
                <div style={{ width: 50, height: 1, background: "rgba(255,255,255,0.4)", margin: "4px 0 2px" }} />
              )}
              {content.hero_subtitle && (
                <span style={{
                  fontFamily: content.hero_icon === "diamond"
                    ? "Georgia, 'Times New Roman', serif"
                    : "'Inter', system-ui, sans-serif",
                  fontSize: 8, fontWeight: 400,
                  letterSpacing: content.hero_icon === "diamond" ? "0.4em" : "0.2em",
                  color: "rgba(255,255,255,0.5)", textTransform: "uppercase" as const, lineHeight: 1,
                }}>
                  {content.hero_subtitle}
                </span>
              )}
            </div>
          ) : (
            <>
              <h1 style={{
                fontFamily: theme.fontHeading,
                fontSize: style === "bold" ? 22 : style === "retro" ? 11 : style === "minimal" ? 20 : 18,
                fontWeight: theme.headingWeight,
                color: heroTextIsDark ? textColor : "#fff",
                margin: "0 0 10px",
                lineHeight: 1.25,
                letterSpacing: style === "bold" ? "0.04em" : style === "elegant" ? "-0.01em" : "0",
                textTransform: style === "bold" ? "uppercase" as const : "none" as const,
                textAlign: "center" as const,
              }}>
                {content.hero_title}
              </h1>
              <p style={{
                fontFamily: theme.fontBody,
                fontSize: 14,
                color: heroTextIsDark ? mutedColor : "rgba(255,255,255,0.8)",
                margin: "0 0 18px",
                lineHeight: 1.6,
                textAlign: "center" as const,
              }}>
                {content.hero_subtitle}
              </p>
            </>
          )}
          {content.hero_cta && (
            <span style={{
              display: "inline-block",
              padding: style === "minimal" ? "0 0 2px" : style === "retro" ? "8px 20px" : "9px 24px",
              background: style === "retro"
                ? "#ddd"
                : style === "minimal"
                  ? "transparent"
                  : style === "clean" || style === "vibrant"
                    ? accent
                    : style === "bold"
                      ? accent
                      : style === "elegant"
                        ? "transparent"
                        : heroTextIsDark ? primary : "rgba(255,255,255,0.15)",
              ...(style === "retro" ? { border: "2px outset #eee", boxShadow: "2px 2px 0 rgba(0,0,0,0.2)" } : {}),
              color: style === "retro"
                ? "#333"
                : style === "minimal"
                  ? textColor
                  : style === "elegant"
                    ? "#fff"
                    : style === "bold" || style === "clean" || style === "vibrant"
                      ? (isColorDark(accent) ? "#fff" : "#111")
                      : heroTextIsDark ? "#fff" : "#fff",
              border: style === "retro"
                ? "2px outset #eee"
                : style === "elegant"
                  ? "1px solid rgba(255,255,255,0.4)"
                  : style === "minimal"
                    ? "none"
                    : "none",
              borderBottom: style === "minimal" ? `2px solid ${textColor}` : undefined,
              borderRadius: theme.buttonRadius,
              fontFamily: theme.fontBody,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: style === "bold" || style === "corporate" ? "0.06em" : "0",
              textTransform: style === "bold" || style === "corporate" ? "uppercase" as const : "none" as const,
            }}>
              {content.hero_cta}
            </span>
          )}
        </div>
      </div>

      {/* ── Sections ── */}
      {content.sections?.map((section: any, si: number) => {
        const sectionContent = (
          <>
          {/* Section title (non-retro only — retro uses window title bar) */}
          {style !== "retro" && section.title && section.type !== "banner" && (
            <div style={{ marginBottom: 20 }}>
              {style !== "minimal" && (
                <div style={{
                  width: 32,
                  height: 3,
                  background: accent,
                  marginBottom: 12,
                  borderRadius: style === "clean" || style === "vibrant" ? 2 : 0,
                }} />
              )}
              <h2 style={{
                fontFamily: theme.fontHeading,
                fontSize: style === "bold" ? 15 : style === "minimal" ? 14 : 14,
                fontWeight: theme.headingWeight,
                color: isDarkBg ? "#fff" : textColor,
                margin: 0,
                textTransform: theme.headingTransform as any,
                letterSpacing: theme.headingTransform === "uppercase" ? "0.08em" : "0",
              }}>
                {section.title}
              </h2>
            </div>
          )}

          {/* ── services ── */}
          {section.type === "services" && section.items && (
            style === "modern" || style === "clean" || style === "vibrant" ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {section.items.map((item: any, ii: number) => (
                  <div key={ii} style={{
                    background: theme.cardBg(primary),
                    border: theme.cardBorder(primary),
                    borderRadius: theme.borderRadius,
                    padding: "14px",
                    boxShadow: theme.shadow,
                  }}>
                    <div style={{
                      fontFamily: theme.fontBody,
                      fontSize: 13,
                      fontWeight: 600,
                      color: isDarkBg ? "#fff" : textColor,
                      marginBottom: 4,
                    }}>
                      {item.name}
                    </div>
                    {item.desc && (
                      <div style={{ fontSize: 11, color: mutedColor, lineHeight: 1.5, marginBottom: 6 }}>
                        {item.desc}
                      </div>
                    )}
                    {item.price && (
                      <div style={{ fontSize: 13, fontWeight: 700, color: accent }}>
                        {item.price}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {section.items.map((item: any, ii: number) => (
                  <div key={ii} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: `1px solid ${isDarkBg ? "#222" : theme.subtleColor}`,
                  }}>
                    <div>
                      <div style={{
                        fontFamily: theme.fontBody,
                        fontSize: 13,
                        fontWeight: 600,
                        color: isDarkBg ? "#fff" : textColor,
                      }}>
                        {item.name}
                      </div>
                      {item.desc && (
                        <div style={{ fontSize: 11, color: mutedColor, marginTop: 2 }}>
                          {item.desc}
                        </div>
                      )}
                    </div>
                    {item.price && (
                      <span style={{
                        fontFamily: theme.fontBody,
                        fontSize: 13,
                        fontWeight: 700,
                        color: accent,
                        whiteSpace: "nowrap",
                        marginLeft: 12,
                      }}>
                        {item.price}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )
          )}

          {/* ── products ── */}
          {section.type === "products" && section.items && (
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(section.items.length, 3)}, 1fr)`,
              gap: 12,
            }}>
              {section.items.map((item: any, ii: number) => (
                <div key={ii} style={{
                  background: theme.cardBg(primary),
                  border: theme.cardBorder(primary),
                  borderRadius: theme.borderRadius,
                  overflow: "hidden",
                  boxShadow: theme.shadow,
                  display: "flex",
                  flexDirection: "column",
                }}>
                  {/* Image area */}
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={{
                      width: "100%", height: 70, objectFit: "cover",
                    }} />
                  ) : (
                    <div style={{
                      width: "100%",
                      height: 60,
                      background: `linear-gradient(135deg, ${rgba(primary, 0.15)}, ${rgba(accent, 0.1)})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <div style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: rgba(accent, 0.15),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        color: accent,
                      }}>
                        &#9670;
                      </div>
                    </div>
                  )}
                  <div style={{ padding: "10px 12px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{
                      fontFamily: theme.fontBody,
                      fontSize: 13,
                      fontWeight: 600,
                      color: isDarkBg ? "#fff" : textColor,
                      marginBottom: 3,
                    }}>
                      {item.name}
                    </div>
                    {item.desc && (
                      <div style={{ fontSize: 11, color: mutedColor, lineHeight: 1.4, marginBottom: 8 }}>
                        {item.desc}
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto" }}>
                      {item.old_price && (
                        <span style={{
                          fontSize: 11,
                          color: mutedColor,
                          textDecoration: "line-through",
                        }}>
                          {item.old_price}
                        </span>
                      )}
                      {item.price && (
                        <span style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: accent,
                        }}>
                          {item.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── menu ── */}
          {section.type === "menu" && section.categories?.map((cat: any, ci: number) => (
            <div key={ci} style={{ marginBottom: 18 }}>
              <h3 style={{
                fontFamily: theme.fontHeading,
                fontSize: 13,
                fontWeight: 600,
                color: isDarkBg ? accent : darken(accent, 0.1),
                marginBottom: 8,
                paddingBottom: 6,
                borderBottom: `1px solid ${isDarkBg ? "#222" : theme.subtleColor}`,
                textTransform: theme.headingTransform as any,
              }}>
                {cat.name}
              </h3>
              {cat.items?.map((item: any, ii: number) => (
                <div key={ii} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  padding: "6px 0",
                  borderBottom: `1px dotted ${isDarkBg ? "#222" : "#e5e5e5"}`,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontFamily: theme.fontBody,
                      fontSize: 13,
                      fontWeight: 500,
                      color: isDarkBg ? "#ddd" : textColor,
                    }}>
                      {item.name}
                    </span>
                    {item.desc && (
                      <span style={{
                        fontSize: 11,
                        color: mutedColor,
                        marginLeft: 6,
                      }}>
                        {item.desc}
                      </span>
                    )}
                  </div>
                  {item.price && (
                    <span style={{
                      fontFamily: theme.fontBody,
                      fontSize: 13,
                      fontWeight: 600,
                      color: accent,
                      marginLeft: 12,
                      whiteSpace: "nowrap",
                    }}>
                      {item.price}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* ── about ── */}
          {section.type === "about" && section.text && (
            <p style={{
              fontFamily: theme.fontBody,
              fontSize: 13,
              color: isDarkBg ? "#ccc" : mutedColor,
              lineHeight: 1.7,
              margin: 0,
              maxWidth: 520,
            }}>
              {section.text.length > 300 ? section.text.slice(0, 300) + "..." : section.text}
            </p>
          )}

          {/* ── team ── */}
          {section.type === "team" && section.members && (
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(section.members.length, 3)}, 1fr)`,
              gap: 10,
            }}>
              {section.members.map((m: any, mi: number) => (
                <div key={mi} style={{
                  background: theme.cardBg(primary),
                  border: theme.cardBorder(primary),
                  borderRadius: theme.borderRadius,
                  padding: "14px",
                  textAlign: "center",
                  boxShadow: theme.shadow,
                }}>
                  {/* Avatar placeholder */}
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: rgba(accent, 0.12),
                    margin: "0 auto 8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color: accent,
                  }}>
                    {(m.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div style={{
                    fontFamily: theme.fontBody,
                    fontSize: 13,
                    fontWeight: 600,
                    color: isDarkBg ? "#fff" : textColor,
                    marginBottom: 2,
                  }}>
                    {m.name}
                  </div>
                  <div style={{ fontSize: 11, color: mutedColor }}>
                    {m.role}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── benefits ── */}
          {section.type === "benefits" && section.items && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {section.items.map((item: any, ii: number) => (
                <div key={ii} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "8px 0",
                }}>
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: accent,
                    marginTop: 5,
                    flexShrink: 0,
                  }} />
                  <div>
                    {(item.title || item.name) && (
                      <div style={{
                        fontFamily: theme.fontBody,
                        fontSize: 13,
                        fontWeight: 600,
                        color: isDarkBg ? "#fff" : textColor,
                        marginBottom: 2,
                      }}>
                        {item.title || item.name}
                      </div>
                    )}
                    {item.desc && (
                      <div style={{ fontSize: 11, color: mutedColor, lineHeight: 1.5 }}>
                        {item.desc}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── stats ── */}
          {section.type === "stats" && section.items && (
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(section.items.length, 4)}, 1fr)`,
              gap: 10,
            }}>
              {section.items.map((item: any, ii: number) => (
                <div key={ii} style={{
                  background: style === "retro" ? "#ede9fe" : theme.cardBg(primary),
                  border: style === "retro" ? "2px inset #c084fc" : theme.cardBorder(primary),
                  borderRadius: theme.borderRadius,
                  padding: style === "retro" ? "10px 8px" : "16px 10px",
                  textAlign: "center",
                  boxShadow: theme.shadow,
                }}>
                  {/* Retro dialog icon */}
                  {style === "retro" && (
                    <div style={{ fontSize: 12, marginBottom: 4, color: "#c084fc" }}>&#9432;</div>
                  )}
                  <div style={{
                    fontFamily: theme.fontHeading,
                    fontSize: style === "retro" ? 12 : 18,
                    fontWeight: 700,
                    color: accent,
                    marginBottom: 4,
                    lineHeight: 1.2,
                  }}>
                    {item.value}
                  </div>
                  <div style={{
                    fontFamily: theme.fontBody,
                    fontSize: 11,
                    color: mutedColor,
                    lineHeight: 1.3,
                  }}>
                    {item.label}
                  </div>
                  {/* Retro progress bar */}
                  {style === "retro" && (
                    <div style={{
                      marginTop: 6,
                      height: 8,
                      background: "#e9d5ff",
                      border: "1px inset #c084fc",
                    }}>
                      <div style={{
                        width: `${60 + ii * 15}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #c084fc, #f9a8d4)",
                      }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── features ── */}
          {section.type === "features" && section.items && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {section.items.map((item: any, ii: number) => (
                <div key={ii} style={{
                  background: theme.cardBg(primary),
                  border: theme.cardBorder(primary),
                  borderRadius: theme.borderRadius,
                  padding: "14px",
                  boxShadow: theme.shadow,
                }}>
                  {/* Colored accent dot/bar */}
                  <div style={{
                    width: style === "bold" ? 24 : 8,
                    height: style === "bold" ? 3 : 8,
                    borderRadius: style === "bold" ? 0 : "50%",
                    background: accent,
                    marginBottom: 10,
                  }} />
                  <div style={{
                    fontFamily: theme.fontBody,
                    fontSize: 13,
                    fontWeight: 600,
                    color: isDarkBg ? "#fff" : textColor,
                    marginBottom: 4,
                  }}>
                    {item.title}
                  </div>
                  {item.desc && (
                    <div style={{ fontSize: 11, color: mutedColor, lineHeight: 1.5 }}>
                      {item.desc}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── faq ── */}
          {section.type === "faq" && section.items && (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {section.items.map((item: any, ii: number) => (
                <div key={ii} style={{
                  padding: "12px 0",
                  borderBottom: `1px solid ${isDarkBg ? "#222" : theme.subtleColor}`,
                }}>
                  <div style={{
                    fontFamily: theme.fontBody,
                    fontSize: 13,
                    fontWeight: 600,
                    color: isDarkBg ? "#fff" : textColor,
                    marginBottom: 4,
                  }}>
                    {item.question}
                  </div>
                  <div style={{
                    fontFamily: theme.fontBody,
                    fontSize: 12,
                    color: mutedColor,
                    lineHeight: 1.6,
                  }}>
                    {item.answer}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── banner ── */}
          {section.type === "banner" && (
            <div style={{
              background: style === "retro"
                ? "#ede9fe"
                : `linear-gradient(135deg, ${primary}, ${accent})`,
              padding: style === "retro" ? "20px 18px" : "28px 24px",
              textAlign: "center",
              borderRadius: theme.borderRadius,
              position: "relative",
              overflow: "hidden",
              ...(style === "retro" ? { border: "2px inset #c084fc" } : {}),
            }}>
              {style !== "retro" && (
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)",
                  pointerEvents: "none",
                }} />
              )}
              <div style={{ position: "relative", zIndex: 1 }}>
                {section.title && (
                  <div style={{
                    fontFamily: theme.fontHeading,
                    fontSize: style === "retro" ? 9 : 16,
                    fontWeight: theme.headingWeight,
                    color: style === "retro" ? "#581c87" : "#fff",
                    marginBottom: 8,
                    lineHeight: 1.3,
                    textTransform: theme.headingTransform as any,
                  }}>
                    {section.title}
                  </div>
                )}
                {section.text && (
                  <div style={{
                    fontFamily: theme.fontBody,
                    fontSize: 12,
                    color: style === "retro" ? "#9333ea" : "rgba(255,255,255,0.8)",
                    marginBottom: 14,
                    lineHeight: 1.5,
                  }}>
                    {section.text}
                  </div>
                )}
                {section.button_text && (
                  <span style={{
                    display: "inline-block",
                    padding: "8px 22px",
                    background: style === "retro" ? "#ddd" : "rgba(255,255,255,0.18)",
                    border: style === "retro" ? "2px outset #eee" : "1px solid rgba(255,255,255,0.3)",
                    borderRadius: theme.buttonRadius,
                    fontFamily: theme.fontBody,
                    fontSize: 12,
                    fontWeight: 600,
                    color: style === "retro" ? "#333" : "#fff",
                    ...(style === "retro" ? { boxShadow: "2px 2px 0 rgba(0,0,0,0.2)" } : {}),
                  }}>
                    {section.button_text}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ── newsletter ── */}
          {section.type === "newsletter" && (
            <div style={{ textAlign: "center", padding: "8px 0", maxWidth: 360, margin: "0 auto" }}>
              {section.desc && (
                <div style={{
                  fontFamily: theme.fontBody,
                  fontSize: 12,
                  color: mutedColor,
                  marginBottom: 14,
                  lineHeight: 1.5,
                }}>
                  {section.desc}
                </div>
              )}
              <div style={{ display: "flex", gap: 0 }}>
                <div style={{
                  flex: 1,
                  padding: "9px 12px",
                  background: isDarkBg ? "rgba(255,255,255,0.06)" : "#fff",
                  border: `1px solid ${isDarkBg ? "#333" : "#ddd"}`,
                  borderRight: "none",
                  borderRadius: `${theme.buttonRadius}px 0 0 ${theme.buttonRadius}px`,
                  fontFamily: theme.fontBody,
                  fontSize: 12,
                  color: mutedColor,
                }}>
                  seu@email.com
                </div>
                <div style={{
                  padding: "9px 16px",
                  background: accent,
                  color: isColorDark(accent) ? "#fff" : "#111",
                  borderRadius: `0 ${theme.buttonRadius}px ${theme.buttonRadius}px 0`,
                  fontFamily: theme.fontBody,
                  fontSize: 12,
                  fontWeight: 600,
                }}>
                  Enviar
                </div>
              </div>
            </div>
          )}

          {/* ── testimonials ── */}
          {section.type === "testimonials" && section.items && (
            <div style={{
              display: "grid",
              gridTemplateColumns: section.items.length >= 2 ? "1fr 1fr" : "1fr",
              gap: 10,
            }}>
              {section.items.map((item: any, ii: number) => (
                <div key={ii} style={{
                  background: theme.cardBg(primary),
                  border: theme.cardBorder(primary),
                  borderRadius: theme.borderRadius,
                  padding: "16px",
                  boxShadow: theme.shadow,
                  position: "relative",
                }}>
                  {/* Large quote mark */}
                  <div style={{
                    fontFamily: "Georgia, serif",
                    fontSize: 32,
                    color: rgba(accent, 0.2),
                    lineHeight: 1,
                    marginBottom: -4,
                    fontWeight: 700,
                  }}>
                    &ldquo;
                  </div>
                  {item.rating && (
                    <div style={{
                      marginBottom: 6,
                      color: "#f5a623",
                      fontSize: 11,
                      letterSpacing: 2,
                    }}>
                      {"★".repeat(Math.min(item.rating, 5))}
                      {"☆".repeat(Math.max(0, 5 - item.rating))}
                    </div>
                  )}
                  <div style={{
                    fontFamily: theme.fontBody,
                    fontSize: 12,
                    color: isDarkBg ? "#ccc" : "#555",
                    lineHeight: 1.6,
                    marginBottom: 10,
                    fontStyle: "italic",
                  }}>
                    {item.text}
                  </div>
                  <div style={{
                    fontFamily: theme.fontBody,
                    fontSize: 12,
                    fontWeight: 600,
                    color: accent,
                  }}>
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── gallery ── */}
          {section.type === "gallery" && section.items?.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(section.items.length, 3)}, 1fr)`,
              gap: 8,
            }}>
              {section.items.map((item: any, ii: number) => (
                <div key={ii} style={{
                  borderRadius: theme.borderRadius,
                  overflow: "hidden",
                  height: 70,
                  background: `linear-gradient(135deg, ${rgba(primary, 0.12)}, ${rgba(accent, 0.08)})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {item.image ? (
                    <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <PixelIcon grid={ICONS.pigeon_small} accent={accent} size={2} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── contact ── */}
          {section.type === "contact" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {section.phone && (
                <div style={{
                  fontFamily: theme.fontBody,
                  fontSize: 13,
                  color: isDarkBg ? "#ddd" : textColor,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <span style={{ color: accent, fontSize: 14 }}>&#9742;</span>
                  {section.phone}
                </div>
              )}
              {section.email && (
                <div style={{
                  fontFamily: theme.fontBody,
                  fontSize: 13,
                  color: isDarkBg ? "#ddd" : textColor,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <span style={{ color: accent, fontSize: 12 }}>&#9993;</span>
                  {section.email}
                </div>
              )}
              {section.text && (
                <div style={{ fontSize: 12, color: mutedColor, lineHeight: 1.5 }}>
                  {section.text}
                </div>
              )}
            </div>
          )}

          {/* ── hours ── */}
          {section.type === "hours" && section.text && (
            <p style={{
              fontFamily: theme.fontBody,
              fontSize: 13,
              color: isDarkBg ? "#ccc" : mutedColor,
              lineHeight: 1.7,
              margin: 0,
              whiteSpace: "pre-line",
            }}>
              {section.text}
            </p>
          )}

          {/* ── location ── */}
          {section.type === "location" && (
            <div>
              {section.text && (
                <p style={{
                  fontFamily: theme.fontBody,
                  fontSize: 13,
                  color: isDarkBg ? "#ccc" : mutedColor,
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {section.text}
                </p>
              )}
              {section.address && (
                <p style={{
                  fontFamily: theme.fontBody,
                  fontSize: 13,
                  color: isDarkBg ? "#ddd" : textColor,
                  margin: "8px 0 0",
                  fontWeight: 500,
                }}>
                  {section.address}
                </p>
              )}
            </div>
          )}
          </>
        );

        return (
          <div key={si} style={{
            padding: style === "retro" ? "8px 10px" : theme.sectionPadding,
            background: style === "retro" ? "#fdf2f8" : sectionBg(si),
            borderTop: style === "retro" ? "none" : style === "bold" ? `1px solid #222` : `1px solid ${theme.subtleColor}`,
          }}>
            {style === "retro" ? (
              <RetroWindowFrame title={section.title || section.type} accent={accent}>
                {sectionContent}
              </RetroWindowFrame>
            ) : sectionContent}
          </div>
        );
      })}

      {/* ── Uploaded photos strip ── */}
      {photos && photos.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(photos.length, 3)}, 1fr)`,
          gap: 2,
          borderTop: `1px solid ${isDarkBg ? "#222" : theme.subtleColor}`,
        }}>
          {photos.map((p, i) => (
            <img key={i} src={p.preview} alt="" style={{
              width: "100%",
              height: 80,
              objectFit: "cover",
            }} />
          ))}
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{
        padding: style === "retro" ? "12px 16px" : "18px 24px",
        background: style === "retro" ? "linear-gradient(180deg, #c0c0c0, #a0a0a0)" : isDarkBg ? "#0a0a0a" : style === "elegant" ? darken(primary, 0.6) : "#1a1a2e",
        borderTop: style === "retro" ? "2px outset #ddd" : `1px solid ${isDarkBg ? "#222" : "rgba(255,255,255,0.05)"}`,
        color: style === "retro" ? "#333" : "rgba(255,255,255,0.7)",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}>
          <div style={{
            fontFamily: theme.fontBody,
            fontSize: 12,
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.5,
          }}>
            {content.phone && <div>{content.phone}</div>}
            {content.address && <div>{content.address}</div>}
          </div>
          {content.phone && (
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              background: "#25d366",
              borderRadius: "50%",
              boxShadow: "0 2px 8px rgba(37,211,102,0.4)",
            }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </span>
          )}
        </div>
        <div style={{
          fontFamily: theme.fontBody,
          fontSize: 10,
          color: "rgba(255,255,255,0.3)",
          textAlign: "center",
          paddingTop: 8,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          Powered by pigeonz.ai
        </div>
      </div>
    </div>
  );
}

"use client";
import { useLanguage } from "@/contexts/LanguageContext";

const T = "#48c0b8";
const K = "#f0a0d0";

export default function Footer() {
  const { t } = useLanguage();
  const yr = new Date().getFullYear();

  const navLinks: [string, string][] = [
    [t.footer.nav.services,   "#services"],
    [t.footer.nav.howItWorks, "#how"],
    [t.footer.nav.pricing,    "#pricing"],
    [t.footer.nav.contact,    "#contact"],
  ];

  return (
    <footer style={{
      background: "rgba(14,6,26,0.38)",
      borderTop: "1px solid rgba(150,90,210,.15)",
      padding: "36px 48px 20px",
      position: "relative",
      zIndex: 1,
      backdropFilter: "blur(6px)",
    }}>
      <div style={{ maxWidth: 960, margin: "0 auto 0 0" }}>

        {/* Row 1: brand + nav + contact */}
        <div className="footer-top" style={{
          display: "grid",
          gridTemplateColumns: "200px 160px 1fr",
          gap: 32,
          marginBottom: 32,
          alignItems: "start",
        }}>
          {/* Brand */}
          <div>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 16,
              color: "#ff50c0",
              textShadow: "0 0 16px #ff40b8, 0 0 36px #cc0090aa, 0 0 64px rgba(180,0,120,0.3)",
              marginBottom: 12,
            }}>
              pigeonz<span style={{ color: "#48e8d0", textShadow: "0 0 16px #30c8b0, 0 0 36px rgba(0,180,150,0.5), 0 0 64px rgba(0,150,120,0.25)" }}>.ai</span>
            </div>
            <p style={{
              fontFamily: "'VT323', monospace",
              fontSize: 24,
              color: "#9080b0",
              lineHeight: 1.4,
              margin: 0,
            }}>
              {t.footer.tagline}
            </p>
          </div>

          {/* Nav */}
          <div>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 13,
              color: K,
              marginBottom: 14,
            }}>
              {t.footer.nav.title}
            </div>
            {navLinks.map(([l, h]) => (
              <a key={h} href={h} style={{
                display: "block",
                fontFamily: "'VT323', monospace",
                fontSize: 24,
                color: "#8070a0",
                textDecoration: "none",
                marginBottom: 5,
                transition: "color .2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = K; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#8070a0"; }}
              >
                {">"} {l}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 13,
              color: K,
              marginBottom: 14,
            }}>
              {t.footer.contact.title}
            </div>
            <a href="#contact" className="btn btn-p" style={{
              fontSize: 10,
              padding: "14px 18px",
              display: "inline-block",
            }}>
              {t.footer.contact.cta}
            </a>
          </div>
        </div>

        {/* Row 2: Stack */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 15,
            color: T,
            marginBottom: 16,
            letterSpacing: 2,
          }}>
            {t.footer.stack.title}
          </div>

          <div className="footer-stack" style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "0 20px",
            alignItems: "start",
          }}>
            {t.footer.stack.categories.map((cat, ci) => (
              <div key={ci}>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 11,
                  color: ci % 2 === 0 ? T : K,
                  letterSpacing: 1,
                  marginBottom: 8,
                }}>
                  {cat.label}
                </div>
                {cat.items.map(item => (
                  <div key={item} style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: 21,
                    color: "#9080b0",
                    lineHeight: 1.25,
                  }}>
                    <span style={{ color: (ci % 2 === 0 ? T : K) + "88" }}>▸</span> {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: "rgba(240,160,208,.15)",
          marginBottom: 16,
        }} />

        {/* Bottom */}
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#5a4880" }}>
            © {yr} pigeonz.ai — {t.footer.copyright}
          </div>
          <div style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: "#5a4880" }}>
            {(() => {
              const [before, after] = t.footer.madeWith.split("♥");
              return <>{before}<span style={{ color: K }}>♥</span>{after}</>;
            })()}
          </div>
        </div>

      </div>
    </footer>
  );
}

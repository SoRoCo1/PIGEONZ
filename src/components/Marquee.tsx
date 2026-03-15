"use client";

interface MarqueeProps {
  items: string[];
  speed?: number;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  reverse?: boolean;
}

export default function Marquee({
  items,
  speed = 30,
  bgColor = "#3a2858",
  textColor = "#f0a0d0",
  borderColor = "#6040a0",
  reverse = false,
}: MarqueeProps) {
  const text = items.join("  ✦  ") + "  ✦  ";
  const repeated = text.repeat(8);

  return (
    <div style={{
      background: bgColor,
      borderTop: `3px solid ${borderColor}`,
      borderBottom: `3px solid ${borderColor}`,
      padding: "14px 0",
      overflow: "hidden",
      whiteSpace: "nowrap",
      position: "relative",
      zIndex: 10,
    }}>
      <style>{`
        @keyframes marquee-fwd {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marquee-rev {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
      `}</style>
      <div style={{
        display: "inline-block",
        animation: `${reverse ? "marquee-rev" : "marquee-fwd"} ${speed}s linear infinite`,
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 14,
        color: textColor,
        letterSpacing: 2,
        textTransform: "uppercase",
      }}>
        {repeated}
      </div>
    </div>
  );
}

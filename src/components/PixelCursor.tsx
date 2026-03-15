"use client";
import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function PixelCursor() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  const springX = useSpring(mouseX, { stiffness: 350, damping: 30, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 350, damping: 30, mass: 0.4 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      setHovering(!!el?.closest("a, button, [role='button'], input, select, textarea"));
    };
    const onDown = () => setClicking(true);
    const onUp   = () => setClicking(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
    };
  }, [mouseX, mouseY]);

  const col  = hovering ? "#f0a0d0" : "#48c0b8";
  const glow = hovering ? "0 0 8px #f0a0d0aa" : "0 0 8px #48c0b8aa";
  const s    = clicking ? 0.7 : hovering ? 1.3 : 1;

  return (
    <motion.div
      style={{
        position: "fixed",
        left: springX,
        top:  springY,
        x: "-50%",
        y: "-50%",
        pointerEvents: "none",
        zIndex: 99999,
        scale: s,
      }}
      animate={{ scale: s }}
      transition={{ duration: 0.12 }}
    >
      {/* Pixel crosshair cursor */}
      <svg
        width={16} height={16}
        viewBox="0 0 16 16"
        style={{ imageRendering: "pixelated", shapeRendering: "crispEdges", overflow: "visible", filter: `drop-shadow(${glow})` }}
      >
        {/* center 2×2 */}
        <rect x={7} y={7} width={2} height={2} fill={col} />
        {/* top arm */}
        <rect x={7} y={2} width={2} height={4} fill={col} opacity={0.6} />
        {/* bottom arm */}
        <rect x={7} y={10} width={2} height={4} fill={col} opacity={0.6} />
        {/* left arm */}
        <rect x={2} y={7} width={4} height={2} fill={col} opacity={0.6} />
        {/* right arm */}
        <rect x={10} y={7} width={4} height={2} fill={col} opacity={0.6} />
        {/* corner dots */}
        <rect x={2} y={2} width={1} height={1} fill={col} opacity={0.3} />
        <rect x={13} y={2} width={1} height={1} fill={col} opacity={0.3} />
        <rect x={2} y={13} width={1} height={1} fill={col} opacity={0.3} />
        <rect x={13} y={13} width={1} height={1} fill={col} opacity={0.3} />
      </svg>
    </motion.div>
  );
}

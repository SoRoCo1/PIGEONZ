"use client";

import { useState, useCallback, useEffect } from "react";
import { SitePreview } from "@/components/SitePreview";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

/* ── Pixel art coffee cup character — kiss + floating heart ── */
function CoffeeCupSVG({ s = 5 }: { s?: number }) {
  const [blink, setBlink] = useState(false);
  const [kissing, setKissing] = useState(false);
  const [heartKey, setHeartKey] = useState(0);

  useEffect(() => {
    const blinkLoop = () => {
      const delay = 2500 + Math.random() * 2500;
      const id = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 150);
        blinkLoop();
      }, delay);
      return id;
    };
    const id = blinkLoop();
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const kissLoop = () => {
      const delay = 3000 + Math.random() * 2000;
      const id = setTimeout(() => {
        setKissing(true);
        setHeartKey((k) => k + 1);
        setTimeout(() => setKissing(false), 1200);
        kissLoop();
      }, delay);
      return id;
    };
    const id = kissLoop();
    return () => clearTimeout(id);
  }, []);

  const _ = null;
  const C  = "#f5f0e8";
  const Cl = "#fff";
  const Cd = "#e8ddd0";
  const Cs = "#d4c8b0";
  const Cb = "#c8b898";
  const Lf = "#a07040";
  const Ld = "#7c5530";
  const Ah = "#e0d4c0";
  const Ad = "#c8b898";
  const Ew = "#fff";
  const Ep = "#1a0e06";
  const Bl = "#f9a8d4";
  const Mk = "#e05080";
  const Ms = "#d05070";
  const Rm = "#e8e0d4";
  const St = "#c8c0b8";

  // 20 cols × 12 rows — wide flat cup with handle
  const grid: (string | null)[][] = [
    // Row 0: rim
    [_,_,Rm,Rm,Rm,Rm,Rm,Rm,Rm,Rm,Rm,Rm,Rm,Rm,_,_,_,_,_,_],
    // Row 1: coffee
    [_,_,Cl,Lf,Lf,Lf,Lf,Lf,Lf,Lf,Lf,Lf,Lf,Cl,_,_,_,_,_,_],
    // Row 2: cup top
    [_,_,Cl,C,C,C,C,C,C,C,C,C,C,C,_,_,_,_,_,_],
    // Row 3: eyes
    [_,_,C,C,Ew,Ep,C,C,C,C,Ew,Ep,C,C,Ad,Ad,_,_,_,_],
    // Row 4: blush
    [_,_,C,C,Bl,C,C,C,C,C,Bl,C,C,C,_,_,Ad,Ad,_,_],
    // Row 5: mouth
    [_,_,C,C,C,C,C,Ms,Ms,C,C,C,C,C,_,_,Ah,Ad,_,_],
    // Row 6: cup body
    [_,_,C,C,C,C,C,C,C,C,C,C,C,C,_,_,Ah,Ad,_,_],
    // Row 7: cup body
    [_,_,Cd,C,C,C,C,C,C,C,C,C,C,Cd,_,Ad,Ad,_,_,_],
    // Row 8: taper
    [_,_,Cs,Cd,C,C,C,C,C,C,C,C,Cd,Cs,Ad,Ad,_,_,_,_],
    // Row 9: taper
    [_,_,_,Cs,Cd,Cd,Cd,C,C,Cd,Cd,Cd,Cs,_,_,_,_,_,_,_],
    // Row 10: base
    [_,_,_,_,_,Cb,Cb,Cb,Cb,Cb,Cb,_,_,_,_,_,_,_,_,_],
    // Row 11: saucer
    [_,_,_,_,Cb,Cb,Cb,Cb,Cb,Cb,Cb,Cb,_,_,_,_,_,_,_,_],
  ];

  const finalGrid = grid.map((row, ri) => {
    if (kissing && ri === 5) return [_,_,C,C,C,C,C,C,Mk,Mk,Mk,C,C,C,_,_,Ah,Ad,_,_];
    if (kissing && ri === 4) return [_,_,C,C,Bl,Bl,C,C,C,C,Bl,Bl,C,C,_,_,Ad,Ad,_,_];
    if (kissing && ri === 3) return [_,_,C,C,C,Ep,C,C,C,C,C,Ep,C,C,Ad,Ad,_,_,_,_];
    if (blink && !kissing && ri === 3) return [_,_,C,C,Ep,Ep,C,C,C,C,Ep,Ep,C,C,Ad,Ad,_,_,_,_];
    return row;
  });

  const cols = 20;
  const rows = 12;
  const w = cols * s;
  const h = rows * s;

  // Animated steam particles
  const [steamTick, setSteamTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSteamTick((t) => t + 1), 400);
    return () => clearInterval(id);
  }, []);

  const steamPositions = [
    { x: 5, delay: 0 },
    { x: 8, delay: 1 },
    { x: 11, delay: 2 },
  ];

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Animated steam above cup */}
      <div style={{ position: "relative", height: s * 5, width: w }}>
        {steamPositions.map((sp, i) => {
          const phase = (steamTick + sp.delay) % 5;
          const yOff = [4, 3, 2, 1, 0][phase];
          const opacity = [0.5, 0.85, 1, 0.7, 0.35][phase];
          const xWiggle = [0, 0.7, -0.7, 0.4, 0][phase];
          const size = [1, 1.3, 1.5, 1.2, 0.8][phase];
          return (
            <div key={i} style={{
              position: "absolute",
              bottom: yOff * s,
              left: (sp.x + xWiggle) * s - (size - 1) * s * 0.5,
              width: s * size,
              height: s * size,
              background: "rgba(200,192,184,0.9)",
              opacity,
              borderRadius: "50%",
              filter: `blur(${s * 0.25}px)`,
              transition: "all 0.35s ease-out",
            }} />
          );
        })}
      </div>

      {/* Cup */}
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges">
        {finalGrid.map((row, ri) =>
          row.map((color, ci) =>
            color ? (
              <rect key={`${ri}-${ci}`} x={ci * s} y={ri * s} width={s} height={s} fill={color} />
            ) : null
          )
        )}
      </svg>

      {/* Shadow below cup */}
      <div style={{
        width: w * 0.7,
        height: s * 1.5,
        margin: "0 auto",
        marginTop: -2,
        background: "radial-gradient(ellipse, rgba(40,20,5,0.55) 0%, rgba(40,20,5,0.25) 50%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(3px)",
      }} />

      {/* Heart from kiss */}
      <AnimatePresence>
        {kissing && (
          <motion.div
            key={heartKey}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: [1, 1, 0], x: [0, 20, 35], y: [0, -25, -50], scale: [0.5, 1.2, 0.8] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ position: "absolute", top: s * 7, right: -s * 1, pointerEvents: "none", zIndex: 10 }}
          >
            <svg width={s * 5} height={s * 4} viewBox="0 0 5 4" shapeRendering="crispEdges">
              <rect x={0} y={0} width={1} height={1} fill="#f472b6" />
              <rect x={1} y={0} width={1} height={1} fill="#f472b6" />
              <rect x={3} y={0} width={1} height={1} fill="#f472b6" />
              <rect x={4} y={0} width={1} height={1} fill="#f472b6" />
              <rect x={0} y={1} width={1} height={1} fill="#f9a8d4" />
              <rect x={1} y={1} width={1} height={1} fill="#f472b6" />
              <rect x={2} y={1} width={1} height={1} fill="#f472b6" />
              <rect x={3} y={1} width={1} height={1} fill="#f472b6" />
              <rect x={4} y={1} width={1} height={1} fill="#f472b6" />
              <rect x={1} y={2} width={1} height={1} fill="#f472b6" />
              <rect x={2} y={2} width={1} height={1} fill="#f472b6" />
              <rect x={3} y={2} width={1} height={1} fill="#f472b6" />
              <rect x={2} y={3} width={1} height={1} fill="#ec4899" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Elegant jewelry logo — serif typography like Swarovski ── */
function JewelryLogo() {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      {/* Diamond icon */}
      <svg width={32} height={28} viewBox="0 0 28 24" fill="none">
        <polygon points="7,0 21,0 28,8 14,24 0,8" fill="none" stroke="#fff" strokeWidth="0.8" />
        <line x1={0} y1={8} x2={28} y2={8} stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
        <line x1={7} y1={0} x2={10} y2={8} stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" />
        <line x1={21} y1={0} x2={18} y2={8} stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" />
        <line x1={14} y1={0} x2={14} y2={8} stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" />
        <line x1={10} y1={8} x2={14} y2={24} stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" />
        <line x1={18} y1={8} x2={14} y2={24} stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" />
      </svg>
      {/* Brand name */}
      <span style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: 22,
        fontWeight: 400,
        letterSpacing: "0.3em",
        color: "#fff",
        textTransform: "uppercase" as const,
        lineHeight: 1,
      }}>
        Velaris
      </span>
      <span style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: 9,
        fontWeight: 400,
        letterSpacing: "0.4em",
        color: "rgba(255,255,255,0.6)",
        textTransform: "uppercase" as const,
        lineHeight: 1,
        marginTop: 2,
      }}>
        Joias
      </span>
    </div>
  );
}

function TemplateLogo({ style }: { style: string; name: string; accent: string }) {
  if (style === "retro") {
    return <CoffeeCupSVG s={5} />;
  }
  return null;
}

/* ── Astral Bike: Full robot with rainbow helmet (SVG, waving) ── */
function AstralRobotSVG({ scale = 1 }: { scale?: number }) {
  const S = 5 * scale;
  const C = {
    antTip:"#FBCFE8",ant:"#F472B6",hR:"#EF4444",hO:"#F97316",hY:"#EAB308",
    hG:"#22C55E",hB:"#3B82F6",hV:"#7C3AED",hVisor:"#1E0B35",hEdge:"#6D28D9",
    head:"#8B5CF6",eyeBrow:"#4C1D95",eye:"#16A34A",eyeShine:"#FDF4FF",eyePupil:"#1E0B35",
    blush:"#F9A8D4",mouth:"#C4B5FD",teeth:"#FDF4FF",body:"#7C3AED",bodyL:"#A78BFA",
    arm:"#6D28D9",bolt:"#FDE68A",leg:"#5B21B6",
  };
  const rects: {x:number;y:number;w:number;h:number;fill:string}[] = [];
  const r = (c:number,row:number,w:number,h:number,fill:string) =>
    rects.push({x:c*S,y:row*S,w:w*S,h:h*S,fill});

  // Antenna
  r(5,0,2,1,C.antTip); r(5,1,2,1,C.ant);
  // Rainbow helmet
  r(3,2,6,1,C.hR); r(2,3,8,1,C.hO); r(1,4,10,1,C.hY);
  r(1,5,10,1,C.hG); r(1,6,10,1,C.hB); r(1,7,10,1,C.hV);
  // Visor
  r(2,8,8,1,C.hVisor);
  // Head border
  r(2,9,8,1,C.hEdge); r(2,16,8,1,C.hEdge);
  r(2,10,1,6,C.hEdge); r(9,10,1,6,C.hEdge);
  // Head fill
  r(3,10,6,6,C.head);
  // Eyebrows (waving)
  r(3,10,2,1,C.eyeBrow); r(7,10,2,1,C.eyeBrow);
  // Eyes
  r(5,11,2,2,C.eyeBrow);
  r(3,11,2,2,C.eye); r(3,11,1,1,C.eyeShine); r(4,12,1,1,C.eyePupil);
  r(7,11,2,2,C.eye); r(7,11,1,1,C.eyeShine); r(8,12,1,1,C.eyePupil);
  // Blush + nose
  r(5,13,2,1,C.mouth); r(3,13,1,1,C.blush); r(8,13,1,1,C.blush);
  // Mouth (happy)
  r(4,14,4,1,C.mouth); r(3,15,1,1,C.mouth); r(4,15,4,1,C.teeth); r(8,15,1,1,C.mouth);
  // Neck
  r(5,17,2,1,C.body);
  // Body
  r(3,18,6,1,C.arm); r(3,19,6,1,C.body); r(4,19,1,1,C.bodyL); r(7,19,1,1,C.bodyL);
  r(3,20,6,1,C.body); r(5,20,2,1,C.bolt); r(3,21,6,1,C.body);
  // Waving arm (right goes up)
  r(10,18,2,3,C.arm);
  // Waving arm (left goes up to wave)
  r(0,10,2,1,C.bodyL); r(0,11,2,6,C.arm);
  // Legs
  r(3,22,2,2,C.leg); r(7,22,2,2,C.leg);
  // Feet
  r(2,24,3,1,C.leg); r(7,24,3,1,C.leg);

  const W = 12*S, H = 25*S;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} shapeRendering="crispEdges" style={{imageRendering:"pixelated"}}>
      {rects.map((p,i) => <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} fill={p.fill}/>)}
      <text x={W/2} y={8*S+S*0.78} textAnchor="middle" fontSize={S*1.6}
        fontFamily="'Courier New',Courier,monospace" fontWeight="900" fill="#FDE68A">ASTRAL</text>
    </svg>
  );
}

/* ── Wheelie robot on bike (SVG) ── */
function WheelieRobotSVG({ scale = 1 }: { scale?: number }) {
  const S = 4 * scale;
  const C = {
    antTip:"#FBCFE8",ant:"#F472B6",hR:"#EF4444",hO:"#F97316",hY:"#EAB308",
    hG:"#22C55E",hB:"#3B82F6",hV:"#7C3AED",hVisor:"#1E0B35",hEdge:"#6D28D9",
    head:"#8B5CF6",eyeBrow:"#4C1D95",eye:"#16A34A",eyeShine:"#FDF4FF",
    blush:"#F9A8D4",mouth:"#C4B5FD",teeth:"#FDF4FF",body:"#7C3AED",bodyL:"#A78BFA",
    arm:"#6D28D9",bolt:"#FDE68A",leg:"#5B21B6",seat:"#6D28D9",
    frame:"#EC4899",wheel:"#1E1B4B",hub:"#A78BFA",hubCenter:"#7C3AED",pedal:"#F472B6",
  };
  const rects: {x:number;y:number;w:number;h:number;fill:string}[] = [];
  const r = (c:number,row:number,w:number,h:number,fill:string) =>
    rects.push({x:c*S,y:row*S,w:w*S,h:h*S,fill});

  // Antenna
  r(9,0,2,1,C.antTip); r(9,1,2,1,C.ant);
  // Helmet
  r(7,2,6,1,C.hR); r(6,3,8,1,C.hO); r(5,4,10,1,C.hY);
  r(5,5,10,1,C.hG); r(5,6,10,1,C.hB); r(5,7,10,1,C.hV);
  r(6,8,8,1,C.hVisor);
  // Head
  r(6,9,8,1,C.hEdge); r(6,14,8,1,C.hEdge);
  r(6,10,1,4,C.hEdge); r(13,10,1,4,C.hEdge);
  r(7,10,6,4,C.head);
  // Eyes (riding)
  r(7,10,1,1,C.eyeBrow); r(8,11,1,1,C.eyeBrow);
  r(12,10,1,1,C.eyeBrow); r(11,11,1,1,C.eyeBrow);
  r(7,11,2,1,C.eye); r(8,11,1,1,C.eyeShine);
  r(11,11,2,1,C.eye); r(12,11,1,1,C.eyeShine);
  r(7,12,1,1,C.blush); r(12,12,1,1,C.blush);
  r(8,13,4,1,C.teeth); r(7,13,1,1,C.mouth); r(12,13,1,1,C.mouth);
  // Neck + body
  r(9,15,2,1,C.body);
  r(7,16,6,1,C.arm); r(7,17,6,1,C.body); r(8,17,1,1,C.bodyL); r(11,17,1,1,C.bodyL);
  r(7,18,6,1,C.body); r(9,18,2,1,C.bolt); r(7,19,6,1,C.body);
  // Arms
  r(5,16,2,1,C.arm); r(4,17,2,1,C.arm); r(3,18,2,1,C.arm);
  r(13,16,2,1,C.arm); r(14,17,1,1,C.arm);
  // Legs
  r(7,20,2,1,C.leg); r(6,21,2,1,C.leg); r(11,20,2,1,C.leg); r(12,21,2,1,C.leg);
  r(5,22,3,1,C.leg); r(12,22,3,1,C.leg);
  // Bike
  r(9,20,3,1,C.seat); r(10,19,1,1,C.seat);
  r(10,20,1,4,C.frame); r(5,20,5,1,C.frame);
  r(10,23,1,1,C.frame); r(9,24,1,1,C.frame); r(8,25,6,1,C.frame);
  r(3,19,3,1,C.frame); r(2,18,2,1,C.frame); r(4,20,1,4,C.frame);
  r(7,25,2,1,C.pedal); r(13,25,2,1,C.pedal);
  // Wheels
  const drawWheel = (wx:number,wy:number) => {
    r(wx+1,wy,3,1,C.wheel); r(wx,wy+1,1,1,C.wheel); r(wx+4,wy+1,1,1,C.wheel);
    r(wx,wy+2,1,1,C.wheel); r(wx+4,wy+2,1,1,C.wheel);
    r(wx,wy+3,1,1,C.wheel); r(wx+4,wy+3,1,1,C.wheel); r(wx+1,wy+4,3,1,C.wheel);
    r(wx+2,wy+1,1,1,C.hub); r(wx+2,wy+3,1,1,C.hub);
    r(wx+1,wy+2,1,1,C.hub); r(wx+3,wy+2,1,1,C.hub); r(wx+2,wy+2,1,1,C.hubCenter);
  };
  drawWheel(12,24); drawWheel(2,24);

  const W = 18*S, H = 29*S;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} shapeRendering="crispEdges" style={{imageRendering:"pixelated"}}>
      {rects.map((p,i) => <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} fill={p.fill}/>)}
      <text x={W/2} y={8*S+S*0.78} textAnchor="middle" fontSize={S*1.4}
        fontFamily="'Courier New',Courier,monospace" fontWeight="900" fill="#FDE68A"
        style={{letterSpacing:"0.5px"}}>ASTRAL</text>
    </svg>
  );
}

/* ── Nature background SVG for Astral Bike white section ── */
function NatureBg() {
  return (
    <svg viewBox="0 0 720 150" width="100%" preserveAspectRatio="xMidYMax slice" style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
      <defs>
        <linearGradient id="ab-hill1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A7F3D0"/>
          <stop offset="100%" stopColor="#6EE7B7"/>
        </linearGradient>
        <linearGradient id="ab-hill2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86EFAC"/>
          <stop offset="100%" stopColor="#4ADE80"/>
        </linearGradient>
      </defs>
      {/* Clouds */}
      <ellipse cx={100} cy={18} rx={40} ry={10} fill="rgba(120,180,120,0.12)"/>
      <ellipse cx={350} cy={12} rx={50} ry={8} fill="rgba(120,180,120,0.10)"/>
      <ellipse cx={600} cy={22} rx={35} ry={9} fill="rgba(120,180,120,0.12)"/>
      {/* Back hill */}
      <ellipse cx={360} cy={150} rx={500} ry={85} fill="url(#ab-hill1)" opacity={0.45}/>
      {/* Front hill */}
      <ellipse cx={360} cy={150} rx={450} ry={65} fill="url(#ab-hill2)" opacity={0.6}/>
      {/* Pixel Trees */}
      {[30, 95, 180, 265, 345, 430, 510, 575, 650, 695].map((tx, ti) => {
        const treeY = 68 + Math.sin(ti * 1.3) * 8;
        const sc = 0.7 + (ti % 3) * 0.15;
        const g1 = ti % 2 === 0 ? "#22C55E" : "#16A34A";
        const g2 = ti % 2 === 0 ? "#16A34A" : "#15803D";
        const trunk = "#92400E";
        const ps = 3 * sc;
        return (
          <g key={ti} transform={`translate(${tx},${treeY})`}>
            <rect x={ps*3} y={0} width={ps*4} height={ps} fill={g1}/>
            <rect x={ps*2} y={ps} width={ps*6} height={ps} fill={g1}/>
            <rect x={ps*1} y={ps*2} width={ps*8} height={ps} fill={g2}/>
            <rect x={ps*1} y={ps*3} width={ps*8} height={ps} fill={g1}/>
            <rect x={ps*2} y={ps*4} width={ps*6} height={ps} fill={g2}/>
            <rect x={ps*3} y={ps*5} width={ps*4} height={ps} fill={g2}/>
            <rect x={ps*4} y={ps*6} width={ps*2} height={ps*3} fill={trunk}/>
          </g>
        );
      })}
      {/* Flowers */}
      {[50, 140, 220, 310, 400, 480, 560, 640].map((fx, fi) => (
        <g key={`f${fi}`}>
          <rect x={fx} y={120 + (fi % 3) * 5} width={3} height={3} fill={fi % 2 === 0 ? "#F472B6" : "#FBBF24"} opacity={0.7}/>
          <rect x={fx} y={123 + (fi % 3) * 5} width={1} height={4} fill="#22C55E" opacity={0.5}/>
        </g>
      ))}
      {/* Animated bike 1 */}
      <g>
        <animateTransform attributeName="transform" type="translate" from="-60 0" to="780 0" dur="12s" repeatCount="indefinite"/>
        <circle cx={0} cy={125} r={6} fill="none" stroke="#7C3AED" strokeWidth={1.5} opacity={0.5}/>
        <circle cx={18} cy={125} r={6} fill="none" stroke="#7C3AED" strokeWidth={1.5} opacity={0.5}/>
        <line x1={0} y1={125} x2={9} y2={113} stroke="#C026D3" strokeWidth={1.2} opacity={0.5}/>
        <line x1={9} y1={113} x2={18} y2={125} stroke="#C026D3" strokeWidth={1.2} opacity={0.5}/>
        <line x1={9} y1={113} x2={4} y2={113} stroke="#C026D3" strokeWidth={1.2} opacity={0.5}/>
        <circle cx={7} cy={107} r={3} fill="#A78BFA" opacity={0.5}/>
      </g>
      {/* Animated bike 2 (reverse) */}
      <g>
        <animateTransform attributeName="transform" type="translate" from="780 0" to="-60 0" dur="16s" repeatCount="indefinite"/>
        <circle cx={0} cy={128} r={5} fill="none" stroke="#7C3AED" strokeWidth={1.2} opacity={0.35}/>
        <circle cx={15} cy={128} r={5} fill="none" stroke="#7C3AED" strokeWidth={1.2} opacity={0.35}/>
        <line x1={0} y1={128} x2={7} y2={118} stroke="#C026D3" strokeWidth={1} opacity={0.35}/>
        <line x1={7} y1={118} x2={15} y2={128} stroke="#C026D3" strokeWidth={1} opacity={0.35}/>
        <circle cx={5} cy={113} r={2.5} fill="#A78BFA" opacity={0.35}/>
      </g>
      {/* Ground */}
      <rect x={0} y={143} width={720} height={7} fill="#15803D" opacity={0.35}/>
    </svg>
  );
}

/* ── Daytime city background — colorful buildings, bikes, blue sky ── */
function CityBgMini() {
  const buildings: {x:number,w:number,h:number,fill:string}[] = [
    {x:0,w:48,h:90,fill:"#F9A8D4"},{x:46,w:38,h:110,fill:"#93C5FD"},
    {x:82,w:52,h:80,fill:"#FDE68A"},{x:132,w:40,h:125,fill:"#C4B5FD"},
    {x:170,w:50,h:95,fill:"#A7F3D0"},{x:218,w:36,h:115,fill:"#FCA5A5"},
    {x:252,w:55,h:85,fill:"#FDBA74"},{x:305,w:42,h:130,fill:"#93C5FD"},
    {x:345,w:48,h:100,fill:"#F9A8D4"},{x:391,w:38,h:120,fill:"#A7F3D0"},
    {x:427,w:52,h:88,fill:"#FDE68A"},{x:477,w:40,h:135,fill:"#C4B5FD"},
    {x:515,w:46,h:95,fill:"#FCA5A5"},{x:559,w:50,h:110,fill:"#FDBA74"},
    {x:607,w:42,h:80,fill:"#93C5FD"},{x:647,w:48,h:125,fill:"#F9A8D4"},
    {x:693,w:30,h:90,fill:"#A7F3D0"},
  ];

  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", imageRendering: "pixelated", shapeRendering: "crispEdges" }} preserveAspectRatio="xMidYMax slice" viewBox="0 0 720 300">
      <defs>
        <linearGradient id="day-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bde4f8"/>
          <stop offset="50%" stopColor="#d0ecfa"/>
          <stop offset="100%" stopColor="#e4f3fc"/>
        </linearGradient>
      </defs>

      {/* Baby blue sky */}
      <rect x={0} y={0} width={720} height={300} fill="url(#day-sky)" opacity={0.45}/>

      {/* Sun */}
      <circle cx={600} cy={35} r={22} fill="#FDE68A" opacity={0.3}/>
      <circle cx={600} cy={35} r={14} fill="#fcd34d" opacity={0.4}>
        <animate attributeName="opacity" values="0.35;0.5;0.35" dur="5s" repeatCount="indefinite"/>
      </circle>

      {/* Clouds */}
      {[
        {cx:80,cy:25,rx:38,ry:9,dur:28},{cx:260,cy:15,rx:48,ry:10,dur:34},
        {cx:460,cy:30,rx:34,ry:8,dur:22},{cx:660,cy:20,rx:40,ry:9,dur:30},
      ].map((c,i) => (
        <g key={`dc${i}`} opacity={0.3 + (i%2)*0.06}>
          <ellipse cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry} fill="#fff">
            <animateTransform attributeName="transform" type="translate" from="-20 0" to="20 0" dur={`${c.dur}s`} repeatCount="indefinite" additive="sum"/>
          </ellipse>
          <ellipse cx={c.cx - c.rx*0.3} cy={c.cy - 4} rx={c.rx*0.5} ry={c.ry*0.6} fill="#fff">
            <animateTransform attributeName="transform" type="translate" from="-20 0" to="20 0" dur={`${c.dur}s`} repeatCount="indefinite" additive="sum"/>
          </ellipse>
        </g>
      ))}

      {/* Colorful buildings */}
      {buildings.map((b,i) => {
        const by = 285 - b.h;
        return (
          <g key={`cb${i}`} opacity={0.5}>
            <rect x={b.x} y={by} width={b.w} height={b.h} fill={b.fill}/>
            {/* Roof line */}
            <rect x={b.x} y={by} width={b.w} height={3} fill="#00000018"/>
            {/* Windows */}
            {Array.from({length: Math.floor(b.h/14)}).map((_,ri) =>
              Array.from({length: Math.floor((b.w-8)/10)}).map((_,ci) => {
                const on = Math.sin(i*17 + ri*7 + ci*3) > -0.2;
                if (!on) return null;
                return <rect key={`bw${i}${ri}${ci}`} x={b.x+5+ci*10} y={by+8+ri*14} width={5} height={6}
                  fill="#fff" opacity={0.55}
                />;
              })
            )}
          </g>
        );
      })}

      {/* Pixel trees at street level */}
      {[25, 110, 210, 310, 410, 510, 620].map((tx, ti) => {
        const g1 = ti % 3 === 0 ? "#3cb060" : ti % 3 === 1 ? "#2e9e50" : "#48c870";
        const g2 = ti % 3 === 0 ? "#2e9e50" : ti % 3 === 1 ? "#228840" : "#3cb060";
        const trunk = "#8B6914";
        const ps = 2;
        return (
          <g key={`dt${ti}`} transform={`translate(${tx},${272})`} opacity={0.5}>
            <rect x={ps*2} y={0} width={ps*3} height={ps} fill={g1}/>
            <rect x={ps*1} y={ps} width={ps*5} height={ps} fill={g1}/>
            <rect x={ps*0} y={ps*2} width={ps*7} height={ps} fill={g2}/>
            <rect x={ps*0} y={ps*3} width={ps*7} height={ps} fill={g1}/>
            <rect x={ps*1} y={ps*4} width={ps*5} height={ps} fill={g2}/>
            <rect x={ps*2} y={ps*5} width={ps*3} height={ps} fill={g2}/>
            <rect x={ps*3} y={ps*6} width={ps*1} height={ps*2} fill={trunk}/>
          </g>
        );
      })}

      {/* Animated bike going right */}
      <g>
        <animateTransform attributeName="transform" type="translate" from="-40 0" to="760 0" dur="11s" repeatCount="indefinite"/>
        <circle cx={0} cy={290} r={5} fill="none" stroke="#C026D3" strokeWidth={1.5} opacity={0.5}/>
        <circle cx={16} cy={290} r={5} fill="none" stroke="#C026D3" strokeWidth={1.5} opacity={0.5}/>
        <line x1={0} y1={290} x2={8} y2={280} stroke="#A78BFA" strokeWidth={1.2} opacity={0.5}/>
        <line x1={8} y1={280} x2={16} y2={290} stroke="#A78BFA" strokeWidth={1.2} opacity={0.5}/>
        <line x1={8} y1={280} x2={3} y2={280} stroke="#A78BFA" strokeWidth={1.2} opacity={0.5}/>
        <circle cx={6} cy={274} r={3} fill="#FDE68A" opacity={0.5}/>
      </g>

      {/* Animated bike going left */}
      <g>
        <animateTransform attributeName="transform" type="translate" from="760 0" to="-40 0" dur="15s" begin="-5s" repeatCount="indefinite"/>
        <circle cx={0} cy={290} r={4.5} fill="none" stroke="#10B981" strokeWidth={1.3} opacity={0.4}/>
        <circle cx={14} cy={290} r={4.5} fill="none" stroke="#10B981" strokeWidth={1.3} opacity={0.4}/>
        <line x1={0} y1={290} x2={7} y2={281} stroke="#3B82F6" strokeWidth={1} opacity={0.4}/>
        <line x1={7} y1={281} x2={14} y2={290} stroke="#3B82F6" strokeWidth={1} opacity={0.4}/>
        <circle cx={5} cy={276} r={2.5} fill="#F9A8D4" opacity={0.4}/>
      </g>

      {/* Street / ground */}
      <rect x={0} y={294} width={720} height={6} fill="#606870" opacity={0.25}/>
      <rect x={0} y={296} width={720} height={1} fill="#FDE68A" opacity={0.12}/>
    </svg>
  );
}

/* ── Astral Bike Preview — faithful reproduction ── */
function AstralBikePreview() {
  const { t } = useLanguage();
  const ab = t.tplContent.astralbike;
  const bg = "#c0ddf0";
  const surface = "#c0ddf0";
  const accent = "#9333EA";
  const amber = "#FDE68A";
  const text = "#1E0B35";
  const muted = "#6B21A8";
  const bd = "rgba(124,58,237,0.15)";
  const font = "'Courier New', Courier, monospace";

  return (
    <div style={{ background: bg, fontFamily: font, overflow: "hidden" }}>
      {/* ═══ DARK SECTION: Hero ═══ */}
      <div style={{ position: "relative" }}>
        <CityBgMini />
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", padding: "36px 28px", gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: text, lineHeight: 1.12, textTransform: "uppercase" as const }}>
              {ab.heroTitle1}<br/><span style={{ color: amber, textShadow: "-1px -1px 0 #1a1a2e, 1px -1px 0 #1a1a2e, -1px 1px 0 #1a1a2e, 1px 1px 0 #1a1a2e" }}>{ab.heroTitle2}</span>
            </div>
            <p style={{ color: muted, fontSize: 11, lineHeight: 1.7, margin: "14px 0 18px", maxWidth: 300 }}>
              {ab.heroDesc}
            </p>
            <div style={{
              display: "inline-block", background: accent, color: "#ffffff", fontSize: 12, fontWeight: 800,
              padding: "11px 26px", borderRadius: 14,
              boxShadow: "0 0 20px rgba(192,38,211,0.4)",
            }}>{ab.seePlans}</div>
            <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
              <span style={{ color: muted, fontSize: 10 }}>✓ {ab.noSub}</span>
              <span style={{ color: muted, fontSize: 10 }}>✓ {ab.cancelAnytime}</span>
            </div>
          </div>
          <div style={{ flexShrink: 0, animation: "float 3.5s ease-in-out infinite" }}>
            <AstralRobotSVG scale={1.6} />
          </div>
        </div>
      </div>

      {/* ═══ WHITE SECTION: Stats → Onde estamos → Features → Como funciona ═══ */}
      <div style={{ position: "relative", background: "#e8f4fc", overflow: "hidden", paddingBottom: 80 }}>
        {/* Nature background behind everything */}
        <NatureBg />

        {/* Content on top */}
        <div style={{ position: "relative", zIndex: 1 }}>

          {/* Stats bar */}
          <div style={{
            display: "flex", justifyContent: "space-around", padding: "16px 20px", margin: "24px 20px",
            background: "rgba(255,255,255,0.85)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: 14,
            backdropFilter: "blur(8px)",
          }}>
            {[{v:"51",l:ab.stat1},{v:"500",l:ab.stat2},{v:"24h",l:ab.stat3},{v:"100%",l:ab.stat4}].map((s,i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: accent }}>{s.v}</div>
                <div style={{ fontSize: 9, color: "#6B21A8", textTransform: "uppercase" as const, marginTop: 3, letterSpacing: 1 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Onde estamos */}
          <div style={{ padding: "0 20px 28px" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#1E0B35", textAlign: "center", marginBottom: 18 }}>{ab.whereWeAre}</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {[
                {name:ab.countryBR,cities:["Belo Horizonte","Salvador","Rio de Janeiro","São Paulo","Curitiba","Florianópolis","Porto Alegre","Pernambuco"],flag:"🇧🇷"},
                {name:ab.countryAR,cities:["Buenos Aires","Nordelta"],flag:"🇦🇷"},
                {name:ab.countryCL,cities:["Santiago"],flag:"🇨🇱"},
                {name:ab.countryCO,cities:["Bogotá"],flag:"🇨🇴"},
              ].map(c => (
                <div key={c.name} style={{ background: "rgba(255,255,255,0.82)", border: "1px solid rgba(124,58,237,0.12)", borderRadius: 14, padding: "14px 16px", minWidth: 120, backdropFilter: "blur(6px)" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#1E0B35", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 16 }}>{c.flag}</span> {c.name}
                  </div>
                  {c.cities.map(city => (
                    <div key={city} style={{ fontSize: 10, color: "#6B21A8", lineHeight: 1.7 }}>• {city}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div style={{ padding: "0 20px 28px" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#1E0B35", textAlign: "center", marginBottom: 18 }}>{ab.whyTitle}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {[
                {icon:"⚡",title:ab.f1,desc:ab.f1d},
                {icon:"📍",title:ab.f2,desc:ab.f2d},
                {icon:"⏱",title:ab.f3,desc:ab.f3d},
                {icon:"🔄",title:ab.f4,desc:ab.f4d},
                {icon:"🚲",title:ab.f5,desc:ab.f5d},
                {icon:"🏙",title:ab.f6,desc:ab.f6d},
              ].map((f,i) => (
                <div key={i} style={{ padding: "14px 12px" }}>
                  <div style={{
                    width: 36, height: 36, background: "rgba(124,58,237,0.1)", borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginBottom: 8,
                  }}>{f.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#1E0B35", marginBottom: 4 }}>{f.title}</div>
                  <div style={{ fontSize: 10, color: "#6B21A8", lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Como funciona */}
          <div style={{ padding: "0 20px 32px" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#1E0B35", textAlign: "center", marginBottom: 18 }}>{ab.howTitle}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 28 }}>
              {[
                {num:"1",title:ab.h1,desc:ab.h1d},
                {num:"2",title:ab.h2,desc:ab.h2d},
                {num:"3",title:ab.h3,desc:ab.h3d},
              ].map((s,i) => (
                <div key={i} style={{ textAlign: "center", width: 140 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 17, background: accent, color: "#fff",
                    fontSize: 15, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 10px", boxShadow: "0 0 12px rgba(192,38,211,0.4)",
                  }}>{s.num}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#1E0B35", marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 10, color: "#6B21A8", lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ DARK SECTION: Bottom CTA "Bora pro pedal?" ═══ */}
      <div style={{ position: "relative", textAlign: "center", padding: "36px 24px", background: surface, overflow: "hidden" }}>
        <CityBgMini />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14, animation: "float 4s ease-in-out infinite" }}>
            <WheelieRobotSVG scale={1.4} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: amber, textTransform: "uppercase" as const, marginBottom: 10, textShadow: "-1px -1px 0 #1a1a2e, 1px -1px 0 #1a1a2e, -1px 1px 0 #1a1a2e, 1px 1px 0 #1a1a2e" }}>
            {ab.ctaTitle}
          </div>
          <p style={{ color: muted, fontSize: 12, marginBottom: 16 }}>{ab.ctaSub}</p>
          <div style={{
            display: "inline-block", background: accent, color: "#ffffff", fontSize: 12, fontWeight: 800,
            padding: "11px 26px", borderRadius: 14, boxShadow: "0 0 20px rgba(192,38,211,0.4)",
          }}>{ab.seePlans}</div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ padding: "14px 20px", borderTop: `1px solid ${bd}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: amber, fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>⚡ ASTRAL BIKE</span>
        <span style={{ fontSize: 8, color: "rgba(167,139,250,0.5)" }}>powered by pigeonz.ai</span>
      </div>
    </div>
  );
}

/* ── Halloween background SVG for Tattoo Boo ── */
function HalloweenBg() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", imageRendering: "pixelated", shapeRendering: "crispEdges" }} preserveAspectRatio="xMidYMax slice" viewBox="0 0 720 300">
      {/* Night sky gradient */}
      <defs>
        <linearGradient id="hw-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0018"/>
          <stop offset="60%" stopColor="#120820"/>
          <stop offset="100%" stopColor="#1a0c28"/>
        </linearGradient>
        <radialGradient id="hw-moon-glow" cx="0.82" cy="0.15" r="0.18">
          <stop offset="0%" stopColor="#f0e8c0" stopOpacity={0.6}/>
          <stop offset="40%" stopColor="#f0e8c0" stopOpacity={0.2}/>
          <stop offset="100%" stopColor="#f0e8c0" stopOpacity={0}/>
        </radialGradient>
        <radialGradient id="hw-moon-inner" cx="0.45" cy="0.4" r="0.5">
          <stop offset="0%" stopColor="#fffde8"/>
          <stop offset="60%" stopColor="#f0e8c0"/>
          <stop offset="100%" stopColor="#d8d0a8"/>
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={720} height={300} fill="url(#hw-sky)"/>
      {/* Moon outer glow — animated pulse */}
      <circle cx={590} cy={42} r={55} fill="#f0e8c0" opacity={0.06}>
        <animate attributeName="r" values="55;65;55" dur="4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.06;0.12;0.06" dur="4s" repeatCount="indefinite"/>
      </circle>
      <circle cx={590} cy={42} r={35} fill="#f0e8c0" opacity={0.1}>
        <animate attributeName="r" values="35;42;35" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.1;0.18;0.1" dur="3s" repeatCount="indefinite"/>
      </circle>
      <rect x={0} y={0} width={720} height={300} fill="url(#hw-moon-glow)"/>
      {/* Full moon */}
      <circle cx={590} cy={42} r={20} fill="url(#hw-moon-inner)" opacity={0.95}/>
      {/* Moon craters — bold & visible */}
      <circle cx={582} cy={36} r={5} fill="#b8a870" opacity={0.45}/>
      <circle cx={582} cy={36} r={3.5} fill="#a09060" opacity={0.35}/>
      <circle cx={597} cy={47} r={4} fill="#b8a870" opacity={0.4}/>
      <circle cx={597} cy={47} r={2.8} fill="#a09060" opacity={0.3}/>
      <circle cx={586} cy={52} r={3} fill="#b8a870" opacity={0.4}/>
      <circle cx={586} cy={52} r={2} fill="#a09060" opacity={0.3}/>
      <circle cx={594} cy={34} r={2.5} fill="#b8a870" opacity={0.35}/>
      <circle cx={594} cy={34} r={1.6} fill="#a09060" opacity={0.25}/>
      <circle cx={578} cy={44} r={3.5} fill="#b8a870" opacity={0.38}/>
      <circle cx={578} cy={44} r={2.2} fill="#a09060" opacity={0.28}/>
      <circle cx={590} cy={42} r={2} fill="#b8a870" opacity={0.3}/>
      <circle cx={585} cy={46} r={1.8} fill="#b8a870" opacity={0.32}/>
      <circle cx={600} cy={40} r={2.2} fill="#b8a870" opacity={0.3}/>
      {/* Moon rim highlight */}
      <circle cx={590} cy={42} r={19.5} fill="none" stroke="#fffde8" strokeWidth={1} opacity={0.5}/>

      {/* Stars */}
      {Array.from({length: 30}).map((_,i) => {
        const sx = (i * 173 + 29) % 720;
        const sy = (i * 47 + 11) % 120;
        const sr = 0.6 + (i % 3) * 0.3;
        return <rect key={`hs${i}`} x={sx} y={sy} width={sr*2} height={sr*2} fill="#f0e8c0" opacity={0.2 + (i%4)*0.1}>
          <animate attributeName="opacity" values={`${0.15+(i%3)*0.08};${0.35+(i%3)*0.1};${0.15+(i%3)*0.08}`} dur={`${2+(i%4)}s`} repeatCount="indefinite"/>
        </rect>;
      })}

      {/* Bats flying */}
      {[
        {x:100,y:60,dur:8,dir:1,s:1},
        {x:400,y:35,dur:11,dir:-1,s:1.2},
        {x:250,y:80,dur:14,dir:1,s:0.8},
        {x:550,y:45,dur:9,dir:-1,s:1.1},
        {x:150,y:95,dur:12,dir:1,s:0.7},
        {x:650,y:55,dur:10,dir:-1,s:0.9},
      ].map((bat,i) => (
        <g key={`bat${i}`} opacity={0.3 + (i%3)*0.1}>
          <animateTransform attributeName="transform" type="translate" from={`${bat.dir>0?-80:780} ${bat.y}`} to={`${bat.dir>0?780:-80} ${bat.y}`} dur={`${bat.dur}s`} repeatCount="indefinite"/>
          {/* bat pixel art with wing flap */}
          <g transform={`scale(${bat.s})`}>
            <rect x={0} y={0} width={2} height={2} fill="#2a1040"/>
            <rect x={2} y={-2} width={2} height={2} fill="#2a1040"/>
            <rect x={4} y={-4} width={2} height={2} fill="#2a1040">
              <animate attributeName="y" values="-4;-2;-4" dur="0.4s" repeatCount="indefinite"/>
            </rect>
            <rect x={6} y={0} width={3} height={3} fill="#2a1040"/>
            <rect x={9} y={-4} width={2} height={2} fill="#2a1040">
              <animate attributeName="y" values="-4;-2;-4" dur="0.4s" repeatCount="indefinite"/>
            </rect>
            <rect x={11} y={-2} width={2} height={2} fill="#2a1040"/>
            <rect x={13} y={0} width={2} height={2} fill="#2a1040"/>
            <rect x={7} y={1} width={1} height={1} fill="#e83030" opacity={0.8}/>
          </g>
        </g>
      ))}

      {/* Ground - graveyard hill */}
      <ellipse cx={360} cy={300} rx={500} ry={60} fill="#0e0616" opacity={0.9}/>
      <ellipse cx={360} cy={300} rx={420} ry={45} fill="#140a20" opacity={0.8}/>

      {/* Gravestones */}
      {[40,120,210,320,430,530,620,690].map((gx,gi) => {
        const gh = 18 + (gi%3)*8;
        const gw = 12 + (gi%2)*4;
        const gy = 265 - gh + Math.sin(gi*2.3)*5;
        return (
          <g key={`gs${gi}`} opacity={0.35 + (gi%3)*0.1}>
            <rect x={gx} y={gy} width={gw} height={gh} fill="#2a1e3a" rx={gi%2===0 ? 3 : 0}/>
            {gi%2===0 && <rect x={gx+gw/2-4} y={gy+4} width={8} height={2} fill="#3a2e4a"/>}
            {gi%2===0 && <rect x={gx+gw/2-1} y={gy+2} width={2} height={8} fill="#3a2e4a"/>}
          </g>
        );
      })}

      {/* Pixel pumpkins */}
      {[80,280,500,660].map((px,pi) => {
        const py = 268 + (pi%2)*5;
        const ps = 2;
        return (
          <g key={`pk${pi}`} transform={`translate(${px},${py})`} opacity={0.5 + pi*0.08}>
            {/* stem */}
            <rect x={ps*3} y={0} width={ps} height={ps} fill="#3a6e20"/>
            {/* body */}
            <rect x={ps*1} y={ps} width={ps*5} height={ps} fill="#e87820"/>
            <rect x={ps*0} y={ps*2} width={ps*7} height={ps*2} fill="#e87820"/>
            <rect x={ps*1} y={ps*4} width={ps*5} height={ps} fill="#d06818"/>
            {/* face */}
            <rect x={ps*1} y={ps*2} width={ps} height={ps} fill="#1a0a00"/>{/* left eye */}
            <rect x={ps*5} y={ps*2} width={ps} height={ps} fill="#1a0a00"/>{/* right eye */}
            <rect x={ps*2} y={ps*3} width={ps*3} height={ps} fill="#1a0a00"/>{/* mouth */}
            <rect x={ps*3} y={ps*3} width={ps} height={ps} fill="#e87820"/>{/* tooth gap */}
          </g>
        );
      })}

      {/* Spooky tree — left side (Tim Burton style, curved paths) */}
      <g opacity={0.85} transform="translate(20 100) scale(0.55)">
        <animateTransform attributeName="transform" type="rotate" values="-0.8 55 280;0.8 55 280;-0.8 55 280" dur="6s" repeatCount="indefinite" additive="sum"/>
        {/* Trunk — curved, organic */}
        <path d="M55 280 Q52 240 48 200 Q44 160 50 130 Q54 110 52 95" stroke="#2d1a3d" strokeWidth={10} fill="none" strokeLinecap="round"/>
        <path d="M55 280 Q58 235 56 190 Q54 155 58 125 Q60 108 56 95" stroke="#221030" strokeWidth={6} fill="none" strokeLinecap="round"/>
        {/* Main branch right — elegant curve up */}
        <path d="M54 135 Q75 120 100 95 Q115 78 130 65" stroke="#2d1a3d" strokeWidth={5} fill="none" strokeLinecap="round"/>
        <path d="M110 82 Q120 60 115 45" stroke="#2d1a3d" strokeWidth={3} fill="none" strokeLinecap="round"/>
        <path d="M100 92 Q112 95 125 85" stroke="#221030" strokeWidth={2.5} fill="none" strokeLinecap="round"/>
        <path d="M130 65 Q138 55 145 58" stroke="#2d1a3d" strokeWidth={2} fill="none" strokeLinecap="round"/>
        <path d="M125 70 Q130 60 128 50" stroke="#221030" strokeWidth={2} fill="none" strokeLinecap="round"/>
        {/* Main branch left — sweeping curve */}
        <path d="M50 145 Q30 130 12 105 Q0 88 -5 70" stroke="#2d1a3d" strokeWidth={5} fill="none" strokeLinecap="round"/>
        <path d="M20 118 Q10 100 15 80" stroke="#221030" strokeWidth={2.5} fill="none" strokeLinecap="round"/>
        <path d="M12 105 Q-2 95 -8 85" stroke="#2d1a3d" strokeWidth={2} fill="none" strokeLinecap="round"/>
        <path d="M-5 70 Q-10 58 -5 48" stroke="#2d1a3d" strokeWidth={2} fill="none" strokeLinecap="round"/>
        {/* Upper branch — reaching up */}
        <path d="M52 110 Q45 85 38 60 Q34 45 30 30" stroke="#2d1a3d" strokeWidth={4} fill="none" strokeLinecap="round"/>
        <path d="M40 65 Q30 55 22 58" stroke="#221030" strokeWidth={2} fill="none" strokeLinecap="round"/>
        <path d="M38 55 Q42 40 48 30" stroke="#221030" strokeWidth={2} fill="none" strokeLinecap="round"/>
        <path d="M30 30 Q25 18 28 8" stroke="#2d1a3d" strokeWidth={1.5} fill="none" strokeLinecap="round"/>
        {/* Small twigs */}
        <path d="M56 120 Q72 110 82 100" stroke="#221030" strokeWidth={2} fill="none" strokeLinecap="round"/>
        <path d="M48 155 Q35 148 25 152" stroke="#221030" strokeWidth={2} fill="none" strokeLinecap="round"/>
        <path d="M52 170 Q65 160 75 155" stroke="#2d1a3d" strokeWidth={1.5} fill="none" strokeLinecap="round"/>
        <path d="M46 185 Q32 178 22 180" stroke="#221030" strokeWidth={1.5} fill="none" strokeLinecap="round"/>
        {/* Roots — spreading */}
        <path d="M50 278 Q35 282 20 280" stroke="#2d1a3d" strokeWidth={5} fill="none" strokeLinecap="round"/>
        <path d="M58 278 Q72 284 85 280" stroke="#2d1a3d" strokeWidth={4} fill="none" strokeLinecap="round"/>
        <path d="M46 280 Q40 288 30 290" stroke="#221030" strokeWidth={3} fill="none" strokeLinecap="round"/>
      </g>

      {/* Dead crooked trees swaying */}
      {[{x:30,lean:-8},{x:150,lean:5},{x:320,lean:-6},{x:480,lean:7},{x:600,lean:-5},{x:700,lean:4}].map((tree,ti) => {
        const ty = 235 + (ti%3)*8;
        const dur = 3 + (ti%4)*1.5;
        return (
          <g key={`dt${ti}`} opacity={0.3 + (ti%2)*0.12}>
            <animateTransform attributeName="transform" type="rotate" from={`${tree.lean-2} ${tree.x} ${ty+35}`} to={`${tree.lean+2} ${tree.x} ${ty+35}`} dur={`${dur}s`} repeatCount="indefinite" additive="sum" values={`${tree.lean-2} ${tree.x} ${ty+35};${tree.lean+2} ${tree.x} ${ty+35};${tree.lean-2} ${tree.x} ${ty+35}`} keyTimes="0;0.5;1"/>
            {/* trunk - crooked */}
            <rect x={tree.x} y={ty} width={3} height={35} fill="#1e1028"/>
            <rect x={tree.x+1} y={ty-3} width={2} height={5} fill="#1e1028"/>
            {/* branches */}
            <rect x={tree.x-8} y={ty+5} width={9} height={2} fill="#1e1028" transform={`rotate(-35 ${tree.x} ${ty+6})`}/>
            <rect x={tree.x-5} y={ty+4} width={6} height={2} fill="#1e1028" transform={`rotate(-55 ${tree.x-5} ${ty+5})`}/>
            <rect x={tree.x+3} y={ty+9} width={10} height={2} fill="#1e1028" transform={`rotate(28 ${tree.x+3} ${ty+10})`}/>
            <rect x={tree.x+5} y={ty+8} width={7} height={2} fill="#1e1028" transform={`rotate(50 ${tree.x+5} ${ty+9})`}/>
            <rect x={tree.x-6} y={ty+16} width={7} height={2} fill="#1e1028" transform={`rotate(-25 ${tree.x} ${ty+17})`}/>
            <rect x={tree.x+3} y={ty+22} width={8} height={2} fill="#1e1028" transform={`rotate(20 ${tree.x+3} ${ty+23})`}/>
          </g>
        );
      })}

      {/* Fog/mist at bottom */}
      <rect x={0} y={275} width={720} height={25} fill="#1a0c28" opacity={0.5}/>
      <ellipse cx={200} cy={280} rx={120} ry={8} fill="#2a1840" opacity={0.3}>
        <animateTransform attributeName="transform" type="translate" from="-20 0" to="20 0" dur="6s" repeatCount="indefinite" additive="sum"/>
      </ellipse>
      <ellipse cx={500} cy={285} rx={100} ry={6} fill="#2a1840" opacity={0.25}>
        <animateTransform attributeName="transform" type="translate" from="15 0" to="-15 0" dur="8s" repeatCount="indefinite" additive="sum"/>
      </ellipse>
    </svg>
  );
}

/* ── Pixel Ghost for Tattoo Boo ── */
function BooGhost({ size = 80 }: { size?: number }) {
  const [blink, setBlink] = useState(false);
  const [tongue, setTongue] = useState(false);

  useEffect(() => {
    const blinkLoop = () => {
      const delay = 2200 + Math.random() * 2000;
      const id = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 160);
        blinkLoop();
      }, delay);
      return id;
    };
    const id = blinkLoop();
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const tongueLoop = () => {
      const delay = 4000 + Math.random() * 3000;
      const id = setTimeout(() => {
        setTongue(true);
        setTimeout(() => setTongue(false), 1400);
        tongueLoop();
      }, delay);
      return id;
    };
    const id = tongueLoop();
    return () => clearTimeout(id);
  }, []);

  const s = size / 14;
  const _ = null;
  const W = "#f0ece4";  // ghost body
  const Wl = "#e8e0d4"; // ghost light shade
  const Wd = "#d0c8b8"; // ghost shadow
  const E = "#0a0a0a";  // eyes
  const R = "#e83030";  // red (accent)
  const P = "#c020a0";  // tongue pink

  // 14 cols × 16 rows
  const grid: (string | null)[][] = [
    [_,_,_,_,W,W,W,W,W,W,_,_,_,_],
    [_,_,_,W,W,W,W,W,W,W,W,_,_,_],
    [_,_,W,W,W,W,W,W,W,W,W,W,_,_],
    [_,W,W,W,W,W,W,W,W,W,W,W,W,_],
    [_,W,W,Wl,W,W,W,W,W,W,Wl,W,W,_],
    [_,W,W,E,E,W,W,W,W,E,E,W,W,_],  // eyes row
    [_,W,W,E,E,W,W,W,W,E,E,W,W,_],
    [_,W,P,W,W,W,W,W,W,W,W,P,W,_],  // blush cheeks
    [_,W,W,W,W,W,Wd,Wd,W,W,W,W,W,_], // mouth area
    [_,W,W,W,W,W,W,W,W,W,W,W,W,_],
    [_,W,W,W,W,W,W,W,W,W,W,W,W,_],
    [_,W,Wd,W,W,W,W,W,W,W,W,Wd,W,_],
    [_,W,W,Wd,W,W,W,W,W,W,Wd,W,W,_],
    [W,W,_,W,W,_,W,W,_,W,W,_,W,W],  // wavy bottom
    [W,_,_,_,W,_,_,_,_,_,W,_,_,W],
  ];

  // Blink: close eyes
  if (blink) {
    grid[5] = [_,W,W,E,E,W,W,W,W,E,E,W,W,_];
    grid[6] = [_,W,W,W,W,W,W,W,W,W,W,W,W,_];
  }

  // Tongue: add tongue sticking out
  if (tongue) {
    grid[8] = [_,W,W,W,W,E,E,E,E,W,W,W,W,_]; // open mouth
    grid[9] = [_,W,W,W,W,W,P,P,W,W,W,W,W,_]; // tongue
  }

  const cols = 14;
  const rows = grid.length;

  return (
    <svg width={cols * s} height={rows * s} viewBox={`0 0 ${cols * s} ${rows * s}`}
      style={{ imageRendering: "pixelated", shapeRendering: "crispEdges" }}>
      {grid.map((row, ri) =>
        row.map((c, ci) => c ? <rect key={`${ri}-${ci}`} x={ci * s} y={ri * s} width={s} height={s} fill={c} /> : null)
      )}
      {/* Red headband */}
      <rect x={0} y={3 * s} width={cols * s} height={s * 0.6} fill={R} opacity={0.85}/>
    </svg>
  );
}

/* ── Tattoo Boo Preview — dark tattoo studio ── */
function TattooBooPreview() {
  const { t } = useLanguage();
  const tb = t.tplContent.tattooboo;
  const bg = "#0a0a0a";
  const surface = "#141414";
  const accent = "#e83030";
  const gold = "#d4a853";
  const text = "#f0ece4";
  const muted = "#8a8278";
  const font = "'Georgia', serif";

  return (
    <div style={{ background: bg, fontFamily: font, overflow: "hidden", color: text }}>
      {/* ═══ Hero ═══ */}
      <div style={{ position: "relative", padding: "40px 28px 32px", textAlign: "center", borderBottom: `1px solid ${accent}22` }}>
        <HalloweenBg />
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Ghost mascot - floating */}
          <div style={{ animation: "float 3.5s ease-in-out infinite", margin: "0 auto 14px", width: "fit-content" }}>
            <BooGhost size={72} />
          </div>
          <div style={{ fontSize: 9, letterSpacing: 6, color: gold, textTransform: "uppercase", marginBottom: 8, fontFamily: "'Courier New', monospace" }}>EST. 2019</div>
          <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", lineHeight: 1.1 }}>
            Tattoo <span style={{ color: accent }}>Boo</span>
          </div>
          <div style={{ fontSize: 11, color: "#FDE68A", marginTop: 10, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'Courier New', monospace", textShadow: "0 0 10px rgba(253,230,138,0.4), 0 0 20px rgba(253,230,138,0.15)" }}>
            {tb.studioTag}
          </div>
          <div style={{
            display: "inline-block", marginTop: 18, background: accent, color: "#fff",
            fontSize: 11, fontWeight: 800, padding: "10px 28px", letterSpacing: 2,
            textTransform: "uppercase", fontFamily: "'Courier New', monospace",
          }}>{tb.bookSession}</div>
        </div>
      </div>

      {/* ═══ Gallery / Portfolio ═══ */}
      <div style={{ padding: "28px 20px", background: surface }}>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 8, letterSpacing: 5, color: gold, textTransform: "uppercase", marginBottom: 6, fontFamily: "'Courier New', monospace" }}>{tb.portfolio}</div>
          <div style={{ fontSize: 18, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>{tb.ourWork}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
          {[
            { type: "photo", src: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=300&h=300&fit=crop&q=80" },
            { type: "flash", pos: "50% 0%" },
            { type: "photo", src: "/tattoo-artist.png" },
            { type: "flash", pos: "0% 100%" },
            { type: "photo", src: "https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=300&h=300&fit=crop&q=80" },
            { type: "flash", pos: "100% 100%" },
          ].map((item, i) => (
            <div key={i} style={{ aspectRatio: "1", overflow: "hidden", background: "#1a1a1a" }}>
              {item.type === "photo" ? (
                <img src={item.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85, filter: "saturate(0.8)" }}/>
              ) : (
                <img src="/tattoo-flash.png" alt="" style={{ width: "200%", height: "200%", objectFit: "cover", objectPosition: item.pos, opacity: 0.9 }}/>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Estilos ═══ */}
      <div style={{ padding: "28px 20px", borderTop: `1px solid ${accent}15` }}>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 8, letterSpacing: 5, color: gold, textTransform: "uppercase", marginBottom: 6, fontFamily: "'Courier New', monospace" }}>{tb.specialties}</div>
          <div style={{ fontSize: 18, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>{tb.styles}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { icon: "✦", name: tb.s1, desc: tb.s1d },
            { icon: "◈", name: tb.s2, desc: tb.s2d },
            { icon: "❋", name: tb.s3, desc: tb.s3d },
            { icon: "✸", name: tb.s4, desc: tb.s4d },
            { icon: "◉", name: tb.s5, desc: tb.s5d },
            { icon: "✧", name: tb.s6, desc: tb.s6d },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "14px 8px", background: surface, border: `1px solid ${accent}18` }}>
              <div style={{ fontSize: 20, color: accent, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: text, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Courier New', monospace" }}>{s.name}</div>
              <div style={{ fontSize: 9, color: muted, lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Artistas ═══ */}
      <div style={{ padding: "28px 20px", background: surface, borderTop: `1px solid ${accent}15` }}>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 8, letterSpacing: 5, color: gold, textTransform: "uppercase", marginBottom: 6, fontFamily: "'Courier New', monospace" }}>{tb.team}</div>
          <div style={{ fontSize: 18, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>{tb.artists}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          {[
            { name: "Skull", style: "Blackwork / Realismo", img: "/tattoo-artist1.png" },
            { name: "Luna", style: "Fineline / Dotwork", img: "/tattoo-artist2.png" },
            { name: "Rex", style: "Old School / Lettering", img: "/tattoo-artist3.png" },
          ].map((a, i) => (
            <div key={i} style={{ textAlign: "center", width: 130 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", margin: "0 auto 10px", border: `2px solid ${accent}40` }}>
                <img src={a.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.7)" }}/>
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, color: text, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Courier New', monospace" }}>{a.name}</div>
              <div style={{ fontSize: 9, color: gold, marginTop: 3 }}>{a.style}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Preços ═══ */}
      <div style={{ padding: "28px 20px", borderTop: `1px solid ${accent}15` }}>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 8, letterSpacing: 5, color: gold, textTransform: "uppercase", marginBottom: 6, fontFamily: "'Courier New', monospace" }}>{tb.investment}</div>
          <div style={{ fontSize: 18, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>{tb.prices}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          {[
            { name: tb.p1, size: tb.p1size, price: tb.p1price, desc: tb.p1d },
            { name: tb.p2, size: tb.p2size, price: tb.p2price, desc: tb.p2d },
            { name: tb.p3, size: tb.p3size, price: tb.p3price, desc: tb.p3d },
          ].map((p, i) => (
            <div key={i} style={{ flex: 1, padding: "16px 12px", background: surface, border: `1px solid ${i === 1 ? accent + "50" : accent + "18"}`, textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: text, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Courier New', monospace" }}>{p.name}</div>
              <div style={{ fontSize: 9, color: muted, marginTop: 4 }}>{p.size}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: accent, margin: "10px 0 6px" }}>{p.price}</div>
              <div style={{ fontSize: 9, color: muted, lineHeight: 1.5 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ CTA ═══ */}
      <div style={{ position: "relative", padding: "40px 24px 32px", textAlign: "center", background: surface, borderTop: `1px solid ${accent}15` }}>
        <HalloweenBg />
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Ghost + speech bubble */}
          <div style={{ position: "relative", animation: "float 4s ease-in-out infinite", marginBottom: 16 }}>
            {/* Round speech bubble */}
            <div style={{
              position: "absolute", top: -14, right: -52,
              background: "#f0ece4", color: "#0a0a0a",
              fontFamily: "'Press Start 2P', monospace", fontSize: 9,
              width: 44, height: 44, borderRadius: "50%",
              border: "2px solid #0a0a0a",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "2px 2px 0 #0a0a0a",
            }}>
              boo!
              {/* Triangle pointer */}
              <div style={{
                position: "absolute", bottom: -7, left: 10,
                width: 0, height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: "7px solid #0a0a0a",
              }}/>
              <div style={{
                position: "absolute", bottom: -4, left: 12,
                width: 0, height: 0,
                borderLeft: "3px solid transparent",
                borderRight: "3px solid transparent",
                borderTop: "5px solid #f0ece4",
              }}/>
            </div>
            <BooGhost size={64} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
            {tb.ctaTitle}
          </div>
          <div style={{ fontSize: 10, color: muted, marginBottom: 16 }}>{tb.ctaSub}</div>
          <div style={{
            display: "inline-block", background: accent, color: "#fff",
            fontSize: 11, fontWeight: 800, padding: "10px 28px", letterSpacing: 2,
            textTransform: "uppercase", fontFamily: "'Courier New', monospace",
          }}>{tb.ctaBtn}</div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ padding: "14px 20px", borderTop: `1px solid ${accent}22`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: text, fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Courier New', monospace" }}>☠ Tattoo Boo</span>
        <span style={{ fontSize: 8, color: muted }}>powered by pigeonz.ai</span>
      </div>
    </div>
  );
}

/* ── Law Firm Background Slideshow — city → office → courthouse ── */
function LawBgSlideshow() {
  const imgs = [
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop&q=80", // city skyline
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop&q=80", // law office
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=400&fit=crop&q=80", // courthouse / gavel
  ];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {imgs.map((src, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${src})`,
          backgroundSize: "cover", backgroundPosition: "center",
          animation: `lawSlide${i} ${imgs.length * 5}s ease-in-out infinite`,
          opacity: 0,
        }}/>
      ))}
      {/* Dark overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,24,40,0.82) 0%, rgba(0,48,80,0.75) 100%)" }}/>
      <style>{`
        @keyframes lawSlide0 { 0%,5%{opacity:1} 28%,33%{opacity:0} 95%,100%{opacity:1} }
        @keyframes lawSlide1 { 0%,28%{opacity:0} 33%,38%{opacity:1} 61%,66%{opacity:0} }
        @keyframes lawSlide2 { 0%,61%{opacity:0} 66%,71%{opacity:1} 94%,100%{opacity:0} }
      `}</style>
    </div>
  );
}

/* ── Pixel Scales of Justice for Law Firm ── */
function ScalesOfJusticeSVG({ size = 60 }: { size?: number }) {
  const s = size / 14;
  return (
    <svg width={14 * s} height={16 * s} viewBox={`0 0 ${14 * s} ${16 * s}`} style={{ imageRendering: "pixelated", shapeRendering: "crispEdges" }}>
      {/* Center pillar */}
      <rect x={6*s} y={2*s} width={2*s} height={12*s} fill="#B6A281"/>
      {/* Base */}
      <rect x={3*s} y={14*s} width={8*s} height={s} fill="#B6A281"/>
      <rect x={4*s} y={13*s} width={6*s} height={s} fill="#c8b490"/>
      {/* Top ornament */}
      <rect x={5*s} y={0} width={4*s} height={s} fill="#d4c4a0"/>
      <rect x={6*s} y={s} width={2*s} height={s} fill="#B6A281"/>
      {/* Beam */}
      <rect x={0} y={3*s} width={14*s} height={s} fill="#c8b490"/>
      {/* Left plate */}
      <rect x={0} y={4*s} width={s} height={3*s} fill="#B6A281"/>
      <rect x={4*s} y={4*s} width={s} height={3*s} fill="#B6A281"/>
      <rect x={0} y={7*s} width={5*s} height={s} fill="#c8b490"/>
      {/* Right plate */}
      <rect x={9*s} y={4*s} width={s} height={3*s} fill="#B6A281"/>
      <rect x={13*s} y={4*s} width={s} height={3*s} fill="#B6A281"/>
      <rect x={9*s} y={7*s} width={5*s} height={s} fill="#c8b490"/>
    </svg>
  );
}

/* ── Law Firm Preview — Escritório de Advocacia ── */
function LawFirmPreview() {
  const { t } = useLanguage();
  const lf = t.tplContent.lawfirm;
  const navy = "#003050";
  const darkNavy = "#001828";
  const gold = "#B6A281";
  const goldLight = "#d4c4a0";
  const white = "#f8f6f2";
  const muted = "#8a9aaa";
  const surface = "#002040";
  const font = "'Georgia', serif";

  return (
    <div style={{ background: darkNavy, fontFamily: font, overflow: "hidden", color: white }}>
      {/* ═══ Hero ═══ */}
      <div style={{
        position: "relative", padding: "44px 28px 36px", textAlign: "center",
        borderBottom: `2px solid ${gold}30`, overflow: "hidden",
      }}>
        <LawBgSlideshow />
        {/* Decorative gold line top */}
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${gold}, transparent)`, zIndex: 1 }}/>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ margin: "0 auto 16px", width: "fit-content", opacity: 0.8 }}>
            <ScalesOfJusticeSVG size={52} />
          </div>
          <div style={{ fontSize: 9, letterSpacing: 6, color: gold, textTransform: "uppercase", marginBottom: 10 }}>
            {lf.lawOffice}
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", lineHeight: 1.2 }}>
            Law Fall &<br/><span style={{ color: gold }}>Associados</span>
          </div>
          <div style={{ width: 50, height: 1, background: gold, margin: "16px auto", opacity: 0.6 }}/>
          <div style={{ fontSize: 12, color: muted, lineHeight: 1.7, maxWidth: 320, margin: "0 auto 20px", fontStyle: "italic" }}>
            {lf.tagline}
          </div>
          <div style={{
            display: "inline-block", background: "transparent", color: gold,
            fontSize: 10, fontWeight: 700, padding: "10px 30px", letterSpacing: 3,
            textTransform: "uppercase", border: `1px solid ${gold}`,
          }}>{lf.freeConsult}</div>
        </div>
      </div>

      {/* ═══ Áreas de Atuação ═══ */}
      <div style={{ padding: "30px 20px", background: surface }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 8, letterSpacing: 5, color: gold, textTransform: "uppercase", marginBottom: 6 }}>{lf.specialties}</div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>{lf.practiceAreas}</div>
          <div style={{ width: 40, height: 1, background: gold, margin: "10px auto 0", opacity: 0.4 }}/>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {[
            { name: lf.area1, desc: lf.area1d, svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B6A281" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M5 7h14"/><path d="M3 11l4-4v6l-4-2z"/><path d="M21 11l-4-4v6l4-2z"/><rect x="10" y="19" width="4" height="2" rx="0.5" fill="#B6A281" stroke="none"/></svg> },
            { name: lf.area2, desc: lf.area2d, svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B6A281" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="8" width="16" height="13" rx="1"/><path d="M8 8V5a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15" r="2"/></svg> },
            { name: lf.area3, desc: lf.area3d, svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B6A281" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2l4 4-9.5 9.5-4.5 1 1-4.5z"/><path d="M3 22h18"/></svg> },
            { name: lf.area4, desc: lf.area4d, svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B6A281" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2m0 16v2M2 12h2m16 0h2"/><circle cx="12" cy="12" r="6"/><path d="M12 9v3l2 1"/></svg> },
            { name: lf.area5, desc: lf.area5d, svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B6A281" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><rect x="9" y="13" width="6" height="8"/><path d="M9 9h6"/></svg> },
            { name: lf.area6, desc: lf.area6d, svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B6A281" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 0 1 5 5c0 4-5 7-5 7s-5-3-5-7a5 5 0 0 1 5-5z"/><path d="M12 22v-8"/><path d="M8 22h8"/></svg> },
          ].map((a, i) => (
            <div key={i} style={{
              textAlign: "center", padding: "16px 8px",
              background: `${darkNavy}cc`, border: `1px solid ${gold}18`,
              transition: "border-color 0.3s",
            }}>
              <div style={{ marginBottom: 8, display: "flex", justifyContent: "center" }}>{a.svg}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: gold, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{a.name}</div>
              <div style={{ fontSize: 8, color: muted, lineHeight: 1.5 }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Sobre / Números ═══ */}
      <div style={{
        padding: "28px 24px",
        background: `linear-gradient(135deg, ${darkNavy}, ${navy})`,
        borderTop: `1px solid ${gold}15`, borderBottom: `1px solid ${gold}15`,
      }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 8, letterSpacing: 5, color: gold, textTransform: "uppercase", marginBottom: 6 }}>{lf.whyUs}</div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>{lf.proven}</div>
          <div style={{ width: 40, height: 1, background: gold, margin: "10px auto 0", opacity: 0.4 }}/>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
          {[
            { value: "20+", label: lf.years },
            { value: "5.000+", label: lf.cases },
            { value: "98%", label: lf.satisfaction },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: gold, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 8, color: muted, marginTop: 6, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Equipe ═══ */}
      <div style={{ padding: "28px 20px", background: surface }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 8, letterSpacing: 5, color: gold, textTransform: "uppercase", marginBottom: 6 }}>{lf.ourTeam}</div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>{lf.lawyers}</div>
          <div style={{ width: 40, height: 1, background: gold, margin: "10px auto 0", opacity: 0.4 }}/>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          {[
            { name: lf.l1, oab: lf.l1lic, area: lf.l1area, img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop" },
            { name: lf.l2, oab: lf.l2lic, area: lf.l2area, img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop" },
            { name: lf.l3, oab: lf.l3lic, area: lf.l3area, img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop" },
          ].map((a, i) => (
            <div key={i} style={{ textAlign: "center", width: 120 }}>
              <div style={{
                width: 68, height: 68, borderRadius: "50%", overflow: "hidden",
                margin: "0 auto 10px", border: `2px solid ${gold}40`,
                filter: "grayscale(0.4)",
              }}>
                <img src={a.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: white }}>{a.name}</div>
              <div style={{ fontSize: 8, color: gold, marginTop: 2 }}>{a.area}</div>
              <div style={{ fontSize: 7, color: muted, marginTop: 2 }}>{a.oab}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Depoimentos ═══ */}
      <div style={{
        padding: "28px 24px",
        background: `linear-gradient(135deg, ${navy}, ${darkNavy})`,
        borderTop: `1px solid ${gold}15`,
      }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 8, letterSpacing: 5, color: gold, textTransform: "uppercase", marginBottom: 6 }}>{lf.testimonials}</div>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2 }}>{lf.whatClients}</div>
        </div>
        <div style={{
          background: `${surface}cc`, border: `1px solid ${gold}15`,
          padding: "18px 20px", textAlign: "center", fontStyle: "italic",
        }}>
          <div style={{ fontSize: 22, color: gold, marginBottom: 8, lineHeight: 1 }}>&ldquo;</div>
          <div style={{ fontSize: 11, color: "#c0c8d0", lineHeight: 1.7, marginBottom: 10 }}>
            {lf.testimonial1}
          </div>
          <div style={{ fontSize: 9, color: gold }}>{lf.testimonial1Author}</div>
        </div>
      </div>

      {/* ═══ CTA / Contato ═══ */}
      <div style={{
        position: "relative", padding: "32px 24px", textAlign: "center",
        borderTop: `1px solid ${gold}20`, overflow: "hidden",
      }}>
        <LawBgSlideshow />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ margin: "0 auto 12px", opacity: 0.6 }}>
            <ScalesOfJusticeSVG size={36} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>
            {lf.need} <span style={{ color: gold }}>{lf.legalHelp}</span>?
          </div>
          <div style={{ fontSize: 10, color: muted, marginBottom: 18, lineHeight: 1.6 }}>
            {lf.ctaSub}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            <div style={{
              background: gold, color: darkNavy,
              fontSize: 10, fontWeight: 700, padding: "10px 24px", letterSpacing: 2,
              textTransform: "uppercase",
            }}>{lf.schedule}</div>
            <div style={{
              background: "transparent", color: gold,
              fontSize: 10, fontWeight: 700, padding: "10px 24px", letterSpacing: 2,
              textTransform: "uppercase", border: `1px solid ${gold}60`,
            }}>WhatsApp</div>
          </div>
          {/* Contact info */}
          <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 20 }}>
            {[
              { svg: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a9aaa" strokeWidth="2" strokeLinecap="round"><path d="M12 2C8 2 5 5.5 5 9.5 5 16 12 22 12 22s7-6 7-12.5C19 5.5 16 2 12 2z"/><circle cx="12" cy="9.5" r="2.5"/></svg>, text: lf.address },
              { svg: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a9aaa" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07A19.5 19.5 0 0 1 5.16 12.9 19.86 19.86 0 0 1 2.09 4.18 2 2 0 0 1 4.08 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 22 16.92z"/></svg>, text: lf.phone },
            ].map((c, i) => (
              <div key={i} style={{ fontSize: 9, color: muted, display: "flex", alignItems: "center", gap: 4 }}>
                {c.svg}{c.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ padding: "14px 20px", borderTop: `1px solid ${gold}22`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: goldLight, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>⚖ Law Fall & Associados</span>
        <span style={{ fontSize: 8, color: muted }}>powered by pigeonz.ai</span>
      </div>
    </div>
  );
}

/* ── Phone Mockup with auto-scrolling screens ── */
function PhoneMockup({ screens, interval = 3000, frameColor = "#1a1a1a" }: { screens: React.ReactNode[], interval?: number, frameColor?: string }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCurrent(p => (p + 1) % screens.length), interval);
    return () => clearInterval(id);
  }, [screens.length, interval]);

  return (
    <div style={{
      width: 180, height: 360, borderRadius: 28,
      background: frameColor, padding: "10px 6px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
      position: "relative", overflow: "hidden",
      border: `2px solid ${frameColor === "#1a1a1a" ? "#333" : "rgba(255,255,255,0.15)"}`,
    }}>
      {/* Notch */}
      <div style={{
        position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)",
        width: 60, height: 14, borderRadius: 10, background: frameColor, zIndex: 10,
      }}>
        <div style={{ position: "absolute", top: 5, left: "50%", transform: "translateX(-50%)", width: 6, height: 6, borderRadius: "50%", background: "#0a0a0a", border: "1px solid #222" }}/>
      </div>
      {/* Screen area */}
      <div style={{
        width: "100%", height: "100%", borderRadius: 20,
        overflow: "hidden", position: "relative", background: "#000",
      }}>
        {screens.map((screen, i) => (
          <div key={i} style={{
            position: "absolute", inset: 0,
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.6s ease-in-out",
          }}>
            {screen}
          </div>
        ))}
        {/* Dots indicator */}
        <div style={{
          position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: 5, zIndex: 5,
        }}>
          {screens.map((_, i) => (
            <div key={i} style={{
              width: i === current ? 14 : 5, height: 5, borderRadius: 3,
              background: i === current ? "#fff" : "rgba(255,255,255,0.35)",
              transition: "all 0.3s",
            }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Store badges — Apple & Google ── */
function StoreBadges() {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      {/* Apple */}
      <div style={{ background: "#000", color: "#fff", padding: "6px 12px", borderRadius: 7, border: "1px solid #444", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
        <div>
          <div style={{ fontSize: 5, lineHeight: 1, opacity: 0.8 }}>Disponível na</div>
          <div style={{ fontSize: 10, fontWeight: 700, lineHeight: 1.2 }}>App Store</div>
        </div>
      </div>
      {/* Google */}
      <div style={{ background: "#000", color: "#fff", padding: "6px 12px", borderRadius: 7, border: "1px solid #444", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
        <svg width="18" height="18" viewBox="0 0 24 24"><path d="M3.61 1.54L13.5 12 3.61 22.46A2 2 0 0 1 3 20.87V3.13c0-.6.22-1.17.61-1.59z" fill="#4285F4"/><path d="M17.16 9.89L14.5 12l2.66 2.11 3.27-1.89a1.13 1.13 0 0 0 0-1.96l-3.27-1.37z" fill="#FBBC04"/><path d="M3.61 22.46c.5.54 1.28.67 1.93.33l9.96-5.68L13.5 12 3.61 22.46z" fill="#EA4335"/><path d="M3.61 1.54C3.11 2.08 2.98 2.86 3.32 3.5L13.5 12l2-4.89L5.54 1.2c-.65-.34-1.43-.21-1.93.34z" fill="#34A853"/></svg>
        <div>
          <div style={{ fontSize: 5, lineHeight: 1, opacity: 0.8 }}>Disponível no</div>
          <div style={{ fontSize: 10, fontWeight: 700, lineHeight: 1.2 }}>Google Play</div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════ */
/* ── FitPulse — Fitness App Template               ── */
/* ══════════════════════════════════════════════════ */
function FitPulsePreview() {
  const { t } = useLanguage();
  const fp = t.tplContent.fitpulse;
  const bg = "#0a0a0a";
  const neon = "#39ff14";
  const dark = "#111";
  const text = "#f0f0f0";
  const muted = "#666";

  const screens = [
    // Tela 1 — Home / Dashboard
    <div key="s1" style={{ width: "100%", height: "100%", background: bg, padding: "28px 14px 14px", fontFamily: "system-ui" }}>
      <div style={{ fontSize: 8, color: muted, marginBottom: 2 }}>{fp.welcome}</div>
      <div style={{ fontSize: 14, fontWeight: 800, color: text, marginBottom: 12 }}>{fp.myWorkout}</div>
      <div style={{ background: dark, borderRadius: 10, padding: "12px 10px", marginBottom: 8, border: `1px solid ${neon}20` }}>
        <div style={{ fontSize: 7, color: neon, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>{fp.today}</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: text }}>{fp.workout1}</div>
        <div style={{ fontSize: 8, color: muted, marginTop: 4 }}>{fp.workout1Meta}</div>
        <div style={{ marginTop: 8, background: neon, borderRadius: 6, padding: "6px 0", textAlign: "center", fontSize: 9, fontWeight: 800, color: "#000" }}>{fp.startWorkout}</div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <div style={{ flex: 1, background: dark, borderRadius: 8, padding: 8, textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: neon }}>12</div>
          <div style={{ fontSize: 7, color: muted }}>{fp.workoutsMonth}</div>
        </div>
        <div style={{ flex: 1, background: dark, borderRadius: 8, padding: 8, textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: neon }}>540</div>
          <div style={{ fontSize: 7, color: muted }}>{fp.kcal}</div>
        </div>
      </div>
      <div style={{ marginTop: 8, background: dark, borderRadius: 8, padding: "8px 10px" }}>
        <div style={{ fontSize: 8, color: muted, marginBottom: 6 }}>{fp.weeklyProgress}</div>
        <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 40 }}>
          {[60,80,45,90,70,100,30].map((h,i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, background: i < 5 ? neon : `${neon}30`, borderRadius: 3, transition: "height 0.3s" }}/>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          {["S","T","Q","Q","S","S","D"].map((d,i) => <div key={i} style={{ fontSize: 6, color: muted, flex: 1, textAlign: "center" }}>{d}</div>)}
        </div>
      </div>
    </div>,
    // Tela 2 — Exercício em execução
    <div key="s2" style={{ width: "100%", height: "100%", background: bg, padding: "28px 14px 14px", fontFamily: "system-ui" }}>
      <div style={{ fontSize: 8, color: muted, textAlign: "center", marginBottom: 4 }}>{fp.exercise}</div>
      <div style={{ fontSize: 13, fontWeight: 800, color: text, textAlign: "center", marginBottom: 10 }}>{fp.benchPress}</div>
      <div style={{ width: 100, height: 100, borderRadius: "50%", border: `3px solid ${neon}`, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", background: dark }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, color: neon, textAlign: "center" }}>3</div>
          <div style={{ fontSize: 7, color: muted, textAlign: "center" }}>{fp.setsLeft}</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 12 }}>
        <div style={{ textAlign: "center" }}><div style={{ fontSize: 14, fontWeight: 800, color: text }}>12</div><div style={{ fontSize: 7, color: muted }}>{fp.reps}</div></div>
        <div style={{ textAlign: "center" }}><div style={{ fontSize: 14, fontWeight: 800, color: text }}>40kg</div><div style={{ fontSize: 7, color: muted }}>{fp.load}</div></div>
        <div style={{ textAlign: "center" }}><div style={{ fontSize: 14, fontWeight: 800, color: text }}>60s</div><div style={{ fontSize: 7, color: muted }}>{fp.rest}</div></div>
      </div>
      <div style={{ background: neon, borderRadius: 8, padding: "8px 0", textAlign: "center", fontSize: 10, fontWeight: 800, color: "#000", marginBottom: 6 }}>{fp.completeSeries}</div>
      <div style={{ background: dark, borderRadius: 8, padding: "8px 0", textAlign: "center", fontSize: 9, color: muted, border: `1px solid ${neon}20` }}>{fp.skip}</div>
    </div>,
    // Tela 3 — Planos
    <div key="s3" style={{ width: "100%", height: "100%", background: bg, padding: "28px 14px 14px", fontFamily: "system-ui" }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: text, textAlign: "center", marginBottom: 4 }}>{fp.plans}</div>
      <div style={{ fontSize: 8, color: muted, textAlign: "center", marginBottom: 12 }}>{fp.choosePlan}</div>
      {[
        { name: "Free", price: fp.free, features: [fp.f1a, fp.f1b], highlight: false },
        { name: "Pro", price: "R$ 29,90/mês", features: [fp.f2a, fp.f2b, fp.f2c], highlight: true },
        { name: "Elite", price: "R$ 59,90/mês", features: [fp.f3a, fp.f3b, fp.f3c], highlight: false },
      ].map((p, i) => (
        <div key={i} style={{
          background: p.highlight ? `${neon}15` : dark, borderRadius: 8, padding: "10px 10px",
          marginBottom: 6, border: `1px solid ${p.highlight ? neon + "50" : neon + "10"}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: p.highlight ? neon : text }}>{p.name}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: p.highlight ? neon : muted }}>{p.price}</div>
          </div>
          {p.features.map((f, fi) => (
            <div key={fi} style={{ fontSize: 7, color: muted, marginTop: 2 }}>✓ {f}</div>
          ))}
        </div>
      ))}
    </div>,
    // Tela 4 — Perfil
    <div key="s4" style={{ width: "100%", height: "100%", background: bg, padding: "28px 14px 14px", fontFamily: "system-ui" }}>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: dark, border: `2px solid ${neon}40`, margin: "0 auto 6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💪</div>
        <div style={{ fontSize: 12, fontWeight: 800, color: text }}>João Silva</div>
        <div style={{ fontSize: 8, color: neon }}>{fp.planPro}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
        {[{ v: "78kg", l: fp.weight }, { v: "1.82m", l: fp.height }, { v: "23.5", l: "IMC" }].map((s, i) => (
          <div key={i} style={{ background: dark, borderRadius: 8, padding: 8, textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: text }}>{s.v}</div>
            <div style={{ fontSize: 7, color: muted }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 9, fontWeight: 700, color: text, marginBottom: 6 }}>{fp.achievements}</div>
      <div style={{ display: "flex", gap: 6 }}>
        {[`🔥 ${fp.a1}`, `🏋️ ${fp.a2}`, `⚡ ${fp.a3}`].map((a, i) => (
          <div key={i} style={{ fontSize: 7, background: dark, border: `1px solid ${neon}20`, borderRadius: 6, padding: "6px 8px", color: muted }}>{a}</div>
        ))}
      </div>
    </div>,
  ];

  return (
    <div style={{ background: `linear-gradient(135deg, ${bg}, #0d1a0d)`, fontFamily: "system-ui", overflow: "hidden", color: text }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 12px", textAlign: "center" }}>
        <div style={{ fontSize: 8, letterSpacing: 4, color: neon, textTransform: "uppercase", marginBottom: 4 }}>App Fitness</div>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, fontFamily: "'Courier New', monospace", textTransform: "uppercase" }}>Fit<span style={{ color: neon }}>Pulse</span></div>
        <div style={{ fontSize: 10, color: muted, marginTop: 4 }}>{fp.tagline}</div>
      </div>
      {/* Phone */}
      <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 20px" }}>
        <PhoneMockup screens={screens} interval={3500} />
      </div>
      {/* Features */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, padding: "0 16px 16px" }}>
        {[
          { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#39ff14" strokeWidth="2" strokeLinecap="round"><path d="M18 8h-4l2-6h-6l-3 10h4l-2 10 9-14z"/></svg>, label: "Treinos IA" },
          { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#39ff14" strokeWidth="2" strokeLinecap="round"><path d="M3 20h18"/><path d="M5 20V10l3-4"/><path d="M9 20V6l3-4"/><path d="M13 20V8l3-2"/><path d="M17 20V4l3 2"/></svg>, label: "Progresso" },
          { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#39ff14" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/><path d="M8 3h8"/></svg>, label: "Nutrição" },
        ].map((f, i) => (
          <div key={i} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{f.icon}</div>
            <div style={{ fontSize: 8, color: muted }}>{f.label}</div>
          </div>
        ))}
      </div>
      {/* CTA */}
      <div style={{ padding: "0 20px 16px" }}>
        <StoreBadges />
      </div>
      {/* Footer */}
      <div style={{ padding: "10px 20px", borderTop: `1px solid ${neon}15`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: neon, fontSize: 9, fontWeight: 800, letterSpacing: 1 }}>⚡ FitPulse</span>
        <span style={{ fontSize: 7, color: muted }}>powered by pigeonz.ai</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════ */
/* ── PetVida — Pet Shop App Template               ── */
/* ══════════════════════════════════════════════════ */
function PetVidaPreview() {
  const { t } = useLanguage();
  const pv = t.tplContent.petvida;
  const bg = "#faf8f5";
  const orange = "#f97316";
  const blue = "#3b82f6";
  const dark = "#1a1a2e";
  const text = "#2d2d2d";
  const muted = "#888";
  const card = "#fff";

  const screens = [
    // Tela 1 — Home
    <div key="s1" style={{ width: "100%", height: "100%", background: bg, padding: "28px 12px 12px", fontFamily: "system-ui" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div><div style={{ fontSize: 8, color: muted }}>{pv.hello}</div><div style={{ fontSize: 13, fontWeight: 800, color: dark }}>{pv.myPets}</div></div>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${orange}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🔔</div>
      </div>
      <div style={{ background: card, borderRadius: 12, padding: 10, marginBottom: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, overflow: "hidden" }}><img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&h=100&fit=crop" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: dark }}>Thor</div>
            <div style={{ fontSize: 8, color: muted }}>{pv.dogBreed}</div>
            <div style={{ fontSize: 7, color: orange, marginTop: 2 }}>{pv.dogAlert}</div>
          </div>
        </div>
      </div>
      <div style={{ background: card, borderRadius: 12, padding: 10, marginBottom: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, overflow: "hidden" }}><img src="/pet-cat.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: dark }}>Mia</div>
            <div style={{ fontSize: 8, color: muted }}>{pv.catBreed}</div>
            <div style={{ fontSize: 7, color: blue, marginTop: 2 }}>{pv.catAlert}</div>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {[{ icon: "💉", label: pv.vaccines, color: orange }, { icon: "🛁", label: pv.bath, color: blue }, { icon: "🩺", label: pv.appointment, color: orange }, { icon: "🛒", label: pv.shop, color: blue }].map((s, i) => (
          <div key={i} style={{ background: card, borderRadius: 10, padding: "10px 8px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 8, fontWeight: 700, color: dark }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>,
    // Tela 2 — Agendamento
    <div key="s2" style={{ width: "100%", height: "100%", background: bg, padding: "28px 12px 12px", fontFamily: "system-ui" }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: dark, marginBottom: 4 }}>{pv.schedule}</div>
      <div style={{ fontSize: 8, color: muted, marginBottom: 12 }}>{pv.chooseService}</div>
      {[
        { icon: "🛁", name: pv.s1, price: "R$ 80", time: pv.s1t },
        { icon: "💉", name: pv.s2, price: "R$ 120", time: pv.s2t },
        { icon: "🩺", name: pv.s3, price: "R$ 150", time: pv.s3t },
        { icon: "✂️", name: pv.s4, price: "R$ 45", time: pv.s4t },
      ].map((s, i) => (
        <div key={i} style={{ background: card, borderRadius: 10, padding: "10px 10px", marginBottom: 6, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 18 }}>{s.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: dark }}>{s.name}</div>
            <div style={{ fontSize: 7, color: muted }}>{s.time}</div>
          </div>
          <div style={{ fontSize: 10, fontWeight: 800, color: orange }}>{s.price}</div>
        </div>
      ))}
    </div>,
    // Tela 3 — Lojinha
    <div key="s3" style={{ width: "100%", height: "100%", background: bg, padding: "28px 12px 12px", fontFamily: "system-ui" }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: dark, marginBottom: 4 }}>{pv.petShop}</div>
      <div style={{ fontSize: 8, color: muted, marginBottom: 10 }}>{pv.delivery}</div>
      <div style={{ background: `linear-gradient(135deg, ${orange}, #fb923c)`, borderRadius: 12, padding: "12px 10px", marginBottom: 10, color: "#fff" }}>
        <div style={{ fontSize: 8, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>{pv.dailyOffer}</div>
        <div style={{ fontSize: 12, fontWeight: 800, marginTop: 2 }}>{pv.offerText}</div>
        <div style={{ fontSize: 8, marginTop: 2, opacity: 0.8 }}>{pv.useCode}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {[
          { name: pv.p1, price: "R$ 89,90", old: "R$ 112" },
          { name: pv.p2, price: "R$ 39,90", old: "" },
          { name: pv.p3, price: "R$ 24,90", old: "" },
          { name: pv.p4, price: "R$ 32,90", old: "R$ 42" },
        ].map((p, i) => (
          <div key={i} style={{ background: card, borderRadius: 10, padding: 8, textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ width: "100%", height: 40, borderRadius: 6, background: `${i % 2 === 0 ? orange : blue}10`, marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{["🦴","🐕","🧸","🧴"][i]}</div>
            <div style={{ fontSize: 8, fontWeight: 700, color: dark }}>{p.name}</div>
            <div style={{ fontSize: 10, fontWeight: 800, color: orange, marginTop: 2 }}>{p.price}</div>
            {p.old && <div style={{ fontSize: 7, color: muted, textDecoration: "line-through" }}>{p.old}</div>}
          </div>
        ))}
      </div>
    </div>,
    // Tela 4 — Perfil do Pet
    <div key="s4" style={{ width: "100%", height: "100%", background: bg, padding: "28px 12px 12px", fontFamily: "system-ui" }}>
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", margin: "0 auto 6px", overflow: "hidden" }}><img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=120&h=120&fit=crop" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/></div>
        <div style={{ fontSize: 14, fontWeight: 800, color: dark }}>Thor</div>
        <div style={{ fontSize: 8, color: muted }}>{pv.profile}</div>
      </div>
      <div style={{ background: card, borderRadius: 10, padding: 10, marginBottom: 6, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: dark, marginBottom: 6 }}>{pv.vacCard}</div>
        {[{ v: "V10", d: "12/01/2026", s: "✅" }, { v: pv.rabies, d: "15/03/2026", s: "⏳" }, { v: pv.flu, d: "20/06/2026", s: "⏳" }].map((vac, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: muted, marginBottom: 3 }}>
            <span>{vac.s} {vac.v}</span><span>{vac.d}</span>
          </div>
        ))}
      </div>
      <div style={{ background: card, borderRadius: 10, padding: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: dark, marginBottom: 6 }}>{pv.nextAppt}</div>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ flex: 1, background: `${blue}10`, borderRadius: 8, padding: 8, textAlign: "center" }}>
            <div style={{ fontSize: 14 }}>🛁</div><div style={{ fontSize: 7, color: dark, fontWeight: 700, marginTop: 2 }}>{pv.bathLabel}</div><div style={{ fontSize: 7, color: muted }}>{pv.tomorrowTime}</div>
          </div>
          <div style={{ flex: 1, background: `${orange}10`, borderRadius: 8, padding: 8, textAlign: "center" }}>
            <div style={{ fontSize: 14 }}>💉</div><div style={{ fontSize: 7, color: dark, fontWeight: 700, marginTop: 2 }}>{pv.vaccineLabel}</div><div style={{ fontSize: 7, color: muted }}>{pv.vaccineTime}</div>
          </div>
        </div>
      </div>
    </div>,
  ];

  return (
    <div style={{ background: bg, fontFamily: "system-ui", overflow: "hidden", color: dark }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 12px", textAlign: "center" }}>
        <div style={{ fontSize: 8, letterSpacing: 4, color: orange, textTransform: "uppercase", marginBottom: 4 }}>App Pet</div>
        <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Georgia', serif", fontStyle: "italic" }}>Pet<span style={{ color: orange }}>Vida</span></div>
        <div style={{ fontSize: 10, color: muted, marginTop: 4 }}>{pv.tagline}</div>
      </div>
      {/* Phone */}
      <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 20px" }}>
        <PhoneMockup screens={screens} interval={3500} frameColor="#1a1a2e" />
      </div>
      {/* Features */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, padding: "0 16px 16px" }}>
        {[
          { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round"><path d="M12 2C8 6 4 10 4 14a8 8 0 0 0 16 0c0-4-4-8-8-12z"/><circle cx="10" cy="14" r="1.5" fill="#f97316"/><circle cx="14" cy="14" r="1.5" fill="#f97316"/></svg>, label: "Carteira Pet" },
          { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/><circle cx="12" cy="16" r="2" fill="#f97316"/></svg>, label: "Agendamento" },
          { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round"><path d="M3 9h18l-2 10H5z"/><path d="M7 9V6a5 5 0 0 1 10 0v3"/><circle cx="9" cy="14" r="1" fill="#f97316"/><circle cx="15" cy="14" r="1" fill="#f97316"/></svg>, label: "Delivery" },
        ].map((f, i) => (
          <div key={i} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{f.icon}</div>
            <div style={{ fontSize: 8, color: muted }}>{f.label}</div>
          </div>
        ))}
      </div>
      {/* CTA */}
      <div style={{ padding: "0 20px 16px" }}>
        <StoreBadges />
      </div>
      {/* Footer */}
      <div style={{ padding: "10px 20px", borderTop: `1px solid ${orange}15`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: orange, fontSize: 9, fontWeight: 800, letterSpacing: 1 }}>🐾 PetVida</span>
        <span style={{ fontSize: 7, color: muted }}>powered by pigeonz.ai</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════ */
/* ── UAIfood — Delivery App Template           ── */
/* ══════════════════════════════════════════════════ */
function UAIfoodPreview() {
  const { t } = useLanguage();
  const uf = t.tplContent.uaifood;
  const bg = "#1a0a0a";
  const red = "#ef4444";
  const yellow = "#fbbf24";
  const dark = "#111";
  const text = "#f5f0e8";
  const muted = "#777";
  const card = "#1e1e1e";

  /* SVG icons reusable */
  const iconPin = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="2"><path d="M12 2C8 2 5 5.5 5 9.5 5 16 12 22 12 22s7-6 7-12.5C19 5.5 16 2 12 2z"/><circle cx="12" cy="10" r="2"/></svg>;
  const iconSearch = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>;
  const iconStar = <svg width="10" height="10" viewBox="0 0 24 24" fill={yellow} stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>;
  /* Category icons */
  const catCaseiro = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={red} strokeWidth="1.5"><circle cx="12" cy="10" r="6"/><path d="M6 16c0-2 3-3 6-3s6 1 6 3"/><path d="M9 8h6"/></svg>;
  const catQueijo = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={yellow} strokeWidth="1.5"><path d="M2 18l10-14 10 14z"/><circle cx="9" cy="15" r="1.5" fill={yellow}/><circle cx="14" cy="13" r="1" fill={yellow}/><circle cx="11" cy="11" r="0.8" fill={yellow}/></svg>;
  const catTropeiro = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={red} strokeWidth="1.5"><ellipse cx="12" cy="14" rx="8" ry="5"/><path d="M4 14V10a8 5 0 0 1 16 0v4"/></svg>;
  const catOrganico = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5"><path d="M12 22V8"/><path d="M5 12c0-5 7-10 7-10s7 5 7 10c0 3-3 5-7 5s-7-2-7-5z"/></svg>;
  /* Cheese icon for tracking */
  const cheeseIcon = <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M2 18l10-14 10 14z" fill={yellow} opacity={0.3} stroke={yellow} strokeWidth="1.5"/><circle cx="9" cy="15" r="1.8" fill="#1a0a0a"/><circle cx="14" cy="13" r="1.2" fill="#1a0a0a"/><circle cx="11" cy="11" r="0.9" fill="#1a0a0a"/><path d="M2 18l10-14 10 14z" fill="none" stroke={yellow} strokeWidth="1.5"/></svg>;

  const screens = [
    // Tela 1 — Home / Produtores
    <div key="s1" style={{ width: "100%", height: "100%", background: bg, padding: "28px 12px 12px", fontFamily: "system-ui" }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: text, marginBottom: 2 }}>{uf.fastDelivery}</div>
      <div style={{ fontSize: 8, color: muted, marginBottom: 10, display: "flex", alignItems: "center", gap: 3 }}>{iconPin} {uf.address}</div>
      <div style={{ background: card, borderRadius: 10, padding: "8px 10px", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
        {iconSearch}
        <span style={{ fontSize: 9, color: muted }}>{uf.search}</span>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, overflowX: "hidden" }}>
        {[{ icon: catCaseiro, n: uf.cat1 }, { icon: catQueijo, n: uf.cat2 }, { icon: catTropeiro, n: uf.cat3 }, { icon: catOrganico, n: uf.cat4 }].map((c, i) => (
          <div key={i} style={{ textAlign: "center", minWidth: 36 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: i === 0 ? `${red}20` : card, display: "flex", alignItems: "center", justifyContent: "center", border: i === 0 ? `1px solid ${red}40` : "none" }}>{c.icon}</div>
            <div style={{ fontSize: 7, color: i === 0 ? red : muted, marginTop: 3 }}>{c.n}</div>
          </div>
        ))}
      </div>
      {[
        { name: uf.prod1, time: uf.prod1Time, rating: "4.9", tag: uf.prod1Fee, icon: catCaseiro },
        { name: uf.prod2, time: uf.prod2Time, rating: "4.8", tag: "R$ 4,99", icon: catQueijo },
      ].map((r, i) => (
        <div key={i} style={{ background: card, borderRadius: 10, padding: 10, marginBottom: 6, display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, background: `${red}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>{r.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: text }}>{r.name}</div>
            <div style={{ fontSize: 7, color: muted, display: "flex", alignItems: "center", gap: 3 }}>{r.time} · {iconStar} {r.rating}</div>
          </div>
          <div style={{ fontSize: 7, color: yellow, background: `${yellow}15`, padding: "3px 6px", borderRadius: 4 }}>{r.tag}</div>
        </div>
      ))}
    </div>,
    // Tela 2 — Cardápio
    <div key="s2" style={{ width: "100%", height: "100%", background: bg, padding: "28px 12px 12px", fontFamily: "system-ui" }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: text, marginBottom: 2 }}>{uf.prod1}</div>
      <div style={{ fontSize: 8, color: muted, marginBottom: 10, display: "flex", alignItems: "center", gap: 3 }}>{iconStar} 4.9 · {uf.prod1Time} · {uf.localProd}</div>
      {[
        { name: uf.dish1, desc: uf.dish1d, price: "R$ 22,90" },
        { name: uf.dish2, desc: uf.dish2d, price: "R$ 28,90" },
        { name: uf.dish3, desc: uf.dish3d, price: "R$ 18,90" },
        { name: uf.dish4, desc: uf.dish4d, price: "R$ 59,90" },
      ].map((item, i) => (
        <div key={i} style={{ background: card, borderRadius: 8, padding: "8px 10px", marginBottom: 5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: text }}>{item.name}</div>
            <div style={{ fontSize: 7, color: muted, marginTop: 2 }}>{item.desc}</div>
          </div>
          <div style={{ fontSize: 10, fontWeight: 800, color: red, marginLeft: 8 }}>{item.price}</div>
        </div>
      ))}
    </div>,
    // Tela 3 — Mapa de rastreio com queijo
    <div key="s3" style={{ width: "100%", height: "100%", background: bg, padding: "28px 12px 12px", fontFamily: "system-ui" }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: text, textAlign: "center", marginBottom: 6 }}>{uf.tracking}</div>
      {/* Google Maps real + queijo animado */}
      <div style={{ borderRadius: 12, height: 130, marginBottom: 10, position: "relative", overflow: "hidden", border: `1px solid ${red}20` }}>
        <img src="/map-sp.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
        {/* Destination pin — pulsing */}
        <div style={{ position: "absolute", top: 25, right: 30, zIndex: 2 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: `${red}30`, position: "absolute", top: -4, left: -4, animation: "float 2s ease-in-out infinite" }}/>
          <svg width="12" height="16" viewBox="0 0 12 16" fill={red}><path d="M6 0C2.7 0 0 2.7 0 6c0 4.5 6 10 6 10s6-5.5 6-10c0-3.3-2.7-6-6-6zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg>
        </div>
        {/* Queijo animado se movendo no mapa */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 2, pointerEvents: "none" }}>
          <div style={{ position: "absolute", animation: "cheeseMove 5s linear infinite" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>
              <path d="M2 20l10-16 10 16z" fill={yellow}/>
              <circle cx="8" cy="17" r="2" fill="#1a0a0a" opacity={0.6}/>
              <circle cx="14" cy="15" r="1.5" fill="#1a0a0a" opacity={0.5}/>
              <circle cx="11" cy="12" r="1" fill="#1a0a0a" opacity={0.4}/>
              <path d="M2 20l10-16 10 16z" fill="none" stroke="#d4a020" strokeWidth="0.8"/>
            </svg>
          </div>
        </div>
        <style>{`
          @keyframes cheeseMove {
            0% { top: 75%; left: 5%; }
            25% { top: 55%; left: 30%; }
            50% { top: 40%; left: 55%; }
            75% { top: 30%; left: 70%; }
            100% { top: 22%; left: 72%; }
          }
        `}</style>
      </div>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        {cheeseIcon}
        <div style={{ fontSize: 11, fontWeight: 800, color: yellow, marginTop: 4 }}>{uf.onWay}</div>
        <div style={{ fontSize: 8, color: muted, marginTop: 2 }}>{uf.arrives}</div>
      </div>
      <div style={{ padding: "0 6px" }}>
        {[
          { label: uf.step1, done: true },
          { label: uf.step2, done: true },
          { label: uf.step3, done: true },
          { label: uf.step4, done: false },
        ].map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 5 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: step.done ? red : card, border: `2px solid ${step.done ? red : muted}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {step.done && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#fff" }}/>}
            </div>
            <div style={{ fontSize: 8, color: step.done ? text : muted }}>{step.label}</div>
          </div>
        ))}
      </div>
    </div>,
    // Tela 4 — Cupons
    <div key="s4" style={{ width: "100%", height: "100%", background: bg, padding: "28px 12px 12px", fontFamily: "system-ui" }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: text, marginBottom: 4 }}>{uf.coupons}</div>
      <div style={{ fontSize: 8, color: muted, marginBottom: 10 }}>{uf.saveCoupon}</div>
      {[
        { code: uf.c1code, desc: uf.c1desc, min: uf.c1min, color: red },
        { code: uf.c2code, desc: uf.c2desc, min: uf.c2min, color: yellow },
        { code: uf.c3code, desc: uf.c3desc, min: uf.c3min, color: red },
      ].map((c, i) => (
        <div key={i} style={{
          background: card, borderRadius: 10, padding: "10px 10px", marginBottom: 6,
          borderLeft: `3px solid ${c.color}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: c.color }}>{c.code}</div>
              <div style={{ fontSize: 8, color: text, marginTop: 2 }}>{c.desc}</div>
              <div style={{ fontSize: 7, color: muted, marginTop: 2 }}>{c.min}</div>
            </div>
            <div style={{ fontSize: 8, fontWeight: 700, color: c.color, background: `${c.color}15`, padding: "5px 10px", borderRadius: 6 }}>{uf.useBtn}</div>
          </div>
        </div>
      ))}
    </div>,
  ];

  return (
    <div style={{ background: `linear-gradient(135deg, ${bg}, #1a0e05)`, fontFamily: "system-ui", overflow: "hidden", color: text }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 12px", textAlign: "center" }}>
        <div style={{ fontSize: 8, letterSpacing: 4, color: red, textTransform: "uppercase", marginBottom: 4 }}>Delivery Mineiro</div>
        <div style={{ fontSize: 34, fontWeight: 900, fontFamily: "'VT323', monospace", letterSpacing: 3, marginTop: 10 }}>
          UAI<span style={{ color: red, fontFamily: "'Georgia', serif", fontStyle: "italic" }}>food</span>
        </div>
        <div style={{ fontSize: 10, color: muted, marginTop: 4 }}>{uf.subtitle}</div>
      </div>
      {/* Phone */}
      <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 20px" }}>
        <PhoneMockup screens={screens} interval={3500} frameColor="#1a1a1a" />
      </div>
      {/* Features */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, padding: "0 16px 16px" }}>
        {[
          { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>, label: uf.feat1 },
          { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16v4H4z"/><path d="M6 8v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>, label: uf.feat2 },
          { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><path d="M12 2C8 2 5 5.5 5 9.5 5 16 12 22 12 22s7-6 7-12.5C19 5.5 16 2 12 2z"/><circle cx="12" cy="10" r="3"/></svg>, label: uf.feat3 },
        ].map((f, i) => (
          <div key={i} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{f.icon}</div>
            <div style={{ fontSize: 8, color: muted }}>{f.label}</div>
          </div>
        ))}
      </div>
      {/* CTA */}
      <div style={{ padding: "0 20px 16px" }}>
        <StoreBadges />
      </div>
      {/* Footer */}
      <div style={{ padding: "10px 20px", borderTop: `1px solid ${red}15`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: red, fontSize: 9, fontWeight: 800, letterSpacing: 1 }}>🍔 UAIfood</span>
        <span style={{ fontSize: 7, color: muted }}>powered by pigeonz.ai</span>
      </div>
    </div>
  );
}

const IMG = {
  jewel1: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop",
  jewel2: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop",
  tech1: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
  tech2: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
  coffee1: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTemplates(tpl: any) {
  const cf = tpl.cafe;
  const jl = tpl.joias;
  const tk = tpl.tech;
  const bb = tpl.barber;
  return [
  {
    label: "Old Style",
    slug: "retro-cafe",
    custom: null as string | null,
    content: {
      hero_title: cf.title, hero_subtitle: cf.subtitle, hero_cta: cf.cta,
      phone: cf.phone, address: cf.address, hours: cf.hours,
      colors: { primary: "#d8b4fe", accent: "#f9a8d4" }, style: "retro", logo_url: null,
      sections: [
        { type: "features", title: "// Destaques", items: [
          { icon: "heart", title: cf.feat1, desc: cf.feat1d },
          { icon: "star", title: cf.feat2, desc: cf.feat2d },
        ]},
        { type: "products", title: ">> Especiais", items: [
          { name: cf.prod1, price: "R$ 8", desc: cf.prod1d, image: IMG.coffee1 },
          { name: cf.prod2, price: "R$ 15", desc: cf.prod2d, image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=400&h=300&fit=crop" },
        ]},
        { type: "about", title: cf.about, text: cf.aboutText },
      ],
    },
  },
  {
    label: "App Mobile",
    slug: "astral-bike",
    custom: "astral-bike" as string | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: null as any,
  },
  {
    label: "Elegante",
    slug: "velaris-joias",
    custom: null as string | null,
    content: {
      hero_title: jl.title, hero_subtitle: jl.subtitle, hero_cta: jl.cta,
      hero_icon: "diamond",
      hero_images: [
        "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&h=500&fit=crop",
      ],
      phone: jl.phone, address: jl.address, hours: jl.hours,
      colors: { primary: "#1a1a1a", accent: "#c8956c" }, style: "elegant", logo_url: null,
      sections: [
        { type: "stats", title: jl.stats, items: [
          { value: "15+", label: jl.s1 },
          { value: "10k+", label: jl.s2 },
          { value: "4.9★", label: jl.s3 },
        ]},
        { type: "products", title: "Destaques", items: [
          { name: jl.prod1, price: "R$ 2.890", desc: jl.prod1d, image: IMG.jewel1 },
          { name: jl.prod2, price: "R$ 1.450", desc: jl.prod2d, image: IMG.jewel2 },
        ]},
        { type: "about", title: jl.about, text: jl.aboutText },
      ],
    },
  },
  {
    label: "Moderno",
    slug: "techstore",
    custom: null as string | null,
    content: {
      hero_title: tk.title, hero_subtitle: tk.subtitle, hero_cta: tk.cta,
      hero_icon: "circuit",
      hero_images: [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop",
      ],
      phone: tk.phone, address: tk.address, hours: "",
      colors: { primary: "#1a1a2e", accent: "#e94560" }, style: "modern", logo_url: null,
      sections: [
        { type: "features", title: "Why buy with us", items: [
          { icon: "shield", title: tk.feat1, desc: tk.feat1d },
          { icon: "rocket", title: tk.feat2, desc: tk.feat2d },
        ]},
        { type: "products", title: "Best Sellers", items: [
          { name: tk.prod1, price: "R$ 189,90", old_price: "R$ 249,90", desc: tk.prod1d, image: IMG.tech1 },
          { name: tk.prod2, price: "R$ 459,90", old_price: "R$ 599,90", desc: tk.prod2d, image: IMG.tech2 },
        ]},
        { type: "banner", title: tk.banner, text: tk.bannerText, button_text: tk.bannerBtn },
      ],
    },
  },
  {
    label: "Premium",
    slug: "barbearia-dom",
    custom: null as string | null,
    content: {
      hero_title: bb.title, hero_subtitle: bb.subtitle, hero_cta: bb.cta,
      hero_icon: "barber",
      hero_images: [
        "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&h=500&fit=crop",
      ],
      phone: bb.phone, address: bb.address, hours: bb.hours,
      colors: { primary: "#245837", accent: "#07622a" }, style: "warm", logo_url: null,
      sections: [
        { type: "stats", title: bb.stats, items: [
          { value: "8k+", label: bb.s1 }, { value: "4.9★", label: bb.s2 }, { value: "6", label: bb.s3 },
        ]},
        { type: "products", title: "Nossos Cortes", items: [
          { name: bb.prod1, price: "R$ 55", desc: bb.prod1d, image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop" },
          { name: bb.prod2, price: "R$ 80", desc: bb.prod2d, image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=300&fit=crop" },
        ]},
        { type: "services", title: "Services & Prices", items: [
          { name: bb.svc1, price: "R$ 55", desc: bb.svc1d },
          { name: bb.svc2, price: "R$ 35", desc: bb.svc2d },
          { name: bb.svc3, price: "R$ 80", desc: bb.svc3d },
        ]},
        { type: "about", title: bb.about, text: bb.aboutText },
      ],
    },
  },
  {
    label: "Tattoo Studio",
    slug: "tattoo-boo",
    custom: "tattoo-boo" as string | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: null as any,
  },
  {
    label: "Advocacia",
    slug: "escritorio-advocacia",
    custom: "law-firm" as string | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: null as any,
  },
  {
    label: "App Fitness",
    slug: "fitpulse",
    custom: "fitpulse" as string | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: null as any,
  },
  {
    label: "App Pet",
    slug: "petvida",
    custom: "petvida" as string | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: null as any,
  },
  {
    label: "App Delivery",
    slug: "delivereats",
    custom: "delivereats" as string | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: null as any,
  },
];
}

export default function Templates() {
  const { t } = useLanguage();
  const TEMPLATES = getTemplates(t.tplContent);
  const tc = t.tplContent.cards;
  // Map slug → translated label
  const labelMap: Record<string, string> = {
    "retro-cafe": tc.cafe,
    "astral-bike": tc.astral,
    "velaris-joias": "Velaris Joias",
    "techstore": "TechStore",
    "barbearia-dom": "Barbearia Dom",
    "tattoo-boo": tc.tattoo,
    "escritorio-advocacia": tc.law,
    "fitpulse": tc.fitpulse,
    "petvida": tc.petvida,
    "delivereats": tc.uaifood,
  };
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const prev = useCallback(() => {
    setDirection(-1);
    setExpanded(false);
    setCurrent((c) => (c === 0 ? TEMPLATES.length - 1 : c - 1));
  }, [TEMPLATES.length]);

  const next = useCallback(() => {
    setDirection(1);
    setExpanded(false);
    setCurrent((c) => (c === TEMPLATES.length - 1 ? 0 : c + 1));
  }, [TEMPLATES.length]);

  const tpl = TEMPLATES[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 500 : -500, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -500 : 500, opacity: 0 }),
  };

  return (
    <section id="templates" style={{ padding: "50px 24px 60px", background: "transparent", position: "relative", overflow: "hidden" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }} style={{ textAlign: "center", marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(12px, 2vw, 18px)", color: "#f0a0d0", textShadow: "0 0 20px rgba(240,160,208,0.4)", marginBottom: 6 }}>{t.templates.title}</h2>
      </motion.div>

      <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
        {/* Arrows */}
        <button onClick={prev} aria-label={t.templates.prevAriaLabel} className="tpl-arrow tpl-arrow-left" style={{
          position: "absolute", left: -56, top: expanded ? 200 : "50%", transform: "translateY(-50%)", zIndex: 20,
          background: "rgba(30,20,60,0.8)", border: "2px solid rgba(72,192,184,0.4)",
          color: "#48c0b8", fontFamily: "'Press Start 2P', monospace", fontSize: 16,
          width: 44, height: 44, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(72,192,184,0.15)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(72,192,184,0.3)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(30,20,60,0.8)"; e.currentTarget.style.boxShadow = "none"; }}
        >◀</button>
        <button onClick={next} aria-label={t.templates.nextAriaLabel} className="tpl-arrow tpl-arrow-right" style={{
          position: "absolute", right: -56, top: expanded ? 200 : "50%", transform: "translateY(-50%)", zIndex: 20,
          background: "rgba(30,20,60,0.8)", border: "2px solid rgba(72,192,184,0.4)",
          color: "#48c0b8", fontFamily: "'Press Start 2P', monospace", fontSize: 16,
          width: 44, height: 44, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(72,192,184,0.15)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(72,192,184,0.3)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(30,20,60,0.8)"; e.currentTarget.style.boxShadow = "none"; }}
        >▶</button>

        {/* Preview — expands on "Ver mais" */}
        <motion.div
          animate={{ height: expanded ? "auto" : 440 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{ position: "relative", borderRadius: 6, border: "2px solid rgba(96,64,160,0.3)", overflow: "hidden" }}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div key={tpl.slug} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }}>
              <div style={{ position: "relative" }}>
                {tpl.custom === "astral-bike" ? (
                  <AstralBikePreview />
                ) : tpl.custom === "tattoo-boo" ? (
                  <TattooBooPreview />
                ) : tpl.custom === "law-firm" ? (
                  <LawFirmPreview />
                ) : tpl.custom === "fitpulse" ? (
                  <FitPulsePreview />
                ) : tpl.custom === "petvida" ? (
                  <PetVidaPreview />
                ) : tpl.custom === "delivereats" ? (
                  <UAIfoodPreview />
                ) : (
                  <>
                    <SitePreview content={tpl.content} slug={tpl.slug} />
                    <div style={{
                      position: "absolute",
                      zIndex: 10,
                      pointerEvents: "none",
                      ...(tpl.content?.hero_images?.length
                        ? { top: 55, left: 0, right: 0, display: "flex", justifyContent: "center" }
                        : { top: tpl.content?.style === "retro" ? 72 : 46, left: 12 }
                      ),
                    }}>
                      <TemplateLogo style={tpl.content?.style} name={tpl.content?.hero_title} accent={tpl.content?.colors?.accent} />
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {!expanded && (
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(transparent, rgba(26,13,46,0.95) 70%)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 14, zIndex: 10 }}>
              <motion.button onClick={() => setExpanded(true)} whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(72,192,184,0.4)" }} whileTap={{ scale: 0.95 }} style={{
                fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: "#48c0b8",
                background: "rgba(30,20,60,0.9)", border: "2px solid rgba(72,192,184,0.5)",
                padding: "10px 28px", cursor: "pointer", letterSpacing: 1,
              }}>{t.templates.seeMore}</motion.button>
            </div>
          )}

          {expanded && (
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0", background: "rgba(26,13,46,0.8)" }}>
              <motion.button onClick={() => setExpanded(false)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{
                fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: "#a090b8",
                background: "transparent", border: "1px solid rgba(160,144,184,0.3)",
                padding: "8px 24px", cursor: "pointer",
              }}>{t.templates.collapse}</motion.button>
            </div>
          )}
        </motion.div>

        {/* Dots + label */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 14 }}>
          {TEMPLATES.map((item, i) => (
            <button key={item.slug} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); setExpanded(false); }} aria-label={`Template ${item.label}`} style={{
              width: i === current ? 28 : 10, height: 10, borderRadius: 5, border: "none",
              background: i === current ? "#f0a0d0" : "rgba(160,144,184,0.3)",
              cursor: "pointer", transition: "all 0.3s",
              boxShadow: i === current ? "0 0 10px rgba(240,160,208,0.4)" : "none",
            }} />
          ))}
          <span style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#6b5c85", marginLeft: 4 }}>{labelMap[tpl.slug] || tpl.label}</span>
        </div>
      </div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} style={{ textAlign: "center", marginTop: 24 }}>
        <motion.a href="#contact" whileHover={{ scale: 1.05, boxShadow: "0 0 24px rgba(208,88,160,0.5)" }} whileTap={{ scale: 0.95 }} style={{
          display: "inline-block", fontFamily: "'VT323', monospace",
          fontSize: 24, color: "#fff",
          background: "#d058a0",
          padding: "12px 36px", textDecoration: "none",
          border: "2px solid #f0a0d0",
          boxShadow: "0 0 16px rgba(208,88,160,0.3), 3px 3px 0 #8c2068",
          letterSpacing: 1,
        }}>{t.templates.cta}</motion.a>
      </motion.div>

      <style>{`
        @media (max-width: 780px) {
          .tpl-arrow-left { left: 2px !important; }
          .tpl-arrow-right { right: 2px !important; }
        }
      `}</style>
    </section>
  );
}

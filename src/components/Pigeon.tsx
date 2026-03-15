"use client";
import { useEffect, useState, useRef } from "react";

const _ = null;

const P = {
  // ── Hat ──────────────────────────────────────────────────────────────────────
  Ht: '#100818',  // hat body (very dark purple-black)
  Hb: '#06020c',  // hat brim (darkest)
  HR: '#f0eef8',  // hat ribbon (white)

  // ── Body (warm purple-grey) ───────────────────────────────────────────────
  B:  '#887098',  // body main
  b:  '#9882a8',  // body lighter
  bl: '#d0c4dc',  // body lightest / chest (pale lavender)
  Bd: '#705880',  // body dark
  BD: '#584868',  // body darkest (deep shadow)

  // ── Head ──────────────────────────────────────────────────────────────────
  Hd: '#6a5878',
  H:  '#7c6e8c',
  Hl: '#9080a0',

  // ── Eye ───────────────────────────────────────────────────────────────────
  Ew: '#dcd4ec',  // white ring
  Ei: '#28a848',  // green iris
  Ep: '#0c0808',  // pupil
  Es: '#f4f0ee',  // shine dot

  // ── Beak ──────────────────────────────────────────────────────────────────
  Bk: '#e87828',  // orange beak

  // ── Neck – teal checkered ─────────────────────────────────────────────────
  T1: '#28a848',
  T2: '#1e8038',

  // ── Neck – purple iridescent ──────────────────────────────────────────────
  Pu: '#c83890',
  pu: '#e060b0',

  // ── Wing / back feathers (very dark) ─────────────────────────────────────
  Wd: '#1c1030',
  Wm: '#2c2040',
  Wl: '#403058',  // feather-edge highlight
  Wh: '#604878',  // wing highlight (feather scallop tops)
  Wi: '#2a1e48',  // wing iridescent dark

  // ── Feet ──────────────────────────────────────────────────────────────────
  Fd: '#c07878',
  fd: '#9c5c5c',
} as const;

type PK = keyof typeof P;
type G  = PK | null;

// ── Hat (4 rows) — sits above the head (head is left side, cols 3–9) ──────────
const HAT: G[][] = [
  // crown top (narrow, cols 4–7)
  [_,_,_,_,'Ht','Ht','Ht','Ht',_,_,_,_,_,_,_,_,_,_,_,_],
  // crown body (cols 3–8)
  [_,_,_,'Ht','Ht','Ht','Ht','Ht','Ht',_,_,_,_,_,_,_,_,_,_,_],
  // ribbon stripe (cols 3–8, accent colour)
  [_,_,_,'Hb','HR','HR','HR','HR','Hb',_,_,_,_,_,_,_,_,_,_,_],
  // brim (wider, cols 1–9)
  [_,'Hb','Hb','Hb','Hb','Hb','Hb','Hb','Hb','Hb',_,_,_,_,_,_,_,_,_,_],
];

// ── Body — 24 rows (pigeon faces LEFT, beak on left col) ─────────────────────
const BASE: G[][] = [
  // row  0 – head top
  [_,_,_,'Hd','H','H','H','H','Hd',_,_,_,_,_,_,_,_,_,_,_],
  // row  1 – head
  [_,_,'Hd','H','Hl','Hl','Hl','H','H','Hd',_,_,_,_,_,_,_,_,_,_],
  // row  2 – eye top + beak (beak extends to col 0)
  ['Bk','Bk','H','Hl','Ew','Ew','Ew','Hl','H',_,_,_,_,_,_,_,_,_,_,_],
  // row  3 – eye mid / iris + beak
  ['Bk','Bk','H','Hl','Ew','Ei','Ei','Ew','Hl','H',_,_,_,_,_,_,_,_,_,_],
  // row  4 – iris + pupil
  [_,_,'H','Hl','Ew','Es','Ep','Ew','Hl','H',_,_,_,_,_,_,_,_,_,_],
  // row  5 – eye lower
  [_,_,'H','Hl','Ew','Ei','Ei','Ew','Hl','H',_,_,_,_,_,_,_,_,_,_],
  // row  6 – eye bottom
  [_,_,'H','Hl','Ew','Ew','Ew','Hl','H','Hd',_,_,_,_,_,_,_,_,_,_],
  // row  7 – head base / neck start
  [_,_,_,'H','Hl','Hl','H','Hd',_,_,_,_,_,_,_,_,_,_,_,_],
  // row  8 – teal checkered band (tight)
  [_,_,_,'T1','T2','T1','T2','T1','T2','T1','T2',_,_,_,_,_,_,_,_,_],
  // row  9 – teal checkered (wider)
  [_,_,'T2','T1','T2','T1','T2','T1','T2','T1','T2','T1',_,_,_,_,_,_,_,_],
  // row 10 – purple iridescent band
  [_,_,'pu','Pu','pu','Pu','pu','Pu','pu','Pu','pu',_,_,_,_,_,_,_,_,_],
  // row 11 – purple iridescent (wider)
  [_,'pu','Pu','pu','Pu','pu','Pu','pu','Pu','pu','Pu','pu',_,_,_,_,_,_,_,_],
  // row 12 – body top (chest L, wing R) — feather row A top
  ['bl','b','B','B','B','Bd','Wi','Wh','Wl','Wm','Wd',_,_,_,_,_,_,_,_,_],
  // row 13 – feather row A body
  ['bl','b','b','B','B','Bd','Wd','Wm','Wl','Wh','Wl','Wm',_,_,_,_,_,_,_,_],
  // row 14 – feather row A lower + B top
  ['bl','bl','b','B','B','Bd','Wi','Wh','Wm','Wl','Wh','Wl','Wm','Wd',_,_,_,_,_,_],
  // row 15 – feather row B body
  ['bl','bl','b','b','B','Bd','Wd','Wm','Wl','Wm','Wl','Wh','Wl','Wm',_,_,_,_,_,_],
  // row 16 – feather row B lower + C top
  ['bl','bl','b','b','Bd','Wi','Wh','Wl','Wm','Wl','Wm','Wl','Wh','Wm','Wd',_,_,_,_,_],
  // row 17 – feather row C body
  ['bl','bl','b','b','BD','Wd','Wl','Wm','Wl','Wm','Wh','Wl','Wm','Wd',_,_,_,_,_,_],
  // row 18 – feather row C lower + D top
  ['bl','b','b','BD','Wi','Wh','Wl','Wm','Wl','Wh','Wd','Wm',_,_,_,_,_,_,_,_],
  // row 19 – feather row D body
  [_,'bl','b','BD','Wd','Wl','Wh','Wm','Wd','Wd',_,_,_,_,_,_,_,_,_,_],
  // row 20 – tail coverts
  [_,_,'bl','BD','Wi','Wm','Wl','Wd',_,_,_,_,_,_,_,_,_,_,_,_],
  // row 21 – feather tips / tail start
  [_,_,_,'BD','Wd','Wh','Wm','Wd',_,_,_,_,_,_,_,_,_,_,_,_],
  // row 22 – tail
  [_,_,_,_,'Wd','Wm','Wh','Wd',_,_,_,_,_,_,_,_,_,_,_,_],
  // row 23 – tail tip
  [_,_,_,_,_,'Wd','Wm',_,_,_,_,_,_,_,_,_,_,_,_,_],
];

// ── Feet rows — 2 rows for each of 3 animation frames ────────────────────────
const FEET: Record<'neutral'|'right'|'left', G[][]> = {
  neutral: [
    [_,_,_,'fd','Fd',_,'fd','Fd',_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,'fd','Fd','Fd','fd','Fd','Fd','fd',_,_,_,_,_,_,_,_,_,_,_],
  ],
  right: [
    [_,_,_,_,'fd','Fd','fd','Fd',_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,'fd','Fd','fd','Fd','Fd','fd',_,_,_,_,_,_,_,_,_,_,_],
  ],
  left: [
    [_,_,'fd','Fd',_,'fd','Fd',_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,'fd','Fd','Fd','fd','Fd','Fd','fd',_,_,_,_,_,_,_,_,_,_,_,_],
  ],
};

export const PIGEON_COLS = 20;
export const PIGEON_ROWS = 30;  // 4 hat + 24 body + 2 feet

// ── SVG renderer ──────────────────────────────────────────────────────────────
export function PigeonSVG({
  s,
  feet  = 'neutral',
  flip  = false,
  noHat = false,
}: {
  s:      number;
  feet?:  'neutral'|'right'|'left';
  flip?:  boolean;
  noHat?: boolean;
}) {
  const grid = [...(noHat ? [] : HAT), ...BASE, ...FEET[feet]];
  const rows = noHat ? 26 : PIGEON_ROWS;
  const W = PIGEON_COLS * s;
  const H = rows * s;

  const hr = noHat ? 0 : 4; // hat row offset

  return (
    <svg
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{
        display: 'block',
        imageRendering: 'pixelated',
        shapeRendering: 'crispEdges',
        overflow: 'visible',
        transform: flip ? 'scaleX(-1)' : undefined,
      }}
    >
      {grid.flatMap((row, ri) =>
        row.map((cell, ci) => {
          if (!cell) return null;
          return (
            <rect
              key={`${ri}-${ci}`}
              x={ci * s} y={ri * s}
              width={s} height={s}
              fill={P[cell]}
            />
          );
        })
      )}
    </svg>
  );
}

// ── Hero pigeon — large, floating, faces RIGHT ────────────────────────────────
export function HeroPigeon() {
  const seq: ('neutral'|'right'|'left')[] = ['neutral','right','neutral','left'];
  const [idx, setIdx]     = useState(0);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % 4), 240);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    function scheduleBlink() {
      timeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); scheduleBlink(); }, 80);
      }, 3000 + Math.random() * 2500);
    }
    scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Pigeon + shadow juntos na mesma animação — shadow acompanha */}
      <div style={{
        animation:  'float 3.5s ease-in-out infinite',
        display:    'flex',
        flexDirection: 'column',
        alignItems: 'center',
        filter: [
          'drop-shadow(0 0 16px rgba(240,160,208,0.9))',
          'drop-shadow(0 0 44px rgba(208,88,160,0.5))',
          'drop-shadow(0 0 80px rgba(208,88,160,0.2))',
        ].join(' '),
        opacity:    blink ? 0.88 : 1,
        transition: 'opacity .06s',
      }}>
        <PigeonSVG s={7} feet={seq[idx]} />

        {/* Sombra projetada pela lanterna — contida dentro da coluna do pombo */}
        <div style={{
          width:           '80%',
          height:          11,
          background:      'radial-gradient(ellipse at 60% 50%, rgba(4,2,14,0.85) 0%, rgba(4,2,14,0.35) 60%, transparent 100%)',
          borderRadius:    '50%',
          filter:          'blur(4px)',
          marginTop:       3,
          marginLeft:      '5%',
          transform:       'scaleX(1.4) skewX(-28deg)',
          transformOrigin: 'right center',
        }} />
      </div>
    </div>
  );
}

// ── Walking pigeon ────────────────────────────────────────────────────────────
export function WalkingPigeon({
  speed  = 0.55,
  startX = -120,
  size   = 4,
  delay  = 0,
}: {
  speed?:  number;
  startX?: number;
  size?:   number;
  delay?:  number;
}) {
  const seq: ('neutral'|'right'|'left')[] = ['right','neutral','left','neutral'];
  const [fIdx, setFIdx] = useState(0);
  const [posX, setPosX] = useState(startX);
  const [dir, setDir]   = useState<1|-1>(1);
  const lastT = useRef(0);
  const lastF = useRef(0);
  const raf   = useRef<number|null>(null);
  const ready = useRef(false);
  const W     = PIGEON_COLS * size;

  useEffect(() => {
    const to = setTimeout(() => { ready.current = true; }, delay);
    return () => clearTimeout(to);
  }, [delay]);

  useEffect(() => {
    function tick(now: number) {
      if (!ready.current) { raf.current = requestAnimationFrame(tick); return; }
      const dt  = lastT.current ? now - lastT.current : 16;
      lastT.current = now;
      setPosX(prev => {
        const next = prev + dir * speed * dt * 0.05;
        const sw   = typeof window !== 'undefined' ? window.innerWidth : 1400;
        if (next > sw + W + 20) { setDir(-1); return sw + W + 20; }
        if (next < -(W + 20))  { setDir(1);  return -(W + 20); }
        return next;
      });
      if (now - lastF.current > 190) {
        setFIdx(i => (i + 1) % 4);
        lastF.current = now;
      }
      raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [dir, speed, W]);

  // pigeon faces LEFT naturally; flip when moving right (dir=1)
  return (
    <div style={{
      position:      'absolute', bottom: 2, left: posX,
      filter:        'drop-shadow(0 6px 12px rgba(18,10,30,.7))',
      pointerEvents: 'none',
    }}>
      <PigeonSVG s={size} feet={seq[fIdx]} flip={dir === 1} noHat />
    </div>
  );
}

// ── Static pigeon (animated feet) ─────────────────────────────────────────────
export function StaticPigeon({
  size = 3,
  flip = false,
}: {
  size?: number;
  flip?: boolean;
}) {
  const seq: ('neutral'|'right'|'left')[] = ['neutral','right','neutral','left'];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % 4), 450);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ display: 'inline-block', filter: 'drop-shadow(0 4px 8px rgba(18,10,30,.5))' }}>
      <PigeonSVG s={size} feet={seq[idx]} flip={flip} />
    </div>
  );
}

// ── Flying pigeon — wings flapping (same as Teubaldo), floating ──────────────
export function FlyingPigeon({ size = 5 }: { size?: number }) {
  const seq: ('neutral'|'right'|'left')[] = ['neutral','right','neutral','left'];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % 4), 250);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      animation: 'float 2s ease-in-out infinite',
      filter: [
        'drop-shadow(0 0 16px rgba(240,160,208,0.9))',
        'drop-shadow(0 0 44px rgba(208,88,160,0.5))',
        'drop-shadow(0 0 80px rgba(208,88,160,0.2))',
      ].join(' '),
    }}>
      <div style={{ position: 'relative' }}>
        {/* Asa esquerda — igual Teubaldo */}
        <svg
          width={45} height={40}
          style={{
            position: 'absolute',
            top: size * 9,
            left: -35,
            imageRendering: 'pixelated',
            shapeRendering: 'crispEdges',
            animation: 'pigeon-wing-flap 0.35s ease-in-out infinite',
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
        {/* Asa direita — espelhada */}
        <svg
          width={45} height={40}
          style={{
            position: 'absolute',
            top: size * 11,
            right: size * 1,
            imageRendering: 'pixelated',
            shapeRendering: 'crispEdges',
            scale: '-1 1',
            animation: 'pigeon-wing-flap 0.35s ease-in-out infinite',
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
        <PigeonSVG s={size} feet={seq[idx]} />
      </div>
    </div>
  );
}

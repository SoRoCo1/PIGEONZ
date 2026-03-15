"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PigeonSVG } from "./Pigeon";

type Phase = 'pause' | 'walk_left' | 'peck' | 'look' | 'kiss' | 'forage' | 'climb' | 'walk_right' | 'descend' | 'peck_end';

const PHASES: Phase[] = ['pause', 'walk_left', 'peck', 'look', 'kiss', 'forage', 'climb', 'walk_right', 'descend', 'peck_end'];
const DURATION: Record<Phase, number> = {
  pause:      900,
  walk_left:  0,    // RAF distance-based
  peck:       2100,
  look:       800,
  kiss:       1600,
  forage:     0,    // RAF distance-based
  climb:      1800, // time-based
  walk_right: 0,    // RAF distance-based
  descend:    0,    // RAF time-based
  peck_end:   2100, // peck at final position before repeating
};

// X positions as fraction of viewport width
const PX_FINAL     = 0.65;  // final rest: between "Entre em contato" button and chatbot
const PX_MID       = 0.10;  // end of walk_left (peck area)
const PX_FAR       = 0.04;  // end of forage
const PX_RIGHT_END = 0.88;  // end of walk_right at top level

// Y floor: pigeon walks and rests at this level
const BOTTOM_FLOOR = 155;

// Pigeon scale
const S = 7;

// Eye geometry at s=7 for eyelid overlay
// Eye pixels span columns 4-7, rows 6-10 (with hat offset=4 rows)
const EYE_TOP      = 6 * S;        // 42px from top of pigeonDiv
const EYE_W        = 4 * S;        // 28px wide
const EYE_H        = 5 * S;        // 35px tall
const EYE_L_NORMAL = 4  * S;       // 28px — facing left (flip=false)
const EYE_L_FLIP   = (20 - 8) * S; // 84px — facing right (flip=true, mirrored)

function HeartParticle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.4 }}
      animate={{ opacity: [0, 1, 0], y: -65, scale: 1.4 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4, ease: "easeOut" }}
      style={{
        position:   'absolute',
        top:        -20,
        left:       -10,
        fontFamily: "'Press Start 2P', monospace",
        fontSize:   16,
        color:      '#f0a0d0',
        textShadow: '0 0 8px #f0a0d0, 0 0 20px rgba(240,160,208,0.6)',
        pointerEvents: 'none',
        userSelect:    'none',
        zIndex:        3,
      }}
    >
      ♥
    </motion.div>
  );
}

export default function AmbientPigeon() {
  const [phase,     setPhase]     = useState<Phase>('pause');
  const [feet,      setFeet]      = useState<'neutral'|'right'|'left'>('neutral');
  const [showHeart, setShowHeart] = useState(false);
  const [flip,      setFlip]      = useState(false);
  const [ready,     setReady]     = useState(false);
  const [crumbs,    setCrumbs]    = useState<{id: number; x: number; size: number}[]>([]);

  const pigeonRef = useRef<HTMLDivElement>(null);
  const peckRef   = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const posRef    = useRef(0);
  const posYRef   = useRef(0);
  const rafRef    = useRef<number | null>(null);
  const highYRef  = useRef(260); // HIGH level (set dynamically at mount)
  const crumbRef  = useRef(0);

  // Init: pigeon starts at "final" position (floor level, between buttons and chatbot)
  useEffect(() => {
    highYRef.current = Math.round(window.innerHeight * 0.36);

    posRef.current  = window.innerWidth * PX_FINAL;
    posYRef.current = BOTTOM_FLOOR;

    if (pigeonRef.current) {
      pigeonRef.current.style.left   = `${posRef.current}px`;
      pigeonRef.current.style.bottom = `${posYRef.current}px`;
    }
    if (shadowRef.current) {
      shadowRef.current.style.left    = `${posRef.current + 45}px`;
      shadowRef.current.style.opacity = '0.5';
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const timers:    ReturnType<typeof setTimeout>[]  = [];
    const intervals: ReturnType<typeof setInterval>[] = [];
    const T = (fn: () => void, ms: number) => { const id = setTimeout(fn, ms); timers.push(id); return id; };
    const I = (fn: () => void, ms: number) => { const id = setInterval(fn, ms); intervals.push(id); return id; };

    const advance = () => setPhase(p => PHASES[(PHASES.indexOf(p) + 1) % PHASES.length]);

    const stopRAF = () => {
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    };

    const startWalk = () => {
      const seq = ['right', 'neutral', 'left', 'neutral'] as const;
      let i = 0;
      I(() => setFeet(seq[i++ % 4]), 190);
    };

    const applyPos = () => {
      if (pigeonRef.current) {
        pigeonRef.current.style.left   = `${posRef.current}px`;
        pigeonRef.current.style.bottom = `${posYRef.current}px`;
      }
      if (shadowRef.current) {
        const hi = highYRef.current;
        const lo = BOTTOM_FLOOR;
        const t  = Math.max(0, Math.min(1, (posYRef.current - lo) / Math.max(hi - lo, 1)));
        // Shadow follows pigeon X, stays at floor, fades + shrinks as pigeon rises
        shadowRef.current.style.left    = `${posRef.current + 45}px`;
        shadowRef.current.style.opacity = `${0.5 * (1 - t * 0.8)}`;
        shadowRef.current.style.width   = `${Math.round(60 * (1 - t * 0.5))}px`;
      }
    };

    const doPeck = (once = false) => {
      const el = peckRef.current;
      if (!el) return;
      el.classList.remove('pigeon-peck', 'pigeon-peck-once');
      void el.offsetWidth;
      el.classList.add(once ? 'pigeon-peck-once' : 'pigeon-peck');
    };

    const clearPeck = () => peckRef.current?.classList.remove('pigeon-peck', 'pigeon-peck-once');

    const spawnCrumbs = (cx: number, n = 6) => {
      setCrumbs(prev => {
        const items: {id: number; x: number; size: number}[] = Array.from({ length: n }, (_, i) => {
          const id = crumbRef.current++;
          return {
            id,
            x: Math.round(cx + 40 + (i - 2.5) * 18 + Math.sin(id * 2.1 + i) * 7),
            size: 5 + (id % 3) * 2,  // 5, 7 ou 9px — visível
          };
        });
        return [...prev.slice(-30), ...items];
      });
    };

    const BOTTOM_HIGH = highYRef.current;

    stopRAF();
    clearPeck();

    if (phase === 'pause') {
      // Resting at final position: floor level, between buttons and chatbot
      setFeet('neutral');
      setFlip(false);
      setShowHeart(false);
      setCrumbs([]);
      T(advance, DURATION.pause);

    } else if (phase === 'walk_left') {
      // ① Flat walk LEFT at floor level — no descent
      setFlip(false);
      startWalk();
      const targetX = window.innerWidth * PX_MID;
      let last = 0;
      const tick = (now: number) => {
        const dt = last ? now - last : 16; last = now;
        posRef.current = Math.max(posRef.current - 0.13 * dt, targetX);
        applyPos();
        if (posRef.current <= targetX) { applyPos(); advance(); return; }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);

    } else if (phase === 'peck') {
      setFeet('neutral');
      setFlip(false);
      doPeck(false);
      spawnCrumbs(posRef.current);
      T(advance, DURATION.peck);

    } else if (phase === 'look') {
      setFeet('neutral');
      setFlip(false);
      clearPeck();
      T(advance, DURATION.look);

    } else if (phase === 'kiss') {
      setFeet('neutral');
      setFlip(false);
      clearPeck();
      T(() => setShowHeart(true), 400);
      T(() => { setShowHeart(false); advance(); }, DURATION.kiss);

    } else if (phase === 'forage') {
      // ② Continue flat LEFT at floor level, occasional pecks
      setFlip(false);
      startWalk();
      const targetX = window.innerWidth * PX_FAR;
      I(() => { doPeck(true); spawnCrumbs(posRef.current, 3); T(clearPeck, 500); }, 1400);
      let last = 0;
      const tick = (now: number) => {
        const dt = last ? now - last : 16; last = now;
        posRef.current = Math.max(posRef.current - 0.05 * dt, targetX);
        applyPos();
        if (posRef.current <= targetX) { applyPos(); advance(); return; }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);

    } else if (phase === 'climb') {
      // ③ Continue LEFT while ASCENDING to the high level (diagonal toward left wall)
      setCrumbs([]);
      setFeet('neutral');
      setFlip(false);
      clearPeck();
      const targetX = 20;  // near left wall (px from left)
      const startX  = posRef.current;
      const startY  = posYRef.current;  // BOTTOM_FLOOR
      const totalDX = startX - targetX; // positive (going left)
      const totalDY = BOTTOM_HIGH - startY; // positive (rising up)
      const startT  = performance.now();
      const dur     = DURATION.climb;
      const tick = (now: number) => {
        const prog = Math.min((now - startT) / dur, 1);
        posRef.current  = startX - totalDX * prog;
        posYRef.current = startY + totalDY * prog;
        applyPos();
        if (prog >= 1) {
          posRef.current  = targetX;
          posYRef.current = BOTTOM_HIGH;
          applyPos();
          advance();
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);

    } else if (phase === 'walk_right') {
      // ④ Flat walk RIGHT at high level — all the way to far right
      setFlip(true);
      startWalk();
      const targetX = window.innerWidth * PX_RIGHT_END;
      posYRef.current = BOTTOM_HIGH;
      applyPos();
      let last = 0;
      const tick = (now: number) => {
        const dt = last ? now - last : 16; last = now;
        posRef.current = Math.min(posRef.current + 0.15 * dt, targetX);
        applyPos();
        if (posRef.current >= targetX) { applyPos(); advance(); return; }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);

    } else if (phase === 'descend') {
      // ⑤ VIRA (flip=false) + diagonal left-down to final position
      setFlip(false);
      startWalk();
      const targetX = window.innerWidth * PX_FINAL;
      const targetY = BOTTOM_FLOOR;
      const startX  = posRef.current;   // PX_RIGHT_END * vw
      const startY  = posYRef.current;  // BOTTOM_HIGH
      const totalDX = startX - targetX; // positive (going left)
      const totalDY = targetY - startY; // negative (descending)
      const startT  = performance.now();
      const dur     = 2500;
      const tick = (now: number) => {
        const prog = Math.min((now - startT) / dur, 1);
        posRef.current  = startX - totalDX * prog;
        posYRef.current = startY + totalDY * prog;
        applyPos();
        if (prog >= 1) {
          posRef.current  = targetX;
          posYRef.current = targetY;
          applyPos();
          advance();
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);

    } else if (phase === 'peck_end') {
      // Arrived at final position — lower head and peck the ground (3×)
      setFeet('neutral');
      setFlip(false);
      doPeck(false);
      spawnCrumbs(posRef.current);
      T(advance, DURATION.peck_end);
    }

    return () => {
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
      stopRAF();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, ready]);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      zIndex: 2, pointerEvents: 'none', overflow: 'hidden',
    }}>
      {/* Breadcrumbs — aparecem no chão quando o pombo bica */}
      {crumbs.map(crumb => (
        <div
          key={crumb.id}
          className="crumb-particle"
          style={{
            position:     'absolute',
            bottom:       BOTTOM_FLOOR - 5,
            left:         crumb.x,
            width:        crumb.size,
            height:       crumb.size,
            background:   crumb.id % 3 === 0 ? '#d4a848' : crumb.id % 3 === 1 ? '#c89030' : '#e0b850',
            boxShadow:    `0 0 3px rgba(220,160,60,0.6)`,
            borderRadius: crumb.id % 2 === 0 ? '1px' : '0px',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Shadow — stays at floor level, fades/shrinks as pigeon rises */}
      <div
        ref={shadowRef}
        style={{
          position:        'absolute',
          bottom:          BOTTOM_FLOOR - 8,
          width:           60,
          height:          14,
          backgroundImage: 'radial-gradient(ellipse, rgba(20,0,50,0.6) 0%, rgba(20,0,50,0) 70%)',
          borderRadius:    '50%',
          filter:          'blur(3px)',
          opacity:         0,
          transform:       'translateX(-50%)',
        }}
      />

      <div ref={pigeonRef} style={{ position: 'absolute', opacity: ready ? 1 : 0 }}>
        {/* peckRef wraps pigeon + eyelid so CSS child selector works */}
        <div ref={peckRef} style={{ position: 'relative' }}>
          <PigeonSVG s={S} feet={feet} flip={flip} noHat={false} />

          {/* Eyelid with pixel-art cílios — animated via .pigeon-peck .pigeon-eye */}
          <div
            className="pigeon-eye"
            style={{
              position:        'absolute',
              top:             EYE_TOP,
              left:            flip ? EYE_L_FLIP : EYE_L_NORMAL,
              width:           EYE_W,
              height:          EYE_H,
              // Two-layer bg: cílio lashes (top S px) + eyelid fill
              backgroundImage: [
                // Layer 1: pixel-art lashes at top — alternating dark / transparent columns
                `linear-gradient(90deg,` +
                  `#100818 0px, #100818 ${S}px,` +
                  `transparent ${S}px, transparent ${S * 2}px,` +
                  `#100818 ${S * 2}px, #100818 ${S * 3}px,` +
                  `transparent ${S * 3}px, transparent 100%` +
                `)`,
                // Layer 2: eyelid fill color
                `linear-gradient(180deg, #8878a8 0%, #6a5a90 100%)`,
              ].join(', '),
              backgroundSize:     `100% ${S}px, 100% 100%`,
              backgroundRepeat:   'no-repeat, no-repeat',
              backgroundPosition: '0 0, 0 0',
              transformOrigin:    'top center',
              transform:          'scaleY(0)',  // hidden by default; CSS animation overrides
              pointerEvents:      'none',
            }}
          />
        </div>

        <AnimatePresence>
          {showHeart && <HeartParticle key="heart" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

function pr(seed: number) {
  const x = Math.sin(seed + 1) * 43758.5453123;
  return x - Math.floor(x);
}

const stars = Array.from({ length: 120 }, (_, i) => ({
  x:    Math.floor(pr(i * 3.1)     * 1600),
  y:    Math.floor(pr(i * 3.1 + 1) * 460),
  size: pr(i * 3.1 + 2) > 0.92 ? 3 : pr(i * 3.1 + 2) > 0.72 ? 2 : 1,
  dur:  (2 + pr(i * 3.1 + 3) * 4).toFixed(1),
  del:  (pr(i * 3.1 + 4) * 5).toFixed(1),
  col:  pr(i * 3.1 + 5) > 0.65 ? "#f0d8ff" : pr(i * 3.1 + 5) > 0.35 ? "#c8e8ff" : "#ffffff",
  op:   pr(i * 3.1 + 2) > 0.92 ? 1 : pr(i * 3.1 + 2) > 0.72 ? 0.9 : 0.65,
}));

const farBuildings: [number, number, number, number][] = [
  [0,205,55,275],[53,235,36,245],[87,188,62,292],[147,215,40,265],
  [185,198,57,282],[240,220,34,260],[272,175,70,305],[340,204,44,276],
  [382,186,59,294],[439,212,38,268],[475,178,76,302],[549,200,50,280],
  [597,172,82,308],[677,198,55,282],[730,178,72,302],[800,207,44,273],
  [842,168,88,312],[928,198,52,282],[978,180,70,300],[1046,194,47,286],
  [1091,181,73,299],[1162,202,50,278],[1210,170,84,310],[1292,197,57,283],
  [1347,175,67,305],[1412,191,47,289],[1457,178,75,302],[1530,187,55,293],
];

const nearBuildings: [number, number, number, number, string][] = [
  [0,    100, 68, 380, "#4a3272"],
  [65,   128, 50, 352, "#3e2860"],
  [112,   72, 82, 408, "#583680"],
  [191,  104, 58, 376, "#4a3272"],
  [246,   84, 90, 396, "#4c2e74"],
  [333,  108, 46, 362, "#3e2860"],
  [376,   52,102, 428, "#583680"],
  [475,   90, 66, 390, "#4a3272"],
  [538,   76, 86, 404, "#4c2e74"],
  [621,  110, 52, 370, "#3e2860"],
  [670,   45,115, 435, "#583680"],
  [782,   88, 72, 392, "#4a3272"],
  [851,   62, 96, 418, "#4c2e74"],
  [944,  102, 60, 378, "#3e2860"],
  [1001,  38,127, 442, "#583680"],
  [1125,  76, 76, 404, "#4a3272"],
  [1198,  64, 92, 416, "#4c2e74"],
  [1287,  98, 54, 382, "#3e2860"],
  [1338,  56,108, 434, "#583680"],
  [1443,  82, 70, 398, "#4a3272"],
];

function PixelCar({ color }: { color: string }) {
  return (
    <>
      <rect x={7}  y={0}  width={27} height={10} fill={color} />
      <rect x={9}  y={1}  width={9}  height={7}  fill="#a8d8f4" opacity={0.72} />
      <rect x={23} y={1}  width={9}  height={7}  fill="#a8d8f4" opacity={0.72} />
      <rect x={0}  y={8}  width={48} height={10} fill={color} />
      <rect x={44} y={10} width={4}  height={4}  fill="#ffe890" />
      <rect x={0}  y={10} width={3}  height={4}  fill="#ff4848" />
      <rect x={5}  y={15} width={13} height={9}  fill="#0c0c1e" />
      <rect x={30} y={15} width={13} height={9}  fill="#0c0c1e" />
      <rect x={8}  y={17} width={5}  height={5}  fill="#2c2c48" />
      <rect x={33} y={17} width={5}  height={5}  fill="#2c2c48" />
    </>
  );
}

function PixelPlane() {
  return (
    <>
      <rect x={2}  y={0}  width={5}  height={8}  fill="#c0c0d8" />
      <rect x={4}  y={5}  width={56} height={6}  fill="#d8d8ec" />
      <rect x={58} y={6}  width={10} height={4}  fill="#e4e4f8" />
      <rect x={2}  y={6}  width={14} height={3}  fill="#b8b8d0" />
      <rect x={14} y={8}  width={36} height={4}  fill="#c8c8e0" />
      <rect x={10} y={10} width={4}  height={2}  fill="#b8b8d0" />
      <rect x={24} y={12} width={18} height={3}  fill="#888898" />
      <rect x={24} y={12} width={2}  height={3}  fill="#aaaaaa" />
      {[20, 28, 36, 44].map((wx, wi) => (
        <rect key={wi} x={wx} y={6} width={5} height={3} fill="#a8d4f8" opacity={0.85} />
      ))}
      <rect x={6}  y={5}  width={52} height={1}  fill="#5050c0" opacity={0.7} />
    </>
  );
}

function PixelBoat() {
  return (
    <>
      <rect x={35} y={-5} width={2}  height={5}  fill="#0a0a20" />
      <rect x={20} y={0}  width={8}  height={3}  fill="#cc1818" />
      <rect x={28} y={0}  width={4}  height={3}  fill="#e8e8e8" />
      <rect x={32} y={0}  width={8}  height={3}  fill="#1818cc" />
      <rect x={40} y={0}  width={4}  height={3}  fill="#e8e8e8" />
      <rect x={44} y={0}  width={7}  height={3}  fill="#cc1818" />
      <rect x={16} y={3}  width={48} height={10} fill="#e4e4f0" />
      <rect x={44} y={4}  width={16} height={8}  fill="#8ab8d8" opacity={0.9} />
      <rect x={20} y={5}  width={8}  height={6}  fill="#d0d0e8" />
      <rect x={16} y={12} width={48} height={2}  fill="#2040b8" opacity={0.9} />
      <rect x={0}  y={10} width={80} height={8}  fill="#0c1a3e" />
      <rect x={2}  y={10} width={76} height={2}  fill="#182a6a" />
      <rect x={72} y={8}  width={8}  height={2}  fill="#0c1a3e" />
      <rect x={76} y={10} width={4}  height={4}  fill="#080e26" />
      <rect x={78} y={14} width={4}  height={2}  fill="#8ec8e8" opacity={0.5} />
    </>
  );
}

const carDefs = [
  { color: "#1e46b4", dir: "right", dur: 9,  begin: 0,   y: 557 },
  { color: "#b02828", dir: "right", dur: 14, begin: -5,  y: 557 },
  { color: "#b89020", dir: "right", dur: 7,  begin: -9,  y: 557 },
  { color: "#1e7848", dir: "left",  dur: 10, begin: -2,  y: 577 },
  { color: "#7828b0", dir: "left",  dur: 8,  begin: -7,  y: 577 },
  { color: "#385a70", dir: "left",  dur: 12, begin: -11, y: 577 },
] as const;

export default function GlobalCityBg() {
  const reducedNear = nearBuildings.map(([x, y, w, h, fill]) => {
    const nh = Math.round(h * 0.70);
    const ny = y + h - nh;
    return { x, y: ny, w, h: nh, fill };
  });

  const windows = reducedNear.flatMap(({ x: bx, y: by, w: bw, h: bh }) => {
    const cols = Math.floor((bw - 10) / 14);
    const rows = Math.floor((bh - 20) / 18);
    const wins: { x: number; y: number; warm: boolean; pink: boolean; blink: boolean }[] = [];
    for (let r = 0; r < rows && r < 18; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.sin(bx * 0.3 + r * 1.7 + c * 3.1) <= -0.08) continue;
        const v = Math.sin(bx + r + c);
        wins.push({
          x:     bx + 6 + c * 14,
          y:     by + 12 + r * 18,
          warm:  v > 0.3,
          pink:  v > -0.1 && v <= 0.3,
          blink: Math.sin(bx * 0.5 + r * 2.1 + c * 0.8) > 0.44,
        });
      }
    }
    return wins;
  });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #0a0620 0%, #140c36 38%, #1e1246 68%, #2c1852 100%)",
      }}/>
      <svg
        viewBox="0 0 1600 600"
        width="100%" height="100%"
        preserveAspectRatio="xMidYMax slice"
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, imageRendering: "pixelated", shapeRendering: "crispEdges" }}
      >
        {/* Stars */}
        {stars.map((s, i) => (
          <rect key={`s${i}`} x={s.x} y={s.y} width={s.size} height={s.size}
            fill={s.col} opacity={s.op}
            style={{ animation: `twinkle ${s.dur}s ${s.del}s ease-in-out infinite` }}
          />
        ))}

        {/* Planes */}
        <g>
          <animateTransform attributeName="transform" type="translate"
            from="1720 78" to="-120 78" dur="52s" begin="0s" repeatCount="indefinite" />
          <g transform="translate(70,0) scale(-1,1)">
            <PixelPlane />
          </g>
        </g>
        <g>
          <animateTransform attributeName="transform" type="translate"
            from="-120 126" to="1720 126" dur="70s" begin="-32s" repeatCount="indefinite" />
          <PixelPlane />
        </g>

        {/* Far silhouette */}
        {farBuildings.map(([x, y, w, h], i) => (
          <rect key={`f${i}`} x={x} y={y} width={w} height={h} fill="#1c0c38" />
        ))}

        {/* Near buildings */}
        {reducedNear.map(({ x, y, w, h, fill }, i) => (
          <rect key={`n${i}`} x={x} y={y} width={w} height={h} fill={fill} />
        ))}

        {/* Windows */}
        {windows.map((w, i) => (
          <rect key={`w${i}`} x={w.x} y={w.y} width={7} height={9}
            fill={w.warm ? "#f0d85090" : w.pink ? "#f0a0d090" : "#48c0b890"}
            style={w.blink ? { animation: `pigeon-wblink ${2 + ((i*0.4)%2)}s ${(i*0.3)%3}s infinite` } : undefined}
          />
        ))}

        {/* River */}
        <rect x={0} y={480} width={1600} height={72} fill="#04090f" />

        {/* Building reflections in river */}
        {reducedNear.flatMap(({ x: bx, y: _by, w: bw, h: bh, fill }, bi) => {
          const visH = Math.min(bh, 68);
          const strips = Math.floor(visH / 2);
          return Array.from({ length: strips }, (_, si) => {
            const stripY = 480 + si * 2;
            const shift = Math.round(Math.sin(si * 0.9 + bx * 0.008 + bi * 1.3) * (1 + si * 0.07));
            const op = Math.max(0, 0.52 - (si / strips) * 0.44);
            return (
              <rect key={`rf${bi}-${si}`}
                x={bx + shift} y={stripY} width={bw} height={2}
                fill={fill} opacity={op}
              />
            );
          });
        })}

        {/* Window reflections in river */}
        {reducedNear.flatMap(({ x: bx, w: bw }, bi) => {
          const cols = Math.floor((bw - 8) / 13);
          const results: React.ReactElement[] = [];
          for (let r = 0; r < 4; r++) {
            for (let c = 0; c < Math.min(cols, 7); c++) {
              const v = Math.sin(bx * 0.31 + r * 1.7 + c * 2.9 + bi);
              if (v < 0.15) continue;
              const warm = v > 0.55;
              const pink = v > 0.25 && v <= 0.55;
              const refY = 481 + r * 12;
              if (refY > 545) continue;
              const shake = Math.round(Math.sin(r * 2.3 + c + bx) * 1.8);
              results.push(
                <rect key={`wf${bi}-${r}-${c}`}
                  x={bx + 5 + c * 13 + shake} y={refY}
                  width={5} height={3}
                  fill={warm ? "#f0d860" : pink ? "#f0a0d0" : "#48c0b8"}
                  opacity={0.30 - r * 0.05}
                  style={{ animation: `water-wave ${3 + (r + c) % 4}s ${((bi * 0.25 + c * 0.4) % 4).toFixed(1)}s ease-in-out infinite` }}
                />
              );
            }
          }
          return results;
        })}

        {/* Water ripples */}
        {[489, 502, 516, 531, 545].map((ry, ri) => (
          <rect key={`rw${ri}`} x={0} y={ry} width={1600} height={1}
            fill="#1a3a5a" opacity={0.22}
            style={{ animation: `water-wave ${4 + ri}s ${ri * 0.7}s ease-in-out infinite` }}
          />
        ))}

        <rect x={0} y={536} width={1600} height={16} fill="#04090f" opacity={0.55} />

        {/* Surface light glints */}
        {Array.from({ length: 6 }, (_, ri) => (
          <rect key={`gl${ri}`}
            x={Math.round(pr(ri * 19.3) * 1540)}
            y={481 + Math.round(pr(ri * 19.3 + 1) * 30)}
            width={Math.round(3 + pr(ri * 19.3 + 2) * 6)}
            height={Math.round(6 + pr(ri * 19.3 + 3) * 16)}
            fill={ri % 2 === 0 ? "#f0a0d0" : "#48c0b8"}
            opacity={0.12}
          />
        ))}

        {/* Police boat */}
        <g>
          <animateTransform attributeName="transform" type="translate"
            from="-120 483" to="1720 483" dur="32s" begin="-8s" repeatCount="indefinite" />
          <PixelBoat />
          <rect x={16} y={18} width={48} height={4}  fill="#e4e4f0" opacity={0.12} />
          <rect x={0}  y={22} width={80} height={3}  fill="#0c1a3e" opacity={0.14} />
          <rect x={4}  y={25} width={72} height={2}  fill="#2040b8" opacity={0.08} />
          <rect x={8}  y={27} width={64} height={2}  fill="#0c1a3e" opacity={0.06} />
        </g>

        {/* Golden Gate Bridge towers */}
        {[450, 1150].map((tx, ti) => (
          <g key={`ggT${ti}`}>
            <rect x={tx}    y={458} width={9} height={142} fill="#c83020" />
            <rect x={tx+20} y={458} width={9} height={142} fill="#c83020" />
            {[472, 496, 520].map((cy, ci) => (
              <rect key={`cb${ti}${ci}`} x={tx-4} y={cy} width={37} height={5} fill="#c83020" />
            ))}
            <rect x={tx-5}  y={452} width={39} height={8}  fill="#c83020" />
            <rect x={tx+2}  y={444} width={25} height={9}  fill="#d04030" />
            <rect x={tx+9}  y={458} width={11} height={142} fill="#7a1210" opacity={0.35} />
          </g>
        ))}

        {/* Bridge wall */}
        <rect x={0} y={548} width={1600} height={4} fill="#14103a" />

        {/* Road */}
        <rect x={0} y={552} width={1600} height={48} fill="#10091e" />
        {Array.from({ length: 22 }, (_, i) => (
          <rect key={`ld${i}`} x={i * 80} y={569} width={40} height={3} fill="#241c3c" opacity={0.9} />
        ))}
        <rect x={0} y={552} width={1600} height={2} fill="#382860" opacity={0.5} />

        {/* Bridge cables */}
        <path
          d="M -20,552 C 200,462 380,447 450,446 C 800,460 800,460 1150,446 C 1220,447 1400,462 1620,552"
          stroke="#c83020" strokeWidth="3.5" fill="none" strokeLinecap="round"
        />
        <path
          d="M -20,552 C 200,462 380,447 450,446 C 800,460 800,460 1150,446 C 1220,447 1400,462 1620,552"
          stroke="#e86050" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity={0.4}
        />
        {Array.from({ length: 20 }, (_, hi) => {
          const hx = 474 + hi * 37;
          const t  = (hx - 450) / 700;
          const hy = Math.round(446 + 14 * 4 * t * (1 - t));
          return <line key={`hg${hi}`} x1={hx} y1={hy} x2={hx} y2={553} stroke="#c83020" strokeWidth="1.2" opacity={0.5} />;
        })}

        {/* Cars */}
        {carDefs.map((c, i) => {
          const fromX = c.dir === "right" ? -60 : 1664;
          const toX   = c.dir === "right" ? 1664 : -60;
          return (
            <g key={`car${i}`}>
              <animateTransform
                attributeName="transform" type="translate"
                from={`${fromX} ${c.y}`} to={`${toX} ${c.y}`}
                dur={`${c.dur}s`} begin={`${c.begin}s`} repeatCount="indefinite"
              />
              {c.dir === "left" ? (
                <g transform="translate(48,0) scale(-1,1)">
                  <PixelCar color={c.color} />
                </g>
              ) : (
                <PixelCar color={c.color} />
              )}
            </g>
          );
        })}

        {/* Ground glow */}
        <rect x={0} y={596} width={1600} height={4} fill="#c040a030" />
      </svg>

      {/* Scanlines */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.018) 3px, rgba(0,0,0,0.018) 4px)",
      }}/>

      {/* water-wave keyframe */}
      <style>{`
        @keyframes water-wave {
          0%, 100% { opacity: 0.04; }
          50%       { opacity: 0.13; }
        }
      `}</style>
    </div>
  );
}

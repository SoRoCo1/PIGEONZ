"use client";

// Lightweight city skyline silhouette — used as background in all sections
export default function CityBg({ tint = "#d058a0" }: { tint?: string }) {
  const VW = 1400;
  const VH = 240;

  // Building list: [x, y, w, h, fill]
  const buildings: [number, number, number, number, string][] = [
    [0,    80, 60,  160, "#281848"],
    [55,   110, 45, 130, "#221440"],
    [95,   60,  70, 180, "#301a50"],
    [160,  95,  50, 145, "#281848"],
    [205,  75,  80, 165, "#2c1c4c"],
    [280,  105, 40, 135, "#221440"],
    [315,  55,  90, 185, "#301a50"],
    [400,  85,  55, 155, "#281848"],
    [450,  70,  75, 170, "#2c1c4c"],
    [520,  100, 45, 140, "#221440"],
    [560,  50,  100,190, "#301a50"],
    [655,  85,  60, 155, "#281848"],
    [710,  65,  85, 175, "#2c1c4c"],
    [790,  95,  50, 145, "#221440"],
    [835,  45,  110,195, "#301a50"],
    [940,  80,  65, 160, "#281848"],
    [1000, 70,  80, 170, "#2c1c4c"],
    [1075, 100, 45, 140, "#221440"],
    [1115, 55,  95, 185, "#301a50"],
    [1205, 85,  60, 155, "#281848"],
    [1260, 70,  80, 170, "#2c1c4c"],
    [1335, 95,  65, 145, "#221440"],
  ];

  // Window list: [bx, by, cols, rows] — generate a grid of windows for each building
  const winRects: { x:number; y:number; warm:boolean; blink:boolean }[] = [];
  buildings.forEach(([bx, by, bw, bh]) => {
    const cols = Math.floor((bw - 10) / 14);
    const rows = Math.floor((bh - 20) / 18);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const lit = Math.sin(bx * 0.3 + r * 1.7 + c * 3.1) > 0.05;
        if (!lit) continue;
        winRects.push({
          x: bx + 6 + c * 14,
          y: by + 12 + r * 18,
          warm: Math.sin(bx + r + c) > 0,
          blink: Math.sin(bx * 0.5 + r * 2.1 + c * 0.8) > 0.4,
        });
      }
    }
  });

  return (
    <div style={{ position:"absolute", bottom:0, left:0, right:0, height:VH, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%" height="100%"
        preserveAspectRatio="xMidYMax slice"
        style={{ display:"block", imageRendering:"pixelated", shapeRendering:"crispEdges" }}
      >
        {/* Building bodies */}
        {buildings.map(([x,y,w,h,fill],i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill={fill}/>
        ))}

        {/* Windows */}
        {winRects.map((w, i) => (
          <rect key={`w${i}`}
            x={w.x} y={w.y} width={6} height={8}
            fill={w.warm ? "#f0e06044" : "#48c0b844"}
            style={w.blink ? {
              animation: `pigeon-wblink ${2+((i*0.4)%2)}s ${(i*0.3)%3}s infinite`
            } : undefined}
          />
        ))}

        {/* Ground line */}
        <rect x={0} y={VH-2} width={VW} height={2} fill={`${tint}22`}/>
      </svg>
    </div>
  );
}

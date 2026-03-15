"use client";

export default function Rooftop() {
  const VW = 1400;
  const VH = 480;
  const wallT  = 256;
  const wallB  = 308;
  const floorH = VH - wallB;

  // Far buildings — dark, no windows
  const farBuildings: [number, number, number, number][] = [
    [0,170,60,86],[56,195,40,61],[92,150,75,106],[163,180,48,76],
    [207,162,65,94],[268,192,36,64],[300,140,90,116],[386,172,52,84],
    [434,155,70,101],[500,185,44,71],[540,130,100,126],[636,165,58,91],
    [690,148,78,108],[764,178,46,78],[806,125,110,131],[912,160,62,96],
    [970,142,82,114],[1048,175,48,81],[1092,135,105,121],[1193,165,58,91],
    [1247,148,72,108],[1315,175,50,81],[1361,138,39,118],
  ];

  // Near buildings — with blinking windows
  const nearBuildings: [number, number, number, number, string][] = [
    [0,   100, 70, 156, "#2a1848"],
    [66,  130, 50, 126, "#281644"],
    [112,  60, 90, 196, "#301e52"],
    [198, 100, 60, 156, "#2a1848"],
    [254,  75, 88, 181, "#281644"],
    [338, 115, 44, 141, "#301e52"],
    [378,  40,108, 216, "#2a1848"],
    [482,  85, 72, 171, "#281644"],
    [550,  60, 96, 196, "#301e52"],
    [642, 105, 56, 151, "#2a1848"],
    [694,  30,120, 226, "#2c1a4c"],
    [810,  70, 84, 186, "#301e52"],
    [890,  48,108, 208, "#2a1848"],
    [994,  95, 64, 161, "#281644"],
    [1054,  30,120, 226, "#2c1a4c"],
    [1170,  78, 76, 178, "#301e52"],
    [1242,  52,102, 204, "#2a1848"],
    [1340,  90, 60, 166, "#281644"],
  ];

  // Generate windows (don't enter parapet area)
  const winRects: { x:number; y:number; warm:boolean; pink:boolean; blink:boolean }[] = [];
  nearBuildings.forEach(([bx, by, bw, bh]) => {
    const cols = Math.floor((bw - 10) / 14);
    const rows = Math.floor((bh - 20) / 18);
    for (let r = 0; r < rows; r++) {
      const wy = by + 12 + r * 18;
      if (wy >= wallT - 6) continue;
      for (let c = 0; c < cols; c++) {
        const lit = Math.sin(bx * 0.3 + r * 1.7 + c * 3.1) > 0.05;
        if (!lit) continue;
        const v = Math.sin(bx + r + c);
        winRects.push({
          x: bx + 6 + c * 14,
          y: wy,
          warm: v > 0.3,
          pink: v > -0.1 && v <= 0.3,
          blink: Math.sin(bx * 0.5 + r * 2.1 + c * 0.8) > 0.4,
        });
      }
    }
  });

  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%" height="100%"
        preserveAspectRatio="xMidYMax slice"
        style={{ display:"block", imageRendering:"pixelated", shapeRendering:"crispEdges" }}
      >
        {/* Far buildings */}
        {farBuildings.map(([x,y,w,h],i) => (
          <rect key={`fb${i}`} x={x} y={y} width={w} height={h} fill="#1c0e38" />
        ))}

        {/* Near buildings */}
        {nearBuildings.map(([x,y,w,h,fill],i) => (
          <rect key={`nb${i}`} x={x} y={y} width={w} height={h} fill={fill} />
        ))}

        {/* Windows */}
        {winRects.map((w,i) => (
          <rect key={`ww${i}`}
            x={w.x} y={w.y} width={6} height={8}
            fill={w.warm ? "#f0e06055" : w.pink ? "#f0a0d055" : "#48c0b855"}
            style={w.blink ? {
              animation: `pigeon-wblink ${2+((i*0.4)%2)}s ${(i*0.3)%3}s infinite`
            } : undefined}
          />
        ))}

        {/* ══ PARAPET / BACK WALL ══ */}
        <rect x={0} y={wallT}   width={VW} height={wallB-wallT} fill="#4a2060" />
        <rect x={0} y={wallT}   width={VW} height={5}  fill="#7a3878" />
        <rect x={0} y={wallT+5} width={VW} height={6}  fill="#3e1850" />
        <rect x={0} y={wallB-6} width={VW} height={6}  fill="#2e1040" />
        {Array.from({length:88}, (_,i) => (
          i % 4 === 0
            ? <rect key={`pct${i}`} x={i*16} y={wallT} width={10} height={7} fill="#6a3070" />
            : null
        ))}

        {/* ══ ROOFTOP FLOOR ══ */}
        <rect x={0} y={wallB}     width={VW} height={floorH}       fill="#887098" />
        <rect x={0} y={wallB}     width={VW} height={24}           fill="#6a5888" />
        <rect x={0} y={wallB+24}  width={VW} height={40}           fill="#7a6898" />
        <rect x={0} y={wallB+64}  width={VW} height={60}           fill="#8878a8" />
        <rect x={0} y={wallB+124} width={VW} height={VH-wallB-124} fill="#9080b0" />

        {/* Floor texture lines */}
        {([[0,wallB+18,320,2],[380,wallB+42,280,2],[720,wallB+30,350,2],[1100,wallB+50,200,2],
           [150,wallB+80,200,2],[500,wallB+95,260,2],[900,wallB+88,300,2]] as [number,number,number,number][])
          .map(([x,y,w,h],i) => (
            <rect key={`flt${i}`} x={x} y={y} width={w} height={h} fill="#60508088" opacity={0.5} />
          ))}

        {/* ══ HVAC BOX (left) ══ */}
        <rect x={20} y={168} width={108} height={10}  fill="#5a3870" />
        <rect x={20} y={178} width={108} height={140} fill="#3a2258" />
        <rect x={20} y={178} width={5}   height={140} fill="#4a3068" />
        <rect x={20} y={178} width={108} height={8}   fill="#4a3068" />
        <rect x={32} y={198} width={74}  height={60}  fill="#100c20" />
        <rect x={32} y={198} width={74}  height={5}   fill="#201838" />
        <rect x={32} y={198} width={4}   height={60}  fill="#201838" />
        <rect x={36} y={208} width={66}  height={3}   fill="#2a2040" />
        <rect x={36} y={216} width={44}  height={3}   fill="#d058a055" />
        <rect x={36} y={224} width={55}  height={3}   fill="#48c0b844" />
        <rect x={36} y={232} width={38}  height={3}   fill="#d058a044" />
        <rect x={36} y={240} width={60}  height={3}   fill="#2a2040" />
        {[275,285,295,305].map(y => (
          <rect key={`vnt${y}`} x={32} y={y} width={74} height={4} fill="#2a1848" />
        ))}
        <rect x={58} y={96} width={8}  height={80} fill="#282040" />
        <rect x={54} y={92} width={16} height={8}  fill="#303050" />

        {/* ══ LAMP POST (right) ══ */}
        <rect x={1040} y={216} width={8} height={108} fill="#282040" />
        <rect x={1040} y={216} width={3} height={108} fill="#302448" />{/* left highlight */}

        {/* ══ STREET LAMP — Victorian pixel art ══ */}

        {/* Glow atmosphere */}
        <circle cx={992} cy={210} r={55} fill="rgba(255,220,60,0.04)" />
        <circle cx={992} cy={210} r={36} fill="rgba(255,220,60,0.07)" />
        <circle cx={992} cy={210} r={22} fill="rgba(255,220,60,0.10)" />

        {/* Light cone downward */}
        <polygon points="985,226 999,226 1014,274 970,274" fill="rgba(255,215,50,0.06)" />

        {/* Arm with elbow */}
        <rect x={994} y={211} width={46} height={5}  fill="#282040" />{/* main arm */}
        <rect x={994} y={211} width={46} height={2}  fill="#38304e" />{/* top highlight */}
        <rect x={1034} y={206} width={10} height={14} fill="#302448" />{/* bracket at post */}
        <rect x={1034} y={206} width={3}  height={14} fill="#3c3058" />{/* bracket highlight */}

        {/* Finial — decorative top spike */}
        <rect x={991} y={180} width={2}  height={3}  fill="#6050a0" />
        <rect x={990} y={183} width={4}  height={2}  fill="#504088" />

        {/* Crown — wide cap */}
        <rect x={986} y={185} width={12} height={2}  fill="#584878" />{/* top highlight */}
        <rect x={984} y={187} width={16} height={3}  fill="#3a2858" />
        <rect x={986} y={190} width={12} height={2}  fill="#2e2050" />

        {/* Neck */}
        <rect x={989} y={192} width={6}  height={4}  fill="#241840" />
        <rect x={989} y={192} width={2}  height={4}  fill="#382a58" />{/* left highlight */}

        {/* Upper frame bar */}
        <rect x={984} y={196} width={16} height={3}  fill="#2c1e48" />
        <rect x={984} y={196} width={16} height={1}  fill="#483868" />{/* top edge shine */}

        {/* Glass section — left/right dark frames + warm glow center */}
        <rect x={983} y={199} width={3}  height={14} fill="#1c1230" />{/* left frame dark */}
        <rect x={984} y={199} width={1}  height={14} fill="#302448" />{/* left frame edge */}
        <rect x={998} y={199} width={3}  height={14} fill="#1c1230" />{/* right frame dark */}
        <rect x={985} y={199} width={13} height={14} fill="rgba(255,225,75,0.86)" />{/* glass lit */}
        <rect x={986} y={200} width={4}  height={12} fill="rgba(255,248,195,0.62)" />{/* inner shine */}
        <rect x={996} y={200} width={2}  height={12} fill="rgba(200,170,40,0.40)" />{/* right dim */}
        {/* Horizontal bar mid-glass */}
        <rect x={983} y={205} width={18} height={2}  fill="rgba(28,18,48,0.55)" />

        {/* Lower frame bar */}
        <rect x={984} y={213} width={16} height={3}  fill="#2c1e48" />
        <rect x={984} y={215} width={16} height={1}  fill="#1a1030" />{/* bottom shadow */}

        {/* Skirt — 3-step flare */}
        <rect x={982} y={216} width={20} height={3}  fill="#342450" />
        <rect x={982} y={216} width={4}  height={3}  fill="#483870" />{/* left highlight */}
        <rect x={984} y={219} width={16} height={2}  fill="#28184a" />
        <rect x={987} y={221} width={10} height={2}  fill="#201440" />

        {/* Bottom drip ornament */}
        <rect x={990} y={223} width={4}  height={4}  fill="#2a1c48" />
        <rect x={991} y={227} width={2}  height={3}  fill="#241440" />
        <rect x={991} y={230} width={2}  height={2}  fill="#6050a0" />{/* accent tip */}

        {/* Wires */}
        <rect x={128} y={272} width={220} height={3} fill="#201830" opacity={0.8} />
        <rect x={900} y={268} width={180} height={3} fill="#201830" opacity={0.8} />
      </svg>
    </div>
  );
}

"use client";
import { PigeonSVG } from "./Pigeon";

// Window data: [x, y, fill, blinkDelay?]
const D  = "#1c1030";   // dark off
const A  = "#e0a030";   // amber lit
const T  = "#48c0b8";   // teal lit
const PK = "#e060a0";   // pink lit
const LV = "#b890d8";   // lavender lit

type W = [number, number, string, string?];

const WINS: W[] = [
  // Building 1 (x=0, y=50, w=30)
  [4,57,A],[12,57,D],[20,57,PK,"0s"],
  [4,67,T],[12,67,D],[20,67,A,"1.7s"],
  [4,77,D],[12,77,A,"2.9s"],[20,77,D],
  [4,87,A],[12,87,D],[20,87,T],
  [4,97,D],[12,97,D],[20,97,PK,"1.1s"],
  // Building 2 (x=26, y=66, w=22)
  [30,72,A],[39,72,D],[30,82,D],[39,82,T,"0.4s"],[30,92,A,"3.2s"],[39,92,D],
  // Building 3 (x=45, y=32, w=40) tallest
  [49,38,D],[58,38,A],[67,38,D],[76,38,LV],
  [49,48,A],[58,48,D],[67,48,PK,"0.6s"],[76,48,D],
  [49,58,D],[58,58,A],[67,58,D],[76,58,T],
  [49,68,A],[58,68,D],[67,68,A,"2.2s"],[76,68,D],
  [49,78,D],[58,78,T],[67,78,D],[76,78,A,"1.4s"],
  [49,88,A],[58,88,D],[67,88,D],[76,88,LV],
  [49,98,D],[58,98,A],[67,98,D],[76,98,D],
  // Building 4 (x=84, y=52, w=28)
  [88,58,D],[97,58,A],[106,58,D],
  [88,68,A,"1.9s"],[97,68,D],[106,68,T],
  [88,78,D],[97,78,D],[106,78,A],
  [88,88,PK,"2.6s"],[97,88,D],[106,88,D],
  [88,98,D],[97,98,A],[106,98,D],
  // Building 5 (x=112, y=40, w=44)
  [116,46,A],[126,46,D],[136,46,D],[146,46,LV],
  [116,56,D],[126,56,T,"0.2s"],[136,56,A],[146,56,D],
  [116,66,A],[126,66,D],[136,66,D],[146,66,PK,"2.4s"],
  [116,76,D],[126,76,A,"3.7s"],[136,76,T],[146,76,D],
  [116,86,D],[126,86,D],[136,86,A],[146,86,D],
  [116,96,T],[126,96,D],[136,96,D],[146,96,A],
  // Building 6 (x=155, y=58, w=28)
  [158,64,D],[167,64,A],[176,64,D],
  [158,74,A,"0.8s"],[167,74,D],[176,74,T],
  [158,84,D],[167,84,D],[176,84,A],
  [158,94,LV],[167,94,D],[176,94,D],
  // Building 7 (x=182, y=44, w=36)
  [185,50,A],[193,50,D],[201,50,D],[209,50,LV],
  [185,60,D],[193,60,A],[201,60,PK,"1.3s"],[209,60,D],
  [185,70,T],[193,70,D],[201,70,A],[209,70,D],
  [185,80,D],[193,80,D],[201,80,D],[209,80,A,"3.1s"],
  [185,90,A],[193,90,T],[201,90,D],[209,90,D],
  [185,100,D],[193,100,D],[201,100,A],[209,100,LV],
];

export default function FooterScene() {
  return (
    <div style={{ position:"relative", width:240, height:140, marginTop:16, overflow:"hidden" }}>
      <svg
        viewBox="0 0 240 140"
        width={240} height={140}
        style={{ imageRendering:"pixelated", shapeRendering:"crispEdges", display:"block",
          position:"absolute", inset:0 }}
      >
        {/* Sky */}
        <rect width={240} height={140} fill="#0a0820"/>

        {/* Stars */}
        {([[8,6],[22,14],[45,8],[73,18],[110,10],[148,7],[185,15],[228,9],[160,22],[95,25],[35,25],[200,19]] as [number,number][]).map(([x,y],i)=>(
          <rect key={i} x={x} y={y} width={1} height={1}
            fill={i%3===0?"#f0e080":i%3===1?"#80d8d0":"#ffffff"}
            opacity={0.25 + 0.35 * ((i * 0.618) % 1)}
          />
        ))}

        {/* Buildings — back to front */}
        <rect x={0}   y={50}  width={30} height={56} fill="#100c24"/>
        <rect x={26}  y={66}  width={22} height={40} fill="#0e0a20"/>
        <rect x={45}  y={32}  width={40} height={74} fill="#140e28"/>
        <rect x={84}  y={52}  width={28} height={54} fill="#100c24"/>
        <rect x={112} y={40}  width={44} height={66} fill="#160e2c"/>
        <rect x={155} y={58}  width={28} height={48} fill="#0e0a20"/>
        <rect x={182} y={44}  width={36} height={62} fill="#120e26"/>

        {/* Windows */}
        {WINS.map(([x,y,color,delay],i)=>(
          <rect key={i} x={x} y={y} width={3} height={4} fill={color}
            style={delay ? { animation:`pigeon-wblink ${2.2+((i*0.38)%1.6)}s ${delay} infinite` } : undefined}
          />
        ))}

        {/* Branch / wire */}
        <rect x={0} y={106} width={240} height={4} fill="#2e2050"/>
        <rect x={0} y={106} width={240} height={1} fill="#4a3070"/>
        {/* Support post */}
        <rect x={64} y={90} width={3} height={16} fill="#241840"/>
      </svg>

      {/* Pigeon — flies in from right, lands on branch */}
      <div style={{
        position:"absolute",
        bottom: 34,
        right: 16,
        animation: "pigeon-land 2.4s cubic-bezier(0.34,1.2,0.64,1) 1s both",
        filter: "drop-shadow(0 4px 10px rgba(18,10,30,.9))",
      }}>
        <PigeonSVG s={3} />
      </div>
    </div>
  );
}

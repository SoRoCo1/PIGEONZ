import Navbar        from "@/components/Navbar";
import Hero          from "@/components/Hero";
import Marquee       from "@/components/Marquee";
import WhoWeAre      from "@/components/WhoWeAre";
import Services      from "@/components/Services";
import HowItWorks    from "@/components/HowItWorks";
import Templates     from "@/components/Templates";
import Pricing       from "@/components/Pricing";
import AboutDev      from "@/components/AboutDev";
import Contact       from "@/components/Contact";
import Footer        from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import GlobalCityBg  from "@/components/GlobalCityBg";

export default function Home() {
  return (
    <>
    <GlobalCityBg />
    <main style={{ position: "relative", zIndex: 1 }}>
      <Navbar />

      <Hero />

      {/* Marquee 1 — after hero */}
      <Marquee
        items={["PIGEONZ.AI","FULLSTACK","REACT + NEXT.JS","DJANGO","POSTGRESQL","GOOGLE CLOUD","IA INTEGRADA","PIXEL PERFECT"]}
        speed={28}
        bgColor="#2e2048"
        textColor="#f0a0d0"
        borderColor="#5030a0"
      />

      <WhoWeAre />

      <Services />

      {/* Marquee 2 — after services */}
      <Marquee
        items={["NEXT.JS 15","DJANGO 4","POSTGRESQL","TYPESCRIPT","FRAMER MOTION","TAILWIND CSS","CLOUD RUN","ANTHROPIC AI"]}
        speed={30}
        bgColor="#1a0e38"
        textColor="#48c0b8"
        borderColor="#204040"
      />

      <HowItWorks />

      {/* Marquee 3 — after how */}
      <Marquee
        items={["PIX","WEBHOOKS","OAUTH","FIREBASE","CLOUD RUN","ANTHROPIC AI","NEXT.JS","POSTGRESQL"]}
        speed={26}
        bgColor="#302010"
        textColor="#fbbf24"
        borderColor="#805010"
      />

      <Templates />

      <Pricing />

      <AboutDev />

      {/* Marquee 4 — before contact */}
      <Marquee
        items={["VAMOS CONSTRUIR","SEU NEGÓCIO MERECE","CÓDIGO DE QUALIDADE","DESIGN QUE CONVERTE","ENTREGA REAL"]}
        speed={24}
        bgColor="#2e2048"
        textColor="#f472b6"
        borderColor="#803060"
        reverse
      />

      <Contact />

      <Footer />
      <WhatsAppButton />
    </main>
    </>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "pigeonz.ai — Sites que voam",
  description: "Desenvolvimento fullstack para micro e médio empreendedor. Sites bonitos e funcionais, aplicativos mobile e softwares sob medida que realmente convertem. React, Next.js, Django, PostgreSQL, Google Cloud.",
  keywords: ["sites para empresas","desenvolvimento web","pigeonz.ai","fullstack","Next.js","Django"],
  openGraph: {
    title: "pigeonz.ai — Sites que voam",
    description: "Fullstack studio especializado em micro e médio empreendedor.",
    type: "website",
    images: [{ url: "/pigeon.png", width: 512, height: 512, alt: "pigeonz.ai pombo pixel art" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body><LanguageProvider><LenisProvider>{children}</LenisProvider><Toaster position="bottom-right" /></LanguageProvider></body>
    </html>
  );
}

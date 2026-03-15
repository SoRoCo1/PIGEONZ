"use client";
import { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";
import translations, { Lang, Translations } from "@/lib/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "pt",
  setLang: () => {},
  t: translations.pt,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      if (typeof window !== "undefined" && typeof window.document !== "undefined") {
        const saved = window.localStorage.getItem("pigeonz_lang") as Lang | null;
        if (saved && saved in translations) return saved;
      }
    } catch {}
    return "pt";
  });
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    try { window.localStorage.setItem("pigeonz_lang", newLang); } catch {}
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

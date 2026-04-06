"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import id from "@/locales/id.json";
import en from "@/locales/en.json";
import { createClient } from "@/lib/supabase/client";

type Language = "id" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (path: string) => string;
}

const translations: Record<Language, any> = { id, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  children, 
  initialLang = "id" 
}: { 
  children: React.ReactNode; 
  initialLang?: Language;
}) {
  const [lang, setLangState] = useState<Language>(initialLang);

  // Sync with LocalStorage and Supabase on change
  const setLang = async (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("zenith_lang", newLang);

    // Sync to Supabase Metadata
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const preferences = user.user_metadata?.preferences || {};
      await supabase.auth.updateUser({
        data: {
          preferences: { ...preferences, lang: newLang }
        }
      });
    }
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("zenith_lang") as Language;
    if (savedLang && (savedLang === "id" || savedLang === "en")) {
      setLangState(savedLang);
    }
  }, []);

  // Translation function: supports nested keys like "nav.dashboard"
  const t = (path: string): string => {
    try {
      const keys = path.split(".");
      let result = translations[lang] || translations["id"];

      for (const key of keys) {
        if (!result || typeof result !== 'object') return path;
        if (result[key] === undefined) return path;
        result = result[key];
      }

      return typeof result === 'string' ? result : path;
    } catch (err) {
      return path;
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

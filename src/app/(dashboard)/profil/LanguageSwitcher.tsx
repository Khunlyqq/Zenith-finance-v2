"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="bg-[#181c1d] rounded-[2rem] p-8 border border-[#899295]/5 premium-glow" style={{ "--card-glow-rgb": "134, 210, 229" } as React.CSSProperties}>
      <div className="flex items-center gap-6 mb-6">
        <div className="w-14 h-14 bg-[#86d2e5]/10 rounded-[1.2rem] flex items-center justify-center text-[#86d2e4]">
          <Globe size={24} />
        </div>
        <div className="text-left">
          <p className="text-base font-bold text-[#e0e3e4]">{t("profile.language")}</p>
          <p className="text-[10px] font-black text-[#899295] uppercase tracking-widest mt-1">
            {lang === "id" ? "Pilih bahasa antarmuka" : "Select interface language"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setLang("id")}
          className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            lang === "id"
              ? "bg-[#86d2e5] text-[#101415] shadow-[0_0_20px_rgba(134,210,229,0.3)]"
              : "bg-[#1c2021] text-[#899295] hover:text-[#e0e3e4] border border-white/5"
          }`}
        >
          {t("profile.lang_id")}
        </button>
        <button
          onClick={() => setLang("en")}
          className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            lang === "en"
              ? "bg-[#86d2e5] text-[#101415] shadow-[0_0_20px_rgba(134,210,229,0.3)]"
              : "bg-[#1c2021] text-[#899295] hover:text-[#e0e3e4] border border-white/5"
          }`}
        >
          {t("profile.lang_en")}
        </button>
      </div>
    </div>
  );
}

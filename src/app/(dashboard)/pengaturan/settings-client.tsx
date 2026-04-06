"use client";

import { 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Smartphone, 
  KeyRound, 
  Fingerprint,
  Mail,
  Moon,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { updatePreferences } from "@/actions/profile";
import { requestPasswordReset } from "@/actions/auth";
import { toast } from "sonner";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function SettingsClient({ profile, user }: any) {
  const { t, lang, setLang } = useLanguage();
  const prefs = user?.user_metadata?.preferences || {};

  const [pushNotif, setPushNotif] = useState(prefs.pushNotif ?? true);
  const [emailNotif, setEmailNotif] = useState(prefs.emailNotif ?? false);
  const [biometric, setBiometric] = useState(prefs.biometric ?? true);
  const [darkMode, setDarkMode] = useState(prefs.darkMode ?? true); 
  const [resettingPwd, setResettingPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // Password Rate Limit Logic
  const lastPwdReset = prefs.lastPwdReset ? new Date(prefs.lastPwdReset) : null;
  const daysSinceReset = lastPwdReset ? Math.floor((new Date().getTime() - lastPwdReset.getTime()) / (1000 * 3600 * 24)) : null;
  const canResetPwd = lastPwdReset === null || (daysSinceReset !== null && daysSinceReset >= 7);
  const daysLeftToReset = daysSinceReset !== null ? 7 - daysSinceReset : 0;
  
  const handleTogglePref = async (key: string, currentValue: boolean, setter: (val: boolean) => void) => {
    const newValue = !currentValue;
    let finalValue = newValue;

    try {
      if (key === 'biometric' && newValue) {
        try {
          const array = new Uint8Array(16);
          window.crypto.getRandomValues(array);
          await navigator.credentials.create({
            publicKey: {
              challenge: array,
              rp: { name: "Zenith Finance", id: window.location.hostname },
              user: { id: array, name: user?.email || "user", displayName: profile?.full_name || "User" },
              pubKeyCredParams: [{ alg: -7, type: "public-key" }],
              authenticatorSelection: { userVerification: "required" },
              timeout: 60000
            }
          });
          toast.success(t("settings.toast_biometric_success"));
        } catch(e: any) {
          if(e.name === 'NotAllowedError') {
             toast.error(t("settings.toast_biometric_cancelled"));
          } else {
             toast.error(t("settings.toast_biometric_unavailable"));
          }
          finalValue = currentValue;
        }
      } 
      else if (key === 'pushNotif' && newValue) {
        if (!("Notification" in window)) {
          toast.error(t("settings.toast_push_unsupported"));
          finalValue = currentValue;
        } else {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            new Notification(lang === 'id' ? "Zenith Keuangan Mapan" : "Zenith Finance Ready", {
              body: t("settings.toast_notif_body"),
            });
            toast.success(t("settings.toast_push_enabled"));
          } else {
            toast.error(t("settings.toast_notif_denied"));
            finalValue = currentValue;
          }
        }
      }
      else if (key === 'emailNotif' && newValue) {
        toast.success(t("settings.toast_email_success"));
      }
    } catch(err) {
      console.error(err);
    }
    
    setter(finalValue);
    await updatePreferences(key, finalValue);
  };

  const handleLanguageToggle = async () => {
    const newLang = lang === 'en' ? 'id' : 'en';
    await setLang(newLang);
    toast.success(t("settings.toast_lang_updated"));
  };

  const handleResetPassword = async () => {
    if(!canResetPwd) {
      toast.error(t("settings.toast_pwd_limit").replace("{days}", String(daysLeftToReset)));
      return;
    }
    
    if(!user?.email) return;
    setResettingPwd(true);
    const result = await requestPasswordReset(user?.email);
    if (result.error) toast.error(result.error);
    else {
      toast.success(result.success);
      await updatePreferences("lastPwdReset", new Date().toISOString());
    }
    setResettingPwd(false);
    setShowConfirmPwd(false);
  };

  return (
    <div className="space-y-12 pb-12 px-2 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2 relative">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-headline tracking-tighter text-[#e0e3e4]">{t("settings.title")}</h2>
        <p className="text-[#899295] text-sm md:text-base font-medium">{t("settings.desc")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Personalisasi Section */}
        <section className="md:col-span-12 lg:col-span-12 space-y-6">
          <div className="flex items-center gap-4 border-b border-[#899295]/10 pb-6 mb-2">
             <div className="w-12 h-12 bg-[#86d2e5]/10 rounded-[1rem] flex items-center justify-center text-[#86d2e5]">
               <Palette size={24} />
             </div>
             <div>
               <h3 className="text-2xl font-black font-headline text-[#e0e3e4]">{t("settings.visual_title")}</h3>
               <p className="text-[10px] text-[#86d2e5] uppercase tracking-[0.2em] font-black mt-1">{t("settings.visual_subtitle")}</p>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             <div className="bg-[#181c1d] rounded-[2.5rem] p-8 border border-[#899295]/5 flex items-center justify-between premium-glow" style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}>
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#323537] flex items-center justify-center text-[#e0e3e4]">
                     <Moon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#e0e3e4]">{t("settings.dark_mode")}</h4>
                    <p className="text-[10px] text-[#899295] uppercase tracking-widest mt-1">{t("settings.dark_mode_desc")}</p>
                  </div>
               </div>
               <button 
                  onClick={() => handleTogglePref("darkMode", darkMode, setDarkMode)}
                  className={`w-14 h-8 rounded-full transition-colors flex items-center border-2 border-transparent ${darkMode ? 'bg-[#86d2e5]' : 'bg-[#323537]'}`}
               >
                  <div className={`w-6 h-6 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-1'}`}></div>
               </button>
             </div>

             <div className="bg-[#181c1d] rounded-[2.5rem] p-8 border border-[#899295]/5 flex items-center justify-between premium-glow" style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}>
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#323537] flex items-center justify-center text-[#e0e3e4]">
                     <Globe size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#e0e3e4]">{t("settings.lang_region")}</h4>
                    <p className="text-[10px] text-[#899295] uppercase tracking-widest mt-1">{lang === 'en' ? 'English (USD)' : 'Indonesia (IDR)'}</p>
                  </div>
               </div>
               <button 
                  onClick={handleLanguageToggle}
                  className="text-[#86d2e5] font-black text-[10px] uppercase tracking-widest py-3 px-5 rounded-xl bg-[#86d2e5]/10 hover:bg-[#86d2e5]/20 transition-all">
                  {t("settings.change")}
               </button>
             </div>
          </div>
        </section>

        {/* Keamanan Section */}
        <section className="md:col-span-12 lg:col-span-12 space-y-6 mt-8">
          <div className="flex items-center gap-4 border-b border-[#899295]/10 pb-6 mb-2">
             <div className="w-12 h-12 bg-[#78dc77]/10 rounded-[1rem] flex items-center justify-center text-[#78dc77]">
               <Shield size={24} />
             </div>
             <div>
               <h3 className="text-2xl font-black font-headline text-[#e0e3e4]">{t("settings.security_title")}</h3>
               <p className="text-[10px] text-[#78dc77] uppercase tracking-[0.2em] font-black mt-1">{t("settings.security_subtitle")}</p>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             <div className="bg-[#181c1d] rounded-[2.5rem] p-8 border border-[#899295]/5 flex flex-col justify-between premium-glow" style={{ '--card-glow-rgb': '120, 220, 119' } as React.CSSProperties}>
               <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#323537] flex items-center justify-center text-[#e0e3e4]">
                     <KeyRound size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#e0e3e4]">{t("settings.password")}</h4>
                    <p className="text-[10px] text-[#899295] uppercase tracking-widest mt-1">
                      {lastPwdReset ? `${t("settings.last_changed")} ${daysSinceReset} ${t("settings.days_ago")}` : t("settings.never_changed")}
                    </p>
                  </div>
               </div>
               {!showConfirmPwd ? (
                 <button 
                    onClick={() => {
                       if(!canResetPwd) toast.error(t("settings.toast_pwd_limit").replace("{days}", String(daysLeftToReset)));
                       else setShowConfirmPwd(true);
                    }}
                    className="w-full relative flex items-center justify-center gap-2 bg-[#323537]/50 hover:bg-[#78dc77]/10 text-[#899295] hover:text-[#78dc77] py-5 rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all">
                    {t("settings.update_password")}
                 </button>
               ) : (
                 <div className="flex gap-2 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <button 
                       onClick={() => setShowConfirmPwd(false)}
                       className="flex-1 bg-transparent border border-[#899295]/20 hover:bg-[#323537] text-[#899295] py-4 rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all disabled:opacity-50">
                       {t("settings.cancel")}
                    </button>
                    <button 
                       onClick={handleResetPassword}
                       disabled={resettingPwd}
                       className="flex-1 relative flex items-center justify-center gap-2 bg-[#78dc77]/20 hover:bg-[#78dc77] text-[#78dc77] hover:text-[#101415] py-4 rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all disabled:opacity-50">
                       {resettingPwd ? <Loader2 size={16} className="animate-spin" /> : t("settings.confirm_send")}
                    </button>
                 </div>
               )}
             </div>

             <div className="bg-[#181c1d] rounded-[2.5rem] p-8 border border-[#899295]/5 flex flex-col justify-between premium-glow" style={{ '--card-glow-rgb': '120, 220, 119' } as React.CSSProperties}>
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#323537] flex items-center justify-center text-[#e0e3e4]">
                       <Fingerprint size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-[#e0e3e4]">{t("settings.biometric")}</h4>
                      <p className="text-[10px] text-[#899295] uppercase tracking-widest mt-1">{t("settings.biometric_desc")}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleTogglePref("biometric", biometric, setBiometric)}
                    className={`w-14 h-8 rounded-full transition-colors flex items-center border-2 border-transparent shrink-0 ${biometric ? 'bg-[#78dc77]' : 'bg-[#323537]'}`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-white transition-transform ${biometric ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </button>
               </div>
               <div className="bg-[#78dc77]/5 border border-[#78dc77]/20 p-5 rounded-2xl mt-auto">
                 <p className="text-[10px] font-bold text-[#78dc77] leading-relaxed uppercase tracking-wider">
                   {t("settings.biometric_active")}
                 </p>
               </div>
             </div>
          </div>
        </section>

        {/* Notifikasi Section */}
        <section className="md:col-span-12 lg:col-span-12 space-y-6 mt-8">
          <div className="flex items-center gap-4 border-b border-[#899295]/10 pb-6 mb-2">
             <div className="w-12 h-12 bg-[#ffb870]/10 rounded-[1rem] flex items-center justify-center text-[#ffb870]">
               <Bell size={24} />
             </div>
             <div>
               <h3 className="text-2xl font-black font-headline text-[#e0e3e4]">{t("settings.notifications")}</h3>
               <p className="text-[10px] text-[#ffb870] uppercase tracking-[0.2em] font-black mt-1">{t("settings.notifications_subtitle")}</p>
             </div>
          </div>

          <div className="bg-[#181c1d] rounded-[2.5rem] border border-[#899295]/5 overflow-hidden premium-glow" style={{ '--card-glow-rgb': '255, 184, 112' } as React.CSSProperties}>
             <div className="p-8 border-b border-[#899295]/5 flex items-center justify-between hover:bg-[#1c2021] transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#323537] flex items-center justify-center text-[#ffb870] group-hover:scale-110 transition-transform">
                     <Smartphone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#e0e3e4]">{t("settings.push_notifications")}</h4>
                    <p className="text-[10px] text-[#899295] uppercase tracking-widest mt-1">{t("settings.push_desc")}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleTogglePref("pushNotif", pushNotif, setPushNotif)}
                  className={`w-14 h-8 rounded-full transition-colors flex items-center border-2 border-transparent ${pushNotif ? 'bg-[#ffb870]' : 'bg-[#323537]'}`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white transition-transform ${pushNotif ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
             </div>

             <div className="p-8 flex items-center justify-between hover:bg-[#1c2021] transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#323537] flex items-center justify-center text-[#ffb870] group-hover:scale-110 transition-transform">
                     <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#e0e3e4]">{t("settings.email_reports")}</h4>
                    <p className="text-[10px] text-[#899295] uppercase tracking-widest mt-1">{t("settings.email_desc")}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleTogglePref("emailNotif", emailNotif, setEmailNotif)}
                  className={`w-14 h-8 rounded-full transition-colors flex items-center border-2 border-transparent ${emailNotif ? 'bg-[#ffb870]' : 'bg-[#323537]'}`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white transition-transform ${emailNotif ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
             </div>
          </div>
        </section>

      </div>
    </div>
  );
}

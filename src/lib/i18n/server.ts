import { createClient } from "@/lib/supabase/server";
import id from "@/locales/id.json";
import en from "@/locales/en.json";

type Language = "id" | "en";
const translations: Record<Language, any> = { id, en };

/**
 * Server-side translation helper
 * Usage: const { t, lang } = await getServerTranslation();
 */
export async function getServerTranslation() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Explicitly validate lang or fallback to "id"
    const langPref = user?.user_metadata?.preferences?.lang;
    const lang: Language = (langPref === "id" || langPref === "en") ? langPref : "id";

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

    return { t, lang };
  } catch (error) {
    console.error("getServerTranslation Error:", error);
    return {
      t: (path: string) => path,
      lang: "id" as Language
    };
  }
}

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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const lang: Language = user?.user_metadata?.preferences?.lang || "id";

  const t = (path: string): string => {
    const keys = path.split(".");
    let result = translations[lang];

    for (const key of keys) {
      if (result[key] === undefined) return path;
      result = result[key];
    }

    return result as string;
  };

  return { t, lang };
}

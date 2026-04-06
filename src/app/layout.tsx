import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Zenith Finance - The Digital Curator",
  description: "Aplikasi Pengatur Keuangan Pribadi yang Terkurasi kelas premium.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Zenith Finance",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#181c1d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { Toaster } from "sonner";
import { ModalProvider } from "@/components/providers/ModalProvider";
import { SettingsEnforcer } from "@/components/providers/SettingsEnforcer";
import { OfflineSyncManager } from "@/components/providers/OfflineSyncManager";
import { LanguageProvider } from "@/components/providers/LanguageProvider"; // [NEW]
import { createClient } from "@/lib/supabase/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch initial preferences from server to avoid flicker
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userPreferences = user?.user_metadata?.preferences || {};
  const initialLang = userPreferences.lang || "id"; // Default to Indonesian

  return (
    <html
      lang={initialLang}
      className={cn("dark", plusJakartaSans.variable, inter.variable, "font-sans", geist.variable)}
    >
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased bg-[#101415] text-[#e0e3e4]">
        <SettingsEnforcer userPreferences={userPreferences} />
        <OfflineSyncManager />
        <LanguageProvider initialLang={initialLang}>
          <ModalProvider>
            {children}
            <Toaster richColors position="top-center" />
          </ModalProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}


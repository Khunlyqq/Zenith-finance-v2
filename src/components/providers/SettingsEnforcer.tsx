"use client";

import { useEffect } from "react";

export function SettingsEnforcer({ userPreferences }: { userPreferences: any }) {
  useEffect(() => {
    if (!userPreferences) return;

    // Apply Dark Mode / Light Mode magic toggle
    // darkMode is true by default, so if it's explicitly FALSE, we add zenith-light.
    if (userPreferences.darkMode === false) {
      document.documentElement.classList.add("zenith-light");
    } else {
      document.documentElement.classList.remove("zenith-light");
    }
  }, [userPreferences]);

  return null; // This component strictly enforces side-effects natively.
}

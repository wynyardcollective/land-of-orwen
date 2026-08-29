"use client";

import { useEffect } from "react";

/** Initializes native AdMob banner when running inside the Capacitor Android app. */
export function MobileAdMob() {
  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const { initMobileAdMob } = await import("@/lib/mobile/admob");
        if (!cancelled) {
          await initMobileAdMob();
        }
      } catch (error) {
        console.warn("AdMob init skipped:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

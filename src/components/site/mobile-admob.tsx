"use client";

import { useEffect } from "react";

/** Initializes AdMob SDK (rewarded + interstitial) in the Capacitor Android app. */
export function MobileAdMob() {
  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const { initMobileAdSdk } = await import("@/lib/mobile/admob");
        if (!cancelled) {
          await initMobileAdSdk();
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

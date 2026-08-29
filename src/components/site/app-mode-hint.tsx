"use client";

import { useEffect } from "react";

/** Persist standalone / Android app detection for client-only checks. */
export function AppModeHint() {
  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone;
    if (standalone) {
      document.documentElement.dataset.orwenApp = "1";
    }
  }, []);

  return null;
}

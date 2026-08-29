/**
 * AdMob unit IDs for the Android app (native ads — not WebView AdSense).
 * App ID lives in mobile/android/.../strings.xml (`admob_app_id`).
 */
export const ADMOB_APP_ID = "ca-app-pub-9932949328522902~2169058797";

const DEFAULT_REWARDED_ID =
  process.env.NEXT_PUBLIC_ADMOB_ANDROID_REWARDED_ID ??
  "ca-app-pub-9932949328522902/8542895456";

const DEFAULT_INTERSTITIAL_ID =
  process.env.NEXT_PUBLIC_ADMOB_ANDROID_INTERSTITIAL_ID ??
  "ca-app-pub-9932949328522902/8920450776";

/** Google sample units — safe for emulators (BlueStacks, Android Studio AVD). */
export const ADMOB_TEST_UNITS = {
  rewarded: "ca-app-pub-3940256099942544/5224354917",
  interstitial: "ca-app-pub-3940256099942544/1033173712",
} as const;

export const ADMOB = {
  androidRewardedId: DEFAULT_REWARDED_ID,
  androidInterstitialId: DEFAULT_INTERSTITIAL_ID,
  /** Set NEXT_PUBLIC_ADMOB_USE_TEST_ADS=true to force Google test creatives */
  isTestMode: process.env.NEXT_PUBLIC_ADMOB_USE_TEST_ADS === "true",
} as const;

export function resolveAndroidAdIds(useTestAds: boolean) {
  if (!useTestAds) {
    return {
      rewarded: ADMOB.androidRewardedId,
      interstitial: ADMOB.androidInterstitialId,
    };
  }
  return {
    rewarded: ADMOB_TEST_UNITS.rewarded,
    interstitial: ADMOB_TEST_UNITS.interstitial,
  };
}

/** Emulators (incl. BlueStacks) rarely fill production AdMob units. */
export function shouldUseTestAdsOnClient(): boolean {
  if (ADMOB.isTestMode) return true;
  if (typeof window === "undefined") return false;

  const params = new URLSearchParams(window.location.search);
  if (params.get("admob_test") === "1") return true;

  const ua = navigator.userAgent;
  return /BlueStacks|emulator|sdk_gphone|google_sdk|Genymotion|Android SDK built for x86/i.test(
    ua,
  );
}

/** Minimum gap between interstitial ads (natural pauses only) */
export const AD_INTERSTITIAL_COOLDOWN_MS = 3 * 60 * 1000;

/**
 * AdMob unit IDs for the Android app (native ads — not WebView AdSense).
 * Replace with production IDs from https://admob.google.com before Play release.
 */
export const ADMOB = {
  androidRewardedId:
    process.env.NEXT_PUBLIC_ADMOB_ANDROID_REWARDED_ID ??
    "ca-app-pub-3940256099942544/5224354917",
  androidInterstitialId:
    process.env.NEXT_PUBLIC_ADMOB_ANDROID_INTERSTITIAL_ID ??
    "ca-app-pub-3940256099942544/1033173712",
  /** True when using Google sample ad unit IDs */
  isTestMode:
    !process.env.NEXT_PUBLIC_ADMOB_ANDROID_REWARDED_ID ||
    !process.env.NEXT_PUBLIC_ADMOB_ANDROID_INTERSTITIAL_ID ||
    process.env.NEXT_PUBLIC_ADMOB_USE_TEST_ADS === "true",
} as const;

/** Minimum gap between interstitial ads (natural pauses only) */
export const AD_INTERSTITIAL_COOLDOWN_MS = 3 * 60 * 1000;

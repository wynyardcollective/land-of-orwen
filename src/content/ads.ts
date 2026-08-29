/**
 * AdMob unit IDs for the Android app (native ads — not WebView AdSense).
 * Replace with your production IDs from https://admob.google.com before Play release.
 * Google test IDs are safe for debug builds.
 */
export const ADMOB = {
  /** Android banner — set NEXT_PUBLIC_ADMOB_ANDROID_BANNER_ID in production */
  androidBannerId:
    process.env.NEXT_PUBLIC_ADMOB_ANDROID_BANNER_ID ??
    "ca-app-pub-3940256099942544/6300978111",
  /** True when using Google’s sample ad unit IDs */
  isTestMode:
    !process.env.NEXT_PUBLIC_ADMOB_ANDROID_BANNER_ID ||
    process.env.NEXT_PUBLIC_ADMOB_USE_TEST_ADS === "true",
} as const;

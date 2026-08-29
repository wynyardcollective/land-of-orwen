/**
 * AdMob unit IDs for the Android app (native ads — not WebView AdSense).
 * App ID lives in mobile/android/.../strings.xml (`admob_app_id`).
 */
const GOOGLE_TEST_PUBLISHER = "ca-app-pub-3940256099942544";

export const ADMOB_APP_ID = "ca-app-pub-9932949328522902~2169058797";

const DEFAULT_REWARDED_ID =
  process.env.NEXT_PUBLIC_ADMOB_ANDROID_REWARDED_ID ??
  "ca-app-pub-3940256099942544/5224354917";

const DEFAULT_INTERSTITIAL_ID =
  process.env.NEXT_PUBLIC_ADMOB_ANDROID_INTERSTITIAL_ID ??
  "ca-app-pub-9932949328522902/8920450776";

export const ADMOB = {
  androidRewardedId: DEFAULT_REWARDED_ID,
  androidInterstitialId: DEFAULT_INTERSTITIAL_ID,
  /** Test ads for rewarded until a production rewarded unit is configured */
  isTestMode:
    process.env.NEXT_PUBLIC_ADMOB_USE_TEST_ADS === "true" ||
    (
      !process.env.NEXT_PUBLIC_ADMOB_ANDROID_REWARDED_ID &&
      DEFAULT_REWARDED_ID.includes(GOOGLE_TEST_PUBLISHER)
    ),
} as const;

/** Minimum gap between interstitial ads (natural pauses only) */
export const AD_INTERSTITIAL_COOLDOWN_MS = 3 * 60 * 1000;

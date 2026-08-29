import { ADMOB, AD_INTERSTITIAL_COOLDOWN_MS } from "@/content/ads";

let sdkReady = false;
let interstitialLoaded = false;
let interstitialShowing = false;
let lastInterstitialAt = 0;

async function getAdMob() {
  const { Capacitor } = await import("@capacitor/core");
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "android") {
    return null;
  }

  const admob = await import("@capacitor-community/admob");
  return { Capacitor, ...admob };
}

/** Consent + SDK init (no banner). */
export async function initMobileAdSdk(): Promise<boolean> {
  const ctx = await getAdMob();
  if (!ctx) return false;

  const { AdMob, AdmobConsentStatus } = ctx;

  await AdMob.initialize({
    initializeForTesting: ADMOB.isTestMode,
  });

  let consent = await AdMob.requestConsentInfo();
  if (
    consent.isConsentFormAvailable &&
    consent.status === AdmobConsentStatus.REQUIRED
  ) {
    consent = await AdMob.showConsentForm();
  }

  if (!consent.canRequestAds) {
    return false;
  }

  sdkReady = true;
  await preloadInterstitial();
  return true;
}

export async function preloadInterstitial(): Promise<void> {
  if (!sdkReady || interstitialShowing) return;
  const ctx = await getAdMob();
  if (!ctx) return;

  try {
    await ctx.AdMob.prepareInterstitial({
      adId: ADMOB.androidInterstitialId,
    });
    interstitialLoaded = true;
  } catch {
    interstitialLoaded = false;
  }
}

/** Show at natural pauses (quest/travel/skill complete) with cooldown. */
export async function maybeShowInterstitial(): Promise<void> {
  if (!sdkReady || interstitialShowing) return;

  const now = Date.now();
  if (now - lastInterstitialAt < AD_INTERSTITIAL_COOLDOWN_MS) return;

  const ctx = await getAdMob();
  if (!ctx) return;

  if (!interstitialLoaded) {
    await preloadInterstitial();
    if (!interstitialLoaded) return;
  }

  interstitialShowing = true;
  try {
    await ctx.AdMob.showInterstitial();
    lastInterstitialAt = Date.now();
  } catch {
    /* skip if no fill */
  } finally {
    interstitialLoaded = false;
    interstitialShowing = false;
    void preloadInterstitial();
  }
}

/** Watch rewarded video; returns true only if the user earned the reward. */
export async function showRewardedSpeedBoostAd(): Promise<boolean> {
  if (!sdkReady) return false;

  const ctx = await getAdMob();
  if (!ctx) return false;

  const { AdMob, RewardAdPluginEvents } = ctx;
  let rewarded = false;

  const handle = await AdMob.addListener(
    RewardAdPluginEvents.Rewarded,
    () => {
      rewarded = true;
    },
  );

  try {
    await AdMob.prepareRewardVideoAd({
      adId: ADMOB.androidRewardedId,
    });
    await AdMob.showRewardVideoAd();
  } catch {
    rewarded = false;
  } finally {
    await handle.remove();
  }

  return rewarded;
}

export function isMobileAdSdkReady(): boolean {
  return sdkReady;
}

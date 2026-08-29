import {
  AD_INTERSTITIAL_COOLDOWN_MS,
  resolveAndroidAdIds,
  shouldUseTestAdsOnClient,
} from "@/content/ads";

let sdkReady = false;
let sdkInitPromise: Promise<boolean> | null = null;
let useTestAds = false;
let interstitialLoaded = false;
let interstitialShowing = false;
let lastInterstitialAt = 0;

export type RewardedAdResult =
  | { ok: true }
  | { ok: false; reason: string };

async function getAdMob() {
  const { Capacitor } = await import("@capacitor/core");
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "android") {
    return null;
  }

  const admob = await import("@capacitor-community/admob");
  return { Capacitor, ...admob };
}

function adUnitIds() {
  return resolveAndroidAdIds(useTestAds);
}

/** Consent + SDK init (no banner). */
export async function initMobileAdSdk(): Promise<boolean> {
  if (sdkReady) return true;
  if (sdkInitPromise) return sdkInitPromise;

  sdkInitPromise = (async () => {
    const ctx = await getAdMob();
    if (!ctx) return false;

    useTestAds = shouldUseTestAdsOnClient();
    const { AdMob, AdmobConsentStatus } = ctx;

    try {
      await AdMob.initialize({
        initializeForTesting: useTestAds,
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
    } catch {
      return false;
    } finally {
      sdkInitPromise = null;
    }
  })();

  return sdkInitPromise;
}

export async function preloadInterstitial(): Promise<void> {
  if (!sdkReady || interstitialShowing) return;
  const ctx = await getAdMob();
  if (!ctx) return;

  try {
    await ctx.AdMob.prepareInterstitial({
      adId: adUnitIds().interstitial,
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

/** Watch rewarded video; returns outcome for UI messaging. */
export async function showRewardedSpeedBoostAd(): Promise<RewardedAdResult> {
  if (!sdkReady) {
    const ready = await initMobileAdSdk();
    if (!ready) {
      return {
        ok: false,
        reason:
          "Ads are not ready yet. Check internet connection and privacy consent, then try again.",
      };
    }
  }

  const ctx = await getAdMob();
  if (!ctx) {
    return { ok: false, reason: "Rewarded ads are only available in the Android app." };
  }

  const { AdMob, RewardAdPluginEvents } = ctx;
  let rewarded = false;
  let loadError: string | null = null;
  let showError: string | null = null;

  const rewardedHandle = await AdMob.addListener(
    RewardAdPluginEvents.Rewarded,
    () => {
      rewarded = true;
    },
  );
  const failedLoadHandle = await AdMob.addListener(
    RewardAdPluginEvents.FailedToLoad,
    (error) => {
      loadError = error?.message ?? "Failed to load ad";
    },
  );
  const failedShowHandle = await AdMob.addListener(
    RewardAdPluginEvents.FailedToShow,
    (error) => {
      showError = error?.message ?? "Failed to show ad";
    },
  );

  try {
    await AdMob.prepareRewardVideoAd({
      adId: adUnitIds().rewarded,
    });
    if (loadError) {
      return {
        ok: false,
        reason: emulatorHint(loadError),
      };
    }

    await AdMob.showRewardVideoAd();
    if (showError) {
      return { ok: false, reason: emulatorHint(showError) };
    }
    if (!rewarded) {
      return { ok: false, reason: "Ad closed before the reward — no speed boost." };
    }
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not load rewarded ad";
    return { ok: false, reason: emulatorHint(message) };
  } finally {
    await rewardedHandle.remove();
    await failedLoadHandle.remove();
    await failedShowHandle.remove();
  }
}

function emulatorHint(message: string): string {
  if (useTestAds) {
    return `${message} (test ads enabled for emulator)`;
  }
  return `${message}. Production ads often do not fill on emulators — try a real phone.`;
}

export function isMobileAdSdkReady(): boolean {
  return sdkReady;
}

export function isUsingTestAds(): boolean {
  return useTestAds;
}

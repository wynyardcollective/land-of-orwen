import { ADMOB } from "@/content/ads";

export async function initMobileAdMob(): Promise<void> {
  const { Capacitor } = await import("@capacitor/core");
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "android") {
    return;
  }

  const {
    AdMob,
    AdmobConsentStatus,
    BannerAdPluginEvents,
    BannerAdPosition,
    BannerAdSize,
  } = await import("@capacitor-community/admob");

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
    return;
  }

  await AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size) => {
    document.documentElement.style.setProperty(
      "--admob-banner-height",
      `${size.height}px`,
    );
  });

  await AdMob.showBanner({
    adId: ADMOB.androidBannerId,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
  });
}

# AdMob (Android app)

Production values — set before Play Store release.

```bash
# Banner ad unit ID (from AdMob → Ad units)
NEXT_PUBLIC_ADMOB_ANDROID_BANNER_ID=ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY

# Optional: force test ads even with a custom unit ID
# NEXT_PUBLIC_ADMOB_USE_TEST_ADS=true
```

Also update `mobile/android/app/src/main/res/values/strings.xml`:

- `admob_app_id` → your AdMob **App ID** (`ca-app-pub-XXXX~YYYY`), not the banner unit ID.

Website AdSense is separate and unchanged.

# AdMob (Android app)

Native **rewarded** and **interstitial** ads — no banner. Website AdSense is unchanged.

## Ad formats

| Format | Purpose |
|--------|---------|
| **Rewarded** | Player opts in → **2× timer speed for 5 minutes** (10 min cooldown before next watch) |
| **Interstitial** | Full-screen at natural pauses (quest/skill/combat reward, travel arrival) — max once per 3 minutes |

## Production IDs (rough)

| Setting | Value |
|---------|--------|
| **App ID** | `ca-app-pub-9932949328522902~2169058797` → `strings.xml` `admob_app_id` |
| **Interstitial** | `ca-app-pub-9932949328522902/8920450776` → default in `src/content/ads.ts` |
| **Rewarded** | Create in AdMob → set `NEXT_PUBLIC_ADMOB_ANDROID_REWARDED_ID` (still test unit until then) |

New ad units can take up to an hour before ads fill.

## Override via env (optional)

```bash
NEXT_PUBLIC_ADMOB_ANDROID_REWARDED_ID=ca-app-pub-XXXX/YYYY
NEXT_PUBLIC_ADMOB_ANDROID_INTERSTITIAL_ID=ca-app-pub-XXXX/ZZZZ
```

`mobile/android/app/src/main/res/values/strings.xml` → `admob_app_id` must match your AdMob **App ID**.

## Play Console

- Declare **contains ads**
- Data safety: Advertising ID + ad partners (Google)
- Privacy policy mentions AdMob rewarded/interstitial

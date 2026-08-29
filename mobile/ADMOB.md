# AdMob (Android app)

Native **rewarded** and **interstitial** ads — no banner. Website AdSense is unchanged.

## Ad formats

| Format | Purpose |
|--------|---------|
| **Rewarded** | Player opts in → **2× timer speed for 5 minutes** (10 min cooldown before next watch) |
| **Interstitial** | Full-screen at natural pauses (quest/skill/combat reward, travel arrival) — max once per 3 minutes |

## Production setup

1. [AdMob](https://admob.google.com/) → app `nz.co.wynyardcollective.rough`
2. Create ad units: **Rewarded** and **Interstitial**
3. Set IDs:

```bash
# Banner unit is not used
NEXT_PUBLIC_ADMOB_ANDROID_REWARDED_ID=ca-app-pub-XXXX/YYYY
NEXT_PUBLIC_ADMOB_ANDROID_INTERSTITIAL_ID=ca-app-pub-XXXX/ZZZZ
```

4. `mobile/android/app/src/main/res/values/strings.xml` → `admob_app_id` (App ID, not unit ID)

Until set, Google **test ad units** are used automatically.

## Play Console

- Declare **contains ads**
- Data safety: Advertising ID + ad partners (Google)
- Privacy policy mentions AdMob rewarded/interstitial

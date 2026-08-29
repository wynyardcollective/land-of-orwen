# Publishing rough to Google Play (with AdMob)

Checklist before submitting `nz.co.wynyardcollective.rough` to the Play Store.

## 1. Google Play Console account

- [Google Play Console](https://play.google.com/console) — one-time **$25** developer registration
- Create app → **Games** → name **rough**, default language, free app

## 2. AdMob setup (required for in-app ads)

1. [AdMob](https://admob.google.com/) → **Apps** → **Add app** → Android → **rough** / package `nz.co.wynyardcollective.rough`
2. Note your **App ID** (`ca-app-pub-XXXX~YYYY`) and create ad units:
   - **Banner** (bottom of play screen) — recommended first format
   - Optional later: interstitial between sessions, rewarded for bonuses
3. Replace **test IDs** in the project:

| File | What to change |
|------|----------------|
| `mobile/android/app/src/main/res/values/strings.xml` | `admob_app_id` → your AdMob **App ID** |
| Production env / build | `NEXT_PUBLIC_ADMOB_ANDROID_BANNER_ID` → your banner ad unit ID |

Until you replace them, the app uses [Google test ad units](https://developers.google.com/admob/android/test-ads) (safe for debug; **do not** ship test IDs in production).

4. Link AdMob to Play Console when prompted (helps reporting and reduces policy friction).

**Important:** Website uses **AdSense**; Android app uses **native AdMob** (not AdSense inside the WebView). That split is correct for Google policies.

## 3. Release signing (not debug APK)

Debug APKs from GitHub releases are for testing only. Play requires a **signed AAB**:

```bash
keytool -genkey -v -keystore rough-release.keystore \
  -alias rough -keyalg RSA -keysize 2048 -validity 10000
```

In Android Studio: **Build → Generate Signed Bundle / APK** → **Android App Bundle** → upload keystore.

Or configure `signingConfigs` in `mobile/android/app/build.gradle` (never commit the keystore).

```bash
cd mobile && npm run android:bundle
# mobile/android/app/build/outputs/bundle/release/app-release.aab
```

## 4. Asset links (optional but recommended)

After you have the **release** keystore SHA-256:

```bash
keytool -list -v -keystore rough-release.keystore -alias rough
```

Update `public/.well-known/assetlinks.json`, deploy site (`npm run deploy:prod`).

## 5. Store listing

Copy in `mobile/store-listing/`:

- `short_description.txt` (≤ 80 chars)
- `full_description.txt`
- **Privacy policy URL:** https://rough.co.nz/privacy (required)
- **App icon:** 512×512 PNG
- **Feature graphic:** 1024×500 PNG
- **Phone screenshots:** at least 2 (game map, play UI)

## 6. Policy forms in Play Console

| Form | Notes |
|------|--------|
| **App content → Privacy policy** | https://rough.co.nz/privacy |
| **Data safety** | Use draft in `mobile/store-listing/data_safety.md` — declare account email, game saves, **Advertising ID** (AdMob), ad partners |
| **Content rating** | IARC questionnaire (idle RPG, mild fantasy combat → typically low rating) |
| **Target audience** | Not aimed at children under 13 (matches privacy policy) |
| **Ads** | Declare **Yes, contains ads** |
| **News / COVID / Data deletion** | Account deletion via admin@wynyardcollective.co.nz |

### Data safety with AdMob

Declare (typical for AdMob banner):

- **Advertising ID** collected (Google collects on behalf of ads)
- **App interactions** / diagnostics may be collected by Google per [AdMob policies](https://support.google.com/admob/answer/6128543)
- Data shared with **Google** for advertising
- UMP consent form shown where required (EU/UK) — implemented in app

## 7. Versioning

Before each Play upload, bump in `mobile/android/app/build.gradle`:

- `versionCode` — integer, must increase every release
- `versionName` — user-visible string (e.g. `1.0.1`)

## 8. Upload & release

1. Play Console → **Release** → **Production** (or **Internal testing** first)
2. Upload `app-release.aab`
3. Complete release notes
4. Review can take from a few hours to several days

## 9. After approval

- Monitor **AdMob** dashboards and **Play vitals** (crashes, ANRs)
- Keep privacy policy in sync if ad formats change
- For updates: bump `versionCode`, build new AAB, submit

## Quick test flow (before submission)

1. Deploy web (`npm run deploy:prod`) so play UI includes AdMob init code
2. `npm run mobile:sync` && `cd mobile && npm run android:debug`
3. Install APK — you should see a **test banner** at the bottom on `/play`
4. Switch to production ad unit IDs only in the release build you upload to Play

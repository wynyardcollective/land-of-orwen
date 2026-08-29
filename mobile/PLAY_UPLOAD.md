# Upload rough to Google Play Console

Use the **signed AAB** (not the debug APK).

**File:** `mobile/android/app/build/outputs/bundle/release/app-release.aab`  
**Package:** `nz.co.wynyardcollective.rough`  
**Version:** 1.0.0 (versionCode 1)

## 1. Create the app (if not already)

1. [Google Play Console](https://play.google.com/console)
2. **Create app** → name **rough**, default language, **Game**, free

## 2. App content (complete all required sections)

| Section | Value |
|---------|--------|
| Privacy policy | https://rough.co.nz/privacy |
| Data deletion | https://rough.co.nz/delete-account |
| Ads | **Yes, contains ads** (AdMob rewarded + interstitial) |
| App access | Full access (no special login for reviewers) |
| Content rating | Start questionnaire (IARC) — game, mild fantasy combat |
| Target audience | Not primarily children under 13 |
| Data safety | Use `store-listing/data_safety.md` |
| News / Health / Financial | No |

## 3. Store listing

From `mobile/store-listing/`:

- Short description (≤80 chars)
- Full description
- **App icon** 512×512 PNG
- **Feature graphic** 1024×500 PNG
- **Phone screenshots** (min 2) — map + play UI

## 4. Release

1. **Release** → **Testing** → **Internal testing** (recommended first) or **Production**
2. **Create new release**
3. **Upload** `app-release.aab`
4. Release notes (e.g. “Initial release — idle RPG at rough.co.nz”)
5. **Review release** → **Start rollout**

## 5. Play App Signing (first upload)

When prompted:

- Choose **Use Google Play App Signing** (recommended)
- Google re-signs for users; you keep `rough-release.keystore` as **upload key**

## 6. After upload

- Review can take hours to several days
- **Internal testing:** add testers by email under **Testers** tab
- Link AdMob app to Play in AdMob dashboard if not already linked

## Rebuild for updates

```bash
# Bump versionCode + versionName in mobile/android/app/build.gradle
bash scripts/android-release-build.sh
```

Upload new AAB to a new release.

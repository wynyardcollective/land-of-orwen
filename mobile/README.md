# rough — Android app (Google Play)

Native Android shell for the live game at [rough.co.nz](https://rough.co.nz/play). The app loads the same web game in a secure WebView; accounts, saves, and gameplay run on our servers.

## Play Store compliance notes

This build is designed to align with common Google Play requirements:

| Requirement | How we address it |
|-------------|-------------------|
| **Privacy policy** | Public URL: https://rough.co.nz/privacy — link in Play Console store listing |
| **Data collection** | Email, password hash, game saves — disclosed in privacy policy and Data safety form |
| **Ads in WebView** | AdSense is **not** loaded when `source=android-app` (see site middleware) |
| **Permissions** | `INTERNET` only — no location, camera, contacts, etc. |
| **Target API** | Capacitor 7 targets current SDK requirements |
| **Deceptive behavior** | Store listing describes an online idle RPG; no fake system UI |
| **Account deletion** | Document in Data safety; users can email admin@wynyardcollective.co.nz |

You are responsible for completing the Play Console questionnaire (content rating, Data safety, target audience).

## Prerequisites

- Node.js 20+
- Android Studio (SDK 34+, build-tools, platform-tools)
- Java 17+

## Setup

```bash
cd mobile
npm install
npx cap add android   # first time only
npx cap sync android
```

Copy launcher icons (after generating web icons from repo root):

```bash
cd ..
npm install sharp --no-save
node scripts/generate-app-icons.mjs
# Android Studio: use Image Asset on public/icons/icon-512.png for mipmap icons
```

## Debug build

```bash
cd mobile
npm run android:debug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

## Release AAB (Play Store)

1. Create a release keystore (keep offline, never commit):

   ```bash
   keytool -genkey -v -keystore rough-release.keystore \
     -alias rough -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Add signing config in `android/app/build.gradle` or Android Studio **Build → Generate Signed Bundle**.

3. Get SHA-256 fingerprint and update `public/.well-known/assetlinks.json` on the website:

   ```bash
   keytool -list -v -keystore rough-release.keystore -alias rough
   ```

4. Deploy website so `https://rough.co.nz/.well-known/assetlinks.json` is live.

5. Build:

   ```bash
   npm run android:bundle
   # AAB: android/app/build/outputs/bundle/release/app-release.aab
   ```

Upload the AAB to [Google Play Console](https://play.google.com/console).

## Store listing & Data safety

- Copy: `store-listing/short_description.txt`, `full_description.txt`
- Data safety draft answers: `store-listing/data_safety.md`
- Asset links (SHA-256): `ASSETLINKS.md`

## Store listing copy (suggested)

- **App name:** rough
- **Short description:** Idle RPG across drought-struck rough — map, quests, craft, taverns.
- **Full description:** Mention online play, account optional, privacy policy URL.
- **Category:** Games
- **Privacy policy URL:** https://rough.co.nz/privacy

## Package ID

`nz.co.wynyardcollective.rough`

# Digital Asset Links (`assetlinks.json`)

File: `public/.well-known/assetlinks.json`

This file lets Google verify that the Android app is authorized to open `rough.co.nz` URLs (Trusted Web Activity / deep linking).

## When to update

Replace the placeholder fingerprints **before** publishing if you use TWA or want verified app links. The Capacitor WebView client works without this, but Play Console domain verification expects it for some integrations.

## Get SHA-256 fingerprints

**Debug** (local testing):

```bash
keytool -list -v -keystore ~/.android/debug.keystore \
  -alias androiddebugkey -storepass android -keypass android
```

**Release** (Play Store signing key):

```bash
keytool -list -v -keystore land-of-orwen-release.keystore -alias landoforwen
```

Copy the `SHA256:` line, remove colons, and use uppercase hex (e.g. `AB12CD...`).

## Deploy

```bash
npm run deploy:prod
```

Verify: https://rough.co.nz/.well-known/assetlinks.json

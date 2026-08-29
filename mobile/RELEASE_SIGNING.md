# Release signing (Google Play)

## First-time setup (done in repo tooling)

```bash
bash scripts/generate-android-keystore.sh   # once — creates gitignored files
bash scripts/android-release-build.sh       # signed AAB
```

Generated files (**never commit**):

| File | Purpose |
|------|---------|
| `mobile/android/rough-release.keystore` | Upload/signing key — back up offline |
| `mobile/android/keystore.properties` | Passwords for Gradle |
| `mobile/android/keystore-credentials.txt` | Human-readable backup note + SHA-256 |

Template: `mobile/android/keystore.properties.example`

## Build release AAB

```bash
bash scripts/android-release-build.sh
```

Output:

`mobile/android/app/build/outputs/bundle/release/app-release.aab`

## SHA-256 fingerprint

```bash
bash scripts/android-release-fingerprint.sh
```

Used for `public/.well-known/assetlinks.json` (deploy site after changes).

## Play Console upload

See **`PLAY_UPLOAD.md`** for step-by-step Console instructions.

## Google Play App Signing

On first upload, Google will ask about **Play App Signing**. Recommended:

- **Use Google-managed app signing** (Google holds the app signing key; you keep the upload keystore above for updates)

Keep `rough-release.keystore` and passwords in a password manager. **Losing the upload keystore blocks future updates.**

## Version bumps

Edit `mobile/android/app/build.gradle`:

- `versionCode` — integer, must increase every release
- `versionName` — user-visible string (e.g. `1.0.1`)

Then rebuild AAB.

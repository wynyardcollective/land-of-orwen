# Custom Play Store icon (optional)

To use your exact Play Console icon in the Android launcher (required for policy match):

1. Copy `ROUGH_icon.png` from your Google Drive folder into this directory as:
   ```
   mobile/store-listing/source/ROUGH_icon.png
   ```
2. Regenerate assets:
   ```bash
   npm run icons:generate
   bash scripts/android-release-build.sh
   ```
3. Re-upload the new AAB to Play Console.

If this file is missing, the repo generates a matching **ROUGH** wordmark (dark field + gold circle **O**).

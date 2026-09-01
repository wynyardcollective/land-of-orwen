# Use your exact Play Console icon

Google compares the **hi-res store icon** with the **launcher icon inside the APK**. They must be the same file.

## One-time setup

1. Copy your Play icon from Google Drive:
   ```
   G:\Shared drives\Shared Game Dev Folder\Rough\Google console images\ROUGH_icon.png
   ```
2. Paste it here as:
   ```
   mobile/store-listing/source/ROUGH_icon.png
   ```
   (exact filename: `ROUGH_icon.png`)

3. Regenerate and rebuild:
   ```bash
   npm run icons:generate
   bash scripts/android-release-build.sh
   cd mobile/android && ./gradlew assembleRelease
   ```

4. Install the new APK and confirm the home-screen icon matches Play.

5. Re-upload the new AAB to Play Console.

**Do not** use the auto-generated SVG icon for Play if you have this PNG — always use your original `ROUGH_icon.png`.

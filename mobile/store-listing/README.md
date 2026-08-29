# Play Store graphics

Upload these in **Play Console → Grow → Store presence → Main store listing**.

| Asset | File | Size |
|-------|------|------|
| App icon | `app-icon-512.png` | 512×512 PNG |
| Feature graphic | `feature-graphic-1024x500.png` | 1024×500 PNG |

Regenerate from repo root:

```bash
node scripts/generate-play-store-graphics.mjs
node scripts/generate-android-mipmaps.mjs
```

Design: drought-country palette (stone + amber sun with crack lines, rain-drop accent). Feature graphic uses the site tagline.

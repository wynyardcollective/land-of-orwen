/**
 * Resize launcher icons into Android mipmap folders.
 * Source: public/icons/icon-512.png (full icon)
 * Foreground: mobile/store-listing/launcher-foreground-512.png (adaptive icon)
 *
 * Run: node scripts/generate-android-mipmaps.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "public/icons/icon-512.png");
const fgSrc = join(root, "mobile/store-listing/launcher-foreground-512.png");
const resRoot = join(root, "mobile/android/app/src/main/res");

const sizes = [
  { folder: "mipmap-mdpi", size: 48 },
  { folder: "mipmap-hdpi", size: 72 },
  { folder: "mipmap-xhdpi", size: 96 },
  { folder: "mipmap-xxhdpi", size: 144 },
  { folder: "mipmap-xxxhdpi", size: 192 },
];

const input = readFileSync(src);
const fgInput = existsSync(fgSrc) ? readFileSync(fgSrc) : input;

for (const { folder, size } of sizes) {
  const dir = join(resRoot, folder);
  mkdirSync(dir, { recursive: true });
  const png = await sharp(input).resize(size, size).png().toBuffer();
  const fg = await sharp(fgInput).resize(size, size).png().toBuffer();
  writeFileSync(join(dir, "ic_launcher.png"), png);
  writeFileSync(join(dir, "ic_launcher_round.png"), png);
  writeFileSync(join(dir, "ic_launcher_foreground.png"), fg);
}

console.log("Android mipmap icons updated (launcher matches Play store icon)");

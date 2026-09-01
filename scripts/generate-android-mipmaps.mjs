/**
 * Resize launcher icons into Android mipmap folders.
 * Uses the same full-bleed artwork for legacy + adaptive foreground so the
 * on-device icon matches the Play hi-res icon (no offset/crop drift).
 *
 * Source: public/icons/icon-512.png (from generate-play-store-graphics.mjs)
 *
 * Run: node scripts/generate-android-mipmaps.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "public/icons/icon-512.png");
const resRoot = join(root, "mobile/android/app/src/main/res");
const bgColorFile = join(resRoot, "values/ic_launcher_background.xml");

const sizes = [
  { folder: "mipmap-mdpi", size: 48 },
  { folder: "mipmap-hdpi", size: 72 },
  { folder: "mipmap-xhdpi", size: 96 },
  { folder: "mipmap-xxhdpi", size: 144 },
  { folder: "mipmap-xxxhdpi", size: 192 },
];

const input = readFileSync(src);

/** Sample top-left pixel for adaptive-icon background (matches icon field). */
async function sampleBackgroundHex(buffer) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const i = 0;
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const hex = (n) => n.toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

const bgHex = await sampleBackgroundHex(input);
writeFileSync(
  bgColorFile,
  `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${bgHex}</color>\n</resources>\n`,
);

for (const { folder, size } of sizes) {
  const dir = join(resRoot, folder);
  mkdirSync(dir, { recursive: true });
  const png = await sharp(input).resize(size, size, { fit: "fill" }).png().toBuffer();
  writeFileSync(join(dir, "ic_launcher.png"), png);
  writeFileSync(join(dir, "ic_launcher_round.png"), png);
  // Same full artwork — background color handles adaptive mask edges
  writeFileSync(join(dir, "ic_launcher_foreground.png"), png);
}

console.log(`Android mipmap icons updated (background ${bgHex})`);

/**
 * Resize launcher icons into Android mipmap folders.
 *
 * Play hi-res icon stays full-bleed (public/icons/icon-512.png).
 * Launcher mipmaps inset the artwork ~14% so Android adaptive-icon
 * masks (circle/squircle) do not crop the ROUGH wordmark on the sides.
 *
 * Tune with LAUNCHER_ICON_SCALE (default 0.86).
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

/** Artwork scale inside launcher canvas (1.0 when ROUGH_icon.png already has safe-zone padding). */
const LAUNCHER_SCALE = Number(process.env.LAUNCHER_ICON_SCALE ?? "1");

const sizes = [
  { folder: "mipmap-mdpi", size: 48 },
  { folder: "mipmap-hdpi", size: 72 },
  { folder: "mipmap-xhdpi", size: 96 },
  { folder: "mipmap-xxhdpi", size: 144 },
  { folder: "mipmap-xxxhdpi", size: 192 },
];

const input = readFileSync(src);

async function sampleBackground(buffer) {
  const { data } = await sharp(buffer).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
  return { r: data[0], g: data[1], b: data[2] };
}

async function sampleBackgroundHex(buffer) {
  const { r, g, b } = await sampleBackground(buffer);
  const hex = (n) => n.toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

async function makeLauncherPng(sourceBuffer, size) {
  const bg = await sampleBackground(sourceBuffer);
  const inner = Math.max(1, Math.round(size * LAUNCHER_SCALE));
  const pad = Math.round((size - inner) / 2);
  const scaled = await sharp(sourceBuffer)
    .resize(inner, inner, { fit: "contain" })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: bg,
    },
  })
    .composite([{ input: scaled, left: pad, top: pad }])
    .png()
    .toBuffer();
}

const bgHex = await sampleBackgroundHex(input);
writeFileSync(
  bgColorFile,
  `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${bgHex}</color>\n</resources>\n`,
);

for (const { folder, size } of sizes) {
  const dir = join(resRoot, folder);
  mkdirSync(dir, { recursive: true });
  const png = await makeLauncherPng(input, size);
  writeFileSync(join(dir, "ic_launcher.png"), png);
  writeFileSync(join(dir, "ic_launcher_round.png"), png);
  writeFileSync(join(dir, "ic_launcher_foreground.png"), png);
}

console.log(
  `Android mipmap icons updated (background ${bgHex}, scale ${LAUNCHER_SCALE})`,
);

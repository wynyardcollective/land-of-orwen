/**
 * Generates PWA / Play Store icon PNGs (amber sun on stone field).
 * Run: node scripts/generate-app-icons.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/icons");
mkdirSync(outDir, { recursive: true });

function iconSvg(size, maskable = false) {
  const pad = maskable ? size * 0.18 : size * 0.12;
  const inner = size - pad * 2;
  const cx = size / 2;
  const cy = size / 2;
  const r = inner * 0.32;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" fill="#0c0a09"/>
      <rect x="${pad}" y="${pad}" width="${inner}" height="${inner}" rx="${inner * 0.08}" fill="#1c1917"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#d6b15a"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.72}" fill="#f59e0b" opacity="0.85"/>
    </svg>`,
  );
}

const sizes = [
  { name: "icon-192.png", size: 192, maskable: false },
  { name: "icon-512.png", size: 512, maskable: false },
  { name: "icon-512-maskable.png", size: 512, maskable: true },
];

for (const { name, size, maskable } of sizes) {
  const png = await sharp(iconSvg(size, maskable)).png().toBuffer();
  writeFileSync(join(outDir, name), png);
}

console.log(`Wrote ${sizes.length} icons to public/icons/`);

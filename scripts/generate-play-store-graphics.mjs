/**
 * Play Store listing assets + launcher icons (must match Play hi-res icon).
 *
 * Optional: copy your Play icon to mobile/store-listing/source/ROUGH_icon.png
 * and it will be used instead of the generated SVG.
 *
 * Run: node scripts/generate-play-store-graphics.mjs
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "mobile/store-listing");
const sourceDir = join(outDir, "source");
const customIconPath = join(sourceDir, "ROUGH_icon.png");
mkdirSync(outDir, { recursive: true });
mkdirSync(sourceDir, { recursive: true });

/** Matches Play listing: dark field + ROUGH with gold circle O */
const BRAND = {
  bg: "#2b2433",
  text: "#f0ebe3",
  gold: "#d9a441",
};

const C = {
  bg: "#12100e",
  stone: "#1c1917",
  stoneLight: "#292524",
  amber: "#f59e0b",
  amberSoft: "#d6b15a",
  amberText: "#fde68a",
  muted: "#a8a29e",
  dust: "#78716c",
  rain: "#94a3b8",
};

/** Play / launcher icon — ROUGH wordmark (must match store listing). */
function roughStoreIconSvg(size, maskable = false) {
  const inset = maskable ? size * 0.12 : 0;
  const s = size - inset * 2;
  const fs = s * 0.19;
  const cx = size / 2;
  const cy = size * 0.54;
  const oR = fs * 0.42;
  const gap = fs * 0.06;
  const rW = fs * 0.58;
  const uW = fs * 0.62;
  const gW = fs * 0.62;
  const hW = fs * 0.62;
  const totalW = rW + gap + oR * 2 + gap + uW + gap + gW + gap + hW;
  let x = cx - totalW / 2;

  const rX = x + rW / 2;
  x += rW + gap;
  const oX = x + oR;
  x += oR * 2 + gap;
  const uX = x + uW / 2;
  x += uW + gap;
  const gX = x + gW / 2;
  x += gW + gap;
  const hX = x + hW / 2;

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" fill="${BRAND.bg}"/>
      <text x="${rX}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
        font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"
        font-size="${fs}" font-weight="800" fill="${BRAND.text}">R</text>
      <circle cx="${oX}" cy="${cy - fs * 0.02}" r="${oR}" fill="${BRAND.gold}"/>
      <text x="${uX}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
        font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"
        font-size="${fs}" font-weight="800" fill="${BRAND.text}">U</text>
      <text x="${gX}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
        font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"
        font-size="${fs}" font-weight="800" fill="${BRAND.text}">G</text>
      <text x="${hX}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
        font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"
        font-size="${fs}" font-weight="800" fill="${BRAND.text}">H</text>
    </svg>`,
  );
}

async function loadStoreIcon512() {
  if (existsSync(customIconPath)) {
    console.log(`Using custom icon: ${customIconPath}`);
    return sharp(readFileSync(customIconPath))
      .resize(512, 512, { fit: "cover" })
      .png()
      .toBuffer();
  }
  console.log("Generating ROUGH store icon (place ROUGH_icon.png in store-listing/source/ to override)");
  return sharp(roughStoreIconSvg(512)).png().toBuffer();
}

function featureGraphicSvg(w, h) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1a1612"/>
          <stop offset="45%" stop-color="${C.bg}"/>
          <stop offset="100%" stop-color="#0a0908"/>
        </linearGradient>
        <radialGradient id="sunGlow" cx="78%" cy="28%" r="42%">
          <stop offset="0%" stop-color="${C.amber}" stop-opacity="0.45"/>
          <stop offset="55%" stop-color="${C.amberSoft}" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="${C.bg}" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="hill1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3d3834"/>
          <stop offset="100%" stop-color="#1c1917"/>
        </linearGradient>
        <linearGradient id="hill2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#44403c"/>
          <stop offset="100%" stop-color="#292524"/>
        </linearGradient>
      </defs>

      <rect width="${w}" height="${h}" fill="url(#bg)"/>
      <rect width="${w}" height="${h}" fill="url(#sunGlow)"/>

      <path fill="url(#hill1)" opacity="0.9"
        d="M 0 ${h * 0.72} L ${w * 0.22} ${h * 0.48} L ${w * 0.42} ${h * 0.62} L ${w * 0.58} ${h * 0.44} L ${w * 0.78} ${h * 0.58} L ${w} ${h * 0.5} L ${w} ${h} L 0 ${h} Z"/>
      <path fill="url(#hill2)" opacity="0.95"
        d="M 0 ${h} L 0 ${h * 0.78} L ${w * 0.18} ${h * 0.68} L ${w * 0.38} ${h * 0.82} L ${w * 0.55} ${h * 0.7} L ${w * 0.72} ${h * 0.86} L ${w} ${h * 0.74} L ${w} ${h} Z"/>

      <path fill="none" stroke="${C.dust}" stroke-width="3" opacity="0.35"
        d="M ${w * 0.08} ${h * 0.92} Q ${w * 0.35} ${h * 0.78} ${w * 0.52} ${h * 0.84} T ${w * 0.88} ${h * 0.76}"/>

      <circle cx="${w * 0.78}" cy="${h * 0.28}" r="${h * 0.11}" fill="${C.amberSoft}" opacity="0.95"/>
      <circle cx="${w * 0.78}" cy="${h * 0.28}" r="${h * 0.085}" fill="${C.amber}"/>

      <text x="${w * 0.08}" y="${h * 0.38}"
        font-family="system-ui, -apple-system, Segoe UI, sans-serif"
        font-size="96" font-weight="800" fill="${BRAND.text}" letter-spacing="4">ROUGH</text>

      <text x="${w * 0.08}" y="${h * 0.52}"
        font-family="system-ui, -apple-system, Segoe UI, sans-serif"
        font-size="28" font-weight="600" fill="${C.muted}">Idle RPG · drought country · returning rain</text>

      <text x="${w * 0.08}" y="${h * 0.64}"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="34" font-style="italic" fill="${C.amberSoft}">
        Walk rough until the sky remembers rain.
      </text>

      <text x="${w * 0.08}" y="${h * 0.88}"
        font-family="system-ui, -apple-system, Segoe UI, sans-serif"
        font-size="22" font-weight="500" fill="${C.dust}">Map · quests · taverns · craft · rough.co.nz</text>

      <rect x="${w * 0.08}" y="${h * 0.42}" width="${w * 0.12}" height="4" rx="2" fill="${C.amber}"/>
    </svg>`,
  );
}

const icon512 = await loadStoreIcon512();
writeFileSync(join(outDir, "app-icon-512.png"), icon512);

const feature = await sharp(featureGraphicSvg(1024, 500)).png().toBuffer();
writeFileSync(join(outDir, "feature-graphic-1024x500.png"), feature);

const iconsDir = join(root, "public/icons");
mkdirSync(iconsDir, { recursive: true });
writeFileSync(join(iconsDir, "icon-512.png"), icon512);
writeFileSync(
  join(iconsDir, "icon-512-maskable.png"),
  existsSync(customIconPath)
    ? icon512
    : await sharp(roughStoreIconSvg(512, true)).png().toBuffer(),
);
writeFileSync(
  join(iconsDir, "icon-192.png"),
  await sharp(icon512).resize(192, 192).png().toBuffer(),
);

console.log("Wrote mobile/store-listing/app-icon-512.png");
console.log("Wrote mobile/store-listing/feature-graphic-1024x500.png");
console.log("Updated public/icons/ from store launcher icon");

/**
 * Play Store listing assets: 512 app icon + 1024×500 feature graphic.
 * Run: node scripts/generate-play-store-graphics.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "mobile/store-listing");
mkdirSync(outDir, { recursive: true });

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

function appIconSvg(size, maskable = false) {
  const cx = size / 2;
  const cy = size / 2 - size * 0.02;
  const r = size * 0.26;
  const pad = maskable ? size * 0.18 : size * 0.1;

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <radialGradient id="glow" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stop-color="${C.amber}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${C.bg}" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2a2520"/>
          <stop offset="100%" stop-color="${C.bg}"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#sky)"/>
      <rect width="${size}" height="${size}" fill="url(#glow)"/>
      <rect x="${pad}" y="${pad}" width="${size - pad * 2}" height="${size - pad * 2}"
        rx="${size * 0.14}" fill="${C.stone}" stroke="${C.stoneLight}" stroke-width="${size * 0.004}"/>

      <!-- dry hills -->
      <path fill="${C.stoneLight}" opacity="0.55"
        d="M ${pad} ${size - pad} L ${size * 0.35} ${size * 0.62} L ${size * 0.55} ${size - pad} Z"/>
      <path fill="${C.dust}" opacity="0.35"
        d="M ${size * 0.42} ${size - pad} L ${size * 0.68} ${size * 0.58} L ${size - pad} ${size - pad} Z"/>

      <!-- sun -->
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.amberSoft}"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.78}" fill="${C.amber}" opacity="0.92"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.52}" fill="${C.amberText}" opacity="0.35"/>

      <!-- drought cracks -->
      <g stroke="${C.bg}" stroke-width="${size * 0.018}" stroke-linecap="round" opacity="0.75">
        <line x1="${cx - r * 0.15}" y1="${cy - r * 0.55}" x2="${cx + r * 0.35}" y2="${cy + r * 0.2}"/>
        <line x1="${cx + r * 0.1}" y1="${cy - r * 0.45}" x2="${cx - r * 0.4}" y2="${cy + r * 0.35}"/>
        <line x1="${cx - r * 0.05}" y1="${cy + r * 0.1}" x2="${cx + r * 0.5}" y2="${cy + r * 0.55}"/>
      </g>

      <!-- rain drop (hope) -->
      <path fill="${C.rain}" opacity="0.85"
        d="M ${cx + r * 0.55} ${cy + r * 0.72}
           C ${cx + r * 0.55} ${cy + r * 0.55} ${cx + r * 0.72} ${cy + r * 0.58} ${cx + r * 0.72} ${cy + r * 0.75}
           C ${cx + r * 0.72} ${cy + r * 0.92} ${cx + r * 0.55} ${cy + r * 0.98} ${cx + r * 0.55} ${cy + r * 0.98}
           C ${cx + r * 0.38} ${cy + r * 0.98} ${cx + r * 0.38} ${cy + r * 0.92} ${cx + r * 0.38} ${cy + r * 0.75}
           C ${cx + r * 0.38} ${cy + r * 0.58} ${cx + r * 0.55} ${cy + r * 0.55} ${cx + r * 0.55} ${cy + r * 0.72} Z"/>

      <text x="${cx}" y="${size - pad * 1.35}" text-anchor="middle"
        font-family="system-ui, -apple-system, Segoe UI, sans-serif"
        font-size="${size * 0.11}" font-weight="700" fill="${C.amberText}" letter-spacing="${size * 0.02}">rough</text>
    </svg>`,
  );
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

      <!-- distant hills -->
      <path fill="url(#hill1)" opacity="0.9"
        d="M 0 ${h * 0.72} L ${w * 0.22} ${h * 0.48} L ${w * 0.42} ${h * 0.62} L ${w * 0.58} ${h * 0.44} L ${w * 0.78} ${h * 0.58} L ${w} ${h * 0.5} L ${w} ${h} L 0 ${h} Z"/>
      <path fill="url(#hill2)" opacity="0.95"
        d="M 0 ${h} L 0 ${h * 0.78} L ${w * 0.18} ${h * 0.68} L ${w * 0.38} ${h * 0.82} L ${w * 0.55} ${h * 0.7} L ${w * 0.72} ${h * 0.86} L ${w} ${h * 0.74} L ${w} ${h} Z"/>

      <!-- winding path -->
      <path fill="none" stroke="${C.dust}" stroke-width="3" opacity="0.35"
        d="M ${w * 0.08} ${h * 0.92} Q ${w * 0.35} ${h * 0.78} ${w * 0.52} ${h * 0.84} T ${w * 0.88} ${h * 0.76}"/>

      <!-- sun -->
      <circle cx="${w * 0.78}" cy="${h * 0.28}" r="${h * 0.11}" fill="${C.amberSoft}" opacity="0.95"/>
      <circle cx="${w * 0.78}" cy="${h * 0.28}" r="${h * 0.085}" fill="${C.amber}"/>
      <g stroke="${C.bg}" stroke-width="2.5" stroke-linecap="round" opacity="0.7">
        <line x1="${w * 0.78}" y1="${h * 0.17}" x2="${w * 0.8}" y2="${h * 0.3}"/>
        <line x1="${w * 0.72}" y1="${h * 0.24}" x2="${w * 0.84}" y2="${h * 0.32}"/>
        <line x1="${w * 0.74}" y1="${h * 0.33}" x2="${w * 0.82}" y2="${h * 0.36}"/>
      </g>

      <!-- title -->
      <text x="${w * 0.08}" y="${h * 0.38}"
        font-family="system-ui, -apple-system, Segoe UI, sans-serif"
        font-size="96" font-weight="800" fill="${C.amberText}" letter-spacing="4">rough</text>

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

      <!-- accent line -->
      <rect x="${w * 0.08}" y="${h * 0.42}" width="${w * 0.12}" height="4" rx="2" fill="${C.amber}"/>
    </svg>`,
  );
}

const icon512 = await sharp(appIconSvg(512)).png().toBuffer();
writeFileSync(join(outDir, "app-icon-512.png"), icon512);

const feature = await sharp(featureGraphicSvg(1024, 500)).png().toBuffer();
writeFileSync(join(outDir, "feature-graphic-1024x500.png"), feature);

// Keep Play icon aligned with PWA / launcher source
const iconsDir = join(root, "public/icons");
mkdirSync(iconsDir, { recursive: true });
writeFileSync(join(iconsDir, "icon-512.png"), icon512);
writeFileSync(
  join(iconsDir, "icon-512-maskable.png"),
  await sharp(appIconSvg(512, true)).png().toBuffer(),
);
writeFileSync(
  join(iconsDir, "icon-192.png"),
  await sharp(appIconSvg(192)).png().toBuffer(),
);

console.log("Wrote mobile/store-listing/app-icon-512.png");
console.log("Wrote mobile/store-listing/feature-graphic-1024x500.png");
console.log("Updated public/icons/ from matching app icon");

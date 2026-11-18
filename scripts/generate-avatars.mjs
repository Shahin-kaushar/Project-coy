import fs from "node:fs";
import path from "node:path";
import { seedProfiles } from "../lib/seed.mjs";

/**
 * Generates local, brand-styled SVG placeholder portraits so the demo works
 * offline and no third-party image host or licensing is involved.
 *
 * Run `npm run avatars` after editing lib/seed.mjs. Real photos can simply
 * replace the files in public/avatars.
 */

const INK = "#111014";

const PASTELS = ["#FFD9E5", "#BCE0F6", "#C9F0DB", "#FFE9A8", "#DCD0F5", "#F7D6BC"];
const SKINS = ["#F2C6A0", "#E0A87E", "#B97A56", "#8D5A3B", "#F6D7BD", "#C98B62"];
const HAIRS = ["#111014", "#3B2A20", "#6B3F2A", "#1F1F1F", "#8A4B2A"];
const OUTFITS = ["#FF2D78", "#2ED47A", "#7EB8F2", "#B79CF0", "#FFD84D", "#FF8A5B"];
const HAIR_STYLES = ["short", "bob", "bun", "curls", "long", "short"];

function hair(style, color) {
  switch (style) {
    case "bun":
      return `<circle cx="300" cy="170" r="52" fill="${color}"/><circle cx="300" cy="308" r="150" fill="${color}"/>`;
    case "bob":
      return `<rect x="150" y="250" width="300" height="240" rx="140" fill="${color}"/>`;
    case "curls":
      return `<g fill="${color}">
        <circle cx="200" cy="290" r="62"/><circle cx="245" cy="230" r="62"/>
        <circle cx="310" cy="212" r="64"/><circle cx="370" cy="240" r="62"/>
        <circle cx="405" cy="300" r="58"/><circle cx="300" cy="300" r="150"/>
      </g>`;
    case "long":
      return `<rect x="155" y="240" width="290" height="330" rx="145" fill="${color}"/>`;
    default:
      return `<circle cx="300" cy="312" r="152" fill="${color}"/>`;
  }
}

function portraitSvg(index) {
  const style = HAIR_STYLES[index % HAIR_STYLES.length];
  const skin = SKINS[index % SKINS.length];
  const hairColor = HAIRS[index % HAIRS.length];
  const outfit = OUTFITS[(index + 2) % OUTFITS.length];
  const bg = PASTELS[index % PASTELS.length];

  const hasGlasses = index % 5 === 1;
  const hasBangs = style !== "curls" && index % 4 === 2;
  const hasFreckles = index % 6 === 3;
  const hasEarrings = index % 3 === 0 && style !== "short";

  const bangs = hasBangs
    ? `<path d="M176 315c8-78 58-125 124-125s116 47 124 125c-32-42-76-62-124-62s-92 20-124 62z" fill="${hairColor}"/>`
    : "";

  const glasses = hasGlasses
    ? `<g fill="none" stroke="${INK}" stroke-width="9">
        <circle cx="258" cy="333" r="35"/><circle cx="342" cy="333" r="35"/>
        <path d="M293 333h14"/>
      </g>`
    : "";

  const freckles = hasFreckles
    ? `<g fill="${INK}" opacity=".45">
        <circle cx="225" cy="366" r="4"/><circle cx="241" cy="374" r="4"/><circle cx="212" cy="376" r="4"/>
        <circle cx="375" cy="366" r="4"/><circle cx="359" cy="374" r="4"/><circle cx="388" cy="376" r="4"/>
      </g>`
    : "";

  const earrings = hasEarrings
    ? `<g fill="#FFD84D" stroke="${INK}" stroke-width="6">
        <circle cx="161" cy="386" r="11"/><circle cx="439" cy="386" r="11"/>
      </g>`
    : "";

  const sparkleX = 500 + (index % 3) * 14;
  const sparkleY = 100 + (index % 4) * 18;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800" role="img" aria-label="Placeholder portrait">
  <rect width="600" height="800" fill="${bg}"/>
  <circle cx="78" cy="${120 + (index % 3) * 16}" r="24" fill="none" stroke="${INK}" stroke-width="9" opacity=".18"/>
  <path d="M${sparkleX} ${sparkleY}l12 30 30 12-30 12-12 30-12-30-30-12 30-12z" fill="${INK}" opacity=".16"/>

  ${hair(style, hairColor)}

  <path d="M120 800c14-160 76-250 180-250s166 90 180 250z" fill="${outfit}" stroke="${INK}" stroke-width="14"/>
  <rect x="258" y="445" width="84" height="120" rx="30" fill="${skin}" stroke="${INK}" stroke-width="14"/>
  <circle cx="300" cy="330" r="136" fill="${skin}" stroke="${INK}" stroke-width="14"/>
  <circle cx="163" cy="342" r="22" fill="${skin}" stroke="${INK}" stroke-width="12"/>
  <circle cx="437" cy="342" r="22" fill="${skin}" stroke="${INK}" stroke-width="12"/>

  ${bangs}
  ${earrings}

  <g fill="${INK}">
    <circle cx="258" cy="330" r="11"/>
    <circle cx="342" cy="330" r="11"/>
  </g>
  ${glasses}
  <path d="M262 382q38 30 76 0" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>

  <g fill="#FF2D78" opacity=".4">
    <circle cx="228" cy="368" r="15"/>
    <circle cx="372" cy="368" r="15"/>
  </g>
  ${freckles}
</svg>
`;
}

function run() {
  const outDir = path.join(process.cwd(), "public", "avatars");
  fs.mkdirSync(outDir, { recursive: true });

  const profiles = seedProfiles();
  profiles.forEach((profile, index) => {
    fs.writeFileSync(path.join(outDir, `${profile.id}.svg`), portraitSvg(index), "utf8");
  });

  // The signed-in user gets a distinct pink portrait.
  fs.writeFileSync(path.join(outDir, "me.svg"), portraitSvg(2), "utf8");

  console.log(`Wrote ${profiles.length + 1} placeholder avatars to public/avatars`);
}

run();

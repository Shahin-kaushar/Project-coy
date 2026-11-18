import fs from "node:fs";
import path from "node:path";
import { seedProfiles, ME } from "../lib/seed.mjs";

/**
 * Generates local SVG placeholder portraits so the demo works offline and no
 * third-party image host is needed. Run with `npm run avatars` after editing
 * lib/seed.mjs. Real photos can simply replace the files in public/avatars.
 */

const PALETTES = [
  ["#ff6b6b", "#7f2c5c"],
  ["#4facfe", "#1b3b8f"],
  ["#43e97b", "#1d6f5f"],
  ["#fa709a", "#5a2a63"],
  ["#f6d365", "#a8442a"],
  ["#a18cd1", "#3b2a70"],
  ["#ff9a9e", "#7b2d4e"],
  ["#00c6ff", "#2a4d8f"],
  ["#f093fb", "#5b2a86"],
  ["#84fab0", "#1f6b58"],
  ["#ffb199", "#8f3a2a"],
  ["#30cfd0", "#1d4d6b"],
  ["#e0c3fc", "#4a3670"],
  ["#f5576c", "#5c1f3d"],
  ["#5ee7df", "#1f5a6b"],
  ["#c79081", "#5a2f2a"],
  ["#ffecd2", "#b06a3a"],
  ["#8fd3f4", "#2b4b7a"],
  ["#d4fc79", "#4d6b2a"],
  ["#ff758c", "#63203f"],
  ["#6a11cb", "#1e3a8a"],
  ["#fbc2eb", "#6b2b5c"],
  ["#fdcbf1", "#7a4470"],
  ["#a1c4fd", "#26406b"],
  ["#f5f7fa", "#3a4a63"],
  ["#ff8177", "#7a2c3a"],
  ["#96e6a1", "#2a6b4a"],
  ["#fddb92", "#a45a2a"],
  ["#c1dfc4", "#3d5a4a"],
  ["#e6dada", "#5a4a4a"],
  ["#ff9966", "#8a3a2a"],
  ["#56ab2f", "#2a5a2a"],
  ["#7f7fd5", "#2a2a6b"],
  ["#ee9ca7", "#6b2a4a"],
];

const escapeXml = (value) =>
  value.replace(/[<>&'"]/g, (char) => `&${{ "<": "lt", ">": "gt", "&": "amp", "'": "apos", '"': "quot" }[char]};`);

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function portraitSvg({ from, to, label, index }) {
  const glowX = 120 + (index % 3) * 70;
  const glowY = 150 + (index % 4) * 40;
  const glowR = 130 + (index % 5) * 12;
  const ringX = 470 - (index % 4) * 50;
  const ringY = 250 + (index % 3) * 60;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800" role="img" aria-label="Placeholder portrait">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="24%" cy="14%" r="72%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.42"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.45" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.28"/>
    </linearGradient>
  </defs>

  <rect width="600" height="800" fill="url(#bg)"/>
  <rect width="600" height="800" fill="url(#glow)"/>
  <circle cx="${glowX}" cy="${glowY}" r="${glowR}" fill="#ffffff" opacity="0.08"/>
  <circle cx="${ringX}" cy="${ringY}" r="110" fill="none" stroke="#ffffff" stroke-opacity="0.10" stroke-width="2"/>
  <circle cx="520" cy="700" r="260" fill="#000000" opacity="0.10"/>

  <g fill="#0a0a10" opacity="0.26">
    <circle cx="300" cy="318" r="108"/>
    <path d="M300 408c-104 0-174 68-186 168l-7 224h386l-7-224c-12-100-82-168-186-168z"/>
  </g>

  <text x="560" y="150" text-anchor="end" font-family="Inter, 'Segoe UI', Arial, sans-serif" font-size="150" font-weight="700" letter-spacing="-6" fill="#ffffff" opacity="0.10">${escapeXml(label)}</text>
  <rect width="600" height="800" fill="url(#shade)"/>
</svg>
`;
}

function run() {
  const outDir = path.join(process.cwd(), "public", "avatars");
  fs.mkdirSync(outDir, { recursive: true });

  const profiles = seedProfiles();
  profiles.forEach((profile, index) => {
    const [from, to] = PALETTES[index % PALETTES.length];
    const svg = portraitSvg({ from, to, label: initials(profile.name), index });
    fs.writeFileSync(path.join(outDir, `${profile.id}.svg`), svg, "utf8");
  });

  const [from, to] = ["#ff4d6d", "#3b1d6b"];
  fs.writeFileSync(
    path.join(outDir, "me.svg"),
    portraitSvg({ from, to, label: "SK", index: 7 }),
    "utf8",
  );

  console.log(`Wrote ${profiles.length + 1} placeholder avatars to public/avatars`);
}

run();

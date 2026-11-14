// Extracts only the icons used by the Work section from tech-stack-icons.
// The package ships every icon as one 8 MB module, so importing StackIcon at
// runtime would put all 709 icons in the bundle. These static SVGs stay out of
// the JS payload and are cached by the browser.
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const icons = require("tech-stack-icons/icons.json");

const NAMES = [
  "antd", "dart", "django", "docker", "firebase", "flutter", "gemini",
  "laravel", "mysql", "nextjs", "nodejs", "postgresql", "python", "react",
  "redis", "redux", "swagger", "tailwindcss", "tauri", "typescript", "vitejs",
];

await mkdir("public/tech", { recursive: true });

let written = 0;
for (const name of NAMES) {
  const icon = icons[name];
  if (!icon?.svg?.light) {
    console.warn(`tech-stack-icons: no light SVG for "${name}", skipped`);
    continue;
  }
  await writeFile(`public/tech/${name}.svg`, icon.svg.light);
  written += 1;
}

console.log(`Wrote ${written} icons to public/tech`);

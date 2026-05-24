import sharp from "../node_modules/.pnpm/node_modules/sharp/lib/index.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, "..", "public", "images", "sermix_logo.png");
const out512 = path.join(__dirname, "..", "app", "icon.png");
const outApple = path.join(__dirname, "..", "app", "apple-icon.png");

const meta = await sharp(src).metadata();
console.log("source:", meta.width, "x", meta.height, meta.format);

// Trim near-white background, then pad to square so the wordmark stays centered.
const trimmed = await sharp(src)
  .ensureAlpha()
  .trim({ background: "#ffffff", threshold: 12 })
  .toBuffer({ resolveWithObject: true });

console.log("trimmed:", trimmed.info.width, "x", trimmed.info.height);

const size = Math.max(trimmed.info.width, trimmed.info.height);
const padX = Math.round((size - trimmed.info.width) / 2);
const padY = Math.round((size - trimmed.info.height) / 2);

const square = await sharp(trimmed.data)
  .extend({
    top: padY,
    bottom: size - trimmed.info.height - padY,
    left: padX,
    right: size - trimmed.info.width - padX,
    background: { r: 255, g: 255, b: 255, alpha: 0 },
  })
  .toBuffer();

await sharp(square)
  .resize(512, 512, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile(out512);

await sharp(square)
  .resize(180, 180, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .flatten({ background: { r: 255, g: 255, b: 255 } })
  .png({ compressionLevel: 9 })
  .toFile(outApple);

console.log("wrote", out512);
console.log("wrote", outApple);

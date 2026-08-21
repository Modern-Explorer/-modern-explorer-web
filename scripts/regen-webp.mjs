import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES = path.resolve(__dirname, '../public/assets/images/content');

const cases = [
  ['Crestone/20250810_090547-EDIT.jpg', 75],
  ['History/20250602_154545-EDIT.jpg', 75],
  ['Crestone/20250810_090800-EDIT.jpg', 78],
  ['Crestone/DJI_0289 edit.jpg', 78],
];

for (const [rel, q] of cases) {
  const src = path.join(IMAGES, rel);
  const dest = src.replace(/\.jpg$/i, '.webp');
  const { width } = await sharp(src).metadata();
  await sharp(src).resize(Math.min(width ?? 1920, 1920)).webp({ quality: q }).toFile(dest);
  const srcKB = Math.round(fs.statSync(src).size / 1024);
  const dstKB = Math.round(fs.statSync(dest).size / 1024);
  console.log(rel, srcKB + 'KB ->', dstKB + 'KB @ q' + q);
}

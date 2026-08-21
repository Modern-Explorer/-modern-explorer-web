#!/usr/bin/env node
// Generates WebP counterparts for JPGs that are referenced in source code but lack WebP.
// Writes output next to the original; originals are untouched.

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES = path.resolve(__dirname, '../public/assets/images/content');

const TARGETS = [
  // ComingSoon / Contact
  'Crestone/DJI_0289 edit.jpg',
  'Crestone/20250810_090800-EDIT.jpg',
  'Nature/20250729_200506-EDIT.jpg',
  'Animals/pexels-brett-sayles-1603783.jpg',
  'UFOs/MrhuO.jpg',
  // MerchStore
  'Crestone/20250810_090547-EDIT.jpg',
  'Crestone/20250810_090735-EDIT.jpg',
  'Animals/pexels-brett-sayles-1098886.jpg',
  // FieldReports
  'Crestone/20250810_091639-EDIT.jpg',
  'Nature/sangre-de-cristo-topo.jpg',
  'Nature/pexels-mohamedelaminemsiouri-2097442.jpg',
  'History/20250602_154545-EDIT.jpg',
  'Crestone/DJI_0286 edit.jpg',
  'Animals/snippy-1967-dan-anderson.jpg',
  'Nature/20250531_201055-EDIT.jpg',
];

async function convert(rel) {
  const src = path.join(IMAGES, rel);
  const dest = src.replace(/\.(jpg|jpeg)$/i, '.webp');
  if (!fs.existsSync(src)) { console.log(`SKIP (missing): ${rel}`); return; }
  if (fs.existsSync(dest)) { console.log(`SKIP (exists):  ${rel}`); return; }
  const { width } = await sharp(src).metadata();
  const outWidth = Math.min(width ?? 1920, 1920);
  await sharp(src)
    .resize(outWidth)
    .webp({ quality: 82 })
    .toFile(dest);
  const srcKB  = Math.round(fs.statSync(src).size  / 1024);
  const destKB = Math.round(fs.statSync(dest).size / 1024);
  console.log(`OK  ${rel.padEnd(52)} ${srcKB}KB → ${destKB}KB`);
}

for (const t of TARGETS) await convert(t);
console.log('Done.');

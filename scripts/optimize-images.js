#!/usr/bin/env node
// One-time image optimization script.
// - Backs up originals to public/assets/images-backup/ (preserving folder structure)
// - JPGs: resize to max 1920px wide, quality 82, progressive
// - Photo PNGs (drone shots): convert to JPG, resize to max 1920px, quality 85
// - Logo/icon PNGs: lossless PNG compression, preserve transparency
// - AVIFs: skip (already well-compressed)

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const IMAGES_DIR = 'public/assets/images';
const BACKUP_DIR = 'public/assets/images-backup';
const MAX_WIDTH = 1920;
const JPG_QUALITY = 82;
const LOGO_PNG_PATTERNS = ['Logo', 'logo', 'backpack', 'compass', 'maps-and-flags', 'Super tiny', 'ME Logo'];

function isLogoPng(filePath) {
  return LOGO_PNG_PATTERNS.some(p => filePath.includes(p));
}

function getAllFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip the backup directory itself
      if (full.includes('images-backup')) continue;
      results.push(...getAllFiles(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

function backupFile(src) {
  const rel = path.relative(IMAGES_DIR, src);
  const dest = path.join(BACKUP_DIR, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
  }
}

async function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath);

  // Skip AVIFs
  if (ext === '.avif') return { file: base, action: 'skipped (avif)' };

  // Back up original first
  backupFile(filePath);

  if (ext === '.jpg' || ext === '.jpeg') {
    const info = await sharp(filePath).metadata();
    const needsResize = info.width > MAX_WIDTH;
    const pipeline = sharp(filePath)
      .rotate() // auto-orient from EXIF
      .resize(needsResize ? { width: MAX_WIDTH, withoutEnlargement: true } : undefined)
      .jpeg({ quality: JPG_QUALITY, progressive: true, mozjpeg: true });
    const { size: before } = fs.statSync(filePath);
    await pipeline.toFile(filePath + '.tmp');
    fs.renameSync(filePath + '.tmp', filePath);
    const { size: after } = fs.statSync(filePath);
    return { file: base, action: needsResize ? `resized+compressed` : 'compressed', before, after };
  }

  if (ext === '.png') {
    const isLogo = isLogoPng(filePath);

    if (isLogo) {
      // Lossless PNG compression — preserve transparency
      const { size: before } = fs.statSync(filePath);
      await sharp(filePath)
        .png({ compressionLevel: 9, effort: 10 })
        .toFile(filePath + '.tmp');
      fs.renameSync(filePath + '.tmp', filePath);
      const { size: after } = fs.statSync(filePath);
      return { file: base, action: 'png-lossless', before, after };
    } else {
      // Photo PNG — convert to JPG and remove the PNG
      const jpgPath = filePath.replace(/\.png$/i, '.jpg');
      const info = await sharp(filePath).metadata();
      const needsResize = info.width > MAX_WIDTH;
      const { size: before } = fs.statSync(filePath);
      await sharp(filePath)
        .rotate()
        .resize(needsResize ? { width: MAX_WIDTH, withoutEnlargement: true } : undefined)
        .jpeg({ quality: 85, progressive: true, mozjpeg: true })
        .toFile(jpgPath);
      fs.unlinkSync(filePath); // remove original PNG (it's backed up)
      const { size: after } = fs.statSync(jpgPath);
      return { file: base, action: `png→jpg${needsResize ? '+resized' : ''}`, before, after, newPath: jpgPath };
    }
  }

  return { file: base, action: 'skipped (unknown ext)' };
}

function fmt(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

const files = getAllFiles(IMAGES_DIR).filter(f =>
  /\.(jpg|jpeg|png|avif)$/i.test(f)
);

console.log(`Found ${files.length} image files. Starting optimization...\n`);

let totalBefore = 0;
let totalAfter = 0;
const pngToJpgRenames = [];

for (const file of files) {
  try {
    const result = await processFile(file);
    if (result.before !== undefined) {
      totalBefore += result.before;
      totalAfter += result.after;
      const saved = result.before - result.after;
      console.log(`  [${result.action}] ${result.file}: ${fmt(result.before)} → ${fmt(result.after)} (saved ${fmt(saved)})`);
      if (result.newPath) {
        pngToJpgRenames.push({ old: file, newPath: result.newPath });
      }
    } else {
      console.log(`  [${result.action}] ${result.file}`);
    }
  } catch (err) {
    console.error(`  [ERROR] ${path.basename(file)}: ${err.message}`);
  }
}

console.log('\n─────────────────────────────────────────');
console.log(`Total before: ${fmt(totalBefore)}`);
console.log(`Total after:  ${fmt(totalAfter)}`);
console.log(`Total saved:  ${fmt(totalBefore - totalAfter)} (${((1 - totalAfter / totalBefore) * 100).toFixed(1)}% reduction)`);

if (pngToJpgRenames.length > 0) {
  console.log('\nPNG→JPG renames (update code references if needed):');
  for (const r of pngToJpgRenames) {
    console.log(`  ${path.basename(r.old)} → ${path.basename(r.newPath)}`);
  }
}

console.log(`\nOriginals backed up to: ${BACKUP_DIR}`);

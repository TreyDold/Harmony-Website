/**
 * Harmony Gallery — Image Update Script
 *
 * 1. Copies new images into public/images/original/
 * 2. Updates data/images.json with new entries
 *
 * Run from project root: node update-images.js
 */

const fs   = require('fs');
const path = require('path');

// ── CONFIG ────────────────────────────────────────────────────────────────────

const SOURCE_BASE   = 'C:\\Users\\treyd\\Downloads\\Harmony_images\\website_images';
const ORIGINAL_BASE = path.join('public', 'images', 'original');
const JSON_PATH     = path.join('data', 'images.json');
const IMAGE_EXT     = /\.(jpg|jpeg|png|webp)$/i;

// Photos: source folder → destination subcategory
const PHOTO_MAP = {
  'faces'       : 'faces',
  'Front_backs' : 'front_backs',
  'landscapes'  : 'landscapes',
  'Lights'      : 'lights',
  'portraits'   : 'portraits',
};

// Drawings: simple flat mappings (no subsubcategory)
const DRAWING_FLAT_MAP = {
  'digital' : 'mixed_media',
  'grids'   : 'quilt',
};

// pen_and_paper: source folder → subsubcategory slug
const PEN_AND_PAPER_MAP = {
  'larger drawings'    : 'larger_drawings',
  'micros (by month)'  : 'micros_by_month',
  'micros (grouping)'  : 'micros_grouping',
};

// ── HELPERS ───────────────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function getImageFiles(dir) {
  return fs.readdirSync(dir).filter(f => IMAGE_EXT.test(f));
}

function copyFile(src, dest) {
  if (fs.existsSync(dest)) {
    console.log(`    ⏭️  Already exists, skipping: ${path.basename(dest)}`);
    return;
  }
  fs.copyFileSync(src, dest);
  console.log(`    ✅ ${path.basename(dest)}`);
}

function makeEntry(category, subcategory, filename, subsubcategory = null) {
  const nameWithoutExt = path.parse(filename).name;
  const alt = nameWithoutExt.replace(/[_\-;]/g, ' ').replace(/\s+/g, ' ').trim();

  const srcPath = subsubcategory
    ? `/gallery/${category}/${subcategory}/${subsubcategory}/${filename}`
    : `/gallery/${category}/${subcategory}/${filename}`;

  const entry = { category, subcategory, src: srcPath, alt };
  if (subsubcategory) entry.subsubcategory = subsubcategory;
  return entry;
}

// Recursively collects image files (handles micros by month which has sub-folders)
function walkImages(dir, callback) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      walkImages(full, callback);
    } else if (IMAGE_EXT.test(item)) {
      callback(full, item);
    }
  }
}

// ── COPY PHOTOS ───────────────────────────────────────────────────────────────

function copyPhotos() {
  console.log('\n📸 PHOTOS\n');
  const newEntries = [];

  for (const [srcFolder, destSubcat] of Object.entries(PHOTO_MAP)) {
    const srcDir  = path.join(SOURCE_BASE, 'photos', srcFolder);
    const destDir = path.join(ORIGINAL_BASE, 'photos', destSubcat);
    ensureDir(destDir);
    console.log(`  ${srcFolder} → photos/${destSubcat}`);

    for (const file of getImageFiles(srcDir)) {
      copyFile(path.join(srcDir, file), path.join(destDir, file));
      newEntries.push(makeEntry('photos', destSubcat, file));
    }
  }

  return newEntries;
}

// ── COPY DRAWINGS ─────────────────────────────────────────────────────────────

function copyDrawings() {
  console.log('\n🎨 DRAWINGS\n');
  const newEntries = [];

  // digital → mixed_media, grids → quilt
  for (const [srcFolder, destSubcat] of Object.entries(DRAWING_FLAT_MAP)) {
    const srcDir  = path.join(SOURCE_BASE, 'drawings', srcFolder);
    const destDir = path.join(ORIGINAL_BASE, 'drawings', destSubcat);
    ensureDir(destDir);
    console.log(`  ${srcFolder} → drawings/${destSubcat}`);

    for (const file of getImageFiles(srcDir)) {
      copyFile(path.join(srcDir, file), path.join(destDir, file));
      newEntries.push(makeEntry('drawings', destSubcat, file));
    }
  }

  // pen_and_paper: each source folder → its own subsubcategory folder
  console.log('\n  pen_and_paper (nested sub-subcategories)\n');
  for (const [srcFolder, subsubcategory] of Object.entries(PEN_AND_PAPER_MAP)) {
    const srcDir  = path.join(SOURCE_BASE, 'drawings', srcFolder);
    const destDir = path.join(ORIGINAL_BASE, 'drawings', 'pen_and_paper', subsubcategory);
    ensureDir(destDir);
    console.log(`    ${srcFolder} → drawings/pen_and_paper/${subsubcategory}`);

    walkImages(srcDir, (fullPath, filename) => {
      const dest = path.join(destDir, filename);

      // Handle filename collisions by prefixing parent folder name
      if (fs.existsSync(dest)) {
        const parent  = path.basename(path.dirname(fullPath));
        const ext     = path.extname(filename);
        const base    = path.basename(filename, ext);
        const newName = `${parent}_${base}${ext}`;
        copyFile(fullPath, path.join(destDir, newName));
        newEntries.push(makeEntry('drawings', 'pen_and_paper', newName, subsubcategory));
      } else {
        copyFile(fullPath, dest);
        newEntries.push(makeEntry('drawings', 'pen_and_paper', filename, subsubcategory));
      }
    });
  }

  return newEntries;
}

// ── UPDATE images.json ────────────────────────────────────────────────────────

function updateJson(newPhotoEntries, newDrawingEntries) {
  console.log('\n📝 Updating images.json...\n');
  const existing = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

  // Drop abstracts (replaced by front_backs, landscapes, lights)
  // Keep all other existing entries
  const kept = existing.filter(img =>
    !(img.category === 'photos' && img.subcategory === 'abstracts')
  );

  const merged = [...kept, ...newPhotoEntries, ...newDrawingEntries];

  // Deduplicate by src — keeps the last occurrence (new entries win)
  const seen = new Map();
  for (const entry of merged) seen.set(entry.src, entry);
  const updated = [...seen.values()];

  fs.writeFileSync(JSON_PATH, JSON.stringify(updated, null, 4));

  console.log(`  Kept    : ${kept.length} existing entries`);
  console.log(`  Added   : ${newPhotoEntries.length} photo entries`);
  console.log(`  Added   : ${newDrawingEntries.length} drawing entries`);
  console.log(`  Total   : ${updated.length} entries`);
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

const photoEntries   = copyPhotos();
const drawingEntries = copyDrawings();
updateJson(photoEntries, drawingEntries);

console.log(`
✅ Done!

Next steps:
  1. node scripts/optimize-images.js   ← generate all WebP sizes
  2. Deploy to Vercel
`);
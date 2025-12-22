const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const inputDir = './public/images/original';
const outputDir = './public/images/optimized';

// Image sizes to generate (width-based, height auto-adjusts)
const sizes = {
  thumbnail: { width: 300, quality: 80 },
  small: { width: 600, quality: 85 },
  medium: { width: 1200, quality: 90 },
  large: { width: 1920, quality: 95 }
};

async function processDirectory(dir, relativePath = '') {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      const newRelativePath = path.join(relativePath, item);
      await processDirectory(fullPath, newRelativePath);
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(item)) {
      await processImage(fullPath, relativePath, item);
    }
  }
}

async function processImage(inputPath, relativePath, fileName) {
  const fileNameWithoutExt = path.parse(fileName).name;
  
  // Get original dimensions
  const metadata = await sharp(inputPath).metadata();
  console.log(`\n📸 Processing: ${path.join(relativePath, fileName)}`);
  console.log(`   Original: ${metadata.width}x${metadata.height}`);
  
  for (const [sizeName, config] of Object.entries(sizes)) {
    const outputSizeDir = path.join(outputDir, sizeName, relativePath);
    if (!fs.existsSync(outputSizeDir)) {
      fs.mkdirSync(outputSizeDir, { recursive: true });
    }
    
    const outputPath = path.join(outputSizeDir, `${fileNameWithoutExt}.webp`);
    
    // Process with no cropping
    const image = sharp(inputPath)
      .resize(config.width, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: config.quality });
    
    await image.toFile(outputPath);
    
    // Get output dimensions to verify
    const outputMetadata = await sharp(outputPath).metadata();
    console.log(`   ✅ ${sizeName}: ${outputMetadata.width}x${outputMetadata.height}`);
  }
}

async function optimizeImages() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await processDirectory(inputDir);
  
}

optimizeImages().catch(console.error);
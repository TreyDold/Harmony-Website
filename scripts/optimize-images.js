const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const inputDir = './public/images/original'; // Your large images
const outputDir = './public/images/optimized';

// Image sizes to generate
const sizes = {
  thumbnail: { width: 300, height: 200, quality: 80 },
  small: { width: 600, height: 400, quality: 85 },
  medium: { width: 1200, height: 800, quality: 90 },
  large: { width: 1920, height: 1280, quality: 95 }
};

async function processDirectory(dir, relativePath = '') {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      // Recursively process subdirectories
      const newRelativePath = path.join(relativePath, item);
      await processDirectory(fullPath, newRelativePath);
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(item)) {
      // Process image file
      await processImage(fullPath, relativePath, item);
    }
  }
}

async function processImage(inputPath, relativePath, fileName) {
  const fileNameWithoutExt = path.parse(fileName).name;
  console.log(`Processing: ${path.join(relativePath, fileName)}`);
  
  // Generate each size
  for (const [sizeName, config] of Object.entries(sizes)) {
    // Create output directory structure
    const outputSizeDir = path.join(outputDir, sizeName, relativePath);
    if (!fs.existsSync(outputSizeDir)) {
      fs.mkdirSync(outputSizeDir, { recursive: true });
    }
    
    const outputPath = path.join(outputSizeDir, `${fileNameWithoutExt}.webp`);
    
    await sharp(inputPath)
      .resize(config.width, config.height, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: config.quality })
      .toFile(outputPath);

    console.log(`  ✅ ${sizeName}: ${outputPath}`);
  }
}

async function optimizeImages() {
  // Create base output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Process all images recursively
  await processDirectory(inputDir);
  
  console.log('Images optimized.');
}

// Run the optimization
optimizeImages().catch(console.error);
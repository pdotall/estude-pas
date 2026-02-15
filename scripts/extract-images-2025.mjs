import * as mupdf from 'mupdf';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'questions', '2025');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function extractPages(pdfPath, prefix) {
  console.log(`\nLoading PDF: ${pdfPath}...`);
  const data = fs.readFileSync(pdfPath);
  const doc = mupdf.Document.openDocument(data, 'application/pdf');
  
  const numPages = doc.countPages();
  console.log(`PDF has ${numPages} pages`);
  
  // Extract all pages as images (scale 2x for better quality - 144 DPI)
  const dpi = 144;
  
  for (let pageNum = 0; pageNum < numPages; pageNum++) {
    console.log(`Processing page ${pageNum + 1}...`);
    
    const page = doc.loadPage(pageNum);
    const pixmap = page.toPixmap(mupdf.Matrix.scale(dpi / 72, dpi / 72), mupdf.ColorSpace.DeviceRGB);
    
    const outputPath = path.join(OUTPUT_DIR, `${prefix}-page-${(pageNum + 1).toString().padStart(2, '0')}.png`);
    const pngData = pixmap.asPNG();
    fs.writeFileSync(outputPath, pngData);
    
    console.log(`  Saved: ${outputPath}`);
  }
  
  return numPages;
}

async function main() {
  console.log('Extracting pages from 2025 PAS exams...\n');
  
  // Extract Part 1 (Língua Estrangeira - 3 pages)
  const part1Path = path.join(__dirname, '..', 'provas', '2025-prova-parte1.pdf');
  const part1Pages = await extractPages(part1Path, 'parte1');
  
  // Extract Part 2 (Main exam - 10 pages)
  const part2Path = path.join(__dirname, '..', 'provas', '2025-prova-parte2.pdf');
  const part2Pages = await extractPages(part2Path, 'parte2');
  
  console.log('\n========================================');
  console.log('All pages extracted successfully!');
  console.log(`Part 1: ${part1Pages} pages`);
  console.log(`Part 2: ${part2Pages} pages`);
  console.log(`Total: ${part1Pages + part2Pages} pages`);
  console.log(`Images saved to: ${OUTPUT_DIR}`);
}

main().catch(console.error);

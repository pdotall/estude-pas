import * as mupdf from 'mupdf';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDF_PATH = path.join(__dirname, '..', 'provas', '2024-prova.pdf');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'questions');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function extractPages() {
  console.log('Loading PDF...');
  const data = fs.readFileSync(PDF_PATH);
  const doc = mupdf.Document.openDocument(data, 'application/pdf');
  
  const numPages = doc.countPages();
  console.log(`PDF has ${numPages} pages`);
  
  // Extract all pages as images (scale 2x for better quality - 144 DPI)
  const dpi = 144;
  
  for (let pageNum = 0; pageNum < numPages; pageNum++) {
    console.log(`Processing page ${pageNum + 1}...`);
    
    const page = doc.loadPage(pageNum);
    const pixmap = page.toPixmap(mupdf.Matrix.scale(dpi / 72, dpi / 72), mupdf.ColorSpace.DeviceRGB);
    
    const outputPath = path.join(OUTPUT_DIR, `page-${(pageNum + 1).toString().padStart(2, '0')}.png`);
    const pngData = pixmap.asPNG();
    fs.writeFileSync(outputPath, pngData);
    
    console.log(`  Saved: ${outputPath}`);
  }
  
  console.log('\nAll pages extracted successfully!');
  console.log(`Images saved to: ${OUTPUT_DIR}`);
}

extractPages().catch(console.error);

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read existing questions (2024)
const existingPath = path.join(__dirname, '..', 'src', 'data', 'questions.json');
const existing = JSON.parse(fs.readFileSync(existingPath, 'utf-8'));

// Read new questions (2025)
const newPath = path.join(__dirname, '..', 'temp-2025-questions.json');
const newQuestions = JSON.parse(fs.readFileSync(newPath, 'utf-8'));

// Merge
const merged = [...existing, ...newQuestions];

// Write merged
fs.writeFileSync(existingPath, JSON.stringify(merged, null, 2), 'utf-8');

console.log(`Merged ${existing.length} existing questions with ${newQuestions.length} new questions.`);
console.log(`Total: ${merged.length} questions`);

// Cleanup temp file
fs.unlinkSync(newPath);
console.log('Cleaned up temp file.');

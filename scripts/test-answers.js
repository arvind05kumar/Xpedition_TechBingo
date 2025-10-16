// Simple Node test to validate answer matching against variations
// Run with: node scripts/test-answers.js

import fs from 'fs';
import path from 'path';

const questionsPath = path.resolve(process.cwd(), 'src/data/questions.ts');

function normalizeAnswer(text) {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’`]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function isAnswerMatch(userInput, correctAnswer) {
  const u = normalizeAnswer(userInput);
  const c = normalizeAnswer(correctAnswer);
  if (!u) return false;
  if (u === c) return true;
  return c.includes(u) || u.includes(c);
}

function parseQuestions(tsContent) {
  const regex = /\{\s*question:\s*"([^"]+)"\s*,\s*answer:\s*"([^"]*)"\s*\}/g;
  const items = [];
  let match;
  while ((match = regex.exec(tsContent)) !== null) {
    items.push({ question: match[1], answer: match[2] });
  }
  return items;
}

function variations(s) {
  const v = new Set([
    s,
    s.toLowerCase(),
    s.toUpperCase(),
    s + '  ',
    s.replace(/['’`]/g, ''),
    s.replace(/&/g, ' and '),
  ]);
  // If multi-word, also test first and last tokens
  const tokens = s.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) {
    v.add(tokens[0]);
    v.add(tokens[tokens.length - 1]);
  }
  return Array.from(v);
}

const ts = fs.readFileSync(questionsPath, 'utf8');
const questions = parseQuestions(ts);

const mismatches = [];
for (const q of questions) {
  for (const v of variations(q.answer)) {
    if (!isAnswerMatch(v, q.answer)) {
      mismatches.push({ question: q.question, answer: q.answer, variant: v });
    }
  }
}

if (mismatches.length === 0) {
  console.log('All answer variants matched. Total questions:', questions.length);
  process.exit(0);
} else {
  console.warn('Mismatches found:', mismatches.length);
  console.table(mismatches.slice(0, 20));
  process.exit(1);
}



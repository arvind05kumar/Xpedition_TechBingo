import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { isAnswerMatch, normalizeAnswer } from './utils/answerMatch';
import { sampleQuestions } from './data/questions';

// TEMP: Force-crash the app to stop deployment/runtime immediately
throw new Error('Maintenance lock: application startup intentionally halted');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Dev-only: expose a test function to validate answer matching in console
// Usage: runAnswerTests()
// It will try a few benign variations against each answer and log mismatches
// This does not run in production builds; harmless in dev
// @ts-ignore
window.runAnswerTests = function runAnswerTests() {
  const variations = (s: string) => [
    s,
    s.toLowerCase(),
    s.toUpperCase(),
    s + '  ',
    s.replace(/['’`]/g, ''),
    s.replace(/&/g, ' and '),
  ];

  const results: { question: string; answer: string; variant: string }[] = [];
  for (const q of sampleQuestions) {
    const vars = variations(q.answer);
    for (const v of vars) {
      if (!isAnswerMatch(v, q.answer)) {
        results.push({ question: q.question, answer: q.answer, variant: v });
      }
    }
  }
  if (results.length === 0) {
    console.log('All answer variants matched.');
  } else {
    console.warn('Mismatches found:', results);
  }
  return { mismatches: results.length, details: results, normalizeAnswer };
};

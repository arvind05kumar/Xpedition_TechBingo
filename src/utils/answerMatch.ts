export function normalizeAnswer(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/['’`]/g, '') // unify quotes
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ') // non-alphanumerics to space
    .trim()
    .replace(/\s+/g, ' '); // collapse spaces
}

export function isAnswerMatch(userInput: string, correctAnswer: string): boolean {
  const u = normalizeAnswer(userInput);
  const c = normalizeAnswer(correctAnswer);
  if (!u) return false;
  if (u === c) return true;
  // Allow substring match either way to tolerate partials like "bansal" vs "peyush bansal"
  return c.includes(u) || u.includes(c);
}



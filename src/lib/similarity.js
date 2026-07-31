function words(value = '') {
  return new Set(value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[a-z0-9]{3,}/g) || []);
}

function overlapScore(first, second, maximum) {
  const a = words(first); const b = words(second);
  if (!a.size || !b.size) return 0;
  const common = [...a].filter((word) => b.has(word)).length;
  const total = new Set([...a, ...b]).size;
  return Math.round((common / total) * maximum);
}

export function calculateSimilarity(reference, candidate) {
  const title = overlapScore(reference.title, candidate.title, 40);
  const description = overlapScore(reference.description, candidate.description, 30);
  const sector = reference.sector && reference.sector === candidate.sector ? 20 : 0;
  const cause = overlapScore(reference.cause, candidate.cause, 10);
  return { score: title + description + sector + cause, breakdown: { title, description, sector, cause } };
}

export function findSimilarLessons(reference, lessons, excludedId) {
  return lessons
    .filter((lesson) => lesson.id !== excludedId)
    .map((lesson) => ({ lesson, ...calculateSimilarity(reference, lesson) }))
    .filter((result) => result.score > 0)
    .sort((first, second) => second.score - first.score)
    .slice(0, 5);
}

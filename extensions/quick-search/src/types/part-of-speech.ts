export const PARTS_OF_SPEECH = [
  { emoji: "📦", name: "Noun", description: "a “thing”" },
  { emoji: "🙋", name: "Pronoun", description: "represents a person" },
  { emoji: "🏃", name: "Verb", description: "action" },
  { emoji: "🎨", name: "Adjective", description: "describes qualities" },
  { emoji: "⚡", name: "Adverb", description: "modifies actions with speed/intensity" },
  { emoji: "📍", name: "Preposition", description: "location/relationship" },
  { emoji: "🔗", name: "Conjunction", description: "connects words/clauses" },
  { emoji: "💥", name: "Interjection", description: "sudden feeling or reaction" },
  { emoji: "🧭", name: "Determiner", description: "points to specifics (“this”, “that”)" },
  { emoji: "📰", name: "Article", description: "introduces nouns (a, an, the)" },
  { emoji: "🪶", name: "Particle", description: "small but important piece" },
  { emoji: "🔢", name: "Numeral", description: "numbers/quantities" },
  { emoji: "🛠️", name: "Auxiliary Verb", description: "helps other verbs" },
  { emoji: "🤔", name: "Modal Verb", description: "expresses possibility/necessity" },
  { emoji: "🏊‍♂️", name: "Gerund", description: "“-ing” action as a noun" },
  { emoji: "🎯", name: "Infinitive", description: "“to” + verb as purpose" }
] as const;

export type PartOfSpeechName = typeof PARTS_OF_SPEECH[number]["name"];

export function getPartOfSpeechInfo(
  part: PartOfSpeechName | null
): { emoji: string; name: string; description: string } {
  const found = PARTS_OF_SPEECH.find(p => p.name === part);
  if (!found) {
    return {  emoji: "❓", name: "", description: ""  };
  }
  return { emoji: found.emoji, name: found.name, description: found.description };
}


// Small helper: Levenshtein distance
function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return dp[a.length][b.length];
}

// Function to identify closest part of speech
export function identifyPartOfSpeech(text: string): PartOfSpeechName | null {
  const input = text.trim().toLowerCase();

  // 1️⃣ Exact case-insensitive match
  const exact = PARTS_OF_SPEECH.find(
    p => p.name.toLowerCase() === input
  );
  if (exact) return exact.name;

  // 2️⃣ Fuzzy match by Levenshtein distance
  let bestMatch: { name: PartOfSpeechName; distance: number } | null = null;

  for (const p of PARTS_OF_SPEECH) {
    const dist = levenshtein(input, p.name.toLowerCase());
    if (!bestMatch || dist < bestMatch.distance) {
      bestMatch = { name: p.name, distance: dist };
    }
  }

  // You can adjust the threshold — here max 3 edits away
  return bestMatch && bestMatch.distance <= 3 ? bestMatch.name : null;
}

interface TextAnalysis {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
}

export function analyzeText(text?: string): TextAnalysis {
  // Handle empty or whitespace-only text
  const trimmed = text?.trim();
  if (!trimmed) {
    return {
      wordCount: 0,
      sentenceCount: 0,
      paragraphCount: 0
    };
  }

  // Count words (split by whitespace, filter empty strings)
  const words = trimmed.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  // Count sentences (split by sentence terminators)
  const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;

  // Count paragraphs (split by double newlines or more)
  const paragraphs = trimmed.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const paragraphCount = paragraphs.length;

  return {
    wordCount,
    sentenceCount,
    paragraphCount
  };
}

export function isWord(analysis: TextAnalysis) {
  return analysis.wordCount === 1 && analysis.sentenceCount === 1 && analysis.paragraphCount === 1;
}

export function isSentence(analysis: TextAnalysis) {
  return analysis.wordCount > 1 && analysis.sentenceCount === 1 && analysis.paragraphCount === 1;
}

export function isParagraph(analysis: TextAnalysis) {
  return analysis.wordCount > 1 && analysis.sentenceCount > 1 && analysis.paragraphCount === 1;
}



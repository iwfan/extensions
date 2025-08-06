export interface WordDefinition {
  word: string;
  phonetic: string;
  meanings: Meaning[];
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: any[];
}

export interface Definition {
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example?: string;
}


/*
 * @see https://dictionaryapi.dev/
 */

import { useFetch } from "@raycast/utils";
import { WordDefinition } from "../types/word-definition";

interface Root {
  word: string;
  phonetic: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license: License;
  sourceUrls: string[];
}

interface License {
  name: Name;
  url: string;
}

enum Name {
  BySa30 = "BY-SA 3.0",
  BySa40 = "BY-SA 4.0",
  CcBySa30 = "CC BY-SA 3.0",
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: any[];
}

interface Definition {
  definition: string;
  synonyms: any[];
  antonyms: any[];
  example?: string;
}

interface Phonetic {
  text: string;
  audio: string;
  sourceUrl: string;
  license: License;
}

export function useDictionaryAPI(word: string) {
  const { isLoading, data, revalidate } = useFetch<Root[], null, Root>(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    {
      mapResult: (result) => {
        return {
          data: result[0],
        };
      }
    }
  );

  return { isLoading, data, revalidate };
}


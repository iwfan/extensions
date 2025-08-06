import { getSelectedText } from "@raycast/api";

interface DictionaryDefinition {
  word: string;
  phonetic?: string;
  phonetics?: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
  }>;
}

export async function lookupWordDefinition(word: string): Promise<DictionaryDefinition[]> {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Word "${word}" not found`);
      }
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as DictionaryDefinition[];
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch word definition");
  }
}

export async function getWordDefinitionFromSelection(): Promise<string> {
  try {
    const selectedText = await getSelectedText();
    if (!selectedText.trim()) {
      throw new Error("No text selected");
    }

    const definitions = await lookupWordDefinition(selectedText.trim());
    return formatDefinitions(definitions);
  } catch (error) {
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }
    return "Error: Failed to get word definition";
  }
}

export function formatDefinitions(definitions: DictionaryDefinition[]): string {
  if (!definitions || definitions.length === 0) {
    return "No definitions found";
  }

  const definition = definitions[0];
  let result = `**${definition.word}**`;

  if (definition.phonetic) {
    result += ` \`${definition.phonetic}\``;
  }

  result += "\n\n";

  definition.meanings.forEach((meaning, index) => {
    result += `**${index + 1}. ${meaning.partOfSpeech}**\n`;

    meaning.definitions.forEach((def, defIndex) => {
      result += `   ${defIndex + 1}. ${def.definition}`;

      if (def.example) {
        result += `\n      *Example: "${def.example}"*`;
      }

      if (def.synonyms && def.synonyms.length > 0) {
        result += `\n      *Synonyms: ${def.synonyms.join(", ")}*`;
      }

      result += "\n";
    });

    result += "\n";
  });

  return result.trim();
}

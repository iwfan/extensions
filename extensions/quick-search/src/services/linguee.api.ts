/**
 * @see https://linguee-api.fly.dev/
 */

import { useFetch } from "@raycast/utils"


export interface Root {
    featured:     boolean;
    text:         string;
    pos:          Pos;
    forms:        any[];
    grammar_info: null;
    audio_links:  AudioLink[];
    translations: Translation[];
}

export interface AudioLink {
    url:  string;
    lang: string;
}

export enum Pos {
    Empty = "",
    Verb = "verb",
}

export interface Translation {
    featured:        boolean;
    text:            string;
    pos:             Pos;
    audio_links:     null;
    examples:        any[];
    usage_frequency: null;
}

interface Result { }

export function useLingueeAPI(word: string) {
  const { isLoading, data, revalidate } = useFetch<Root, null, Result>(
    `https://linguee-api.fly.dev/api/v2/translations?query=${word}&src=en&dst=zh&guess_direction=false&follow_corrections=always`,
    {
      headers: {
        accept: 'application/json'
      },
      mapResult: (result) => {
        return { data: result as unknown as Result };
      }
    }
  );

  return { isLoading, data, revalidate };
}




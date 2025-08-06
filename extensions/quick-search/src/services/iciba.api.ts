import { useFetch } from "@raycast/utils"

interface Root {
  message: Message[]
  status: number
}

interface Message {
  key: string
  paraphrase: string
  value: number
  means: Mean[]
}

interface Mean {
  part: string
  means: string[]
}

interface Result {

}


export function useIcibaAPI(word: string) {
  const { isLoading, data, revalidate } = useFetch<Root, null, Result>(
    `https://dict-mobile.iciba.com/interface/index.php?c=word&m=getsuggest&nums=10&is_need_mean=1&word=${word}`,
    {
      mapResult: (result) => {
        return { data: result as unknown as Result };
      }
    }
  );

  return { isLoading, data, revalidate };
}

export const iCibaFetcher = (word: string) => fetch(`https://dict-mobile.iciba.com/interface/index.php?c=word&m=getsuggest&nums=10&is_need_mean=1&word=${word}`).then(res => res.json());

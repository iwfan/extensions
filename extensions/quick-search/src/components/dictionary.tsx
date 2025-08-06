import { AI, Detail, List } from "@raycast/api";
import { useAI, usePromise } from "@raycast/utils";
import { iCibaFetcher, useIcibaAPI } from "../services/iciba.api";
import { useDictionaryAPI } from "../services/dictionary-dev.api";
import { useState } from "react";
import { getPartOfSpeechInfo, identifyPartOfSpeech } from "../types/part-of-speech";


interface DictionaryProps {
  searchText: string;
  onSearchTextChange: ((text: string) => void) | undefined
}

const Dictionary: React.FC<DictionaryProps> = ({ searchText, onSearchTextChange }) => {

  // const { isLoading } = usePromise(
  //   async (word) => {
  //     const ir = await (word)
  //     const stream = AI.ask(PROMPT_TEMPLATE(ir));
  //     stream.on("data", (data) => {
  //       setData((x) => x + data);
  //     });
  //     await stream;
  //   },
  //   [word]
  // );

  const { isLoading, data } = useDictionaryAPI(searchText);
  console.log(`ivan ${isLoading}, ${Array.isArray(data)} ${JSON.stringify(data)}`);

  return (
    <List isLoading={isLoading} onSearchTextChange={onSearchTextChange} searchText={searchText} isShowingDetail={true}>
      {data && (
        <List.Section title={data.word} subtitle={data.phonetic}>
          {data.meanings.map((meaning) => {

            const partOfSpeechInfo = getPartOfSpeechInfo(identifyPartOfSpeech(meaning.partOfSpeech));

            return (
              <List.Item
                icon={partOfSpeechInfo.emoji}
                title={partOfSpeechInfo.name}
                subtitle={meaning.definitions.map(item => item.definition).join('')}
                accessories={[{ tag: partOfSpeechInfo.description }, { text: '2333' }]}
              >
              </List.Item>
            );
          })}
        </List.Section>
      )}
    </List>
  );
}

export default Dictionary;

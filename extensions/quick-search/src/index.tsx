import { LaunchProps, List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { resolveText } from "./utils/reader";
import { useEffect, useMemo, useState } from "react";
import { analyzeText, isWord } from "./utils/analyzer";
import Dictionary from "./components/dictionary";

export default function Command(props: LaunchProps<{ arguments: Arguments.Index }>) {
  const { text } = props.arguments;
  const [searchText, setSearchText] = useState("");

  const {
    isLoading: isResolving,
    data: resolvedText,
  } = usePromise(resolveText, [text]);

  useEffect(() => {
    if (!isResolving && resolvedText) {
      console.log('resolvedText: ' + resolvedText);
      setSearchText(resolvedText);
    }
  }, [isResolving, resolvedText])

  const textAnalysis = useMemo(() => analyzeText(searchText), [searchText]);

  if (isResolving) {
    return <List isLoading={isResolving} searchBarPlaceholder="Resolving..." />;
  }

  console.log(textAnalysis, searchText);

  if (isWord(textAnalysis)) {
    return <Dictionary searchText={searchText} onSearchTextChange={setSearchText} />;
  }

  // if (isResolving) {
  return (
    <List isLoading={isResolving} onSearchTextChange={setSearchText} searchText={searchText}>
      <List.Item title={`w ${textAnalysis?.wordCount}`}></List.Item>
      <List.Item title={`s ${textAnalysis?.sentenceCount}`}></List.Item>
      <List.Item title={`p ${textAnalysis?.paragraphCount}`}></List.Item>
    </List>
  );
  // }

  // const { data, isLoading } = useAI(`Translate ${text} to Chinese.`);

}


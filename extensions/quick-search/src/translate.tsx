import { Detail, LaunchProps } from "@raycast/api";
import { useAI } from "@raycast/utils";

export default function Command(props: LaunchProps<{ arguments: Arguments.Translate }>) {
  const { text } = props.arguments;
  console.log(`title: ${text}`);

  const { data, isLoading } = useAI(`Translate ${text} to Chinese.`);

  return <Detail isLoading={isLoading} markdown={data} />;
}

import { useState, useEffect } from "react";
import { ActionPanel, Detail, List, Action, getSelectedText, Icon } from "@raycast/api";
import { lookupWordDefinition, formatDefinitions } from "./dictionary";

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

export default function DictionaryViewCommand(props: { arguments: { text?: string } }) {
  const [definitions, setDefinitions] = useState<DictionaryDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState(props.arguments?.text || "");

  useEffect(() => {
    if (searchText) {
      lookupDefinitions(searchText);
    } else {
      // Try to get selected text if no argument provided
      getSelectedText()
        .then((text) => {
          if (text.trim()) {
            setSearchText(text.trim());
            lookupDefinitions(text.trim());
          } else {
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [searchText]);

  const lookupDefinitions = async (word: string) => {
    if (!word.trim()) {
      setDefinitions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await lookupWordDefinition(word.trim());
      setDefinitions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch definitions");
      setDefinitions([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !searchText) {
    return <Detail markdown="## Dictionary Lookup\n\nEnter a word to search..." />;
  }

  if (error && !definitions.length) {
    return (
      <List searchText={searchText} onSearchTextChange={setSearchText} isLoading={loading}>
        <List.EmptyView title="Error" description={error} />
      </List>
    );
  }

  if (!definitions.length && !loading) {
    return (
      <List searchText={searchText} onSearchTextChange={setSearchText} isLoading={loading}>
        <List.EmptyView title="No definitions found" description="Try searching for another word" />
      </List>
    );
  }

  return (
    <List searchText={searchText} onSearchTextChange={setSearchText} isLoading={loading}>
      {definitions.map((definition, defIndex) => (
        <List.Section key={defIndex} title={definition.word}>
          {definition.meanings.map((meaning, meaningIndex) => (
            <List.Item
              key={`${defIndex}-${meaningIndex}`}
              title={`${meaning.partOfSpeech}`}
              subtitle={`${meaning.definitions[0]?.definition || "No definition"}`}
              icon={Icon.TextDocument}
              actions={
                <ActionPanel>
                  <Action.Push
                    title="View Full Definition"
                    target={
                      <Detail
                        markdown={formatDefinitions([definition])}
                        actions={
                          <ActionPanel>
                            <Action.CopyToClipboard content={formatDefinitions([definition])} />
                          </ActionPanel>
                        }
                      />
                    }
                  />
                  <Action.CopyToClipboard content={formatDefinitions([definition])} />
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
      ))}
    </List>
  );
}

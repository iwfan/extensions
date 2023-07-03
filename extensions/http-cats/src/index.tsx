import { useState } from "react";
import { ActionPanel, Action, Grid } from "@raycast/api";
import http from "http";

type Code = {
  code: string;
  description?: string;
};

export default function Command() {
  const [itemSize, setItemSize] = useState("5");
  const [isLoading, setIsLoading] = useState(true);

  const codeGroups = Object.entries(http.STATUS_CODES).reduce(
    (groups: { [firstDigit: string]: Code[] }, [code, description]) => {
      const group = groups[code[0]] || [];
      group.push({ code, description });
      groups[code[0]] = group;

      return groups;
    },
    {}
  );

  return (
    <Grid
      columns={Number(itemSize)}
      inset={Grid.Inset.Zero}
      fit={Grid.Fit.Fill}
      isLoading={isLoading}
      searchBarAccessory={
        <Grid.Dropdown
          tooltip="Grid Item Size"
          storeValue
          onChange={(newValue) => {
            setItemSize(newValue);
            setIsLoading(false);
          }}
        >
          <Grid.Dropdown.Item title="Large" value={"3"} />
          <Grid.Dropdown.Item title="Medium" value={"5"} />
          <Grid.Dropdown.Item title="Small" value={"8"} />
        </Grid.Dropdown>
      }
    >
      {!isLoading &&
        Object.entries(codeGroups).map(([firstDigit, codes]) => (
          <Grid.Section key={firstDigit} title={`${firstDigit}xx`} subtitle={"sdaw"} aspectRatio={"4/3"}>
            {codes.map(({ code, description }) => (
              <Grid.Item
                key={code}
                content={`https://http.cat/${code}.jpg`}
                title={code}
                subtitle={description}
                keywords={[description ?? '']}
                actions={
                  <ActionPanel>
                    <Action.CopyToClipboard content={code} />
                  </ActionPanel>
                }
              />
            ))}
          </Grid.Section>
        ))}
    </Grid>
  );
}

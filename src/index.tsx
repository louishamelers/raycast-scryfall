import { ActionPanel, Action, List } from "@raycast/api";
import { useFetch, Response } from "@raycast/utils";
import { useState } from "react";
import { URLSearchParams } from "node:url";
import CardView from "./card-view";

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const { data: cardNames, isLoading } = useFetch(
    "https://api.scryfall.com/cards/autocomplete?" +
      // send the search query to the API
      new URLSearchParams({ q: searchText.length === 0 ? "" : searchText }),
    {
      parseResponse: parseFetchResponse,
    }
  );

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search Scryfall..."
      throttle
      isShowingDetail
    >
      <List.Section title="Results" subtitle={cardNames?.length + ""}>
        {cardNames?.map((cardName) => (
          <CardView cardName={cardName} key={cardName}></CardView>
        ))}
      </List.Section>
    </List>
  );
}

/** Parse the response from the fetch query into something we can display */
async function parseFetchResponse(response: Response): Promise<string[]> {
  const json = (await response.json()) as
    | {
        object: string;
        total_values: number;
        data: string[];
      }
    | { code: string; message: string };

  if (!response.ok || "message" in json) {
    throw new Error("message" in json ? json.message : response.statusText);
  }

  return json.data;
}

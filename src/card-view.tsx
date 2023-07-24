import { Action, ActionPanel, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";

export default function CardView({ cardName }: { cardName: string }) {
  const { data: cardData, isLoading } = useFetch(
    "https://api.scryfall.com/cards/named?" +
      // send the search query to the API
      new URLSearchParams({ exact: cardName })
  );

  if (isLoading) {
    return (
      <>
        <List.Item
          title={cardName}
          detail={
            <List.Item.Detail
              isLoading={true}
              metadata={
                <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.Label title="Name" text={cardName} />
                </List.Item.Detail.Metadata>
              }
            />
          }
        />
      </>
    );
  }

  const unsafeCardData = cardData as any;

  return (
    <>
      <List.Item
        title={cardName}
        detail={
          <List.Item.Detail
            isLoading={isLoading}
            markdown={`<img src="${unsafeCardData?.image_uris?.border_crop}" alt="drawing" width="250"/>`}
            metadata={
              <List.Item.Detail.Metadata>
                <List.Item.Detail.Metadata.Label title="Name" text={cardName} />
                <List.Item.Detail.Metadata.Separator />
              </List.Item.Detail.Metadata>
            }
          />
        }
        actions={
          <ActionPanel>
            <ActionPanel.Section>
              <Action.OpenInBrowser title="Open in Browser" url={unsafeCardData?.scryfall_uri} />
            </ActionPanel.Section>
          </ActionPanel>
        }
      />
    </>
  );
}

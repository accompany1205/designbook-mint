import { Link, Button, Text, Stack } from "@shopify/polaris";
import DeleteNftButton from "../component/DeleteNftButton";
import ProductList from "../component/ProductList";

export function convertPerksKeys(str) {
  // converts perk keys from camelcase to normal title casing
  if (str.endsWith("Perk")) {
    str = str.slice(0, -4);
  }
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

function PerksList({ perksArray }) {
  return (
    <Stack vertical spacing="extraTight">
      {perksArray.map((perk) => {
        let individual_perk = Object.entries(perk)
          .map(([key, value]) => `${convertPerksKeys(key)}: ${value}`)
          .join(", ");

        return (
          <Text variant="bodyMd" key={individual_perk}>
            {individual_perk}
          </Text>
        );
      })}
    </Stack>
  );
}

// cleans up table data so that is can be used in the filter function
export default function parseTableData(tableData) {
  const parsedData = tableData.map((row) => ({
    datetime_created: row.datetime_created ? row.datetime_created : "",
    name: row.productName ? row.productName : "",
    size: row.size ? row.size : 0,
    sku: row.sku? row.sku : "",
    collection: row.collectionName ? row.collectionName : "",
    edition: row.editionNumber ? row.editionNumber : "",
    serial_number: row.serialNumber ? row.serialNumber : "",
    status: row.status ? row.status : "",
    nft_type: row.nft_type ? row.nft_type : "",
    perk: <PerksList perksArray={row.perks} />,
    redemption_link: (
      <Link
        url={row.redemptionLink ? row.redemptionLink : ""}
        external
        removeUnderline
      >
        <Button size="slim">Redemption Url</Button>
      </Link>
    ),
    delete: (
      <DeleteNftButton
        serial={row.editionNumber}
        hedera_token_id={row.hedera_token_id}
      />
    ),
    redemption_status: row.redemptionStatus ? row.redemptionStatus : "",
    specs: <ProductList specs={row.specs} />,
  }));
  return parsedData;
}

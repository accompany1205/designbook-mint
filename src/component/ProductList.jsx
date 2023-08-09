import { Text } from "@shopify/polaris";
import { Button, Modal, DescriptionList } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { convertPerksKeys } from "../utils/parseTableData";

const ProductList = ({ specs }) => {
  const {
    collectionName,
    productName,
    brand,
    editions,
    vrCompliant,
    nftType,
    price,
    description,
    perks,
    royalty,
    sku,
    serialNumber,
    releaseDate,
    rrp,
    size,
    colour,
    material,
    country,
    otherSpecs,
  } = specs;

  const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);

  const activator = (
    <Button size="slim" onClick={handleChange}>
      Product Details
    </Button>
  );

  return (
    <Modal
      activator={activator}
      open={active}
      onClose={handleChange}
      title={productName}
    >
      <Modal.Section>
        <DescriptionList
          items={[
            {
              term: "Collection Name",
              description: collectionName,
            },
            {
              term: "Product Name",
              description: productName,
            },
            {
              term: "Brand",
              description: brand,
            },
            {
              term: "Editions",
              description: editions,
            },
            {
              term: "VR Compliant?",
              description: vrCompliant ? "Yes" : "No",
            },
            {
              term: "NFT Type",
              description: nftType,
            },
            {
              term: "Price",
              description: price ? `$${Number(price).toFixed(2)}` : "",
            },
            {
              term: "Description",
              description: description,
            },
            {
              term: "Perks",
              description: perks.map((obj) =>
                Object.entries(obj).map(([key, value]) => (
                  <Text variant="bodyMd">
                    {convertPerksKeys(key)}: {value}
                  </Text>
                ))
              ),
            },
            {
              term: "Royalty",
              description: `${royalty}%`,
            },
            { term: "SKU", description: sku },
            {
              term: "Serial Number",
              description: serialNumber,
            },
            {
              term: "Release Date",
              description: releaseDate,
            },
            {
              term: "RRP",
              description: rrp ? `$${Number(rrp).toFixed(2)}` : "",
            },
            {
              term: "Size",
              description: size,
            },
            {
              term: "Colour",
              description: colour,
            },
            {
              term: "Material",
              description: material,
            },
            {
              term: "Country",
              description: country,
            },
            {
              term: "Other Specs",
              description: otherSpecs,
            },
          ]}
        />
      </Modal.Section>
    </Modal>
  );
};

export default ProductList;

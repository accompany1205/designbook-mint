import {
  ChoiceList,
  TextField,
  Card,
  Filters,
  DataTable,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { filterDataIncludes, filterDataStrict } from "../utils/filters";
import dayjs from "dayjs";

export default function ManageNftsDataTable({ table_data }) {
  // Filter Values
  const [name, setName] = useState(null);
  const [collection, setCollection] = useState(null);
  const [edition, setEdition] = useState(null);
  const [serial, setSerial] = useState(null);
  const [status, setStatus] = useState(null);
  const [sku, setSKU] = useState(null);
  const [perks, setPerks] = useState(null);
  const [redemptionStatus, setRedemptionStatus] = useState(null);
  const [nftType, setNftType] = useState(null);
  // Filtered Table Data
  const [filteredTable, setFilteredTable] = useState(table_data);

  //  useEffect function runs each time the filter values change
  useEffect(() => {
    let results = table_data;
    results = filterDataIncludes(results, "name", name);
    results = filterDataIncludes(results, "sku", sku);
    results = filterDataIncludes(results, "collection", collection);
    results = filterDataIncludes(results, "edition", edition);
    results = filterDataIncludes(results, "serial_number", serial);
    results = filterDataIncludes(results, "perk", perks);
    results = filterDataStrict(results, "status", status);
    results = filterDataStrict(results, "redemption_status", redemptionStatus);
    results = filterDataStrict(results, "nft_type", nftType);
    // update table to show only filtered data
    setFilteredTable(results);
  }, [
    table_data,
    name,
    sku,
    collection,
    edition,
    serial,
    perks,
    status,
    redemptionStatus,
    nftType,
  ]);

  //   functions to handle changes to filter values
  const handleNameChange = useCallback((value) => setName(value), []);

  const handleCollectionChange = useCallback((value) => {
    setCollection(value);
  }, []);
  const handleEditionChange = useCallback((value) => {
    setEdition(value);
  }, []);
  const handleSerialChange = useCallback((value) => {
    setSerial(value);
  }, []);
  const handlePerksChange = useCallback((value) => {
    setPerks(value);
  }, []);
  const handleStatusChange = useCallback((value) => setStatus(value[0]), []);
  const handleSkuChange = useCallback((value) => setSKU(value), []);
  const handleNftTypeChange = useCallback((value) => setNftType(value[0]), []);
  const handleRedemptionStatusChange = useCallback((value) => {
    setRedemptionStatus(value[0]);
  }, []);


  //   functions to handle removal of filter values
  const handleNameRemove = useCallback(() => setName(null), []);
  const handleCollectionRemove = useCallback(() => setCollection(null), []);
  const handleSkuRemove = useCallback(() => setSKU(null), []);
  const handleEditionRemove = useCallback(() => setEdition(null), []);
  const handleSerialRemove = useCallback(() => setSerial(null), []);
  const handlePerksRemove = useCallback(() => setPerks(null), []);
  const handleStatusRemove = useCallback(() => setStatus(null), []);
  const handleNftTypeRemove = useCallback(() => setNftType(null), []);
  const handleRedemptionStatusRemove = useCallback(
    () => setRedemptionStatus(null),
    []
  );
  // const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  //   function to clear all filter values when button is clicked
  const handleFiltersClearAll = useCallback(() => {
    handleNameRemove();
    handleCollectionRemove();
    handleSkuRemove();
    handleEditionRemove();
    handleSerialRemove();
    handlePerksRemove();
    handleStatusRemove();
    handleRedemptionStatusRemove();
    // handleTaggedWithRemove();
    handleNftTypeRemove();
  }, [
    handleNameRemove,
    handleCollectionRemove,
    handleSkuRemove,
    handleEditionRemove,
    handleSerialRemove,
    handlePerksRemove,
    handleStatusRemove,
    handleRedemptionStatusRemove,
    // handleTaggedWithRemove,
    handleNftTypeRemove,
  ]);

  //   list of filters which will display when 'More filters' button is clicked
  const filters = [
    {
      key: "status",
      label: "Status",
      filter: (
        <ChoiceList
          title="Status"
          titleHidden
          choices={[
            { label: "Listed", value: "listed" },
            { label: "Sold", value: "sold" },
          ]}
          selected={status || []}
          onChange={handleStatusChange}
        />
      ),
      shortcut: true,
    },
    {
      key: "sku",
      label: "SKU",
      filter: (
        <TextField
          label="SKU"
          value={sku}
          onChange={handleSkuChange}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
    },
    {
      key: "collection",
      label: "Collection",
      filter: (
        <TextField
          label="Collection"
          value={collection}
          onChange={handleCollectionChange}
          autoComplete="off"
          labelHidden
        />
      ),
    },
    {
      key: "edition",
      label: "Edition",
      filter: (
        <TextField
          label="Edition"
          value={edition}
          onChange={handleEditionChange}
          autoComplete="off"
          labelHidden
        />
      ),
    },
    {
      key: "serial",
      label: "Serial",
      filter: (
        <TextField
          label="Serial"
          value={serial}
          onChange={handleSerialChange}
          autoComplete="off"
          labelHidden
        />
      ),
    },
    {
      key: "perks",
      label: "Perks List",
      filter: (
        <TextField
          label="Perks List"
          value={perks}
          onChange={handlePerksChange}
          autoComplete="off"
          labelHidden
        />
      ),
    },
    {
      key: "redemptionStatus",
      label: "Redemption Status",
      filter: (
        <ChoiceList
          title="Redemption Status"
          titleHidden
          choices={[
            { label: "Redeemed", value: "redeemed" },
            { label: "Non Redeemed", value: "non redeemed" },
            { label: "Returned", value: "returned" },
          ]}
          selected={redemptionStatus || []}
          onChange={handleRedemptionStatusChange}
        />
      ),
    },
    {
      key: "nftType",
      label: "NFT Type",
      filter: (
        <ChoiceList
          title="NFT Type"
          titleHidden
          choices={[
            { label: "Digital", value: "digital" },
            { label: "Physical", value: "physical" },
          ]}
          selected={nftType || []}
          onChange={handleNftTypeChange}
        />
      ),
    },
  ];

  //   list of applied filters will show up as a UI element so user can see the filtered values
  const appliedFilters = [];
  if (!isEmpty(collection)) {
    const key = "collection";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, collection),
      onRemove: handleCollectionRemove,
    });
  }
  if (!isEmpty(sku)) {
    const key = "sku";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, sku),
      onRemove: handleSkuRemove,
    });
  }
  if (!isEmpty(edition)) {
    const key = "edition";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, edition),
      onRemove: handleEditionRemove,
    });
  }
  if (!isEmpty(serial)) {
    const key = "serial";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, serial),
      onRemove: handleSerialRemove,
    });
  }
  if (!isEmpty(status)) {
    const key = "status";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, status),
      onRemove: handleStatusRemove,
    });
  }
  if (!isEmpty(perks)) {
    const key = "perks";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, perks),
      onRemove: handlePerksRemove,
    });
  }
  if (!isEmpty(redemptionStatus)) {
    const key = "redemption status";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, redemptionStatus),
      onRemove: handleRedemptionStatusRemove,
    });
  }
  if (!isEmpty(nftType)) {
    const key = "nft type";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, nftType),
      onRemove: handleNftTypeRemove,
    });
  }

  return (
    <>
      <Card.Section>
        <Filters
          queryValue={name}
          filters={filters}
          appliedFilters={appliedFilters}
          onQueryChange={handleNameChange}
          onQueryClear={handleNameRemove}
          onClearAll={handleFiltersClearAll}
        />
      </Card.Section>
      <DataTable
        columnContentTypes={[
          "text",
          "text",
          "text",
          "text",
          "text",
          "numeric",
          "numeric",
          "text",
          "text",
          "text",
          "text",
          "text",
          "text",
          "text",
        ]}
        headings={[
          "Created At",
          "Product",
          "Size",
          "SKU",
          "Collection",
          "Edition",
          "Serial",
          "Status",
          "Perks List",
          "Redemption Link",
          "Redemption Status",
          "NFT Type",
          "Delete NFT",
          "More Details",
        ]}
        rows={filteredTable.map((e) => [
          dayjs(e.datetime_created).toString(),
          e.name,
          e.size,
          e.sku,
          e.collection,
          e.edition,
          e.serial_number,
          e.status,
          e.perk,
          e.redemption_link,
          e.redemption_status,
          e.nft_type,
          e.delete,
          e.specs,
        ])}
      />
    </>
  );

  //   function to label the filtered values which are displayed
  function disambiguateLabel(key, value) {
    switch (key) {
      case "taggedWith":
        return `Tagged with ${value}`;
      case "availability":
        return value.map((val) => `Available on ${val}`).join(", ");
      default:
        return `${key}: ${value}`;
    }
  }

  //   function to remove filter
  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
}

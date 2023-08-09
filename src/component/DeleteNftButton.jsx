import React, { useState } from "react";
import { Button } from "@shopify/polaris";
// import { burnNFT } from "../utils/apiCalls";

export default function DeleteNftButton({ serial, hedera_token_id }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      // Make API call to delete resource with the given id
      // await burnNFT({ serial, hedera_token_id });
      setIsDeleted(true);
      //   onDelete();
    } catch (error) {
      // Handle error
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isDeleted) {
    return (
      <Button destructive disabled size="slim">
        Deleted
      </Button>
    );
  }
  if (isLoading) {
    return (
      <Button loading size="slim">
        Delete
      </Button>
    );
  }

  return (
    <Button destructive onClick={handleDelete} disabled={isLoading} size="slim">
      Delete
    </Button>
  );
}

import { NFTStorage } from "nft.storage";

const NFT_STORAGE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk4QzEzRUJiMDE2NmYyNjI4RjFhQzdhNGMwRTQ5N0VGOThhZDA2YTQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2ODg2ODc2NzcwNiwibmFtZSI6IkRlbW9fQVBJIn0.LCamMt7cXohyHnUz8DqbJqvtJY51SgT83wsq14PN1K8";

export default async function uploadNft(data) {
  const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });

  // call client.store, passing in the image & metadata
  const result = await nftstorage.store(data);

  return result;
}

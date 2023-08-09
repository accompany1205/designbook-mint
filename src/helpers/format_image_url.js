export default function formatImageUrl(ipfsUrl) {
  // Example Input: //bafybeigkouxkjvlifvueq3rlqh7iwvem5zdf7ip34yack7xzm6cthj4llu/5898d60d-fe91-4203-ad45-79d25f9c0a11_01-ajdior.jpg

  // We need to convert the input to https://ipfs.io/ipfs/bafybeigkouxkjvlifvueq3rlqh7iwvem5zdf7ip34yack7xzm6cthj4llu/5898d60d-fe91-4203-ad45-79d25f9c0a11_01-ajdior.jpg

  // Step 1: remove `/` from front of string
  let imageUrl = ipfsUrl.substring(1);

  // Step 2:  Add ipfs prefix
  imageUrl = `https://ipfs.io/ipfs${imageUrl}`;

  return imageUrl;
}

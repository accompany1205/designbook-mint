import { Page, Card } from "@shopify/polaris";
import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function ImportNFT() {
  const [tokenId, setTokenId] = useState("");
  const [nfts, setNfts] = useState("");

  useEffect(() => {
  }, []);

  const handleClickImportBtn = async () => {
    const res = await axios.get(`https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/${tokenId}/nfts`);
    if (res && res.data && res.data.nfts) {
      // setNfts(() => res.data.nfts);
      let nfts = [];
      for (let nft of res.data.nfts) {
        let newNft = {};
        for (let key in nft) {
          if (key === 'account_id' || key === 'serial_number') {
            newNft[key] = nft[key];
          }
          if (key === "metadata") {
            let str = atob(nft[key]);
            str = str.replace("ipfs://", "ipfs/");
            console.log({ str });
            const res = await axios.get(`https://ipfs.io/${str}`);
            console.log(res);
            let imgSrc = "";
            if (res.data.image) {
              let ipfsImg = res.data.image.replace("ipfs://", "ipfs/");
              imgSrc = "https://ipfs.io/" + ipfsImg;
            }
            newNft = { ...newNft, ...res.data, image: imgSrc }
          }
        }
        nfts.push(newNft);

      }
      console.log({ nfts });
      setNfts(() => nfts)
    }
  }
  return (
    <Container className="pt-5">
      <h2> Import NFTs </h2>
      <div className="mb-3 mt-3">
        <label htmlFor="tokenId" className="form-label">TokenID of NFT</label>
        <input
          type="text"
          className="form-control"
          id="tokenId"
          name="tokenId"
          value={tokenId}
          placeholder="Type in the tokenId of target NFT"
          onChange={useCallback(
            (e) => setTokenId(e.target.value),
            []
          )}
        />
        <button className="btn btn-secondary btn-md mt-3" onClick={() => handleClickImportBtn()}> Import NFT</button>
      </div>

      <div className="row">
        {nfts.length > 0 &&
          <h4>Number: {nfts.length}</h4>
        }
        {nfts.length > 0 && (
          <table className="table table-hover table-bordered">
            <thead>
              <tr>
                {['image', 'name', 'account_id', 'serial_number'].map((key, index) => {
                  if (Object.keys(nfts[0]).indexOf(key) >= 0)
                    return <th key={index}>{key.toLocaleUpperCase()}</th>
                })}
              </tr>
            </thead>
            <tbody>
              {nfts.map((nft, index) => (
                <>
                  <tr
                    key={index}
                    data-bs-toggle="collapse"
                    data-bs-target={`#multiCollapseExample${index}`}
                  >
                    {['image', 'name', 'account_id', 'serial_number'].map((key, _index) => {
                      if (Object.keys(nft).indexOf(key) >= 0) {
                        if (key === "image") {
                          return (
                            <td>
                              <img src={nft[key]} alt="nft image" style={{ width: "5%", borderRadius: "10%" }} />
                            </td>
                          )
                        } else {
                          return (
                            <td className="text-center">{nft[key]}</td>
                          )
                        }
                      }
                    })}
                  </tr>
                  <tr 
                    className={`collapse`} 
                    id={`multiCollapseExample${index}`}>
                    <td colSpan={4}>
                      <div className="card p-3 mb-3">
                        {Object.keys(nft).map((key, _index) => {
                          // if(key === "image") console.log(typeof nft[key], nft);
                          if (typeof nft[key] !== 'object' && typeof nft[key] !== 'array') {
                            if (key === 'description') {
                              return <p key={_index} className="overflow-hidden"><span>{key}: </span><p>{nft[key]}</p></p>
                            } else if (key === "image") {
                              return <p key={_index} className="d-flex justify-content-between align-items-center overflow-hidden"><span>{key}: </span><img src={nft[key]} alt="nft image" className="w-25" /></p>
                            } else {
                              return <p key={_index} className="d-flex justify-content-between align-items-center overflow-hidden"><span>{key}: </span><span>{nft[key]}</span></p>
                            }

                          }
                        })}
                      </div>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>

        )}
        {/* {nfts.length > 0 && nfts.map((nft, index) => (
          <div key={index} className="col-lg-6 col-md-6 col-sm-12">
            <div className="card p-3 mb-3">
              {Object.keys(nft).map((key, _index) => {
                // if(key === "image") console.log(typeof nft[key], nft);
                if (typeof nft[key] !== 'object' && typeof nft[key] !== 'array') {
                  if (key === 'description') {
                    return <p key={_index} className="overflow-hidden"><span>{key}: </span><p>{nft[key]}</p></p>
                  } else if (key === "image") {
                    return <p key={_index} className="d-flex justify-content-between align-items-center overflow-hidden"><span>{key}: </span><img src={nft[key]} alt="nft image" className="w-25" /></p>
                  } else {
                    return <p key={_index} className="d-flex justify-content-between align-items-center overflow-hidden"><span>{key}: </span><span>{nft[key]}</span></p>
                  }

                }
              })}
            </div>
          </div>
        ))} */}
      </div>

    </Container>
  );
}

import { Page, Card } from "@shopify/polaris";
import { Link } from "react-router-dom";
import { Container, Button, Modal } from "react-bootstrap";
import { useEffect, useState, useCallback, useContext } from "react";
import { AuthContext, axiosInstance } from "../contexts/AuthContext";
import axios from "axios";
import { ipfsUtil } from "../utils/filters";

export default function ImportNFT() {

  const { user } = useContext(AuthContext);


  const [tokenId, setTokenId] = useState("");
  const [nfts, setNfts] = useState([]);
  const [selectedNfts, setSelectedNfts] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);

  const [modalShow, setShow] = useState(false);

  const [poolName, setPoolName] = useState("");
  const [color, setColor] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState(0);
  const [price, setPrice] = useState(0);

  useEffect(() => {
  }, []);

  const handleClickImportBtn = async () => {
    try{
      if(tokenId.length === 0){
        return;
      }
      const res = await axios.get(`${process.env.REACT_APP_HEDERA_API}/api/v1/tokens/${tokenId}/nfts`);
      if (res && res.data && res.data.nfts) {
        // setNfts(() => res.data.nfts);
        let _nfts = [];
        let itr = 0;
        for (let nft of res.data.nfts) {
          let newNft = {};
          for (let key in nft) {
            if (key === 'account_id' || key === 'serial_number') {
              newNft[key] = nft[key];
            }
            if (key === "metadata") {
              let str = atob(nft[key]);
              str = str.replace("ipfs://", "");
              console.log({ str });
              const res = await axios.get(`https://ipfs.io/ipfs/${str}`);
              console.log(res);
  
              newNft = { ...newNft, ...res.data, _ipfs: `ipfs://${str}`, checked: false }
            }
          }
          _nfts.push({ ...newNft, id: itr });
          itr++;
  
        }
        console.log({ _nfts });
        setNfts(() => _nfts)
      }
    }catch(e){
      console.log(e);
    }
  }

  const handleChangeCheckbox = (e, nft, index) => {
    const isChecked = e.target.checked;
    setNfts(_nfts => _nfts.map((_nft, _index) => {
      if (_nft.id === nft.id) {
        return { ...nft, checked: !nft.checked }
      } else {
        return _nft;
      }
    }))
    if (isChecked) {
      setSelectedNfts((prevSelectedNfts) => [...prevSelectedNfts, nft]);
      setCheckedAll(selectedNfts.length == nfts.length - 1);
    } else {
      setSelectedNfts((prevSelectedNfts) =>
        prevSelectedNfts.filter((selectedNft) => selectedNft.id !== nft.id)
      );
      setCheckedAll(() => false);
    }
  }
  const handleChangeCheckboxAll = (e) => {
    // const newCheckedAll = e.target.checked;
    const newSelectedNfts = !checkedAll ? [...nfts].map(nft => ({ ...nft, checked: true })) : [...nfts].map(nft => ({ ...nft, checked: false }));

    setSelectedNfts(() => !checkedAll ? [...nfts] : []);
    setNfts(() => newSelectedNfts);
    setCheckedAll(() => !checkedAll);
  }

  const handleClose = () => {
    setShow(() => false);
  };
  const handleSave = () => {
    console.log(user);
    console.log(selectedNfts);
    const res = axiosInstance.post('/users/api/outsite-mint', {
      poolName, brand, sku, color, size, details: selectedNfts, tokenId: selectedNfts[0].account_id, partnerId: user?.id || 0, price
    })
    console.log({ res });
    setShow(() => false);
  };
  const handleShow = () => {
    setShow(true);
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
        <div className="d-flex align-items-center justify-content-between">
          <button className="btn btn-secondary btn-md mt-3" onClick={() => handleClickImportBtn()}> Import NFT</button>
          {selectedNfts.length > 0 &&
            <button className="btn btn-primary btn-md mt-3" onClick={() => handleShow()}> Add to DesignBook</button>
          }
        </div>
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
                <th className="text-center">
                  <input type="checkbox" className="form-check-input" checked={checkedAll} onClick={(e) => handleChangeCheckboxAll(e)} />
                </th>
              </tr>
            </thead>
            <tbody>
              {nfts.map((nft, index) => (
                <>
                  <tr
                    key={index}
                  >
                    {['image', 'name', 'account_id', 'serial_number'].map((key, _index) => {
                      if (Object.keys(nft).indexOf(key) >= 0) {
                        if (key === "image") {
                          return (
                            <td
                              key={_index}
                              data-bs-toggle="collapse"
                              data-bs-target={`#multiCollapseExample${index}`}
                            >
                              <img src={ipfsUtil(nft[key])} alt="nft image" style={{ width: "5%", borderRadius: "10%" }} />
                            </td>
                          )
                        } else {
                          return (
                            <td
                              key={_index}
                              className="text-center"
                              data-bs-toggle="collapse"
                              data-bs-target={`#multiCollapseExample${index}`}
                            >{nft[key]}</td>
                          )
                        }
                      }
                    })}
                    <td className="text-center">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        onChange={(e) => handleChangeCheckbox(e, nft, index)}
                        checked={nft.checked}
                      />
                    </td>
                  </tr>
                  <tr
                    className={`collapse`}
                    id={`multiCollapseExample${index}`}>
                    <td colSpan={5}>
                      <div className="card p-3 mb-3">
                        {Object.keys(nft).map((key, _index) => {
                          // if(key === "image") console.log(typeof nft[key], nft);
                          if (typeof nft[key] !== 'object' && typeof nft[key] !== 'array') {
                            if (key === 'description') {
                              return <div key={_index} className="overflow-hidden"><span>{key}: </span><p>{nft[key]}</p></div>
                            } else if (key === "image") {
                              return <p key={_index} className="d-flex justify-content-between align-items-center overflow-hidden"><span>{key}: </span><img src={ipfsUtil(nft[key])} alt="nft image" className="w-25" /></p>
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
      <Modal show={modalShow} onHide={handleClose} size="lg" aria-labelledby="example-custom-modal-styling-title" centered>
        <Modal.Header closeButton>
          <div className="d-flex align-items-end justify-content-between fw-bold w-auto">
            <h3>
              Move to DesignBook
            </h3>
            <h5>Total({selectedNfts.length})</h5>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="mb-3 mt-3">
              <label htmlFor="poolName" className="form-label">Pool Name</label>
              <input
                type="text"
                className="form-control"
                id="poolName"
                name="poolName"
                value={poolName}
                placeholder="Type in the Pool Name"
                onChange={useCallback(
                  (e) => setPoolName(e.target.value),
                  []
                )}
              />
            </div>
            <div className="mb-3 mt-3">
              <label htmlFor="brand" className="form-label">Brand</label>
              <input
                type="text"
                className="form-control"
                id="brand"
                name="brand"
                value={brand}
                placeholder="Type in the Brand"
                onChange={useCallback(
                  (e) => setBrand(e.target.value),
                  []
                )}
              />
            </div>
            <div className="mb-3 mt-3">
              <label htmlFor="sku" className="form-label">SKU</label>
              <input
                type="text"
                className="form-control"
                id="sku"
                name="sku"
                value={sku}
                placeholder="Type in the SKU"
                onChange={useCallback(
                  (e) => setSku(e.target.value),
                  []
                )}
              />
            </div>
            <div className="mb-3 mt-3">
              <label htmlFor="color" className="form-label">Color</label>
              <input
                type="text"
                className="form-control"
                id="color"
                name="color"
                value={color}
                placeholder="Type in the Color"
                onChange={useCallback(
                  (e) => setColor(e.target.value),
                  []
                )}
              />
            </div>
            <div className="mb-3 mt-3">
              <label htmlFor="size" className="form-label">Size</label>
              <input
                type="text"
                className="form-control"
                id="size"
                name="size"
                value={size}
                placeholder="Type in the Size"
                onChange={useCallback(
                  (e) => setSize(e.target.value),
                  []
                )}
              />
            </div>
            <div className="mb-3 mt-3">
              <label htmlFor="price" className="form-label">Price</label>
              <input
                type="text"
                className="form-control"
                id="price"
                name="price"
                value={price}
                placeholder="Type in the Price"
                onChange={useCallback(
                  (e) => setPrice(e.target.value),
                  []
                )}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

    </Container >
  );
}

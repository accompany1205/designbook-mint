import { Link } from "react-router-dom";
import { Container, Dropdown, DropdownButton } from "react-bootstrap";
import { useEffect, useState } from "react";
import { axiosInstance } from "../contexts/AuthContext";
import { Modal } from "react-bootstrap";
import { MultiSelect } from "primereact/multiselect";
import { tab } from "@testing-library/user-event/dist/tab";

export default function ManageNFTs() {
  const [tableData, setTableData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [selectedProductData, setSelectedProductData] = useState([]);
  const [collectionData, setCollectionData] = useState([]);
  const [selectedCollectionData, setSelectedCollectionData] = useState([]);
  const [skuData, setSkuData] = useState([]);
  const [selectedSkuData, setSelectedSkuData] = useState([]);
  const [ptableData, setPtableData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [activeNft, setActiveNft] = useState(null);
  const [isDown, setDown] = useState(false);
  const [rowIdArr, setRowIdArr] = useState([]);

  const [selectedCities, setSelectedCities] = useState(null);
  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  useEffect(() => {
    getNftData();
  }, []);

  const getNftData = async () => {
    try {
      const res = await axiosInstance.get("/users/api/v1/company/managed/nft");
      console.log({ res });
      if (res && res.data && res.data.success) {
        setTableData(() => res.data.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (isDown) {
      setPtableData(
        tableData.sort((a, b) =>
          a.datetime_created.localeCompare(b.datetime_created)
        )
      );
    } else {
      setPtableData(
        tableData.sort((a, b) =>
          b.datetime_created.localeCompare(a.datetime_created)
        )
      );
    }
    const _productData = [];
    const _collectionData = [];
    const _skuData = [];
    for (let item of tableData) {
      if (_productData.indexOf(item.productName) < 0) {
        _productData.push(item.productName);
      }
      if (_collectionData.indexOf(item.collectionName) < 0) {
        _collectionData.push(item.collectionName);
      }
      if (_skuData.indexOf(item.sku) < 0) {
        _skuData.push(item.sku);
      }
    }
    setProductData(_productData);
    setCollectionData(_collectionData);
    setSkuData(_skuData);
    setSelectedProductData([]);
    setSelectedCollectionData([]);
    setSelectedSkuData([]);
  }, [tableData]);

  useEffect(() => {
    let data = [...tableData];
    if (selectedProductData.length > 0) {
      data = data.filter(
        (item) => selectedProductData.indexOf(item.productName) >= 0
      );
    }
    if (selectedCollectionData.length > 0) {
      data = data.filter(
        (item) => selectedCollectionData.indexOf(item.collectionName) >= 0
      );
    }
    if (selectedSkuData.length > 0) {
      data = data.filter((item) => selectedSkuData.indexOf(item.sku) >= 0);
    }
    setPtableData(data);
  }, [selectedProductData, selectedCollectionData, selectedSkuData]);
  const handleClick = (direction) => {
    if (direction) {
      setPtableData(
        ptableData.sort((a, b) =>
          a.datetime_created.localeCompare(b.datetime_created)
        )
      );
    } else {
      setPtableData(
        ptableData.sort((a, b) =>
          b.datetime_created.localeCompare(a.datetime_created)
        )
      );
    }
    setDown(direction);
  };
  const handleClickNFTDelete = async () => {
    try {
      for (let id of rowIdArr) {
        const { editionNumber, hedera_token_id } = tableData[id];
        const res = await axiosInstance.post(`/users/api/v1/burn`, {
          editionNumber,
          hedera_token_id,
        });
        if (res && res.data && res.data.success) {
          setTableData((_tableData) =>
            _tableData.filter(
              (row, index) =>
                row.hedera_token_id !== hedera_token_id ||
                row.editionNumber !== editionNumber
            )
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const closeModal = () => {
    setModalShow(false);
  };

  const handleNftClick = (nft) => {
    setActiveNft(() => nft);
    setModalShow(true);
  };

  const handleClickRowId = (rowId) => {
    console.log(rowIdArr, isDown);
    if (rowIdArr.indexOf(rowId) < 0) {
      setRowIdArr((_arr) => [..._arr, rowId]);
    } else {
      setRowIdArr((_arr) => _arr.filter((_item) => _item !== rowId));
    }
  };
  return (
    <Container className="pt-5" style={{ maxWidth: "90%" }}>
      <h2 className="mb-5 text-center fw-bold"> Manage NFT </h2>
      <div className="d-flex justify-content-between align-items-stretch mt-3 mb-3">
        <div className="d-flex justify-content-start align-items-stretch">
          <button
            type="button"
            style={{
              border: "none",
              borderRadius: "5px",
              padding: "5px 1em",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <g clipPath="url(#clip0_567_742)">
                <path
                  d="M5.44444 11.6663H8.55556V10.1108H5.44444V11.6663ZM0 2.33301V3.88856H14V2.33301H0ZM2.33333 7.77745H11.6667V6.2219H2.33333V7.77745Z"
                  fill="#959595"
                />
              </g>
              <defs>
                <clipPath id="clip0_567_742">
                  <rect width="14" height="14" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span
              style={{
                fontSize: "1em",
                fontWeight: "bold",
                color: "#1D1E1F",
                marginLeft: "0.5em",
              }}
            >
              Filters
            </span>
          </button>
          <MultiSelect
            value={selectedProductData}
            onChange={(e) => setSelectedProductData(e.value)}
            options={productData}
            // optionLabel="name"
            display="chip"
            placeholder="Select products"
            maxSelectedLabels={2}
            className="w-full md:w-20rem"
          />
          <MultiSelect
            value={selectedCollectionData}
            onChange={(e) => setSelectedCollectionData(e.value)}
            options={collectionData}
            // optionLabel="name"
            display="chip"
            placeholder="Select collections"
            maxSelectedLabels={2}
            className="w-full md:w-20rem"
          />
          <MultiSelect
            value={selectedSkuData}
            onChange={(e) => setSelectedSkuData(e.value)}
            options={skuData}
            // optionLabel="name"
            display="chip"
            placeholder="Select skus"
            maxSelectedLabels={2}
            className="w-full md:w-20rem"
          />
        </div>
        <div className="d-flex align-items-stretch">
          <button
            type="button"
            style={{
              border: "none",
              borderRadius: "5px",
              padding: "5px 1em",
            }}
          >
            <span
              style={{
                fontSize: "1em",
                fontWeight: "bold",
                color: "#1D1E1F",
                marginLeft: "0.5em",
              }}
            >
              Sort By
            </span>
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-end">
        <div className="d-flex justify-content-between align-items=center">
          <button
            type="button"
            style={{
              border: "none",
              borderRadius: "5px",
              padding: "0.2em 0.5em",
              background: isDown ? "black" : "#f0f0f0",
              marginRight: "2em",
            }}
            onClick={() => handleClick(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.78654 0.21875L0.0429688 4.79298H1.02622L1.37493 3.87813H3.33594L3.64675 4.79298H4.6172L3.06317 0.21875H1.78654ZM3.02514 2.96329L2.41179 1.15794L1.72364 2.96329H3.02514Z"
                fill={isDown ? "#F5F5F5" : "#1D1E1F"}
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.38408 9.36728H0.5625V8.43164H4.72089V9.34753L1.88593 12.1742H4.72089V13.1098H0.5625V12.1806L3.38408 9.36728Z"
                fill={isDown ? "#F5F5F5" : "#1D1E1F"}
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.1772 11.9745L10.1772 0.21875L11.1072 0.21875L11.1072 11.9745L13.1034 10.0021L13.761 10.6518L10.6422 13.7335L7.52344 10.6518L8.18104 10.0021L10.1772 11.9745Z"
                fill={isDown ? "#F5F5F5" : "#1D1E1F"}
              />
            </svg>
          </button>
          <button
            type="button"
            style={{
              border: "none",
              borderRadius: "5px",
              padding: "0.2em 0.5em",
              background: !isDown ? "black" : "#f0f0f0",
            }}
            onClick={() => handleClick(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.26757 0.946289L0.484375 5.52052H1.48997L1.84661 4.60567H3.85219L4.17006 5.52052H5.16256L3.57321 0.946289H2.26757ZM3.53432 3.69083L2.90703 1.88547L2.20325 3.69083H3.53432Z"
                fill={!isDown ? "#F5F5F5" : "#1D1E1F"}
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.82548 10.0938H1.00391V9.1582H5.1623V10.0741L2.32734 12.9008H5.1623V13.8364H1.00391V12.9072L3.82548 10.0938Z"
                fill={!isDown ? "#F5F5F5" : "#1D1E1F"}
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.6014 1.99074L11.6014 13.8369L10.6869 13.8369L10.6869 1.99074L8.72396 3.97834L8.07731 3.32356L11.1441 0.218182L14.2109 3.32356L13.5643 3.97834L11.6014 1.99074Z"
                fill={!isDown ? "#F5F5F5" : "#1D1E1F"}
              />
            </svg>
          </button>
        </div>
      </div>
      <table className="table mt-4">
        <thead>
          <tr>
            {/* <th>No</th> */}
            <th style={{ border: "none" }}></th>

            <th>Collection</th>
            <th>Product</th>
            <th>SKU</th>
            <th>Size</th>
            <th>Ed. Number</th>
            <th>Date</th>
            <th>Serial</th>
            <th>Type</th>
            <th>Perks List</th>
            <th>More Details</th>
            <th>Status</th>
            <th style={{ textAlign: "right" }}>Redemption Link</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td colSpan={13}></td>
          </tr>
          {ptableData.length > 0 &&
            ptableData.map((row, index) => (
              <tr key={index}>
                {/* <td>{index + 1}</td> */}
                <td>
                  <div
                    style={{
                      background:
                        rowIdArr.indexOf(row.id) < 0 ? "transparent" : "black",
                      width: 24,
                      height: 24,
                      borderRadius: 5,
                      border: "1px solid black",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClickRowId(row.id)}
                  />
                </td>
                <td>{row.collectionName}</td>

                <td>{row.productName}</td>
                <td>{row.sku}</td>
                <td>{row.size}</td>
                <td>{row.editionNumber}</td>
                <td>{row.datetime_created}</td>

                <td>{row.serialNumber}</td>
                <td>{row.nft_type}</td>
                <td>{}</td>
                <td>
                  <div
                    className="btn btn-light btn-sm"
                    style={{ border: "0.5px solid gray" }}
                    onClick={(e) => handleNftClick(row)}
                  >
                    Product Details
                  </div>
                </td>
                <td>{row.redemptionStatus}</td>

                <td className="d-flex justify-content-end">
                  <Link to={row.redemptionLink ? row.redemptionLink : ""}>
                    <div
                      className="btn btn-light btn-sm"
                      style={{ border: "0.5px solid gray" }}
                    >
                      Redemption Url
                    </div>
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <button
        style={{
          border: "1px solid #FF1744",
          padding: "0.6em 6em",
          fontWeight: "bold",
          marginTop: "1em",
          borderRadius: 5,
          color: "#FF1744",
          background: "transparent",
          marginLeft: "0.5em",
        }}
        onClick={() => handleClickNFTDelete()}
      >
        DELETE NFT
      </button>

      <Modal show={modalShow} onHide={closeModal} size="lg">
        <Modal.Header>
          <Modal.Title>{activeNft ? activeNft.productName : ""}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="manage-nft-table">
            <tbody>
              <tr>
                <td className="p-2">Collection Name</td>
                <td>{activeNft ? activeNft.collectionName : ""}</td>
              </tr>
              <tr>
                <td className="p-2">Product Name</td>
                <td>{activeNft ? activeNft.productName : ""}</td>
              </tr>
              <tr>
                <td className="p-2">Description</td>
                <td>{activeNft ? activeNft.description : ""}</td>
              </tr>
              <tr>
                <td className="p-2">Size</td>
                <td>{activeNft ? activeNft.size : ""}</td>
              </tr>
              <tr>
                <td className="p-2">Serial Number</td>
                <td>{activeNft ? activeNft.serialNumber : ""}</td>
              </tr>
              <tr>
                <td className="p-2">Redemption Link</td>
                <td>{activeNft ? activeNft.redemptionLink : ""}</td>
              </tr>
              <tr>
                <td className="p-2">Redemption Status</td>
                <td>{activeNft ? activeNft.redemptionStatus : ""}</td>
              </tr>
              <tr>
                <td className="p-2">Hedera Token Id</td>
                <td>{activeNft ? activeNft.hedera_token_id : ""}</td>
              </tr>
              <tr>
                <td className="p-2">DateTime Created</td>
                <td>{activeNft ? activeNft.datetime_created : ""}</td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

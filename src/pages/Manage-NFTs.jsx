import { Link } from "react-router-dom";
import { Container} from "react-bootstrap";
import { useEffect, useState } from "react";
import { axiosInstance } from "../contexts/AuthContext";
import { Modal } from "react-bootstrap";

export default function ManageNFTs() {
  const [tableData, setTableData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [activeNft, setActiveNft] = useState(null);

  useEffect(() => {
    getNftData();
  }, []);

  const getNftData = async () => {
    try{
      const res = await axiosInstance.get('/users/api/v1/company/managed/nft');
      console.log({ res });
      if (res && res.data && res.data.success) {
        setTableData(() => res.data.data);
      }
    }catch(e){
      console.log(e);
    }
  }
  const handleClickNFTDelete = async (serial, hedera_token_id) => {
    try{
      const res = await axiosInstance.post(`/users/api/v1/burn`, { serial, hedera_token_id });
      if (res && res.data && res.data.success) {
        setTableData(_tableData => _tableData.filter((row, index) => row.hedera_token_id !== hedera_token_id || row.editionNumber !== serial))
      }
    }catch(e){
      console.log(e);
    }
  }

  const closeModal = () => {
    setModalShow(false);
  }

  const handleNftClick = (nft) => {
    setActiveNft(() => nft);
    setModalShow(true);
  }
  return (
    <Container className="pt-5" style={{ maxWidth: "90%" }}>
      <h2> Manage NFTs </h2>
      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Creted At</th>
            <th>Product</th>
            <th>Size</th>
            <th>SKU</th>
            <th>Collection</th>
            <th>Edition</th>
            <th>Serial</th>
            <th>Status</th>
            <th>Perks List</th>
            <th>Redemption Link</th>
            <th>Redemption Status</th>
            <th>NFT Type</th>
            <th>Delete NFT</th>
            <th>More Details</th>
          </tr>
        </thead>
        <tbody>
          {tableData.length > 0 && tableData.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{row.datetime_created}</td>
              <td>{row.productName}</td>
              <td>{row.size}</td>
              <td>{row.sku}</td>
              <td>{row.collectionName}</td>
              <td>{row.editionNumber}</td>
              <td>{row.serialNumber}</td>
              <td>{row.status}</td>
              <td>{ }</td>
              <td>
                <Link
                  to={row.redemptionLink ? row.redemptionLink : ""}
                >
                  <div className="btn btn-light btn-sm" style={{ border: "0.5px solid gray" }}>Redemption Url</div>
                </Link>
              </td>
              <td>{row.nft_type}</td>
              <td>{row.redemptionStatus}</td>
              <td><div className="btn btn-danger btn-sm" onClick={() => handleClickNFTDelete(row.editionNumber, row.hedera_token_id)}>Delete</div></td>
              <td><div className="btn btn-light btn-sm" style={{ border: "0.5px solid gray" }} onClick={(e) => handleNftClick(row)}>Product Details</div></td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={modalShow} onHide={closeModal} size="lg">
        <Modal.Header>
          <Modal.Title>{activeNft ? activeNft.productName : ""}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table>
            <tbody>
              <tr>
                <td className="p-2">
                  Collection Name
                </td>
                <td>
                  {activeNft ? activeNft.collectionName : ""}
                </td>
              </tr>
              <tr>
                <td className="p-2">
                  Product Name
                </td>
                <td>
                  {activeNft ? activeNft.productName : ""}
                </td>
              </tr>
              <tr>
                <td className="p-2">
                  Description
                </td>
                <td>
                  {activeNft ? activeNft.description : ""}
                </td>
              </tr>
              <tr>
                <td className="p-2">
                  Size
                </td>
                <td>
                  {activeNft ? activeNft.size : ""}
                </td>
              </tr>
              <tr>
                <td className="p-2">
                  Serial Number
                </td>
                <td>
                  {activeNft ? activeNft.serialNumber : ""}
                </td>
              </tr>
              <tr>
                <td className="p-2">
                  Redemption Link
                </td>
                <td>
                  {activeNft ? activeNft.redemptionLink : ""}
                </td>
              </tr>
              <tr>
                <td className="p-2"> 
                  Redemption Status
                </td>
                <td>
                  {activeNft ? activeNft.redemptionStatus : ""}
                </td>
              </tr>
              <tr>
                <td className="p-2">
                  Hedera Token Id
                </td>
                <td>
                  {activeNft ? activeNft.hedera_token_id : ""}
                </td>
              </tr>
              <tr>
                <td className="p-2">
                  DateTime Created
                </td>
                <td>
                  {activeNft ? activeNft.datetime_created : ""}
                </td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

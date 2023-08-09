import { Page, Card } from "@shopify/polaris";
import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import ManagedNftsDataTable from "../component/ManageNftsDataTable";
// import { getManageNftData } from "../utils/apiCalls";
import parseTableData from "../utils/parseTableData";
import { AxiosInstance } from "axios";
import { axiosInstance } from "../contexts/AuthContext";

export default function ManageNFTs() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    getNftData();
  }, []);

  const getNftData = async () => {
    const res = await axiosInstance.get('/users/api/v1/company/managed/nft');
    console.log({ res });
    if (res && res.data && res.data.success) {
      setTableData(() => res.data.data);
    }
  }
  const handleClickNFTDelete = async (serial, hedera_token_id) => {
    const res = await axiosInstance.post(`/users/api/v1/burn`, { serial, hedera_token_id });
    if (res && res.data && res.data.success) {
      setTableData(_tableData => _tableData.filter((row, index) => row.hedera_token_id !== hedera_token_id || row.editionNumber !== serial))
    }
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
              <td>{}</td>
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
              <td><div className="btn btn-light btn-sm" style={{ border: "0.5px solid gray" }}>Product Details</div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}

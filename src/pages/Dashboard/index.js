import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { getExchange } from "../../action";
import { axiosInstance } from "../../contexts/AuthContext";

const BOX = styled.div`
  padding-top: 100px;
  tr {
    border-bottom: dotted 1px black;
    line-height: 3rem;
  }
`;
function Dashboard() {
  const [account, setAccount] = useState(null);
  const [rate, setRate] = useState(0);

  useEffect(() => {
    getDashboard();
    getExchangeRate();
  }, []);

  const getDashboard = async () => {
    try {
      const res = await axiosInstance.get("/users/api/v1/company/data");
      console.log({ res });
      if (res && res.status === 200) {
        setAccount(() => res.data.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getExchangeRate = async () => {
    try {
      const res = await getExchange();
      console.log(Number(res.data["hedera-hashgraph"].usd));
      if (res && res.data) {
        setRate(() => Number(res.data["hedera-hashgraph"].usd));
      }
    } catch (e) {}
  };
  return (
    <BOX>
      <div className="container">
        {account && (
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <h2 className="fw-bold"> Account Information </h2>
              <div className="conent">
                <table className="w-100">
                  <tbody>
                    <tr>
                      <td className="fw-bold p-3 px-0" width="15">
                        Licence Key
                      </td>
                      <td width="85" className="p-3">
                        <div
                          className="px-4 py-2 fw-bold"
                          style={{
                            backgroundColor: "#f5f5f5",
                            lineHeight: "normal",
                            color: "gray",
                          }}
                        >
                          {account.key}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold p-3 px-0">Company Name</td>
                      <td className="p-3">
                        <div
                          className="px-4 py-2 fw-bold"
                          style={{
                            backgroundColor: "#f5f5f5",
                            lineHeight: "normal",
                            color: "gray",
                          }}
                        >
                          {account.company_name}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold p-3 px-0">Company Address</td>
                      <td className="p-3">
                        <div
                          className="px-4 py-2 fw-bold"
                          style={{
                            backgroundColor: "#f5f5f5",
                            lineHeight: "normal",
                            color: "gray",
                          }}
                        >
                          {account.company_address}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold p-3 px-0">Contact name</td>
                      <td className="p-3">
                        <div
                          className="px-4 py-2 fw-bold"
                          style={{
                            backgroundColor: "#f5f5f5",
                            lineHeight: "normal",
                            color: "gray",
                          }}
                        >
                          {account.contact_name}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold p-3 px-0">Contact Email</td>
                      <td className="p-3">
                        <div
                          className="px-4 py-2 fw-bold"
                          style={{
                            backgroundColor: "#f5f5f5",
                            lineHeight: "normal",
                            color: "gray",
                          }}
                        >
                          {account.company_email}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} style={{ marginTop: "3em" }}>
              <h4 className="fw-bold"> Account Funds </h4>
              <div className="conent">
                {account && (
                  <table className="w-100">
                    <tbody>
                      <tr>
                        <td width="40" className="fw-bold">
                          Wallet balance in USD/HBAR
                        </td>
                        <td width="30" className="p-3">
                          <div
                            className="px-4 py-2 fw-bold"
                            style={{
                              backgroundColor: "#f5f5f5",
                              lineHeight: "normal",
                              color: "gray",
                              maxWidth: "300px",
                            }}
                          >
                            {(account?.wallet_balance_hbar * rate).toFixed(2)}$
                          </div>
                        </td>
                        <td width="40">
                          <div
                            className="px-4 py-2 fw-bold"
                            style={{
                              backgroundColor: "#f5f5f5",
                              lineHeight: "normal",
                              color: "gray",
                              maxWidth: "300px",
                            }}
                          >
                            {account?.wallet_balance_hbar.toFixed(2)}HBAR
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Royalty Earned in USD/HBAR</td>
                        <td className="p-3">
                          <div
                            className="px-4 py-2 fw-bold"
                            style={{
                              backgroundColor: "#f5f5f5",
                              lineHeight: "normal",
                              color: "gray",
                              maxWidth: "300px",
                            }}
                          >
                            {(account?.royalties_earned_hbar * rate).toFixed(2)}
                            $
                          </div>
                        </td>
                        <td>
                          <div
                            className="px-4 py-2 fw-bold"
                            style={{
                              backgroundColor: "#f5f5f5",
                              lineHeight: "normal",
                              color: "gray",
                              maxWidth: "300px",
                            }}
                          >
                            {account?.royalties_earned_hbar.toFixed(2)}HBAR
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Total Fees Paid in USD/HBAR</td>
                        <td className="p-3">
                          <div
                            className="px-4 py-2 fw-bold"
                            style={{
                              backgroundColor: "#f5f5f5",
                              lineHeight: "normal",
                              color: "gray",
                              maxWidth: "300px",
                            }}
                          >
                            {(account?.fees_paid_hbar * rate).toFixed(2)}$
                          </div>
                        </td>
                        <td>
                          <div
                            className="px-4 py-2 fw-bold"
                            style={{
                              backgroundColor: "#f5f5f5",
                              lineHeight: "normal",
                              color: "gray",
                              maxWidth: "300px",
                            }}
                          >
                            {account?.fees_paid_hbar.toFixed(2)}HBAR
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} className="mt-5">
              <h4 className="fw-bold"> Statistics </h4>
              <div className="conent">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th width="27%">NFT Collections</th>
                      <th width="27%">NFTs minted</th>
                      <th width="27%">NFTs failed</th>
                      <th width="19%">NFTs redeemed</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div
                          className="px-5 my-4 py-2 fw-bold"
                          style={{
                            backgroundColor: "#f5f5f5",
                            lineHeight: "normal",
                            color: "gray",
                          }}
                        >
                          {account.nft_collections}
                        </div>
                      </td>
                      <td>
                        <div
                          className="px-4 my-4 py-2 fw-bold"
                          style={{
                            backgroundColor: "#f5f5f5",
                            lineHeight: "normal",
                            color: "gray",
                          }}
                        >
                          {account.nfts_minted}
                        </div>
                      </td>
                      <td>
                        <div
                          className="px-4 my-4 py-2 fw-bold"
                          style={{
                            backgroundColor: "#f5f5f5",
                            lineHeight: "normal",
                            color: "gray",
                          }}
                        >
                          {account.nft_create_failed}
                        </div>
                      </td>
                      <td>
                        <div
                          className="px-5 my-4 py-2 fw-bold"
                          style={{
                            backgroundColor: "#f5f5f5",
                            lineHeight: "normal",
                            color: "gray",
                          }}
                        >
                          {account.nfts_redeemed}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </BOX>
  );
}

export default Dashboard;

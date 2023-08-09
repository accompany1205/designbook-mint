import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styled from 'styled-components';
import { getExchange } from '../../action';
import { axiosInstance } from "../../contexts/AuthContext";

const BOX = styled.div`
    padding-top: 100px;
    tr {
        border-bottom: dotted 1px black;
        line-height: 3rem;
    }

`
function Dashboard() {

    const [account, setAccount] = useState(null);
    const [rate, setRate] = useState(0);

    useEffect(() => {
        getDashboard();
        getExchangeRate();
    }, [])

    const getDashboard = async () => {
        try{
            const res = await axiosInstance.get('/users/api/v1/company/data');
            console.log({ res });
            if (res && res.status === 200) {
                setAccount(() => res.data.data)
            }
        }catch (e) {
            console.log(e);
        }
    }

    const getExchangeRate = async () => {
        try{
            const res = await getExchange();
            console.log(Number(res.data['hedera-hashgraph'].usd))
            if(res && res.data){
                setRate(()=> Number(res.data['hedera-hashgraph'].usd));
            }
        }catch (e) {

        }
    }
    return (
        <BOX>
            <div className="container" >
                <h2 className="mb-5 fw-bold">Dashboard</h2>
                {account && (
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={6}>

                            <h4 className="fw-bold"> Account Information </h4>
                            <div className="conent">
                                <table className="w-100">
                                    <tbody>
                                        <tr>
                                            <td className="fw-bold">Licence Key</td>
                                            <td>{account.key}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Company Name</td>
                                            <td>{account.company_name}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Company Address</td>
                                            <td>{account.company_address}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Contact name</td>
                                            <td>{account.contact_name}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Contact Email</td>
                                            <td>{account.company_email}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </Col>
                        <Col xs={12} sm={12} md={12} lg={6}>

                            <h4 className="fw-bold"> Account Funds </h4>
                            <div className="conent">
                                <table className="w-100">
                                    <tbody>
                                        <tr>
                                            <td className="fw-bold">Wallet balance in HBAR / USD</td>
                                            <td>{account.wallet_balance_hbar}/{(account.wallet_balance_hbar * rate).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Royalty Earned in HBAR / USD</td>
                                            <td>{account.royalties_earned_hbar}/{(account.royalties_earned_hbar * rate).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Total Fees Paid in HBAR / USD</td>
                                            <td>{account.fees_paid_hbar}/{(account.fees_paid_hbar * rate).toFixed(2)}</td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>

                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} className="mt-5">

                            <h4 className="fw-bold"> Statistics </h4 >
                            <div className="conent">
                                <table className="w-100">
                                    <thead>
                                        <tr>
                                            <th>
                                                NFT Collections
                                            </th>
                                            <th>
                                                NFTs minted
                                            </th>
                                            <th>
                                                NFTs redeemed
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{account.nft_collections}</td>
                                            <td>{account.nfts_minted}</td>
                                            <td>{account.nfts_redeemed}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </Col>
                    </Row>

                )}
            </div>
        </BOX>
    )
}

export default Dashboard;
import axios from "axios";

export async function getExchange() {
    try {
        console.log(process.env.REACT_APP_PRICE_API_URL);
        const res = await axios.get(process.env.REACT_APP_PRICE_API_URL || "https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph,tether&vs_currencies=usd");
        return res;
    } catch (e) {
        return null;
    }
}
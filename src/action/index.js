import axios from "axios";

export async function getExchange() {
    try {
        console.log(process.env.REACT_APP_PRICE_API_URL);
        const res = await axios.get(process.env.REACT_APP_PRICE_API_URL);
        return res;
    } catch (e) {
        return null;
    }
}
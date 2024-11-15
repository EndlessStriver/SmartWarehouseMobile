import { getData } from "@/unit/MyLocalStorage";
import axios from "axios";

interface ReceiveItem {
    productId: string;
    quantity: number;
    unitId: string;
    skuId: string;
}

interface ReceiveOrder {
    receiveDate: string;
    receiveBy: string;
    description: string;
    receiveItems: ReceiveItem[];
}


const UpdateStockEntryAPI = async (data: ReceiveOrder, receiveId: string) => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.put(`${HOST}/receives/${receiveId}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default UpdateStockEntryAPI;
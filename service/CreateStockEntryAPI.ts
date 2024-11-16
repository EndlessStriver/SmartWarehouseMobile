import { getData } from "@/unit/MyLocalStorage";
import axios from "axios";

interface ReceiveItem {
    productId: string;
    quantity: number;
    unitId: string;
    skuId: string;
}

export interface ReceiveOrder {
    receiveDate: string;
    receiveBy: string;
    description: string;
    supplierId: string;
    receiveItems: ReceiveItem[];
}


const CreateStockEntryAPI = async (data: ReceiveOrder) => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.post(`${HOST}/receives`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default CreateStockEntryAPI;
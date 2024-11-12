import { getData } from "@/unit/MyLocalStorage";
import axios from "axios";

interface ReceiveItem {
    receiveItemId: string;
    receiveQuantity: number;
    itemStatus: boolean;
    locationId: string;
}

interface Receive {
    receiveId: string;
    receiveDate: string;
    receiveBy: string;
    supplierId: string;
    receiveItems: ReceiveItem[];
}

const CreateReceiveCheck = async (data: Receive) => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.post(`${HOST}/receive-check`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default CreateReceiveCheck;
import { getData } from "@/unit/MyLocalStorage";
import axios from "axios";

const ConfirmOrderExportById = async (orderExportId: string): Promise<void> => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.put(`${HOST}/order-export/${orderExportId}/check-out`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default ConfirmOrderExportById;
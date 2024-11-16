import { getData } from "@/unit/MyLocalStorage";
import axios from "axios";

const CancelOrderExportById = async (orderExportId: string): Promise<void> => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.patch(`${HOST}/order-export/${orderExportId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default CancelOrderExportById;
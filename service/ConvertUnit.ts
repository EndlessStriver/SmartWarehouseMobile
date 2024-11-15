import { getData } from "@/unit/MyLocalStorage";
import axios from "axios";

const ConvertUnit = async (unitId: string, quantity: number): Promise<number> => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.get(`${HOST}/receive-check/conversions/${unitId}?quantity=${quantity}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default ConvertUnit;
import { getData } from "@/unit/MyLocalStorage";
import axios from "axios";

export interface LocationExport {
    locationCode: string;
    quantityTaken: number;
}

const GetLocationFIFO = async (skuId: string, unitId: string, quantity: number, typeshelf: string): Promise<LocationExport[]> => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.get(`${HOST}/locations/suggest-export-fifo?skuId=${skuId}&unitId=${unitId}&quantity=${quantity}&typeShelf=${typeshelf}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default GetLocationFIFO;
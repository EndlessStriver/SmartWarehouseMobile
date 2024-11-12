import { getData } from "@/unit/MyLocalStorage";
import axios from "axios";

interface SuggestInboundProps {
    skuId: string;
    unitId: string;
    typeShelf: string;
    quantity: number;
}

export interface Location {
    locationCode: string;
    maxQuantityInbound: number;
    locationId: string;
}

const SuggestInbound = async (data: SuggestInboundProps): Promise<Location[]> => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.get(`${HOST}/locations/suggest-inbound?skuId=${data.skuId}&unitId=${data.unitId}&typeShelf=${data.typeShelf}&quantity=${data.quantity}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default SuggestInbound;
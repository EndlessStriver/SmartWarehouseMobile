import { getData } from "@/unit/MyLocalStorage";
import axios from "axios";

interface LocationInventory {
    locationId: string;
    avaliableQuantity: number;
}

interface ShelfInventory {
    shelfId: string;
    locationInventory: LocationInventory[];
}

interface InventoryData {
    note: string;
    shelfInventory: ShelfInventory[];
}


const CreateInventoryAPI = async (data: InventoryData): Promise<void> => {
    console.log(data);
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.post(`${HOST}/whtransaction/inventory-check`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default CreateInventoryAPI;
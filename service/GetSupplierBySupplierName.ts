import { getData } from "@/unit/MyLocalStorage";
import axios from "axios";

export interface Supplier {
    id: string;
    name: string;
    description: string;
}

const GetSupplierBySupplierName = async (supplierName: string): Promise<Supplier[]> => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.get(`${HOST}/suppliers/name?name=${supplierName}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default GetSupplierBySupplierName;
import { getData } from "@/unit/MyLocalStorage";
import axios from "axios";

interface InventoryDetail {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    quantity: number;
    isIncrease: boolean;
}

interface Inventory {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    inventoryDetail: InventoryDetail[];
}

export interface Transaction {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    transactionType: string;
    note: string;
    transactionDate: string;
    quantity: number;
    inventory: Inventory[];
}

interface PaginatedData {
    data: Transaction[];
    totalPage: number;
    limit: number;
    offset: number;
    totalElementOfPage: number;
}


const GetInventories = async (limit?: number, offset?: number, order?: string): Promise<PaginatedData> => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.get(`${HOST}/whtransaction/transaction-inventory-check?limit=${limit || 10}&offset=${offset || 1}&order=${order || "ASC"}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default GetInventories;
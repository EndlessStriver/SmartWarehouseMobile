import { getData } from "@/unit/MyLocalStorage";
import axios from "axios";

export interface InventoryData {
    data: InventoryTransaction[];
    totalPage: number;
    limit: number;
    offset: number;
    totalElementOfPage: number;
    pending: number;
}

export interface InventoryTransaction {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    transactionType: string;
    note: string;
    transactionDate: string;
    quantity: number;
    inventory: InventoryItem[];
}

interface InventoryItem {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    status: string;
    inventoryDetail: InventoryDetail[];
    shelves: Shelf;
}

interface InventoryDetail {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    quantity: number;
    isIncrease: boolean;
    location: Location;
    products: Product;
}

interface Location {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    locationCode: string;
    maxCapacity: string;
    currentCapacity: string;
    maxWeight: string;
    currentWeight: string;
    quantity: number;
    occupied: boolean;
}

interface Product {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    name: string;
    description: string;
    productCode: string;
    img: string;
    export_criteria: string;
}

interface Shelf {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    name: string;
    maxColumns: number;
    maxLevels: number;
    currentCapacity: string;
    maxCapacity: string;
    maxWeight: string;
    currentColumnsUsed: number;
    totalColumns: number;
    currentWeight: string;
    typeShelf: string;
}


const GetInventories = async (offset?: number, limit?: number, order?: string): Promise<InventoryData> => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.get(`${HOST}/whtransaction/transaction-inventory-check?limit=${limit || 10}&offset=${offset || 1}&order=${order || "DESC"}`, {
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
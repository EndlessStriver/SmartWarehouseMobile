import { getData } from "@/unit/MyLocalStorage";
import axios from "axios";

interface Category {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    name: string;
    description: string;
    categoryCode: string;
}

export interface Shelf {
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
    category: Category;
}

interface ShelfDataResponse {
    data: Shelf[];
    totalPage: number;
    limit: number;
    offset: number;
    totalElementOfPage: number;
}

const GetAllShelf = async (limit?: number, offset?: number, order?: number, orderBy?: number): Promise<ShelfDataResponse> => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.get(`${HOST}/shelf?limit=${limit || 10}&offset=${offset || 1}&order=${order || "ASC"}&orderBy=${orderBy || "name"}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default GetAllShelf;
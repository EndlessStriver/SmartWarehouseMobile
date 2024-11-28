import { getData } from "@/unit/MyLocalStorage";
import axios from "axios";

export interface ReceiveRecord {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    receiveDate: string;
    receiveBy: string;
    status: string;
    description: string;
    totalAmount: string;
    receiveCode: string;
}

interface ReceiveData {
    data: ReceiveRecord[];
    totalPage: number;
    limit: number;
    offset: number;
    totalElementOfPage: number;
    pending: number;
}


const GetReceives = async (limit?: number, offset?: number, order?: "ASC" | "DESC", orderBy?: string): Promise<ReceiveData> => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.get(`${HOST}/receives?limit=${limit || 10}&offset=${offset || 1}&order=${order || "DESC"}&orderBy=${orderBy || "create_at"}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default GetReceives;
import { getData } from "@/unit/MyLocalStorage";
import axios from "axios";

interface RetrievedProduct {
    locationCode: string;
    quantityTaken: number;
}

interface OrderExportDetail {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    skuCode: string;
    quantity: number;
    retrievedProducts: RetrievedProduct[];
}

export interface ExportOrder {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    status: string;
    exportCode: string;
    exportDate: string;
    description: string;
    exportBy: string;
    totalQuantity: number;
    orderExportDetails: OrderExportDetail[];
}

interface ExportOrderResponse {
    data: ExportOrder[];
    totalPage: number;
    limit: number;
    offset: number;
    totalElementOfPage: number;
    pending: number;
}


const GetOrderExports = async (limit?: number, offset?: number): Promise<ExportOrderResponse> => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.get(`${HOST}/order-export?limit=${limit || 10}&offset=${offset || 1}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default GetOrderExports;
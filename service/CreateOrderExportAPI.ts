import { getData } from "@/unit/MyLocalStorage";
import axios from "axios";

interface ExportOrder {
    exportCode: string;
    exportDate: string;
    exportBy: string;
    description: string;
    orderExportDetails: OrderExportDetail[];
}

interface OrderExportDetail {
    skuId: string;
    productId: string;
    totalQuantity: number;
    unitId: string;
    itemStatus: boolean;
    locationExport: LocationExport[];
}

interface LocationExport {
    locationCode: string;
    quantity: number;
}

const CreateOrderExportAPI = async (data: ExportOrder) => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.post(`${HOST}/order-export`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default CreateOrderExportAPI;
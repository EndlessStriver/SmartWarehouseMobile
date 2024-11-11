import { getData } from "@/unit/MyLocalStorage";
import axios from "axios";

interface Product {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    name: string;
    description: string;
    productCode: string;
    unit: string;
    img: string;
}

interface Sku {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    skuCode: string;
    batchCode: string;
    weight: string;
    dimension: string;
    description: string;
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
    occupied: boolean;
}

interface CheckItem {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    expectQuantity: number;
    receiveQuantity: number;
    price: string;
    totalAmount: string;
    itemStatus: string;
    location: string;
    product: Product;
    sku: Sku;
    locations: Location[];
}

export interface Receipt {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    receiveDate: string;
    receiveBy: string;
    expectTotalAmount: string;
    totalAmount: string;
    totalExpectQuantity: number;
    totalReceiveQuantity: number;
    checkItems: CheckItem[];
}


const GetReceiveCheckByStockEntryId = async (stockEntryId: string): Promise<Receipt> => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.get(`${HOST}/receive-check/receive/${stockEntryId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default GetReceiveCheckByStockEntryId;
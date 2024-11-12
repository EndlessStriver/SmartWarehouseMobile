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

interface Unit {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    name: string;
    isBaseUnit: boolean;
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
    category: Category;
    units: Unit[];
}

interface SKU {
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

export interface ReceiveItem {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    quantity: number;
    sku: SKU;
    product: Product;
}

interface Supplier {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    name: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    supplierCode: string;
    contactPerson: string;
    location: string;
    status: boolean;
    notes: string;
    website: string;
    taxId: string;
    isActive: boolean;
}

export interface ReceiveOrder {
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
    totalQuantity: number;
    supplier: Supplier;
    receiveItems: ReceiveItem[];
}

const GetStockEntryById = async (stockEntryId: string): Promise<ReceiveOrder> => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.get(`${HOST}/receives/${stockEntryId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default GetStockEntryById;
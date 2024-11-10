import { getData } from "@/unit/MyLocalStorage";
import axios from "axios";

interface ProductResponse {
    data: Product[];
    totalPage: number;
    limit: number;
    offset: number;
    totalElementOfPage: number;
}

export interface Product {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    name: string;
    description: string;
    productCode: string;
    img: string;
    category: Category;
    productDetails: ProductDetail[];
    units: Unit[];
}

interface Category {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    name: string;
    description: string;
    categoryCode: string;
}

interface ProductDetail {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    quantity: number;
    damagedQuantity: number;
    images: Image[];
    sku: SKU[];
}

interface Image {
    url: string;
    publicId: string;
    isDeleted: boolean;
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

export interface Unit {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    name: string;
    isBaseUnit: boolean;
}

const GetProductsByNameAndCodeAndSupplierName = async (key: string, limit?: number, offset?: number): Promise<ProductResponse> => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.get(`${HOST}/products/name-pagination?name=${key}&limit=${limit || 10}&offset=${offset || 1}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default GetProductsByNameAndCodeAndSupplierName;
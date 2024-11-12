import { getData } from "@/unit/MyLocalStorage";
import axios from "axios";

interface ProductCategory {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    name: string;
    description: string;
    categoryCode: string;
}

interface ProductImage {
    url: string;
    publicId: string;
    isDeleted: boolean;
}

interface ProductSKU {
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

interface ProductDetail {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    quantity: number;
    images: ProductImage[];
    sku: ProductSKU[];
}

export interface ProductUnit {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    name: string;
    isBaseUnit: boolean;
}

export interface ProductBySupplierId {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    name: string;
    description: string;
    productCode: string;
    img: string;
    category: ProductCategory;
    productDetails: ProductDetail[];
    units: ProductUnit[];
}

interface ProductBySupplierResponse {
    data: ProductBySupplierId[];
    totalPage: number,
    limit: number,
    offset: number,
    totalElementOfPage: number
}

const GetProductBySupplierId = async (supplierId: string, limit?: number, offset?: number,): Promise<ProductBySupplierResponse> => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.get(`${HOST}/products/supplier/${supplierId}?limit=${limit || 5}&offset=${offset || 1}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default GetProductBySupplierId;
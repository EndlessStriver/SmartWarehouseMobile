import { getData } from "@/unit/MyLocalStorage";
import axios from "axios";

export interface Product {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    name: string;
    description: string;
    productCode: string;
    img: string;
    productDetails: ProductDetail[];
    units: Unit[];
    category: Category;
}

interface ProductDetail {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    quantity: number;
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
    locations: Location[];
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

interface Unit {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    name: string;
    isBaseUnit: boolean;
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


const GetProductInformationById = async (id: string): Promise<Product> => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.get(`${HOST}/products/${id}/location`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default GetProductInformationById;
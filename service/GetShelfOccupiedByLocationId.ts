import { getData } from "@/unit/MyLocalStorage";
import axios from "axios";

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
    export_criteria: string;
    units: Unit[];
}

interface ProductDetails {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    quantity: number;
    damagedQuantity: number;
    images: {
        url: string;
        publicId: string;
        isDeleted: boolean;
    }[];
    product: Product;
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
    productDetails: ProductDetails;
}

export interface WarehouseLocation {
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
    skus: Sku;
}


const GetShelfOccupiedByLocationId = async (locationId: string): Promise<WarehouseLocation[]> => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const response = await axios.get(`${HOST}/locations/shelf-occupied/${locationId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default GetShelfOccupiedByLocationId;
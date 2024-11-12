import { TokenPayload } from "@/typedata/TokenPayload";
import { getData, getJSON } from "@/unit/MyLocalStorage";
import axios from "axios";

interface Role {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    name: string;
    description: string;
}

export interface User {
    id: string;
    create_at: string;
    update_at: string;
    isDeleted: boolean;
    accountCode: string;
    username: string;
    fullName: string;
    email: string;
    gender: 'Male' | 'Female';
    dateOfBirth: string;
    phoneNumber: string;
    position: string;
    address: string;
    avatar: string;
    status: boolean;
    role: Role;
}

const GetAccountInformationCurrent = async (): Promise<User> => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        const tokenDecode: TokenPayload = await getJSON('tokenDecode');
        const response = await axios.get(`${HOST}/account/ad/${tokenDecode.userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default GetAccountInformationCurrent;
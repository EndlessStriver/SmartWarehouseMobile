import { getData, removeData } from "@/unit/MyLocalStorage";
import axios from "axios"

const logout = async (): Promise<void> => {
    try {
        const HOST = process.env.EXPO_PUBLIC_API_URL;
        const token = await getData('token');
        await axios.post(`${HOST}/auth/logout`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        removeData('token')
        removeData('role')
    } catch (error) {
        throw error
    }
}

export default logout
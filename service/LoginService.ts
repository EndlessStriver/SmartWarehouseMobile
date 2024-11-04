import { removeData, storeData } from "@/unit/MyLocalStorage"
import axios from "axios"

const LoginService = async (username: string, password: string): Promise<void> => {
    try {
        const HOST_BE = process.env.EXPO_PUBLIC_API_URL
        const response = await axios.post(`${HOST_BE}/auth/login`, {
            username: username,
            password: password
        })
        storeData('token', response.data.data.token)
        storeData('role', response.data.data.role)
    } catch (error) {
        removeData('token')
        removeData('role')
        throw error
    }
}

export default LoginService
import axios from "axios"

const LoginService = (username: string, password: string) => {
    const HOST_BE = process.env.EXPO_PUBLIC_API_URL
    return axios.post(`${HOST_BE}/auth/login`, {
        username: username,
        password: password
    })
}

export default LoginService
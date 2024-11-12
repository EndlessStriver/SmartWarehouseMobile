import { TokenPayload } from "@/typedata/TokenPayload";
import { jwtDecode } from "jwt-decode";

const DecodeToken = (token: string): TokenPayload | undefined => {
    try {
        return jwtDecode<TokenPayload>(token);
    } catch (error) {
        console.error("Invalid token", error);
    }
}

export default DecodeToken
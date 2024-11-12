export type TokenPayload = {
    userId: string;
    role: string
    timestamp: string;
    iat: number;
    exp: number;
}
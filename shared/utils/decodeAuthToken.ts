import jwt from "jsonwebtoken";

export interface DecodedToken {
    userId: string;
    name: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

export function decodeAuthToken(token: string) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken
    } catch (error) {
        console.error("Enure Config!", error)
    }
}
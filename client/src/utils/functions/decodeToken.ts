import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "@shared/utils/decodeAuthToken";

export default function decodeToken(token?: string): DecodedToken | null {
    const authToken = token ?? localStorage.getItem("authToken");
    if (!authToken) {
        return null;
    }
    try {
        return jwtDecode<DecodedToken>(authToken);
    } catch (error) {
        return null;
    }
}
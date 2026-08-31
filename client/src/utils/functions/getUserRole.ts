import decodeToken from "./decodeToken";
import type { DecodedToken } from "@shared/utils/decodeAuthToken";

export default function getUserType(decodedToken?: DecodedToken): string {
    const authToken = decodedToken ?? decodeToken();
    return authToken?.role as string ?? "";
}
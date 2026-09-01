import { type Request, type Response, type NextFunction } from "express";
import { getUserWithRoleByEmail } from "@/db/queries/user.queries";
import { decodeAuthToken, type DecodedToken } from "@shared/utils/decodeAuthToken";

export interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            const token = req.headers.authorization.split(" ")[1] as string;

            if (!token) {
                return res.status(401).json({ message: "Not authorized, no token" });
            }

            const decoded = decodeAuthToken(token) as DecodedToken;
            const user = await getUserWithRoleByEmail(decoded.email);
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        return res.status(400).json({ message: "Invalid header" });
    }
};

export const adminOnly = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.user && req.user.role === "Admin") {
        next();
    } else {
        return res.status(403).json({ message: "Admin access required" });
    }
};

export const employeeOnly = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.user && req.user.role === "Employee") {
        next();
    } else {
        return res.status(403).json({ message: "Employee access required" });
    }
};
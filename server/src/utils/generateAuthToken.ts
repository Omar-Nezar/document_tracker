import jwt from "jsonwebtoken";
import type { UserWithRole } from "@/db/queries/user.queries";

export const generateAuthToken = (user: UserWithRole) => {
    try {
        if (!user) {
            console.warn("Pass a user");
            return null;
        }
        const token = jwt.sign(
            {
                userId: user.id,
                name: user.name,
                email: user.email,
                role: user.role.name,
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "1d",
            }
        );
        return token;
    } catch (error) {
        console.error("Ensure config", error);
        return null;
    }
};
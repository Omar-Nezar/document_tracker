import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { hashPassword, comparePassword } from "@/utils/hash";

const { usersTable } = schema

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;
        const genericMsg = "Invalid email or password";

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await db.query.usersTable.findFirst({
            where: eq(usersTable.email, email),
            with: {
                role: true,
            },
        });

        if (!user) {
            return res.status(401).json({
                message: genericMsg,
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                message: "Account disabled",
            });
        }

        const passwordMatch = await comparePassword(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: genericMsg,
            });
        }

        if (user.role.name !== role) {
            return res.status(401).json({
                message: genericMsg,
            });
        }

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                role: user.role.name,
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const hashed = await hashPassword(password);

        await db.insert(usersTable).values({
            name,
            email,
            password: hashed,
        });
    } catch (error) {
        console.error("Register error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
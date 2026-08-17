import type { Request, Response } from "express";
import { db } from "../db/db";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await db.query.usersTable.findMany({
            columns: {
                password: false, // Explicitly exclude password column
            },
        });

        return res.status(200).json({ users, message: "Users fetched successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
};
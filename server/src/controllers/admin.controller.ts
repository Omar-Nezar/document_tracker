import type { Response } from "express";
import { db } from "../db/db";
import { eq } from "drizzle-orm";
import type { AuthRequest } from "@/middleware/auth.middleware";
import { getAllUsers } from "@/db/queries/user.queries";
import { usersTable, pettyCashTransactionsTable } from "@schema";

export const getUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await getAllUsers();
        return res.status(200).json({ users, message: "Users fetched successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const delUser = async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req.params.id);

        // Check whether the user has existing transactions
        const existingTransaction = await db
            .select({ id: pettyCashTransactionsTable.id })
            .from(pettyCashTransactionsTable)
            .where(eq(pettyCashTransactionsTable.requesterId, userId))
            .limit(1);

        if (existingTransaction.length > 0) {
            return res.status(409).json({
                message:
                    "This user cannot be deleted because they have existing transactions.",
            });
        }

        // No transactions = safe to delete
        await db
            .delete(usersTable)
            .where(eq(usersTable.id, userId));

        return res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Delete user error:", error);

        return res.status(500).json({
            message: "Failed to delete user.",
        });
    }
};
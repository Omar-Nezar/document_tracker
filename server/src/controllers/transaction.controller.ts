import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import type { AuthRequest } from "@/middleware/auth.middleware";

import { db } from "@db";
import {
    usersTable,
    pettyCashTransactionsTable,
    transactionStatusHistoryTable,
    transactionCounters,
} from "@schema";
import { sql } from "drizzle-orm";

export const createTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const {
            amount,
            categoryId,
            description,
            submit,
        } = req.body;

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        if (!amount) {
            return res.status(400).json({
                message: "Amount is required",
            });
        }

        if (!categoryId) {
            return res.status(400).json({
                message: "Category is required",
            });
        }

        if (!description?.trim()) {
            return res.status(400).json({
                message: "Description is required",
            });
        }

        /*
         * Get the user's department and branch.
         */
        const [user] = await db
            .select({
                departmentId: usersTable.departmentId,
                branchId: usersTable.branchId,
            })
            .from(usersTable)
            .where(eq(usersTable.id, userId))
            .limit(1);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (!user.departmentId || !user.branchId) {
            return res.status(400).json({
                message:
                    "User must have a department and branch",
            });
        }

        const status = submit
            ? "SUBMITTED"
            : "DRAFT";

        /*
         * Insert transaction
         */
        const result = await db.transaction(async (tx) => {
            const year = new Date().getFullYear();

            const counter = await tx
                .insert(transactionCounters)
                .values({
                    year,
                    lastNumber: 1,
                })
                .onConflictDoUpdate({
                    target: transactionCounters.year,
                    set: {
                        lastNumber: sql`${transactionCounters.lastNumber} + 1`,
                    },
                })
                .returning({
                    number: transactionCounters.lastNumber,
                });

            const sequenceNumber = counter[0].number;

            const transactionNumber = `PC-${year}-${Date.now()}-${sequenceNumber
                .toString()
                .padStart(6, "0")}`;
            const [transaction] = await tx
                .insert(pettyCashTransactionsTable)
                .values({
                    transactionNumber,

                    requesterId: userId,

                    departmentId: user.departmentId,

                    branchId: user.branchId,

                    categoryId: Number(categoryId),

                    amount: String(amount),

                    description: description.trim(),

                    status,
                })
                .returning();
        });

        /*
         * Create initial history record.
         */
        await db
            .insert(transactionStatusHistoryTable)
            .values({
                transactionId: transaction.id,

                fromStatus: null,

                toStatus: status,

                changedBy: userId,

                comment: submit
                    ? "Request submitted"
                    : "Request saved as draft",
            });

        return res.status(201).json({
            message: submit
                ? "Request submitted successfully"
                : "Draft saved successfully",

            transaction,
        });

    } catch (error) {
        console.error(
            "Create transaction error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
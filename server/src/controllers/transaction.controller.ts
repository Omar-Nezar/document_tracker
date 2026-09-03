import type { Request, Response } from "express";
import {
    eq,
    desc,
    sql,
    and,
} from "drizzle-orm";
import type { AuthRequest } from "@/middleware/auth.middleware";

import { db } from "@db";
import {
    usersTable,
    pettyCashTransactionsTable,
    transactionStatusHistoryTable,
    transactionCounters,
    transactionDocumentsTable,
    // departmentsTable,
    // branchesTable,
    // pettyCashCategoriesTable,
} from "@schema";

import {
    getUserTransactionsByUserId,
    getAllTransactions
} from "@/db/queries/transaction.queries";

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
                message: "User must have a department and branch",
            });
        }

        const status = submit === "true"
            ? ("SUBMITTED" as const)
            : ("DRAFT" as const);

        const result = await db.transaction(async (tx) => {
            const year = new Date().getFullYear();

            /*
             * Get the next transaction number.
             */
            const [counter] = await tx
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

            if (!counter) {
                throw new Error("Failed to generate transaction counter");
            }

            const transactionNumber = `PC-${year}-${counter.number
                .toString()
                .padStart(6, "0")}`;

            /*
             * Create the transaction.
             */
            const [transaction] = await tx
                .insert(pettyCashTransactionsTable)
                .values({
                    transactionNumber,
                    requesterId: userId,
                    departmentId: user.departmentId!,
                    branchId: user.branchId!,
                    categoryId: Number(categoryId),
                    amount: String(amount),
                    description: description.trim(),
                    status,
                    submittedAt:
                        status === "SUBMITTED"
                            ? sql`CURRENT_TIMESTAMP`
                            : null,
                })
                .returning();

            if (!transaction) {
                throw new Error("Failed to create transaction");
            }

            /*
             * Create the transaction status history.
             */
            await tx
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

            /*
             * Upload the documents.
             */
            const files = req.files as Express.Multer.File[];
            if (
                files &&
                files.length > 0
            ) {

                await tx
                    .insert(
                        transactionDocumentsTable
                    )
                    .values(
                        files.map(
                            (file) => ({
                                transactionId: transaction.id,
                                originalName: file.originalname,
                                storedName: file.filename,
                                mimeType: file.mimetype,
                                fileSize: file.size,
                                filePath: file.path,
                            })
                        )
                    );
            }
            return transaction;
        });

        return res.status(201).json({
            message: submit
                ? "Request submitted successfully"
                : "Draft saved successfully",
            transaction: result,
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
}

export const getUserTransactions = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const transactions = await getUserTransactionsByUserId(userId);

        return res.status(200).json({
            message: "Transactions retrieved successfully",
            transactions,
        });

    } catch (error) {
        console.error(
            "Get transactions error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const getTransactions = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const transactions = await getAllTransactions();

        return res.status(200).json({
            message: "Transactions retrieved successfully",
            transactions,
        });

    } catch (error) {
        console.error(
            "Get transactions error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

const updateTransaction = async (
    req: AuthRequest,
    res: Response,
    admin: boolean
) => {
    try {
        const transactionId = Number(req.params.transactionId);
        const userId = req.user?.userId;
        const { amount, categoryId, description, submit } = req.body;

        if (!Number.isInteger(transactionId) || transactionId <= 0) {
            return res.status(400).json({ message: "Invalid transaction ID" });
        }

        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({ message: "Amount is required" });
        }

        if (!categoryId || Number(categoryId) <= 0) {
            return res.status(400).json({ message: "Category is required" });
        }

        if (!description?.trim()) {
            return res.status(400).json({ message: "Description is required" });
        }

        const result = await db.transaction(async (tx) => {
            const [current] = await tx
                .select({
                    id: pettyCashTransactionsTable.id,
                    status: pettyCashTransactionsTable.status,
                })
                .from(pettyCashTransactionsTable)
                .where(
                    admin
                        ? eq(pettyCashTransactionsTable.id, transactionId)
                        : and(
                            eq(pettyCashTransactionsTable.id, transactionId),
                            eq(pettyCashTransactionsTable.requesterId, userId!),
                            eq(pettyCashTransactionsTable.status, "DRAFT")
                        )
                )
                .limit(1);

            if (!current) {
                throw new Error(admin ? "TRANSACTION_NOT_FOUND" : "TRANSACTION_NOT_EDITABLE");
            }

            const nextStatus = admin
                ? current.status
                : submit === "true"
                    ? "SUBMITTED"
                    : "DRAFT";

            const [transaction] = await tx
                .update(pettyCashTransactionsTable)
                .set({
                    amount: String(amount),
                    categoryId: Number(categoryId),
                    description: description.trim(),
                    status: nextStatus,
                    submittedAt:
                        !admin && nextStatus === "SUBMITTED"
                            ? sql`CURRENT_TIMESTAMP`
                            : undefined,
                    updatedAt: sql`CURRENT_TIMESTAMP`,
                })
                .where(eq(pettyCashTransactionsTable.id, transactionId))
                .returning();

            if (!transaction) {
                throw new Error("TRANSACTION_NOT_FOUND");
            }

            if (!admin && current.status !== nextStatus) {
                await tx
                    .insert(transactionStatusHistoryTable)
                    .values({
                        transactionId,
                        fromStatus: current.status,
                        toStatus: nextStatus,
                        changedBy: userId!,
                        comment: "Request submitted",
                    });
            }

            const files = req.files as Express.Multer.File[];
            if (files?.length) {
                await tx
                    .insert(transactionDocumentsTable)
                    .values(
                        files.map((file) => ({
                            transactionId,
                            originalName: file.originalname,
                            storedName: file.filename,
                            mimeType: file.mimetype,
                            fileSize: file.size,
                            filePath: file.path,
                        }))
                    );
            }

            return transaction;
        });

        return res.status(200).json({
            message: admin || submit !== "true"
                ? "Transaction updated successfully"
                : "Request submitted successfully",
            transaction: result,
        });
    } catch (error) {
        console.error("Update transaction error:", error);

        if (error instanceof Error && error.message === "TRANSACTION_NOT_EDITABLE") {
            return res.status(403).json({ message: "Only draft transactions can be edited" });
        }

        if (error instanceof Error && error.message === "TRANSACTION_NOT_FOUND") {
            return res.status(404).json({ message: "Transaction not found" });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateTransactionEmployee = (req: AuthRequest, res: Response) =>
    updateTransaction(req, res, false);

export const updateTransactionAdmin = (req: AuthRequest, res: Response) =>
    updateTransaction(req, res, true);

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const transactionId = Number(req.params.transactionId);
        const userId = req.user.userId;

        await db.transaction(async (tx) => {
            const [transaction] = await tx
                .select({
                    id: pettyCashTransactionsTable.id,
                    status: pettyCashTransactionsTable.status,
                })
                .from(pettyCashTransactionsTable)
                .where(
                    and(
                        eq(pettyCashTransactionsTable.id, transactionId),
                        eq(pettyCashTransactionsTable.requesterId, userId),
                        eq(pettyCashTransactionsTable.status, "DRAFT")
                    )
                )
                .limit(1);

            if (!transaction) {
                throw new Error("TRANSACTION_NOT_FOUND");
            }

            await tx
                .delete(pettyCashTransactionsTable)
                .where(
                    eq(pettyCashTransactionsTable.id, transactionId)
                );
        });

        return res.status(200).json({
            message: "Transaction deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete transaction error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const deleteTransactionAdmin = async (req: AuthRequest, res: Response) => {
    try {
        const transactionId = Number(req.params.transactionId);

        await db.transaction(async (tx) => {
            const [transaction] = await tx
                .select({
                    id: pettyCashTransactionsTable.id,
                })
                .from(pettyCashTransactionsTable)
                .where(
                    eq(pettyCashTransactionsTable.id, transactionId),
                )
                .limit(1);

            if (!transaction) {
                throw new Error("TRANSACTION_NOT_FOUND");
            }

            await tx
                .delete(pettyCashTransactionsTable)
                .where(
                    eq(pettyCashTransactionsTable.id, transactionId)
                );
        });

        return res.status(200).json({
            message: "Transaction deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete transaction error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
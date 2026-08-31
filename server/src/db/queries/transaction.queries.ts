import { eq, desc, sql } from "drizzle-orm";
import { db } from "@db";
import {
    pettyCashTransactionsTable,
    transactionDocumentsTable,
    pettyCashCategoriesTable,
    transactionStatusHistoryTable
} from "@schema";

export const getUserTransactionsByUserId = async (userId: number) => {
    return db
        .select({
            id: pettyCashTransactionsTable.id,
            transactionNumber: pettyCashTransactionsTable.transactionNumber,
            category: pettyCashCategoriesTable.name,
            amount: pettyCashTransactionsTable.amount,
            description: pettyCashTransactionsTable.description,
            status: transactionStatusHistoryTable.toStatus,
            submittedAt: sql<string>`TO_CHAR(${pettyCashTransactionsTable.submittedAt}, 'YYYY-MM-DD')`,
            createdAt: sql<string>`TO_CHAR(${pettyCashTransactionsTable.createdAt}, 'YYYY-MM-DD')`,
            documents: sql<string[]>`
                        COALESCE(
                            ARRAY_AGG(${transactionDocumentsTable.originalName})
                            FILTER (WHERE ${transactionDocumentsTable.id} IS NOT NULL),
                            ARRAY[]::text[]
                        )
                    `,
        })
        .from(pettyCashTransactionsTable)

        .leftJoin(
            pettyCashCategoriesTable,
            eq(
                pettyCashTransactionsTable.categoryId,
                pettyCashCategoriesTable.id
            )
        )

        .leftJoin(
            transactionDocumentsTable,
            eq(
                pettyCashTransactionsTable.id,
                transactionDocumentsTable.transactionId
            )
        )

        .leftJoin(
            transactionStatusHistoryTable,
            eq(
                pettyCashTransactionsTable.id,
                transactionStatusHistoryTable.transactionId
            )
        )

        .where(
            eq(
                pettyCashTransactionsTable.requesterId,
                userId
            )
        )

        .groupBy(
            pettyCashTransactionsTable.id,
            pettyCashTransactionsTable.transactionNumber,
            pettyCashCategoriesTable.name,
            pettyCashTransactionsTable.amount,
            pettyCashTransactionsTable.description,
            transactionStatusHistoryTable.toStatus,
            pettyCashTransactionsTable.submittedAt,
            pettyCashTransactionsTable.createdAt
        )

        .orderBy(
            desc(pettyCashTransactionsTable.createdAt)
        );
}

export type UserTransactions = NonNullable<
    Awaited<ReturnType<typeof getUserTransactionsByUserId>>
>;

export type UserTransaction = UserTransactions[number];
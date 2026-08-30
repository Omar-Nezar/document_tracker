import { eq, desc, sql } from "drizzle-orm";
import { db } from "@db";
import {
    pettyCashTransactionsTable,
    transactionDocumentsTable,
    pettyCashCategoriesTable,
} from "@schema";

export const getUserTransactionsByUserId = async (userId: number) => {
    return db
        .select({
            transactionNumber: pettyCashTransactionsTable.transactionNumber,
            category: pettyCashCategoriesTable.name,
            amount: pettyCashTransactionsTable.amount,
            description: pettyCashTransactionsTable.description,
            status: pettyCashTransactionsTable.status,
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
            pettyCashTransactionsTable.status,
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
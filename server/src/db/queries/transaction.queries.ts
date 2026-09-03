import { eq, desc, sql, and } from "drizzle-orm";
import { db } from "@db";
import {
    pettyCashTransactionsTable,
    transactionDocumentsTable,
    pettyCashCategoriesTable,
    transactionStatusHistoryTable,
    usersTable
} from "@schema";

export const getUserTransactionsByUserId = async (userId: number) => {
    const latestStatus = db
        .select({
            toStatus: transactionStatusHistoryTable.toStatus,
        })
        .from(transactionStatusHistoryTable)
        .where(
            eq(
                transactionStatusHistoryTable.transactionId,
                pettyCashTransactionsTable.id
            )
        )
        .orderBy(
            desc(transactionStatusHistoryTable.createdAt),
            desc(transactionStatusHistoryTable.id)
        )
        .limit(1)
        .as("latest_status");

    return db
        .select({
            id: pettyCashTransactionsTable.id,
            transactionNumber: pettyCashTransactionsTable.transactionNumber,
            categoryId: pettyCashTransactionsTable.categoryId,
            category: pettyCashCategoriesTable.name,
            amount: pettyCashTransactionsTable.amount,
            description: pettyCashTransactionsTable.description,
            status: latestStatus.toStatus,
            submittedAt: sql<string>`TO_CHAR(${pettyCashTransactionsTable.submittedAt}, 'YYYY-MM-DD')`,
            createdAt: sql<string>`TO_CHAR(${pettyCashTransactionsTable.createdAt}, 'YYYY-MM-DD')`,
            updatedAt: sql<string>`TO_CHAR(${pettyCashTransactionsTable.updatedAt}, 'YYYY-MM-DD')`,
            documents: sql<string[]>`
                        COALESCE(
                            ARRAY_AGG(${transactionDocumentsTable.originalName})
                            FILTER (WHERE ${transactionDocumentsTable.id} IS NOT NULL),
                            ARRAY[]::text[]
                        )
                    `,
        })
        .from(pettyCashTransactionsTable)

        .innerJoin(
            usersTable,
            eq(
                pettyCashTransactionsTable.requesterId,
                usersTable.id
            )
        )

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

        .leftJoinLateral(
            latestStatus,
            sql`true`
        )

        .where(
            and(
                eq(pettyCashTransactionsTable.requesterId, userId),
                eq(usersTable.isActive, true)
            )
        )

        .groupBy(
            pettyCashTransactionsTable.id,
            pettyCashTransactionsTable.transactionNumber,
            pettyCashTransactionsTable.categoryId,
            pettyCashCategoriesTable.name,
            pettyCashTransactionsTable.amount,
            pettyCashTransactionsTable.description,
            latestStatus.toStatus,
            pettyCashTransactionsTable.submittedAt,
            pettyCashTransactionsTable.createdAt
        )

        .orderBy(
            desc(pettyCashTransactionsTable.createdAt)
        );
}

export const getAllTransactions = async () => {
    const latestStatus = db
        .select({
            toStatus: transactionStatusHistoryTable.toStatus,
        })
        .from(transactionStatusHistoryTable)
        .where(
            eq(
                transactionStatusHistoryTable.transactionId,
                pettyCashTransactionsTable.id
            )
        )
        .orderBy(
            desc(transactionStatusHistoryTable.createdAt),
            desc(transactionStatusHistoryTable.id)
        )
        .limit(1)
        .as("latest_status");

    return db
        .select({
            id: pettyCashTransactionsTable.id,
            transactionNumber: pettyCashTransactionsTable.transactionNumber,
            requesterId: pettyCashTransactionsTable.requesterId,
            email: usersTable.email,
            categoryId: pettyCashTransactionsTable.categoryId,
            category: pettyCashCategoriesTable.name,
            amount: pettyCashTransactionsTable.amount,
            description: pettyCashTransactionsTable.description,
            status: latestStatus.toStatus,
            submittedAt: sql<string>`TO_CHAR(${pettyCashTransactionsTable.submittedAt}, 'YYYY-MM-DD')`,
            createdAt: sql<string>`TO_CHAR(${pettyCashTransactionsTable.createdAt}, 'YYYY-MM-DD')`,
            updatedAt: sql<string>`TO_CHAR(${pettyCashTransactionsTable.updatedAt}, 'YYYY-MM-DD')`,
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
            usersTable,
            eq(
                pettyCashTransactionsTable.requesterId,
                usersTable.id
            )
        )

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

        .leftJoinLateral(
            latestStatus,
            sql`true`
        )

        .groupBy(
            pettyCashTransactionsTable.id,
            pettyCashTransactionsTable.transactionNumber,
            pettyCashTransactionsTable.requesterId,
            usersTable.email,
            pettyCashTransactionsTable.categoryId,
            pettyCashCategoriesTable.name,
            pettyCashTransactionsTable.amount,
            pettyCashTransactionsTable.description,
            latestStatus.toStatus,
            pettyCashTransactionsTable.submittedAt,
            pettyCashTransactionsTable.createdAt,
            pettyCashTransactionsTable.updatedAt
        )

        .orderBy(
            desc(pettyCashTransactionsTable.createdAt)
        );
}

export type UserTransactions = NonNullable<
    Awaited<ReturnType<typeof getAllTransactions>>
>;

export type UserTransaction = UserTransactions[number];
import { eq, desc, sql } from "drizzle-orm";
import { db } from "@db";
import {
    pettyCashTransactionsTable,
    transactionDocumentsTable,
    pettyCashCategoriesTable,
    transactionStatusHistoryTable,
    departmentsTable,
    branchesTable,
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
            category: pettyCashCategoriesTable.name,
            amount: pettyCashTransactionsTable.amount,
            description: pettyCashTransactionsTable.description,
            status: latestStatus.toStatus,
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

        .leftJoinLateral(
            latestStatus,
            sql`true`
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
            department: departmentsTable.name,
            branch: branchesTable.name,
            category: pettyCashCategoriesTable.name,
            amount: pettyCashTransactionsTable.amount,
            description: pettyCashTransactionsTable.description,
            status: latestStatus.toStatus,
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
            usersTable,
            eq(
                pettyCashTransactionsTable.requesterId,
                usersTable.id
            )
        )

        .leftJoin(
            departmentsTable,
            eq(
                usersTable.departmentId,
                departmentsTable.id
            )
        )

        .leftJoin(
            branchesTable,
            eq(
                usersTable.branchId,
                branchesTable.id
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
            departmentsTable.name,
            branchesTable.name,
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

export type UserTransactions = NonNullable<
    Awaited<ReturnType<typeof getAllTransactions>>
>;

export type UserTransaction = UserTransactions[number];
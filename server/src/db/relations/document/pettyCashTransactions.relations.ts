import * as schema from "@/db/schema";
import { relations } from "drizzle-orm";

export const pettyCashTransactionsRelations = relations(
    schema.pettyCashTransactionsTable,
    ({ one, many }) => ({
        requester: one(schema.usersTable, {
            fields: [
                schema.pettyCashTransactionsTable.requesterId,
            ],
            references: [schema.usersTable.id],
        }),

        department: one(schema.departmentsTable, {
            fields: [
                schema.pettyCashTransactionsTable.departmentId,
            ],
            references: [schema.departmentsTable.id],
        }),

        branch: one(schema.branchesTable, {
            fields: [
                schema.pettyCashTransactionsTable.branchId,
            ],
            references: [schema.branchesTable.id],
        }),

        category: one(
            schema.pettyCashCategoriesTable,
            {
                fields: [
                    schema.pettyCashTransactionsTable.categoryId,
                ],
                references: [
                    schema.pettyCashCategoriesTable.id,
                ],
            }
        ),

        documents: many(
            schema.transactionDocumentsTable
        ),

        statusHistory: many(
            schema.transactionStatusHistoryTable
        ),

        comments: many(
            schema.transactionCommentsTable
        ),
    })
);
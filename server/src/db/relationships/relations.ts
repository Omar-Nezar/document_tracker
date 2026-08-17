import * as schema from "../schema";
import { relations } from "drizzle-orm";

export const usersRelations = relations(
    schema.usersTable,
    ({ one, many }) => ({
        role: one(schema.rolesTable, {
            fields: [schema.usersTable.roleId],
            references: [schema.rolesTable.id],
        }),
        department: one(schema.departmentsTable, {
            fields: [schema.usersTable.departmentId],
            references: [schema.departmentsTable.id],
        }),

        branch: one(schema.branchesTable, {
            fields: [schema.usersTable.branchId],
            references: [schema.branchesTable.id],
        }),

        transactions: many(
            schema.pettyCashTransactionsTable
        ),

        comments: many(
            schema.transactionCommentsTable
        ),
    })
);

export const rolesRelations = relations(
    schema.rolesTable,
    ({ many }) => ({
        users: many(schema.usersTable),
    })
);


export const departmentsRelations = relations(
    schema.departmentsTable,
    ({ many }) => ({
        users: many(schema.usersTable),

        transactions: many(
            schema.pettyCashTransactionsTable
        ),
    })
);


export const branchesRelations = relations(
    schema.branchesTable,
    ({ many }) => ({
        users: many(schema.usersTable),

        transactions: many(
            schema.pettyCashTransactionsTable
        ),
    })
);


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


export const pettyCashCategoriesRelations = relations(
    schema.pettyCashCategoriesTable,
    ({ many }) => ({
        transactions: many(
            schema.pettyCashTransactionsTable
        ),
    })
);


export const documentTypesRelations = relations(
    schema.documentTypesTable,
    ({ many }) => ({
        documents: many(
            schema.transactionDocumentsTable
        ),
    })
);


export const transactionDocumentsRelations = relations(
    schema.transactionDocumentsTable,
    ({ one }) => ({
        transaction: one(
            schema.pettyCashTransactionsTable,
            {
                fields: [
                    schema.transactionDocumentsTable.transactionId,
                ],
                references: [
                    schema.pettyCashTransactionsTable.id,
                ],
            }
        ),

        documentType: one(schema.documentTypesTable, {
            fields: [
                schema.transactionDocumentsTable.documentTypeId,
            ],
            references: [
                schema.documentTypesTable.id,
            ],
        }),

        uploader: one(schema.usersTable, {
            fields: [
                schema.transactionDocumentsTable.uploadedBy,
            ],
            references: [
                schema.usersTable.id,
            ],
        }),
    })
);


export const transactionStatusHistoryRelations = relations(
    schema.transactionStatusHistoryTable,
    ({ one }) => ({
        transaction: one(
            schema.pettyCashTransactionsTable,
            {
                fields: [
                    schema.transactionStatusHistoryTable.transactionId,
                ],
                references: [
                    schema.pettyCashTransactionsTable.id,
                ],
            }
        ),

        user: one(schema.usersTable, {
            fields: [
                schema.transactionStatusHistoryTable.changedBy,
            ],
            references: [schema.usersTable.id],
        }),
    })
);


export const transactionCommentsRelations = relations(
    schema.transactionCommentsTable,
    ({ one }) => ({
        transaction: one(
            schema.pettyCashTransactionsTable,
            {
                fields: [
                    schema.transactionCommentsTable.transactionId,
                ],
                references: [
                    schema.pettyCashTransactionsTable.id,
                ],
            }
        ),

        user: one(schema.usersTable, {
            fields: [
                schema.transactionCommentsTable.userId,
            ],
            references: [schema.usersTable.id],
        }),
    })
);
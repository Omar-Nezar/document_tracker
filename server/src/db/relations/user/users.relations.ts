import * as schema from "@/db/schema";
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
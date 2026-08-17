import {
    pgTable,
    serial,
    integer,
    text,
    varchar,
    decimal,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.schema";
import { departmentsTable } from "./departments.schema";
import { branchesTable } from "./branches.schema";
import { pettyCashCategoriesTable } from "./pettyCashCategories.schema";

export const transactionStatusEnum = pgEnum(
    "transaction_status",
    [
        "DRAFT",
        "SUBMITTED",
        "PENDING_APPROVAL",
        "APPROVED",
        "REJECTED",
        "SENT_TO_FINANCE",
        "FINANCE_PROCESSING",
        "RETURNED",
        "RESUBMITTED",
        "COMPLETED",
        "CANCELLED",
    ]
);

export const pettyCashTransactionsTable = pgTable(
    "petty_cash_transactions",
    {
        id: serial("id")
            .primaryKey(),
        transactionNumber: varchar("transaction_number", {
            length: 30,
        })
            .notNull()
            .unique(),
        requesterId: integer("requester_id")
            .references(() => usersTable.id)
            .notNull(),
        departmentId: integer("department_id")
            .references(() => departmentsTable.id)
            .notNull(),
        branchId: integer("branch_id")
            .references(() => branchesTable.id)
            .notNull(),
        categoryId: integer("category_id")
            .references(() => pettyCashCategoriesTable.id)
            .notNull(),
        amount: decimal("amount", {
            precision: 12,
            scale: 3,
        })
            .notNull(),
        description: text("description")
            .notNull(),
        status: transactionStatusEnum("status")
            .default("DRAFT")
            .notNull(),
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
        submittedAt: timestamp("submitted_at"),
        completedAt: timestamp("completed_at"),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .notNull(),
    }
);

export type PettyCashTransaction = typeof pettyCashTransactionsTable.$inferSelect;
export type NewPettyCashTransaction = typeof pettyCashTransactionsTable.$inferInsert;
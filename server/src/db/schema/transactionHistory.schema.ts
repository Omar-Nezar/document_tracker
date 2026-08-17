import {
    pgTable,
    serial,
    integer,
    text,
    timestamp,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.schema";
import { pettyCashTransactionsTable, transactionStatusEnum } from "./pettyCashTransactions.schema";

export const transactionStatusHistoryTable = pgTable(
    "transaction_status_history",
    {
        id: serial("id")
            .primaryKey(),
        transactionId: integer("transaction_id")
            .references(() => pettyCashTransactionsTable.id)
            .notNull(),
        fromStatus: transactionStatusEnum("from_status"),
        toStatus: transactionStatusEnum("to_status")
            .notNull(),
        changedBy: integer("changed_by")
            .references(() => usersTable.id)
            .notNull(),
        comment: text("comment"),
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    }
);
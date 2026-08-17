import {
    pgTable,
    serial,
    integer,
    text,
    timestamp,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.schema";
import { pettyCashTransactionsTable } from "./pettyCashTransactions.schema";

export const transactionCommentsTable = pgTable(
    "transaction_comments",
    {
        id: serial("id")
            .primaryKey(),
        transactionId: integer("transaction_id")
            .references(() => pettyCashTransactionsTable.id)
            .notNull(),
        userId: integer("user_id")
            .references(() => usersTable.id)
            .notNull(),
        comment: text("comment")
            .notNull(),
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    }
);
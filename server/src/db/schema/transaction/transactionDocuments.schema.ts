import {
    pgTable,
    serial,
    integer,
    text,
    varchar,
    timestamp,
} from "drizzle-orm/pg-core";
import { usersTable } from "../user/users.schema";
import { pettyCashTransactionsTable } from "./pettyCashTransactions.schema";

export const transactionDocumentsTable = pgTable(
    "transaction_documents",
    {
        id: serial("id")
            .primaryKey(),
        transactionId: integer(
            "transaction_id"
        )
            .notNull()
            .references(
                () => pettyCashTransactionsTable.id,
                {
                    onDelete: "cascade",
                }
            ),
        originalName: varchar("original_name", { length: 255 })
            .notNull(),
        storedName: varchar("stored_name", { length: 255 })
            .notNull(),
        filePath: text("file_path")
            .notNull(),
        fileSize: integer("file_size")
            .notNull(),
        mimeType: varchar("mime_type", {
            length: 100,
        }),
        uploadedAt: timestamp("uploaded_at")
            .defaultNow()
            .notNull(),
        verifiedBy: integer("verified_by")
            .references(() => usersTable.id),
        verifiedAt: timestamp("verified_at"),
    }
);

export type TransactionDocument = typeof transactionDocumentsTable.$inferSelect;
export type NewTransactionDocument = typeof transactionDocumentsTable.$inferInsert;
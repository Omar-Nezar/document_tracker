import {
    pgTable,
    serial,
    integer,
    text,
    varchar,
    timestamp,
} from "drizzle-orm/pg-core";
import { usersTable } from "../user/users.schema";
import { pettyCashTransactionsTable } from "../document/pettyCashTransactions.schema";
import { documentTypesTable } from "../document/documentTypes.schema";

export const transactionDocumentsTable = pgTable(
    "transaction_documents",
    {
        id: serial("id")
            .primaryKey(),
        transactionId: integer("transaction_id")
            .references(() => pettyCashTransactionsTable.id)
            .notNull(),
        documentTypeId: integer("document_type_id")
            .references(() => documentTypesTable.id)
            .notNull(),
        fileName: varchar("file_name", {
            length: 255,
        })
            .notNull(),
        filePath: text("file_path")
            .notNull(),
        mimeType: varchar("mime_type", {
            length: 100,
        }),
        fileSize: integer("file_size"),
        uploadedBy: integer("uploaded_by")
            .references(() => usersTable.id)
            .notNull(),
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
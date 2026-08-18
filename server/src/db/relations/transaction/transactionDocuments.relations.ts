import * as schema from "@/db/schema";
import { relations } from "drizzle-orm";

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
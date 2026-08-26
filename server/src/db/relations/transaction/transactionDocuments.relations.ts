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
    })
);
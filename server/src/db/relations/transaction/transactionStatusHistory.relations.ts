import * as schema from "@/db/schema";
import { relations } from "drizzle-orm";

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
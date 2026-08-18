import * as schema from "@/db/schema";
import { relations } from "drizzle-orm";

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
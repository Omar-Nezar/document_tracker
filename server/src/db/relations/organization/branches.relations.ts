import * as schema from "@/db/schema";
import { relations } from "drizzle-orm";

export const branchesRelations = relations(
    schema.branchesTable,
    ({ many }) => ({
        users: many(schema.usersTable),

        transactions: many(
            schema.pettyCashTransactionsTable
        ),
    })
);
import * as schema from "@/db/schema";
import { relations } from "drizzle-orm";

export const departmentsRelations = relations(
    schema.departmentsTable,
    ({ many }) => ({
        users: many(schema.usersTable),

        transactions: many(
            schema.pettyCashTransactionsTable
        ),
    })
);
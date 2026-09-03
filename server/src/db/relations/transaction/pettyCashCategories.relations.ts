import * as schema from "@/db/schema";
import { relations } from "drizzle-orm";

export const pettyCashCategoriesRelations = relations(
    schema.pettyCashCategoriesTable,
    ({ many }) => ({
        transactions: many(
            schema.pettyCashTransactionsTable
        ),
    })
);
import * as schema from "@/db/schema";
import { relations } from "drizzle-orm";

export const documentTypesRelations = relations(
    schema.documentTypesTable,
    ({ many }) => ({
        documents: many(
            schema.transactionDocumentsTable
        ),
    })
);
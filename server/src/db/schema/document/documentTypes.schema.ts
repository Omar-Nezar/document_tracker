import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const documentTypesTable = pgTable(
    "document_types",
    {
        id: serial("id")
            .primaryKey(),
        name: text("name")
            .notNull()
            .unique(),
        description: text("description"),
        isRequired: boolean("is_required")
            .default(false)
            .notNull(),
        isActive: boolean("is_active")
            .default(true)
            .notNull(),
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    }
);

export type DocumentType = typeof documentTypesTable.$inferSelect;
export type NewDocumentType = typeof documentTypesTable.$inferInsert;
import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const pettyCashCategoriesTable = pgTable(
    "petty_cash_categories",
    {
        id: serial("id")
            .primaryKey(),
        name: text("name")
            .notNull()
            .unique(),
        description: text("description"),
        isActive: boolean("is_active")
            .default(true)
            .notNull(),
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    }
);

export type PettyCashCategory = typeof pettyCashCategoriesTable.$inferSelect;
export type NewPettyCashCategory = typeof pettyCashCategoriesTable.$inferInsert;
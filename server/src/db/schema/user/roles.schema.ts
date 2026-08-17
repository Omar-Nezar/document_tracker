import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const rolesTable = pgTable("roles", {
    id: serial("id").primaryKey(),
    name: varchar("name", {
        length: 50,
    })
        .notNull()
        .unique(),
    description: text("description"),
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
});

export type Role = typeof rolesTable.$inferSelect;
export type NewRole = typeof rolesTable.$inferInsert;
import { pgTable, serial, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const departmentsTable = pgTable("departments", {
    id: serial("id")
        .primaryKey(),
    name: text("name")
        .notNull()
        .unique(),
    code: varchar("code", {
        length: 20,
    })
        .notNull()
        .unique(),
    isActive: boolean("is_active")
        .default(true)
        .notNull(),
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
});

export type Department = typeof departmentsTable.$inferSelect;
export type NewDepartment = typeof departmentsTable.$inferInsert;
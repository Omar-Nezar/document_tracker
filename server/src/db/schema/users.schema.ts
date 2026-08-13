import { pgTable, serial, text, pgEnum, timestamp } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin", "manager"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Infer TypeScript types for usage in your controllers/forms
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
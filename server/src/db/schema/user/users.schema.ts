import { pgTable, serial, integer, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { departmentsTable } from "../organization/departments.schema";
import { branchesTable } from "../organization/branches.schema";
import { rolesTable } from "./roles.schema";

export const usersTable = pgTable("users", {
  id: serial("id")
    .primaryKey(),
  name: text("name")
    .notNull(),
  email: text("email")
    .notNull()
    .unique(),
  password: text("password")
    .notNull(),
  roleId: integer("role_id")
    .references(() => rolesTable.id)
    .default(1)
    .notNull(),
  departmentId: integer("department_id")
    .references(() => departmentsTable.id),
  branchId: integer("branch_id")
    .references(() => branchesTable.id),
  isActive: boolean("is_active")
    .default(true)
    .notNull(),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
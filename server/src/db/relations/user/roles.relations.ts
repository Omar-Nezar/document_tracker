import * as schema from "@/db/schema";
import { relations } from "drizzle-orm";

export const rolesRelations = relations(
    schema.rolesTable,
    ({ many }) => ({
        users: many(schema.usersTable),
    })
);
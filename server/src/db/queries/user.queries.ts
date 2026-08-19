import { eq } from "drizzle-orm";
import { db } from "@db";
import { usersTable } from "@schema";

export const getUserWithRoleByEmail = async (email: string) => {
    return db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
        with: {
            role: true,
        },
    });
};

export type UserWithRole = NonNullable<
    Awaited<ReturnType<typeof getUserWithRoleByEmail>>
>;
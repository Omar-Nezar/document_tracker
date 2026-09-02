import { eq, desc, sql } from "drizzle-orm";
import { db } from "@db";
import {
    usersTable,
    rolesTable,
    departmentsTable,
    branchesTable
} from "@schema";

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

export const getAllUsers = async () => {
    return db
        .select({
            id: usersTable.id,
            name: usersTable.name,
            email: usersTable.email,
            role: rolesTable.name,
            department: departmentsTable.name,
            branch: branchesTable.name,
            isactive: usersTable.isActive,
            createdAt: sql<string>`TO_CHAR(${usersTable.createdAt}, 'YYYY-MM-DD')`,
        })
        .from(usersTable)
        .leftJoin(
            rolesTable,
            eq(usersTable.roleId, rolesTable.id)
        )
        .leftJoin(
            departmentsTable,
            eq(usersTable.departmentId, departmentsTable.id)
        )
        .leftJoin(
            branchesTable,
            eq(usersTable.branchId, branchesTable.id)
        )
        .orderBy(
            desc(usersTable.id)
        );
};

export type AllUsers = NonNullable<
    Awaited<ReturnType<typeof getAllUsers>>
>; 

export type User = AllUsers[number];
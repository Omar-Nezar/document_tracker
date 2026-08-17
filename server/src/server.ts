import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import cors from "cors"

import { eq } from 'drizzle-orm';
import { db } from './db/db';
import * as schema from "./db/schema";

import adminRoutes from "./routes/admin.routes"

const app = express();
app.use(express.json());

app.use(
    cors({
        // origin: "http://localhost:5173", // frontend URL
        // credentials: true, to be enabled later for security
    })
);

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});

app.get("/", (req: Request, res: Response) => {
    res.send("API is running...");
});

app.use("/admin", adminRoutes)

/*
 *  Sample script demo
 */
async function main() {
    const user: typeof schema.usersTable.$inferInsert = {
        name: 'John',
        email: 'john@example.com',
        password: "password",
        roleId: 1,
        isActive: true,
    };

    await db.insert(schema.usersTable).values(user);
    console.log('New user created!')

    const users = await db.select().from(schema.usersTable);
    console.log('Getting all users from the database: ', users)

    await db
        .update(schema.usersTable)
        .set({
            name: 'Jonathan',
        })
        .where(eq(schema.usersTable.email, user.email));
    console.log('User info updated!')
    const res = await db.select({name: schema.usersTable.name}).from(schema.usersTable).where(eq(schema.usersTable.email, user.email))
    const newUser = res[0]?.name;
    console.log('New Name: ', newUser );

    await db.delete(schema.usersTable).where(eq(schema.usersTable.email, user.email));
    console.log('User deleted!')
}

main();

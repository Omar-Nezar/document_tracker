// This file is used to seed the database with initial data.
// Run: npm run db:seed

import "dotenv/config";

import { db } from "@db";

import {
    departmentsTable,
    branchesTable,
} from "@schema";


const departments = [
    {
        name: "Administration",
        code: "ADMIN",
    },
    {
        name: "Finance",
        code: "FIN",
    },
    {
        name: "Human Resources",
        code: "HR",
    },
    {
        name: "Information Technology",
        code: "IT",
    },
    {
        name: "Sales",
        code: "SALES",
    },
    {
        name: "After Sales",
        code: "AFTERSALES",
    },
    {
        name: "Service",
        code: "SERVICE",
    },
    {
        name: "Parts",
        code: "PARTS",
    },
    {
        name: "Body Shop",
        code: "BODY",
    },
    {
        name: "Marketing",
        code: "MKT",
    },
    {
        name: "Procurement",
        code: "PROC",
    },
];


const branches = [
    {
        name: "Muscat",
        code: "MCT",
    },
    {
        name: "Sohar",
        code: "SOH",
    },
    {
        name: "Salalah",
        code: "SLL",
    },
    {
        name: "Sur",
        code: "SUR",
    },
    {
        name: "Ibri",
        code: "IBR",
    },
    {
        name: "Nizwa",
        code: "NIZ",
    },
];


async function seed() {
    console.log("Seeding database...");

    await db
        .insert(departmentsTable)
        .values(departments)
        .onConflictDoNothing();

    await db
        .insert(branchesTable)
        .values(branches)
        .onConflictDoNothing();

    console.log("Seed complete.");

    process.exit(0);
}


seed().catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
});
import { z } from "zod";

export const createTransactionSchema =
    z.object({
        amount: z
            .number()
            .positive("Amount must be greater than 0"),

        categoryId: z
            .number()
            .int()
            .positive("Category is required"),

        description: z
            .string()
            .trim()
            .min(
                5,
                "Description must be at least 5 characters"
            ),
    });

export type CreateTransactionForm = z.infer<typeof createTransactionSchema>;
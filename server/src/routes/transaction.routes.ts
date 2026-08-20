import { Router } from "express";
import { protect } from "@/middleware/auth.middleware";
import {
    createTransaction,
} from "@/controllers/transaction.controller";

const router = Router();

router.post("/create", protect, createTransaction);

export default router;
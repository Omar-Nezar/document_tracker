import { Router } from "express";
import { protect } from "@/middleware/auth.middleware";
import {
    createTransaction,
    getUserTransactions,
} from "@/controllers/transaction.controller";
import { uploadDocuments } from "@/middleware/upload.middleware";

const router = Router();

router.post("/create", protect,
    uploadDocuments.array(
        "documents",
        5
    ),
    createTransaction
);
router.get("/getUserTransactions", protect, getUserTransactions);

export default router;
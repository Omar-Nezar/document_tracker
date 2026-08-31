import { Router } from "express";
import { protect } from "@/middleware/auth.middleware";
import {
    createTransaction,
    getUserTransactions,
    deleteTransaction,
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
router.delete("/deleteTransaction/:transactionId", protect, deleteTransaction);

export default router;
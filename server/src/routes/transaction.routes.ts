import { Router } from "express";
import { protect } from "@/middleware/auth.middleware";
import {
    createTransaction,
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

export default router;
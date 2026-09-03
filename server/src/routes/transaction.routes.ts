import { Router } from "express";
import {
    protect,
    employeeOnly,
    adminOnly,
} from "@/middleware/auth.middleware";
import {
    createTransaction,
    getUserTransactions,
    getTransactions,
    updateTransactionEmployee,
    updateTransactionAdmin,
    deleteTransaction,
    deleteTransactionAdmin,
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
router.get("/getUserTransactions", protect, employeeOnly, getUserTransactions);
router.get("/getTransactions", protect, adminOnly, getTransactions);
router.put("/updateTransaction/:transactionId", protect,
    employeeOnly,
    uploadDocuments.array("documents", 5),
    updateTransactionEmployee
);
router.put("/updateTransactionAdmin/:transactionId", protect,
    adminOnly,
    uploadDocuments.array("documents", 5),
    updateTransactionAdmin
);
router.delete("/deleteTransaction/:transactionId", protect, employeeOnly, deleteTransaction);
router.delete("/deleteTransactionAdmin/:transactionId", protect, adminOnly, deleteTransactionAdmin);

export default router;
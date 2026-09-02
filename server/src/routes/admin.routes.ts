import express from "express";

import { 
    getUsers,
    delUser 
} from "../controllers/admin.controller";
import { adminOnly, protect } from "@/middleware/auth.middleware";

const router = express.Router();

router.get("/getUsers", protect, adminOnly, getUsers);
router.delete("/deleteUser/:id", protect, adminOnly, delUser);

export default router;
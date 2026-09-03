import express from "express";

import { 
    getUsers,
    delUser,
    disableUser,
} from "../controllers/admin.controller";
import { adminOnly, protect } from "@/middleware/auth.middleware";

const router = express.Router();

router.get("/getUsers", protect, adminOnly, getUsers);
router.patch("/disableUser/:id", protect, adminOnly, disableUser);
router.delete("/deleteUser/:id", protect, adminOnly, delUser);

export default router;
import express from "express";

import { getUsers } from "../controllers/admin.controller";

const router = express.Router();

router.get("/getUsers", getUsers);

export default router;
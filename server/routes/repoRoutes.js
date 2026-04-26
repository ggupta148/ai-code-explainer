import express from "express";
import { addRepo } from "../controllers/repoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addRepo);

export default router;
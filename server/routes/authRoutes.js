import express from "express";
import { register } from "../controllers/authController.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", register);
router.get("/get-users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
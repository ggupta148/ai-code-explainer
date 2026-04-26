import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import repoRoutes from "./routes/repoRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

app.get("/", (req, res) => {
  res.send("API Running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/repo", repoRoutes);

export default app;
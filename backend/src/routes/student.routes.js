import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// Example route
router.get("/", authMiddleware, authorize("admin"), (req, res) => {
  res.json({ message: "Student routes working" });
});

export default router;

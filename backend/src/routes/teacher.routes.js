import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, authorize("admin"), (req, res) => {
  res.json({ message: "Teacher routes working" });
});

export default router;

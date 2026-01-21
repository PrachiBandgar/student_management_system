import express from "express";
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment
} from "../controllers/assignment.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAssignments);
router.get("/course/:courseId", authMiddleware, getAssignments);
router.post("/", authMiddleware, createAssignment);
router.put("/:id", authMiddleware, updateAssignment);
router.delete("/:id", authMiddleware, deleteAssignment);

export default router;

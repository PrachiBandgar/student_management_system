import express from "express";
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment
} from "../controllers/assignment.controller.js";

const router = express.Router();

/**
 * GET /api/assignments
 * Get all assignments (Teacher / Student / Admin)
 */
router.get("/", getAssignments);

/**
 * GET /api/assignments/course/:courseId
 * Get assignments for a specific course
 */
router.get("/course/:courseId", getAssignments);

/**
 * POST /api/assignments
 * Create a new assignment (Teacher)
 */
router.post("/", createAssignment);

/**
 * PUT /api/assignments/:id
 * Update an assignment
 */
router.put("/:id", updateAssignment);

/**
 * DELETE /api/assignments/:id
 * Delete an assignment
 */
router.delete("/:id", deleteAssignment);

export default router;

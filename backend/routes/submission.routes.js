import express from "express";
import {
  submitAssignment,
  getSubmissions,
  getSubmissionsByAssignment
} from "../controllers/submission.controller.js";

const router = express.Router();

/**
 * POST /api/submissions
 * Student submits an assignment
 */
router.post("/", submitAssignment);

/**
 * GET /api/submissions
 * Get all submissions (Admin / Teacher)
 */
router.get("/", getSubmissions);

/**
 * GET /api/submissions/assignment/:assignmentId
 * Get submissions for a specific assignment
 */
router.get("/assignment/:assignmentId", getSubmissionsByAssignment);

export default router;

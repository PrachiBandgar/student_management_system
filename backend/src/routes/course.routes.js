import express from "express";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse
} from "../controllers/course.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/courses - Get all courses
router.get("/", authMiddleware, getCourses);

// POST /api/courses - Create a new course
router.post("/", authMiddleware, createCourse);

// PUT /api/courses/:id - Update a course
router.put("/:id", authMiddleware, updateCourse);

// DELETE /api/courses/:id - Delete a course
router.delete("/:id", authMiddleware, deleteCourse);

export default router;

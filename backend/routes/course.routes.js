import express from "express";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse
} from "../controllers/course.controller.js";

const router = express.Router();

/**
 * GET /api/courses
 * Get all courses (Teacher / Student / Admin)
 */
router.get("/", getCourses);

/**
 * POST /api/courses
 * Create a new course (Teacher)
 */
router.post("/", createCourse);

/**
 * PUT /api/courses/:id
 * Update a course
 */
router.put("/:id", updateCourse);

/**
 * DELETE /api/courses/:id
 * Delete a course
 */
router.delete("/:id", deleteCourse);

export default router;

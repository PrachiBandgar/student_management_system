import express from "express";
import {
  getAdminDashboardData,
  getTeacherDashboardData,
  getStudentDashboardData,
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
  createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment
} from "../controllers/dashboard.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Dashboard data endpoints
router.get("/admin", authMiddleware, getAdminDashboardData);
router.get("/teacher", authMiddleware, getTeacherDashboardData);
router.get("/student", authMiddleware, getStudentDashboardData);

// Course CRUD endpoints
router.post("/courses", authMiddleware, createCourse);
router.get("/courses", authMiddleware, getCourses);
router.put("/courses/:id", authMiddleware, updateCourse);
router.delete("/courses/:id", authMiddleware, deleteCourse);

// Assignment CRUD endpoints
router.post("/assignments", authMiddleware, createAssignment);
router.get("/assignments", authMiddleware, getAssignments);
router.put("/assignments/:id", authMiddleware, updateAssignment);
router.delete("/assignments/:id", authMiddleware, deleteAssignment);

export default router;

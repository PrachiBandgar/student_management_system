import express from "express";
import {
  getAllUsers,
  getStudents,
  getTeachers,
  createTeacher,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all users (admin only)
router.get("/", authMiddleware, getAllUsers);

// Get students only
router.get("/students", authMiddleware, getStudents);

// Get teachers only
router.get("/teachers", authMiddleware, getTeachers);

// Create teacher
router.post("/teachers", authMiddleware, createTeacher);

// Get user by ID
router.get("/:id", authMiddleware, getUserById);

// Update user
router.put("/:id", authMiddleware, updateUser);

// Delete user
router.delete("/:id", authMiddleware, deleteUser);

export default router;

import express from 'express';
import { getSubmissions, createSubmission, submitAssignment, updateSubmission, deleteSubmission } from '../controllers/submission.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/submissions - Get all submissions
router.get('/', authMiddleware, getSubmissions);

// GET /api/submissions/assignment/:assignmentId - Get submissions by assignment
router.get('/assignment/:assignmentId', authMiddleware, getSubmissions);

// GET /api/submissions/student/:studentId - Get submissions by student
router.get('/student/:studentId', authMiddleware, getSubmissions);

// POST /api/submissions - Create a new submission
router.post('/', authMiddleware, createSubmission);

// POST /api/submissions/submit - Submit assignment
router.post('/submit', authMiddleware, submitAssignment);

// PUT /api/submissions/:id - Update a submission
router.put('/:id', authMiddleware, updateSubmission);

// DELETE /api/submissions/:id - Delete a submission
router.delete('/:id', authMiddleware, deleteSubmission);

export default router;

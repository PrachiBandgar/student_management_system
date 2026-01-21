import Course from "../models/Course.js";

/**
 * GET /api/courses
 * Get all courses (Teacher / Student / Admin)
 */
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("teacher", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching courses",
      error: error.message
    });
  }
};

/**
 * POST /api/courses
 * Create a new course (Teacher)
 */
export const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Course title is required" });
    }

    const course = await Course.create({
      title,
      description,
      teacher: req.user?.id || req.body.teacher // supports auth or manual
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({
      message: "Error creating course",
      error: error.message
    });
  }
};

/**
 * PUT /api/courses/:id
 * Update a course
 */
export const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(400).json({
      message: "Error updating course",
      error: error.message
    });
  }
};

/**
 * DELETE /api/courses/:id
 * Delete a course
 */
export const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting course",
      error: error.message
    });
  }
};

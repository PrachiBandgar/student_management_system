import Course from "../models/Course.js";

export const createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      teacher: req.user.id
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher", "name email");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

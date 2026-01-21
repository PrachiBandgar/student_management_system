import Course from '../models/Course.js';
import User from '../models/User.js';

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).populate('teacher students');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// Create a new course
export const createCourse = async (req, res) => {
  try {
    console.log('Backend course.controller.js - req.body:', req.body);
    console.log('Backend course.controller.js - req.user:', req.user);
    
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Course title is required" });
    }

    // Auto-enroll all students in new courses so they can see them
    const allStudents = await User.find({ role: 'student' });
    
    const courseData = {
      title,
      description,
      teacher: req.user._id, // ✅ ALWAYS from auth
      students: allStudents.length > 0 ? allStudents.map(student => student._id) : [] // Auto-enroll all students if any exist
    };
    
    console.log('Backend course.controller.js - courseData before save:', courseData);
    
    const course = await Course.create(courseData);

    // Populate for response to include teacher and student details
    const populatedCourse = await Course.findById(course._id)
      .populate('teacher', 'name email')
      .populate('students', 'name email');

    res.status(201).json(populatedCourse);
  } catch (error) {
    console.log('Backend course.controller.js - error:', error);
    res.status(400).json({
      message: "Error creating course",
      error: error.message
    });
  }
};

// Update a course
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('teacherId students');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ message: 'Error updating course', error: error.message });
  }
};

// Delete a course
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

import User from "../models/User.js";
import Course from "../models/Course.js";
import Assignment from "../models/Assignment.js";
import Attendance from "../models/Attendance.js";

// Admin Dashboard Data
export const getAdminDashboardData = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalCourses = await Course.countDocuments();
    const totalAssignments = await Assignment.countDocuments();
    
    // Calculate average attendance
    const attendances = await Attendance.find();
    const avgAttendance = attendances.length > 0 
      ? Math.round((attendances.filter(a => a.status === "present").length / attendances.length) * 100)
      : 0;

    // Get recent activity
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(3);
    const recentCourses = await Course.find().sort({ createdAt: -1 }).limit(3);

    res.json({
      summary: {
        totalStudents,
        totalTeachers,
        totalCourses,
        totalAssignments,
        avgAttendance
      },
      recentActivity: [
        ...recentUsers.map(user => ({
          type: "user",
          message: `New ${user.role} ${user.name} registered`,
          time: user.createdAt
        })),
        ...recentCourses.map(course => ({
          type: "course",
          message: `Course "${course.title}" created`,
          time: course.createdAt
        }))
      ].sort((a, b) => b.time - a.time).slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Teacher Dashboard Data
export const getTeacherDashboardData = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const courses = await Course.find({ teacher: teacherId }).populate('students');
    const assignments = await Assignment.find({ teacher: teacherId }).populate('course');
    
    // Calculate stats
    const totalStudents = courses.reduce((acc, course) => acc + course.students.length, 0);
    const totalAssignments = assignments.length;
    const pendingAssignments = assignments.filter(a => a.status === "pending").length;
    const todayClasses = courses.filter(course => {
      // Simple check - you can make this more sophisticated
      return course.schedule && course.schedule.toLowerCase().includes(new Date().toLocaleDateString());
    }).length;

    res.json({
      summary: {
        totalCourses: courses.length,
        totalStudents,
        totalAssignments,
        pendingAssignments,
        todayClasses
      },
      courses: courses,
      assignments: assignments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student Dashboard Data
export const getStudentDashboardData = async (req, res) => {
  try {
    const studentId = req.user._id;
    const courses = await Course.find({ students: studentId }).populate('teacher');
    
    // Get assignments for courses the student is enrolled in
    const courseIds = courses.map(course => course._id);
    const assignments = await Assignment.find({ course: { $in: courseIds } }).populate('course teacher');
    
    const attendances = await Attendance.find({ student: studentId }).populate('course');
    
    // Calculate stats
    const totalAssignments = assignments.length;
    const completedAssignments = assignments.filter(a => a.status === "submitted").length;
    const pendingAssignments = assignments.filter(a => a.status === "pending").length;
    const attendanceRate = attendances.length > 0 
      ? Math.round((attendances.filter(a => a.status === "present").length / attendances.length) * 100)
      : 0;

    res.json({
      summary: {
        totalCourses: courses.length,
        totalAssignments,
        completedAssignments,
        pendingAssignments,
        attendanceRate
      },
      courses: courses,
      assignments: assignments,
      attendances: attendances
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CRUD Operations for Courses
export const createCourse = async (req, res) => {
  try {
    console.log('Backend dashboard.controller.js - req.body:', req.body);
    console.log('Backend dashboard.controller.js - req.user:', req.user);
    
    const courseData = {
      ...req.body,
      teacher: req.user._id // ✅ ALWAYS from auth
    };
    
    // Auto-enroll all students in new courses so they can see them
    const allStudents = await User.find({ role: 'student' });
    courseData.students = allStudents.length > 0 ? allStudents.map(student => student._id) : [];
    
    console.log('Backend dashboard.controller.js - courseData before save:', courseData);
    
    const course = new Course(courseData);
    await course.save();
    
    // Populate for response to include teacher and student details
    await course.populate('teacher students');
    res.status(201).json(course);
  } catch (error) {
    console.log('Backend dashboard.controller.js - error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getCourses = async (req, res) => {
  try {
    const { role } = req.user;
    let courses;
    
    if (role === "admin") {
      courses = await Course.find().populate('teacher students');
    } else if (role === "teacher") {
      courses = await Course.find({ teacher: req.user._id }).populate('teacher students');
    } else if (role === "student") {
      courses = await Course.find({ students: req.user._id }).populate('teacher students');
    }
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('teacher students');
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CRUD Operations for Assignments
export const createAssignment = async (req, res) => {
  try {
    const assignment = new Assignment({ ...req.body, teacher: req.user._id });
    await assignment.save();
    
    // Populate for response to include course and teacher details
    await assignment.populate('course teacher');
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAssignments = async (req, res) => {
  try {
    const { role } = req.user;
    let assignments;
    
    if (role === "admin") {
      assignments = await Assignment.find().populate('course teacher');
    } else if (role === "teacher") {
      assignments = await Assignment.find({ teacher: req.user._id }).populate('course teacher');
    } else if (role === "student") {
      // Get assignments for courses the student is enrolled in
      const studentId = req.user._id;
      const courses = await Course.find({ students: studentId });
      const courseIds = courses.map(course => course._id);
      assignments = await Assignment.find({ course: { $in: courseIds } }).populate('course teacher');
    }
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('course teacher');
    
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    
    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

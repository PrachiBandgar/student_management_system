/**
 * API-like mock layer
 * -------------------
 * Single shared in-memory store for courses, assignments, and submissions.
 * Replace `USE_MOCK` with false and wire real endpoints later without touching UI calls.
 */
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/dashboard';
const USE_MOCK = false;

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: {
      Authorization: `Bearer ${user?.token}`,
      'Content-Type': 'application/json',
    },
  };
};

// ---------------------------
// Mock store + helpers
// ---------------------------
let mockCourses = [];
let mockAssignments = [];
let mockSubmissions = [];
let idCounter = 1;

const genId = () => `${Date.now()}-${idCounter++}`;

const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 200));

const getUserInfo = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  return {
    id: user._id || user.id || user.email || 'user-1',  // Prioritize _id (ObjectId)
    name: user.name || user.email || 'User',
    role: user.role || 'student',
  };
};

// Derive stats for admin
const deriveAdminStats = () => {
  const totalAssignments = mockAssignments.length;
  const totalSubmissions = mockSubmissions.length;
  return {
    summary: {
      totalStudents: 0, // not tracked here
      totalTeachers: 0, // not tracked here
      totalCourses: mockCourses.length,
      totalAssignments,
      totalSubmissions,
    },
    recentActivity: mockAssignments
      .slice(-5)
      .map((a) => ({ message: `Assignment created: ${a.title}` })),
  };
};

// Attach submission status per student
const mapAssignmentsForStudent = (studentId) => {
  return mockAssignments.map((a) => {
    const submission = mockSubmissions.find(
      (s) => s.assignment === a.id && s.student === studentId  // Changed from assignmentId to assignment
    );
    // compute days left based on dueDate, if available
    let daysLeft = null;
    if (a.dueDate) {
      const due = new Date(a.dueDate).getTime();
      const now = Date.now();
      daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    }
    return {
      ...a,
      status: submission ? 'submitted' : 'pending',
      submission,
      daysLeft,
    };
  });
};

// ---------------------------
// Dashboard Data
// ---------------------------
export const getAdminDashboardData = async () => {
  if (!USE_MOCK) {
    const response = await axios.get(`${API_BASE_URL}/admin`, getAuthHeader());
    return response.data;
  }
  return delay(deriveAdminStats());
};

export const getTeacherDashboardData = async () => {
  if (!USE_MOCK) {
    const response = await axios.get(`${API_BASE_URL}/teacher`, getAuthHeader());
    return response.data;
  }
  return delay({
    summary: {
      totalCourses: mockCourses.length,
      totalStudents: 0,
      todayClasses: 0,
    },
  });
};

export const getStudentDashboardData = async () => {
  if (!USE_MOCK) {
    const response = await axios.get(`${API_BASE_URL}/student`, getAuthHeader());
    return response.data;
  }
  return delay({
    summary: {
      totalCourses: mockCourses.length,
      totalAssignments: mockAssignments.length,
    },
    courses: mockCourses,
  });
};

// ---------------------------
// Courses
// ---------------------------
export const getCourses = async () => {
  if (!USE_MOCK) {
    const response = await axios.get(`${API_BASE_URL}/courses`, getAuthHeader());
    return response.data;
  }
  return delay([...mockCourses]);
};

export const createCourse = async (courseData) => {
  if (!USE_MOCK) {
    // Add teacher field to data being sent to API
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Frontend createCourse - user from localStorage:', user);
    
    const courseDataWithTeacher = {
      ...courseData,
      teacher: user._id || user.id  // Use _id (ObjectId) primarily
    };
    
    console.log('Frontend createCourse - data being sent:', courseDataWithTeacher);
    
    const response = await axios.post(
      `${API_BASE_URL}/courses`,
      courseDataWithTeacher,  // Send data with teacher field
      getAuthHeader()
    );
    return response.data;
  }
  const user = getUserInfo();
  const course = {
    id: genId(),
    title: courseData.title,
    name: courseData.name || courseData.title,
    description: courseData.description || '',
    schedule: courseData.schedule || '',
    status: courseData.status || 'active',
    teacher: user.id,  // Changed from teacherId to teacher
    teacherName: user.name,
    students: courseData.students || [],
  };
  mockCourses.push(course);
  return delay(course);
};

export const updateCourse = async (id, courseData) => {
  if (!USE_MOCK) {
    const response = await axios.put(
      `${API_BASE_URL}/courses/${id}`,
      courseData,
      getAuthHeader()
    );
    return response.data;
  }
  mockCourses = mockCourses.map((c) => (c.id === id ? { ...c, ...courseData } : c));
  return delay(courseData);
};

export const deleteCourse = async (id) => {
  if (!USE_MOCK) {
    const response = await axios.delete(
      `${API_BASE_URL}/courses/${id}`,
      getAuthHeader()
    );
    return response.data;
  }
  mockCourses = mockCourses.filter((c) => c.id !== id);
  // cascade remove assignments & submissions
  const assignmentIds = mockAssignments.filter((a) => a.course === id).map((a) => a.id);  // Changed from courseId to course
  mockAssignments = mockAssignments.filter((a) => a.course !== id);  // Changed from courseId to course
  mockSubmissions = mockSubmissions.filter((s) => !assignmentIds.includes(s.assignmentId));
  return delay({ success: true });
};

// ---------------------------
// Assignments
// ---------------------------
export const getAssignments = async () => {
  if (!USE_MOCK) {
    const response = await axios.get(
      `${API_BASE_URL}/assignments`,
      getAuthHeader()
    );
    return response.data;
  }
  return delay(
    mockAssignments.map((a) => ({
      ...a,
      submissionCount: mockSubmissions.filter((s) => s.assignment === a.id).length,  // Changed from assignmentId to assignment
    }))
  );
};

export const getAssignmentsByCourse = async (courseId) => {
  const assignments = (await getAssignments()).filter((a) => a.course === courseId);  // Changed from courseId to course
  return assignments;
};

export const createAssignment = async (assignmentData) => {
  if (!USE_MOCK) {
    const user = JSON.parse(localStorage.getItem('user'));
    const assignmentWithTeacher = {
      ...assignmentData,
      teacher: user._id || user.id || user?.name || 'Unknown Teacher',  // Use _id (ObjectId) primarily
    };
    const response = await axios.post(
      `${API_BASE_URL}/assignments`,
      assignmentWithTeacher,
      getAuthHeader()
    );
    return response.data;
  }
  const user = getUserInfo();
  const assignment = {
    id: genId(),
    title: assignmentData.title,
    description: assignmentData.description || '',
    course: assignmentData.course,  // Changed from courseId to course
    courseTitle:
      mockCourses.find((c) => c.id === assignmentData.course)?.title || 'Course',
    dueDate: assignmentData.dueDate || null,
    status: 'open',
    teacher: user.id,  // Changed from teacherId to teacher
    teacherName: user.name,
  };
  mockAssignments.push(assignment);
  return delay(assignment);
};

export const updateAssignment = async (id, assignmentData) => {
  if (!USE_MOCK) {
    const response = await axios.put(
      `${API_BASE_URL}/assignments/${id}`,
      assignmentData,
      getAuthHeader()
    );
    return response.data;
  }
  mockAssignments = mockAssignments.map((a) =>
    a.id === id ? { ...a, ...assignmentData } : a
  );
  return delay(assignmentData);
};

export const deleteAssignment = async (id) => {
  if (!USE_MOCK) {
    const response = await axios.delete(
      `${API_BASE_URL}/assignments/${id}`,
      getAuthHeader()
    );
    return response.data;
  }
  mockAssignments = mockAssignments.filter((a) => a.id !== id);
  mockSubmissions = mockSubmissions.filter((s) => s.assignment !== id);  // Changed from assignmentId to assignment
  return delay({ success: true });
};

// ---------------------------
// Submissions
// ---------------------------
export const submitAssignment = async (assignmentId, payload) => {
  if (!USE_MOCK) {
    const response = await axios.post(
      `${API_BASE_URL}/assignments/${assignmentId}/submit`,
      payload,
      getAuthHeader()
    );
    return response.data;
  }
  const user = getUserInfo();
  const submission = {
    id: genId(),
    assignmentId,
    studentId: user.id,
    studentName: user.name,
    content: payload.content || payload.link || '',
    link: payload.link || '',
    submittedAt: new Date().toISOString(),
  };
  // replace existing submission from same student
  mockSubmissions = mockSubmissions.filter(
    (s) => !(s.assignmentId === assignmentId && s.studentId === user.id)
  );
  mockSubmissions.push(submission);
  return delay(submission);
};

export const getAssignmentsForStudent = async (studentId) => {
  if (!USE_MOCK) {
    const response = await axios.get(
      `${API_BASE_URL}/assignments/student/${studentId}`,
      getAuthHeader()
    );
    return response.data;
  }
  return delay(mapAssignmentsForStudent(studentId));
};

export const getAdminAssignmentStats = async () => {
  if (!USE_MOCK) {
    const response = await axios.get(
      `${API_BASE_URL}/assignments/admin-stats`,
      getAuthHeader()
    );
    return response.data;
  }
  const items = mockAssignments.map((a) => {
    const submissionCount = mockSubmissions.filter((s) => s.assignment === a.id).length;  // Changed from assignmentId to assignment
    return {
      ...a,
      submissionCount,
    };
  });
  return delay({
    totalAssignments: mockAssignments.length,
    totalSubmissions: mockSubmissions.length,
    items,
  });
};

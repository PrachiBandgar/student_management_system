import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { getStudentDashboardData, getAssignmentsForStudent, submitAssignment } from "../../services/dashboard.service";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [submissionLinks, setSubmissionLinks] = useState({});
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courses, setCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user")) || {};
      const studentId = user._id || user.id || user.email || "student-1";
      const [data, assignmentsData] = await Promise.all([
        getStudentDashboardData(),
        getAssignmentsForStudent(studentId),
      ]);
      setDashboardData(data);
      // from shared data layer: all courses created by teachers
      const allCourses = data.courses || [];
      // treat none as enrolled initially; all are available to enroll
      setCourses([]);
      setAvailableCourses(allCourses);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAssignment = async (assignmentId) => {
    const link = submissionLinks[assignmentId];
    if (!link || !link.trim()) return;
    await submitAssignment(assignmentId, { link });
    setExpandedAssignment(null);
    setSubmissionLinks((prev) => ({ ...prev, [assignmentId]: "" }));
    // refresh assignments to reflect submitted status
    fetchDashboardData();
    alert(`Assignment submitted successfully!`);
  };

  const toggleSubmissionForm = (assignmentId) => {
    setExpandedAssignment(expandedAssignment === assignmentId ? null : assignmentId);
  };

  const handleAddCourse = (course) => {
    // Check if course is already enrolled
    if (!courses.find(c => c.id === course.id)) {
      setCourses([...courses, { ...course, status: 'active' }]);
      // Remove from available courses
      setAvailableCourses(availableCourses.filter(c => c.id !== course.id));
      alert(`Successfully enrolled in ${course.title}!`);
    } else {
      alert('You are already enrolled in this course!');
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="p-6">
        
        
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-8 mb-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome back! 👋</h2>
              <p className="text-blue-100 text-lg">Here's your learning progress at a glance</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{new Date().toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div className="text-sm">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Pending Assignments Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">📌 Pending Assignments</h2>
            <Link to="/student/assignments" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.filter(a => a.status === 'pending').map((assignment) => (
              <div key={assignment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{assignment.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{assignment.course || assignment.courseTitle}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    assignment.status === 'pending' 
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {assignment.status === 'pending' ? '⏳ Pending' : '✅ Submitted'}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  <span className={`ml-2 font-medium ${
                    assignment.daysLeft <= 2 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    ({assignment.daysLeft} days left)
                  </span>
                </div>

                {/* Inline Submission Form */}
                {expandedAssignment === assignment.id ? (
                  <div className="border-t pt-4 mt-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Paste Assignment Link
                      </label>
                      <textarea
                        value={submissionLinks[assignment.id] || ''}
                        onChange={(e) => setSubmissionLinks(prev => ({ ...prev, [assignment.id]: e.target.value }))}
                        placeholder="Paste your assignment submission link here..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm resize-none"
                        required
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Google Drive, GitHub, or any live URL allowed
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSubmitAssignment(assignment.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => toggleSubmissionForm(assignment.id)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => toggleSubmissionForm(assignment.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Submit Assignment
                  </button>
                )}

                {/* Submitted State */}
                {assignment.status === 'submitted' && (
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center text-green-600 dark:text-green-400 mb-2">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Submitted on {assignment.submittedDate ? new Date(assignment.submittedDate).toLocaleDateString() : 'Today'}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active Courses Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">📚 Active Courses</h2>
            <button
              onClick={() => setShowAddCourse(!showAddCourse)}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Course
            </button>
          </div>

          {/* Add Course Form */}
          {showAddCourse && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Available Courses to Enroll</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {availableCourses.map((course) => (
                  <div key={course.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 dark:text-white">{course.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{course.instructor}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Code: {course.code}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddCourse(course)}
                      className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200"
                    >
                      Enroll Now
                    </button>
                  </div>
                ))}
              </div>
              {availableCourses.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No available courses to enroll at the moment.</p>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddCourse(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Course Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{course.instructor}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Code: {course.code}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    🟢 Active
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link 
                    to={`/student/assignments`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg text-center transition-colors duration-200 text-sm"
                  >
                    View Assignments
                  </Link>
                  <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/student/courses" className="block">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-300 text-2xl">📚</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">My Courses</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{dashboardData?.summary?.totalCourses || 0}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Enrolled courses</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/student/assignments" className="block">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-300 text-2xl">📝</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Total Assignments</h3>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{assignments.length}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">All assignments</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/student/assignments" className="block">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-300 text-2xl">✅</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Completed</h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{assignments.filter(a => a.status === 'submitted').length}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Assignments done</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/student/assignments" className="block">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                  <span className="text-orange-600 dark:text-orange-300 text-2xl">⚠️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400">Pending</h3>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{assignments.filter(a => a.status === 'pending').length}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">To complete</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/student/results" className="block">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-300 text-2xl">🏆</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">Grades</h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">3.8</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Current GPA</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Completed Math Assignment 1</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Attended Physics Lecture</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">5 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Submitted English Essay</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">1 day ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Joined Chemistry Study Group</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">2 days ago</span>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Upcoming Deadlines</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Math Assignment 2</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Due in 2 days</p>
                </div>
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full">Urgent</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Physics Lab Report</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Due in 5 days</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">Soon</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">English Essay</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Due in 1 week</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">Plenty of time</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Grades</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Math Quiz 1</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Graded 2 days ago</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">95%</span>
                  <span className="text-green-600 dark:text-green-400">🌟</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Physics Lab</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Graded 1 week ago</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">88%</span>
                  <span className="text-blue-600 dark:text-blue-400">👍</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">English Essay</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Graded 2 weeks ago</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">92%</span>
                  <span className="text-purple-600 dark:text-purple-400">🎯</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;

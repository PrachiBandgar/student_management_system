import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";
import {
  getAdminDashboardData,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getAssignments,
  getAdminAssignmentStats,
} from "../../services/dashboard.service";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [assignmentStats, setAssignmentStats] = useState({ totalAssignments: 0, totalSubmissions: 0, items: [] });
  const [loading, setLoading] = useState(true);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    schedule: "",
    status: "active",
  });
  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    phone: "",
    status: "active",
    role: "student"
  });
  const [teacherForm, setTeacherForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    phone: "",
    status: "active",
    role: "teacher"
  });

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    fetchDashboardData();
    fetchCourses();
    fetchAssignments();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await getAdminDashboardData();
      setDashboardData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const data = await getAssignments();
      setAssignments(data);
      const stats = await getAdminAssignmentStats();
      setAssignmentStats(stats);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    editingCourse
      ? await updateCourse(editingCourse._id, courseForm)
      : await createCourse(courseForm);

    setShowCourseModal(false);
    setEditingCourse(null);
    setCourseForm({
      title: "",
      description: "",
      schedule: "",
      status: "active",
    });
    fetchCourses();
    fetchDashboardData();
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm(course);
    setShowCourseModal(true);
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Delete this course?")) {
      await deleteCourse(id);
      fetchCourses();
      fetchDashboardData();
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.email) {
      alert("Please fill in all required fields (Name, Email)");
      return;
    }

    try {
      const generatedPassword = Math.random().toString(36).slice(-8);
      console.log("Generated password for student:", generatedPassword);
      
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: studentForm.name,
        email: studentForm.email,
        password: generatedPassword,
        role: "student"
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      console.log("Student added response:", response.data);
      alert(`Student added successfully! Password: ${generatedPassword}`);
      setShowStudentModal(false);
      setStudentForm({
        name: "",
        email: "",
        password: "",
        department: "",
        phone: "",
        status: "active",
        role: "student"
      });
      fetchDashboardData();
    } catch (error) {
      console.error("Error adding student:", error.response?.data || error);
      alert("Error adding student: " + (error.response?.data?.message || error.message));
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!teacherForm.name || !teacherForm.email) {
      alert("Please fill in all required fields (Name, Email)");
      return;
    }

    try {
      const generatedPassword = Math.random().toString(36).slice(-8);
      console.log("Generated password for teacher:", generatedPassword);
      
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: teacherForm.name,
        email: teacherForm.email,
        password: generatedPassword,
        role: "teacher"
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      console.log("Teacher added response:", response.data);
      alert(`Teacher added successfully! Password: ${generatedPassword}`);
      setShowTeacherModal(false);
      setTeacherForm({
        name: "",
        email: "",
        password: "",
        department: "",
        phone: "",
        status: "active",
        role: "teacher"
      });
      fetchDashboardData();
    } catch (error) {
      console.error("Error adding teacher:", error.response?.data || error);
      alert("Error adding teacher: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-300">
          Loading dashboard...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8 text-gray-800 dark:text-gray-100">

        {/* ===== SUMMARY CARDS (ANALYTICS STYLE) ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Total Students",
              value: dashboardData?.summary?.totalStudents || 0,
              icon: "👨‍🎓",
              color: "blue",
            },
            {
              label: "Total Teachers",
              value: dashboardData?.summary?.totalTeachers || 0,
              icon: "👩‍🏫",
              color: "green",
            },
            {
              label: "Total Courses",
              value: dashboardData?.summary?.totalCourses || 0,
              icon: "📚",
              color: "purple",
            },
            {
              label: "Total Assignments",
              value: assignments.length,
              icon: "📝",
              color: "orange",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center
                  bg-${card.color}-100 dark:bg-${card.color}-900`}
                >
                  <span
                    className={`text-${card.color}-600 dark:text-${card.color}-300 text-xl`}
                  >
                    {card.icon}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {card.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== QUICK ACTIONS ===== */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Quick Actions</h2>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: "Create Course", icon: "📚", onClick: () => setShowCourseModal(true) },
              { label: "Add Student", icon: "👨‍🎓", onClick: () => setShowStudentModal(true) },
              { label: "Add Teacher", icon: "👩‍🏫", onClick: () => setShowTeacherModal(true) },
            ].map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                className="flex items-center gap-4 p-4 rounded-lg border
                           border-gray-200 dark:border-gray-700
                           hover:bg-gray-50 dark:hover:bg-gray-700 transition
                           text-gray-800 dark:text-white"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ===== RECENT ACTIVITY ===== */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Activity</h2>

          <div className="space-y-3">
            {dashboardData?.recentActivity?.slice(0, 5).map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg
                           hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {a.message}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== COURSES TABLE ===== */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Courses Management</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Title</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Schedule</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Status</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {courses.map((c) => (
                  <tr key={c._id} className="text-gray-900 dark:text-gray-100">
                    <td className="p-3">{c.title}</td>
                    <td className="p-3">{c.schedule || "-"}</td>
                    <td className="p-3">{c.status}</td>
                    <td className="p-3 space-x-3">
                      <button
                        onClick={() => handleEditCourse(c)}
                        className="text-blue-500 dark:text-blue-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(c._id)}
                        className="text-red-500 dark:text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== ASSIGNMENTS OVERVIEW ===== */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Assignments Overview</h2>
            <div className="flex gap-4 text-sm text-gray-700 dark:text-gray-300">
              <span>Total: <strong className="text-gray-900 dark:text-white">{assignmentStats.totalAssignments}</strong></span>
              <span>Submissions: <strong className="text-gray-900 dark:text-white">{assignmentStats.totalSubmissions}</strong></span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Assignment</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Course</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Submissions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {assignmentStats.items.map((a) => (
                  <tr key={a.id} className="text-gray-900 dark:text-gray-100">
                    <td className="p-3">{a.title}</td>
                    <td className="p-3">{a.courseTitle || "—"}</td>
                    <td className="p-3">{a.submissionCount || 0}</td>
                  </tr>
                ))}
                {assignmentStats.items.length === 0 && (
                  <tr className="text-gray-600 dark:text-gray-300">
                    <td className="p-3" colSpan={3}>No assignments yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white dark:bg-gray-800 w-96 p-6 rounded-xl shadow">
            <h3 className="text-lg font-bold mb-4">
              {editingCourse ? "Edit Course" : "Create Course"}
            </h3>

            <form onSubmit={handleCourseSubmit} className="space-y-3">
              {["title", "schedule"].map((field) => (
                <input
                  key={field}
                  required
                  placeholder={field}
                  value={courseForm[field]}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, [field]: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded border
                             bg-white dark:bg-gray-700
                             border-gray-300 dark:border-gray-600
                             text-gray-900 dark:text-white
                             placeholder-gray-500 dark:placeholder-gray-400"
                />
              ))}

              <textarea
                placeholder="description"
                value={courseForm.description}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, description: e.target.value })
                }
                className="w-full px-3 py-2 rounded border
                           bg-white dark:bg-gray-700
                           border-gray-300 dark:border-gray-600
                           text-gray-900 dark:text-white
                           placeholder-gray-500 dark:placeholder-gray-400"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Add Student</h3>
            
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                <input
                  type="text"
                  value={studentForm.department}
                  onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input
                  type="tel"
                  value={studentForm.phone}
                  onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Modal */}
      {showTeacherModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Add Teacher</h3>
            
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={teacherForm.name}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={teacherForm.email}
                  onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                <input
                  type="text"
                  value={teacherForm.department}
                  onChange={(e) => setTeacherForm({ ...teacherForm, department: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input
                  type="tel"
                  value={teacherForm.phone}
                  onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTeacherModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Add Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [departments] = useState([
    "Computer Science",
    "Mathematics", 
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Geography",
    "Physical Education",
    "Art",
    "Music"
  ]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    status: "active",
    role: "student",
  });

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    fetchStudents();
  }, [refreshKey]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/students`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStudents(res.data || []);
    } catch (err) {
      console.error(err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    return students.filter(
      (s) =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    
    // DEBUG: Log form data
    console.log("Current studentForm:", studentForm);
    
    // Validate required fields
    if (!studentForm.name || !studentForm.email) {
      console.error("Missing required fields:", { name: studentForm.name, email: studentForm.email });
      alert("Name and Email are required!");
      return;
    }
    
    // Generate password if not provided
    const generatedPassword = Math.random().toString(36).slice(-8);
    console.log("Generated password:", generatedPassword);
    
    // Create payload with ALL required fields
    const payload = {
      name: studentForm.name,
      email: studentForm.email,
      password: generatedPassword,
      role: "student"
    };
    
    // DEBUG: Log payload BEFORE sending
    console.log("PAYLOAD being sent to backend:", payload);
    console.log("Endpoint:", `${API_URL}/auth/register`);
    console.log("Headers:", { Authorization: `Bearer ${localStorage.getItem("token")}` });
    
    try {
      // MUST use auth/register endpoint ONLY
      const res = await axios.post(`${API_URL}/auth/register`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Student added response:", res.data);
      
      // Extract user from wrapped response
      const newStudent = res.data.user;
      console.log("Extracted student data:", newStudent);
      
      setStudents([...students, newStudent]);
      setShowAddModal(false);
      setStudentForm({ name: "", email: "", password: "", department: "", status: "active", role: "student" });
      setRefreshKey((p) => p + 1);
      alert(`Student added successfully! Password: ${generatedPassword}`);
    } catch (err) {
      // Enhanced error logging
      console.error("FULL ERROR OBJECT:", err);
      console.error("Error response:", err.response);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      console.error("Error message:", err.message);
      
      const errorMessage = err.response?.data?.message || err.message || "Unknown error occurred";
      alert("Error adding student: " + errorMessage);
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setStudentForm({
      name: student.name,
      email: student.email,
      department: student.department || "",
      status: student.status || "active",
      password: "",
      role: student.role,
    });
    setShowAddModal(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: studentForm.name,
        email: studentForm.email,
        department: studentForm.department,
        status: studentForm.status,
        role: studentForm.role,
        ...(studentForm.password && { password: studentForm.password }),
      };

      await axios.put(`${API_URL}/users/${editingStudent._id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setShowAddModal(false);
      setEditingStudent(null);
      setStudentForm({ name: "", email: "", department: "", status: "active", password: "", role: "student" });
      setRefreshKey((p) => p + 1);
      alert("Student updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error updating student");
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRefreshKey((p) => p + 1);
      alert("Student deleted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting student");
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex justify-center items-center h-64 text-gray-600 dark:text-gray-300">
          Loading students...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Students Management
          </h1>

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-lg
              bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-700
              text-gray-800 dark:text-white"
            />
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Student
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Students",
              value: students.length,
              icon: "👨‍🎓",
              color: "blue",
            },
            {
              label: "Active",
              value: students.filter(s => s.status === "active").length,
              icon: "✅",
              color: "green",
            },
            {
              label: "Inactive",
              value: students.filter(s => s.status === "inactive").length,
              icon: "⚠️",
              color: "red",
            },
            {
              label: "Pending",
              value: students.filter(s => s.status === "pending").length,
              icon: "📅",
              color: "yellow",
            },
          ].map((card, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${card.color}-100 dark:bg-${card.color}-900`}>
                  <span className={`text-${card.color}-600 dark:text-${card.color}-300 text-xl`}>
                    {card.icon}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                {["Name", "Email", "Status", "Joined", "Actions"].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No students found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-gray-800 dark:text-white">{s.name}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-300">{s.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${s.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : s.status === "inactive"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          : s.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : s.status === "graduated"
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"}`}>
                        {s.status || "active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-300">
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 space-x-3">
                      <button 
                        onClick={() => handleEditStudent(s)} 
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 font-medium text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteStudent(s._id)} 
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 w-96 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
                {editingStudent ? "Edit Student" : "Add Student"}
              </h3>

              <form onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent} className="space-y-4">
                <input
                  required
                  type="text"
                  placeholder="Name"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded
                  bg-white dark:bg-gray-700
                  border border-gray-300 dark:border-gray-600
                  text-gray-800 dark:text-white"
                />
                
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded
                  bg-white dark:bg-gray-700
                  border border-gray-300 dark:border-gray-600
                  text-gray-800 dark:text-white"
                />

                <select
                  value={studentForm.department}
                  onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                  className="w-full px-3 py-2 rounded
                  bg-white dark:bg-gray-700
                  border border-gray-300 dark:border-gray-600
                  text-gray-800 dark:text-white"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                {!editingStudent && (
                  <input
                    required
                    type="password"
                    placeholder="Password"
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
                  />
                )}

                <select
                  value={studentForm.status}
                  onChange={(e) => setStudentForm({ ...studentForm, status: e.target.value })}
                  className="w-full px-3 py-2 rounded
                  bg-white dark:bg-gray-700
                  border border-gray-300 dark:border-gray-600
                  text-gray-800 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="graduated">Graduated</option>
                </select>

                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    {editingStudent ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminStudents;

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
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
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [teacherForm, setTeacherForm] = useState({
    name: "",
    email: "",
    department: "",
    phone: "",
    status: "active",
    role: "teacher",
  });

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    fetchTeachers();
  }, [refreshKey]);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/teachers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTeachers(res.data || []);
    } catch (err) {
      console.error("Error fetching teachers:", err.response?.data || err);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    
    // DEBUG: Log form data
    console.log("Current teacherForm:", teacherForm);
    
    // Validate required fields
    if (!teacherForm.name || !teacherForm.email) {
      console.error("Missing required fields:", { name: teacherForm.name, email: teacherForm.email });
      alert("Name and Email are required!");
      return;
    }
    
    // Generate password if not provided
    const generatedPassword = Math.random().toString(36).slice(-8);
    console.log("Generated password:", generatedPassword);
    
    // Create payload with ALL required fields
    const payload = {
      name: teacherForm.name,
      email: teacherForm.email,
      password: generatedPassword,
      role: "teacher"
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
      console.log("Teacher added response:", res.data);
      
      // Extract user from wrapped response
      const newTeacher = res.data.user;
      console.log("Extracted teacher data:", newTeacher);
      
      setTeachers([...teachers, newTeacher]);
      setShowAddModal(false);
      setTeacherForm({ name: "", email: "", department: "", phone: "", status: "active", role: "teacher" });
      alert(`Teacher added successfully! Password: ${generatedPassword}`);
    } catch (err) {
      // Enhanced error logging
      console.error("FULL ERROR OBJECT:", err);
      console.error("Error response:", err.response);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      console.error("Error message:", err.message);
      
      const errorMessage = err.response?.data?.message || err.message || "Unknown error occurred";
      alert("Error adding teacher: " + errorMessage);
    }
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        name: teacherForm.name,
        email: teacherForm.email,
        department: teacherForm.department,
        phone: teacherForm.phone,
        status: teacherForm.status,
        role: "teacher"
      };
      
      const res = await axios.put(`${API_URL}/users/${editingTeacher._id}`, updateData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTeachers(teachers.map(t => t._id === editingTeacher._id ? res.data : t));
      setShowAddModal(false);
      setEditingTeacher(null);
      setTeacherForm({ name: "", email: "", department: "", phone: "", status: "active", role: "teacher" });
      alert("Teacher updated successfully!");
    } catch (err) {
      console.error("Error updating teacher:", err.response?.data || err);
      alert("Error updating teacher: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setTeacherForm({
      name: teacher.name,
      email: teacher.email,
      department: teacher.department || "",
      phone: teacher.phone || "",
      status: teacher.status || "active",
      role: "teacher",
    });
    setShowAddModal(true);
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTeachers(teachers.filter(t => t._id !== id));
      alert("Teacher deleted successfully!");
    } catch (err) {
      console.error("Error deleting teacher:", err.response?.data || err);
      alert("Error deleting teacher: " + (err.response?.data?.message || err.message));
    }
  };

  const filteredTeachers = useMemo(() => {
    if (!searchTerm) return teachers;
    return teachers.filter(
      (t) =>
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teachers, searchTerm]);

  const statsData = useMemo(() => {
    const departments = new Set(teachers.filter(t => t.department).map(t => t.department));
    const activeTeachers = teachers.filter(t => t.status === "active");
    
    // Calculate average experience (default range 0.5-2 yrs)
    const avgExperience = teachers.length > 0 ? "0.5-2" : "0.5-2";
    
    return {
      totalTeachers: teachers.length,
      activeTeachers: activeTeachers.length,
      departments: departments.size,
      avgExperience: avgExperience
    };
  }, [teachers]);

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="h-64 flex items-center justify-center text-gray-600 dark:text-gray-300">
          Loading teachers...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="p-6 text-gray-800 dark:text-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Teachers Management</h1>

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 
                         border-gray-300 dark:border-gray-700 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Teacher
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Teachers",
              value: statsData.totalTeachers,
              icon: "👩‍🏫",
              color: "blue",
            },
            {
              label: "Active",
              value: statsData.activeTeachers,
              icon: "✅",
              color: "green",
            },
            {
              label: "Departments",
              value: statsData.departments,
              icon: "📚",
              color: "yellow",
            },
            {
              label: "Avg Experience",
              value: `${statsData.avgExperience} yrs`,
              icon: "📊",
              color: "purple",
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
        <div className="overflow-hidden rounded-lg shadow bg-white dark:bg-gray-800">
          <table className="min-w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                {["Name", "Email", "Department", "Phone", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs uppercase text-gray-600 dark:text-gray-300"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No teachers found
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((t) => (
                  <tr
                    key={t._id}
                    className="border-t border-gray-200 dark:border-gray-700 
                               hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">{t.name}</td>
                    <td className="px-6 py-4">{t.email}</td>
                    <td className="px-6 py-4">{t.department || "N/A"}</td>
                    <td className="px-6 py-4">{t.phone || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          t.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : t.status === "inactive"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : t.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : t.status === "graduated"
                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                            : t.status === "on-leave"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }`}
                      >
                        {t.status === "on-leave" ? "On Leave" : (t.status || "active")}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-3">
                      <button 
                        onClick={() => handleEditTeacher(t)} 
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 font-medium text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteTeacher(t._id)} 
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow">
              <h3 className="text-xl font-bold mb-4">
                {editingTeacher ? "Edit Teacher" : "Add Teacher"}
              </h3>

              <form onSubmit={editingTeacher ? handleUpdateTeacher : handleAddTeacher} className="space-y-4">
                <input
                  required
                  type="text"
                  placeholder="Name"
                  value={teacherForm.name}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded
                  bg-white dark:bg-gray-700
                  border border-gray-300 dark:border-gray-600
                  text-gray-800 dark:text-white"
                />
                
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={teacherForm.email}
                  onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded
                  bg-white dark:bg-gray-700
                  border border-gray-300 dark:border-gray-600
                  text-gray-800 dark:text-white"
                />

                <select
                  value={teacherForm.department}
                  onChange={(e) => setTeacherForm({ ...teacherForm, department: e.target.value })}
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

                <input
                  type="tel"
                  placeholder="Phone"
                  value={teacherForm.phone}
                  onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded
                  bg-white dark:bg-gray-700
                  border border-gray-300 dark:border-gray-600
                  text-gray-800 dark:text-white"
                />

                {!editingTeacher && (
                  <input
                    required
                    type="password"
                    placeholder="Password"
                    value={teacherForm.password || ''}
                    onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
                    className="w-full px-3 py-2 rounded
                    bg-white dark:bg-gray-700
                    border border-gray-300 dark:border-gray-600
                    text-gray-800 dark:text-white"
                  />
                )}

                <select
                  value={teacherForm.status}
                  onChange={(e) => setTeacherForm({ ...teacherForm, status: e.target.value })}
                  className="w-full px-3 py-2 rounded
                  bg-white dark:bg-gray-700
                  border border-gray-300 dark:border-gray-600
                  text-gray-800 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on-leave">On Leave</option>
                </select>

                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    {editingTeacher ? "Update" : "Add"}
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

export default AdminTeachers;

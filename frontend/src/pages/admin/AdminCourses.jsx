import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    teacher: "",
    students: [],
    schedule: "",
    status: "active",
  });

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
    fetchStudents();
  }, [refreshKey]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard/courses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCourses(res.data || []);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/teachers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTeachers(res.data || []);
    } catch {
      setTeachers([]);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/students`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStudents(res.data || []);
    } catch {
      setStudents([]);
    }
  };

  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) return courses;
    return courses.filter(
      (c) =>
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.teacher?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await axios.put(
          `${API_URL}/dashboard/courses/${editingCourse._id}`,
          courseForm,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        alert("Course updated successfully!");
      } else {
        await axios.post(`${API_URL}/dashboard/courses`, courseForm, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        alert("Course added successfully!");
      }
      setShowAddModal(false);
      setEditingCourse(null);
      setCourseForm({ title: "", description: "", teacher: "", students: [], schedule: "", status: "active" });
      setRefreshKey((p) => p + 1);
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setCourseForm(course);
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`${API_URL}/dashboard/courses/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRefreshKey((p) => p + 1);
      alert("Course deleted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting course");
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex justify-center items-center h-64 text-gray-600 dark:text-gray-300">
          Loading courses...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Courses Management
          </h1>
          <div className="flex gap-4">
            <input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded border
                         bg-white dark:bg-gray-800
                         text-gray-900 dark:text-white
                         border-gray-300 dark:border-gray-600"
            />
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Course
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Courses",
              value: courses.length,
              icon: "📚",
              color: "blue",
            },
            {
              label: "Active",
              value: courses.filter(c => c.status === "active").length,
              icon: "✅",
              color: "green",
            },
            {
              label: "Students",
              value: courses.reduce((s, c) => s + (c.students?.length || 0), 0),
              icon: "👥",
              color: "yellow",
            },
            {
              label: "Teachers",
              value: teachers.length,
              icon: "👨‍🏫",
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

        {/* TABLE */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <tr>
                {["Title","Description","Teacher","Schedule","Students","Status","Actions"].map(h=>(
                  <th key={h} className="px-6 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCourses.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100">
                  <td className="px-6 py-4">{c.title}</td>
                  <td className="px-6 py-4">{c.description}</td>
                  <td className="px-6 py-4">{c.teacher?.name || "—"}</td>
                  <td className="px-6 py-4">{c.schedule}</td>
                  <td className="px-6 py-4">{c.students?.length || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${c.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                        : c.status === "inactive"
                        ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        : c.status === "completed"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-3">
                    <button 
                      onClick={() => handleEdit(c)} 
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(c._id)} 
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center pt-20 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 w-[500px] max-h-[90vh] overflow-y-auto rounded-lg shadow">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                {editingCourse ? "Edit Course" : "Add Course"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  required
                  type="text"
                  placeholder="Title"
                  value={courseForm.title}
                  onChange={(e)=>setCourseForm({...courseForm,title:e.target.value})}
                  className="w-full px-3 py-2 rounded border
                             bg-white dark:bg-gray-700
                             text-gray-900 dark:text-white
                             border-gray-300 dark:border-gray-600"
                />

                <textarea
                  required
                  placeholder="Description"
                  value={courseForm.description}
                  onChange={(e)=>setCourseForm({...courseForm,description:e.target.value})}
                  className="w-full px-3 py-2 rounded border
                             bg-white dark:bg-gray-700
                             text-gray-900 dark:text-white
                             border-gray-300 dark:border-gray-600"
                  rows="3"
                />

                <select
                  required
                  value={courseForm.teacher}
                  onChange={(e)=>setCourseForm({...courseForm,teacher:e.target.value})}
                  className="w-full px-3 py-2 rounded border
                             bg-white dark:bg-gray-700
                             text-gray-900 dark:text-white
                             border-gray-300 dark:border-gray-600"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map(t=>(
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Students
                  </label>
                  <div className="max-h-32 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700">
                    {students.map(s => (
                      <label key={s._id} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <input
                          type="checkbox"
                          checked={courseForm.students.includes(s._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCourseForm({...courseForm, students: [...courseForm.students, s._id]});
                            } else {
                              setCourseForm({...courseForm, students: courseForm.students.filter(id => id !== s._id)});
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-gray-900 dark:text-white">{s.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <input
                  required
                  type="text"
                  placeholder="Schedule"
                  value={courseForm.schedule}
                  onChange={(e)=>setCourseForm({...courseForm,schedule:e.target.value})}
                  className="w-full px-3 py-2 rounded border
                             bg-white dark:bg-gray-700
                             text-gray-900 dark:text-white
                             border-gray-300 dark:border-gray-600"
                />

                <select
                  required
                  value={courseForm.status}
                  onChange={(e)=>setCourseForm({...courseForm,status:e.target.value})}
                  className="w-full px-3 py-2 rounded border
                             bg-white dark:bg-gray-700
                             text-gray-900 dark:text-white
                             border-gray-300 dark:border-gray-600"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="completed">Completed</option>
                </select>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={()=>setShowAddModal(false)}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                    Save
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

export default AdminCourses;

import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const API_URL = "http://localhost:5000/api";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    phone: "",
    status: "active",
  });

  const authHeader = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  /* ================= FETCH TEACHERS ================= */
  const fetchTeachers = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/users/teachers`,
        authHeader
      );
      setTeachers(res.data);
    } catch (err) {
      alert("Failed to fetch teachers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTeacher) {
        // UPDATE
        const res = await axios.put(
          `${API_URL}/users/${editingTeacher._id}`,
          {
            name: form.name,
            email: form.email,
            department: form.department,
            phone: form.phone,
            status: form.status
          },
          authHeader
        );

        console.log("Updated teacher response:", res.data);
        setTeachers((prev) =>
          prev.map((t) =>
            t._id === editingTeacher._id ? res.data : t
          )
        );
      } else {
        // ADD
        const generatedPassword = Math.random().toString(36).slice(-8);
        console.log("Generated password for teacher:", generatedPassword);
        
        const res = await axios.post(
          `${API_URL}/users/teachers`,
          {
            name: form.name,
            email: form.email,
            password: generatedPassword,
            department: form.department,
            phone: form.phone,
            role: "teacher",
            status: form.status
          },
          authHeader
        );

        console.log("Added teacher response:", res.data);
        setTeachers((prev) => [...prev, res.data]);
        alert(`Teacher added successfully! Password: ${generatedPassword}`);
      }

      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
      console.error(err);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;

    try {
      await axios.delete(`${API_URL}/users/${id}`, authHeader);
      console.log(`Deleted teacher with ID: ${id}`);
      setTeachers((prev) => prev.filter((t) => t._id !== id));
      alert("Teacher deleted successfully!");
    } catch (err) {
      alert("Delete failed");
      console.error(err);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setForm({
      name: teacher.name,
      email: teacher.email,
      department: teacher.department || "",
      phone: teacher.phone || "",
      status: teacher.status || "active",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingTeacher(null);
    setForm({
      name: "",
      email: "",
      department: "",
      phone: "",
      status: "active",
    });
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex justify-center items-center h-64">
          Loading teachers...
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
            Teachers Management
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {showForm ? "Cancel" : "Add Teacher"}
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                required
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
              />
              <input
                required
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
              />
              <input
                placeholder="Department"
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
                className="input"
              />
              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input"
              />
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
                className="input col-span-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <button
                type="submit"
                className="col-span-2 bg-green-600 text-white py-2 rounded"
              >
                {editingTeacher ? "Update Teacher" : "Add Teacher"}
              </button>
            </form>
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white dark:bg-gray-800 rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                {["Name", "Email", "Department", "Status", "Actions"].map(
                  (h) => (
                    <th key={h} className="px-6 py-3 text-left text-sm">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {teachers.filter(Boolean).map((t) => (
                <tr
                  key={t._id}
                  className="border-t dark:border-gray-700"
                >
                  <td className="px-6 py-4">{t.name}</td>
                  <td className="px-6 py-4">{t.email}</td>
                  <td className="px-6 py-4">{t.department || "-"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        t.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                      }`}
                    >
                      {t.status || "active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-3">
                    <button
                      onClick={() => handleEdit(t)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="text-red-600 hover:underline"
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
    </DashboardLayout>
  );
};

export default Teachers;

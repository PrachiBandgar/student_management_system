import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function StudentLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { ...form, role: "student" };

      const res = await axios.post(url, payload);

      if (isLogin) {
        if (res.data.role !== "student") {
          return alert("Access denied. Student access required.");
        }

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        login({
          email: form.email,
          role: res.data.role,
          token: res.data.token
        });

        navigate("/student/dashboard");
      } else {
        alert("Student registered successfully. Please login.");
        setIsLogin(true);
        setForm({ name: "", email: "", password: "" });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-purple-800 mb-2">
          Student {isLogin ? "Login" : "Registration"}
        </h2>
        <p className="text-center text-gray-500 mb-6">
          {isLogin ? "Access student dashboard" : "Create student account"}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Student Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Student Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            {isLogin ? "Login as Student" : "Register as Student"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-gray-600 mt-6">
          {isLogin ? "Don't have a student account?" : "Already have a student account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-600 font-semibold ml-2 hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>

        {/* Back */}
        <p className="text-center text-gray-600 mt-4">
          <a href="/" className="text-purple-600 font-semibold hover:underline">
            ← Back to Home
          </a>
        </p>
      </div>
    </div>
  );
}

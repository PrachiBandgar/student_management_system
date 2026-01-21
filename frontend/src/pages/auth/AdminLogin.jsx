import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function AdminLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { ...form, role: "admin" };

      console.log("Sending request to:", url);
      console.log("Payload:", payload);

      const res = await axios.post(url, payload);

      if (isLogin) {
        if (res.data.role !== "admin") {
          return alert("Access denied. Admin access required.");
        }
        
        // Store token and user data
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        
        // Update AuthContext with user data
        login({ 
          email: form.email, 
          role: res.data.role,
          token: res.data.token 
        });
        
        alert("Admin logged in successfully");
        navigate("/admin/dashboard");
      } else {
        alert("Admin registration successful. Please login.");
        setIsLogin(true);
        setForm({ name: "", email: "", password: "" });
      }
    } catch (err) {
      console.error("Error details:", err);
      if (err.response) {
        // Server responded with error status
        alert(err.response.data.message || "Registration failed");
      } else if (err.request) {
        // Request was made but no response received
        alert("Server is not responding. Please check if backend is running on localhost:5000");
      } else {
        // Something else happened
        alert("Error: " + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-purple-800 mb-2">
          Admin {isLogin ? "Login" : "Registration"}
        </h2>
        <p className="text-center text-gray-500 mb-6">
          {isLogin ? "Access administrator dashboard" : "Create admin account"}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name */}
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

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Admin Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
            required
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            {isLogin ? "Login as Admin" : "Register as Admin"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-gray-600 mt-6">
          {isLogin ? "Don't have an admin account?" : "Already have an admin account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-600 font-semibold ml-2 hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>

        {/* Back to Home */}
        <p className="text-center text-gray-600 mt-4">
          <a href="/" className="text-purple-600 font-semibold hover:underline">
            ← Back to Home
          </a>
        </p>
      </div>
    </div>
  );
}

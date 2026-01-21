import { useState } from "react";
import { registerUser } from "../../services/authService";

export default function AdminRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const submitHandler = async () => {
    try {
      await registerUser({ ...form, role: "admin" });
      alert("Admin Registered Successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div>
      <h2>Admin Register</h2>

      <input
        placeholder="Name"
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Email"
        onChange={e => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={submitHandler}>Register</button>
    </div>
  );
}

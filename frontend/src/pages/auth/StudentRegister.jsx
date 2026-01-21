import { useState } from "react";
import { registerUser } from "../../services/authService";

export default function StudentRegister() {
  const [form, setForm] = useState({ name:"", email:"", password:"" });

  const submit = async () => {
    await registerUser({ ...form, role: "student" });
    alert("Registered");
  };

  return (
    <>
      <input placeholder="Name" onChange={e=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})}/>
      <input type="password" placeholder="Password" onChange={e=>setForm({...form,password:e.target.value})}/>
      <button onClick={submit}>Register</button>
    </>
  );
}

import axios from "axios";

const API = "https://student-management-system-h41y.onrender.com/api/auth";

export const registerUser = (data) =>
  axios.post(`${API}/register`, data);

export const loginUser = (data) =>
  axios.post(`${API}/login`, data);

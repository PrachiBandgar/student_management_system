import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { user } = useContext(AuthContext);

  // Debug: Log current state
  console.log('ProtectedRoute Debug - Current URL:', window.location.pathname);
  console.log('ProtectedRoute Debug - User from context:', user);
  console.log('ProtectedRoute Debug - Required role:', role);
  console.log('ProtectedRoute Debug - localStorage user:', localStorage.getItem('user'));
  console.log('ProtectedRoute Debug - localStorage token:', localStorage.getItem('token'));

  // More lenient check - only check if user exists and has correct role
  if (!user) {
    console.log('No user found, redirecting to login');
    const loginPath = role === "admin" ? "/admin/login" : 
                     role === "teacher" ? "/teacher/login" : 
                     "/student/login";
    return <Navigate to={loginPath} replace />;
  }
  
  if (user.role !== role) {
    console.log('Role mismatch, redirecting to login');
    const loginPath = role === "admin" ? "/admin/login" : 
                     role === "teacher" ? "/teacher/login" : 
                     "/student/login";
    return <Navigate to={loginPath} replace />;
  }

  console.log('Authentication successful, rendering children');
  return children;
};

export default ProtectedRoute;

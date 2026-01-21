import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/auth/AdminLogin";
import TeacherLogin from "./pages/auth/TeacherLogin";
import StudentLogin from "./pages/auth/StudentLogin";

import AdminRegister from "./pages/auth/AdminRegister";
import TeacherRegister from "./pages/auth/TeacherRegister";
import StudentRegister from "./pages/auth/StudentRegister";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminTeachers from "./pages/admin/AdminTeachers";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminAssignments from "./pages/admin/AdminAssignments";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherAttendance from "./pages/teacher/TeacherAttendance";
import TeacherResults from "./pages/teacher/TeacherResults";
import TeacherCourses from "./pages/teacher/TeacherCourses";
import TeacherAssignments from "./pages/teacher/TeacherAssignments";
import TeacherSchedule from "./pages/teacher/TeacherSchedule";
import StudentDashboard from "./pages/student/StudentDashboard";
import MyCourses from "./pages/student/MyCourses";
import MyAssignments from "./pages/student/MyAssignments";
import MyAttendance from "./pages/student/MyAttendance";
import MyResults from "./pages/student/MyResults";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* DEFAULT ROUTE */}
            <Route path="/" element={<LandingPage />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/teacher/login" element={<TeacherLogin />} />
            <Route path="/student/login" element={<StudentLogin />} />

            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/teacher/register" element={<TeacherRegister />} />
            <Route path="/student/register" element={<StudentRegister />} />

            {/* Admin routes */}
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute role="admin">
                  <AdminStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/teachers"
              element={
                <ProtectedRoute role="admin">
                  <AdminTeachers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute role="admin">
                  <AdminCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/assignments"
              element={
                <ProtectedRoute role="admin">
                  <AdminAssignments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute role="admin">
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Teacher routes */}
            <Route
              path="/teacher/attendance"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/results"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/courses"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/assignments"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherAssignments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/schedule"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherSchedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/*"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />

            {/* Student specific routes */}
            <Route
              path="/student/courses"
              element={
                <ProtectedRoute role="student">
                  <MyCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/assignments"
              element={
                <ProtectedRoute role="student">
                  <MyAssignments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/attendance"
              element={
                <ProtectedRoute role="student">
                  <MyAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/results"
              element={
                <ProtectedRoute role="student">
                  <MyResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/*"
              element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

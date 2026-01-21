import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const adminLinks = [
    { to: "/admin", label: "Dashboard", icon: "📊" },
    { to: "/admin/students", label: "Students", icon: "👥" },
    { to: "/admin/teachers", label: "Teachers", icon: "👨‍🏫" },
    { to: "/admin/courses", label: "Courses", icon: "📚" },
    { to: "/admin/assignments", label: "Assignments", icon: "📝" },
    { to: "/admin/analytics", label: "Analytics", icon: "📈" },
  ];

  const teacherLinks = [
    { to: "/teacher", label: "Dashboard", icon: "📊" },
    { to: "/teacher/attendance", label: "My Attendance", icon: "📅" },
    { to: "/teacher/results", label: "Results", icon: "🎯" },
    { to: "/teacher/courses", label: "Courses", icon: "📚" },
    { to: "/teacher/assignments", label: "Assignments", icon: "📝" },
    { to: "/teacher/schedule", label: "Schedule", icon: "📋" },
  ];

  const studentLinks = [
    { to: "/student", label: "Dashboard", icon: "📊" },
    { to: "/student/assignments", label: "My Assignments", icon: "📝" },
    { to: "/student/attendance", label: "My Attendance", icon: "📅" },
    { to: "/student/courses", label: "My Courses", icon: "📚" },
    { to: "/student/results", label: "Results", icon: "🎯" },
    { to: "/student/settings", label: "Settings", icon: "⚙️" },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case "admin":
        return adminLinks;
      case "teacher":
        return teacherLinks;
      case "student":
        return studentLinks;
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <div className="bg-white dark:bg-gray-800 h-full w-64 shadow-lg">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 capitalize">
          {user?.role} Panel
        </h2>
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                location.pathname === link.to
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
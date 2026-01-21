import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import smsLogo from "../assets/sms-logo.png";

const DashboardLayout = ({ role, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const getNavItems = () => {
    if (role === "admin") {
      return [
        { name: "Dashboard", icon: "📊", path: "/admin/dashboard" },
        { name: "Students", icon: "👨‍🎓", path: "/admin/students" },
        { name: "Teachers", icon: "👩‍🏫", path: "/admin/teachers" },
        { name: "Courses", icon: "📚", path: "/admin/courses" },
        { name: "Analytics", icon: "📈", path: "/admin/analytics" },
      ];
    } else if (role === "teacher") {
      return [
        { name: "Dashboard", icon: "📊", path: "/teacher/dashboard" },
        { name: "My Attendance", icon: "✅", path: "/teacher/attendance" },
        { name: "Results", icon: "📝", path: "/teacher/results" },
        { name: "Courses", icon: "📚", path: "/teacher/courses" },
        { name: "Schedule", icon: "📅", path: "/teacher/schedule" },
      ];
    } else {
      return [
        { name: "Dashboard", icon: "📊", path: "/student/dashboard" },
      ];
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSettings = () => {
    setShowSettingsModal(true);
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-20"} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <img 
              src={smsLogo} 
              alt="Student Management System Logo" 
              className="h-24 w-full object-contain"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={handleSettings}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 w-full"
              >
                <span className="text-xl">⚙️</span>
                {sidebarOpen && <span>Settings</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-600 text-gray-300 w-full"
              >
                <span className="text-xl">🚪</span>
                {sidebarOpen && <span>Log out</span>}
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} capitalize`}>
                {role} Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">🌙</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isDarkMode}
                    onChange={toggleDarkMode}
                    className="sr-only peer" 
                  />
                  <div className={`w-11 h-6 rounded-full peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                    isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                </label>
                <span className="text-sm text-gray-600 dark:text-gray-400">☀️</span>
              </div>
              
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {role === "admin" ? "A" : role === "teacher" ? "T" : "S"}
                  </span>
                </div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} capitalize`}>
                  {role} User
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={`flex-1 overflow-auto p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {children || <Outlet />}
        </main>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className={`relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h3>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Account Settings</h4>
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      setShowSettingsModal(false);
                      setShowProfileModal(true);
                    }}
                    className={`w-full text-left px-3 py-2 border rounded-lg hover:bg-gray-50 ${
                      isDarkMode ? 'border-gray-600 text-gray-200 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    📝 Edit Profile
                  </button>
                  <button 
                    onClick={() => {
                      setShowSettingsModal(false);
                      setShowPasswordModal(true);
                    }}
                    className={`w-full text-left px-3 py-2 border rounded-lg hover:bg-gray-50 ${
                      isDarkMode ? 'border-gray-600 text-gray-200 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    🔐 Change Password
                  </button>
                </div>
              </div>

              <div>
                <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Appearance</h4>
                <div className="space-y-3">
                  <div className={`flex items-center justify-between px-3 py-2 border rounded-lg ${
                    isDarkMode ? 'border-gray-600' : 'border-gray-300'
                  }`}>
                    <span>🌙 Dark Mode</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                        className="sr-only peer" 
                      />
                      <div className={`w-11 h-6 rounded-full peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                        isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                      }`}></div>
                    </label>
                  </div>
                  <button 
                    onClick={() => {
                      setShowSettingsModal(false);
                      setShowThemeModal(true);
                    }}
                    className={`w-full text-left px-3 py-2 border rounded-lg hover:bg-gray-50 ${
                      isDarkMode ? 'border-gray-600 text-gray-200 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    🎨 Theme Settings
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className={`px-4 py-2 rounded-md hover:opacity-80 ${
                    isDarkMode ? 'bg-gray-600 text-gray-200 hover:bg-gray-700' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  Cancel
                </button>
                <button className={`px-4 py-2 rounded-md hover:opacity-80 ${
                  isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className={`relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Edit Profile</h3>
              <button 
                onClick={() => setShowProfileModal(false)}
                className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} text-sm font-bold mb-2`}>Full Name</label>
                <input
                  type="text"
                  defaultValue="John Doe"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} text-sm font-bold mb-2`}>Email</label>
                <input
                  type="email"
                  defaultValue="student@example.com"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} text-sm font-bold mb-2`}>Phone</label>
                <input
                  type="tel"
                  defaultValue="+1234567890"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                  }`}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className={`px-4 py-2 rounded-md hover:opacity-80 ${
                    isDarkMode ? 'bg-gray-600 text-gray-200 hover:bg-gray-700' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  Cancel
                </button>
                <button className={`px-4 py-2 rounded-md hover:opacity-80 ${
                  isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className={`relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Change Password</h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} text-sm font-bold mb-2`}>Current Password</label>
                <input
                  type="password"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} text-sm font-bold mb-2`}>New Password</label>
                <input
                  type="password"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} text-sm font-bold mb-2`}>Confirm New Password</label>
                <input
                  type="password"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                  }`}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className={`px-4 py-2 rounded-md hover:opacity-80 ${
                    isDarkMode ? 'bg-gray-600 text-gray-200 hover:bg-gray-700' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  Cancel
                </button>
                <button className={`px-4 py-2 rounded-md hover:opacity-80 ${
                  isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Theme Settings Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className={`relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Theme Settings</h3>
              <button 
                onClick={() => setShowThemeModal(false)}
                className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Color Theme</h4>
                <div className="grid grid-cols-3 gap-3">
                  <button className={`p-3 border-2 rounded-lg ${isDarkMode ? 'border-blue-500 bg-blue-900' : 'border-blue-500 bg-blue-50'}`}>
                    <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-1"></div>
                    <span className="text-xs">Blue</span>
                  </button>
                  <button className={`p-3 border rounded-lg hover:bg-gray-50 ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : ''}`}>
                    <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-1"></div>
                    <span className="text-xs">Green</span>
                  </button>
                  <button className={`p-3 border rounded-lg hover:bg-gray-50 ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : ''}`}>
                    <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-1"></div>
                    <span className="text-xs">Purple</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowThemeModal(false)}
                  className={`px-4 py-2 rounded-md hover:opacity-80 ${
                    isDarkMode ? 'bg-gray-600 text-gray-200 hover:bg-gray-700' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  Cancel
                </button>
                <button className={`px-4 py-2 rounded-md hover:opacity-80 ${
                  isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                  Apply Theme
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;

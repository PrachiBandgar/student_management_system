import { Link } from "react-router-dom";
import smsLogo from "../assets/sms-logo.png";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center px-6">
      <div className="max-w-6xl w-full">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex justify-center mb-6">
            <img 
              src={smsLogo} 
              alt="Student Management System Logo" 
              className="h-20 w-auto object-contain"
            />
          </div>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            A unified platform to manage academics, administration, and learning
            with efficiency and transparency.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

          {/* Admin */}
          <Link to="/admin/login" className="group">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 text-center shadow-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/20">
              <div className="w-16 h-16 mx-auto mb-5 bg-purple-600/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Administrator</h2>
              <p className="text-gray-300 text-sm">
                Manage users, departments, classes, and overall system operations.
              </p>
            </div>
          </Link>

          {/* Student */}
          <Link to="/student/login" className="group">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 text-center shadow-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/20">
              <div className="w-16 h-16 mx-auto mb-5 bg-blue-600/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84l7 3a1 1 0 00.788 0l7-3a1 1 0 000-1.84l-7-3z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Student</h2>
              <p className="text-gray-300 text-sm">
                Access courses, assignments, grades, attendance, and announcements.
              </p>
            </div>
          </Link>

          {/* Teacher */}
          <Link to="/teacher/login" className="group">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 text-center shadow-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/20">
              <div className="w-16 h-16 mx-auto mb-5 bg-green-600/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 2a1 1 0 00-.894.553L3.382 6H1a1 1 0 000 2h2.618l1.724 3.447A1 1 0 006 12h8a1 1 0 00.894-.553L16.618 8H19a1 1 0 100-2h-2.382l-1.724-3.447A1 1 0 0014 2H6z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Teacher</h2>
              <p className="text-gray-300 text-sm">
                Create courses, upload materials, assign work, and evaluate students.
              </p>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <div className="text-center mt-14 text-gray-400 text-sm">
          © {new Date().getFullYear()} Student Management System. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

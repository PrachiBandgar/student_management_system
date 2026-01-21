import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import smsLogo from "../assets/sms-logo.png";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img 
            src={smsLogo} 
            alt="Student Management System Logo" 
            className="h-12 w-auto object-contain"
          />
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm">
            Welcome, <span className="font-semibold capitalize">{user?.name}</span>
          </span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
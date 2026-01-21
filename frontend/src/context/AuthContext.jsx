import { createContext, useState, useContext } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      
      console.log('AuthProvider - Initializing from localStorage');
      console.log('AuthProvider - storedUser:', storedUser);
      console.log('AuthProvider - token:', token);
      
      // If no token but user exists, clear user data (inconsistent state)
      if (storedUser && !token) {
        console.log('AuthProvider - Inconsistent state: user exists but no token, clearing user');
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        return null;
      }
      
      const parsedUser = JSON.parse(storedUser);
      console.log('AuthProvider - Parsed user:', parsedUser);
      return parsedUser;
    } catch (error) {
      console.log('AuthProvider - Error parsing user from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return null;
    }
  });

  const login = (data) => {
    console.log('AuthProvider - Login called with data:', data);
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    console.log('AuthProvider - User saved to localStorage');
  };

  const logout = () => {
    console.log('AuthProvider - Logout called');
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

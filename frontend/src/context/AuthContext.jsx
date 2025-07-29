import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Make sure Axios sends cookies (important if using cookies for auth)
// axios.defaults.withCredentials = true;

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null); // stores logged-in user
  const [loading, setLoading] = useState(true); // loading on mount

  // Fetch user on mount
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("https://asaanghar-production.up.railway.app/api/users"); // adjust if needed
//         setUser(res.data);
//       } catch (err) {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

  // Login function
//   const login = async (email, password) => {
//     try {
//       const res = await axios.post("https://asaanghar-production.up.railway.app/api/users", { email, password });
//       setUser(res.data.user); // adjust based on your API response
//       return { success: true };
//     } catch (err) {
//       return {
//         success: false,
//         message: err.response?.data?.message || "Login failed",
//       };
//     }
//   };

  // Logout function
//   const logout = async () => {
//     try {
//       await axios.post("/api/users/logout"); // or just clear frontend token
//       setUser(null);
//     } catch (err) {
//       console.error("Logout error:", err);
//     }
//   };


    const [userDetails, setUserDetails] = useState(() => {
        return localStorage.getItem('userDetails') 
          ? JSON.parse(localStorage.getItem('userDetails')) 
          : null; // Check localStorage for initial value
      });
  
 


  const clearUserDetails = () => {
    setUserDetails(null);
    localStorage.removeItem('userDetails');
  };
  return (
    <AuthContext.Provider value={{ user,  loading, userDetails, setUserDetails, clearUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use context easily
export const useAuth = () => useContext(AuthContext);
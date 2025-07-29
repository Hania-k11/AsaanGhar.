import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Make sure Axios sends cookies (important if using cookies for auth)
// axios.defaults.withCredentials = true;

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null); // stores logged-in user
  const [loading, setLoading] = useState(true); // loading on mount



  ///MODAL
 const [showLoginModal, setShowLoginModal] = useState(false);
 //-----------------------------------------

    const [userDetails, setUserDetails] = useState(() => {
        return localStorage.getItem('userDetails') 
          ? JSON.parse(localStorage.getItem('userDetails')) 
          : null; // Check localStorage for initial value
      });
  
 useEffect(() => {
    if (userDetails) {
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
    } else {
      localStorage.removeItem("userDetails");
    }
  }, [userDetails]);

  const logout = async () => {
    try {
      setUserDetails(null);
      localStorage.removeItem("userDetails");
      // optionally: await axios.post("/api/users/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }


  const clearUserDetails = () => {
    setUserDetails(null);
    localStorage.removeItem('userDetails');
  };
  return (
    <AuthContext.Provider value={{ user,  loading, userDetails, setUserDetails, clearUserDetails,
      logout, showLoginModal, setShowLoginModal
     }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use context easily
export const useAuth = () => useContext(AuthContext);
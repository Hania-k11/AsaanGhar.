import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";



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


useEffect(() => {
  const fetchAdmin = async () => {
    try {
      const res = await axios.get("/api/admin/me", { withCredentials: true });
      if (res.data.success) {
        setUser(res.data.admin);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  fetchAdmin();
}, []);


const loginadmin = async (email, password) => {
  console.log("Attempting login with:", { email, password });

  try {
    const res = await axios.post(
      "/api/admin/login",
      { email, password },
      { withCredentials: true } // Important for cookies
    );

    console.log("Response from server:", res.data);

    if (res.data.success) {
      console.log("Login successful, admin data:", res.data.admin);
      setUser(res.data.admin);
      return { success: true, admin: res.data.admin }; // pass admin for frontend
    } else {
      console.warn("Login failed:", res.data.message);
      return { success: false, message: res.data.message };
    }
  } catch (err) {
    let message = "Server error during login"; // default

    // If backend sent a response, use its message
    if (err.response && err.response.data && err.response.data.message) {
      message = err.response.data.message;
      console.error("Server responded with error:", err.response.data, err.response.status);
    } else if (err.request) {
      console.error("No response received:", err.request);
      message = "No response from server";
    } else {
      console.error("Error setting up request:", err.message);
    }

    return { success: false, message };
  }
};



  const logoutadmin = async () => {
    try {
      await axios.post("/api/admin/logout", {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };




  const logout = async () => {
    try {
      setUser(null);
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

    const isLoggedIn = !!userDetails;
    const isLoggedInAdmin = !!user;

  return (
    <AuthContext.Provider
      value={{
        userDetails,
        setUserDetails,
        loginadmin,
        logoutadmin,
        user,
        logout,
        clearUserDetails,
        loading,
        showLoginModal,
        setShowLoginModal,
        isLoggedIn,
        isLoggedInAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use context easily
export const useAuth = () => useContext(AuthContext);
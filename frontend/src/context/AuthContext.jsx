// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);        
  const [admin, setAdmin] = useState(null);     
  const [loading, setLoading] = useState(true);  
  const [showLoginModal, setShowLoginModal] = useState(false);

  const axiosOpts = { withCredentials: true };

  // NEW: Function to fetch current user session
  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get("/api/auth/me", axiosOpts);
      if (res?.data?.user) {
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      return { success: false, message: "No user data found" };
    } catch (err) {
      console.error("fetchCurrentUser error:", err.response?.data ?? err.message);
      setUser(null);
      return { success: false, message: err.response?.data?.message || "Server error" };
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const [userRes, adminRes] = await Promise.allSettled([
          axios.get("/api/auth/me", axiosOpts),
          axios.get("/api/admin/me", axiosOpts),
        ]);
        console.log("Admin check response:", adminRes);
        console.log("user check response:", userRes);
        console.log("---hahha", userRes.value?.data);

        // If backend returns user/admin in response body, set state accordingly.
        if (userRes.status === "fulfilled" && userRes.value?.data?.user) {
          setUser(userRes.value.data.user);
        } else {
          setUser(null);
        }

        if (adminRes.status === "fulfilled" && adminRes.value?.data?.admin) {
          setAdmin(adminRes.value.data.admin);
        } else {
          setAdmin(null);
        }
      } catch (err) {
        console.error("Session check error:", err);
        setUser(null);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // USER login - now handles both email/password AND refreshing session
  const loginuser = async (email, password) => {
    // If called without parameters (e.g., after Google login), just fetch current user
    if (!email || !password) {
      return await fetchCurrentUser();
    }

    // Otherwise, proceed with email/password login
    try {
      const res = await axios.post(
        "/api/auth/login",
        { email, password },
        axiosOpts
      );

      // Accept res.data.user or (res.data.success && res.data.user)
      const userObj = res?.data?.user ?? (res?.data?.success ? res.data.user : null);

      if (userObj) {
        setUser(userObj);
        return { success: true, user: userObj };
      }

      return { success: false, message: res?.data?.message || "Login failed" };
    } catch (err) {
      console.error("loginUser error:", err.response?.data ?? err.message);
      return { success: false, message: err.response?.data?.message || "Server error" };
    }
  };

  // ADMIN login
  const loginadmin = async (email, password) => {
    try {
      console.log("📤 Sending admin login request with:", { email, password });

      const res = await axios.post(
        "/api/admin/login",
        { email, password },
        axiosOpts
      );

      console.log("🔥 Raw admin login response:", res);
      console.log("🔥 Response data:", res.data);

      const adminObj =
        res?.data?.admin ?? (res?.data?.success ? res.data.admin : null);

      console.log("✅ Parsed admin object:", adminObj);

      if (adminObj) {
        setAdmin(adminObj);
        console.log("🎉 Admin state set:", adminObj);
        return { success: true, admin: adminObj };
      }

      console.warn("⚠️ No admin object found in response");
      return { success: false, message: res?.data?.message || "Login failed" };
    } catch (err) {
      console.error(
        "❌ loginAdmin error:",
        err.response?.data ?? err.message
      );
      return {
        success: false,
        message: err.response?.data?.message || "Server error",
      };
    }
  };

  // USER logout
  const logoutUser = async () => {
    try {
      await axios.post("/api/auth/logout", {}, axiosOpts);
    } catch (err) {
      console.error("logoutUser error:", err.response?.data ?? err.message);
      // proceed to clear client state regardless
    } finally {
      setUser(null);
    }
  };

  // ADMIN logout
  const logoutAdmin = async () => {
    try {
      await axios.post("/api/admin/logout", {}, axiosOpts);
    } catch (err) {
      console.error("logoutAdmin error:", err.response?.data ?? err.message);
    } finally {
      setAdmin(null);
    }
  };

  const isLoggedIn = !!user;
  const isLoggedInAdmin = !!admin;

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        showLoginModal,
        setShowLoginModal,
        loginuser,
        loginadmin,
        logoutUser,
        logoutAdmin,
        isLoggedIn,
        isLoggedInAdmin,
        fetchCurrentUser, // Export this if you need it elsewhere
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use context easily
export const useAuth = () => useContext(AuthContext);
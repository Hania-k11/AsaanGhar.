import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { BrowserRouter as Router } from "react-router-dom"; 
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from "axios";

import { GoogleOAuthProvider } from '@react-oauth/google';

// axios.defaults.baseURL = "http://localhost:3001"; // Removed - using Vite proxy instead (Good!)
// This setting is good if you're using a proxy (like Vite's) to handle /api calls.
axios.defaults.withCredentials = true; 

const queryClient = new QueryClient();

const GOOGLE_CLIENT_ID = "928405638610-qkd8neqtf3il0r0i2ke2k9hsadu2otls.apps.googleusercontent.com";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {/* Using the aliased Router (BrowserRouter) */}
          <Router> 
            <App />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
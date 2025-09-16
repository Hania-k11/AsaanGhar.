import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from "axios";

// axios.defaults.baseURL = "http://localhost:3001"; // Removed - using Vite proxy instead
axios.defaults.withCredentials = true; 

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <QueryClientProvider client={queryClient}>
    <AuthProvider>
     <Router>
        <App />
     </Router>
    </AuthProvider>
     </QueryClientProvider>
  </React.StrictMode>
);

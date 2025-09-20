// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../src/axios.js"; // make sure this has baseURL and withCredentials: true

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/dashboard", { withCredentials: true });
        if (res.status === 200) {
          setIsAuth(true);
        }
      } catch (err) {
        console.error("Not authenticated:", err);
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) return <p>Loading...</p>; // or a spinner

  return isAuth ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;

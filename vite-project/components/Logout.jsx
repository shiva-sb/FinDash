import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8001/api/auth/logout", {}, {
        withCredentials: true
      });

      alert("Logged out successfully");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Logout failed");
    }
  };

  return (
    <button onClick={handleLogout} style={{ padding: "10px 20px", cursor: "pointer" }}>
      Logout
    </button>
  );
}

export default Logout;

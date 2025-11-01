import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Navbar() {

  const {user, logout } = useContext(AuthContext);
  const nav = useNavigate();
  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <nav style={{
      
      padding: "12px 24px",
      
    }} className="flex justify-between items-center bg-[#222] text-white">
      <h3 className="text-[24px] font-bold"> {user?.username ? user.username : "Guest"}</h3>
      <div  className="felx justify-around items-center">
        <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }} className="pl-5">Dashboard</Link>
        <Link to="/marketplace" style={{ color: "white", textDecoration: "none" }} className="pl-5">Marketplace</Link>
        <Link to="/notifications" style={{ color: "white", textDecoration: "none" }} className="pl-5 pr-5">Notifications</Link>
        <button
          onClick={handleLogout}
          style={{
            background: "crimson",
            color: "white",
            border: "none",
            padding: "6px 12px",
            borderRadius: "4px",
            cursor: "pointer"
          }}
          
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

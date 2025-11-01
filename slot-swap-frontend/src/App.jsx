import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Marketplace from "./pages/MarketPlace";
import Notifications from "./pages/Notifications";
import Home from "./pages/Home";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="m-0">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/notifications" element={<Notifications />} />
            </Routes>

        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

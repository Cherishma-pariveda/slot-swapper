import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("access");
    return token ? jwtDecode(token) : null;
  });

  const [authTokens, setAuthTokens] = useState(() => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");
    return access && refresh ? { access, refresh } : null;
  });

  const login = async (username, password) => {
    const res = await api.post("/token/", { username, password });
    const tokens = res.data;

    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);
    const decoded = jwtDecode(tokens.access); 
    setUser({ 
    username: decoded.username || decoded.user_name || username,
    user_id: decoded.user_id || decoded.id 
    });
    
    setAuthTokens(tokens);
  
  };

  const signup = async (username, email, password) => {
    await api.post("/register/", { username, email, password });
  };

  const logout = () => {
    setUser(null);
    setAuthTokens(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  const contextData = {
    user,
    authTokens,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};

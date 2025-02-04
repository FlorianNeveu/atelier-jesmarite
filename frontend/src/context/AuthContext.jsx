import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie"; 

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isAdmin, setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

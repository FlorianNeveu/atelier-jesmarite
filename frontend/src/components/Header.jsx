import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Link } from 'react-router-dom';
import axiosInstance from "../axiosConfig";
import { jwtDecode } from 'jwt-decode';
import "../styles/Header.scss"; 

const Header = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const navigate = useNavigate();

  
  useEffect(() => {
    const checkAdminStatus = () => {
      const token = Cookies.get("token");

      if (token) {
        try {
          const decoded = jwtDecode(token);
          setIsAuthenticated(true);  
          setIsAdmin(decoded.role === "admin");
        } catch (error) {
          console.error("Erreur lors du décodage du token:", error);
          setIsAuthenticated(false); 
          setIsAdmin(false); 
        }
      } else {
        setIsAuthenticated(false); 
        setIsAdmin(false);
      }
    };

    checkAdminStatus(); 
  }, [setIsAuthenticated]);

  
  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error("Erreur déconnexion:", error);
    }
    Cookies.remove('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/', { replace: true });
  };

  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Atelier de Jesmarite</Link>
      </div>
      
      
      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* Navigation */}
      <nav className={`navigation ${isMenuOpen ? "open" : ""}`}>
        {isAuthenticated ? (
          <ul>
            <li>
              <button onClick={handleLogout}>Se déconnecter</button>
            </li> 
            <li>
              <Link to="/products">Produits</Link>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <Link to="/login">Se connecter</Link> 
            </li>
            <li>
              <Link to="/signup">S'inscrire</Link> 
            </li>
            <li>
              <Link to="/products">Produits</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        )}
      </nav>

    </header>
  );
};

export default Header;

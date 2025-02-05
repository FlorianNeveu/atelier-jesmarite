import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Link } from 'react-router-dom';
import axiosInstance from "../axiosConfig";
import "../styles/Header.scss"; 

const Header = () => {
  const { isAuthenticated, setIsAuthenticated, isAdmin, setIsAdmin } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const navigate = useNavigate();

  
  const checkAdminStatus = async () => {
    try {
      const response = await axiosInstance.get('/auth/me', { withCredentials: true }); // Appelle /auth/me pour récupérer l'utilisateur
      if (response.data.user) {
        setIsAuthenticated(true);
        setIsAdmin(response.data.user.role === 'admin'); // Vérifie si l'utilisateur est un admin
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, []);

  
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

  const closeMenu = () => {
    setIsMenuOpen(false);
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
            <Link to="/products" onClick={closeMenu}>Produits</Link>
            </li>
            {isAdmin && <li><Link to="/dashboard" onClick={closeMenu}>Dashboard</Link></li>} 
            <li>
            <button onClick={() => {handleLogout();closeMenu();}}>Se déconnecter</button>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
            <Link to="/about" onClick={closeMenu}>A propos</Link> 
            </li>
            <li>
            <Link to="/login" onClick={closeMenu}>Se connecter</Link>
            </li>
            <li>
            <Link to="/products" onClick={closeMenu}>Produits</Link>
            </li>
            <li>
            <Link to="/cart" onClick={closeMenu}>panier</Link>
            </li>
          </ul>
        )}
      </nav>

    </header>
  );
};

export default Header;

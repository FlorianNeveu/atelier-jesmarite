import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../styles/Header.scss";

const Header = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      setIsAdmin(true);
    }
  }, [isAuthenticated]);

  
  const handleLogout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
    localStorage.removeItem('role');
    alert("Déconnexion réussie !");
    navigate('/'); 
  };

  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <a href="/">Atelier de Jesmarite</a>
      </div>
      
      {/* Menu Hamburger pour mobile */}
      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* Navigation */}
      <nav className={`navigation ${isMenuOpen ? "open" : ""}`}>
        {isAuthenticated ? (
          <ul>
            {isAdmin && (
              <li>
                <button onClick={() => navigate("/dashboard")}>Dashboard</button>
              </li> 
            )}
            <li>
              <button onClick={handleLogout}>Se déconnecter</button>
            </li> 
          </ul>
        ) : (
          <ul>
            <li>
              <a href="/login">Se connecter</a> 
            </li>
            <li>
              <a href="/signup">S'inscrire</a> 
            </li>
            <li>
              <a href="products">Produits</a> 
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Header;

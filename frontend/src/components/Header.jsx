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
        <a href="/">Atelier de Jesmarite</a> {/* Lien vers la page d'accueil */}
      </div>
      
      {/* Menu Hamburger pour mobile */}
      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      
      <nav className={`navigation ${isMenuOpen ? "open" : ""}`}>
        {isAuthenticated ? (
          <div>
            {isAdmin && (
              <button onClick={() => navigate("/dashboard")}>Dashboard</button>
            )}
            <button onClick={handleLogout}>Se déconnecter</button>
          </div>
        ) : (
          <div>
            <a href="/login">Se connecter</a>
            <a href="/signup">S'inscrire</a>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

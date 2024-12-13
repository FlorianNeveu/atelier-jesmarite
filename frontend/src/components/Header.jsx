import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.scss';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">L'Atelier Jesmarite</Link>
      </div>
      <nav className="navigation">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/signup">Sign Up</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axiosInstance from "./axiosConfig";
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Signup from './pages/Signup';
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import ProductPage from "./pages/ProductPage";
import Dashboard from './pages/Dashboard';
import './styles/App.scss';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifie si l'utilisateur est connecté et récupère son rôle
  const checkAuthStatus = async () => {
    try {
      const response = await axiosInstance.get('/auth/me', { withCredentials: true });
      
      if (response.data.user) {
        setIsAuthenticated(true);
        setIsAdmin(response.data.user.role === 'admin');
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification', error);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();  // Vérifie l'authentification au chargement du composant
  }, []);

  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products/:productId" element={<ProductPage />} />
          
          {/* Affiche le Dashboard uniquement si l'utilisateur est un admin */}
          <Route 
            path="/dashboard" 
            element={isAdmin ? <Dashboard /> : <Navigate to="/" replace />} 
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;

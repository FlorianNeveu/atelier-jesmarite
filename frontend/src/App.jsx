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
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import './styles/App.scss';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const initializeSession = async () => {
    let sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      try {
        const user_id = localStorage.getItem("userId") || null;
        const response = await axiosInstance.post("/sessions", { user_id });
        sessionId = response.data.id;
        localStorage.setItem("sessionId", sessionId);
        console.log("Nouvelle session créée :", sessionId);
      } catch (error) {
        console.error("Erreur lors de la création de la session :", error);
      }
    }
  };

  const checkAdminStatus = () => {
    const token = Cookies.get('token');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAuthenticated(true);
        setIsAdmin(decoded.role === 'admin');
      } catch (error) {
        console.error("Erreur de décodage du token :", error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  useEffect(() => {

    initializeSession();
    checkAdminStatus();

    const interval = setInterval(checkAdminStatus, 5000);
    return () => clearInterval(interval);  
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

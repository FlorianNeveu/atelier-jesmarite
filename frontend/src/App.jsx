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
import EditProduct from './pages/EditProducts';
import AddProduct from './pages/AddProduct';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';
import About from './pages/About';
import Collections from "./pages/Collections";
import CollectionsDetail from './pages/CollectionsDetail';

import './styles/App.scss';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeSession();
    checkAdminStatus();

  }, []);

  if (isLoading) {
    return <p>Chargement...</p>;
  }

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
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:categoryId" element={<CollectionsDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={isAdmin ? <Dashboard /> : <Navigate to="/" replace />} />
          <Route path="//edit-product/:productId" element={isAdmin ? <EditProduct /> : <Navigate to="/" replace />} />
          <Route path="/add-product" element={isAdmin ? <AddProduct /> : <Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;

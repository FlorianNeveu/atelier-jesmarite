import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axiosInstance from "./axiosConfig";
import Header from './components/Header';
import Footer from './components/Footer';


const Home=lazy(() => import('./pages/Home'));
const Products=lazy(() => import('./pages/Products'));
const Signup = lazy(() => import('./pages/Signup'));
const Login=lazy(() => import('./pages/Login'));
const Cart=lazy(() => import('./pages/Cart'));
const ProductPage=lazy(() => import('./pages/ProductPage'));
const Dashboard=lazy(() => import('./pages/Dashboard'));
const EditProduct = lazy(() => import('./pages/EditProducts'));
const AddProduct = lazy(() => import('./pages/AddProduct'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Collections = lazy(() => import('./pages/Collections'));
const CollectionsDetail = lazy(() => import('./pages/CollectionsDetail'));
const AddCategory = lazy(() => import('./pages/AddCategory'));
const EditCategory = lazy(() => import('./pages/EditCategory'));
const Success = lazy(() => import('./pages/Success'));

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
      <Suspense fallback={<div>Chargement...</div>}>
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
          <Route path="/edit-product/:productId" element={isAdmin ? <EditProduct /> : <Navigate to="/" replace />} />
          <Route path="/add-product" element={isAdmin ? <AddProduct /> : <Navigate to="/" replace />} />
          <Route path="/add-category" element={isAdmin ? <AddCategory /> : <Navigate to="/" replace />} />
          <Route path="/edit-category/:categoryId" element={isAdmin ? <EditCategory /> : <Navigate to="/" replace />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </Suspense>
      </main>
      <Footer />
    </Router>
  );
};

export default App;

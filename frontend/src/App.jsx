import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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
import './styles/App.scss';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const initializeSession = async () => {
      let sessionId = localStorage.getItem("sessionId");

      if (!sessionId) {
        try {
          const user_id = localStorage.getItem("userId") || null;
          const response = await axiosInstance.post("/sessions", { user_id });
          sessionId = response.data.id; 
          localStorage.setItem("sessionId", sessionId);


          const userResponse = await axiosInstance.get("/users/me");
          if (userResponse.data.role === 'admin') {
            setIsAdmin(true);
          }

          console.log("Nouvelle session créée :", sessionId);
        } catch (error) {
          console.error("Erreur lors de la création de la session :", error);
        }
      } else {
        console.log("Session existante :", sessionId);
      }
    };

    initializeSession();
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
          {isAdmin && <Route path="/dashboard" element={<Dashboard />} />}
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;

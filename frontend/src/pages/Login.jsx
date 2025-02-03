import React, { useState, useContext } from "react";
import axiosInstance from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      console.log("Réponse complète du serveur :", response); // Debug
      
      const { user, token } = response.data;
  
      // Validation de la réponse
      if (!user?.id || !token) {
        throw new Error("Réponse serveur invalide");
      }
      
      if (token.split('.').length !== 3) {
        throw new Error("Format de token invalide");
      }
  
      // Stockage sécurisé du token
      Cookies.set("token", token, {
        expires: 1,
        secure: true,
        sameSite: 'strict',
        path: '/'
      });
  
      localStorage.setItem("userId", user.id);
  
      // Mise à jour de session
      const sessionId = localStorage.getItem("sessionId");
      if (sessionId) {
        await axiosInstance.put(`/sessions/${sessionId}`, { user_id: user.id });
        console.log("Session mise à jour");
      }
  
      setIsAuthenticated(true);
      navigate("/");
  
    } catch (error) {
      console.error("Erreur technique :", {
        message: error.message,
        response: error.response?.data,
        code: error.code
      });
      
      setErrorMessage(
        error.response?.data?.message || 
        "Erreur technique lors de la connexion"
      );
    }
  };

  return (
    <div className="login">
      <h1>Se connecter</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default Login;

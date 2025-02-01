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
      const { user, token } = response.data;

      // Stocke le token et l'ID utilisateur
      document.cookie = `token=${token}; path=/`;
      localStorage.setItem("userId", user.id);

      // Met à jour la session avec le user_id
      const sessionId = localStorage.getItem("sessionId");
      if (sessionId) {
        await axiosInstance.put(`/sessions/${sessionId}`, { user_id: user.id });
        console.log("🔄 Session mise à jour avec user_id :", user.id);
      }

      setIsAuthenticated(true);
      setErrorMessage("");
      alert("Connexion réussie !");
      navigate("/");
    } catch (error) {
      setErrorMessage("Erreur lors de la connexion. Veuillez vérifier vos identifiants.");
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

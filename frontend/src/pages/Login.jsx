// Page de connexion

import React, { useState, useContext } from "react";
import axiosInstance from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const cleanInput = (input) => {
  return input.replace(/[<&{}>]/g, '');
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { setIsAuthenticated, setIsAdmin } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validation des inputs et mesure de sécurité
  const validateInputs = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Veuillez entrer un email valide.");
      return false;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Le mot de passe doit comporter au moins 6 caractères. Et être composé de lettres et chiffres.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedEmail = cleanInput(formData.email);
    const cleanedPassword = cleanInput(formData.password);

    if (!validateInputs()) return;

    try {
      const response = await axiosInstance.post("/auth/login", {
        email: cleanedEmail,
        password: cleanedPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true,
      });

      const { user } = response.data;

      if (!user?.id) {
        throw new Error("Réponse serveur invalide");
      }

      localStorage.setItem("userId", user.id);

      const sessionId = localStorage.getItem("sessionId");
      if (sessionId) {
        await axiosInstance.put(`/sessions/${sessionId}`, { user_id: user.id });
      }


      setIsAuthenticated(true);
      setIsAdmin(user.role === "admin");


      if (user.role === "admin") {
        navigate("/");
        window.location.reload();
      } else {
        navigate("/"); 
      }

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

      <p>Vous n'avez pas de compte ? <a href="/signup">Créer un compte</a></p>
    </div>
  );
};

export default Login;

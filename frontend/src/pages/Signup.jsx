import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const cleanInput = (input) => {
  return input.replace(/[<&{}>]/g, '');
};

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    telephone: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateInputs = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Veuillez entrer un email valide.");
      return false;
    }

    if (formData.password.length < 8) {
      setErrorMessage("Le mot de passe doit comporter au moins 6 caractères.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedFirstName = cleanInput(formData.first_name);
    const cleanedLastName = cleanInput(formData.last_name);
    const cleanedEmail = cleanInput(formData.email);
    const cleanedPassword = cleanInput(formData.password);
    const cleanedTelephone = cleanInput(formData.telephone);

    if (!validateInputs()) return;

    try {
      const response = await axiosInstance.post("/auth/register", {
        first_name: cleanedFirstName,
        last_name: cleanedLastName,
        email: cleanedEmail,
        password: cleanedPassword,
        telephone: cleanedTelephone,
      });
      setSuccessMessage(response.data.message);
      setErrorMessage("");

      navigate("/login");
    } catch (error) {
      setErrorMessage("Erreur lors de l'inscription. Veuillez réessayer.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="signup">
      <h1>Créer un compte</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          placeholder="Prénom"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Nom"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
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
        <input
          type="text"
          name="telephone"
          placeholder="Téléphone"
          value={formData.telephone}
          onChange={handleChange}
          required
        />
        <button type="submit">S'inscrire</button>
      </form>
      {successMessage && <p className="success">{successMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default Signup;

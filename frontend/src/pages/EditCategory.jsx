// Page d'edition de catégories

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const EditCategory = () => {
  const { categoryId } = useParams();
  const [formData, setFormData] = useState({name: "", description: "",});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Recupere la catégorie spécifique
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axiosInstance.get(`/categories/${categoryId}`);
        setFormData(response.data);
      } catch (error) {
        setError("Erreur lors de la récupération de la catégorie.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.put(`/categories/${categoryId}`, formData);
      navigate('/dashboard');
    } catch (error) {
      setError("Erreur lors de la mise à jour de la catégorie.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="edit-category">
      <h1>Modifier la catégorie</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nom</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {error && <p className="error">{error}</p>}
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/dashboard')}>
            Annuler
          </button>
          <button type="submit" className="submit-btn">
            Mettre à jour
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const EditCategory = () => {
  const { id, categoryId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axiosInstance.get(`/categories/${categoryId}`);
        setFormData(response.data);
      } catch (error) {
        setError('Catégorie non trouvée');
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/categories/${categoryId}`, formData);
      navigate('/dashboard');
    } catch (error) {
      setError('Erreur lors de la mise à jour');
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="form-container">
      <h1>Modifier la catégorie</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/dashboard')}>Annuler</button>
          <button type="submit">Enregistrer</button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
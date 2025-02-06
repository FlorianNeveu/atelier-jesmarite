import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const AddCategory = () => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/categories', formData);
      navigate('/dashboard');
    } catch (error) {
      setError('Erreur lors de la création de la catégorie');
    }
  };

  return (
    <div className="form-container">
      <h1>Créer une nouvelle catégorie</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom de la catégorie:</label>
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

        {error && <p className="error">{error}</p>}
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/dashboard')}>Annuler</button>
          <button type="submit">Créer la catégorie</button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
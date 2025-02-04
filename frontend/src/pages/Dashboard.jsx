import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  
    fetchProducts(); 
    setLoading(false); 
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products');
      setProducts(response.data);
    } catch (error) {
      setError('Échec du chargement des produits.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    setDeletingId(id);
    try {
      await axiosInstance.delete(`/products/${id}`);
      await fetchProducts();
    } catch (error) {
      setError('Échec de la suppression.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="dashboard">
      <h1>Tableau de bord Admin:</h1>
      <button onClick={() => navigate('/add-product')}>Ajouter un produit</button>

      <h2>Liste des produits</h2>
      <table className="products-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Prix</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{Number(product.price).toFixed(2)} €</td>
              <td>
                <button 
                  aria-label="Modifier"
                  onClick={() => navigate(`/edit-product/${product.id}`)}
                >
                  ✏️
                </button>
                <button
                  aria-label="Supprimer"
                  disabled={deletingId === product.id}
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  {deletingId === product.id ? '⏳' : '🗑️'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;

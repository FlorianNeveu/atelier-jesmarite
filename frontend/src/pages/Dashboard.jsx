// Page du dashboard accessible uniquement si connecté en tant qu'admin.

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  // Recupere les produits et les catégories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axiosInstance.get('/products'),
          axiosInstance.get('/categories')
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        setError('Échec du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fonction de suppression
  const handleDelete = async (type, id) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    setDeletingId(id);
    try {
      await axiosInstance.delete(`/${type}/${id}`);
      if (type === 'products') {
        setProducts(prev => prev.filter(item => item.id !== id));
      } else {
        setCategories(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      setError(`Échec de la suppression ${type === 'products' ? 'du produit' : 'de la catégorie'}`);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="dashboard">
      <h1>Tableau de bord Admin</h1>

      <section className="management-section">
        <div className="section-header">
          <h2>Produits</h2>
          <button onClick={() => navigate('/add-product')} className="add-button">+ Nouveau produit</button>
        </div>
        
        <div className="items-grid">
          {products.map((product) => (
            <div key={product.id} className="item-card">
              <h3>{product.name}</h3>
              <img src={product.image} alt={product.name} loading="lazy" />
              <p>{product.description}</p>
              <p>Prix : {product.price}€</p>
              <div className="actions">
                <button className="edit-btn" onClick={() => navigate(`/edit-product/${product.id}`)}>✏️</button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete('products', product.id)}
                  disabled={deletingId === product.id}
                >
                  {deletingId === product.id ? '⏳' : '🗑️'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="management-section">
        <div className="section-header">
          <h2>Catégories</h2>
          <button onClick={() => navigate('/add-category')} className="add-button">+ Nouvelle catégorie</button>
        </div>

        <div className="items-grid">
          {categories.map((category) => (
            <div key={category.id} className="item-card">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <div className="actions">
                <button className="edit-btn" onClick={() => navigate(`/edit-category/${category.id}`)}>✏️</button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete('categories', category.id)}
                  disabled={deletingId === category.id}
                >
                  {deletingId === category.id ? '⏳' : '🗑️'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

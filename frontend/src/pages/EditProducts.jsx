import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const EditProduct = () => {
  const { productId } = useParams();  
  const [product, setProduct] = useState(null);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        setError('Erreur lors de la récupération des informations du produit.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct(); 
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/products/${productId}`, product);  
      navigate('/dashboard'); 
    } catch (error) {
      setError('Erreur lors de la mise à jour du produit.');
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="edit-product">
      <h1>Modifier le produit</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nom</label>
          <input
            type="text"
            id="name"
            value={product?.name || ''}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            value={product?.description || ''}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Prix</label>
          <input
            type="number"
            id="price"
            value={product?.price || ''}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            required
          />
        </div>
        <button type="submit">Mettre à jour le produit</button>
      </form>
    </div>
  );
};

export default EditProduct;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const EditProduct = () => {
  const { productId } = useParams();  
  const [product, setProduct] = useState(null);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newImage, setNewImage] = useState(null);
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

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("quantity", product.quantity);
    formData.append("category_id", product.category_id);
    if (newImage) formData.append("image", newImage);  // Si une nouvelle image est ajoutée

    try {
      await axiosInstance.put(`/products/${productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",  // Important pour envoyer des fichiers
        },
      });
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
        <div>
          <label htmlFor="quantity">Quantité</label>
          <input
            type="number"
            id="quantity"
            value={product?.quantity || ''}
            onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="category_id">Catégorie</label>
          <input
            type="text"
            id="category_id"
            value={product?.category_id || ''}
            onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">
          Mettre à jour le produit
        </button>
      </form>
    </div>
  );
};

export default EditProduct;

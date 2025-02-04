import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setProduct({
      ...product,
      image: e.target.files[0],  // Récupère l'image sélectionnée
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("image", product.image);  // Ajoute l'image dans le FormData

    try {
      await axiosInstance.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",  // Spécifie que l'on envoie des données de type "multipart/form-data"
        },
      });
      navigate("/dashboard");
    } catch (error) {
      setError("Erreur lors de l'ajout du produit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Ajouter un produit</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nom</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Prix</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
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
        <button type="submit" disabled={loading}>
          {loading ? "Chargement..." : "Ajouter le produit"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les éléments du panier depuis l'API
    const fetchCartItems = async () => {
      try {
        const response = await axiosInstance.get('/carts');
        setCartItems(response.data);  // Met à jour les éléments du panier
      } catch (error) {
        console.error("Erreur lors de la récupération du panier :", error);
      }
    };
    fetchCartItems();
  }, []);

  // Fonction pour gérer le paiement et la redirection vers Stripe Checkout
  const handleCheckout = async () => {
    try {
      // Envoie les éléments du panier au backend pour créer la session de paiement
      const response = await axiosInstance.post('/create-checkout-session', { cartItems });

      // Stripe redirige automatiquement l'utilisateur vers la page de paiement
      window.location.href = response.data.url; // Rediriger vers l'URL de la session Stripe
    } catch (error) {
      console.error("Erreur lors de la création de la session Stripe :", error);
    }
  };

  return (
    <div>
      <h1>Panier</h1>
      {/* Affiche les produits du panier */}
      {cartItems.length > 0 ? (
        <div>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                <h2>{item.Product.name}</h2>
                <p>Quantité : {item.quantity}</p>
                <p>Prix : {item.Product.price} €</p>
              </li>
            ))}
          </ul>
          <button onClick={handleCheckout}>Passer au paiement</button>
        </div>
      ) : (
        <p>Votre panier est vide.</p>
      )}
    </div>
  );
};

export default Checkout;

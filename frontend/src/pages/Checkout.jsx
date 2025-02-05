import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig'; // Pour récupérer les éléments du panier
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const sessionId = localStorage.getItem('sessionId');
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les éléments du panier depuis l'API
    const fetchCartItems = async () => {
      try {
        const response = await axiosInstance.get(`/carts/${sessionId}`);
        setCartItems(response.data);  // Met à jour les éléments du panier
      } catch (error) {
        console.error("Erreur lors de la récupération du panier :", error);
      }
    };
    fetchCartItems();
  }, []);

  // Calcul du montant total, avec vérification de l'existence de 'Product'
  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => {
      if (item.Product && item.Product.price) {
        return total + (item.quantity * item.Product.price);
      }
      return total; // Si Product ou price n'existent pas, on ne l'ajoute pas
    }, 0);
  };

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
                {/* Vérifie que item.Product existe avant d'afficher ses informations */}
                {item.Product ? (
                  <>
                    <h2>{item.Product.name}</h2>
                    <p>Quantité : {item.quantity}</p>
                    <p>Prix : {item.Product.price} €</p>
                  </>
                ) : (
                  <p>Produit indisponible</p>
                )}
              </li>
            ))}
          </ul>
          <div>
            <h3>Total : {calculateTotalAmount()} €</h3>
            <button onClick={handleCheckout}>Passer au paiement</button>
          </div>
        </div>
      ) : (
        <p>Votre panier est vide.</p>
      )}
    </div>
  );
};

export default Checkout;

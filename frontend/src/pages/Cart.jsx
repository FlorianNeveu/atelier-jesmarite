// La page du panier

import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useNavigate } from 'react-router-dom';
import AddressForm from "../components/AddressForm";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    country: 'FR',
    mobile: ''
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const sessionId = localStorage.getItem("sessionId");
  const navigate = useNavigate();

  // Fonction de mise à jour du panier
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!sessionId) {
        console.warn("⚠️ Pas de sessionId disponible !");
        return;
      }
      // Récupérer les éléments du panier depuis l'API
      try {
        const response = await axiosInstance.get(`/carts/${sessionId}`);
        setCartItems(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erreur lors de la récupération du panier :", error);
        setCartItems([]);
      }
    };

    fetchCartItems();
  }, [sessionId]);

  // Calcul du montant total
  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => (
      item.Product?.price ? total + (item.quantity * item.Product.price) : total
    ), 0);
  };

  // Fonction de mise à jour de la quantité
  const handleQuantityChange = async (productId, newQuantity) => {
    if (isNaN(newQuantity) || newQuantity < 0) {
      alert("Quantité invalide (minimum 1)");
      return;
    }
  
    const currentQuantity = cartItems.find(item => item.Product.id === productId).quantity;

    const product = cartItems.find(item => item.Product.id === productId).Product;
    const availableQuantity = product.quantity;

    if (newQuantity > availableQuantity) {
      alert(`Pas assez de stock. Quantité disponible : ${availableQuantity}`);
      return;
    }
  
    try {
      const response = await axiosInstance.put(`/carts/${sessionId}/update`, {
        product_id: productId,
        quantity: newQuantity,
      });
  
      await axiosInstance.put(`/products/${productId}/update-quantity`, {
        quantity: newQuantity,
        oldQuantity: currentQuantity
      });
  
      setCartItems(prev => prev.map(item => 
        item.Product.id === productId ? response.data : item
      ));
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de la mise à jour");
    }
  };
  
  // Fonction de suppression de produit
  const handleRemoveProduct = async (productId) => {
    if (!window.confirm('Confirmer la suppression ?')) return;

    try {
      await axiosInstance.delete(`/carts/${sessionId}/product/${productId}`);
      setCartItems(prev => prev.filter(item => item.Product.id !== productId));
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
    }
  };

  // Fonction de validation des champs
  const validateInputs = () => {
    const postalCodeRegex = /^[0-9]{5,6}$/; 
    const phoneRegex = /^[0-9]{10,15}$/;  
  
    if (!postalCodeRegex.test(shippingAddress.postal_code)) {
      alert("Veuillez entrer un code postal valide.");
      return false;
    }
  
    if (!phoneRegex.test(shippingAddress.mobile)) {
      alert("Veuillez entrer un numéro de téléphone valide.");
      return false;
    }
  
    return true;
  };

  // Fonction de traitement du paiement
  const handleCheckout = async () => {

    if (!validateInputs()) return;
    
    if (!shippingAddress.address_line1 || !shippingAddress.city || !shippingAddress.postal_code) {
      alert('Veuillez remplir les champs obligatoires (*)');
      return;
    }

    try {
      const response = await axiosInstance.post('/create-checkout-session', { 
        cartItems: cartItems.map(item => ({
          Product: { 
            id: item.Product.id,
            name: item.Product.name,
            price: item.Product.price
          },
          quantity: item.quantity
        })), 
        shippingAddress
      });
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Erreur lors de la création de la session Stripe :", error);
    }
  };

  return (
    <div className="cart">
      <h1>Votre Panier</h1>
      
      {cartItems.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={index} className={`cart-item ${index % 2 === 0 ? "even" : "odd"}`}>
              {item.Product ? (
                <div className="product-details">
                  <div className="product-image">
                    <img src={item.Product.image} alt={item.Product.name} />
                  </div>
                  <div className="product-info">
                    <h2>{item.Product.name}</h2>
                    <p>Quantité : 
                      <input 
                        type="number" 
                        value={item.quantity} 
                        min="0"
                        onChange={(e) => handleQuantityChange(item.Product.id, parseInt(e.target.value))}
                      />
                    </p>
                    <p>Prix unitaire : {item.Product.price} €</p>
                    <p>Total : {item.quantity * item.Product.price} €</p>
                    <button onClick={() => handleRemoveProduct(item.Product.id)} className="remove-btn">
                      Supprimer
                    </button>
                  </div>
                </div>
              ) : (
                <p>Produit indisponible</p>
              )}
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="checkout-section">
          {!showAddressForm ? (
            <button 
              className="add-address-btn"
              onClick={() => setShowAddressForm(true)}
            >
              Ajouter une adresse de livraison
            </button>
          ) : (
            <AddressForm 
              shippingAddress={shippingAddress}
              setShippingAddress={setShippingAddress}
              onClose={() => setShowAddressForm(false)}
            />
          )}
          
          <div className="total-section">
            <h3>Total : {calculateTotalAmount()} €</h3>
            <button 
              onClick={handleCheckout}
              disabled={!showAddressForm}
              className="checkout-btn"
            >
              Passer au paiement
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
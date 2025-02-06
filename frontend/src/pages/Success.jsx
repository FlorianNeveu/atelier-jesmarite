import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();


  React.useEffect(() => {
    if (location.search.includes('session_id')) {
      navigate('/success', { replace: true });
    }
  }, [location.search, navigate]);

  return (
    <div className="simple-success-container">
      <h1>Merci pour votre achat !</h1>
      <p>Nous apprécions votre confiance.</p>
      <button onClick={() => navigate('/')}>Retour à l'accueil</button>
    </div>
  );
};

export default Success;
// src/pages/ThankYouPage.jsx - MODIFIÉ
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTrophy, FaShareAlt, FaCalendarAlt, FaSchool } from 'react-icons/fa';

const ThankYouPage = () => {
  const location = useLocation();
  const [submissionData, setSubmissionData] = useState(null);

  useEffect(() => {
    // Récupérer les données depuis l'URL
    const params = new URLSearchParams(location.search);
    const data = {
      name: params.get('name') || 'Guerrier Gaulois',
      email: params.get('email') || '',
      mission: params.get('mission') || 'contact',
      message: params.get('message') || '',
      amount: params.get('amount') || '20',
      skills: params.get('skills') ? params.get('skills').split(',') : [],
      recurring: params.get('recurring') === 'true'
    };
    
    setSubmissionData(data);
  }, [location]);

  const getMissionDetails = (missionType) => {
    const missions = {
      contact: {
        title: 'Message Magique Envoyé!',
        message: 'Ton message a été transmis aux druides NIRD.',
        icon: '🪄',
        badge: '🪄 Messager de la Potion'
      },
      donate: {
        title: 'Ressources Fournies!',
        message: `Merci pour ton don de ${submissionData?.amount}€!`,
        icon: '💰',
        badge: '💰 Donateur Résistant'
      },
      volunteer: {
        title: 'Guerrier Recruté!',
        message: 'Bienvenue dans notre armée de bénévoles!',
        icon: '🛡️',
        badge: '🛡️ Guerrier Gaulois'
      },
      info: {
        title: 'Oracle Consulté!',
        message: 'Les secrets te seront révélés bientôt.',
        icon: '📜',
        badge: '📜 Sage Numérique'
      }
    };
    
    return missions[missionType] || missions.contact;
  };

  if (!submissionData) {
    return (
      <div className="container" style={{ 
        paddingTop: '50px', 
        paddingBottom: '50px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h2>Chargement de ta victoire...</h2>
        <p>Redirection en cours...</p>
        <Link to="/" style={{
          padding: '10px 20px',
          background: '#2d5a27',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          display: 'inline-block',
          marginTop: '20px'
        }}>
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const missionDetails = getMissionDetails(submissionData.mission);

  return (
    <div className="container" style={{ 
      paddingTop: '50px', 
      paddingBottom: '50px',
      textAlign: 'center'
    }}>
      {/* Celebration Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        backdropFilter: 'blur(10px)',
        borderRadius: '30px',
        padding: '40px',
        marginBottom: '40px',
        border: '2px solid rgba(139, 92, 246, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Trophy */}
        <div style={{
          fontSize: '5rem',
          marginBottom: '20px',
          animation: 'float 3s ease-in-out infinite'
        }}>
          <FaTrophy />
        </div>
        
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
          {missionDetails.title}
        </h1>
        
        <p style={{ fontSize: '1.2rem', color: '#c4b5fd', marginBottom: '30px' }}>
          Félicitations {submissionData.name}! {missionDetails.message}
        </p>
        
        {/* Badge */}
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          padding: '10px 25px',
          borderRadius: '25px',
          fontWeight: 'bold',
          marginBottom: '30px',
          boxShadow: '0 5px 15px rgba(251, 191, 36, 0.3)'
        }}>
          {missionDetails.icon} {missionDetails.badge}
        </div>

        {/* Détails de la soumission */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          textAlign: 'left',
          maxWidth: '500px',
          margin: '30px auto'
        }}>
          <h4 style={{ color: '#fbbf24', marginBottom: '15px' }}>
            Détails de ta quête:
          </h4>
          <div style={{ color: '#c4b5fd' }}>
            <p><strong>Nom:</strong> {submissionData.name}</p>
            <p><strong>Email:</strong> {submissionData.email}</p>
            <p><strong>Mission:</strong> {submissionData.mission}</p>
            {submissionData.message && (
              <p><strong>Message:</strong> {submissionData.message}</p>
            )}
            {submissionData.amount && (
              <p><strong>Montant:</strong> {submissionData.amount}€</p>
            )}
            {submissionData.skills.length > 0 && (
              <p><strong>Compétences:</strong> {submissionData.skills.join(', ')}</p>
            )}
          </div>
        </div>
      </div>

      {/* 2025 Message */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(251, 191, 36, 0.05))',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '40px',
        textAlign: 'left'
      }}>
        <h3 style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          color: '#fbbf24',
          marginBottom: '20px'
        }}>
          <FaCalendarAlt /> Année 2025: L'Année de la Grande Résistance!
        </h3>
        
        <p style={{ marginBottom: '20px' }}>
          Grâce à toi, nous atteindrons notre objectif 2025:
          <br />
          <strong>100 écoles libérées de Windows 10 avant son obsolescence en Octobre 2025!</strong>
        </p>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center',
          marginTop: '30px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'white',
            padding: '10px 20px',
            borderRadius: '10px',
            color: '#1f2937'
          }}>
            <FaSchool /> <span>+15 écoles cette année</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'white',
            padding: '10px 20px',
            borderRadius: '10px',
            color: '#1f2937'
          }}>
            💻 <span>250 PC reconditionnés</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'white',
            padding: '10px 20px',
            borderRadius: '10px',
            color: '#1f2937'
          }}>
            💰 <span>€45,000 d'économies</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        <Link to="/" style={{
          padding: '15px 30px',
          background: 'linear-gradient(135deg, #b22222, #8b5cf6)',
          color: 'white',
          borderRadius: '10px',
          textDecoration: 'none',
          textAlign: 'center',
          fontWeight: '600'
        }}>
          🏡 Retour au Village Principal
        </Link>
        
        <button style={{
          padding: '15px 30px',
          background: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          border: '2px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          fontWeight: '600'
        }}
        onClick={() => {
          const shareText = `Je viens de rejoindre la Résistance NIRD 2025 contre l'obsolescence programmée! ${window.location.origin}`;
          navigator.clipboard.writeText(shareText)
            .then(() => alert('Lien copié! Partage-le avec tes amis!'))
            .catch(err => console.error('Erreur:', err));
        }}>
          <FaShareAlt /> Partager la Victoire
        </button>
        
        <Link to="/dashboard" style={{
          padding: '15px 30px',
          background: 'rgba(59, 130, 246, 0.2)',
          color: 'white',
          border: '2px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '10px',
          textDecoration: 'none',
          textAlign: 'center',
          fontWeight: '600'
        }}>
          📊 Voir le Tableau de Bord
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;
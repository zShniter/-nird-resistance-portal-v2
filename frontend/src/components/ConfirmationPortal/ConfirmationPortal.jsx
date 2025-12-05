// ConfirmationPortal.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './ConfirmationPortal.css';

const ConfirmationPortal = ({ warriorName, missionType, achievement }) => {
  const missionMessages = {
    contact: {
      title: 'Message Magique Envoyé!',
      message: `${warriorName}, ton message a été transmis aux druides NIRD.`,
      icon: '🪄'
    },
    donate: {
      title: 'Ressources Fournies!',
      message: `Merci ${warriorName}, ton don renforce notre village.`,
      icon: '💰'
    },
    volunteer: {
      title: 'Guerrier Recruté!',
      message: `Bienvenue dans la guilde, ${warriorName}!`,
      icon: '🛡️'
    },
    info: {
      title: 'Oracle Consulté!',
      message: `${warriorName}, les secrets te seront révélés.`,
      icon: '📜'
    }
  };

  const currentMission = missionMessages[missionType] || {
    title: 'Quête Accomplie!',
    message: `Félicitations ${warriorName}!`,
    icon: '🏆'
  };

  return (
    <motion.div
      className="confirmation-portal"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Portal Ring */}
      <div className="portal-ring">
        <div className="ring-inner"></div>
        <div className="ring-outer"></div>
      </div>
      
      {/* Portal Content */}
      <div className="portal-content">
        <motion.div
          className="portal-icon"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {currentMission.icon}
        </motion.div>
        
        <h2 className="portal-title">{currentMission.title}</h2>
        <p className="portal-message">{currentMission.message}</p>
        
        {/* Achievement Display */}
        {achievement && (
          <motion.div
            className="achievement-display"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-info">
              <h4>{achievement.name}</h4>
              <p>{achievement.description}</p>
            </div>
          </motion.div>
        )}
        
        {/* Progress Bar */}
        <div className="progress-tracker">
          <div className="progress-label">Progression vers le prochain niveau</div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: '65%' }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <div className="progress-text">65% complété</div>
        </div>
        
        {/* Next Steps */}
        <div className="next-steps">
          <h4>Prochaines étapes:</h4>
          <ul>
            <li>📧 Vérifie ta boîte email</li>
            <li>👥 Rejoins la communauté</li>
            <li>🎮 Complète d'autres quêtes</li>
          </ul>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="portal-particles">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              animationDelay: `${i * 0.2}s`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ConfirmationPortal;
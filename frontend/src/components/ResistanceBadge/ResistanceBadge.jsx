// ResistanceBadge.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './ResistanceBadge.css';

const ResistanceBadge = ({ badge, size = 'medium', showAnimation = true, earned = true }) => {
  const badgeData = {
    '🛡️ Résistant NIRD': {
      icon: '🛡️',
      title: 'Résistant NIRD',
      description: 'Membre de la résistance numérique 2025',
      color: '#8b5cf6',
      rarity: 'common'
    },
    '🪄 Messager de la Potion Magique': {
      icon: '🪄',
      title: 'Messager de la Potion Magique',
      description: 'A envoyé un message aux druides NIRD',
      color: '#3b82f6',
      rarity: 'uncommon'
    },
    '💰 Héros du Trésor': {
      icon: '💰',
      title: 'Héros du Trésor',
      description: 'Don important pour la résistance',
      color: '#fbbf24',
      rarity: 'rare'
    },
    '🪙 Donateur Résistant': {
      icon: '🪙',
      title: 'Donateur Résistant',
      description: 'Contribution financière à la cause',
      color: '#10b981',
      rarity: 'uncommon'
    },
    '🛡️ Guerrier Gaulois Actif': {
      icon: '🛡️',
      title: 'Guerrier Gaulois Actif',
      description: 'Volontaire pour installer Linux',
      color: '#ef4444',
      rarity: 'rare'
    },
    '📜 Sage Numérique': {
      icon: '📜',
      title: 'Sage Numérique',
      description: 'Chercheur de savoir contre l\'obsolescence',
      color: '#8b5cf6',
      rarity: 'uncommon'
    },
    '🎯 Premier Mission': {
      icon: '🎯',
      title: 'Première Mission',
      description: 'Première quête accomplie',
      color: '#8b5cf6',
      rarity: 'common'
    },
    '👑 Leader Natoque': {
      icon: '👑',
      title: 'Leader Natoque',
      description: 'Leader de la résistance',
      color: '#f59e0b',
      rarity: 'legendary'
    }
  };

  const currentBadge = badgeData[badge] || {
    icon: badge?.icon || '🛡️',
    title: badge?.title || badge || 'Badge de Résistance',
    description: badge?.description || 'Membre actif de la résistance',
    color: '#8b5cf6',
    rarity: 'common'
  };

  const sizeClasses = {
    small: 'badge-small',
    medium: 'badge-medium',
    large: 'badge-large'
  };

  const rarityClasses = {
    common: 'rarity-common',
    uncommon: 'rarity-uncommon',
    rare: 'rarity-rare',
    legendary: 'rarity-legendary'
  };

  return (
    <motion.div
      className={`resistance-badge ${sizeClasses[size]} ${rarityClasses[currentBadge.rarity]} ${earned ? 'earned' : 'locked'}`}
      initial={showAnimation ? { scale: 0, rotate: -180 } : false}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      {/* Badge glow effect */}
      {showAnimation && earned && (
        <div className="badge-glow" style={{ borderColor: currentBadge.color }} />
      )}
      
      {/* Badge background */}
      <div className="badge-background">
        {/* Shield shape for common/uncommon badges */}
        {(currentBadge.rarity === 'common' || currentBadge.rarity === 'uncommon') && (
          <div className="badge-shield" style={{ borderColor: currentBadge.color }}>
            <div className="shield-inner">
              <div className="shield-icon">
                {currentBadge.icon}
              </div>
            </div>
          </div>
        )}
        
        {/* Star shape for rare badges */}
        {currentBadge.rarity === 'rare' && (
          <div className="badge-star" style={{ color: currentBadge.color }}>
            <div className="star-icon">
              ⭐
            </div>
            <div className="badge-icon">
              {currentBadge.icon}
            </div>
          </div>
        )}
        
        {/* Crown shape for legendary badges */}
        {currentBadge.rarity === 'legendary' && (
          <div className="badge-crown" style={{ color: currentBadge.color }}>
            <div className="crown-icon">
              👑
            </div>
            <div className="badge-icon">
              {currentBadge.icon}
            </div>
          </div>
        )}
      </div>
      
      {/* Badge content */}
      <div className="badge-content">
        <h4 className="badge-title">{currentBadge.title}</h4>
        <p className="badge-description">{currentBadge.description}</p>
        
        {/* Rarity indicator */}
        <div className="badge-rarity">
          <span className="rarity-dot" style={{ backgroundColor: currentBadge.color }} />
          <span className="rarity-text">
            {currentBadge.rarity === 'common' && 'Commun'}
            {currentBadge.rarity === 'uncommon' && 'Peu commun'}
            {currentBadge.rarity === 'rare' && 'Rare'}
            {currentBadge.rarity === 'legendary' && 'Légendaire'}
          </span>
        </div>
        
        {/* Locked state */}
        {!earned && (
          <div className="locked-overlay">
            <div className="lock-icon">🔒</div>
            <span className="locked-text">À débloquer</span>
          </div>
        )}
      </div>
      
      {/* Achievement particles */}
      {showAnimation && earned && (
        <div className="achievement-particles">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                backgroundColor: currentBadge.color,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ResistanceBadge;
// VillageAnimation.jsx
import React, { useEffect, useState } from 'react';
import './VillageAnimation.css';

const VillageAnimation = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Create magical particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.2,
      color: i % 3 === 0 ? '#8b5cf6' : i % 3 === 1 ? '#3b82f6' : '#10b981'
    }));
    setParticles(newParticles);

    // Animate particles
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        y: (p.y + p.speed) % 100
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="village-animation">
      {/* Magical particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="magic-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            animationDelay: `${particle.id * 0.1}s`
          }}
        />
      ))}

      {/* Animated village elements */}
      <div className="village-house house-1">
        <div className="roof"></div>
        <div className="walls"></div>
        <div className="window"></div>
        <div className="door"></div>
      </div>

      <div className="village-house house-2">
        <div className="roof"></div>
        <div className="walls"></div>
        <div className="window"></div>
        <div className="door"></div>
      </div>

      <div className="village-tree tree-1">
        <div className="trunk"></div>
        <div className="leaves"></div>
      </div>

      <div className="village-tree tree-2">
        <div className="trunk"></div>
        <div className="leaves"></div>
      </div>

      {/* Shield animation */}
      <div className="floating-shield">
        <div className="shield-icon">🛡️</div>
      </div>

      {/* Sword animation */}
      <div className="floating-sword">
        <div className="sword-icon">⚔️</div>
      </div>

      {/* Magic potion */}
      <div className="magic-potion">
        <div className="potion-bottle">🧪</div>
        <div className="potion-bubbles">
          <div className="bubble bubble-1"></div>
          <div className="bubble bubble-2"></div>
          <div className="bubble bubble-3"></div>
        </div>
      </div>

      {/* Resistance flag */}
      <div className="resistance-flag">
        <div className="flag-pole"></div>
        <div className="flag-cloth">
          <span className="flag-text">NIRD</span>
        </div>
      </div>

      {/* Ambient glow */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>
      <div className="ambient-glow glow-3"></div>

      {/* Fireflies */}
      <div className="fireflies">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="firefly" style={{ '--i': i }}></div>
        ))}
      </div>
    </div>
  );
};

export default VillageAnimation;
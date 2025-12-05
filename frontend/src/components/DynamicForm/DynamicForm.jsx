// DynamicForm.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useResistance } from '../../context/ResistanceContext';
import { FaPaperPlane, FaCoins, FaHandsHelping, FaQuestionCircle, FaCheck } from 'react-icons/fa';
import './DynamicForm.css';

const DynamicForm = ({ mission }) => {
  const navigate = useNavigate();
  const { joinResistance, recordDonation } = useResistance();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    amount: '20',
    skills: [],
    recurring: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if ((mission.id === 'contact' || mission.id === 'info') && !formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    }
    
    if (mission.id === 'volunteer' && formData.skills.length === 0) {
      newErrors.skills = 'Sélectionne au moins une compétence';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Prepare mission data
      const missionData = {};
      if (mission.id === 'contact' || mission.id === 'info') {
        missionData.message = formData.message;
      } else if (mission.id === 'donate') {
        missionData.amount = `${formData.amount}€`;
        missionData.recurring = formData.recurring;
      } else if (mission.id === 'volunteer') {
        missionData.skills = formData.skills;
      }

      // Join resistance (Create warrior)
      const warriorData = {
        name: formData.name,
        email: formData.email,
        mission: mission.id,
        missionData
      };

      const response = await joinResistance(warriorData);
      
      // Generate achievement
      let achievement;
      switch(mission.id) {
        case 'contact':
          achievement = { name: 'Message Sent', description: 'Message envoyé aux druides NIRD', icon: '📨' };
          break;
        case 'donate':
          achievement = { 
            name: formData.recurring ? 'Monthly Supporter' : 'Donation Hero', 
            description: 'Contribution à la résistance numérique',
            icon: '💰' 
          };
          break;
        case 'volunteer':
          achievement = { name: 'Skill Volunteer', description: 'Volontaire pour la cause NIRD', icon: '🛠️' };
          break;
        case 'info':
          achievement = { name: 'Knowledge Seeker', description: 'À la recherche de savoir numérique', icon: '📚' };
          break;
        default:
          achievement = { name: 'Resistance Member', description: 'Nouveau membre de la résistance', icon: '🛡️' };
      }

      // Navigate to thank you page with data
      navigate('/merci', {
        state: {
          warrior: response.warrior,
          achievement,
          missionType: mission.id
        }
      });

    } catch (error) {
      console.error('Submission error:', error);
      alert(error.message || 'Une erreur est survenue. Réessaie!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => {
      const newSkills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills: newSkills };
    });
    
    // Clear error if skills are selected
    if (formData.skills.length === 0) {
      setErrors(prev => ({ ...prev, skills: undefined }));
    }
  };

  const renderMissionFields = () => {
    switch(mission.id) {
      case 'contact':
      case 'info':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="form-field-group"
          >
            <label>
              <FaQuestionCircle /> Ton Message Mystique
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              onFocus={() => setErrors(prev => ({ ...prev, message: undefined }))}
              placeholder="Écris ton message à l'oracle numérique..."
              rows={4}
              className={errors.message ? 'error' : ''}
            />
            {errors.message && <span className="error-message">{errors.message}</span>}
          </motion.div>
        );
      
      case 'donate':
        const donationAmounts = ['10', '20', '50', '100'];
        
        return (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="form-field-group"
            >
              <label>
                <FaCoins /> Montant du Don
              </label>
              <p className="field-description">(pour 1 PC reconditionné = 50€)</p>
              
              <div className="donation-options">
                {donationAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className={`donation-option ${formData.amount === amount ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, amount})}
                  >
                    {amount}€
                  </button>
                ))}
              </div>
              
              <div className="custom-amount">
                <input
                  type="number"
                  placeholder="Montant personnalisé"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  min="1"
                  step="1"
                />
                <span className="currency">€</span>
              </div>
            </motion.div>
            
            <div className="donation-impact">
              <h4>🎯 Impact de ton don</h4>
              <div className="impact-visualization">
                <div className="impact-bar">
                  <div 
                    className="impact-fill"
                    style={{ width: `${(parseInt(formData.amount) / 100) * 100}%` }}
                  ></div>
                </div>
                <p className="impact-description">
                  {parseInt(formData.amount) >= 50 
                    ? '💻 1 PC reconditionné pour une école!'
                    : '🔧 Matériel et formations pour les écoles'}
                </p>
              </div>
            </div>
            
            <div className="form-check-group">
              <input
                type="checkbox"
                id="recurring"
                checked={formData.recurring}
                onChange={(e) => setFormData({...formData, recurring: e.target.checked})}
                className="checkbox-input"
              />
              <label htmlFor="recurring" className="checkbox-label">
                <div className="checkbox-custom">
                  {formData.recurring && <FaCheck size={12} />}
                </div>
                ⚡ Je deviens un "Résistant Mensuel" (don récurrent)
              </label>
            </div>
          </>
        );
      
      case 'volunteer':
        const availableSkills = [
          'Linux/Ubuntu',
          'Sensibilisation',
          'Support Technique',
          'Développement',
          'Formation',
          'Design',
          'Communication'
        ];
        
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="form-field-group"
          >
            <label>
              <FaHandsHelping /> Tes Compétences de Guerrier
            </label>
            <p className="field-description">Sélectionne toutes tes compétences pertinentes</p>
            
            <div className="skills-grid">
              {availableSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  className={`skill-tag ${formData.skills.includes(skill) ? 'selected' : ''}`}
                  onClick={() => handleSkillToggle(skill)}
                >
                  {skill}
                  {formData.skills.includes(skill) && <FaCheck className="check-icon" />}
                </button>
              ))}
            </div>
            {errors.skills && <span className="error-message">{errors.skills}</span>}
            
            <div className="other-skills">
              <input
                type="text"
                placeholder="Autres compétences (séparées par des virgules)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    handleSkillToggle(e.target.value.trim());
                    e.target.value = '';
                  }
                }}
              />
            </div>
            
            {formData.skills.length > 0 && (
              <div className="selected-skills">
                <h4>Compétences sélectionnées:</h4>
                <div className="selected-tags">
                  {formData.skills.map(skill => (
                    <span key={skill} className="selected-tag">
                      {skill}
                      <button 
                        type="button" 
                        className="remove-tag"
                        onClick={() => handleSkillToggle(skill)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.form
      className="dynamic-form"
      onSubmit={handleSubmit}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="form-title">
        {mission.icon} Formulaire de Quête: {mission.title}
      </h3>
      
      <div className="form-content">
        {/* Basic Information */}
        <div className="form-field-group">
          <label>👤 Ton Nom de Guerrier Gaulois</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({...formData, name: e.target.value});
              setErrors(prev => ({ ...prev, name: undefined }));
            }}
            placeholder="Entre ton nom de résistant..."
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
        
        <div className="form-field-group">
          <label>📧 Ton Parchemin Électronique (Email)</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({...formData, email: e.target.value});
              setErrors(prev => ({ ...prev, email: undefined }));
            }}
            placeholder="guerrier@village-nird.fr"
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        
        {/* Mission Specific Fields */}
        {renderMissionFields()}
        
        {/* Privacy Consent */}
        <div className="form-check-group">
          <input
            type="checkbox"
            id="privacy"
            required
            className="checkbox-input"
          />
          <label htmlFor="privacy" className="checkbox-label">
            <div className="checkbox-custom">
              <FaCheck size={12} />
            </div>
            J'accepte que mes données soient utilisées uniquement pour la résistance NIRD 2025
          </label>
        </div>
        
        {/* Submit Button */}
        <motion.button
          type="submit"
          className="submit-quest"
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSubmitting ? (
            <>
              <div className="loading-spinner"></div>
              Envoi en cours...
            </>
          ) : (
            <>
              <FaPaperPlane /> Lancer la Quête! ⚔️
            </>
          )}
        </motion.button>
        
        {/* Privacy Note */}
        <p className="privacy-note">
          🔒 Tes données restent dans le village (serveurs UE). 
          Aucune potion magique n'est partagée avec l'Empire Big Tech!
        </p>
      </div>
    </motion.form>
  );
};

export default DynamicForm;
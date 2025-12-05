// HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaMagic, FaUsers, FaRecycle, FaRobot } from 'react-icons/fa';

// Clés pour le localStorage
const STORAGE_KEYS = {
  WARRIORS: 'nird_warriors',
  STATS: 'nird_stats',
  ACTIVITIES: 'nird_activities'
};

// Fonction pour formater le temps
const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffMs = now - activityTime;
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    return diffDays === 1 ? "Il y a 1 jour" : `Il y a ${diffDays} jours`;
  } else if (diffHours > 0) {
    return diffHours === 1 ? "Il y a 1 heure" : `Il y a ${diffHours} heures`;
  } else if (diffMinutes > 0) {
    return diffMinutes === 1 ? "Il y a 1 minute" : `Il y a ${diffMinutes} minutes`;
  } else {
    return "À l'instant";
  }
};

const HomePage = () => {
  const [selectedMission, setSelectedMission] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    amount: '20',
    skills: [],
    recurring: false
  });
  
  // CAPTCHA State
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [userCaptchaAnswer, setUserCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);
  const [stats, setStats] = useState({
    totalWarriors: 89,
    totalDonations: 15800,
    devicesReconditioned: 1250,
    schoolsLiberated: 42
  });

  const missions = [
    {
      id: 'contact',
      title: 'Envoyer un Message à la Potion Magique',
      icon: <FaMagic />,
      color: '#8B5CF6',
      description: 'Contacte les druides NIRD pour des conseils sur Linux',
      pillar: 'Inclusion'
    },
    {
      id: 'donate',
      title: 'Fournir des Ressources au Village',
      icon: <FaRecycle />,
      color: '#10B981',
      description: 'Finance le réemploi de matériel contre l\'obsolescence',
      pillar: 'Durabilité'
    },
    {
      id: 'volunteer',
      title: 'Devenir un Guerrier Gaulois',
      icon: <FaShieldAlt />,
      color: '#EF4444',
      description: 'Aide à installer des systèmes libres dans les écoles',
      pillar: 'Responsabilité'
    },
    {
      id: 'info',
      title: 'Consulter l\'Oracle Numérique',
      icon: <FaUsers />,
      color: '#3B82F6',
      description: 'Apprends à combattre l\'obsolescence programmée',
      pillar: 'Pédagogie'
    }
  ];

  // Charger les statistiques depuis localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem(STORAGE_KEYS.STATS);
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  // Générer une question CAPTCHA simple
  const generateCaptcha = () => {
    const operations = [
      { type: 'addition', symbol: '+', generate: () => {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        return { question: `${a} + ${b}`, answer: a + b };
      }},
      { type: 'subtraction', symbol: '-', generate: () => {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * a) + 1;
        return { question: `${a} - ${b}`, answer: a - b };
      }},
      { type: 'multiplication', symbol: '×', generate: () => {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        return { question: `${a} × ${b}`, answer: a * b };
      }}
    ];
    
    const randomOp = operations[Math.floor(Math.random() * operations.length)];
    const captcha = randomOp.generate();
    setCaptchaQuestion(captcha.question);
    setCaptchaAnswer(captcha.answer.toString());
    setUserCaptchaAnswer('');
    setCaptchaError('');
  };

  const handleMissionSelect = (mission) => {
    setSelectedMission(mission);
    setShowForm(true);
    generateCaptcha(); // Générer un nouveau CAPTCHA
    
    // Scroll vers le formulaire
    setTimeout(() => {
      document.getElementById('mission-form')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  // Obtenir un badge selon la mission
  const getBadgeForMission = (mission) => {
    const badges = {
      contact: '📨 Messager Résistant',
      donate: '💰 Donateur Engagé',
      volunteer: '🛡️ Bénévole Actif',
      info: '📚 Chercheur Curieux'
    };
    return badges[mission] || '🛡️ Nouveau Résistant';
  };

  // Obtenir des compétences selon la mission
  const getSkillsForMission = (mission) => {
    const skills = {
      contact: ['Communication', 'Réseautage'],
      donate: ['Collecte de fonds', 'Sensibilisation'],
      volunteer: ['Linux/Ubuntu', 'Support Technique', 'Sensibilisation', 'Développement', 'Formation'],
      info: ['Recherche', 'Analyse']
    };
    return skills[mission] || ['Engagement'];
  };

  // Générer un score d'impact aléatoire
  const generateImpactScore = (mission, formData) => {
    let baseScore = 50;
    
    // Bonus selon la mission
    if (mission === 'donate') {
      baseScore += parseInt(formData.amount) * 2;
      if (formData.recurring) baseScore += 50;
    } else if (mission === 'volunteer') {
      baseScore += formData.skills.length * 20;
    } else if (mission === 'contact' || mission === 'info') {
      baseScore += formData.message.length > 100 ? 80 : 40;
    }
    
    return Math.min(baseScore, 500); // Limite maximale de 500
  };

  // Sauvegarder dans localStorage
  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Ajouter une activité
  const addActivity = (warriorName, action, type) => {
    const timestamp = new Date().toISOString();
    const timeDisplay = formatTimeAgo(timestamp);
    
    const newActivity = {
      id: Date.now(),
      warrior: warriorName,
      action: action,
      time: timeDisplay,
      timestamp: timestamp,
      type: type
    };
    
    const savedActivities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    let activities = [];
    if (savedActivities) {
      activities = JSON.parse(savedActivities);
    }
    
    const updatedActivities = [newActivity, ...activities.slice(0, 19)]; // Garder les 20 dernières activités
    saveToLocalStorage(STORAGE_KEYS.ACTIVITIES, updatedActivities);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setCaptchaError('');
    setIsSubmitting(true);
    
    // Protection contre les soumissions trop rapides
    const now = Date.now();
    if (now - lastSubmissionTime < 5000) {
      setCaptchaError('Trop de soumissions rapides! Attends 5 secondes.');
      setIsSubmitting(false);
      return;
    }

    // Validation
    if (!formData.name || !formData.email) {
      alert('Veuillez remplir votre nom et email!');
      setIsSubmitting(false);
      return;
    }

    // Vérification CAPTCHA
    if (userCaptchaAnswer.trim() !== captchaAnswer) {
      setCaptchaError('Réponse incorrecte au défi anti-robot. Réessaie!');
      generateCaptcha();
      setIsSubmitting(false);
      return;
    }

    // Validation mission
    if ((selectedMission.id === 'contact' || selectedMission.id === 'info') && !formData.message) {
      alert('Veuillez écrire un message!');
      setIsSubmitting(false);
      return;
    }

    if (selectedMission.id === 'volunteer' && formData.skills.length === 0) {
      alert('Veuillez sélectionner au moins une compétence!');
      setIsSubmitting(false);
      return;
    }

    try {
      // Préparer les données du nouveau guerrier
      const warriorData = {
        id: Date.now(), // ID unique basé sur le timestamp
        name: formData.name,
        email: formData.email,
        mission: selectedMission.id,
        badge: getBadgeForMission(selectedMission.id),
        impactScore: generateImpactScore(selectedMission.id, formData),
        village: "Principal", // Village par défaut
        status: "active",
        joinDate: new Date().toISOString().split('T')[0],
        skills: selectedMission.id === 'volunteer' ? formData.skills : getSkillsForMission(selectedMission.id),
        missionData: {}
      };

      // Ajouter des données spécifiques à la mission
      if (selectedMission.id === 'contact' || selectedMission.id === 'info') {
        warriorData.missionData.message = formData.message;
      } else if (selectedMission.id === 'donate') {
        warriorData.missionData.amount = `${formData.amount}€`;
        warriorData.missionData.recurring = formData.recurring;
      } else if (selectedMission.id === 'volunteer') {
        warriorData.missionData.skills = formData.skills;
      }

      console.log('Création du guerrier:', warriorData);

      // Récupérer les guerriers existants
      const savedWarriors = localStorage.getItem(STORAGE_KEYS.WARRIORS);
      let warriors = [];
      if (savedWarriors) {
        warriors = JSON.parse(savedWarriors);
      }

      // Ajouter le nouveau guerrier
      warriors.push(warriorData);
      saveToLocalStorage(STORAGE_KEYS.WARRIORS, warriors);

      // Mettre à jour les statistiques
      const updatedStats = {
        ...stats,
        totalWarriors: stats.totalWarriors + 1
      };
      
      if (selectedMission.id === 'donate') {
        const donationAmount = parseInt(formData.amount);
        updatedStats.totalDonations = stats.totalDonations + donationAmount;
      }
      
      setStats(updatedStats);
      saveToLocalStorage(STORAGE_KEYS.STATS, updatedStats);

      // Ajouter une activité avec un message spécifique
      const activityMessages = {
        contact: `a envoyé un message aux druides NIRD`,
        donate: formData.recurring 
          ? `a fait un don récurrent de ${formData.amount}€`
          : `a fait un don de ${formData.amount}€`,
        volunteer: `s'est inscrit comme bénévole avec ${formData.skills.length} compétences`,
        info: `a consulté l'oracle numérique`
      };

      addActivity(
        formData.name, 
        activityMessages[selectedMission.id] || "a rejoint la résistance",
        selectedMission.id
      );

      setLastSubmissionTime(now);

      // Préparer les données pour la page de remerciement
      const submission = {
        name: encodeURIComponent(formData.name),
        email: encodeURIComponent(formData.email),
        mission: selectedMission.id,
        message: encodeURIComponent(formData.message || ''),
        amount: formData.amount,
        skills: encodeURIComponent(formData.skills.join(',')),
        recurring: formData.recurring,
        warriorId: warriorData.id,
        badge: warriorData.badge,
        impactScore: warriorData.impactScore,
        timestamp: new Date().toISOString()
      };

      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        message: '',
        amount: '20',
        skills: [],
        recurring: false
      });
      
      setSelectedMission(null);
      setShowForm(false);
      setUserCaptchaAnswer('');

      // Redirection vers la page de remerciement
      const queryParams = new URLSearchParams(submission).toString();
      window.location.href = `/merci?${queryParams}`;

    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const renderFormFields = () => {
    if (!selectedMission) return null;

    switch(selectedMission.id) {
      case 'contact':
      case 'info':
        return (
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Ton Message:
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Écris ton message ici..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '1rem',
                resize: 'vertical'
              }}
              required
            />
          </div>
        );

      case 'donate':
        return (
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Montant du don:
            </label>
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              marginBottom: '15px'
            }}>
              {[10, 20, 50, 100].map(amount => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                  style={{
                    padding: '10px 20px',
                    background: formData.amount === amount.toString() 
                      ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: `2px solid ${formData.amount === amount.toString() ? '#8b5cf6' : 'rgba(255, 255, 255, 0.2)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {amount}€
                </button>
              ))}
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '10px'
            }}>
              <input
                type="checkbox"
                id="recurring"
                name="recurring"
                checked={formData.recurring}
                onChange={handleInputChange}
                style={{ transform: 'scale(1.2)' }}
              />
              <label htmlFor="recurring" style={{ color: '#c4b5fd' }}>
                ⚡ Je deviens un "Résistant Mensuel" (don récurrent)
              </label>
            </div>
          </div>
        );

      case 'volunteer':
        const skills = ['Linux/Ubuntu', 'Sensibilisation', 'Support Technique', 'Développement', 'Formation'];
        
        return (
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Tes compétences:
            </label>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '15px'
            }}>
              {skills.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => {
                    const newSkills = formData.skills.includes(skill)
                      ? formData.skills.filter(s => s !== skill)
                      : [...formData.skills, skill];
                    setFormData(prev => ({ ...prev, skills: newSkills }));
                  }}
                  style={{
                    padding: '8px 16px',
                    background: formData.skills.includes(skill)
                      ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: `2px solid ${formData.skills.includes(skill) ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'}`,
                    borderRadius: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {skill} {formData.skills.includes(skill) && '✓'}
                </button>
              ))}
            </div>
            
            {formData.skills.length > 0 && (
              <div style={{
                marginTop: '10px',
                padding: '10px',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '8px',
                color: '#c4b5fd',
                fontSize: '0.9rem'
              }}>
                Compétences sélectionnées: {formData.skills.join(', ')}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>Bienvenue au Village NIRD Résistant! 🚀</h1>
        <p style={{ fontSize: '1.2rem', color: '#c4b5fd', marginTop: '10px' }}>
          Rejoins la lutte contre l'Empire Big Tech, comme Astérix! (Session Locale)
        </p>
        <div style={{
          background: 'rgba(178, 34, 34, 0.2)',
          padding: '10px 20px',
          borderRadius: '10px',
          marginTop: '20px',
          display: 'inline-block'
        }}>
          ⚠️ URGENT: Windows 10 s'arrête en Octobre 2025! Rejoins la résistance Linux!
        </div>
      </header>

      {/* Mission Selection */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaShieldAlt /> Choisis ta Quête de Résistance
        </h2>
        <p style={{ color: '#c4b5fd', marginBottom: '30px' }}>
          Chaque action renforce notre village contre l'obsolescence programmée!
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {missions.map((mission) => (
            <div
              key={mission.id}
              onClick={() => handleMissionSelect(mission)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '15px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderLeft: `5px solid ${mission.color}`,
                border: selectedMission?.id === mission.id ? '2px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                transform: selectedMission?.id === mission.id ? 'translateY(-5px)' : 'none'
              }}
            >
              <div style={{
                color: mission.color,
                fontSize: '2.5rem',
                marginBottom: '15px'
              }}>
                {mission.icon}
              </div>
              <h3 style={{ marginBottom: '10px', color: 'white' }}>{mission.title}</h3>
              <p style={{ color: '#c4b5fd', marginBottom: '15px' }}>{mission.description}</p>
              
              <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '5px 10px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                color: mission.color,
                fontWeight: '600'
              }}>
                Pilier: {mission.pillar}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FORMULAIRE DYNAMIQUE AVEC CAPTCHA */}
      {showForm && selectedMission && (
        <div 
          id="mission-form"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            marginTop: '40px',
            marginBottom: '40px',
            border: '2px solid rgba(139, 92, 246, 0.3)'
          }}
        >
          <h2 style={{ 
            color: selectedMission.color,
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {selectedMission.icon} Formulaire: {selectedMission.title}
          </h2>
          
          <form onSubmit={handleFormSubmit}>
            {/* Champs de base */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                👤 Ton nom:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Entre ton nom de guerrier..."
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                📧 Ton email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="guerrier@village-nird.fr"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>

            {/* Champs spécifiques à la mission */}
            {renderFormFields()}

            {/* SECTION CAPTCHA */}
            <div style={{
              marginTop: '30px',
              padding: '20px',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '15px',
              border: '2px solid rgba(139, 92, 246, 0.4)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '15px'
              }}>
                <FaRobot style={{ color: '#fbbf24', fontSize: '1.5rem' }} />
                <h4 style={{ color: '#fbbf24', margin: 0 }}>
                  Défi Anti-Robot
                </h4>
              </div>
              
              <p style={{ color: '#c4b5fd', marginBottom: '15px', fontSize: '0.95rem' }}>
                Résous ce défi pour prouver que tu es humain et non un robot de l'Empire Big Tech!
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                flexWrap: 'wrap',
                marginBottom: '15px'
              }}>
                <div style={{
                  flex: 1,
                  minWidth: '200px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '15px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  border: '2px solid rgba(139, 92, 246, 0.3)'
                }}>
                  <div style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '5px' }}>
                    Question:
                  </div>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: 'white',
                    fontFamily: 'monospace'
                  }}>
                    {captchaQuestion} = ?
                  </div>
                </div>
                
                <div style={{ flex: 2, minWidth: '200px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600',
                    color: 'white'
                  }}>
                    Ta réponse:
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="number"
                      value={userCaptchaAnswer}
                      onChange={(e) => setUserCaptchaAnswer(e.target.value)}
                      placeholder="Entre le résultat"
                      required
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: captchaError 
                          ? '2px solid #ef4444' 
                          : '2px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '1rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      style={{
                        padding: '12px 20px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#c4b5fd',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      ↻ Nouveau défi
                    </button>
                  </div>
                </div>
              </div>
              
              {captchaError && (
                <div style={{
                  color: '#ef4444',
                  padding: '10px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  marginTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  ⚠️ {captchaError}
                </div>
              )}
              
              <div style={{
                marginTop: '15px',
                color: '#9ca3af',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  background: 'rgba(139, 92, 246, 0.3)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  🔒
                </div>
                Cette vérification protège notre village contre les attaques de robots
              </div>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                marginTop: '30px',
                width: '100%',
                padding: '15px',
                background: isSubmitting 
                  ? 'linear-gradient(135deg, #6b7280, #4b5563)' 
                  : 'linear-gradient(135deg, #b22222, #8b5cf6)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                opacity: isSubmitting ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 25px rgba(139, 92, 246, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Enregistrement en cours...
                </>
              ) : (
                '⚔️ Lancer la Quête!'
              )}
            </button>
          </form>

          <p style={{
            marginTop: '20px',
            color: '#9ca3af',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            🔒 Tes données sont sauvegardées localement dans ton navigateur.
          </p>
        </div>
      )}

      {/* CTA Buttons */}
      <div style={{
        textAlign: 'center',
        marginTop: '50px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center'
      }}>
        {!showForm && selectedMission && (
          <button 
            onClick={() => {
              setShowForm(true);
              generateCaptcha();
            }}
            style={{
              padding: '15px 40px',
              background: 'linear-gradient(135deg, #b22222, #8b5cf6)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            ⚔️ Remplir le Formulaire pour {selectedMission.title}
          </button>
        )}
        
        <Link 
          to="/dashboard" 
          style={{
            padding: '12px 30px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            borderRadius: '10px',
            textDecoration: 'none',
            border: '2px solid rgba(139, 92, 246, 0.3)'
          }}
        >
          📊 Voir le Tableau de Bord
        </Link>
      </div>

      {/* Statistics */}
      <section style={{
        marginTop: '60px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        padding: '30px'
      }}>
        <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Notre Impact en 2025</h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fbbf24' }}>
              {stats.schoolsLiberated}
            </div>
            <div style={{ color: '#c4b5fd' }}>Écoles Libérées</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fbbf24' }}>
              {stats.devicesReconditioned.toLocaleString()}
            </div>
            <div style={{ color: '#c4b5fd' }}>PC Reconditionnés</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fbbf24' }}>
              €{stats.totalDonations.toLocaleString()}
            </div>
            <div style={{ color: '#c4b5fd' }}>Licenses Économisées</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fbbf24' }}>
              {stats.totalWarriors}
            </div>
            <div style={{ color: '#c4b5fd' }}>Guerriers Actifs</div>
          </div>
        </div>
      </section>

      {/* Style pour l'animation de chargement */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
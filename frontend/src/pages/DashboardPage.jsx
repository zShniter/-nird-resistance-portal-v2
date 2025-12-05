// DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUsers, FaChartLine, FaTrophy, FaSearch, 
  FaEdit, FaTrash, FaCheck, FaTimes,
  FaSchool, FaLaptop, FaEuroSign, FaCalendarAlt,
  FaShieldAlt, FaMagic, FaRecycle, FaUserFriends,
  FaArrowUp, FaArrowDown, FaFilter, FaDownload,
  FaPlus, FaSync
} from 'react-icons/fa';

// Clés pour le localStorage
const STORAGE_KEYS = {
  WARRIORS: 'nird_warriors',
  STATS: 'nird_stats',
  MISSIONS: 'nird_missions',
  ACTIVITIES: 'nird_activities'
};

// Données par défaut pour initialiser
const DEFAULT_DATA = {
  warriors: [
    {
      id: 1,
      name: "Astérix Gaulois",
      email: "asterix@village-gaulois.fr",
      mission: "contact",
      badge: "🛡️ Chef de la Résistance",
      impactScore: 250,
      village: "Principal",
      status: "veteran",
      joinDate: "2024-01-15",
      skills: ["Leadership", "Linux", "Sensibilisation"]
    },
    {
      id: 2,
      name: "Obélix",
      email: "obelix@menhir.fr",
      mission: "volunteer",
      badge: "🛡️ Guerrier Gaulois Actif",
      impactScore: 180,
      village: "Nord",
      status: "active",
      joinDate: "2024-02-20",
      skills: ["Support Technique", "Installation"]
    },
    {
      id: 3,
      name: "Panoramix",
      email: "druide@magique.fr",
      mission: "info",
      badge: "📜 Sage Numérique",
      impactScore: 220,
      village: "Principal",
      status: "active",
      joinDate: "2024-01-10",
      skills: ["Formation", "Consultation"]
    },
    {
      id: 4,
      name: "Assurancetourix",
      email: "barde@musique.fr",
      mission: "donate",
      badge: "💰 Donateur Résistant",
      impactScore: 150,
      village: "Sud",
      status: "active",
      joinDate: "2024-03-05",
      skills: ["Collecte de fonds"]
    },
    {
      id: 5,
      name: "Abraracourcix",
      email: "chef@village.fr",
      mission: "contact",
      badge: "👑 Leader Natoque",
      impactScore: 300,
      village: "Principal",
      status: "veteran",
      joinDate: "2023-12-01",
      skills: ["Stratégie", "Management"]
    }
  ],
  
  stats: {
    totalWarriors: 89,
    totalDonations: 15800,
    devicesReconditioned: 1250,
    schoolsLiberated: 42,
    activeMissions: 156,
    impactScore: 12450
  },
  
  missions: [
    { type: 'contact', count: 28, icon: 'FaMagic', color: '#8B5CF6', description: 'Messages envoyés aux druides NIRD' },
    { type: 'donate', count: 35, icon: 'FaRecycle', color: '#10B981', description: 'Dons pour le réemploi de matériel' },
    { type: 'volunteer', count: 42, icon: 'FaShieldAlt', color: '#EF4444', description: 'Bénévoles pour installer Linux' },
    { type: 'info', count: 19, icon: 'FaUserFriends', color: '#3B82F6', description: 'Demandes d\'information sur l\'obsolescence' }
  ],
  
  activities: [
    { id: 1, warrior: "Astérix Gaulois", action: "Nouveau message envoyé", time: "Il y a 2 heures", type: "contact" },
    { id: 2, warrior: "Obélix", action: "A rejoint les bénévoles", time: "Il y a 4 heures", type: "volunteer" },
    { id: 3, warrior: "Panoramix", action: "Don de 50€ effectué", time: "Il y a 1 jour", type: "donate" },
    { id: 4, warrior: "Assurancetourix", action: "Consultation d'information", time: "Il y a 2 jours", type: "info" }
  ]
};

const DashboardPage = () => {
  // États
  const [warriors, setWarriors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWarriors, setFilteredWarriors] = useState([]);
  const [editingWarrior, setEditingWarrior] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(DEFAULT_DATA.stats);
  const [missionStats, setMissionStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [newWarriorForm, setNewWarriorForm] = useState({
    name: '',
    email: '',
    mission: 'contact',
    village: 'Principal',
    status: 'active'
  });

  // Initialiser les données depuis le localStorage
  useEffect(() => {
    const initializeData = () => {
      // Guerriers
      const savedWarriors = localStorage.getItem(STORAGE_KEYS.WARRIORS);
      if (savedWarriors) {
        setWarriors(JSON.parse(savedWarriors));
        setFilteredWarriors(JSON.parse(savedWarriors));
      } else {
        localStorage.setItem(STORAGE_KEYS.WARRIORS, JSON.stringify(DEFAULT_DATA.warriors));
        setWarriors(DEFAULT_DATA.warriors);
        setFilteredWarriors(DEFAULT_DATA.warriors);
      }

      // Statistiques
      const savedStats = localStorage.getItem(STORAGE_KEYS.STATS);
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      } else {
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(DEFAULT_DATA.stats));
        setStats(DEFAULT_DATA.stats);
      }

      // Missions
      const savedMissions = localStorage.getItem(STORAGE_KEYS.MISSIONS);
      if (savedMissions) {
        const missionsData = JSON.parse(savedMissions);
        // Convertir les icônes string en composants React
        const missionsWithIcons = missionsData.map(mission => ({
          ...mission,
          icon: getIconComponent(mission.icon)
        }));
        setMissionStats(missionsWithIcons);
      } else {
        const missionsWithIcons = DEFAULT_DATA.missions.map(mission => ({
          ...mission,
          icon: getIconComponent(mission.icon)
        }));
        localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(DEFAULT_DATA.missions));
        setMissionStats(missionsWithIcons);
      }

      // Activités
      const savedActivities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (savedActivities) {
        setRecentActivities(JSON.parse(savedActivities));
      } else {
        localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(DEFAULT_DATA.activities));
        setRecentActivities(DEFAULT_DATA.activities);
      }
    };

    initializeData();
  }, []);

  // Fonction pour obtenir le composant icône
  const getIconComponent = (iconName) => {
    const iconMap = {
      FaMagic: <FaMagic />,
      FaRecycle: <FaRecycle />,
      FaShieldAlt: <FaShieldAlt />,
      FaUserFriends: <FaUserFriends />
    };
    return iconMap[iconName] || <FaMagic />;
  };

  // Sauvegarder dans localStorage
  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Recherche
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredWarriors(warriors);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = warriors.filter(warrior =>
      warrior.name.toLowerCase().includes(query) ||
      warrior.email.toLowerCase().includes(query) ||
      warrior.village.toLowerCase().includes(query) ||
      warrior.badge.toLowerCase().includes(query) ||
      warrior.mission.toLowerCase().includes(query)
    );
    
    setFilteredWarriors(results);
  }, [searchQuery, warriors]);

  // Démarrer l'édition
  const startEdit = (warrior) => {
    setEditingWarrior(warrior.id);
    setEditForm({
      name: warrior.name,
      village: warrior.village,
      status: warrior.status,
      mission: warrior.mission,
      impactScore: warrior.impactScore
    });
  };

  // Sauvegarder les modifications
  const saveEdit = () => {
    const updatedWarriors = warriors.map(warrior => 
      warrior.id === editingWarrior 
        ? { ...warrior, ...editForm }
        : warrior
    );
    
    setWarriors(updatedWarriors);
    setFilteredWarriors(updatedWarriors);
    saveToLocalStorage(STORAGE_KEYS.WARRIORS, updatedWarriors);
    setEditingWarrior(null);
    setEditForm({});
    
    // Ajouter une activité
    const warrior = warriors.find(w => w.id === editingWarrior);
    addActivity(`${warrior.name} a été mis à jour`, 'update');
  };

  // Annuler l'édition
  const cancelEdit = () => {
    setEditingWarrior(null);
    setEditForm({});
  };

  // Supprimer un guerrier
  const deleteWarrior = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce guerrier ?')) {
      const deletedWarrior = warriors.find(w => w.id === id);
      const updatedWarriors = warriors.filter(warrior => warrior.id !== id);
      
      setWarriors(updatedWarriors);
      setFilteredWarriors(updatedWarriors);
      saveToLocalStorage(STORAGE_KEYS.WARRIORS, updatedWarriors);
      
      // Mettre à jour les stats
      const updatedStats = {
        ...stats,
        totalWarriors: stats.totalWarriors - 1
      };
      setStats(updatedStats);
      saveToLocalStorage(STORAGE_KEYS.STATS, updatedStats);
      
      // Ajouter une activité
      addActivity(`${deletedWarrior.name} a été supprimé`, 'delete');
    }
  };

  // Ajouter un nouveau guerrier
  const addNewWarrior = () => {
    if (!newWarriorForm.name.trim() || !newWarriorForm.email.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newWarrior = {
      id: Date.now(), // ID unique basé sur le timestamp
      name: newWarriorForm.name,
      email: newWarriorForm.email,
      mission: newWarriorForm.mission,
      badge: getBadgeForMission(newWarriorForm.mission),
      impactScore: Math.floor(Math.random() * 200) + 50,
      village: newWarriorForm.village,
      status: newWarriorForm.status,
      joinDate: new Date().toISOString().split('T')[0],
      skills: getSkillsForMission(newWarriorForm.mission)
    };

    const updatedWarriors = [...warriors, newWarrior];
    setWarriors(updatedWarriors);
    setFilteredWarriors(updatedWarriors);
    saveToLocalStorage(STORAGE_KEYS.WARRIORS, updatedWarriors);
    
    // Mettre à jour les stats
    const updatedStats = {
      ...stats,
      totalWarriors: stats.totalWarriors + 1
    };
    setStats(updatedStats);
    saveToLocalStorage(STORAGE_KEYS.STATS, updatedStats);
    
    // Mettre à jour les missions stats
    updateMissionStats(newWarriorForm.mission, 'add');
    
    // Réinitialiser le formulaire
    setNewWarriorForm({
      name: '',
      email: '',
      mission: 'contact',
      village: 'Principal',
      status: 'active'
    });
    
    // Ajouter une activité
    addActivity(`${newWarriorForm.name} a rejoint la résistance`, 'join');
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
      volunteer: ['Technique', 'Support'],
      info: ['Recherche', 'Analyse']
    };
    return skills[mission] || ['Engagement'];
  };

  // Mettre à jour les statistiques de mission
  const updateMissionStats = (missionType, action) => {
    const updatedMissions = missionStats.map(mission => {
      if (mission.type === missionType) {
        return {
          ...mission,
          count: action === 'add' ? mission.count + 1 : Math.max(0, mission.count - 1)
        };
      }
      return mission;
    });
    
    setMissionStats(updatedMissions);
    
    // Sauvegarder sans les composants React
    const missionsToSave = updatedMissions.map(mission => ({
      ...mission,
      icon: getIconName(mission.icon)
    }));
    saveToLocalStorage(STORAGE_KEYS.MISSIONS, missionsToSave);
  };

  // Obtenir le nom de l'icône
  const getIconName = (iconComponent) => {
    const iconMap = {
      '<FaMagic />': 'FaMagic',
      '<FaRecycle />': 'FaRecycle',
      '<FaShieldAlt />': 'FaShieldAlt',
      '<FaUserFriends />': 'FaUserFriends'
    };
    return iconMap[JSON.stringify(iconComponent)] || 'FaMagic';
  };

  // Ajouter une activité
  const addActivity = (action, type) => {
    const timeAgo = [
      "Il y a quelques minutes",
      "Il y a 1 heure",
      "Il y a 2 heures",
      "Il y a 4 heures",
      "Il y a 1 jour",
      "Il y a 2 jours"
    ];
    
    const newActivity = {
      id: Date.now(),
      warrior: "Système",
      action: action,
      time: timeAgo[Math.floor(Math.random() * timeAgo.length)],
      type: type
    };
    
    const updatedActivities = [newActivity, ...recentActivities.slice(0, 9)];
    setRecentActivities(updatedActivities);
    saveToLocalStorage(STORAGE_KEYS.ACTIVITIES, updatedActivities);
  };

  // Réinitialiser toutes les données
  const resetData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.')) {
      // Réinitialiser les guerriers
      setWarriors(DEFAULT_DATA.warriors);
      setFilteredWarriors(DEFAULT_DATA.warriors);
      saveToLocalStorage(STORAGE_KEYS.WARRIORS, DEFAULT_DATA.warriors);
      
      // Réinitialiser les stats
      setStats(DEFAULT_DATA.stats);
      saveToLocalStorage(STORAGE_KEYS.STATS, DEFAULT_DATA.stats);
      
      // Réinitialiser les missions
      const missionsWithIcons = DEFAULT_DATA.missions.map(mission => ({
        ...mission,
        icon: getIconComponent(mission.icon)
      }));
      setMissionStats(missionsWithIcons);
      saveToLocalStorage(STORAGE_KEYS.MISSIONS, DEFAULT_DATA.missions);
      
      // Réinitialiser les activités
      setRecentActivities(DEFAULT_DATA.activities);
      saveToLocalStorage(STORAGE_KEYS.ACTIVITIES, DEFAULT_DATA.activities);
      
      // Ajouter une activité de réinitialisation
      addActivity("Système réinitialisé avec les données par défaut", 'system');
    }
  };

  // Exporter les données
  const exportData = () => {
    const data = {
      warriors,
      stats,
      missions: missionStats.map(m => ({
        ...m,
        icon: getIconName(m.icon)
      })),
      activities: recentActivities,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `nird-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    addActivity("Données exportées", 'export');
  };

  // Importer des données
  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Valider les données
        if (!data.warriors || !data.stats || !data.missions) {
          throw new Error('Format de fichier invalide');
        }
        
        // Mettre à jour les guerriers
        setWarriors(data.warriors);
        setFilteredWarriors(data.warriors);
        saveToLocalStorage(STORAGE_KEYS.WARRIORS, data.warriors);
        
        // Mettre à jour les stats
        setStats(data.stats);
        saveToLocalStorage(STORAGE_KEYS.STATS, data.stats);
        
        // Mettre à jour les missions
        const missionsWithIcons = data.missions.map(mission => ({
          ...mission,
          icon: getIconComponent(mission.icon || 'FaMagic')
        }));
        setMissionStats(missionsWithIcons);
        saveToLocalStorage(STORAGE_KEYS.MISSIONS, data.missions);
        
        // Mettre à jour les activités
        if (data.activities) {
          setRecentActivities(data.activities);
          saveToLocalStorage(STORAGE_KEYS.ACTIVITIES, data.activities);
        }
        
        alert('Données importées avec succès !');
        addActivity("Données importées depuis un fichier", 'import');
        
        // Réinitialiser l'input file
        event.target.value = '';
      } catch (err) {
        alert('Erreur lors de l\'import: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container" style={{ 
      paddingTop: '30px', 
      paddingBottom: '50px',
      maxWidth: '1400px'
    }}>
      {/* En-tête du Dashboard */}
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        background: 'linear-gradient(135deg, rgba(45, 90, 39, 0.8), rgba(139, 92, 246, 0.6))',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        border: '2px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '10px',
          color: 'white'
        }}>
          🏰 Tableau de Bord de la Résistance NIRD 2025
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#c4b5fd',
          marginBottom: '20px'
        }}>
          Administration du Village Numérique Résistant (Session Locale)
        </p>
        
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '20px'
        }}>
          <Link 
            to="/" 
            style={{
              padding: '10px 20px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              borderRadius: '10px',
              textDecoration: 'none',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🏡 Retour au Village
          </Link>
          
          <button 
            onClick={exportData}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #2d5a27, #4a7c3a)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaDownload /> Exporter
          </button>
          
          <label style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaDownload style={{ transform: 'rotate(180deg)' }} /> Importer
            <input
              type="file"
              accept=".json"
              onChange={importData}
              style={{ display: 'none' }}
            />
          </label>
          
          <button 
            onClick={resetData}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaSync /> Réinitialiser
          </button>
        </div>
      </header>

      {/* Statistiques Principales */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          marginBottom: '25px',
          color: '#fbbf24'
        }}>
          <FaChartLine /> Vue d'ensemble
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Carte Statistique */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '25px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'rgba(139, 92, 246, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: '#8b5cf6'
              }}>
                <FaUsers />
              </div>
              <div>
                <div style={{ 
                  fontSize: '2.2rem', 
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {stats.totalWarriors}
                </div>
                <div style={{ color: '#c4b5fd' }}>Guerriers Actifs</div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: '#10b981',
              fontSize: '0.9rem'
            }}>
              <FaArrowUp /> {warriors.length} en session
            </div>
          </div>

          {/* Autres cartes statistiques similaires */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '25px',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'rgba(16, 185, 129, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: '#10b981'
              }}>
                <FaEuroSign />
              </div>
              <div>
                <div style={{ 
                  fontSize: '2.2rem', 
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  €{stats.totalDonations.toLocaleString()}
                </div>
                <div style={{ color: '#c4b5fd' }}>Dons Collectés</div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '25px',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: '#3b82f6'
              }}>
                <FaLaptop />
              </div>
              <div>
                <div style={{ 
                  fontSize: '2.2rem', 
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {stats.devicesReconditioned.toLocaleString()}
                </div>
                <div style={{ color: '#c4b5fd' }}>PC Reconditionnés</div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '25px',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'rgba(251, 191, 36, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: '#fbbf24'
              }}>
                <FaSchool />
              </div>
              <div>
                <div style={{ 
                  fontSize: '2.2rem', 
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {stats.schoolsLiberated}
                </div>
                <div style={{ color: '#c4b5fd' }}>Écoles Libérées</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation par onglets */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        padding: '5px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '2px solid rgba(255, 255, 255, 0.1)'
      }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            flex: 1,
            padding: '15px',
            border: 'none',
            background: activeTab === 'overview' 
              ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' 
              : 'transparent',
            color: activeTab === 'overview' ? 'white' : '#c4b5fd',
            cursor: 'pointer',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
        >
          <FaChartLine /> Vue d'ensemble
        </button>
        
        <button
          onClick={() => setActiveTab('warriors')}
          style={{
            flex: 1,
            padding: '15px',
            border: 'none',
            background: activeTab === 'warriors' 
              ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' 
              : 'transparent',
            color: activeTab === 'warriors' ? 'white' : '#c4b5fd',
            cursor: 'pointer',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <FaUsers /> Guerriers ({warriors.length})
        </button>
        
        <button
          onClick={() => setActiveTab('missions')}
          style={{
            flex: 1,
            padding: '15px',
            border: 'none',
            background: activeTab === 'missions' 
              ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' 
              : 'transparent',
            color: activeTab === 'missions' ? 'white' : '#c4b5fd',
            cursor: 'pointer',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <FaShieldAlt /> Missions
        </button>
        
        <button
          onClick={() => setActiveTab('leaderboard')}
          style={{
            flex: 1,
            padding: '15px',
            border: 'none',
            background: activeTab === 'leaderboard' 
              ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' 
              : 'transparent',
            color: activeTab === 'leaderboard' ? 'white' : '#c4b5fd',
            cursor: 'pointer',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <FaTrophy /> Classement
        </button>
      </div>

      {/* Barre de recherche */}
      <div style={{
        marginBottom: '30px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '15px',
        padding: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '12px 20px',
          borderRadius: '10px',
          border: '2px solid rgba(255, 255, 255, 0.2)'
        }}>
          <FaSearch style={{ color: '#c4b5fd' }} />
          <input
            type="text"
            placeholder="Rechercher un guerrier par nom, email, village ou mission..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#c4b5fd',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              <FaTimes />
            </button>
          )}
        </div>
        <div style={{
          marginTop: '10px',
          color: '#9ca3af',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <FaFilter /> {filteredWarriors.length} résultat(s) trouvé(s)
        </div>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'overview' && (
        <div>
          {/* Statistiques par mission */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '25px',
            marginBottom: '30px',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ 
              color: '#fbbf24',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              📊 Statistiques par Mission
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              {missionStats.map((mission) => (
                <div key={mission.type} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: `2px solid ${mission.color}20`
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      color: mission.color,
                      fontSize: '1.8rem'
                    }}>
                      {mission.icon}
                    </div>
                    <div>
                      <div style={{ 
                        fontSize: '1.8rem', 
                        fontWeight: 'bold',
                        color: 'white'
                      }}>
                        {mission.count}
                      </div>
                      <div style={{ 
                        color: '#c4b5fd',
                        textTransform: 'capitalize'
                      }}>
                        {mission.type}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    height: '6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${(mission.count / 50) * 100}%`,
                      background: `linear-gradient(90deg, ${mission.color}, ${mission.color}80)`,
                      borderRadius: '3px'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activités récentes */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '25px',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ 
              color: '#fbbf24',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              ⚡ Activités Récentes
            </h3>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              {recentActivities.map((activity) => (
                <div key={activity.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8b5cf6'
                  }}>
                    👤
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'white', fontWeight: '500' }}>
                      {activity.warrior}
                    </div>
                    <div style={{ color: '#c4b5fd', fontSize: '0.9rem' }}>
                      {activity.action}
                    </div>
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'warriors' && (
        <div>
          {/* Formulaire pour ajouter un nouveau guerrier */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '25px',
            marginBottom: '30px',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ 
              color: '#fbbf24',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <FaPlus /> Ajouter un Nouveau Guerrier
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div>
                <label style={{ color: '#c4b5fd', display: 'block', marginBottom: '5px' }}>
                  Nom *
                </label>
                <input
                  type="text"
                  value={newWarriorForm.name}
                  onChange={(e) => setNewWarriorForm({...newWarriorForm, name: e.target.value})}
                  placeholder="Nom du guerrier"
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{ color: '#c4b5fd', display: 'block', marginBottom: '5px' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={newWarriorForm.email}
                  onChange={(e) => setNewWarriorForm({...newWarriorForm, email: e.target.value})}
                  placeholder="email@exemple.fr"
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{ color: '#c4b5fd', display: 'block', marginBottom: '5px' }}>
                  Mission
                </label>
                <select
                  value={newWarriorForm.mission}
                  onChange={(e) => setNewWarriorForm({...newWarriorForm, mission: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  <option value="contact">Contact</option>
                  <option value="donate">Don</option>
                  <option value="volunteer">Bénévole</option>
                  <option value="info">Information</option>
                </select>
              </div>
              
              <div>
                <label style={{ color: '#c4b5fd', display: 'block', marginBottom: '5px' }}>
                  Village
                </label>
                <select
                  value={newWarriorForm.village}
                  onChange={(e) => setNewWarriorForm({...newWarriorForm, village: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  <option value="Principal">Principal</option>
                  <option value="Nord">Nord</option>
                  <option value="Sud">Sud</option>
                  <option value="Est">Est</option>
                  <option value="Ouest">Ouest</option>
                </select>
              </div>
              
              <div>
                <label style={{ color: '#c4b5fd', display: 'block', marginBottom: '5px' }}>
                  Statut
                </label>
                <select
                  value={newWarriorForm.status}
                  onChange={(e) => setNewWarriorForm({...newWarriorForm, status: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="veteran">Vétéran</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={addNewWarrior}
              style={{
                padding: '12px 25px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              <FaPlus /> Ajouter le Guerrier
            </button>
          </div>

          {/* Tableau des guerriers */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '25px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            overflowX: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#fbbf24' }}>Liste des Guerriers</h3>
              <div style={{ color: '#c4b5fd' }}>
                Total: {warriors.length} guerriers
              </div>
            </div>
            
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '800px'
            }}>
              <thead>
                <tr style={{
                  background: 'rgba(139, 92, 246, 0.2)',
                  borderBottom: '2px solid rgba(139, 92, 246, 0.3)'
                }}>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'left',
                    color: 'white'
                  }}>Nom</th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'left',
                    color: 'white'
                  }}>Email</th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'left',
                    color: 'white'
                  }}>Mission</th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'left',
                    color: 'white'
                  }}>Badge</th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'left',
                    color: 'white'
                  }}>Score</th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'left',
                    color: 'white'
                  }}>Village</th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'left',
                    color: 'white'
                  }}>Statut</th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'left',
                    color: 'white'
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWarriors.map((warrior) => (
                  <tr key={warrior.id} style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'background 0.3s ease'
                  }}>
                    <td style={{ padding: '15px' }}>
                      {editingWarrior === warrior.id ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '8px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '2px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '6px',
                            color: 'white'
                          }}
                        />
                      ) : (
                        <strong style={{ color: 'white' }}>{warrior.name}</strong>
                      )}
                    </td>
                    
                    <td style={{ padding: '15px', color: '#c4b5fd' }}>
                      {warrior.email}
                    </td>
                    
                    <td style={{ padding: '15px' }}>
                      {editingWarrior === warrior.id ? (
                        <select
                          value={editForm.mission}
                          onChange={(e) => setEditForm({...editForm, mission: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '8px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '2px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '6px',
                            color: 'white'
                          }}
                        >
                          <option value="contact">Contact</option>
                          <option value="donate">Don</option>
                          <option value="volunteer">Bénévole</option>
                          <option value="info">Information</option>
                        </select>
                      ) : (
                        <span style={{
                          padding: '5px 12px',
                          borderRadius: '15px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          display: 'inline-block',
                          ...(warrior.mission === 'contact' && {
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: '#3b82f6'
                          }),
                          ...(warrior.mission === 'donate' && {
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#10b981'
                          }),
                          ...(warrior.mission === 'volunteer' && {
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#ef4444'
                          }),
                          ...(warrior.mission === 'info' && {
                            background: 'rgba(139, 92, 246, 0.2)',
                            color: '#8b5cf6'
                          })
                        }}>
                          {warrior.mission}
                        </span>
                      )}
                    </td>
                    
                    <td style={{ padding: '15px', color: '#c4b5fd' }}>
                      {warrior.badge}
                    </td>
                    
                    <td style={{ padding: '15px' }}>
                      {editingWarrior === warrior.id ? (
                        <input
                          type="number"
                          value={editForm.impactScore}
                          onChange={(e) => setEditForm({...editForm, impactScore: parseInt(e.target.value)})}
                          style={{
                            width: '100%',
                            padding: '8px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '2px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '6px',
                            color: 'white'
                          }}
                        />
                      ) : (
                        <span style={{
                          fontWeight: 'bold',
                          color: '#fbbf24'
                        }}>
                          {warrior.impactScore} pts
                        </span>
                      )}
                    </td>
                    
                    <td style={{ padding: '15px' }}>
                      {editingWarrior === warrior.id ? (
                        <select
                          value={editForm.village}
                          onChange={(e) => setEditForm({...editForm, village: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '8px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '2px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '6px',
                            color: 'white'
                          }}
                        >
                          <option value="Principal">Principal</option>
                          <option value="Nord">Nord</option>
                          <option value="Sud">Sud</option>
                          <option value="Est">Est</option>
                          <option value="Ouest">Ouest</option>
                        </select>
                      ) : (
                        <span style={{ color: '#c4b5fd' }}>{warrior.village}</span>
                      )}
                    </td>
                    
                    <td style={{ padding: '15px' }}>
                      {editingWarrior === warrior.id ? (
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '8px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '2px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '6px',
                            color: 'white'
                          }}
                        >
                          <option value="active">Actif</option>
                          <option value="inactive">Inactif</option>
                          <option value="veteran">Vétéran</option>
                        </select>
                      ) : (
                        <span style={{
                          padding: '5px 12px',
                          borderRadius: '15px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          display: 'inline-block',
                          ...(warrior.status === 'active' && {
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#10b981'
                          }),
                          ...(warrior.status === 'inactive' && {
                            background: 'rgba(156, 163, 175, 0.2)',
                            color: '#9ca3af'
                          }),
                          ...(warrior.status === 'veteran' && {
                            background: 'rgba(245, 158, 11, 0.2)',
                            color: '#f59e0b'
                          })
                        }}>
                          {warrior.status}
                        </span>
                      )}
                    </td>
                    
                    <td style={{ padding: '15px' }}>
                      {editingWarrior === warrior.id ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={saveEdit}
                            style={{
                              padding: '8px 15px',
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <FaCheck /> Sauvegarder
                          </button>
                          <button
                            onClick={cancelEdit}
                            style={{
                              padding: '8px 15px',
                              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <FaTimes /> Annuler
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => startEdit(warrior)}
                            style={{
                              padding: '8px 15px',
                              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <FaEdit /> Modifier
                          </button>
                          <button
                            onClick={() => deleteWarrior(warrior.id)}
                            style={{
                              padding: '8px 15px',
                              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))',
                              color: '#ef4444',
                              border: '2px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <FaTrash /> Supprimer
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredWarriors.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#9ca3af'
              }}>
                Aucun guerrier trouvé pour cette recherche.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'missions' && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '25px',
          border: '2px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ 
            color: '#fbbf24',
            marginBottom: '20px'
          }}>
            📋 Détail des Missions
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {missionStats.map((mission) => (
              <div key={mission.type} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '25px',
                border: `2px solid ${mission.color}20`
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: `${mission.color}20`,
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    color: mission.color
                  }}>
                    {mission.icon}
                  </div>
                  <div>
                    <h4 style={{ 
                      color: 'white',
                      marginBottom: '5px',
                      textTransform: 'capitalize'
                    }}>
                      {mission.type}
                    </h4>
                    <div style={{ color: '#c4b5fd', fontSize: '0.9rem' }}>
                      {mission.count} participants
                    </div>
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '15px'
                }}>
                  <div style={{ 
                    color: '#c4b5fd',
                    marginBottom: '10px',
                    fontSize: '0.9rem'
                  }}>
                    Description:
                  </div>
                  <div style={{ color: 'white', fontSize: '0.95rem' }}>
                    {mission.description}
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                    Taux de participation
                  </div>
                  <div style={{ 
                    fontWeight: 'bold',
                    color: mission.color
                  }}>
                    {((mission.count / 50) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '25px',
          border: '2px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ 
            color: '#fbbf24',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FaTrophy /> Classement des Guerriers
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            {[...warriors]
              .sort((a, b) => b.impactScore - a.impactScore)
              .slice(0, 10)
              .map((warrior, index) => (
                <div key={warrior.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#8b5cf6',
                    marginRight: '20px',
                    minWidth: '40px',
                    textAlign: 'center'
                  }}>
                    #{index + 1}
                  </div>
                  
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px',
                    fontSize: '1.5rem'
                  }}>
                    👤
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '5px'
                    }}>
                      <strong style={{ color: 'white', fontSize: '1.1rem' }}>
                        {warrior.name}
                      </strong>
                      <span style={{
                        background: 'rgba(251, 191, 36, 0.2)',
                        color: '#fbbf24',
                        padding: '3px 10px',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {warrior.badge}
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      gap: '20px',
                      fontSize: '0.9rem',
                      color: '#c4b5fd'
                    }}>
                      <span>Village: {warrior.village}</span>
                      <span>Mission: {warrior.mission}</span>
                      <span>Score: {warrior.impactScore} pts</span>
                      <span>Compétences: {warrior.skills.length}</span>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: '#10b981',
                    fontWeight: 'bold'
                  }}>
                    <FaArrowUp /> Top {index < 3 ? '3' : '10'}
                  </div>
                </div>
              ))}
          </div>
          
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px dashed rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ color: '#c4b5fd', marginBottom: '10px' }}>
              🎯 Objectif du mois: Atteindre 150 guerriers actifs
            </div>
            <div style={{
              height: '10px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '5px',
              overflow: 'hidden',
              marginBottom: '10px'
            }}>
              <div style={{
                height: '100%',
                width: `${(warriors.length / 150) * 100}%`,
                background: 'linear-gradient(90deg, #10b981, #3b82f6)',
                borderRadius: '5px'
              }} />
            </div>
            <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              Progression: {warriors.length}/150 ({((warriors.length / 150) * 100).toFixed(1)}%)
            </div>
          </div>
        </div>
      )}

      {/* Footer du Dashboard */}
      <footer style={{
        marginTop: '50px',
        padding: '20px',
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '0.9rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '10px',
          flexWrap: 'wrap'
        }}>
          <span>© 2025 Résistance NIRD</span>
          <span>•</span>
          <span>Version 1.0.0 (Session Locale)</span>
          <span>•</span>
          <span>{new Date().toLocaleDateString('fr-FR')}</span>
        </div>
        <div>
          🛡️ Pour un numérique inclusif, responsable et durable
        </div>
        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '10px' }}>
          Données sauvegardées dans localStorage
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
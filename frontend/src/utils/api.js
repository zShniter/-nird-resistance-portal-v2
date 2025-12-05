// src/utils/api.js
const API_URL = 'http://localhost:5000/api';

// Fonction utilitaire pour les appels API
async function apiCall(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || `Erreur ${response.status}`);
    }
    
    return result;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
}

// API des guerriers
export const warriorAPI = {
  // Récupérer tous les guerriers
  getAll: () => apiCall('/warriors'),
  
  // Récupérer un guerrier par ID
  getById: (id) => apiCall(`/warriors/${id}`),
  
  // Créer un nouveau guerrier
  create: (data) => apiCall('/warriors', 'POST', data),
  
  // Mettre à jour un guerrier
  update: (id, data) => apiCall(`/warriors/${id}`, 'PUT', data),
  
  // Supprimer un guerrier
  delete: (id) => apiCall(`/warriors/${id}`, 'DELETE'),
  
  // Rechercher des guerriers
  search: (query) => apiCall(`/warriors/search/${query}`)
};

// API des statistiques
export const statsAPI = {
  // Récupérer les statistiques
  getStats: () => apiCall('/stats'),
  
  // Récupérer le classement
  getLeaderboard: () => apiCall('/leaderboard')
};

export default { warriorAPI, statsAPI };
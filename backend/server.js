// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// Connexion MongoDB
const MONGODB_URI = 'mongodb+srv://novatheimpuls_db_user:adminadmin@cluster0.lxegmd0.mongodb.net/nird_resistance?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connecté avec succès'))
.catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

// Modèle Warrior
const warriorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, "L'email est requis"],
    unique: true,
    lowercase: true,
    trim: true
  },
  mission: {
    type: String,
    required: true,
    enum: ['contact', 'donate', 'volunteer', 'info']
  },
  missionData: {
    message: String,
    amount: String,
    skills: [String],
    recurring: Boolean
  },
  badge: {
    type: String,
    default: '🛡️ Résistant NIRD'
  },
  impactScore: {
    type: Number,
    default: 10
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'veteran'],
    default: 'active'
  },
  village: {
    type: String,
    default: 'Principal'
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Warrior = mongoose.model('Warrior', warriorSchema);

// Routes API

// Route test
app.get('/', (req, res) => {
  res.json({
    message: 'API Résistance NIRD 2025',
    status: 'en ligne',
    version: '1.0.0',
    database: 'MongoDB Atlas'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connecté' : 'déconnecté'
  });
});

// Récupérer tous les guerriers
app.get('/api/warriors', async (req, res) => {
  try {
    const warriors = await Warrior.find().sort({ joinDate: -1 });
    res.json({
      success: true,
      count: warriors.length,
      warriors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Récupérer un guerrier par ID
app.get('/api/warriors/:id', async (req, res) => {
  try {
    const warrior = await Warrior.findById(req.params.id);
    if (!warrior) {
      return res.status(404).json({
        success: false,
        error: 'Guerrier non trouvé'
      });
    }
    res.json({
      success: true,
      warrior
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Créer un nouveau guerrier (rejoindre la résistance)
app.post('/api/warriors', async (req, res) => {
  try {
    const { name, email, mission, missionData } = req.body;
    
    // Vérifier si l'email existe déjà
    const existingWarrior = await Warrior.findOne({ email });
    if (existingWarrior) {
      return res.status(400).json({
        success: false,
        error: 'Email déjà enregistré dans la résistance!'
      });
    }

    // Générer le badge selon la mission
    const badges = {
      contact: '🪄 Messager de la Potion Magique',
      donate: missionData?.amount === '50' ? '💰 Héros du Trésor' : '🪙 Donateur Résistant',
      volunteer: '🛡️ Guerrier Gaulois Actif',
      info: '📜 Sage Numérique'
    };

    // Calculer le score d'impact
    let impactScore = 10;
    if (mission === 'donate' && missionData?.amount) {
      impactScore += Math.floor(parseInt(missionData.amount) / 10);
    } else if (mission === 'volunteer') {
      impactScore += 20;
    }

    // Créer le guerrier
    const warrior = await Warrior.create({
      name,
      email,
      mission,
      missionData,
      badge: badges[mission] || '🛡️ Résistant NIRD',
      impactScore
    });

    res.status(201).json({
      success: true,
      message: 'Bienvenue dans la résistance! 🛡️',
      warrior
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Mettre à jour un guerrier
app.put('/api/warriors/:id', async (req, res) => {
  try {
    const { name, village, status } = req.body;
    
    const warrior = await Warrior.findByIdAndUpdate(
      req.params.id,
      {
        name,
        village,
        status
      },
      { new: true, runValidators: true }
    );

    if (!warrior) {
      return res.status(404).json({
        success: false,
        error: 'Guerrier non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès! 🎉',
      warrior
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Supprimer un guerrier
app.delete('/api/warriors/:id', async (req, res) => {
  try {
    const warrior = await Warrior.findByIdAndDelete(req.params.id);
    
    if (!warrior) {
      return res.status(404).json({
        success: false,
        error: 'Guerrier non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Guerrier retiré de la résistance'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rechercher des guerriers
app.get('/api/warriors/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const warriors = await Warrior.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { village: { $regex: query, $options: 'i' } },
        { badge: { $regex: query, $options: 'i' } }
      ]
    }).limit(20);

    res.json({
      success: true,
      count: warriors.length,
      warriors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Récupérer les statistiques
app.get('/api/stats', async (req, res) => {
  try {
    const totalWarriors = await Warrior.countDocuments();
    const missionStats = await Warrior.aggregate([
      {
        $group: {
          _id: '$mission',
          count: { $sum: 1 },
          totalImpact: { $sum: '$impactScore' }
        }
      }
    ]);

    // Statistiques simulées pour les objectifs 2025
    const goals = {
      year: 2025,
      targetSchools: 100,
      currentSchools: 42,
      targetDevices: 1000,
      currentDevices: 1250,
      targetWarriors: 500,
      currentWarriors: totalWarriors,
      monthlyProgress: [
        { month: 'Jan', schools: 10, devices: 100, warriors: 20 },
        { month: 'Fév', schools: 15, devices: 250, warriors: 35 },
        { month: 'Mar', schools: 22, devices: 400, warriors: 50 },
        { month: 'Avr', schools: 30, devices: 600, warriors: 65 },
        { month: 'Mai', schools: 42, devices: 1250, warriors: totalWarriors }
      ]
    };

    // 10 derniers guerriers
    const recentWarriors = await Warrior.find()
      .sort({ joinDate: -1 })
      .limit(10)
      .select('name badge impactScore village joinDate');

    res.json({
      success: true,
      totalWarriors,
      missionStats,
      goals,
      recentWarriors,
      impactMetrics: {
        devicesReconditioned: goals.currentDevices,
        licensesSaved: 15800,
        schoolsLiberated: goals.currentSchools
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Classement
app.get('/api/leaderboard', async (req, res) => {
  try {
    const warriors = await Warrior.find()
      .sort({ impactScore: -1, joinDate: -1 })
      .limit(20)
      .select('name badge impactScore village mission');

    res.json({
      success: true,
      warriors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Gérer les erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée'
  });
});

// Gérer les erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Erreur serveur'
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend en cours d'exécution sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}`);
  console.log(`🏥 Vérification santé: http://localhost:${PORT}/health`);
  console.log(`📊 Base de données: ${MONGODB_URI.split('@')[1]}`);
});

module.exports = app;
const mongoose = require('mongoose');
const Warrior = require('../models/Warrior');
const connectDB = require('../config/database');

const sampleWarriors = [
  {
    name: "Astérix Gaulois",
    email: "asterix@village-gaulois.fr",
    mission: "contact",
    badge: "🛡️ Chef de la Résistance",
    impactScore: 250,
    village: "Principal",
    achievements: [
      {
        name: "Leader Natoque",
        description: "Fondateur de la résistance",
        icon: "👑"
      }
    ]
  },
  // Add more sample data...
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Warrior.deleteMany({});
    console.log('🗑️  Database cleared');
    
    // Insert sample warriors
    await Warrior.insertMany(sampleWarriors);
    console.log(`✅ ${sampleWarriors.length} warriors added`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
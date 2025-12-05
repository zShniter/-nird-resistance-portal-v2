const Warrior = require('../models/Warrior');

// @desc    Get all warriors
// @route   GET /api/warriors
// @access  Public
exports.getWarriors = async (req, res) => {
  try {
    const { page = 1, limit = 20, mission, status, village } = req.query;
    
    const query = {};
    if (mission) query.mission = mission;
    if (status) query.status = status;
    if (village) query.village = village;
    
    const warriors = await Warrior.find(query)
      .sort({ impactScore: -1, joinDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Warrior.countDocuments(query);
    
    res.json({
      success: true,
      count: warriors.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      warriors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single warrior
// @route   GET /api/warriors/:id
// @access  Public
exports.getWarrior = async (req, res) => {
  try {
    const warrior = await Warrior.findById(req.params.id);
    
    if (!warrior) {
      return res.status(404).json({
        success: false,
        error: 'Warrior not found'
      });
    }
    
    res.json({
      success: true,
      warrior
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new warrior
// @route   POST /api/warriors
// @access  Public
exports.createWarrior = async (req, res) => {
  try {
    const { name, email, mission, missionData } = req.body;
    
    // Check if warrior exists
    let warrior = await Warrior.findOne({ email });
    if (warrior) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered in the resistance!'
      });
    }
    
    // Generate badge based on mission
    const badges = {
      contact: '🪄 Messager de la Potion Magique',
      donate: missionData?.amount === '50' ? '💰 Héros du Trésor' : '🪙 Donateur Résistant',
      volunteer: '🛡️ Guerrier Gaulois Actif',
      info: '📜 Sage Numérique'
    };
    
    // Calculate impact score
    let impactScore = 10; // Base score
    if (mission === 'donate' && missionData?.amount) {
      impactScore += Math.floor(parseInt(missionData.amount) / 10);
    } else if (mission === 'volunteer') {
      impactScore += 20;
    }
    
    warrior = await Warrior.create({
      name,
      email,
      mission,
      missionData,
      badge: badges[mission] || '🛡️ Résistant NIRD',
      impactScore,
      achievements: [{
        name: 'First Mission',
        description: 'Joined the NIRD Resistance',
        icon: '🎯'
      }]
    });
    
    res.status(201).json({
      success: true,
      message: 'Welcome to the resistance! 🛡️',
      warrior
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update warrior
// @route   PUT /api/warriors/:id
// @access  Private
exports.updateWarrior = async (req, res) => {
  try {
    const { name, village, status } = req.body;
    
    const warrior = await Warrior.findByIdAndUpdate(
      req.params.id,
      {
        name,
        village,
        status,
        lastActivity: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!warrior) {
      return res.status(404).json({
        success: false,
        error: 'Warrior not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully! 🎉',
      warrior
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete warrior
// @route   DELETE /api/warriors/:id
// @access  Private
exports.deleteWarrior = async (req, res) => {
  try {
    const warrior = await Warrior.findByIdAndDelete(req.params.id);
    
    if (!warrior) {
      return res.status(404).json({
        success: false,
        error: 'Warrior not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Warrior removed from resistance'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Add achievement
// @route   POST /api/warriors/:id/achievements
// @access  Public
exports.addAchievement = async (req, res) => {
  try {
    const { name, description, icon = '🏅' } = req.body;
    
    const warrior = await Warrior.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          achievements: {
            name,
            description,
            icon,
            date: new Date()
          }
        },
        $inc: { impactScore: 50 }
      },
      { new: true }
    );
    
    if (!warrior) {
      return res.status(404).json({
        success: false,
        error: 'Warrior not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Achievement unlocked! 🎉',
      achievement: warrior.achievements[warrior.achievements.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Search warriors
// @route   GET /api/warriors/search/:query
// @access  Public
exports.searchWarriors = async (req, res) => {
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
};
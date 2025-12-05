const mongoose = require('mongoose');

const warriorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
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
    default: 10,
    min: 0,
    max: 1000
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'veteran'],
    default: 'active'
  },
  village: {
    type: String,
    default: 'Principal',
    enum: ['Principal', 'Nord', 'Sud', 'Est', 'Ouest', 'Central']
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  achievements: [{
    name: String,
    description: String,
    icon: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
warriorSchema.index({ email: 1 });
warriorSchema.index({ mission: 1 });
warriorSchema.index({ impactScore: -1 });
warriorSchema.index({ status: 1 });

// Virtual for join date formatted
warriorSchema.virtual('joinDateFormatted').get(function() {
  return this.joinDate.toLocaleDateString('fr-FR');
});

// Method to update last activity
warriorSchema.methods.updateActivity = function() {
  this.lastActivity = new Date();
  return this.save();
};

const Warrior = mongoose.model('Warrior', warriorSchema);

module.exports = Warrior;
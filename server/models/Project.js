const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  targetAudience: {
    type: String,
    required: true
  },
  mascot: {
    type: String,
    required: true,
    enum: ['capybara', 'hamster', 'parrot', 'panda']
  },
  generatedCopy: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema);
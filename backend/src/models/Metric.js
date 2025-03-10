const mongoose = require('mongoose');

const MetricSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'userSatisfaction',
      'adoptionRate',
      'techUtilization',
      'marketCompetitiveness',
      'investmentLevels',
      'innovationRates'
    ],
  },
  value: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

// Add indexes for faster queries
MetricSchema.index({ type: 1, date: -1 });

module.exports = mongoose.model('Metric', MetricSchema);

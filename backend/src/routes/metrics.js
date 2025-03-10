const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');
const authMiddleware = require('../middleware/auth');

// Get dashboard data
router.get('/dashboard', authMiddleware.verifyToken, metricsController.getDashboardData);

// Add a new metric (admin only)
router.post('/', [authMiddleware.verifyToken, authMiddleware.requireAdmin], metricsController.addMetric);

module.exports = router;

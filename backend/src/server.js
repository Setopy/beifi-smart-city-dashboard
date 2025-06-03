const express = require('express');
const cors = require('cors');
const app = express();

// Simple, working CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// WORKING DASHBOARD ENDPOINT
app.get('/api/working/dashboard', (req, res) => {
  console.log('Dashboard endpoint called successfully!');
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  const data = {
    userSatisfaction: {
      current: 84.4,
      trend: 2.5,
      history: Array.from({length: 30}, (_, i) => ({
        date: new Date(Date.now() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: Math.round((80 + Math.random() * 15) * 100) / 100
      }))
    },
    adoptionRate: {
      current: 52.6,
      trend: 1.8,
      history: Array.from({length: 30}, (_, i) => ({
        date: new Date(Date.now() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: Math.round((50 + Math.random() * 20) * 100) / 100
      }))
    },
    techUtilization: {
      current: 78.1,
      trend: -0.5,
      history: Array.from({length: 30}, (_, i) => ({
        date: new Date(Date.now() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: Math.round((70 + Math.random() * 18) * 100) / 100
      }))
    },
    marketCompetitiveness: {
      current: 7.5,
      trend: 0.3,
      history: Array.from({length: 30}, (_, i) => ({
        date: new Date(Date.now() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: Math.round((7 + Math.random() * 2) * 100) / 100
      }))
    },
    airQuality: {
      current: 76,
      trend: -2.1,
      history: Array.from({length: 30}, (_, i) => ({
        date: new Date(Date.now() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: Math.round((65 + Math.random() * 25) * 100) / 100
      }))
    },
    energyConsumption: {
      current: 234,
      trend: -3.2,
      history: Array.from({length: 30}, (_, i) => ({
        date: new Date(Date.now() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: Math.round((200 + Math.random() * 80) * 100) / 100
      }))
    },
    trafficFlow: {
      current: 82,
      trend: 1.5,
      history: Array.from({length: 30}, (_, i) => ({
        date: new Date(Date.now() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: Math.round((70 + Math.random() * 30) * 100) / 100
      }))
    },
    investmentAllocation: [
      { category: 'Research', value: 35, color: '#FF6384' },
      { category: 'Development', value: 40, color: '#36A2EB' },
      { category: 'Marketing', value: 15, color: '#FFCE56' },
      { category: 'Operations', value: 10, color: '#4BC0C0' }
    ],
    innovationMetrics: [
      { month: 'Jan', newFeatures: 5, improvements: 12, research: 3 },
      { month: 'Feb', newFeatures: 7, improvements: 8, research: 2 },
      { month: 'Mar', newFeatures: 3, improvements: 15, research: 4 },
      { month: 'Apr', newFeatures: 8, improvements: 10, research: 1 },
      { month: 'May', newFeatures: 6, improvements: 14, research: 3 },
      { month: 'Jun', newFeatures: 9, improvements: 7, research: 5 }
    ],
    lastUpdated: new Date().toISOString(),
    status: 'SUCCESS - All Charts Working'
  };
  
  res.json(data);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: 'Beifi Smart City Dashboard API is running perfectly'
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Beifi Smart City Dashboard API',
    version: '2.0.0',
    endpoints: [
      '/api/working/dashboard - Complete dashboard data',
      '/health - Health check'
    ]
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Beifi Smart City Dashboard API running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/working/dashboard`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
});

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Set up axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fetch dashboard data
export const fetchDashboardData = async (timeRange = '6m') => {
  try {
    const response = await apiClient.get(`/api/metrics/dashboard?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    // For development, return mock data if API is not available
    if (import.meta.env.DEV) {
      return getMockDashboardData(timeRange);
    }
    
    throw error;
  }
};

// Mock data for development
const getMockDashboardData = (timeRange) => {
  // Generate dates based on timeRange
  const dates = [];
  const now = new Date();
  let numPoints;
  
  switch (timeRange) {
    case '1m':
      numPoints = 30;
      break;
    case '3m':
      numPoints = 90;
      break;
    case '6m':
      numPoints = 180;
      break;
    case '1y':
      numPoints = 365;
      break;
    default:
      numPoints = 180;
  }
  
  // Generate sample dates and data points
  for (let i = 0; i < numPoints; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dates.unshift(date.toISOString().split('T')[0]);
  }
  
  // Create trend data
  const trends = dates.map(date => {
    const dayIndex = new Date(date).getDay();
    
    return {
      date,
      userSatisfaction: 85 + Math.sin(dayIndex) * 10,
      adoptionRate: 62 + Math.cos(dayIndex) * 8,
      techUtilization: 78 + Math.sin(dayIndex / 2) * 7,
      marketCompetitiveness: 7.5 + Math.cos(dayIndex / 3) * 1.5,
      investmentLevels: 120 + Math.sin(dayIndex / 4) * 20,
      innovationRates: 15 + Math.cos(dayIndex / 2) * 5
    };
  });
  
  // Get current values (last data point)
  const current = trends[trends.length - 1];
  
  // Calculate trends (percentage change from previous period)
  const previous = trends[trends.length - 2];
  const calculateTrend = (current, previous, key) => {
    return previous[key] !== 0 ? ((current[key] - previous[key]) / previous[key]) * 100 : 0;
  };
  
  return {
    userSatisfaction: {
      current: current.userSatisfaction,
      trend: calculateTrend(current, previous, 'userSatisfaction'),
      history: trends.map(item => ({ date: item.date, value: item.userSatisfaction }))
    },
    adoptionRate: {
      current: current.adoptionRate,
      trend: calculateTrend(current, previous, 'adoptionRate'),
      history: trends.map(item => ({ date: item.date, value: item.adoptionRate }))
    },
    techUtilization: {
      current: current.techUtilization,
      trend: calculateTrend(current, previous, 'techUtilization'),
      history: trends.map(item => ({ date: item.date, value: item.techUtilization }))
    },
    marketCompetitiveness: {
      current: current.marketCompetitiveness,
      trend: calculateTrend(current, previous, 'marketCompetitiveness'),
      history: trends.map(item => ({ date: item.date, value: item.marketCompetitiveness }))
    },
    investmentLevels: {
      current: current.investmentLevels,
      trend: calculateTrend(current, previous, 'investmentLevels'),
      history: trends.map(item => ({ date: item.date, value: item.investmentLevels }))
    },
    innovationRates: {
      current: current.innovationRates,
      trend: calculateTrend(current, previous, 'innovationRates'),
      history: trends.map(item => ({ date: item.date, value: item.innovationRates }))
    },
    trends,
    investmentAllocation: [
      { category: 'Research', value: 35 },
      { category: 'Development', value: 40 },
      { category: 'Marketing', value: 15 },
      { category: 'Operations', value: 10 }
    ],
    innovationMetrics: [
      { month: 'Jan', newFeatures: 5, improvements: 12, researchInitiatives: 3 },
      { month: 'Feb', newFeatures: 7, improvements: 8, researchInitiatives: 2 },
      { month: 'Mar', newFeatures: 3, improvements: 15, researchInitiatives: 4 },
      { month: 'Apr', newFeatures: 8, improvements: 10, researchInitiatives: 1 },
      { month: 'May', newFeatures: 6, improvements: 14, researchInitiatives: 3 },
      { month: 'Jun', newFeatures: 9, improvements: 7, researchInitiatives: 5 }
    ]
  };
};

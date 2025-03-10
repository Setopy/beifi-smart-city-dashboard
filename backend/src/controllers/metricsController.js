const Metric = require('../models/Metric');

// Get dashboard data
exports.getDashboardData = async (req, res) => {
  try {
    const { timeRange = '6m' } = req.query;
    
    // Calculate date range based on timeRange parameter
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '1m':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3m':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6m':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 6);
    }
    
    // Fetch metric history for each type
    const metricTypes = [
      'userSatisfaction',
      'adoptionRate',
      'techUtilization',
      'marketCompetitiveness',
      'investmentLevels',
      'innovationRates'
    ];
    
    const metricsPromises = metricTypes.map(async (type) => {
      const history = await Metric.find({
        type,
        date: { $gte: startDate }
      })
      .sort({ date: 1 })
      .lean();
      
      // Get current value and calculate trend
      const current = history.length > 0 ? history[history.length - 1].value : 0;
      
      let trend = 0;
      if (history.length >= 2) {
        const previous = history[history.length - 2].value;
        trend = previous !== 0 ? ((current - previous) / previous) * 100 : 0;
      }
      
      return {
        type,
        current,
        trend,
        history: history.map(item => ({
          date: item.date,
          value: item.value,
          ...item.metadata
        }))
      };
    });
    
    const metricsResults = await Promise.all(metricsPromises);
    
    // Transform results into the expected format
    const dashboardData = {};
    metricsResults.forEach(result => {
      dashboardData[result.type] = {
        current: result.current,
        trend: result.trend,
        history: result.history
      };
    });
    
    // Create trend data with all metrics for line chart
    const trendData = [];
    const dates = [...new Set(
      metricsResults
        .flatMap(metric => metric.history)
        .map(item => item.date.toISOString().split('T')[0])
    )].sort();
    
    dates.forEach(date => {
      const dataPoint = { date };
      
      metricsResults.forEach(metric => {
        const historyItem = metric.history.find(
          item => item.date.toISOString().split('T')[0] === date
        );
        
        if (historyItem) {
          dataPoint[metric.type] = historyItem.value;
        }
      });
      
      trendData.push(dataPoint);
    });
    
    dashboardData.trends = trendData;
    
    // Add some mock data for other visualizations
    dashboardData.investmentAllocation = [
      { category: 'Research', value: 35 },
      { category: 'Development', value: 40 },
      { category: 'Marketing', value: 15 },
      { category: 'Operations', value: 10 }
    ];
    
    dashboardData.innovationMetrics = [
      { month: 'Jan', newFeatures: 5, improvements: 12, researchInitiatives: 3 },
      { month: 'Feb', newFeatures: 7, improvements: 8, researchInitiatives: 2 },
      { month: 'Mar', newFeatures: 3, improvements: 15, researchInitiatives: 4 },
      { month: 'Apr', newFeatures: 8, improvements: 10, researchInitiatives: 1 },
      { month: 'May', newFeatures: 6, improvements: 14, researchInitiatives: 3 },
      { month: 'Jun', newFeatures: 9, improvements: 7, researchInitiatives: 5 }
    ];
    
    res.json(dashboardData);
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

// Add a new metric
exports.addMetric = async (req, res) => {
  try {
    const { type, value, metadata } = req.body;
    
    const newMetric = new Metric({
      type,
      value,
      metadata
    });
    
    await newMetric.save();
    
    res.status(201).json(newMetric);
  } catch (err) {
    console.error('Error adding metric:', err);
    res.status(500).json({ error: 'Failed to add metric' });
  }
};

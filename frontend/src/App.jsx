import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// Custom components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MetricCard from './components/MetricCard';
import LineChartComponent from './components/charts/LineChart';
import BarChartComponent from './components/charts/BarChart';
import PieChartComponent from './components/charts/PieChart';
import FilterControls from './components/FilterControls';

// Services
import { fetchDashboardData } from './services/dashboardService';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontSize: '2.2rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 20px rgba(0,0,0,0.2)',
          },
        },
      },
    },
  },
});

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('6m'); // 6 months default
  const [currentTab, setCurrentTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardData(timeRange);
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Set up real-time updates
    const intervalId = setInterval(loadData, 60000); // Refresh every minute
    
    return () => clearInterval(intervalId);
  }, [timeRange]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading && !dashboardData) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading Dashboard...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Error
          </Typography>
          <Typography variant="body1">{error}</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Header toggleSidebar={toggleSidebar} />
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            padding: 3,
            pt: 10,
          }}
        >
          <Container maxWidth="xl">
            <Typography variant="h1" gutterBottom>
              Beifi IPN Smart City Techno-Economic Dashboard
            </Typography>
            
            <FilterControls 
              timeRange={timeRange} 
              onTimeRangeChange={handleTimeRangeChange} 
            />
            
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              sx={{ mb: 3 }}
            >
              <Tab label="Overview" />
              <Tab label="Technical Metrics" />
              <Tab label="Economic Metrics" />
              <Tab label="Project Management" />
            </Tabs>
            
            {currentTab === 0 && (
              <>
                <Grid container spacing={3}>
                  {/* KPI Summary Cards */}
                  <Grid item xs={12} md={4} lg={3}>
                    <MetricCard
                      title="User Satisfaction"
                      value={dashboardData?.userSatisfaction?.current || 0}
                      unit="%"
                      trend={dashboardData?.userSatisfaction?.trend || 0}
                      description="Average user satisfaction rating"
                      chartData={dashboardData?.userSatisfaction?.history || []}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} lg={3}>
                    <MetricCard
                      title="Adoption Rate"
                      value={dashboardData?.adoptionRate?.current || 0}
                      unit="%"
                      trend={dashboardData?.adoptionRate?.trend || 0}
                      description="Technology adoption across target users"
                      chartData={dashboardData?.adoptionRate?.history || []}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} lg={3}>
                    <MetricCard
                      title="Technology Utilization"
                      value={dashboardData?.techUtilization?.current || 0}
                      unit="%"
                      trend={dashboardData?.techUtilization?.trend || 0}
                      description="Percentage of features actively used"
                      chartData={dashboardData?.techUtilization?.history || []}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} lg={3}>
                    <MetricCard
                      title="Market Competitiveness"
                      value={dashboardData?.marketCompetitiveness?.current || 0}
                      unit=""
                      trend={dashboardData?.marketCompetitiveness?.trend || 0}
                      description="Competitive position score (1-10)"
                      chartData={dashboardData?.marketCompetitiveness?.history || []}
                    />
                  </Grid>
                  
                  {/* Main Charts */}
                  <Grid item xs={12} md={8}>
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 350,
                      }}
                    >
                      <Typography variant="h3" gutterBottom>
                        Key Metrics Trends
                      </Typography>
                      <LineChartComponent 
                        data={dashboardData?.trends || []} 
                        lines={['userSatisfaction', 'adoptionRate', 'techUtilization']}
                        xAxisKey="date"
                      />
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 350,
                      }}
                    >
                      <Typography variant="h3" gutterBottom>
                        Investment Allocation
                      </Typography>
                      <PieChartComponent 
                        data={dashboardData?.investmentAllocation || []} 
                        dataKey="value"
                        nameKey="category"
                      />
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 350,
                      }}
                    >
                      <Typography variant="h3" gutterBottom>
                        Innovation Metrics
                      </Typography>
                      <BarChartComponent 
                        data={dashboardData?.innovationMetrics || []}
                        xAxisKey="month"
                        bars={[
                          { dataKey: 'newFeatures', name: 'New Features' },
                          { dataKey: 'improvements', name: 'Improvements' },
                          { dataKey: 'researchInitiatives', name: 'Research Initiatives' }
                        ]}
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </>
            )}
            
            {currentTab === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h3">Technical Metrics</Typography>
                    <Typography variant="body1">
                      Technical metrics content will be implemented here.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}
            
            {currentTab === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h3">Economic Metrics</Typography>
                    <Typography variant="body1">
                      Economic metrics content will be implemented here.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}
            
            {currentTab === 3 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h3">Project Management</Typography>
                    <Typography variant="body1">
                      Project management metrics content will be implemented here.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}
            
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

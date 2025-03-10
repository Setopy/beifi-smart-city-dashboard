import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { Line } from 'recharts';

const MetricCard = ({ title, value, unit, trend, description, chartData }) => {
  const trendColor = trend >= 0 ? 'success.main' : 'error.main';
  const TrendIcon = trend >= 0 ? ArrowUpward : ArrowDownward;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.2)',
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="h3" component="div" sx={{ display: 'inline' }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Typography>
          <Typography variant="h5" component="div" sx={{ display: 'inline', ml: 0.5, color: 'text.secondary' }}>
            {unit}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Chip
            icon={<TrendIcon fontSize="small" />}
            label={`${Math.abs(trend).toFixed(1)}%`}
            size="small"
            color={trend >= 0 ? "success" : "error"}
            sx={{ mr: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            vs previous period
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MetricCard;

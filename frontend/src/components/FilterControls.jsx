import React from 'react';
import { Box, ToggleButtonGroup, ToggleButton, Typography } from '@mui/material';

const FilterControls = ({ timeRange, onTimeRangeChange }) => {
  const handleTimeRangeChange = (event, newTimeRange) => {
    if (newTimeRange !== null) {
      onTimeRangeChange(newTimeRange);
    }
  };

  return (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
      <Typography variant="body1" sx={{ mr: 2 }}>
        Time Range:
      </Typography>
      <ToggleButtonGroup
        value={timeRange}
        exclusive
        onChange={handleTimeRangeChange}
        aria-label="time range"
        size="small"
      >
        <ToggleButton value="1m" aria-label="1 month">
          1M
        </ToggleButton>
        <ToggleButton value="3m" aria-label="3 months">
          3M
        </ToggleButton>
        <ToggleButton value="6m" aria-label="6 months">
          6M
        </ToggleButton>
        <ToggleButton value="1y" aria-label="1 year">
          1Y
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default FilterControls;

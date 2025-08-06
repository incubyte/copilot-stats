import React from 'react';
import { Box, Chip, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { BugReport, Category, Code, Description, RateReview } from '@mui/icons-material';

interface StatItemProps {
  label: string;
  value: number;
  percentage: number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info';
}

const StatItem = ({ label, value, percentage, icon, color }: StatItemProps) => (
  <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
      <Box display="flex" alignItems="center" gap={1}>
        {icon}
        <Typography variant="body2" fontWeight="500" color="text.secondary">
          {label}
        </Typography>
      </Box>
      <Chip
        label={`${percentage}%`}
        size="small"
        color={color}
        variant="outlined"
      />
    </Box>
    <Typography variant="h6" fontWeight="700" color="text.primary" mb={1}>
      {value}
    </Typography>
    <LinearProgress
      variant="determinate"
      value={percentage}
      color={color}
      sx={{
        height: 6,
        borderRadius: 3,
        backgroundColor: 'grey.200'
      }}
    />
  </Paper>
);

interface StatsOverviewProps {
  summaryData: {
    total: number;
    code: { value: number; percentage: number };
    test: { value: number; percentage: number };
    review: { value: number; percentage: number };
    docs: { value: number; percentage: number };
    other: { value: number; percentage: number };
  };
}

const StatsOverview = ({ summaryData }: StatsOverviewProps) => {
  return (
    <Box>
      <Grid container spacing={3}>
        {/* Total AI Usage Card */}
        <Grid item xs={12} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="600">
              Total AI Usage
            </Typography>
            <Typography variant="h3" fontWeight="700">
              {summaryData.total}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
              Total interactions
            </Typography>
          </Paper>
        </Grid>

        {/* Individual Statistics */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <StatItem
                label="Code Generation"
                value={summaryData.code.value}
                percentage={summaryData.code.percentage}
                icon={<Code color="primary" />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatItem
                label="Test Generation"
                value={summaryData.test.value}
                percentage={summaryData.test.percentage}
                icon={<BugReport color="secondary" />}
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatItem
                label="Reviews"
                value={summaryData.review.value}
                percentage={summaryData.review.percentage}
                icon={<RateReview color="error" />}
                color="error"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatItem
                label="Documentation"
                value={summaryData.docs.value}
                percentage={summaryData.docs.percentage}
                icon={<Description color="warning" />}
                color="warning"
              />
            </Grid>
          </Grid>

          {/* Other category if exists */}
          {summaryData.other.value > 0 && (
            <Box mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatItem
                    label="Other"
                    value={summaryData.other.value}
                    percentage={summaryData.other.percentage}
                    icon={<Category color="info" />}
                    color="info"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsOverview;

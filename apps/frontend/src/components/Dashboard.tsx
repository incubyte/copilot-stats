import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  LinearProgress,
  Paper,
  Typography
} from '@mui/material';
import {
  BugReport,
  Code,
  DataUsage,
  Description,
  Error as ErrorIcon,
  RateReview,
  Refresh,
  TrendingUp
} from '@mui/icons-material';
import { useDaysRange } from '../context/DaysRangeContext';
import { formatAIUsageStats, useCopilotStats } from '../services/api';
import UsageChart from './UsageChart';
import PRList from './PRList';
import Grid from '@mui/material/Grid';

const Dashboard = () => {
  const { daysRange } = useDaysRange();
  const { data, isLoading, isError, error, refetch } = useCopilotStats(daysRange);

  // Handle manual data fetching
  const handleGetData = async () => {
    await refetch();
  };

  // Show initial state with Get Data button
  if (!data && !isLoading && !isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card
          elevation={4}
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3
          }}
        >
          <DataUsage sx={{ fontSize: 64, mb: 2, color: 'text.secondary' }} />
          <Typography variant="h4" component="h1" gutterBottom fontWeight="700" color="text.primary">
            GitHub Copilot Analytics
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4, maxWidth: 600, mx: 'auto' }}>
            Analyze your team's AI-powered development insights and productivity metrics for the last {daysRange} days
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetData}
            startIcon={<TrendingUp />}
            sx={{
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
              fontWeight: '600',
              borderRadius: 2,
              boxShadow: 2
            }}
          >
            Initiate Analysis
          </Button>
        </Card>
      </Container>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card
          elevation={2}
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
            borderRadius: 3
          }}
        >
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5" fontWeight="600" color="primary.main" gutterBottom>
            Fetching Copilot Statistics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Analyzing repository data and AI usage patterns...
          </Typography>
        </Card>
      </Container>
    );
  }

  // Show error state with retry button
  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert
          severity="error"
          icon={<ErrorIcon />}
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleGetData}
              startIcon={<Refresh />}
            >
              Retry
            </Button>
          }
        >
          <Typography variant="h6" component="div">
            Error loading Copilot statistics
          </Typography>
          <Typography variant="body2">
            {error?.message ?? 'Unknown error occurred'}
          </Typography>
        </Alert>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No data available for the selected time period.
        </Alert>
      </Container>
    );
  }

  // Format the data for presentation
  const formattedStats = formatAIUsageStats(data.usageOfAI);

  // Extract PR data for display
  const allPRs = Object.entries(data.pullRequestsReviewedByCopilot)
    .flatMap(([repo, prs]) => prs.map(pr => ({ ...pr, repo })));

  // AI Usage stats for the combined overview
  const aiUsageStats = [
    {
      label: 'Code Generation',
      value: formattedStats.summaryData.code.value,
      percentage: formattedStats.summaryData.code.percentage,
      icon: <Code color="primary" />,
      color: 'primary' as const
    },
    {
      label: 'Test Generation',
      value: formattedStats.summaryData.test.value,
      percentage: formattedStats.summaryData.test.percentage,
      icon: <BugReport color="secondary" />,
      color: 'secondary' as const
    },
    {
      label: 'Documentation',
      value: formattedStats.summaryData.docs.value,
      percentage: formattedStats.summaryData.docs.percentage,
      icon: <Description color="success" />,
      color: 'success' as const
    },
    {
      label: 'Code Review',
      value: formattedStats.summaryData.review.value,
      percentage: formattedStats.summaryData.review.percentage,
      icon: <RateReview color="warning" />,
      color: 'warning' as const
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header with Refresh Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="700" color="primary">
          AI Usage Analytics Dashboard
        </Typography>
        <Button
          variant="outlined"
          onClick={handleGetData}
          startIcon={<Refresh />}
          sx={{ fontWeight: '600', borderRadius: 2 }}
        >
          Refresh Data
        </Button>
      </Box>

      <Box display="flex" flexDirection="column">
        <Grid container spacing={3} sx={{ mb: 4}}>
          <Grid item xs={12} md={8} sx={{ flex: 1 }}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom fontWeight="600" color="text.primary" sx={{ mb: 3 }}>
                  AI Usage Overview & Key Metrics
                </Typography>

                <Box display='grid' gridTemplateColumns={'repeat(2, minmax(0, 1fr))'} gap={3}>
                  {aiUsageStats.map((stat, index) => (
                    <Box key={index}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          height: '100%'
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Box display="flex" alignItems="center" gap={1}>
                            {stat.icon}
                            <Typography variant="body1" fontWeight="600" color="text.primary">
                              {stat.label}
                            </Typography>
                          </Box>
                          <Typography variant="h6" fontWeight="700" color={stat.color}>
                            {stat.value}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={2}>
                          <Box sx={{ flex: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={stat.percentage}
                              color={stat.color}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'grey.200'
                              }}
                            />
                          </Box>
                          <Typography variant="body2" fontWeight="600" color="text.secondary">
                            {stat.percentage}%
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" component="h3" gutterBottom fontWeight="600" sx={{ mb: 3 }}>
                  Usage Distribution
                </Typography>
                <Box sx={{
                  height: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UsageChart chartData={formattedStats.chartData} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" component="h2" fontWeight="600" color="text.primary">
                Pull Requests Reviewed by Copilot
              </Typography>
              <Paper
                elevation={1}
                sx={{
                  px: 2,
                  py: 1,
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  borderRadius: 2
                }}
              >
                <Typography variant="body2" fontWeight="600">
                  {allPRs.length} PRs
                </Typography>
              </Paper>
            </Box>
            <Box sx={{
              width: '100%',
              overflowX: 'auto',
              '& .MuiTable-root': {
                minWidth: 800
              }
            }}>
              <PRList pullRequests={allPRs} />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Dashboard;

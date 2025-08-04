import { useDaysRange } from '../context/DaysRangeContext';
import { formatAIUsageStats, useCopilotStats } from '../services/api';
import StatsOverview from './StatsOverview';
import UsageChart from './UsageChart';
import PRList from './PRList';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

const Dashboard = () => {
  const { daysRange } = useDaysRange();
  const { data, isLoading, isError, error } = useCopilotStats(daysRange);

  if (isLoading) {
    return <LoadingSpinner message="Loading Copilot statistics..." />;
  }

  if (isError) {
    return (
      <ErrorDisplay
        message="Error loading Copilot statistics"
        error={error.message ?? 'Unknown error'}
      />
    );
  }

  if (!data) {
    return <div className="text-center py-10">No data available.</div>;
  }

  // Format the data for presentation
  const formattedStats = formatAIUsageStats(data.usageOfAI);

  // Extract PR data for display
  const allPRs = Object.entries(data.pullRequestsReviewedByCopilot)
    .flatMap(([repo, prs]) => prs.map(pr => ({ ...pr, repo })));

  return (
    <div className="dashboard">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">AI Usage Overview</h2>
        <StatsOverview summaryData={formattedStats.summaryData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Usage Distribution</h3>
          <UsageChart chartData={formattedStats.chartData} />
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card">
              <span className="stat-label">Total PRs Reviewed by Copilot</span>
              <span className="stat-value text-blue-400">{formattedStats.summaryData.review.value}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Code Generation Usage</span>
              <span className="stat-value text-blue-400">{formattedStats.summaryData.code.value}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Test Generation Usage</span>
              <span className="stat-value text-teal-400">{formattedStats.summaryData.test.value}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Documentation Usage</span>
              <span className="stat-value text-yellow-400">{formattedStats.summaryData.docs.value}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Pull Requests Reviewed by Copilot</h2>
        <PRList pullRequests={allPRs} />
      </div>
    </div>
  );
};

export default Dashboard;

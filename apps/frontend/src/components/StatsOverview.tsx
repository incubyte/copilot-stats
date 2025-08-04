interface StatItemProps {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

const StatItem = ({ label, value, percentage, color }: StatItemProps) => (
  <div className="stat-item flex justify-between p-3 border-b border-gray-700">
    <span className="font-medium">{label}</span>
    <div>
      <span className={`font-bold ${color} mr-2`}>{value}</span>
      <span className="text-gray-400">({percentage}%)</span>
    </div>
  </div>
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
    <div className="stats-overview card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="total-stats mb-4">
            <h3 className="text-xl font-semibold mb-2">Total AI Usage</h3>
            <div className="text-4xl font-bold text-blue-400">{summaryData.total}</div>
          </div>

          <div className="progress-bars">
            <h4 className="text-lg font-medium mb-2">Distribution</h4>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-3">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: `${summaryData.code.percentage}%` }}
                title={`Code: ${summaryData.code.percentage}%`}
              ></div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-3">
              <div
                className="bg-teal-500 h-4 rounded-full"
                style={{ width: `${summaryData.test.percentage}%` }}
                title={`Test: ${summaryData.test.percentage}%`}
              ></div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-3">
              <div
                className="bg-red-500 h-4 rounded-full"
                style={{ width: `${summaryData.review.percentage}%` }}
                title={`Review: ${summaryData.review.percentage}%`}
              ></div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-3">
              <div
                className="bg-yellow-500 h-4 rounded-full"
                style={{ width: `${summaryData.docs.percentage}%` }}
                title={`Docs: ${summaryData.docs.percentage}%`}
              ></div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-3">
              <div
                className="bg-purple-500 h-4 rounded-full"
                style={{ width: `${summaryData.other.percentage}%` }}
                title={`Other: ${summaryData.other.percentage}%`}
              ></div>
            </div>
          </div>
        </div>

        <div className="stats-breakdown">
          <h3 className="text-xl font-semibold mb-4">Breakdown</h3>
          <StatItem
            label="Code Generation"
            value={summaryData.code.value}
            percentage={summaryData.code.percentage}
            color="text-blue-400"
          />
          <StatItem
            label="Test Generation"
            value={summaryData.test.value}
            percentage={summaryData.test.percentage}
            color="text-teal-400"
          />
          <StatItem
            label="PR Reviews"
            value={summaryData.review.value}
            percentage={summaryData.review.percentage}
            color="text-red-400"
          />
          <StatItem
            label="Documentation"
            value={summaryData.docs.value}
            percentage={summaryData.docs.percentage}
            color="text-yellow-400"
          />
          <StatItem
            label="Other Usage"
            value={summaryData.other.value}
            percentage={summaryData.other.percentage}
            color="text-purple-400"
          />
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;

import { AIUsageStats, CopilotUsageResponse } from '../services/github.service'
import './CopilotStats.css'

interface CopilotStatsProps {
  data: CopilotUsageResponse
}

const CopilotStats = ({ data }: CopilotStatsProps) => {
  // Add defensive checks to prevent runtime errors
  if (!data) {
    return (
      <div className="copilot-stats">
        <div className="loading">
          <p>No data available</p>
        </div>
      </div>
    )
  }

  const { pullRequestsReviewedByCopilot, usageOfAI } = data

  // Calculate total AI usage across all categories
  const totalAIUsage = Object.values(usageOfAI).reduce((sum, count) => sum + (count || 0), 0)

  // Helper function to calculate percentage
  const getPercentage = (count: number, total: number) => {
    return total > 0 ? ((count / total) * 100).toFixed(1) : '0'
  }

  // AI usage category labels and descriptions
  const aiCategories = [
    { key: 'AI_CODE', label: 'Code Generation', description: 'AI assisted code writing', color: '#4ade80' },
    { key: 'AI_TEST', label: 'Code Review', description: 'AI assisted test generation', color: '#3b82f6' },
    { key: 'AI_REVIEW', label: 'Code Review', description: 'AI assisted code review', color: '#3b82f6' },
    { key: 'AI_DOCS', label: 'Documentation', description: 'AI assisted documentation', color: '#f59e0b' },
    { key: 'AI_OTHER', label: 'Other Usage', description: 'Other AI assistance', color: '#8b5cf6' },
  ]

  return (
    <div className="copilot-stats">
      <div className="stats-overview">
        <h2>Overview</h2>
        <div className="overview-cards">
          <div className="stat-card">
            <h3>Total PRs with Copilot Reviews</h3>
            <span className="stat-number">{pullRequestsReviewedByCopilot.total}</span>
          </div>
          <div className="stat-card">
            <h3>Total AI Usage Instances</h3>
            <span className="stat-number">{totalAIUsage}</span>
          </div>
        </div>
      </div>

      <div className="ai-usage-breakdown">
        <h2>AI Usage Breakdown</h2>
        <div className="usage-categories">
          {aiCategories.map(({ key, label, description, color }) => {
            const count = usageOfAI[key as keyof AIUsageStats]
            const percentage = getPercentage(count, totalAIUsage)

            return (
              <div key={key} className="category-card">
                <div className="category-header">
                  <div
                    className="category-indicator"
                    style={{ backgroundColor: color }}
                  ></div>
                  <h3>{label}</h3>
                </div>
                <p className="category-description">{description}</p>
                <div className="category-stats">
                  <span className="count">{count}</span>
                  <span className="percentage">({percentage}%)</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: color
                    }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="pull-requests-list">
        <h2>Pull Requests with Copilot Reviews ({pullRequestsReviewedByCopilot.total})</h2>
        {pullRequestsReviewedByCopilot.pulls.length === 0 ? (
          <p className="no-data">No pull requests found with Copilot reviews in the selected time range.</p>
        ) : (
          <div className="pr-list">
            {pullRequestsReviewedByCopilot.pulls.map((pr) => (
              <div key={`${pr.repo}-${pr.number}`} className="pr-card">
                <div className="pr-header">
                  <h3>
                    <a href={pr.copilot_review.url} target="_blank" rel="noopener noreferrer">
                      #{pr.number}: {pr.title}
                    </a>
                  </h3>
                  <span className="pr-repo">{pr.repo}</span>
                </div>

                <div className="pr-meta">
                  <span className="pr-author">By: {pr.author}</span>
                  <span className="pr-date">
                    Closed: {new Date(pr.closed_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="ai-usage-tags">
                  <span className="tags-label">AI Usage:</span>
                  {aiCategories.map(({ key, label, color }) => (
                    pr.ai_usage[key as keyof AIUsageStats] > 0 && (
                      <span
                        key={key}
                        className="usage-tag"
                        style={{ backgroundColor: color }}
                      >
                        {label}
                      </span>
                    )
                  ))}
                  {Object.values(pr.ai_usage).every(val => val === 0) && (
                    <span className="usage-tag no-usage">No AI usage detected</span>
                  )}
                </div>

                <div className="copilot-review-info">
                  <strong>Copilot Review by:</strong> {pr.copilot_review.login}
                  {pr.copilot_review.body && (
                    <div className="review-body">
                      <details>
                        <summary>View Review</summary>
                        <p>{pr.copilot_review.body}</p>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CopilotStats

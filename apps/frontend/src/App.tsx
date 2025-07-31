import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCopilotUsageStats } from './services/github.service'
import CopilotStats from './components/CopilotStats'
import './App.css'

function App() {
  const [daysRange, setDaysRange] = useState<number>(7)

  // Using TanStack Query to fetch copilot usage stats
  const {
    data: copilotStats,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['copilot-stats', daysRange],
    queryFn: () => getCopilotUsageStats(daysRange),
    enabled: true, // Auto-fetch on mount
  })

  const handleDaysRangeChange = (newRange: number) => {
    setDaysRange(newRange)
  }

  const handleRefresh = () => {
    refetch()
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>GitHub Copilot Usage Statistics</h1>
        <p>Track AI usage patterns in your pull requests</p>
      </header>

      <main className="App-main">
        <div className="controls">
          <div className="days-selector">
            <label htmlFor="days-range">Days to analyze:</label>
            <select
              id="days-range"
              value={daysRange}
              onChange={(e) => handleDaysRangeChange(Number(e.target.value))}
            >
              <option value={1}>Last 1 day</option>
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
            </select>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="refresh-btn"
          >
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
          </div>

        {error && (
          <div className="error">
            <h3>Error loading data:</h3>
            <p>{error.message}</p>
          </div>
        )}

        {isLoading && (
          <div className="loading">
            <p>Loading Copilot statistics...</p>
          </div>
        )}

        {copilotStats && !isLoading && (
          <CopilotStats data={copilotStats} />
        )}
      </main>
    </div>
  )
}

export default App

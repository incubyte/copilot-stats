/**
 * API service to handle communication with the backend
 */

import { useQuery } from '@tanstack/react-query';

// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Types based on the backend response
export interface AIUsageStats {
  code: number;
  test: number;
  review: number;
  docs: number;
  other: number;
}

export interface CopilotReview {
  login: string;
  type: string;
  body: string;
  url: string;
}

export interface PullRequest {
  number: number;
  title: string;
  author: string;
  closed_at: string;
  repo: string;
  ai_usage: AIUsageStats;
  copilot_review: CopilotReview;
}

export interface CopilotUsageResponse {
  pullRequestsReviewedByCopilot: Record<string, PullRequest[]>;
  usageOfAI: AIUsageStats;
}

/**
 * Custom hook to subscribe to Copilot usage statistics SSE endpoint
 * @param daysRange - Number of days to look back for stats
 * @returns Query result with the statistics data
 */
export function useCopilotStats(daysRange: number) {
  return useQuery<CopilotUsageResponse>({
    queryKey: ['copilot-stats', daysRange],
    queryFn: () => {
      return new Promise<CopilotUsageResponse>((resolve, reject) => {
        // Create a new EventSource connection to the backend SSE endpoint - now using absolute URL
        const eventSource = new EventSource(`${API_BASE_URL}/github/copilot/usage?daysRange=${daysRange}`);

        // Handle incoming SSE messages
        eventSource.onmessage = (event) => {
          try {
            // Skip if it's the close message
            if (event.data === 'close') {
              eventSource.close();
              return;
            }

            // Parse the JSON data from the event
            const data = JSON.parse(event.data) as CopilotUsageResponse;
            resolve(data);

            // Close the connection after receiving the data
            eventSource.close();
          } catch (error) {
            console.error('Error parsing SSE data:', error);
            eventSource.close();
            reject(error);
          }
        };

        // Handle errors in the SSE connection
        eventSource.onerror = (error) => {
          console.error('SSE connection error:', error);
          eventSource.close();
          reject(new Error('Failed to connect to SSE endpoint'));
        };

        // Cleanup function to close the connection if the component unmounts
        return () => {
          eventSource.close();
        };
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Formats and processes raw statistics for UI presentation
 * @param stats - Raw AI usage statistics
 * @returns Formatted stats for UI presentation
 */
export function formatAIUsageStats(stats: AIUsageStats) {
  const total = Object.values(stats).reduce((sum, value) => sum + value, 0);

  return {
    chartData: {
      labels: ['Code Generation', 'Test Generation', 'Reviews', 'Documentation', 'Other'],
      datasets: [
        {
          label: 'AI Usage Distribution',
          data: [stats.code, stats.test, stats.review, stats.docs, stats.other],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',  // Blue for code
            'rgba(75, 192, 192, 0.6)',  // Teal for test
            'rgba(255, 99, 132, 0.6)',  // Red for review
            'rgba(255, 206, 86, 0.6)',  // Yellow for docs
            'rgba(153, 102, 255, 0.6)', // Purple for other
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    summaryData: {
      total,
      code: { value: stats.code, percentage: total ? Math.round((stats.code / total) * 100) : 0 },
      test: { value: stats.test, percentage: total ? Math.round((stats.test / total) * 100) : 0 },
      review: { value: stats.review, percentage: total ? Math.round((stats.review / total) * 100) : 0 },
      docs: { value: stats.docs, percentage: total ? Math.round((stats.docs / total) * 100) : 0 },
      other: { value: stats.other, percentage: total ? Math.round((stats.other / total) * 100) : 0 },
    },
  };
}

import axios from 'axios'

// Get backend URL from environment variable or fallback to default
const VITE_BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL

// Configure axios instance with base URL for your backend
const api = axios.create({
  baseURL: VITE_BACKEND_BASE_URL,
  timeout: 120000, // 2 minutes - good balance for GitHub API operations
})

// Types for the API response based on your backend service
export interface AIUsageStats {
  AI_CODE: number
  AI_REVIEW: number
  AI_DOCS: number
  AI_OTHER: number
}

export interface PullRequestData {
  number: number
  title: string
  author: string
  closed_at: string
  repo: string
  ai_usage: AIUsageStats
  copilot_review: {
    login: string
    type: string
    body: string
    url: string
  }
}

export interface CopilotUsageResponse {
  pullRequestsReviewedByCopilot: {
    pulls: PullRequestData[]
    total: number
  }
  usageOfAI: AIUsageStats
}

/**
 * Fetch Copilot usage statistics from the backend
 * @param daysRange - Number of days to look back for PR analysis
 * @returns Promise with copilot usage data
 */
export const getCopilotUsageStats = async (daysRange: number = 7): Promise<CopilotUsageResponse> => {
  try {
    const response = await api.get<CopilotUsageResponse>('/github/copilot/usage', {
      params: { daysRange }
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch copilot stats: ${error.response?.data?.message || error.message}`)
    }
    throw new Error('An unexpected error occurred while fetching copilot stats')
  }
}

/**
 * Test endpoint to verify backend connection
 * @returns Promise with current GitHub user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/github/user')
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch user: ${error.response?.data?.message || error.message}`)
    }
    throw new Error('An unexpected error occurred while fetching user data')
  }
}

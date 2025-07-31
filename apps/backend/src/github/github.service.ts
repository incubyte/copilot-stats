import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from "octokit";
import { isBefore, isEqual, subDays } from "date-fns";

// Interface for AI usage statistics
interface AIUsageStats {
  code: number;       // Code generation
  test: number;       // Test generation
  review: number;     // PRs reviewed by Copilot
  docs: number;       // Documentation
  other: number;      // Other usage
}

// Interface for the response payload
interface CopilotUsageResponse {
  pullRequestsReviewedByCopilot: any[];
  usageOfAI: AIUsageStats;
}

@Injectable()
export class GitHubService {
  private readonly logger = new Logger(GitHubService.name);
  private readonly octokit: Octokit;
  private readonly org: string;

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('GITHUB_TOKEN');
    this.org = this.configService.get<string>('GITHUB_ORG')!;

    if (!token) {
      throw new Error('GITHUB_TOKEN is required');
    }
    if (!this.org) {
      throw new Error('GITHUB_ORG is required');
    }

    this.octokit = new Octokit({
      auth: token,
      userAgent: 'copilot-stats-app',
    });

    this.logger.log(`GitHub service initialized for organization: ${this.org}`);
  }

  public async getCopilotUsageStats(daysRange: number | undefined): Promise<CopilotUsageResponse> {
    this.logger.log(`Fetching Copilot usage stats for org: ${this.org}`);

    const repoNames = this.configService.get<string>('GITHUB_REPOS')
    if (!repoNames) {
      throw new Error('GITHUB_REPOS is required');
    }

    const repos = repoNames.split(',').map(repo => repo.trim());
    const pullRequests: any = {};
    const aiUsageStats: AIUsageStats = {
      code: 0,
      review: 0,
      docs: 0,
      other: 0,
      test: 0
    };

    try {
      for (let repo of repos) {
        const pulls: any[] = await this.getPullRequestsForRepo(repo, daysRange);
        this.logger.log(`Found ${pulls.length} pull requests in ${repo} for the last ${daysRange || 1} days`);
        pullRequests[repo] = []

        for (const pr of pulls) {
          // Analyze PR description for AI usage patterns
          const prAIUsage = this.analyzeAIUsageInPR(pr.body || '');
          this.updateAIUsageStats(aiUsageStats, prAIUsage);

          this.logger.log(`Fetching reviews for PR #${pr.number} in ${repo}`);
          const { data } : { data: any[] } = await this.octokit.request(`GET /repos/${this.org}/${repo}/pulls/${pr.number}/reviews`, {
            owner: this.org,
            repo: repo,
            pull_number: pr.number,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          });

          const copilotReview = data.find((review: any) => review.user?.login?.includes('copilot'));
          if (!copilotReview)
            continue;

          aiUsageStats.review++;
          pullRequests[repo].push({
            number: pr.number,
            title: pr.title,
            author: pr.user.login,
            closed_at: pr.closed_at,
            repo: repo,
            ai_usage: prAIUsage,
            copilot_review: {
              login: copilotReview.user.login,
              type: copilotReview.user.type,
              body: copilotReview.body,
              url: copilotReview.html_url,
            }
          });
        }
      }

      return {
        pullRequestsReviewedByCopilot: pullRequests,
        usageOfAI: aiUsageStats,
      };
    } catch (error) {
      this.logger.error('Error fetching Copilot usage stats:', error.message);
      throw error;
    }
  }

  /**
   * Analyzes PR description/body for AI usage patterns
   * Looks for the AI_USAGE_START/END block and extracts checked categories
   * @param prBody - The PR description/body text
   * @returns Object with boolean flags for each AI usage category
   */
  private analyzeAIUsageInPR(prBody: string): AIUsageStats {
    const aiUsage: AIUsageStats = {
      code: 0,
      test: 0,
      docs: 0,
      other: 0,
      review: 0
    };

    // Extract the AI usage block using regex
    const aiUsageBlockRegex = /<!-- AI_USAGE_START -->(.*?)<!-- AI_USAGE_END -->/s;
    const match = prBody.match(aiUsageBlockRegex);

    if (!match) {
      this.logger.debug('No AI usage block found in PR description');
      return aiUsage;
    }

    const aiUsageContent = match[1];
    this.logger.debug(`Found AI usage block: ${aiUsageContent.trim()}`);

    // Check for each category with checked boxes [x]
    const patterns = {
      code: /- \[x] AI_CODE:/i,
      test: /- \[x] AI_TEST:/i,
      docs: /- \[x] AI_DOCS:/i,
      others: /- \[x] AI_OTHER:/i,
    };

    // Test each pattern against the AI usage content
    for (const [category, pattern] of Object.entries(patterns)) {
      if (pattern.test(aiUsageContent)) {
        aiUsage[category as keyof AIUsageStats] = 1;
        this.logger.debug(`Found checked category: ${category}`);
      }
    }

    return aiUsage;
  }

  /**
   * Updates the cumulative AI usage statistics
   * @param totalStats - The cumulative stats object to update
   * @param prStats - The stats from a single PR to add
   */
  private updateAIUsageStats(totalStats: AIUsageStats, prStats: AIUsageStats): void {
    totalStats.code += prStats.code;
    totalStats.test += prStats.test;
    totalStats.review += prStats.review;
    totalStats.docs += prStats.docs;
    totalStats.other += prStats.other;
  }

  /**
   * Get the current authenticated user info (for debugging)
   */
  public async getCurrentUser() {
    try {
      const response = await this.octokit.rest.users.getAuthenticated();
      this.logger.log(`Authenticated as: ${response.data.login}`);
      return response.data;
    } catch (error: any) {
      this.logger.error('Failed to get current user:', error.message);
      throw new Error(`GitHub API Error: ${error.message}`);
    }
  }

  /**
   * Get pull requests for a specific repository
   * @param {string} repo - The repository name
   * @param {number} daysRange - last x days to fetch pull requests for
   */
  private async getPullRequestsForRepo(repo: string, daysRange: number = 1) {
    const pullRequests: any[] = []
    const endDate = subDays(new Date(), daysRange);
    try {
      while (true) {
        const { data: pulls } : { data: any[] } = await this.octokit.request(`GET /repos/${this.org}/${repo}/pulls`, {
          owner: this.org,
          repo: repo,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          },
          state: 'closed',
          sort: 'created',
          direction: 'desc',
          page: 1,
          per_page: 10
        })

        pullRequests.push(...pulls)

        const endDateReached = pulls.some(pr => {
          const closedDate = new Date(pr.closed_at);
          return isBefore(closedDate, endDate) || isEqual(closedDate, endDate);
        });

        if (endDateReached || pulls.length === 0)
          break
      }

      return pullRequests
    } catch (error: any) {
      this.logger.error(`Failed to fetch pull requests for ${repo}:`, error.message);
      throw new Error(`GitHub API Error: ${error.message}`);
    }
  }
}

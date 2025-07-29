import { Controller, Get, Param, Query } from '@nestjs/common';
import { GitHubService } from './github.service';

@Controller('github')
export class GitHubController {
  constructor(private readonly githubService: GitHubService) {}

  /**
   * Test endpoint to verify GitHub API connection
   * GET /github/user
   */
  @Get('user')
  async getCurrentUser(): Promise<any> {
    return this.githubService.getCurrentUser();
  }

  /**
   * Fetch Copilot usage metrics for the organization
   * GET /github/copilot/usage?since=2024-12-01&until=2025-01-01
   */
  @Get('copilot/usage')
  async getCopilotUsage(
    @Query('since') since?: string,
    @Query('until') until?: string,
  ): Promise<any[]> {
    return this.githubService.getCopilotUsageMetrics(since, until);
  }

  /**
   * Fetch Copilot seat information
   * GET /github/copilot/seats
   */
  @Get('copilot/seats')
  async getCopilotSeats(): Promise<any> {
    return this.githubService.getCopilotSeats();
  }

  /**
   * Fetch pull requests for a repository
   * GET /github/repos/my-repo/pulls?since=2024-12-01
   */
  @Get('repos/:repo/pulls')
  async getPullRequests(
    @Param('repo') repo: string,
    @Query('since') since?: string,
  ): Promise<any[]> {
    return this.githubService.getPullRequestsForRepo(repo, since);
  }

  /**
   * Fetch reviews for a specific pull request
   * GET /github/repos/my-repo/pulls/123/reviews
   */
  @Get('repos/:repo/pulls/:pullNumber/reviews')
  async getPullRequestReviews(
    @Param('repo') repo: string,
    @Param('pullNumber') pullNumber: number,
  ): Promise<any[]> {
    return this.githubService.getPullRequestReviews(repo, pullNumber);
  }

  /**
   * Get a summary of Copilot metrics for the last 28 days (API limit)
   * GET /github/copilot/summary
   */
  @Get('copilot/summary')
  async getCopilotSummary(): Promise<any> {
    return this.githubService.getCopilotSummary();
  }
}

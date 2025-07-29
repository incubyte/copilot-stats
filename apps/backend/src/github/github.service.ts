import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from "octokit";

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

  /**
   * Fetch Copilot usage metrics for the organization
   * Based on: https://docs.github.com/en/rest/copilot/copilot-metrics?apiVersion=2022-11-28
   */
  async getCopilotUsageMetrics() {
    try {
      this.logger.log('Fetching Copilot usage metrics...');

      const params: any = {
        org: this.org,
        per_page: 100,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      };

      // Get usage metrics for the organization
      const response =
        await this.octokit.request(`GET /orgs/${this.org}/copilot/metrics`, params);

      this.logger.log(
        `Successfully fetched Copilot usage metrics. Total records: ${response.data.length}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        'Failed to fetch Copilot usage metrics:',
        error.message,
      );
      throw new Error(`GitHub API Error: ${error.message}`);
    }
  }

  /**
   * Fetch Copilot seat information for the organization
   */
  async getCopilotSeats() {
    try {
      this.logger.log('Fetching Copilot seat information...');

      const response = await this.octokit.rest.copilot.listCopilotSeats({
        org: this.org,
        per_page: 100,
      });

      this.logger.log(
        `Successfully fetched Copilot seats. Total seats: ${response.data.total_seats}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        'Failed to fetch Copilot seat information:',
        error.message,
      );
      throw new Error(`GitHub API Error: ${error.message}`);
    }
  }

  /**
   * Fetch pull requests for a specific repository to analyze Copilot reviewer usage
   */
  async getPullRequestsForRepo(repo: string, since?: string) {
    try {
      this.logger.log(`Fetching pull requests for repository: ${repo}`);

      const params: any = {
        owner: this.org,
        repo: repo,
        state: 'all',
        per_page: 100,
        sort: 'updated',
        direction: 'desc',
      };

      // Filter by date if provided
      if (since) {
        params.since = since;
      }

      const response = await this.octokit.rest.pulls.list(params);

      this.logger.log(
        `Successfully fetched ${response.data.length} pull requests for ${repo}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch pull requests for ${repo}:`,
        error.message,
      );
      throw new Error(`GitHub API Error: ${error.message}`);
    }
  }

  /**
   * Fetch reviews for a specific pull request to check if Copilot was used as reviewer
   */
  async getPullRequestReviews(repo: string, pullNumber: number) {
    try {
      this.logger.log(`Fetching reviews for PR #${pullNumber} in ${repo}`);

      const response = await this.octokit.rest.pulls.listReviews({
        owner: this.org,
        repo: repo,
        pull_number: pullNumber,
      });

      this.logger.log(
        `Found ${response.data.length} reviews for PR #${pullNumber}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch reviews for PR #${pullNumber}:`,
        error.message,
      );
      throw new Error(`GitHub API Error: ${error.message}`);
    }
  }

  /**
   * Get the current authenticated user info (for debugging)
   */
  async getCurrentUser() {
    try {
      const response = await this.octokit.rest.users.getAuthenticated();
      this.logger.log(`Authenticated as: ${response.data.login}`);
      return response.data;
    } catch (error: any) {
      this.logger.error('Failed to get current user:', error.message);
      throw new Error(`GitHub API Error: ${error.message}`);
    }
  }

  getCopilotSummary() {
    throw new Error('Not implemented yet');
  }
}

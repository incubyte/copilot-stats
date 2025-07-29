import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from "octokit";
import { isBefore, isEqual, subDays } from "date-fns";

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

  public async getCopilotUsageStats(daysRange: number | undefined) {
    this.logger.log(`Fetching Copilot usage stats for org: ${this.org}`);

    const repoNames = this.configService.get<string>('GITHUB_REPOS')
    if (!repoNames) {
      throw new Error('GITHUB_REPOS is required');
    }

    const repos = repoNames.split(',').map(repo => repo.trim());
    const pullRequests: any[] = [];
    try {
      for (let repo of repos) {
        const pulls: any[] = await this.getPullRequestsForRepo(repo, daysRange);
        this.logger.log(`Found ${pulls.length} pull requests in ${repo} for the last ${daysRange || 1} days`);

        for (const pr of pulls) {
          this.logger.log(`Fetching reviews for PR #${pr.number} in ${repo}`);
          const { data } : { data: any[] } = await this.octokit.request(`GET /repos/${this.org}/${repo}/pulls/${pr.number}/reviews`, {
            owner: 'OWNER',
            repo: 'REPO',
            pull_number: 'PULL_NUMBER',
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          })

          const copilotReview = data.find((review: any) => review.user?.login?.includes('copilot'));
          if (!copilotReview)
            continue;

          pullRequests.push({
            number: pr.number,
            title: pr.title,
            author: pr.user.login,
            closed_at: pr.closed_at,
            copilot_review: {
              login: copilotReview.user.login,
              type: copilotReview.user.type,
              body: copilotReview.body,
              url: copilotReview.html_url,
            }
          })
        }
      }

      return {
        pulls: pullRequests,
        total: pullRequests.length,
      };
    } catch (error) {
      this.logger.error('Error fetching Copilot usage stats:', error.message);
      throw error;
    }
  }

  /**
   * Fetch Copilot usage metrics for the organization
   * Based on: https://docs.github.com/en/rest/copilot/copilot-metrics?apiVersion=2022-11-28
   */
  private async _getCopilotUsageMetrics() {
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
          per_page: 28,
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

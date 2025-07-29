import { Controller, Get, Query } from '@nestjs/common';
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

 @Get('copilot/usage')
  async getCopilotUsageStats(
    @Query('daysRange') daysRange?: number,
  ): Promise<any> {
    return this.githubService.getCopilotUsageStats(daysRange);
  }
}

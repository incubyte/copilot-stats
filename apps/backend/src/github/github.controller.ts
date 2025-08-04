import { Controller, Get, MessageEvent, Query, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
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
   * Server-Sent Events endpoint that streams Copilot usage statistics
   * @param daysRange Optional number of days to look back for PR analysis (default: 30)
   * @returns Observable stream of MessageEvent containing usage stats and AI usage analysis
   */
  @Sse('copilot/usage')
  getCopilotUsageStatsSse(
    @Query('daysRange') daysRange?: number,
  ): Observable<MessageEvent> {
    return this.githubService.getCopilotUsageStatsStream(daysRange);
  }
}

import React, { useState } from 'react';
import { format } from 'date-fns';
import { PullRequest } from '../services/api';

interface PRListProps {
  pullRequests: PullRequest[];
}

const PRList = ({ pullRequests }: PRListProps) => {
  const [expandedPR, setExpandedPR] = useState<number | null>(null);

  // Toggle PR expansion
  const toggleExpand = (prNumber: number) => {
    setExpandedPR(expandedPR === prNumber ? null : prNumber);
  };

  if (!pullRequests || pullRequests.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-800 rounded-md">
        <p className="text-gray-400">No pull requests reviewed by Copilot in the selected time period.</p>
      </div>
    );
  }

  return (
    <div className="pr-list">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-md overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                PR #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Repository
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Author
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Closed At
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                AI Usage
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {pullRequests.map((pr) => (
              <React.Fragment key={`${pr.repo}-${pr.number}`}>
                <tr
                  className="hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => toggleExpand(pr.number)}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                    #{pr.number}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {pr.title}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {pr.repo}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {pr.author}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {pr.closed_at ? format(new Date(pr.closed_at), 'MMM d, yyyy') : 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="flex gap-1">
                      {pr.ai_usage.code > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900 text-blue-300">
                          Code
                        </span>
                      )}
                      {pr.ai_usage.test > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-900 text-teal-300">
                          Test
                        </span>
                      )}
                      {pr.ai_usage.docs > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-900 text-yellow-300">
                          Docs
                        </span>
                      )}
                      {pr.ai_usage.other > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-900 text-purple-300">
                          Other
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedPR === pr.number && (
                  <tr className="bg-gray-900">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="pr-details">
                        <h4 className="text-lg font-semibold mb-2">Copilot Review</h4>
                        <div className="review-content bg-gray-800 p-4 rounded mb-3 text-gray-300 whitespace-pre-wrap">
                          {pr.copilot_review.body || 'No review content available.'}
                        </div>
                        <div className="flex justify-end">
                          <a
                            href={pr.copilot_review.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            View on GitHub →
                          </a>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PRList;

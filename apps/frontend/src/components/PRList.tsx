import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  Collapse,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { CalendarToday, ExpandMore, GitHub, Person, SmartToy } from '@mui/icons-material';
import { format } from 'date-fns';
import { formatAIUsageTypes, PullRequest } from '../services/api';

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
      <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
        <SmartToy sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No pull requests reviewed by Copilot
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No activity found in the selected time period.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} elevation={2}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.main' }}>
            <TableCell sx={{ color: 'white', fontWeight: '600', py: 2 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <GitHub fontSize="small" />
                PR #
              </Box>
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: '600', py: 2 }}>
              Title
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: '600', py: 2 }}>
              Repository
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: '600', py: 2 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Person fontSize="small" />
                Author
              </Box>
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: '600', py: 2 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarToday fontSize="small" />
                Closed At
              </Box>
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: '600', py: 2 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <SmartToy fontSize="small" />
                AI Usage
              </Box>
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: '600', py: 2, width: 60 }}>
              Details
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pullRequests.map((pr) => (
            <React.Fragment key={`${pr.repo}-${pr.number}`}>
              <TableRow
                hover
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                  cursor: 'pointer'
                }}
                onClick={() => toggleExpand(pr.number)}
              >
                <TableCell sx={{ py: 2.5, px: 3 }}>
                  <Chip
                    label={`#${pr.number}`}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ fontWeight: '600' }}
                  />
                </TableCell>
                <TableCell sx={{ py: 2.5, px: 3, maxWidth: 300 }}>
                  <Typography
                    variant="body2"
                    fontWeight="500"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {pr.title}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 2.5, px: 3 }}>
                  <Chip
                    label={pr.repo}
                    color="secondary"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ py: 2.5, px: 3 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                      {pr.author.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" fontWeight="500">
                      {pr.author}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 2.5, px: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(pr.closed_at), 'MMM dd, yyyy')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(pr.closed_at), 'HH:mm')}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 2.5, px: 3 }}>
                  <Typography
                    variant="body2"
                    fontWeight="500"
                    color="primary.main"
                  >
                    {formatAIUsageTypes(pr.ai_usage)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 2.5, px: 3 }}>
                  <IconButton
                    size="small"
                    color="primary"
                    sx={{
                      transform: expandedPR === pr.number ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s'
                    }}
                  >
                    <ExpandMore />
                  </IconButton>
                </TableCell>
              </TableRow>

              {/* Expanded Details Row */}
              <TableRow>
                <TableCell
                  colSpan={7}
                  sx={{
                    py: 0,
                    borderBottom: expandedPR === pr.number ? 1 : 0,
                    borderColor: 'divider'
                  }}
                >
                  <Collapse in={expandedPR === pr.number} timeout="auto" unmountOnExit>
                    <Box sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 1, m: 1 }}>
                      <Typography variant="h6" gutterBottom color="primary.main" fontWeight="600">
                        🤖 Copilot Review Details
                      </Typography>

                      <Box display="flex" gap={4} mb={2}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Reviewer
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            <SmartToy fontSize="small" color="info" />
                            <Typography variant="body2" fontWeight={500}>
                              {pr.copilot_review.login}
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Review Type
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {pr.copilot_review.type}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            PR Link
                          </Typography>
                          <Link
                            href={pr.copilot_review.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                          >
                            <GitHub fontSize="small" />
                            View on GitHub
                          </Link>
                        </Box>
                      </Box>

                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Review Comment
                      </Typography>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          backgroundColor: 'white',
                          border: 1,
                          borderColor: 'divider'
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'monospace',
                            fontSize: '0.85rem'
                          }}
                        >
                          {pr.copilot_review.body || 'No review comment provided'}
                        </Typography>
                      </Paper>

                      {/* AI Usage Breakdown */}
                      <Box mt={3}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          AI Usage Breakdown
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          {pr.ai_usage.code > 0 && (
                            <Chip
                              label={`Code: ${pr.ai_usage.code}`}
                              color="primary"
                              size="small"
                            />
                          )}
                          {pr.ai_usage.test > 0 && (
                            <Chip
                              label={`Test: ${pr.ai_usage.test}`}
                              color="secondary"
                              size="small"
                            />
                          )}
                          {pr.ai_usage.review > 0 && (
                            <Chip
                              label={`Review: ${pr.ai_usage.review}`}
                              color="error"
                              size="small"
                            />
                          )}
                          {pr.ai_usage.docs > 0 && (
                            <Chip
                              label={`Docs: ${pr.ai_usage.docs}`}
                              color="warning"
                              size="small"
                            />
                          )}
                          {pr.ai_usage.other > 0 && (
                            <Chip
                              label={`Other: ${pr.ai_usage.other}`}
                              color="info"
                              size="small"
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PRList;

import React from 'react';
import {
  AppBar,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
  Typography
} from '@mui/material';
import { Schedule } from '@mui/icons-material';
import { useDaysRange } from '../context/DaysRangeContext';

const Header = () => {
  const { daysRange, setDaysRange } = useDaysRange();

  const handleChange = (event: SelectChangeEvent<number>) => {
    setDaysRange(Number(event.target.value));
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        mb: 4
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: 'primary.main',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          📊 Copilot Stats Dashboard
        </Typography>

        <Box sx={{ minWidth: 200 }}>
          <FormControl fullWidth size="medium">
            <InputLabel
              id="time-period-label"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&.Mui-focused': { color: 'primary.main' }
              }}
            >
              <Schedule fontSize="small" />
              Time Period
            </InputLabel>
            <Select
              labelId="time-period-label"
              value={daysRange}
              label="Time Period"
              onChange={handleChange}
              sx={{
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                }
              }}
            >
              <MenuItem value={7}>Last 7 days</MenuItem>
              <MenuItem value={14}>Last 14 days</MenuItem>
              <MenuItem value={30}>Last 30 days</MenuItem>
              <MenuItem value={60}>Last 60 days</MenuItem>
              <MenuItem value={90}>Last 90 days</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

import Header from './components/Header'
import Dashboard from './components/Dashboard'
import { DaysRangeProvider } from './context/DaysRangeContext'
import { Box } from '@mui/material'

function App() {
  return (
    <DaysRangeProvider>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header />
        <Box component="main" sx={{ flex: 1 }}>
          <Dashboard />
        </Box>
      </Box>
    </DaysRangeProvider>
  )
}

export default App

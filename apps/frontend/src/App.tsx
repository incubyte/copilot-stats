import Header from './components/Header'
import Dashboard from './components/Dashboard'
import { DaysRangeProvider } from './context/DaysRangeContext'

function App() {
  return (
    <DaysRangeProvider>
      <div className="app-container">
        <Header />
        <main>
          <Dashboard />
        </main>
        <footer className="footer">
          <p>Copilot Stats Dashboard</p>
        </footer>
      </div>
    </DaysRangeProvider>
  )
}

export default App

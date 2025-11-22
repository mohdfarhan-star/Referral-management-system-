import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import ReferralForm from './components/ReferralForm'
import Login from './components/Login'
import Signup from './components/Signup'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [refreshDashboard, setRefreshDashboard] = useState(0)
  const [user, setUser] = useState(null)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for existing authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleSignup = (userData) => {
    // After successful signup, switch to login
    setAuthMode('login')
    // You could also auto-login here if you want
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }

  const handleCandidateAdded = () => {
    // Refresh dashboard when a new candidate is added
    setRefreshDashboard(prev => prev + 1)
    // Switch to dashboard to show the new candidate
    setActiveTab('dashboard')
  }

  // If not authenticated, show login/signup
  if (!isAuthenticated) {
    return (
      <div>
        {authMode === 'login' ? (
          <Login 
            onLogin={handleLogin}
            onSwitchToSignup={() => setAuthMode('signup')}
          />
        ) : (
          <Signup 
            onSignup={handleSignup}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />
      
      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('referral')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'referral'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Refer Candidate
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8">
        {activeTab === 'dashboard' && (
          <Dashboard key={refreshDashboard} />
        )}
        {activeTab === 'referral' && (
          <ReferralForm onCandidateAdded={handleCandidateAdded} />
        )}
      </main>
    </div>
  )
}

export default App

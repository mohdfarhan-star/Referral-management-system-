import React from 'react'

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">
              Candidate Referral System
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-blue-100">
                  Welcome, {user.firstName} {user.lastName}
                </span>
                <button
                  onClick={onLogout}
                  className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <span className="text-blue-100">Welcome to the portal</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

// Main App component - This is the heart of our application
// It handles routing (navigation between different pages) and global setup

import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Import our page components
import LoginPage from './pages/LoginPage.js'
import OTPPage from './pages/OTPPage.js'
import Dashboard from './pages/Dashboard.js'
import Settings from './pages/Settings.js'
import OfflinePage from './pages/OfflinePage.js'

// Import utilities
import { isAuthenticated } from './utils/auth.js'
import { NetworkStatusProvider } from './context/NetworkContext.js'

// Protected Route component - only allows access if user is logged in
function ProtectedRoute({ children }) {
  // Check if user is logged in by looking for JWT token
  return isAuthenticated() 
    ? children 
    : React.createElement(Navigate, { to: "/login", replace: true })
}

// Main App component
function App() {
  return React.createElement(
    NetworkStatusProvider, // Provides network status to all child components
    null,
    React.createElement(
      Router, // Enables routing in our app
      null,
      React.createElement(
        'div', 
        { className: 'min-h-screen bg-gray-50' }, // Full height with light gray background
        
        // Toast notifications container - shows success/error messages
        React.createElement(Toaster, {
          position: 'top-right',
          toastOptions: {
            duration: 3000, // Show for 3 seconds
            style: {
              background: '#363636',
              color: '#fff',
            },
          }
        }),
        
        // Define all our app routes
        React.createElement(
          Routes,
          null,
          // Public routes (no login required)
          React.createElement(Route, { 
            path: "/login", 
            element: React.createElement(LoginPage) 
          }),
          React.createElement(Route, { 
            path: "/otp", 
            element: React.createElement(OTPPage) 
          }),
          React.createElement(Route, { 
            path: "/offline", 
            element: React.createElement(OfflinePage) 
          }),
          
          // Protected routes (login required)
          React.createElement(Route, { 
            path: "/dashboard", 
            element: React.createElement(ProtectedRoute, null,
              React.createElement(Dashboard)
            )
          }),
          React.createElement(Route, { 
            path: "/settings", 
            element: React.createElement(ProtectedRoute, null,
              React.createElement(Settings)
            )
          }),
          
          // Default route - redirect to dashboard or login
          React.createElement(Route, { 
            path: "/", 
            element: React.createElement(Navigate, { 
              to: isAuthenticated() ? "/dashboard" : "/login",
              replace: true 
            })
          }),
          
          // Catch all other routes and redirect to home
          React.createElement(Route, { 
            path: "*", 
            element: React.createElement(Navigate, { 
              to: "/", 
              replace: true 
            })
          })
        )
      )
    )
  )
}

export default App

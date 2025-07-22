// Navigation Component - Main navigation bar
// Shows links to different pages and user actions

import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../utils/auth.js'

function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()

  // Check if current page is active for styling
  function isActivePage(path) {
    return location.pathname === path
  }

  // Handle logout
  function handleLogout() {
    logout()
  }

  return React.createElement(
    'nav',
    {
      className: 'bg-white shadow-sm border-b border-gray-200'
    },
    React.createElement(
      'div',
      {
        className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
      },
      React.createElement(
        'div',
        {
          className: 'flex justify-between h-16'
        },
        // Left side - Logo and main navigation
        React.createElement(
          'div',
          {
            className: 'flex items-center'
          },
          // Logo
          React.createElement(
            'div',
            {
              className: 'flex-shrink-0 flex items-center'
            },
            React.createElement(
              'button',
              {
                onClick: () => navigate('/dashboard'),
                className: 'text-xl font-bold text-blue-600 hover:text-blue-700'
              },
              '💰 ExpenseTracker'
            )
          ),
          
          // Main Navigation Links
          React.createElement(
            'div',
            {
              className: 'hidden md:ml-8 md:flex md:space-x-8'
            },
            // Dashboard Link
            React.createElement(
              'button',
              {
                onClick: () => navigate('/dashboard'),
                className: `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePage('/dashboard') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              },
              '📊 Dashboard'
            ),
            
            // Settings Link
            React.createElement(
              'button',
              {
                onClick: () => navigate('/settings'),
                className: `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePage('/settings') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              },
              '⚙️ Settings'
            )
          )
        ),
        
        // Right side - User actions
        React.createElement(
          'div',
          {
            className: 'flex items-center space-x-4'
          },
          // Logout Button
          React.createElement(
            'button',
            {
              onClick: handleLogout,
              className: 'text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors'
            },
            '🚪 Logout'
          )
        )
      ),
      
      // Mobile Navigation (Hidden by default, you can expand this for mobile menu)
      React.createElement(
        'div',
        {
          className: 'md:hidden px-2 pt-2 pb-3 space-y-1 border-t border-gray-200'
        },
        React.createElement(
          'button',
          {
            onClick: () => navigate('/dashboard'),
            className: `block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActivePage('/dashboard') 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`
          },
          '📊 Dashboard'
        ),
        React.createElement(
          'button',
          {
            onClick: () => navigate('/settings'),
            className: `block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActivePage('/settings') 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`
          },
          '⚙️ Settings'
        )
      )
    )
  )
}

export default Navigation
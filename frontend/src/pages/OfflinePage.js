// Offline Page - Fallback page when user is offline
// This page shows when network is unavailable

import React from 'react'
import { useNavigate } from 'react-router-dom'

function OfflinePage() {
  const navigate = useNavigate()

  // Try to go back to the previous page
  function tryAgain() {
    if (navigator.onLine) {
      navigate(-1) // Go back to previous page
    } else {
      // Still offline, just reload the page
      window.location.reload()
    }
  }

  return React.createElement(
    'div',
    {
      className: 'min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'
    },
    React.createElement(
      'div',
      {
        className: 'max-w-md w-full text-center'
      },
      // Offline Icon
      React.createElement(
        'div',
        {
          className: 'mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-8'
        },
        React.createElement(
          'span',
          {
            className: 'text-4xl'
          },
          '📡'
        )
      ),
      
      // Title
      React.createElement(
        'h1',
        {
          className: 'text-3xl font-bold text-gray-900 mb-4'
        },
        'You\'re Offline'
      ),
      
      // Description
      React.createElement(
        'p',
        {
          className: 'text-gray-600 mb-8'
        },
        'It looks like you\'re not connected to the internet. Please check your connection and try again.'
      ),
      
      // Features available offline
      React.createElement(
        'div',
        {
          className: 'bg-blue-50 p-4 rounded-lg mb-8'
        },
        React.createElement(
          'h3',
          {
            className: 'font-semibold text-blue-900 mb-2'
          },
          'What you can do offline:'
        ),
        React.createElement(
          'ul',
          {
            className: 'text-sm text-blue-700 space-y-1'
          },
          React.createElement(
            'li',
            null,
            '• View recently cached expenses'
          ),
          React.createElement(
            'li',
            null,
            '• Add new expenses (will sync when back online)'
          ),
          React.createElement(
            'li',
            null,
            '• View offline analytics'
          )
        )
      ),
      
      // Action Buttons
      React.createElement(
        'div',
        {
          className: 'space-y-3'
        },
        React.createElement(
          'button',
          {
            onClick: tryAgain,
            className: 'btn-primary w-full'
          },
          'Try Again'
        ),
        React.createElement(
          'button',
          {
            onClick: () => navigate('/dashboard'),
            className: 'btn-secondary w-full'
          },
          'Go to Dashboard (Offline Mode)'
        )
      ),
      
      // Network Status
      React.createElement(
        'div',
        {
          className: 'mt-8 p-3 bg-gray-100 rounded-lg'
        },
        React.createElement(
          'p',
          {
            className: 'text-sm text-gray-600'
          },
          React.createElement(
            'span',
            {
              className: navigator.onLine ? 'text-green-600' : 'text-red-600'
            },
            navigator.onLine ? '🟢 Online' : '🔴 Offline'
          ),
          ' • Network Status'
        )
      )
    )
  )
}

export default OfflinePage
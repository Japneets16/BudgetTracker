// Settings Page - User preferences and app settings
// Includes email reports toggle and other configurations

import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Navigation from '../components/Navigation.js'
import { toggleEmailReports } from '../services/api.js'
import { logout } from '../utils/auth.js'

function Settings() {
  const [emailReportsEnabled, setEmailReportsEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userPreferences, setUserPreferences] = useState({
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    theme: 'light'
  })

  // Load user settings on component mount
  useEffect(() => {
    loadUserSettings()
  }, [])

  // Load user settings from localStorage or API
  function loadUserSettings() {
    // For now, load from localStorage
    // In a real app, you'd fetch from the API
    const savedEmailReports = localStorage.getItem('emailReportsEnabled')
    if (savedEmailReports) {
      setEmailReportsEnabled(JSON.parse(savedEmailReports))
    }

    const savedPreferences = localStorage.getItem('userPreferences')
    if (savedPreferences) {
      setUserPreferences(JSON.parse(savedPreferences))
    }
  }

  // Handle email reports toggle
  async function handleEmailReportsToggle(enabled) {
    setIsLoading(true)
    
    try {
      // Call API to toggle email reports
      await toggleEmailReports(enabled)
      
      // Update local state and storage
      setEmailReportsEnabled(enabled)
      localStorage.setItem('emailReportsEnabled', JSON.stringify(enabled))
      
      toast.success(
        enabled 
          ? 'Monthly email reports enabled!' 
          : 'Monthly email reports disabled!'
      )
    } catch (error) {
      console.error('Error toggling email reports:', error)
      toast.error('Failed to update email report settings')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle preference changes
  function handlePreferenceChange(key, value) {
    const newPreferences = {
      ...userPreferences,
      [key]: value
    }
    setUserPreferences(newPreferences)
    localStorage.setItem('userPreferences', JSON.stringify(newPreferences))
    toast.success('Preferences updated!')
  }

  // Handle data export
  function handleExportAllData() {
    toast.success('Feature coming soon!')
  }

  // Handle data clear
  function handleClearAllData() {
    if (window.confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      // This would call an API to clear user data
      toast.success('Feature coming soon!')
    }
  }

  return React.createElement(
    'div',
    { className: 'min-h-screen bg-gray-50' },
    
    // Navigation
    React.createElement(Navigation),
    
    // Main Content
    React.createElement(
      'div',
      { className: 'max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8' },
      
      // Page Header
      React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-bold leading-7 text-gray-900 sm:text-3xl' },
          '⚙️ Settings'
        ),
        React.createElement(
          'p',
          { className: 'mt-1 text-sm text-gray-600' },
          'Manage your account preferences and app settings'
        )
      ),

      // Settings Sections
      React.createElement(
        'div',
        { className: 'space-y-6' },

        // Email Reports Section
        React.createElement(
          'div',
          { className: 'card' },
          React.createElement(
            'h3',
            { className: 'text-lg font-medium text-gray-900 mb-4' },
            '📧 Email Reports'
          ),
          React.createElement(
            'div',
            { className: 'flex items-center justify-between' },
            React.createElement(
              'div',
              null,
              React.createElement(
                'h4',
                { className: 'text-sm font-medium text-gray-900' },
                'Monthly Email Summary'
              ),
              React.createElement(
                'p',
                { className: 'text-sm text-gray-500' },
                'Receive a monthly summary of your expenses via email'
              )
            ),
            React.createElement(
              'div',
              { className: 'flex items-center' },
              React.createElement(
                'button',
                {
                  onClick: () => handleEmailReportsToggle(!emailReportsEnabled),
                  disabled: isLoading,
                  className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailReportsEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  } ${isLoading ? 'opacity-50' : ''}`
                },
                React.createElement(
                  'span',
                  {
                    className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailReportsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`
                  }
                )
              )
            )
          )
        ),

        // App Preferences Section
        React.createElement(
          'div',
          { className: 'card' },
          React.createElement(
            'h3',
            { className: 'text-lg font-medium text-gray-900 mb-6' },
            '🎨 App Preferences'
          ),
          React.createElement(
            'div',
            { className: 'space-y-6' },

            // Currency Preference
            React.createElement(
              'div',
              null,
              React.createElement(
                'label',
                { className: 'block text-sm font-medium text-gray-700 mb-2' },
                'Currency'
              ),
              React.createElement(
                'select',
                {
                  className: 'input-field max-w-xs',
                  value: userPreferences.currency,
                  onChange: (e) => handlePreferenceChange('currency', e.target.value)
                },
                React.createElement('option', { value: 'USD' }, '🇺🇸 US Dollar (USD)'),
                React.createElement('option', { value: 'EUR' }, '🇪🇺 Euro (EUR)'),
                React.createElement('option', { value: 'GBP' }, '🇬🇧 British Pound (GBP)'),
                React.createElement('option', { value: 'JPY' }, '🇯🇵 Japanese Yen (JPY)')
              )
            ),

            // Date Format Preference
            React.createElement(
              'div',
              null,
              React.createElement(
                'label',
                { className: 'block text-sm font-medium text-gray-700 mb-2' },
                'Date Format'
              ),
              React.createElement(
                'select',
                {
                  className: 'input-field max-w-xs',
                  value: userPreferences.dateFormat,
                  onChange: (e) => handlePreferenceChange('dateFormat', e.target.value)
                },
                React.createElement('option', { value: 'MM/DD/YYYY' }, 'MM/DD/YYYY (US)'),
                React.createElement('option', { value: 'DD/MM/YYYY' }, 'DD/MM/YYYY (EU)'),
                React.createElement('option', { value: 'YYYY-MM-DD' }, 'YYYY-MM-DD (ISO)')
              )
            ),

            // Theme Preference
            React.createElement(
              'div',
              null,
              React.createElement(
                'label',
                { className: 'block text-sm font-medium text-gray-700 mb-2' },
                'Theme'
              ),
              React.createElement(
                'select',
                {
                  className: 'input-field max-w-xs',
                  value: userPreferences.theme,
                  onChange: (e) => handlePreferenceChange('theme', e.target.value)
                },
                React.createElement('option', { value: 'light' }, '☀️ Light'),
                React.createElement('option', { value: 'dark' }, '🌙 Dark'),
                React.createElement('option', { value: 'auto' }, '⚡ Auto')
              )
            )
          )
        ),

        // Data Management Section
        React.createElement(
          'div',
          { className: 'card' },
          React.createElement(
            'h3',
            { className: 'text-lg font-medium text-gray-900 mb-6' },
            '💾 Data Management'
          ),
          React.createElement(
            'div',
            { className: 'space-y-4' },

            // Export Data
            React.createElement(
              'div',
              { className: 'flex items-center justify-between p-4 border border-gray-200 rounded-lg' },
              React.createElement(
                'div',
                null,
                React.createElement(
                  'h4',
                  { className: 'text-sm font-medium text-gray-900' },
                  'Export All Data'
                ),
                React.createElement(
                  'p',
                  { className: 'text-sm text-gray-500' },
                  'Download all your expenses and budgets as a backup'
                )
              ),
              React.createElement(
                'button',
                {
                  onClick: handleExportAllData,
                  className: 'btn-secondary'
                },
                '📤 Export'
              )
            ),

            // Clear Data
            React.createElement(
              'div',
              { className: 'flex items-center justify-between p-4 border border-red-200 rounded-lg' },
              React.createElement(
                'div',
                null,
                React.createElement(
                  'h4',
                  { className: 'text-sm font-medium text-red-900' },
                  'Clear All Data'
                ),
                React.createElement(
                  'p',
                  { className: 'text-sm text-red-600' },
                  'Permanently delete all expenses, budgets, and settings'
                )
              ),
              React.createElement(
                'button',
                {
                  onClick: handleClearAllData,
                  className: 'px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100'
                },
                '🗑️ Clear Data'
              )
            )
          )
        ),

        // Account Section
        React.createElement(
          'div',
          { className: 'card' },
          React.createElement(
            'h3',
            { className: 'text-lg font-medium text-gray-900 mb-6' },
            '👤 Account'
          ),
          React.createElement(
            'div',
            { className: 'space-y-4' },

            // Account Info
            React.createElement(
              'div',
              { className: 'p-4 bg-gray-50 rounded-lg' },
              React.createElement(
                'h4',
                { className: 'text-sm font-medium text-gray-900 mb-2' },
                'Account Information'
              ),
              React.createElement(
                'p',
                { className: 'text-sm text-gray-600' },
                'Email: demo@example.com'
              ),
              React.createElement(
                'p',
                { className: 'text-sm text-gray-600' },
                'Member since: January 2024'
              )
            ),

            // Logout Button
            React.createElement(
              'button',
              {
                onClick: logout,
                className: 'w-full btn-secondary text-red-600 border-red-300 hover:bg-red-50'
              },
              '🚪 Sign Out'
            )
          )
        ),

        // App Information
        React.createElement(
          'div',
          { className: 'card' },
          React.createElement(
            'h3',
            { className: 'text-lg font-medium text-gray-900 mb-4' },
            'ℹ️ App Information'
          ),
          React.createElement(
            'div',
            { className: 'text-sm text-gray-600 space-y-2' },
            React.createElement(
              'p',
              null,
              'Smart Expense Tracker v1.0.0'
            ),
            React.createElement(
              'p',
              null,
              'Built with React, Tailwind CSS, and ❤️'
            ),
            React.createElement(
              'p',
              null,
              'PWA enabled - Install this app for the best experience!'
            )
          )
        )
      )
    )
  )
}

export default Settings
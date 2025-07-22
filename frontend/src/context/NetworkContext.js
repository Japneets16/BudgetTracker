// Network Context - Manages online/offline status for PWA
// This helps us show offline banners and handle network changes

import React, { createContext, useContext, useState, useEffect } from 'react'

// Create context to share network status across components
const NetworkContext = createContext()

/**
 * Hook to use network status in any component
 * @returns {Object} { isOnline: boolean, showOfflineBanner: boolean }
 */
export function useNetwork() {
  const context = useContext(NetworkContext)
  if (!context) {
    throw new Error('useNetwork must be used within NetworkStatusProvider')
  }
  return context
}

/**
 * Provider component that wraps the app and provides network status
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function NetworkStatusProvider({ children }) {
  // Track if user is currently online
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  
  // Track if we should show the offline banner
  const [showOfflineBanner, setShowOfflineBanner] = useState(false)

  useEffect(() => {
    // Function to handle when user goes online
    function handleOnline() {
      console.log('User came back online')
      setIsOnline(true)
      setShowOfflineBanner(false)
    }

    // Function to handle when user goes offline
    function handleOffline() {
      console.log('User went offline')
      setIsOnline(false)
      setShowOfflineBanner(true)
    }

    // Listen for online/offline events
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cleanup listeners when component unmounts
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Value object that will be shared with all child components
  const value = {
    isOnline,
    showOfflineBanner,
    // Function to manually hide offline banner
    hideOfflineBanner: () => setShowOfflineBanner(false)
  }

  return React.createElement(
    NetworkContext.Provider,
    { value },
    children,
    // Offline banner component
    showOfflineBanner && React.createElement(OfflineBanner)
  )
}

/**
 * Offline Banner component - shows when user is offline
 */
function OfflineBanner() {
  return React.createElement(
    'div',
    {
      className: 'fixed top-0 left-0 right-0 bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm font-medium z-50'
    },
    React.createElement(
      'span',
      null,
      '⚠️ You are currently offline. Some features may not work properly.'
    )
  )
}
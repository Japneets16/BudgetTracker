// This is the main entry point of our React application
// It's like the starting point where everything begins

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import './index.css'

// Create the root element where our entire app will be rendered
// The 'root' div is defined in index.html
const root = ReactDOM.createRoot(document.getElementById('root'))

// Render our main App component into the root element
// React.StrictMode helps us catch bugs during development
root.render(
  React.createElement(React.StrictMode, null,
    React.createElement(App, null)
  )
)

// Register Service Worker for PWA functionality
// This enables offline support and caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}

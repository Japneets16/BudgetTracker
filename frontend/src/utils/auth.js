// Authentication utility functions
// These functions help us manage user login state and JWT tokens

// Key name for storing JWT token in browser's localStorage
const TOKEN_KEY = 'expense_tracker_token'

/**
 * Check if user is currently logged in
 * @returns {boolean} true if user has valid token, false otherwise
 */
export function isAuthenticated() {
  // Get the token from localStorage
  const token = localStorage.getItem(TOKEN_KEY)
  
  // If no token exists, user is not logged in
  if (!token) {
    return false
  }
  
  // TODO: Add token expiration check here if needed
  // For now, we just check if token exists
  return true
}

/**
 * Save JWT token to localStorage after successful login
 * @param {string} token - The JWT token received from backend
 */
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * Get the stored JWT token
 * @returns {string|null} JWT token or null if not found
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Remove token from localStorage (logout user)
 */
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Logout user by removing token and redirecting to login
 */
export function logout() {
  removeToken()
  // Redirect to login page
  window.location.href = '/login'
}
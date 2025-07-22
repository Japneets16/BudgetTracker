// API service for making HTTP requests to our backend
// This file centralizes all API calls and handles authentication

import axios from 'axios'
import { getToken, removeToken } from '../utils/auth.js'
import toast from 'react-hot-toast'

// Base URL for our backend API
// Change this to your actual backend URL
const BASE_URL = 'http://localhost:3000/api'

// Create axios instance with default configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor - runs before every API call
// Automatically adds JWT token to requests if user is logged in
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      // Add Authorization header with Bearer token
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - runs after every API response
// Handles common errors like unauthorized access
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // If we get 401 (Unauthorized), token might be expired
    if (error.response?.status === 401) {
      removeToken() // Remove invalid token
      window.location.href = '/login' // Redirect to login
      toast.error('Session expired. Please login again.')
    }
    return Promise.reject(error)
  }
)

// AUTH ENDPOINTS
// ============================================

/**
 * Login user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} API response
 */
export const login = (email, password) => {
  return api.post('/auth/login', { email, password })
}

/**
 * Verify OTP code after login
 * @param {string} email - User's email
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise} API response
 */
export const verifyOTP = (email, otp) => {
  return api.post('/auth/verify-otp', { email, otp })
}

// EXPENSE ENDPOINTS
// ============================================

/**
 * Get all expenses with optional filters
 * @param {Object} params - Query parameters (search, category, etc.)
 * @returns {Promise} API response
 */
export const getExpenses = (params = {}) => {
  return api.get('/expenses', { params })
}

/**
 * Create a new expense
 * @param {Object} expenseData - Expense details
 * @returns {Promise} API response
 */
export const createExpense = (expenseData) => {
  return api.post('/expenses', expenseData)
}

/**
 * Update an existing expense
 * @param {string} id - Expense ID
 * @param {Object} expenseData - Updated expense details
 * @returns {Promise} API response
 */
export const updateExpense = (id, expenseData) => {
  return api.put(`/expenses/${id}`, expenseData)
}

/**
 * Delete an expense
 * @param {string} id - Expense ID
 * @returns {Promise} API response
 */
export const deleteExpense = (id) => {
  return api.delete(`/expenses/${id}`)
}

// BUDGET ENDPOINTS
// ============================================

/**
 * Get all budgets
 * @returns {Promise} API response
 */
export const getBudgets = () => {
  return api.get('/budgets')
}

/**
 * Create a new budget
 * @param {Object} budgetData - Budget details
 * @returns {Promise} API response
 */
export const createBudget = (budgetData) => {
  return api.post('/budgets', budgetData)
}

/**
 * Update a budget
 * @param {string} id - Budget ID
 * @param {Object} budgetData - Updated budget details
 * @returns {Promise} API response
 */
export const updateBudget = (id, budgetData) => {
  return api.put(`/budgets/${id}`, budgetData)
}

// ANALYTICS ENDPOINTS
// ============================================

/**
 * Get expense analytics data
 * @param {Object} params - Query parameters (date range, etc.)
 * @returns {Promise} API response
 */
export const getAnalytics = (params = {}) => {
  return api.get('/analytics', { params })
}

// EXPORT ENDPOINTS
// ============================================

/**
 * Export expenses as CSV
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise} API response with CSV data
 */
export const exportCSV = (params = {}) => {
  return api.get('/export/csv', { 
    params,
    responseType: 'blob' // Important for file downloads
  })
}

/**
 * Export expenses as PDF
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise} API response with PDF data
 */
export const exportPDF = (params = {}) => {
  return api.get('/export/pdf', { 
    params,
    responseType: 'blob' // Important for file downloads
  })
}

// SETTINGS ENDPOINTS
// ============================================

/**
 * Toggle monthly email reports
 * @param {boolean} enabled - Whether to enable or disable
 * @returns {Promise} API response
 */
export const toggleEmailReports = (enabled) => {
  return api.post('/settings/email-reports', { enabled })
}

// Export the main api instance for custom requests
export default api
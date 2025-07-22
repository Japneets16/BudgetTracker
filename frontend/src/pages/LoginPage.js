// Login Page - First step of authentication
// User enters email and password here

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { login } from '../services/api.js'

function LoginPage() {
  // Navigate function to redirect to other pages
  const navigate = useNavigate()
  
  // State for form inputs
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault() // Prevent page refresh
    
    // Basic validation
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)
    
    try {
      // Call login API
      const response = await login(email, password)
      
      if (response.data.success) {
        toast.success('Login successful! Please check your email for OTP.')
        // Redirect to OTP page with email
        navigate('/otp', { state: { email } })
      }
    } catch (error) {
      console.error('Login error:', error)
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
    } finally {
      setIsLoading(false)
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
        className: 'max-w-md w-full space-y-8'
      },
      // Header
      React.createElement(
        'div',
        null,
        React.createElement(
          'h2',
          {
            className: 'mt-6 text-center text-3xl font-extrabold text-gray-900'
          },
          '💰 Smart Expense Tracker'
        ),
        React.createElement(
          'p',
          {
            className: 'mt-2 text-center text-sm text-gray-600'
          },
          'Sign in to your account'
        )
      ),
      
      // Login Form
      React.createElement(
        'form',
        {
          className: 'mt-8 space-y-6',
          onSubmit: handleSubmit
        },
        React.createElement(
          'div',
          {
            className: 'space-y-4'
          },
          // Email Input
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              {
                htmlFor: 'email',
                className: 'block text-sm font-medium text-gray-700'
              },
              'Email Address'
            ),
            React.createElement('input', {
              id: 'email',
              name: 'email',
              type: 'email',
              required: true,
              className: 'input-field mt-1',
              placeholder: 'Enter your email',
              value: email,
              onChange: (e) => setEmail(e.target.value)
            })
          ),
          
          // Password Input
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              {
                htmlFor: 'password',
                className: 'block text-sm font-medium text-gray-700'
              },
              'Password'
            ),
            React.createElement('input', {
              id: 'password',
              name: 'password',
              type: 'password',
              required: true,
              className: 'input-field mt-1',
              placeholder: 'Enter your password',
              value: password,
              onChange: (e) => setPassword(e.target.value)
            })
          )
        ),
        
        // Submit Button
        React.createElement(
          'div',
          null,
          React.createElement(
            'button',
            {
              type: 'submit',
              className: 'btn-primary w-full',
              disabled: isLoading
            },
            isLoading ? 'Signing in...' : 'Sign in'
          )
        )
      ),
      
      // Demo Credentials Info
      React.createElement(
        'div',
        {
          className: 'mt-6 p-4 bg-blue-50 rounded-lg'
        },
        React.createElement(
          'h3',
          {
            className: 'text-sm font-medium text-blue-800'
          },
          'Demo Credentials:'
        ),
        React.createElement(
          'p',
          {
            className: 'text-sm text-blue-600 mt-1'
          },
          'Email: demo@example.com'
        ),
        React.createElement(
          'p',
          {
            className: 'text-sm text-blue-600'
          },
          'Password: demo123'
        )
      )
    )
  )
}

export default LoginPage
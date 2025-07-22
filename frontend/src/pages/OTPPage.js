// OTP Page - Second step of authentication (MFA)
// User enters the 6-digit OTP code sent to their email

import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { verifyOTP } from '../services/api.js'
import { saveToken } from '../utils/auth.js'

function OTPPage() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get email from previous page (login page)
  const email = location.state?.email
  
  // State for OTP input and loading
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes countdown

  // Redirect to login if no email is provided
  useEffect(() => {
    if (!email) {
      toast.error('Please login first')
      navigate('/login')
    }
  }, [email, navigate])

  // Countdown timer for OTP expiration
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      toast.error('OTP expired. Please login again.')
      navigate('/login')
    }
  }, [timeLeft, navigate])

  // Format time remaining (MM:SS)
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Handle OTP input - only allow numbers and max 6 digits
  function handleOTPChange(e) {
    const value = e.target.value.replace(/[^0-9]/g, '') // Remove non-numbers
    if (value.length <= 6) {
      setOtp(value)
    }
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault()
    
    // Validate OTP
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP')
      return
    }

    setIsLoading(true)
    
    try {
      // Call OTP verification API
      const response = await verifyOTP(email, otp)
      
      if (response.data.success) {
        // Save JWT token from response
        saveToken(response.data.token)
        toast.success('OTP verified successfully!')
        // Redirect to dashboard
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      const message = error.response?.data?.message || 'OTP verification failed'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  // Go back to login page
  function goBackToLogin() {
    navigate('/login')
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
          '🔐 Verify OTP'
        ),
        React.createElement(
          'p',
          {
            className: 'mt-2 text-center text-sm text-gray-600'
          },
          `Enter the 6-digit code sent to ${email}`
        ),
        React.createElement(
          'p',
          {
            className: 'text-center text-sm text-red-600 font-medium'
          },
          `Time remaining: ${formatTime(timeLeft)}`
        )
      ),
      
      // OTP Form
      React.createElement(
        'form',
        {
          className: 'mt-8 space-y-6',
          onSubmit: handleSubmit
        },
        // OTP Input
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            {
              htmlFor: 'otp',
              className: 'block text-sm font-medium text-gray-700 text-center'
            },
            'Enter OTP Code'
          ),
          React.createElement('input', {
            id: 'otp',
            name: 'otp',
            type: 'text',
            required: true,
            className: 'input-field mt-2 text-center text-2xl font-mono tracking-widest',
            placeholder: '000000',
            value: otp,
            onChange: handleOTPChange,
            maxLength: 6
          })
        ),
        
        // Buttons
        React.createElement(
          'div',
          {
            className: 'space-y-3'
          },
          // Verify Button
          React.createElement(
            'button',
            {
              type: 'submit',
              className: 'btn-primary w-full',
              disabled: isLoading || otp.length !== 6
            },
            isLoading ? 'Verifying...' : 'Verify OTP'
          ),
          
          // Back to Login Button
          React.createElement(
            'button',
            {
              type: 'button',
              className: 'btn-secondary w-full',
              onClick: goBackToLogin
            },
            'Back to Login'
          )
        )
      ),
      
      // Help Text
      React.createElement(
        'div',
        {
          className: 'mt-6 p-4 bg-blue-50 rounded-lg'
        },
        React.createElement(
          'p',
          {
            className: 'text-sm text-blue-600 text-center'
          },
          'Didn\'t receive the code? Check your spam folder or try logging in again.'
        )
      )
    )
  )
}

export default OTPPage
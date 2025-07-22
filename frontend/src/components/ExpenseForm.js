// Expense Form Component - Modal form for adding/editing expenses
// Can be used for both creating new expenses and editing existing ones

import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { createExpense, updateExpense } from '../services/api.js'

function ExpenseForm({ expense, onSuccess, onCancel }) {
  // Determine if we're editing or creating
  const isEditing = Boolean(expense)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    description: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  // Populate form when editing
  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || '',
        amount: expense.amount || '',
        category: expense.category || '',
        date: expense.date ? expense.date.split('T')[0] : new Date().toISOString().split('T')[0],
        description: expense.description || ''
      })
    }
  }, [expense])

  // Handle form field changes
  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault()
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter a title')
      return
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    if (!formData.category) {
      toast.error('Please select a category')
      return
    }
    if (!formData.date) {
      toast.error('Please select a date')
      return
    }

    setIsLoading(true)
    
    try {
      // Prepare data for API
      const expenseData = {
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description.trim()
      }

      if (isEditing) {
        // Update existing expense
        await updateExpense(expense.id, expenseData)
      } else {
        // Create new expense
        await createExpense(expenseData)
      }

      onSuccess() // Call parent's success handler
    } catch (error) {
      console.error('Error saving expense:', error)
      const message = error.response?.data?.message || 'Failed to save expense'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  // Category options
  const categories = [
    { value: 'food', label: '🍕 Food', emoji: '🍕' },
    { value: 'transport', label: '🚗 Transport', emoji: '🚗' },
    { value: 'entertainment', label: '🎬 Entertainment', emoji: '🎬' },
    { value: 'bills', label: '💡 Bills', emoji: '💡' },
    { value: 'shopping', label: '🛍️ Shopping', emoji: '🛍️' },
    { value: 'health', label: '🏥 Health', emoji: '🏥' },
    { value: 'education', label: '📚 Education', emoji: '📚' },
    { value: 'other', label: '📦 Other', emoji: '📦' }
  ]

  return React.createElement(
    // Modal Backdrop
    'div',
    {
      className: 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50',
      onClick: onCancel // Close when clicking backdrop
    },
    
    // Modal Container
    React.createElement(
      'div',
      {
        className: 'relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white',
        onClick: (e) => e.stopPropagation() // Prevent closing when clicking inside modal
      },
      
      // Modal Header
      React.createElement(
        'div',
        { className: 'mb-4' },
        React.createElement(
          'h3',
          { className: 'text-lg font-medium text-gray-900' },
          isEditing ? '✏️ Edit Expense' : '➕ Add New Expense'
        ),
        React.createElement(
          'button',
          {
            onClick: onCancel,
            className: 'absolute top-4 right-4 text-gray-400 hover:text-gray-600'
          },
          '✕'
        )
      ),

      // Form
      React.createElement(
        'form',
        { onSubmit: handleSubmit, className: 'space-y-4' },

        // Title Input
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { className: 'block text-sm font-medium text-gray-700 mb-1' },
            'Title *'
          ),
          React.createElement('input', {
            type: 'text',
            name: 'title',
            required: true,
            className: 'input-field',
            placeholder: 'e.g., Lunch at restaurant',
            value: formData.title,
            onChange: handleChange
          })
        ),

        // Amount and Date Row
        React.createElement(
          'div',
          { className: 'grid grid-cols-2 gap-4' },
          
          // Amount Input
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { className: 'block text-sm font-medium text-gray-700 mb-1' },
              'Amount *'
            ),
            React.createElement('input', {
              type: 'number',
              name: 'amount',
              required: true,
              min: '0',
              step: '0.01',
              className: 'input-field',
              placeholder: '0.00',
              value: formData.amount,
              onChange: handleChange
            })
          ),

          // Date Input
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { className: 'block text-sm font-medium text-gray-700 mb-1' },
              'Date *'
            ),
            React.createElement('input', {
              type: 'date',
              name: 'date',
              required: true,
              className: 'input-field',
              value: formData.date,
              onChange: handleChange
            })
          )
        ),

        // Category Select
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { className: 'block text-sm font-medium text-gray-700 mb-1' },
            'Category *'
          ),
          React.createElement(
            'select',
            {
              name: 'category',
              required: true,
              className: 'input-field',
              value: formData.category,
              onChange: handleChange
            },
            React.createElement('option', { value: '' }, 'Select a category'),
            ...categories.map(cat => 
              React.createElement('option', { 
                key: cat.value, 
                value: cat.value 
              }, cat.label)
            )
          )
        ),

        // Description Textarea
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { className: 'block text-sm font-medium text-gray-700 mb-1' },
            'Description (Optional)'
          ),
          React.createElement('textarea', {
            name: 'description',
            rows: 3,
            className: 'input-field',
            placeholder: 'Add any additional notes...',
            value: formData.description,
            onChange: handleChange
          })
        ),

        // Form Buttons
        React.createElement(
          'div',
          { className: 'flex justify-end space-x-3 pt-4' },
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: onCancel,
              className: 'btn-secondary'
            },
            'Cancel'
          ),
          React.createElement(
            'button',
            {
              type: 'submit',
              disabled: isLoading,
              className: 'btn-primary'
            },
            isLoading 
              ? 'Saving...' 
              : isEditing 
                ? 'Update Expense' 
                : 'Add Expense'
          )
        )
      )
    )
  )
}

export default ExpenseForm
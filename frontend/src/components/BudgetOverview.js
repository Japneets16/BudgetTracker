// Budget Overview Component - Shows budget progress and management
// Displays budget bars with percentage used and allows budget creation/editing

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { createBudget, updateBudget } from '../services/api.js'

function BudgetOverview({ budgets, onBudgetUpdate }) {
  const [showBudgetForm, setShowBudgetForm] = useState(false)

  // Helper function to format currency
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Helper function to get category emoji
  function getCategoryEmoji(category) {
    const emojiMap = {
      food: '🍕',
      transport: '🚗',
      entertainment: '🎬',
      bills: '💡',
      shopping: '🛍️',
      health: '🏥',
      education: '📚',
      other: '📦'
    }
    return emojiMap[category] || '📦'
  }

  // Calculate budget progress
  function getBudgetProgress(budget) {
    const percentage = (budget.spent / budget.limit) * 100
    return Math.min(percentage, 100) // Cap at 100%
  }

  // Get progress bar color based on percentage
  function getProgressColor(percentage) {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  if (budgets.length === 0) {
    return React.createElement(
      'div',
      { className: 'card mb-6' },
      React.createElement(
        'div',
        { className: 'text-center py-8' },
        React.createElement(
          'div',
          { className: 'text-gray-400 text-4xl mb-4' },
          '🎯'
        ),
        React.createElement(
          'h3',
          { className: 'text-lg font-medium text-gray-900 mb-2' },
          'No budgets set up yet'
        ),
        React.createElement(
          'p',
          { className: 'text-gray-500 mb-4' },
          'Create budgets to track your spending by category'
        ),
        React.createElement(
          'button',
          {
            onClick: () => setShowBudgetForm(true),
            className: 'btn-primary'
          },
          '+ Create Budget'
        )
      ),
      showBudgetForm && React.createElement(BudgetForm, {
        onSuccess: () => {
          setShowBudgetForm(false)
          onBudgetUpdate()
        },
        onCancel: () => setShowBudgetForm(false)
      })
    )
  }

  return React.createElement(
    'div',
    { className: 'card mb-6' },
    
    // Header
    React.createElement(
      'div',
      { className: 'flex items-center justify-between mb-6' },
      React.createElement(
        'h3',
        { className: 'text-lg font-medium text-gray-900' },
        '🎯 Budget Overview'
      ),
      React.createElement(
        'button',
        {
          onClick: () => setShowBudgetForm(true),
          className: 'btn-secondary text-sm'
        },
        '+ Add Budget'
      )
    ),

    // Budget Bars
    React.createElement(
      'div',
      { className: 'space-y-4' },
      ...budgets.map(budget => {
        const progress = getBudgetProgress(budget)
        const progressColor = getProgressColor(progress)
        const isOverBudget = budget.spent > budget.limit

        return React.createElement(
          'div',
          { key: budget.id, className: 'border border-gray-200 rounded-lg p-4' },
          
          // Budget Header
          React.createElement(
            'div',
            { className: 'flex items-center justify-between mb-3' },
            React.createElement(
              'div',
              { className: 'flex items-center space-x-2' },
              React.createElement(
                'span',
                { className: 'text-lg' },
                getCategoryEmoji(budget.category)
              ),
              React.createElement(
                'span',
                { className: 'font-medium text-gray-900 capitalize' },
                budget.category
              )
            ),
            React.createElement(
              'div',
              { className: 'text-right' },
              React.createElement(
                'div',
                { className: 'text-sm font-medium text-gray-900' },
                `${formatCurrency(budget.spent)} / ${formatCurrency(budget.limit)}`
              ),
              React.createElement(
                'div',
                { 
                  className: `text-xs ${isOverBudget ? 'text-red-600' : 'text-gray-500'}` 
                },
                isOverBudget 
                  ? `Over by ${formatCurrency(budget.spent - budget.limit)}` 
                  : `${formatCurrency(budget.limit - budget.spent)} remaining`
              )
            )
          ),

          // Progress Bar
          React.createElement(
            'div',
            { className: 'w-full bg-gray-200 rounded-full h-3 mb-2' },
            React.createElement(
              'div',
              {
                className: `h-3 rounded-full transition-all duration-300 ${progressColor}`,
                style: { width: `${Math.min(progress, 100)}%` }
              }
            )
          ),

          // Progress Percentage
          React.createElement(
            'div',
            { className: 'flex justify-between items-center text-sm' },
            React.createElement(
              'span',
              { 
                className: `font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-600'}` 
              },
              `${progress.toFixed(1)}% used`
            ),
            React.createElement(
              'span',
              { className: 'text-gray-500' },
              budget.month || 'This month'
            )
          )
        )
      })
    ),

    // Budget Form Modal
    showBudgetForm && React.createElement(BudgetForm, {
      onSuccess: () => {
        setShowBudgetForm(false)
        onBudgetUpdate()
        toast.success('Budget created successfully!')
      },
      onCancel: () => setShowBudgetForm(false)
    })
  )
}

// Budget Form Component - Modal for creating/editing budgets
function BudgetForm({ budget, onSuccess, onCancel }) {
  const isEditing = Boolean(budget)
  
  const [formData, setFormData] = useState({
    category: budget?.category || '',
    limit: budget?.limit || '',
    month: budget?.month || new Date().toISOString().slice(0, 7) // YYYY-MM format
  })
  const [isLoading, setIsLoading] = useState(false)

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
    if (!formData.category) {
      toast.error('Please select a category')
      return
    }
    if (!formData.limit || parseFloat(formData.limit) <= 0) {
      toast.error('Please enter a valid budget limit')
      return
    }
    if (!formData.month) {
      toast.error('Please select a month')
      return
    }

    setIsLoading(true)
    
    try {
      const budgetData = {
        category: formData.category,
        limit: parseFloat(formData.limit),
        month: formData.month
      }

      if (isEditing) {
        await updateBudget(budget.id, budgetData)
      } else {
        await createBudget(budgetData)
      }

      onSuccess()
    } catch (error) {
      console.error('Error saving budget:', error)
      const message = error.response?.data?.message || 'Failed to save budget'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { value: 'food', label: '🍕 Food' },
    { value: 'transport', label: '🚗 Transport' },
    { value: 'entertainment', label: '🎬 Entertainment' },
    { value: 'bills', label: '💡 Bills' },
    { value: 'shopping', label: '🛍️ Shopping' },
    { value: 'health', label: '🏥 Health' },
    { value: 'education', label: '📚 Education' },
    { value: 'other', label: '📦 Other' }
  ]

  return React.createElement(
    // Modal Backdrop
    'div',
    {
      className: 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50',
      onClick: onCancel
    },
    
    // Modal Container
    React.createElement(
      'div',
      {
        className: 'relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white',
        onClick: (e) => e.stopPropagation()
      },
      
      // Modal Header
      React.createElement(
        'div',
        { className: 'mb-4' },
        React.createElement(
          'h3',
          { className: 'text-lg font-medium text-gray-900' },
          isEditing ? '✏️ Edit Budget' : '🎯 Create Budget'
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

        // Budget Limit
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { className: 'block text-sm font-medium text-gray-700 mb-1' },
            'Budget Limit *'
          ),
          React.createElement('input', {
            type: 'number',
            name: 'limit',
            required: true,
            min: '0',
            step: '0.01',
            className: 'input-field',
            placeholder: '0.00',
            value: formData.limit,
            onChange: handleChange
          })
        ),

        // Month
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { className: 'block text-sm font-medium text-gray-700 mb-1' },
            'Month *'
          ),
          React.createElement('input', {
            type: 'month',
            name: 'month',
            required: true,
            className: 'input-field',
            value: formData.month,
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
                ? 'Update Budget' 
                : 'Create Budget'
          )
        )
      )
    )
  )
}

export default BudgetOverview
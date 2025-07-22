// Expense List Component - Displays list of expenses
// Shows expenses in card/table format with edit/delete actions

import React from 'react'

function ExpenseList({ expenses, onEdit, onDelete, searchTerm }) {
  
  // Helper function to format currency
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Helper function to format date
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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

  // Helper function to highlight search terms
  function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm || !text) return text
    
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) 
        ? React.createElement('mark', { 
            key: index, 
            className: 'bg-yellow-200 px-1 rounded' 
          }, part)
        : part
    )
  }

  // Handle delete with confirmation
  function handleDelete(expense) {
    if (window.confirm(`Are you sure you want to delete "${expense.title}"?`)) {
      onDelete(expense.id)
    }
  }

  if (expenses.length === 0) {
    return React.createElement(
      'div',
      { className: 'card text-center py-12' },
      React.createElement(
        'div',
        { className: 'text-gray-400 text-4xl mb-4' },
        '📊'
      ),
      React.createElement(
        'h3',
        { className: 'text-lg font-medium text-gray-900 mb-2' },
        'No expenses found'
      ),
      React.createElement(
        'p',
        { className: 'text-gray-500' },
        searchTerm 
          ? 'Try adjusting your search or filters' 
          : 'Add your first expense to get started!'
      )
    )
  }

  return React.createElement(
    'div',
    { className: 'card' },
    
    // Header
    React.createElement(
      'div',
      { className: 'flex items-center justify-between mb-6' },
      React.createElement(
        'h3',
        { className: 'text-lg font-medium text-gray-900' },
        `📝 Expenses (${expenses.length})`
      ),
      React.createElement(
        'p',
        { className: 'text-sm text-gray-500' },
        `Total: ${formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}`
      )
    ),

    // Expense List
    React.createElement(
      'div',
      { className: 'space-y-3' },
      ...expenses.map(expense =>
        React.createElement(
          'div',
          {
            key: expense.id,
            className: 'border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
          },
          
          // Expense Header
          React.createElement(
            'div',
            { className: 'flex items-start justify-between' },
            
            // Left side - Title and details
            React.createElement(
              'div',
              { className: 'flex-1' },
              React.createElement(
                'div',
                { className: 'flex items-center space-x-2 mb-1' },
                React.createElement(
                  'span',
                  { className: 'text-lg' },
                  getCategoryEmoji(expense.category)
                ),
                React.createElement(
                  'h4',
                  { className: 'font-medium text-gray-900' },
                  highlightSearchTerm(expense.title, searchTerm)
                )
              ),
              React.createElement(
                'div',
                { className: 'flex items-center space-x-4 text-sm text-gray-500' },
                React.createElement(
                  'span',
                  { className: 'capitalize' },
                  expense.category
                ),
                React.createElement(
                  'span',
                  null,
                  formatDate(expense.date)
                )
              ),
              expense.description && React.createElement(
                'p',
                { className: 'text-sm text-gray-600 mt-2' },
                highlightSearchTerm(expense.description, searchTerm)
              )
            ),

            // Right side - Amount and actions
            React.createElement(
              'div',
              { className: 'flex flex-col items-end space-y-2' },
              React.createElement(
                'span',
                { className: 'text-lg font-semibold text-gray-900' },
                formatCurrency(expense.amount)
              ),
              React.createElement(
                'div',
                { className: 'flex space-x-2' },
                React.createElement(
                  'button',
                  {
                    onClick: () => onEdit(expense),
                    className: 'text-blue-600 hover:text-blue-800 text-sm font-medium'
                  },
                  '✏️ Edit'
                ),
                React.createElement(
                  'button',
                  {
                    onClick: () => handleDelete(expense),
                    className: 'text-red-600 hover:text-red-800 text-sm font-medium'
                  },
                  '🗑️ Delete'
                )
              )
            )
          )
        )
      )
    ),

    // Desktop Table View (Hidden on mobile)
    React.createElement(
      'div',
      { className: 'hidden lg:block mt-8' },
      React.createElement(
        'h4',
        { className: 'text-md font-medium text-gray-900 mb-4' },
        '📋 Table View'
      ),
      React.createElement(
        'div',
        { className: 'overflow-x-auto' },
        React.createElement(
          'table',
          { className: 'min-w-full divide-y divide-gray-200' },
          
          // Table Header
          React.createElement(
            'thead',
            { className: 'bg-gray-50' },
            React.createElement(
              'tr',
              null,
              React.createElement(
                'th',
                { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' },
                'Expense'
              ),
              React.createElement(
                'th',
                { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' },
                'Category'
              ),
              React.createElement(
                'th',
                { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' },
                'Amount'
              ),
              React.createElement(
                'th',
                { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' },
                'Date'
              ),
              React.createElement(
                'th',
                { className: 'px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider' },
                'Actions'
              )
            )
          ),

          // Table Body
          React.createElement(
            'tbody',
            { className: 'bg-white divide-y divide-gray-200' },
            ...expenses.map(expense =>
              React.createElement(
                'tr',
                { key: expense.id, className: 'hover:bg-gray-50' },
                
                // Title column
                React.createElement(
                  'td',
                  { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement(
                    'div',
                    null,
                    React.createElement(
                      'div',
                      { className: 'text-sm font-medium text-gray-900' },
                      highlightSearchTerm(expense.title, searchTerm)
                    ),
                    expense.description && React.createElement(
                      'div',
                      { className: 'text-sm text-gray-500 truncate max-w-xs' },
                      highlightSearchTerm(expense.description, searchTerm)
                    )
                  )
                ),

                // Category column
                React.createElement(
                  'td',
                  { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement(
                    'span',
                    { className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize' },
                    getCategoryEmoji(expense.category),
                    ' ',
                    expense.category
                  )
                ),

                // Amount column
                React.createElement(
                  'td',
                  { className: 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900' },
                  formatCurrency(expense.amount)
                ),

                // Date column
                React.createElement(
                  'td',
                  { className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500' },
                  formatDate(expense.date)
                ),

                // Actions column
                React.createElement(
                  'td',
                  { className: 'px-6 py-4 whitespace-nowrap text-right text-sm font-medium' },
                  React.createElement(
                    'button',
                    {
                      onClick: () => onEdit(expense),
                      className: 'text-blue-600 hover:text-blue-900 mr-4'
                    },
                    'Edit'
                  ),
                  React.createElement(
                    'button',
                    {
                      onClick: () => handleDelete(expense),
                      className: 'text-red-600 hover:text-red-900'
                    },
                    'Delete'
                  )
                )
              )
            )
          )
        )
      )
    )
  )
}

export default ExpenseList
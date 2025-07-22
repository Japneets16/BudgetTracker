// Analytics Component - Shows expense statistics and charts
// Displays pie charts, line charts, and key metrics

import React from 'react'

function Analytics({ analytics }) {
  
  // Helper function to format currency
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // If no analytics data, show loading or empty state
  if (!analytics) {
    return React.createElement(
      'div',
      { className: 'card' },
      React.createElement(
        'h3',
        { className: 'text-lg font-medium text-gray-900 mb-4' },
        '📊 Analytics'
      ),
      React.createElement(
        'div',
        { className: 'text-center py-8' },
        React.createElement(
          'div',
          { className: 'animate-pulse' },
          React.createElement(
            'div',
            { className: 'h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4' }
          ),
          React.createElement(
            'div',
            { className: 'h-4 bg-gray-200 rounded w-1/2 mx-auto' }
          )
        )
      )
    )
  }

  // Calculate total expenses
  const totalExpenses = analytics.categoryBreakdown?.reduce(
    (sum, cat) => sum + cat.amount, 0
  ) || 0

  // Get top category
  const topCategory = analytics.categoryBreakdown?.reduce(
    (max, cat) => cat.amount > max.amount ? cat : max,
    { category: 'None', amount: 0 }
  ) || { category: 'None', amount: 0 }

  return React.createElement(
    'div',
    { className: 'space-y-6' },
    
    // Analytics Card
    React.createElement(
      'div',
      { className: 'card' },
      React.createElement(
        'h3',
        { className: 'text-lg font-medium text-gray-900 mb-6' },
        '📊 Analytics'
      ),

      // Key Metrics
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 gap-4 mb-6' },
        
        // Total Expenses
        React.createElement(
          'div',
          { className: 'bg-blue-50 p-4 rounded-lg' },
          React.createElement(
            'div',
            { className: 'text-sm font-medium text-blue-600' },
            'Total Expenses'
          ),
          React.createElement(
            'div',
            { className: 'text-2xl font-bold text-blue-900' },
            formatCurrency(totalExpenses)
          )
        ),

        // Average per day
        React.createElement(
          'div',
          { className: 'bg-green-50 p-4 rounded-lg' },
          React.createElement(
            'div',
            { className: 'text-sm font-medium text-green-600' },
            'Avg. per Day'
          ),
          React.createElement(
            'div',
            { className: 'text-2xl font-bold text-green-900' },
            formatCurrency(analytics.dailyAverage || 0)
          )
        ),

        // Top Category
        React.createElement(
          'div',
          { className: 'bg-purple-50 p-4 rounded-lg' },
          React.createElement(
            'div',
            { className: 'text-sm font-medium text-purple-600' },
            'Top Category'
          ),
          React.createElement(
            'div',
            { className: 'text-lg font-bold text-purple-900 capitalize' },
            topCategory.category
          ),
          React.createElement(
            'div',
            { className: 'text-sm text-purple-700' },
            formatCurrency(topCategory.amount)
          )
        )
      ),

      // Category Breakdown
      analytics.categoryBreakdown && analytics.categoryBreakdown.length > 0 && React.createElement(
        'div',
        null,
        React.createElement(
          'h4',
          { className: 'text-md font-medium text-gray-900 mb-4' },
          '📈 Category Breakdown'
        ),
        React.createElement(
          'div',
          { className: 'space-y-3' },
          ...analytics.categoryBreakdown.map(category => {
            const percentage = totalExpenses > 0 ? (category.amount / totalExpenses) * 100 : 0
            
            return React.createElement(
              'div',
              { key: category.category },
              React.createElement(
                'div',
                { className: 'flex justify-between items-center mb-1' },
                React.createElement(
                  'span',
                  { className: 'text-sm font-medium text-gray-900 capitalize' },
                  category.category
                ),
                React.createElement(
                  'span',
                  { className: 'text-sm text-gray-500' },
                  `${percentage.toFixed(1)}%`
                )
              ),
              React.createElement(
                'div',
                { className: 'w-full bg-gray-200 rounded-full h-2' },
                React.createElement(
                  'div',
                  {
                    className: 'bg-blue-600 h-2 rounded-full transition-all duration-300',
                    style: { width: `${percentage}%` }
                  }
                )
              ),
              React.createElement(
                'div',
                { className: 'text-xs text-gray-500 mt-1' },
                formatCurrency(category.amount)
              )
            )
          })
        )
      ),

      // Recent Trends
      analytics.monthlyTrend && React.createElement(
        'div',
        { className: 'mt-6' },
        React.createElement(
          'h4',
          { className: 'text-md font-medium text-gray-900 mb-4' },
          '📅 Monthly Trend'
        ),
        React.createElement(
          'div',
          { className: 'text-center p-4 bg-gray-50 rounded-lg' },
          React.createElement(
            'div',
            { className: 'text-3xl mb-2' },
            analytics.monthlyTrend.direction === 'up' ? '📈' : 
            analytics.monthlyTrend.direction === 'down' ? '📉' : '➡️'
          ),
          React.createElement(
            'div',
            { className: 'text-sm text-gray-600' },
            analytics.monthlyTrend.direction === 'up' ? 'Expenses increased' :
            analytics.monthlyTrend.direction === 'down' ? 'Expenses decreased' : 'Expenses stable'
          ),
          React.createElement(
            'div',
            { className: 'text-lg font-semibold text-gray-900' },
            `${Math.abs(analytics.monthlyTrend.percentage || 0).toFixed(1)}%`,
            ' vs last month'
          )
        )
      )
    ),

    // Quick Actions Card
    React.createElement(
      'div',
      { className: 'card' },
      React.createElement(
        'h3',
        { className: 'text-lg font-medium text-gray-900 mb-4' },
        '⚡ Quick Actions'
      ),
      React.createElement(
        'div',
        { className: 'space-y-3' },
        React.createElement(
          'button',
          { className: 'w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors' },
          React.createElement(
            'div',
            { className: 'font-medium text-gray-900' },
            '📊 View Detailed Report'
          ),
          React.createElement(
            'div',
            { className: 'text-sm text-gray-500' },
            'Get insights on spending patterns'
          )
        ),
        React.createElement(
          'button',
          { className: 'w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors' },
          React.createElement(
            'div',
            { className: 'font-medium text-gray-900' },
            '🎯 Set New Budget'
          ),
          React.createElement(
            'div',
            { className: 'text-sm text-gray-500' },
            'Create budget for any category'
          )
        ),
        React.createElement(
          'button',
          { className: 'w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors' },
          React.createElement(
            'div',
            { className: 'font-medium text-gray-900' },
            '📈 Compare Months'
          ),
          React.createElement(
            'div',
            { className: 'text-sm text-gray-500' },
            'See how you\'re doing over time'
          )
        )
      )
    )
  )
}

export default Analytics
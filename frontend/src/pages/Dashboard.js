// Dashboard Page - Main page of the application
// Contains expense tracking, budget overview, and analytics

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'

// Import components
import Navigation from '../components/Navigation.js'
import ExpenseForm from '../components/ExpenseForm.js'
import ExpenseList from '../components/ExpenseList.js'
import BudgetOverview from '../components/BudgetOverview.js'
import Analytics from '../components/Analytics.js'
import ExportButtons from '../components/ExportButtons.js'

// Import API functions
import { getExpenses, getAnalytics, getBudgets, deleteExpense } from '../services/api.js'

function Dashboard() {
  // URL search parameters for search functionality
  const [searchParams, setSearchParams] = useSearchParams()
  
  // State management
  const [expenses, setExpenses] = useState([])
  const [budgets, setBudgets] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [filters, setFilters] = useState({
    category: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  })
  const [sortBy, setSortBy] = useState('date') // 'date', 'amount', 'category'
  const [sortOrder, setSortOrder] = useState('desc') // 'asc', 'desc'
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)

  // Load initial data
  useEffect(() => {
    loadDashboardData()
  }, [])

  // Update URL when search term changes
  useEffect(() => {
    if (searchTerm) {
      setSearchParams({ search: searchTerm })
    } else {
      setSearchParams({})
    }
  }, [searchTerm, setSearchParams])

  // Load all dashboard data
  async function loadDashboardData() {
    setLoading(true)
    try {
      // Load expenses, budgets, and analytics in parallel
      const [expensesRes, budgetsRes, analyticsRes] = await Promise.all([
        getExpenses({ search: searchTerm, ...filters, sortBy, sortOrder }),
        getBudgets(),
        getAnalytics()
      ])

      setExpenses(expensesRes.data.expenses || [])
      setBudgets(budgetsRes.data.budgets || [])
      setAnalytics(analyticsRes.data)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Reload expenses when filters change
  useEffect(() => {
    if (!loading) {
      loadExpenses()
    }
  }, [searchTerm, filters, sortBy, sortOrder])

  // Load expenses with current filters
  async function loadExpenses() {
    try {
      const response = await getExpenses({ 
        search: searchTerm, 
        ...filters, 
        sortBy, 
        sortOrder 
      })
      setExpenses(response.data.expenses || [])
    } catch (error) {
      console.error('Error loading expenses:', error)
      toast.error('Failed to load expenses')
    }
  }

  // Handle search input
  function handleSearchChange(e) {
    setSearchTerm(e.target.value)
  }

  // Handle filter changes
  function handleFilterChange(filterName, value) {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  // Clear all filters
  function clearFilters() {
    setSearchTerm('')
    setFilters({
      category: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: ''
    })
    setSortBy('date')
    setSortOrder('desc')
  }

  // Handle expense form success
  function handleExpenseSuccess() {
    setShowExpenseForm(false)
    setEditingExpense(null)
    loadDashboardData() // Reload all data to update budgets and analytics
    toast.success(editingExpense ? 'Expense updated!' : 'Expense added!')
  }

  // Handle edit expense
  function handleEditExpense(expense) {
    setEditingExpense(expense)
    setShowExpenseForm(true)
  }

  // Handle delete expense
  async function handleDeleteExpense(expenseId) {
    try {
      await deleteExpense(expenseId)
      loadDashboardData()
      toast.success('Expense deleted!')
    } catch (error) {
      console.error('Error deleting expense:', error)
      toast.error('Failed to delete expense')
    }
  }

  if (loading) {
    return React.createElement(
      'div',
      { className: 'min-h-screen bg-gray-50' },
      React.createElement(Navigation),
      React.createElement(
        'div',
        { className: 'flex items-center justify-center h-64' },
        React.createElement(
          'div',
          { className: 'text-center' },
          React.createElement(
            'div',
            { className: 'animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto' }
          ),
          React.createElement(
            'p',
            { className: 'mt-4 text-gray-600' },
            'Loading dashboard...'
          )
        )
      )
    )
  }

  return React.createElement(
    'div',
    { className: 'min-h-screen bg-gray-50' },
    
    // Navigation
    React.createElement(Navigation),
    
    // Main Content
    React.createElement(
      'div',
      { className: 'max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8' },
      
      // Header
      React.createElement(
        'div',
        { className: 'md:flex md:items-center md:justify-between mb-8' },
        React.createElement(
          'div',
          { className: 'flex-1 min-w-0' },
          React.createElement(
            'h2',
            { className: 'text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate' },
            '💰 Expense Dashboard'
          )
        ),
        React.createElement(
          'div',
          { className: 'mt-4 flex md:mt-0 md:ml-4' },
          React.createElement(
            'button',
            {
              onClick: () => setShowExpenseForm(true),
              className: 'btn-primary'
            },
            '+ Add Expense'
          )
        )
      ),

      // Budget Overview
      React.createElement(BudgetOverview, {
        budgets,
        onBudgetUpdate: loadDashboardData
      }),

      // Search and Filters
      React.createElement(
        'div',
        { className: 'card mb-6' },
        React.createElement(
          'h3',
          { className: 'text-lg font-medium text-gray-900 mb-4' },
          '🔍 Search & Filters'
        ),
        
        // Search Bar
        React.createElement(
          'div',
          { className: 'mb-4' },
          React.createElement('input', {
            type: 'text',
            placeholder: 'Search expenses...',
            className: 'input-field',
            value: searchTerm,
            onChange: handleSearchChange
          })
        ),

        // Filters Row
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-6 gap-4 mb-4' },
          
          // Category Filter
          React.createElement(
            'select',
            {
              className: 'input-field',
              value: filters.category,
              onChange: (e) => handleFilterChange('category', e.target.value)
            },
            React.createElement('option', { value: '' }, 'All Categories'),
            React.createElement('option', { value: 'food' }, 'Food'),
            React.createElement('option', { value: 'transport' }, 'Transport'),
            React.createElement('option', { value: 'entertainment' }, 'Entertainment'),
            React.createElement('option', { value: 'bills' }, 'Bills'),
            React.createElement('option', { value: 'shopping' }, 'Shopping'),
            React.createElement('option', { value: 'other' }, 'Other')
          ),

          // Date From
          React.createElement('input', {
            type: 'date',
            className: 'input-field',
            value: filters.dateFrom,
            onChange: (e) => handleFilterChange('dateFrom', e.target.value)
          }),

          // Date To
          React.createElement('input', {
            type: 'date',
            className: 'input-field',
            value: filters.dateTo,
            onChange: (e) => handleFilterChange('dateTo', e.target.value)
          }),

          // Min Amount
          React.createElement('input', {
            type: 'number',
            placeholder: 'Min amount',
            className: 'input-field',
            value: filters.amountMin,
            onChange: (e) => handleFilterChange('amountMin', e.target.value)
          }),

          // Max Amount
          React.createElement('input', {
            type: 'number',
            placeholder: 'Max amount',
            className: 'input-field',
            value: filters.amountMax,
            onChange: (e) => handleFilterChange('amountMax', e.target.value)
          }),

          // Sort Options
          React.createElement(
            'select',
            {
              className: 'input-field',
              value: `${sortBy}-${sortOrder}`,
              onChange: (e) => {
                const [sort, order] = e.target.value.split('-')
                setSortBy(sort)
                setSortOrder(order)
              }
            },
            React.createElement('option', { value: 'date-desc' }, 'Date (Newest)'),
            React.createElement('option', { value: 'date-asc' }, 'Date (Oldest)'),
            React.createElement('option', { value: 'amount-desc' }, 'Amount (Highest)'),
            React.createElement('option', { value: 'amount-asc' }, 'Amount (Lowest)')
          )
        ),

        // Clear Filters Button
        React.createElement(
          'button',
          {
            onClick: clearFilters,
            className: 'btn-secondary text-sm'
          },
          'Clear Filters'
        )
      ),

      // Export Buttons
      React.createElement(ExportButtons, { 
        filters: { search: searchTerm, ...filters } 
      }),

      // Two Column Layout
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 lg:grid-cols-3 gap-6' },
        
        // Left Column - Expense List
        React.createElement(
          'div',
          { className: 'lg:col-span-2' },
          React.createElement(ExpenseList, {
            expenses,
            onEdit: handleEditExpense,
            onDelete: handleDeleteExpense,
            searchTerm
          })
        ),

        // Right Column - Analytics
        React.createElement(
          'div',
          { className: 'lg:col-span-1' },
          React.createElement(Analytics, { analytics })
        )
      )
    ),

    // Expense Form Modal
    showExpenseForm && React.createElement(ExpenseForm, {
      expense: editingExpense,
      onSuccess: handleExpenseSuccess,
      onCancel: () => {
        setShowExpenseForm(false)
        setEditingExpense(null)
      }
    })
  )
}

export default Dashboard
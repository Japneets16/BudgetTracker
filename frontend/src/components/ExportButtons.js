// Export Buttons Component - Handles CSV and PDF export
// Downloads expense data in different formats

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { exportCSV, exportPDF } from '../services/api.js'

function ExportButtons({ filters = {} }) {
  const [isExporting, setIsExporting] = useState(false)

  // Helper function to trigger file download
  function downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Handle CSV export
  async function handleExportCSV() {
    setIsExporting(true)
    try {
      const response = await exportCSV(filters)
      const filename = `expenses_${new Date().toISOString().split('T')[0]}.csv`
      downloadFile(response.data, filename)
      toast.success('CSV exported successfully!')
    } catch (error) {
      console.error('Error exporting CSV:', error)
      toast.error('Failed to export CSV')
    } finally {
      setIsExporting(false)
    }
  }

  // Handle PDF export
  async function handleExportPDF() {
    setIsExporting(true)
    try {
      const response = await exportPDF(filters)
      const filename = `expenses_${new Date().toISOString().split('T')[0]}.pdf`
      downloadFile(response.data, filename)
      toast.success('PDF exported successfully!')
    } catch (error) {
      console.error('Error exporting PDF:', error)
      toast.error('Failed to export PDF')
    } finally {
      setIsExporting(false)
    }
  }

  return React.createElement(
    'div',
    { className: 'card mb-6' },
    React.createElement(
      'h3',
      { className: 'text-lg font-medium text-gray-900 mb-4' },
      '📤 Export Data'
    ),
    React.createElement(
      'div',
      { className: 'flex flex-col sm:flex-row gap-3' },
      
      // CSV Export Button
      React.createElement(
        'button',
        {
          onClick: handleExportCSV,
          disabled: isExporting,
          className: 'btn-secondary flex items-center justify-center space-x-2'
        },
        React.createElement(
          'span',
          null,
          '📊'
        ),
        React.createElement(
          'span',
          null,
          isExporting ? 'Exporting...' : 'Export as CSV'
        )
      ),

      // PDF Export Button  
      React.createElement(
        'button',
        {
          onClick: handleExportPDF,
          disabled: isExporting,
          className: 'btn-secondary flex items-center justify-center space-x-2'
        },
        React.createElement(
          'span',
          null,
          '📄'
        ),
        React.createElement(
          'span',
          null,
          isExporting ? 'Exporting...' : 'Export as PDF'
        )
      )
    ),
    React.createElement(
      'p',
      { className: 'text-sm text-gray-500 mt-3' },
      'Export your expenses with current filters applied. Files will be downloaded to your device.'
    )
  )
}

export default ExportButtons
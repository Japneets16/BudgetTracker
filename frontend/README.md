# 💰 Smart Expense Tracker Frontend

A modern, PWA-enabled expense tracking application built with React and Tailwind CSS. This frontend provides a complete user interface for managing expenses, budgets, and analytics with offline support.

## 🚀 Features

### 🔐 Authentication & Security
- **Multi-Factor Authentication (MFA)** - Email + Password + OTP verification
- **JWT Token Management** - Secure token storage and automatic refresh
- **Protected Routes** - Authentication-based navigation

### 📱 Progressive Web App (PWA)
- **Offline Support** - Works without internet connection
- **Service Worker** - Caching and background sync
- **Installable** - Can be installed on mobile devices
- **Push Notifications** - Ready for future notification features

### 🧾 Expense Management
- **Add/Edit/Delete Expenses** - Full CRUD operations
- **Category-based Organization** - 8 predefined categories with emojis
- **Advanced Search & Filtering** - Filter by category, date, amount
- **Search Highlighting** - Visual highlighting of search terms
- **Real-time Updates** - Instant UI updates

### 🎯 Budget Tracking
- **Budget Creation** - Set monthly budgets per category
- **Progress Visualization** - Color-coded progress bars
- **Overspending Alerts** - Visual warnings when over budget
- **Budget Analytics** - Track spending vs limits

### 📊 Analytics & Insights
- **Category Breakdown** - Visual spending distribution
- **Monthly Trends** - Track spending patterns over time
- **Key Metrics** - Total expenses, daily averages, top categories
- **Progress Bars** - Visual representation of data

### 📤 Export & Reporting
- **CSV Export** - Download expense data as spreadsheet
- **PDF Export** - Generate printable expense reports
- **Email Reports** - Optional monthly email summaries
- **Data Backup** - Export all user data

### ⚙️ User Experience
- **Responsive Design** - Works on all screen sizes
- **Toast Notifications** - User feedback for all actions
- **Loading States** - Smooth loading indicators
- **Error Handling** - Graceful error management
- **Accessibility** - Screen reader friendly

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Notifications**: React Hot Toast
- **PWA**: Service Worker + Web App Manifest
- **Offline Storage**: LocalStorage + IndexedDB (ready)

## 📁 Project Structure

```
frontend/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   ├── offline.html           # Offline fallback page
│   └── icons/                 # PWA icons
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── Navigation.js      # Main navigation bar
│   │   ├── ExpenseForm.js     # Add/edit expense modal
│   │   ├── ExpenseList.js     # Expense display component
│   │   ├── BudgetOverview.js  # Budget management
│   │   ├── Analytics.js       # Analytics dashboard
│   │   └── ExportButtons.js   # Export functionality
│   ├── pages/                 # Page components
│   │   ├── LoginPage.js       # Login form
│   │   ├── OTPPage.js         # OTP verification
│   │   ├── Dashboard.js       # Main dashboard
│   │   ├── Settings.js        # User settings
│   │   └── OfflinePage.js     # Offline fallback
│   ├── context/               # React context
│   │   └── NetworkContext.js  # Network status management
│   ├── services/              # API services
│   │   └── api.js             # HTTP requests
│   ├── utils/                 # Utility functions
│   │   └── auth.js            # Authentication helpers
│   ├── App.js                 # Main app component
│   ├── main.js                # Entry point
│   └── index.css              # Global styles
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind configuration
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- Backend API running (see backend documentation)

### Installation

1. **Clone and navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API endpoint:**
   Edit `src/services/api.js` and update `BASE_URL`:
   ```javascript
   const BASE_URL = 'http://localhost:3000/api' // Your backend URL
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   Navigate to `http://localhost:5173`

### Production Build

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Preview production build:**
   ```bash
   npm run preview
   ```

## 📱 PWA Installation

### On Mobile (Android/iOS):
1. Open the app in your mobile browser
2. Look for "Add to Home Screen" prompt
3. Tap "Add" to install the PWA

### On Desktop (Chrome/Edge):
1. Open the app in your browser
2. Look for the install icon in the address bar
3. Click to install as desktop app

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Smart Expense Tracker
VITE_APP_VERSION=1.0.0
```

### Tailwind Customization
Edit `tailwind.config.js` to customize colors, fonts, and spacing:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          // Your custom primary colors
        }
      }
    }
  }
}
```

## 🎨 Customization Guide

### Adding New Categories
1. Edit the categories array in `ExpenseForm.js`
2. Update emoji mappings in `ExpenseList.js` and `BudgetOverview.js`
3. Add corresponding styles if needed

### Modifying UI Components
- All components use React.createElement (no JSX)
- Tailwind classes for styling
- Clear commenting for easy modification
- Modular structure for easy updates

### Adding New Features
1. Create new components in `src/components/`
2. Add API endpoints in `src/services/api.js`
3. Update routing in `App.js` if needed
4. Add navigation links in `Navigation.js`

## 🔍 API Integration

The frontend expects the following API endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification

### Expenses
- `GET /api/expenses` - Get expenses with filters
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Budgets
- `GET /api/budgets` - Get budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget

### Analytics
- `GET /api/analytics` - Get analytics data

### Export
- `GET /api/export/csv` - Export as CSV
- `GET /api/export/pdf` - Export as PDF

### Settings
- `POST /api/settings/email-reports` - Toggle email reports

## 📦 Dependencies

### Core Dependencies
- `react` - UI framework
- `react-dom` - DOM rendering
- `react-router-dom` - Client-side routing
- `axios` - HTTP client
- `react-hot-toast` - Notifications

### Development Dependencies
- `vite` - Build tool
- `tailwindcss` - CSS framework
- `postcss` - CSS processing
- `autoprefixer` - CSS vendor prefixes

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check if backend server is running
   - Verify API_BASE_URL in `api.js`
   - Check browser network tab for errors

2. **PWA Not Installing**
   - Ensure HTTPS in production
   - Check manifest.json is accessible
   - Verify service worker registration

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check for missing dependencies
   - Verify Node.js version compatibility

4. **Styling Issues**
   - Check Tailwind CSS is properly configured
   - Verify PostCSS configuration
   - Clear browser cache

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Netlify
1. Connect repository to Netlify
2. Configure build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. Add environment variables
4. Deploy

### Self-Hosted
1. Build the project: `npm run build`
2. Upload `dist` folder to your web server
3. Configure web server to serve `index.html` for all routes
4. Ensure HTTPS for PWA features

## 🔒 Security Considerations

- JWT tokens stored in localStorage (consider httpOnly cookies for production)
- API requests include authentication headers
- Input validation on all forms
- XSS protection through React's default escaping
- HTTPS required for PWA features

## 🤝 Contributing

This project is designed to be easily modifiable by students. Key principles:

1. **Clear Code Structure** - Well-organized files and folders
2. **Extensive Comments** - Every component is documented
3. **No JSX** - Uses React.createElement for clarity
4. **Modular Design** - Easy to add/remove features
5. **Standard Patterns** - Follows React best practices

## 📝 License

This project is created for educational purposes. Feel free to use and modify as needed.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the browser console for errors
3. Verify your backend API is running correctly
4. Check network requests in browser dev tools

---

**Happy Coding! 🚀**

Built with ❤️ for learning React and modern web development.

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './global.css'
import { initGA } from './utils/analytics'
import AnalyticsTracker from './components/AnalyticsTracker'

// 1. Initialize Google Analytics
initGA();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 2. Place the tracker inside BrowserRouter to access useLocation */}
      <AnalyticsTracker />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

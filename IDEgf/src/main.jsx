import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Sidebar from '../components/sidebar.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sidebar />
  </StrictMode>,
)

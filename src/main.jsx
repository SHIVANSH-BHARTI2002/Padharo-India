import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 👇 2. Wrap the <App /> component with your Provider */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)

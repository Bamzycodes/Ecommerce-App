import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { StoreProvider } from './Store.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </StoreProvider>
  </StrictMode>,
)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

try {
  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>,
  )
} catch (error) {
  console.error("Failed to render app:", error);
  document.body.innerHTML = `<div style="padding: 20px; color: red;"><h1>App Failed to Start</h1><pre>${String(error)}</pre></div>`;
}

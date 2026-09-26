import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// TODO: Replace with ClerkProvider once @clerk/clerk-react is installed & configured:
// import { ClerkProvider } from '@clerk/clerk-react'
// const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
// if (!clerkPubKey) throw new Error("Missing Publishable Key in .env.local")

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* When connecting Clerk:
      <ClerkProvider publishableKey={clerkPubKey}>
        <App />
      </ClerkProvider>
    */}
    <App />
  </StrictMode>,
)

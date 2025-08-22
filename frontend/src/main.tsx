import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Verify } from './pages/Verify'

const router = createBrowserRouter([
  { path: '/', element: <Dashboard /> },
  { path: '/register', element: <Register /> },
  { path: '/verify', element: <Verify /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

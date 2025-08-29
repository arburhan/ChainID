import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { Landing } from './pages/Landing'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Verify } from './pages/Verify'
import { Government } from './pages/Government'
import { Telecommunication } from './pages/Telecommunication'

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/register', element: <Register /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/verify', element: <Verify /> },
  { path: '/government', element: <Government /> },
  { path: '/telecommunication', element: <Telecommunication /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

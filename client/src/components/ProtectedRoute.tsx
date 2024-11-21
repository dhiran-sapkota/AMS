import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Layout from './Layout'

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" replace />
  }

  return <Layout><Outlet /></Layout>
}
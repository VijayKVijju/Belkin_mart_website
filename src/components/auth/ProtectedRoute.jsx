import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import Loader from '../common/Loader'

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuthStore()

  if (loading) {
    return <Loader size="lg" fullScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.profile?.user_type !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}
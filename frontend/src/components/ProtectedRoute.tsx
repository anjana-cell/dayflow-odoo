import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types/auth'

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: UserRole[] }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <p className="status">Loading...</p>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectTo = user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}

export function PublicRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <p className="status">Loading...</p>
  }

  if (user) {
    const redirectTo = user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminDashboard } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboard() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return

    getAdminDashboard(token)
      .then((response) => setMessage(response.message))
      .catch((err) => setError(err instanceof Error ? err.message : 'Access denied'))
  }, [token])

  return (
    <div className="page dashboard">
      <div className="card wide">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Admin / HR dashboard</p>
            <h1>{user?.employee_id}</h1>
            <p className="muted">{user?.email}</p>
          </div>
          <button type="button" className="secondary" onClick={() => { logout(); navigate('/login') }}>
            Sign out
          </button>
        </header>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <ul className="permissions">
          <li>View employees</li>
          <li>Approve or reject leave</li>
          <li>View payroll</li>
          <li>Update salary structure</li>
        </ul>
      </div>
    </div>
  )
}

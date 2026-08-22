import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEmployeeDashboard } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function EmployeeDashboard() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return

    getEmployeeDashboard(token)
      .then((response) => setMessage(response.message))
      .catch((err) => setError(err instanceof Error ? err.message : 'Access denied'))
  }, [token])

  return (
    <div className="page dashboard">
      <div className="card wide">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Employee dashboard</p>
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
          <li>View profile</li>
          <li>Check-in / check-out</li>
          <li>Apply for leave</li>
          <li>View salary</li>
        </ul>
      </div>
    </div>
  )
}

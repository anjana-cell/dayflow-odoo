import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup } from '../api/auth'
import { AuthFooter, AuthLayout } from '../components/AuthLayout'

export default function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await signup({ email, password, employee_id: employeeId })
      navigate('/login', {
        replace: true,
        state: { message: 'Account created. Please sign in.' },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Employee signup" subtitle="Public signup creates Employee accounts only.">
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label>
          Employee ID
          <input
            type="text"
            value={employeeId}
            onChange={(event) => setEmployeeId(event.target.value.toUpperCase())}
            required
            pattern="[A-Za-z0-9_-]+"
            title="Letters, numbers, underscores, and hyphens only"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <AuthFooter text="Already registered?" linkTo="/login" linkLabel="Sign in" />
    </AuthLayout>
  )
}

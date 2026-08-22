import type { AuthResponse, User } from '../types/auth'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = typeof data.detail === 'string' ? data.detail : 'Request failed'
    throw new Error(message)
  }

  return data as T
}

export function signup(payload: {
  email: string
  password: string
  employee_id: string
}): Promise<User> {
  return request<User>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function login(payload: { email: string; password: string }): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getMe(token: string): Promise<User> {
  return request<User>('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function getEmployeeDashboard(token: string): Promise<{ message: string }> {
  return request<{ message: string }>('/api/auth/dashboard/employee', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function getAdminDashboard(token: string): Promise<{ message: string }> {
  return request<{ message: string }>('/api/auth/dashboard/admin', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

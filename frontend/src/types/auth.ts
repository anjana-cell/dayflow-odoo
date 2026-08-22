export type UserRole = 'employee' | 'admin'

export interface User {
  id: number
  email: string
  employee_id: string
  role: UserRole
  created_at: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface ApiError {
  detail: string
}

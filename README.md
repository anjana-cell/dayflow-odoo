# Dayflow HRMS

Human Resource Management System with role-based authentication.

## Stack

- **Backend:** FastAPI, SQLAlchemy, SQLite, JWT, bcrypt
- **Frontend:** React, TypeScript, Vite, React Router

## Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy ..\.env.example ..\.env
python scripts/seed_admin.py
uvicorn app.main:app --reload --app-dir .
```

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

## Authentication

- Public signup creates **Employee** accounts only.
- **Admin/HR** accounts are seeded via `backend/scripts/seed_admin.py` using `ADMIN_*` variables in `.env`.
- Passwords are hashed with bcrypt and never returned by the API.

## API Endpoints

| Method | Path | Access |
|--------|------|--------|
| POST | `/api/auth/signup` | Public (Employee only) |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |
| GET | `/api/auth/dashboard/employee` | Employee |
| GET | `/api/auth/dashboard/admin` | Admin |

## Manual Testing

1. Start backend on `http://localhost:8000`
2. Start frontend on `http://localhost:5173`
3. Sign up as an employee at `/signup`
4. Sign in and confirm redirect to `/employee/dashboard`
5. Sign in as admin (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) and confirm redirect to `/admin/dashboard`
6. Try wrong password on login and confirm error message
7. Open `/admin/dashboard` as an employee and confirm redirect to employee dashboard

"""Run authentication API smoke tests against a running backend."""

import json
import sys
import urllib.error
import urllib.request

BASE = "http://127.0.0.1:8000"


def request(method: str, path: str, body: dict | None = None, token: str | None = None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = None if body is None else json.dumps(body).encode()
    req = urllib.request.Request(f"{BASE}{path}", data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode())
    except urllib.error.HTTPError as exc:
        payload = exc.read().decode()
        try:
            detail = json.loads(payload)
        except json.JSONDecodeError:
            detail = {"detail": payload}
        return exc.code, detail


def assert_status(name: str, expected: int, actual: int):
    if actual != expected:
        raise AssertionError(f"{name}: expected HTTP {expected}, got {actual}")


def main() -> None:
    print("1. Health check")
    status, body = request("GET", "/health")
    assert_status("health", 200, status)
    assert body["status"] == "ok"

    print("2. Employee signup")
    status, employee = request(
        "POST",
        "/api/auth/signup",
        {
            "email": "employee@example.com",
            "password": "EmployeePass123!",
            "employee_id": "EMP001",
        },
    )
    assert_status("signup", 201, status)
    assert employee["role"] == "employee"
    assert "password" not in employee
    assert "hashed_password" not in employee

    print("3. Employee login")
    status, login = request(
        "POST",
        "/api/auth/login",
        {"email": "employee@example.com", "password": "EmployeePass123!"},
    )
    assert_status("login", 200, status)
    employee_token = login["access_token"]
    assert login["user"]["role"] == "employee"

    print("4. Invalid credentials")
    status, error = request(
        "POST",
        "/api/auth/login",
        {"email": "employee@example.com", "password": "WrongPassword!"},
    )
    assert_status("invalid login", 401, status)
    assert error["detail"] == "Incorrect email or password"

    print("5. Protected route /me")
    status, me = request("GET", "/api/auth/me", token=employee_token)
    assert_status("me", 200, status)
    assert me["email"] == "employee@example.com"

    print("6. Employee dashboard access")
    status, dashboard = request("GET", "/api/auth/dashboard/employee", token=employee_token)
    assert_status("employee dashboard", 200, status)
    assert "Employee dashboard" in dashboard["message"]

    print("7. Employee blocked from admin dashboard")
    status, forbidden = request("GET", "/api/auth/dashboard/admin", token=employee_token)
    assert_status("employee admin block", 403, status)
    assert forbidden["detail"] == "Insufficient permissions"

    print("8. Admin login")
    status, admin_login = request(
        "POST",
        "/api/auth/login",
        {"email": "admin@example.com", "password": "AdminPass123!"},
    )
    assert_status("admin login", 200, status)
    admin_token = admin_login["access_token"]
    assert admin_login["user"]["role"] == "admin"

    print("9. Admin dashboard access")
    status, admin_dashboard = request("GET", "/api/auth/dashboard/admin", token=admin_token)
    assert_status("admin dashboard", 200, status)
    assert "Admin/HR dashboard" in admin_dashboard["message"]

    print("10. Admin blocked from employee-only dashboard")
    status, admin_forbidden = request("GET", "/api/auth/dashboard/employee", token=admin_token)
    assert_status("admin employee block", 403, status)
    assert admin_forbidden["detail"] == "Insufficient permissions"

    print("11. Unauthenticated protected route")
    status, unauth = request("GET", "/api/auth/me")
    assert_status("unauthenticated", 403, status)

    print("\nAll authentication tests passed.")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"\nTEST FAILED: {exc}", file=sys.stderr)
        sys.exit(1)

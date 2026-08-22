"""Seed an Admin/HR user from environment variables."""

import os
import sys
from pathlib import Path

from dotenv import load_dotenv

backend_root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(backend_root))

load_dotenv(backend_root.parent / ".env")

from app.database import SessionLocal
from app.models.user import User, UserRole
from app.utils.security import hash_password


def main() -> None:
    email = os.environ.get("ADMIN_EMAIL")
    password = os.environ.get("ADMIN_PASSWORD")
    employee_id = os.environ.get("ADMIN_EMPLOYEE_ID", "ADMIN001")

    if not email or not password:
        print("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env")
        sys.exit(1)

    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"Admin user already exists: {email}")
            return

        admin = User(
            email=email,
            employee_id=employee_id,
            hashed_password=hash_password(password),
            role=UserRole.ADMIN,
        )
        db.add(admin)
        db.commit()
        print(f"Admin user created: {email} ({employee_id})")
    finally:
        db.close()


if __name__ == "__main__":
    main()

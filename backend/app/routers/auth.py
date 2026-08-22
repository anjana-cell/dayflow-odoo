from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user, require_role
from app.models.user import User, UserRole
from app.schemas.auth import MessageResponse, TokenResponse, UserLogin, UserResponse, UserSignup
from app.utils.security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: UserSignup, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    if db.query(User).filter(User.employee_id == payload.employee_id).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Employee ID already registered")

    user = User(
        email=payload.email,
        employee_id=payload.employee_id,
        hashed_password=hash_password(payload.password),
        role=UserRole.EMPLOYEE,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(subject=user.email, role=user.role.value)
    return TokenResponse(access_token=token, user=user)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/dashboard/employee", response_model=MessageResponse)
def employee_dashboard(current_user: User = Depends(require_role(UserRole.EMPLOYEE))):
    return MessageResponse(
        message=f"Welcome, {current_user.employee_id}. Employee dashboard access granted."
    )


@router.get("/dashboard/admin", response_model=MessageResponse)
def admin_dashboard(current_user: User = Depends(require_role(UserRole.ADMIN))):
    return MessageResponse(
        message=f"Welcome, {current_user.employee_id}. Admin/HR dashboard access granted."
    )

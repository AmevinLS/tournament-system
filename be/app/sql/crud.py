from sqlalchemy.orm import Session
from . import models, schemas
import hashlib
import secrets

# Utility functions

def hash_password(password: str, salt: str) -> str:
    hashed_password = hashlib.md5((password + salt).encode("utf-8")).hexdigest()
    return hashed_password


# CRUD operations

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session):
    return db.query(models.User).all()

def create_user(db: Session, user: schemas.UserCreate):
    salt = secrets.token_hex(16)
    password_hash = hash_password(user.password, salt)

    db_user = models.User(
        fname=user.fname, 
        lname=user.lname, 
        email=user.email, 
        hashed_password=password_hash,
        salt=salt
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user_by_email(db: Session, email: str) -> bool:
    user = db.query(models.User).filter(models.User.email == email).first()
    if user:
        db.delete(user)
        db.commit()
        return True
    else:
        return False

def delete_users(db: Session) -> bool:
    users = db.query(models.User).all()
    if users:
        for user in users:
            db.delete(user)
        db.commit()
    return True
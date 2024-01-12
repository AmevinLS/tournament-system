from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from pydantic import BaseModel

from typing import Annotated
import hashlib
import secrets
import datetime as dt

from sql import crud


SECRET_KEY = "verysecretkeylol"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str


def create_salt() -> str:
    return secrets.token_hex(16)

def hash_password(password: str, salt: str) -> str:
    hashed_password = hashlib.md5((password + salt).encode("utf-8")).hexdigest()
    return hashed_password

def verify_password(plain_password: str, hashed_password: str, salt: str):
    return hash_password(plain_password, salt) == hashed_password

def authenticate_user(db: Session, email: str, password: str):
    user = crud.get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password, user.salt):
        return False
    return user

def create_access_token(data: dict, expires_delta: dt.timedelta):
    to_encode = data.copy()
    expire = dt.datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(db: Session, token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user



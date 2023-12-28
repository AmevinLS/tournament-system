from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session
from sql import schemas, crud, models

from dependencies import get_db

router = APIRouter(
    prefix="/users",
    responses={404: {"description": "Not found"}}
)


@router.get("/")
def read_users(email: str = None, db: Session = Depends(get_db)):
    if email is None:
        return crud.get_users(db)
    return crud.get_user_by_email(db, email)

@router.post("/")
def add_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if (db.query(models.User).filter(models.User.email == user.email).count() > 0):
        print(db.query(models.User).filter(models.User.email == user.email).count())
        return HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db, user)

@router.post("/delete")
def delete_users(email: str = None, db: Session = Depends(get_db)):
    if email is None:
        if crud.delete_users(db):
            return {"message": "Successfully deleted all users"}
    else:
        if crud.delete_user_by_email(db, email):
            return {"message": f"Successfully deleted user with email {email}"}
        else:
            return HTTPException(status_code=400, detail=f"User with email {email} not fount")

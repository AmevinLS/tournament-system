from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks

from sqlalchemy.orm import Session
from typing import Union, List, Annotated
from sql import schemas, crud, models
from datetime import datetime, timedelta
from uuid import uuid4

from dependencies import get_db
from security import oauth2_scheme, get_current_user
from emails import send_email_background

router = APIRouter(
    prefix="/users",
    responses={404: {"description": "Not found"}}
)


@router.get("/", response_model=Union[schemas.UserRead, List[schemas.UserRead]])
def read_users(email: str = None, db: Session = Depends(get_db)):
    if email is None:
        return crud.get_users(db)
    return crud.get_user_by_email(db, email)

@router.post("/", response_model=schemas.UserRead)
def add_user(user: schemas.UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    if (db.query(models.User).filter(models.User.email == user.email).count() > 0):
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = crud.create_user(db, user)

    user_activation = schemas.UserActivation(
        user_email=user.email,
        activation_token=str(uuid4()),
        expiry_date=(datetime.now() + timedelta(days=1))
    )
    crud.create_user_activation(db, user_activation)

    send_email_background(
        background_tasks,
        subject = "Account activation", 
        email_to = user.email, 
        template_fname = "activation_email.html", 
        body= {
            "title": "Activation of account",
            "name": f"{user.fname} {user.lname}",
            "activation_url": f"http://127.0.0.1:8000/users/activate?activation_token={user_activation.activation_token}"
        }
    )

    return db_user

@router.post("/delete")
def delete_user(email: str, token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    user = get_current_user(db, token)
    if user.email != email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Users can only delete their own account"
        )
    if crud.delete_user_by_email(db, email):
        return {"message": f"Successfully deleted user '{email}'"}
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong"
        )
    
@router.post("/delete_all")
def delete_all_users(db: Session = Depends(get_db)):
    if crud.delete_users(db):
        return {"message": "Successfully deleted all users"}

@router.get("/activate")
def activate_user(activation_token: str, db: Session = Depends(get_db)):
    user_activation = crud.get_user_activation(db, activation_token)
    if user_activation is None:
        return {"message": "Nice try, no such activation token"}
    if user_activation.expiry_date < datetime.now():
        return {"message": "Activation link has already expired"}

    crud.activate_user_by_email(db, user_activation.user_email)
    return {"message": "Successfully Activate Account"}
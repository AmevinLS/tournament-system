from fastapi import FastAPI, HTTPException, Depends, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from routers import users, tournaments, participations
from security import (
    Token, authenticate_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, 
    PasswordResetBody, PasswordResetRequestBody, get_current_user
)
from dependencies import get_db
from emails import send_email_background
import sql.crud as crud

from typing import Annotated
import datetime as dt

app = FastAPI()

origins = [
    "http://localhost:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(users.router)
app.include_router(tournaments.router)
app.include_router(participations.router)

@app.get("/")
def read_root():
    return {"allgood": "yes"}

@app.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    if not user.activated:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not activated",
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token_expires = dt.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/request_pass_reset")
async def request_password_reset(reset_req_body: PasswordResetRequestBody, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, reset_req_body.user_email)
    if user is None:
        return
    
    reset_token = create_access_token({"sub": user.email}, expires_delta=dt.timedelta(hours=1))
    send_email_background(
        background_tasks,
        subject="Password reset",
        email_to=reset_req_body.user_email,
        template_fname="button_email.html",
        body={
            "title": "Password Reset",
            "name": f"{user.fname} {user.lname}",
            "body_text": "Click this link to reset your password",
            "button_text": "Reset password",
            "button_url": f"http://localhost:5173/reset_password?reset_token={reset_token}"
        }
    )
    return {"message": "Password reset email sent"}


@app.post("/reset_pass")
def reset_password(reset_form: PasswordResetBody, db: Session = Depends(get_db)):
    user = get_current_user(db, reset_form.reset_token)
    crud.update_user_password(db, user.email, reset_form.new_password)
    return {"message": "Password reset successfully"}
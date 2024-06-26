from fastapi import FastAPI, HTTPException, Depends, status, BackgroundTasks
from fastapi.concurrency import contextmanager_in_threadpool
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
from sql import crud, models, schemas
from utils import repeat_every
import asyncio
import random

from typing import Annotated
import datetime as dt
from contextlib import asynccontextmanager, contextmanager


async def start_tournaments(seconds: int, max_repeats: int = None):
    async with contextmanager_in_threadpool(contextmanager(get_db)()) as db:
        db: Session
        curr_repeats = 0
        while max_repeats is None or curr_repeats < max_repeats:
            print("Checking for tournaments to start")
            db_tournaments = (
                db.query(models.Tournament.tourn_id)
                .filter(models.Tournament.time < dt.datetime.now(), ~models.Tournament.started)
                .all()
            )
            if len(db_tournaments) > 0:
                tourn_ids = [row[0] for row in db_tournaments]
                crud.start_tournaments(db, tourn_ids)
                print("Started tournaments:", tourn_ids)
            curr_repeats += 1
            await asyncio.sleep(seconds)

@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(start_tournaments(seconds=30, max_repeats=5))
    yield

app = FastAPI(lifespan=lifespan)

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

@app.post("/_generate")
def generate_users_tournaments(num_users: int, num_tournaments: int, db: Session = Depends(get_db)):
    users = [
        schemas.UserCreate(email=f"dummy{i}@example.com", fname=f"Dummy{i}", lname=f"Lname{i}", password="nikita") 
        for i in range(num_users)
    ]

    tourns: list[schemas.TournamentCreate] = []
    participant_emails_l = []
    for i in range(num_tournaments):
        organizer = random.choice(users)
        time = dt.datetime.now() + dt.timedelta(minutes=random.randint(3, 10))
        tourn = schemas.TournamentCreate(
            name=f"EasyTourney{i}", organizer_email=organizer.email, 
            time=time,
            loc_latitude=random.randint(-90, 90), loc_longitude=random.randint(-180, 180),
            max_participants=num_users//2,
            apply_deadline=(time - dt.timedelta(seconds=10))
        )

        num_participants = random.randint(0, tourn.max_participants)
        participant_emails = [user.email for user in random.sample(users, num_participants)]
        participant_emails_l.append(participant_emails)

        tourns.append(tourn)

    
    for user in users:
        crud.create_user(db, user)
        db.query(models.User).filter(models.User.email == user.email).update({models.User.activated: True})
    db.commit()

    for tourn, participant_emails in zip(tourns, participant_emails_l):
        tourn = crud.create_tournament(db, tourn)
        participations = [
            schemas.ParticipationCreate(
                user_email=email, 
                tourn_id=tourn.tourn_id, 
                license_number="lolkek", 
                elo=random.randint(1000, 2000)
            ) 
            for email in participant_emails
        ]
        for participation in participations:
            crud.add_participation(db, participation)
    db.commit()
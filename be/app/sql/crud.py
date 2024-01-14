from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import datetime
from . import models, schemas
import security

# CRUD operations

# users table
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session):
    return db.query(models.User).all()

def create_user(db: Session, user: schemas.UserCreate):
    salt = security.create_salt()
    password_hash = security.hash_password(user.password, salt)

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


# tournaments table
def get_tournament_by_id(db: Session, tourn_id: str):
    return db.query(models.Tournament).filter(models.Tournament.tourn_id == tourn_id).first()

def get_tournament_by_name(db: Session, name: str):
    return db.query(models.Tournament).filter(models.Tournament.name == name).first()

def get_tournaments_by_name_contains(db: Session, value: str):
    return db.query(models.Tournament).filter(models.Tournament.name.contains(value)).all()

def get_tournaments(db: Session):
    return db.query(models.Tournament).all()

def get_number_of_tournaments(db: Session, name_contains: str = "", exclude_passed: bool = False):
    query = db.query(models.Tournament).filter(models.Tournament.name.contains(name_contains))
    if exclude_passed:
        return query.filter(models.Tournament.time < datetime.now()).count()
    return query.count()

def create_tournament(db: Session, tournament: schemas.TournamentCreate):
    tourn_id = uuid4()
    db_tournament = models.Tournament(
        tourn_id = tourn_id,
        name = tournament.name,
        organizer_email = tournament.organizer_email,
        time = tournament.time,
        loc_latitude = tournament.loc_latitude,
        loc_longitude = tournament.loc_longitude,
        max_participants = tournament.max_participants,
        apply_deadline = tournament.apply_deadline
    )
    db.add(db_tournament)
    db.commit()
    db.refresh(db_tournament)
    return db_tournament

def delete_tournament_by_id(db: Session, tourn_id: str) -> bool:
    db_tournament = db.query(models.Tournament).filter(models.Tournament.tourn_id == tourn_id).first()
    if db_tournament:
        db.delete(db_tournament)
        db.commit()
        return True
    else:
        return False

def delete_tournaments(db: Session) -> bool:
    tournaments = db.query(models.Tournament).all()
    if tournaments:
        for tournament in tournaments:
            db.delete(tournament)
        db.commit()
    return True
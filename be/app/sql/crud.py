from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import datetime
from typing import List, Optional, Union
from . import models, schemas
import security

# CRUD operations

# users table
def get_user_full(db: Session, email: str) -> models.User:
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_email(db: Session, email: str) -> models.UserPublic:
    return db.query(models.UserPublic).filter(models.UserPublic.email == email).first()

def get_users(db: Session) -> List[models.UserPublic]:
    return db.query(models.UserPublic).all()

def create_user(db: Session, user: schemas.UserCreate) -> models.UserPublic:
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
    return db.query(models.UserPublic).filter(models.UserPublic.email == user.email)

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
def get_tournament_by_id(db: Session, tourn_id: str) -> models.Tournament:
    return db.query(models.Tournament).filter(models.Tournament.tourn_id == tourn_id).first()

def get_tournaments_by_organizer_email(db: Session, organizer_email: str) -> List[models.Tournament]:
    return db.query(models.Tournament).filter(models.Tournament.organizer_email == organizer_email).all()

def get_tournament_by_name(db: Session, name: str) -> models.Tournament:
    return db.query(models.Tournament).filter(models.Tournament.name == name).first()

def get_tournaments_by_name_contains(db: Session, value: str) -> List[models.Tournament]:
    return db.query(models.Tournament).filter(models.Tournament.name.contains(value)).all()

def get_tournaments(db: Session) -> List[models.Tournament]:
    return db.query(models.Tournament).all()

def get_number_of_tournaments(db: Session, name_contains: str = "", exclude_passed: bool = False) -> int:
    query = db.query(models.Tournament).filter(models.Tournament.name.contains(name_contains))
    if exclude_passed:
        return query.filter(models.Tournament.time < datetime.now()).count()
    return query.count()

def update_tournament(db: Session, tournament: schemas.TournamentUpdate) -> bool:
    # TODO: add check so that you can't decrease the max participant cap lower than the number already applied
    if get_tournament_by_id(db, tournament.tourn_id) is None:
        return False
    db.query(models.Tournament).filter(models.Tournament.tourn_id == tournament.tourn_id).update({
        models.Tournament.name: tournament.name,
        models.Tournament.time: tournament.time,
        models.Tournament.organizer_email: tournament.organizer_email,
        models.Tournament.loc_latitude: tournament.loc_latitude,
        models.Tournament.loc_longitude: tournament.loc_longitude,
        models.Tournament.max_participants: tournament.max_participants,
        models.Tournament.apply_deadline: tournament.apply_deadline
    })
    db.commit()
    return True

def create_tournament(db: Session, tournament: schemas.TournamentCreate) -> models.Tournament:
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


# participations table
def get_participations(
        db: Session, 
        user_email: Optional[str] = None,
        tourn_id: Optional[str] = None
    ) -> Union[models.Participation, List[models.Participation]]:
    query = db.query(models.Participation)
    if user_email is not None:
        query.filter(models.Participation.user_email == user_email)
    if user_email is not None:
        query.filter(models.Participation.tourn_id == tourn_id)

    if None in [user_email, tourn_id]:
        return query.all()
    return query.first()

def add_participation(db: Session, participation: schemas.ParticipationCreate) -> models.Participation:
    db_participation = models.Participation(
        user_email=participation.user_email,
        tourn_id=participation.tourn_id,
        license_number=participation.license_number,
        elo=participation.elo
    )
    db.add(db_participation)
    db.commit()
    db.refresh(db_participation)
    return db_participation

def get_tournaments_by_user_email_participant(db: Session, user_email: str) -> List[models.Tournament]:
    return (
        db.query(models.Tournament)
        .join(models.Participation, models.Tournament.tourn_id == models.Participation.tourn_id)
        .filter(models.Participation.user_email == user_email)
        .all()
    )
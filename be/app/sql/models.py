from sqlalchemy import Column, String, DateTime, Double, Integer, CHAR, ForeignKey
from .database import Base


class User(Base):
    __tablename__ = "users"
    fname = Column(String)
    lname = Column(String)
    email = Column(String, primary_key=True)
    hashed_password = Column(String)
    salt = Column(String)


class UserPublic(Base):
    __tablename__ = User.__tablename__
    __table_args__ = {'extend_existing': True} 
    fname = Column(String)
    lname = Column(String)
    email = Column(String, primary_key=True)


class Tournament(Base):
    __tablename__ = "tournaments"
    tourn_id = Column(String, primary_key=True)
    name = Column(String)
    organizer_email = Column(String, ForeignKey("users.email"))
    time = Column(DateTime)
    loc_latitude = Column(Double)
    loc_longitude = Column(Double)
    max_participants = Column(Integer)
    apply_deadline = Column(DateTime)


class Participation(Base):
    __tablename__ = "participations"
    user_email = Column(String, ForeignKey("users.email"), primary_key=True)
    tourn_id = Column(String, ForeignKey("tournaments.tourn_id"), primary_key=True)
    license_number = Column(CHAR(6))
    elo = Column(Integer)
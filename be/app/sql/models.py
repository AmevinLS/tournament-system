from sqlalchemy import Column, String
from .database import Base


class User(Base):
    __tablename__ = "users"
    fname = Column(String)
    lname = Column(String)
    email = Column(String, primary_key=True)
    hashed_password = Column(String)
    salt = Column(String)
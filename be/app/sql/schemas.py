from pydantic import BaseModel, Field, model_validator, field_validator
from datetime import datetime


EMAIL_REGEX = r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+'
EMAIL_KWARGS = {
    "pattern": EMAIL_REGEX,
    "examples": ["foobar@gmail.com"]
}

class UserBase(BaseModel):
    email: str = Field(..., **EMAIL_KWARGS)

class UserRead(UserBase):
    fname: str = Field(..., min_length=1)
    lname: str = Field(..., min_length=1)

class UserCreate(UserRead):    
    password: str = Field(..., min_length=1)


class UserActivation(BaseModel):
    user_email: str = Field(..., min_length=1)
    activation_token: str = Field(..., min_length=1)
    expiry_date: datetime

    @field_validator("expiry_date")
    def expiry_date_in_future(cls, v: datetime, info):
        if v < datetime.now():
            raise ValueError("'expiry_date' cannot be in the past")
        return v


class TournamentCreate(BaseModel):
    name: str = Field(..., min_length=1)
    organizer_email: str = Field(..., **EMAIL_KWARGS)
    time: datetime
    loc_latitude: float = Field(..., ge=-90, le=90)
    loc_longitude: float = Field(..., ge=-180, le=180)
    max_participants: int = Field(..., ge=2)
    apply_deadline: datetime

    @model_validator(mode="after")
    def check_apply_before_time(self) -> "TournamentCreate":
        if self.apply_deadline >= self.time:
            raise ValueError("Apply deadline should be later than tournament time")
        return self
    
class TournamentUpdate(TournamentCreate):
    tourn_id: str = Field(..., min_length=1)


class ParticipationBase(BaseModel):
    user_email: str = Field(..., **EMAIL_KWARGS)
    tourn_id: str = Field(..., min_length=1)

class Participation(ParticipationBase):
    license_number: str = Field(..., min_length=6, max_length=6)
    elo: int = Field(..., ge=1)

class ParticipationCreate(Participation):
    pass

class ParticipationRead(Participation):
    match_ind: int = Field(..., ge=1)
from pydantic import BaseModel, Field, model_validator
from datetime import datetime

class UserBase(BaseModel):
    email: str = Field(..., min_length=1)

class UserRead(UserBase):
    fname: str = Field(..., min_length=1)
    lname: str = Field(..., min_length=1)

class UserCreate(UserRead):    
    password: str = Field(..., min_length=1)


class TournamentCreate(BaseModel):
    name: str = Field(..., min_length=1)
    organizer_email: str = Field(..., min_length=1)
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
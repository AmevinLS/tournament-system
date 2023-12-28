from pydantic import BaseModel, Field

class UserBase(BaseModel):
    email: str = Field(..., min_length=1)

class UserCreate(UserBase):
    fname: str = Field(..., min_length=1)
    lname: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)
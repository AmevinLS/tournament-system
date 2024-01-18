from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy.orm import Session
from sql import schemas, crud
from typing import Annotated, Optional, Union, List

from dependencies import get_db
from security import oauth2_scheme, get_current_user

router = APIRouter(
    prefix="/participations",
    responses={404: {"description": "Not found"}}
)

@router.get("/", response_model=Union[Optional[schemas.ParticipationRead], List[schemas.ParticipationRead]])
def read_participations(user_email: Optional[str] = None, tourn_id: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.get_participations(db, user_email=user_email, tourn_id=tourn_id)

@router.post("/")
def add_participation(participation: schemas.ParticipationCreate, token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    user = get_current_user(db, token)
    if user.email != participation.user_email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cannot create participation for user other than current"
        )
    tournament = crud.get_tournament_by_id(db, participation.tourn_id)
    if tournament is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tournament with such ID does not exist"
        )
    return crud.add_participation(db, participation)

@router.get("/tourns_applied")
def read_applied_to_tournaments(user_email: str, token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    user = get_current_user(db, token)
    if user.email != user_email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current user doesn't have access to other user's data"
        )
    return crud.get_tournaments_by_user_email_participant(db, user_email)
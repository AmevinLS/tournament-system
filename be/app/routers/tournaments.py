from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session
from sql import schemas, crud, models
from datetime import datetime, timedelta

from dependencies import get_db

router = APIRouter(
    prefix="/tournaments",
    responses={404: {"description": "Not found"}}
)

@router.get("/")
def read_tournaments(tourn_id: str = None, db: Session = Depends(get_db)):
    if tourn_id is None:
        return crud.get_tournaments(db)
    return crud.get_tournament_by_id(db, tourn_id)

@router.post("/")
def add_tournament(tournament: schemas.TournamentCreate, db: Session = Depends(get_db)):
    if crud.get_tournament_by_name(db, tournament.name) is not None:
        print(db.query(models.Tournament).filter(models.Tournament.name == tournament.name).count())
        return HTTPException(status_code=400, detail="Tournament with such name already exists")
    if crud.get_user_by_email(db, tournament.organizer_email) is None:
        return HTTPException(status_code=400, detail=f"User {tournament.organizer_email} does not exist")
    return crud.create_tournament(db, tournament)

@router.post("/delete")
def delete_tournaments(tourn_id: str = None, db: Session = Depends(get_db)):
    if tourn_id is None:
        if crud.delete_tournaments(db):
            return {"message": "Successfully deleted all tournaments"}
    else:
        if crud.delete_tournament_by_id(db, tourn_id):
            return {"message": f"Successfully deleted tournament with tourn_id '{tourn_id}'"}
        else:
            return HTTPException(status_code=400, detail=f"Tournament with tourn_id '{tourn_id}' not found")


@router.get("/paged")
def read_tournament_page(page: int, pageSize: int, db: Session = Depends(get_db)):
    num_tournaments = crud.get_number_of_tournaments(db, exclude_passed=False)
    total_pages = num_tournaments // pageSize + int(num_tournaments % pageSize > 0) 
    offset = (page-1) * pageSize
    tournamets_on_page = db.query(models.Tournament).order_by(models.Tournament.time).offset(offset).limit(pageSize).all()
    return {"tournaments": tournamets_on_page, "totalPages": total_pages}
    


@router.post("/clear_and_generate")
def clear_and_generate_tournaments(amount: int = None, db: Session = Depends(get_db)):
    crud.delete_tournaments(db)
    users = crud.get_users(db)
    if len(users) < 0:
        return HTTPException(status_code=400, detail="No users exist. Cannot generate tournaments")
    for i in range(1, amount+1):
        tournament = schemas.TournamentCreate(
            name = f"Tournament{i}",
            organizer_email=users[0].email,
            time=datetime.now() + timedelta(days=2),
            loc_latitude=0,
            loc_longitude=0,
            max_participants=20,
            apply_deadline=datetime.now()
        )
        crud.create_tournament(db, tournament)
    return {"message": f"Successfully created {amount} tournaments"}
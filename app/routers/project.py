from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Security
from sqlalchemy.orm import Session
import models
import schemas
import database
import oauth2
from hash import Hash
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from pydantic import BaseModel, ValidationError
from JWTToken import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY
from oauth2 import oauth2_scheme
from datetime import date, datetime

router = APIRouter(
    prefix="/project",
    tags=["project"],
    dependencies=None,
    responses=None
)

get_db = database.get_db


@router.post('/')
def create_project(request: schemas.project, db: Session = Depends(get_db)):
    new_obj = models.Projects(
        id_project=db.query(models.Projects).count() + 1,
        name_project=request.name_project,
        create_time=datetime.now() + ', ' + date.now(),
        description=request.description
    )
    # when create project, project_status will be create automatically
    new_status = models.project_status(
        id_project=new_obj.id_project,
        status='not finish'
    )
    db.add(new_obj)
    db.refresh(new_obj)
    db.add(new_status)
    db.commit()
    db.refresh(new_status)
    return new_obj


@router.put('/{id}')
def update_project(request: schemas.project_status, db: Session = Depends(get_db)):
    update_obj = db.query(models.Projects).filter(
        models.Projects.id_project == request.id_project).first()
    if not update_obj:
        pass
        # raise HTTPException(
        #         status_code=status.,
        #         # detail="Not enough permissions",
        #         # headers={"WWW-Authenticate": authenticate_value},
        #     )
    update_obj.description = request.description

    update_status = db.query(models.project_status).filter(
        models.project_status.id_project == request.id_project).first()
    update_status.status = request.status
    db.commit()
    return 'update success fully'

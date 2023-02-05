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
    prefix="/task",
    tags=["task"],
    dependencies=None,
    responses={404: {"description": "Not found"}},
)

get_db = database.get_db


@router.post('/')
def create_task(request: schemas.task, db: Session = Depends(get_db)):
    new_obj = models.task(
        id_task=db.query(models.task).count() + 1,
        id_project=request.id_project,
        create_time=datetime.now(),
        id_employee=request.id_employee,
        description=request.description
    )
    db.add(new_obj)

    new_task = models.task_status(
        id_task=new_obj.id_task,
        status='unfinish'
    )
    db.add(new_task)
    db.commit()
    return new_obj


@router.put('/{id}')
def update_status_task(request: schemas.task_status, db: Session = Depends(get_db)):
    obj = db.query(models.task_status).filter(
        models.task_status.id_task == request.id_task).first()
    if not obj:
        return 'not found the task'
        # raise http exception
    obj.status = request.status
    db.commit()
    return 'updated!'

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
    prefix="/workflow",
    tags=["workflow"],
    dependencies=None,
    responses=None
)

get_db = database.get_db


@router.post('/description/')
def add_workflow_description(request: schemas.workflow_description, db: Session = Depends(get_db)):
    new_obj = models.workflow_description(
        id_project=request.id_project,
        phase=request.phase,
        description=request.description
    )
    db.add(new_obj)
    db.commit()
    db.refresh(new_obj)
    return new_obj


@router.put('/description/{id}')
def update_workflow_description(id: int, request: schemas.workflow_description, db: Session = Depends(get_db)):
    obj = db.query(models.workflow_description).filter(models.workflow_description.id_project ==
                                                       request.id_project and models.workflow_description.phase == request.phase).first()
    obj.description = request.description
    db.commit()
    return


@router.delete('/description/')
def update_workflow_description(request: schemas.workflow_description, db: Session = Depends(get_db)):
    db.query(models.workflow_description).filter(models.workflow_description.id_project ==
                                                 request.id_project and models.workflow_description.phase == request.phase).delete(synchronize_session=False)
    db.commit()
    return 'deleted'


@router.post('/record/')
def create_record(request: schemas.workflow_record, db: Session = Depends(get_db)):
    new_obj = models.workflow_record(
        id_workflow=request.id_workflow,
        id_project=request.id_project,
        status=request.status,
        execute_time=datetime.now()
    )
    db.add(new_obj)
    db.commit()
    db.refresh(new_obj)
    return new_obj


@router.delete('/record')
def delete_record(id: int, request: schemas.workflow_record, db: Session = Depends(get_db)):
    db.query(models.workflow_record).filter(models.workflow_record.id_project ==
                                            request.id_project and models.workflow_record.id_workflow == request.id_workflow).delete()
    db.query(models.logfile).filter(models.logfile.id_workflow ==
                                    request.id_workflow).delete()
    db.commit()
    return


@router.post('/record/{id}/logfile')
def add_log(id: int, request: schemas.log_file, db: Session = Depends(get_db)):
    new_obj = models.logfile(
        id_workflow=request.id_workflow,
        phase=request.phase,
        type=request.type,
        log_description=request.log
    )
    db.add(new_obj)
    db.commit()
    db.refresh(new_obj)
    return new_obj

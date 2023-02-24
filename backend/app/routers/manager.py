from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Security

from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from pydantic import BaseModel, ValidationError
from db import database
from models import models
from sqlalchemy.orm import Session


router = APIRouter(
    prefix="/manager",
    tags=["manager"],
    dependencies=None,
    responses=None
)

get_db = database.get_db


@router.get('/me')
def get_current_information(account_id: str, db: Session = Depends(get_db)):
    obj = db.query(models.Manager).filter(models.Manager.account_id == account_id).first()
    return obj

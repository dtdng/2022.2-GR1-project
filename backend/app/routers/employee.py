from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Security
from sqlalchemy.orm import Session
from models import models
from schemas import schemas
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from pydantic import BaseModel, ValidationError
from core.JWTToken import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY
from core.oauth2 import oauth2_scheme
from db import database

router = APIRouter(
    prefix="/employee",
    tags=["employee"],
    dependencies=None,
    responses=None
)

get_db = database.get_db


async def get_current_user(security_scopes: SecurityScopes, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = f"Bearer"

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": authenticate_value},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_scopes = payload.get("scopes", [])
        token_data = schemas.TokenData(scopes=token_scopes, username=username)
    except (JWTError, ValidationError):
        raise credentials_exception

    current_account = db.query(models.accounts).filter(
        models.accounts.username == token_data.username).first()
    if current_account is None:
        raise credentials_exception
    # for scope in security_scopes.scopes:
    #     if scope not in token_data.scopes:
    #         raise HTTPException(
    #             status_code=status.HTTP_401_UNAUTHORIZED,
    #             detail="Not enough permissions",
    #             headers={"WWW-Authenticate": authenticate_value},
    #         )
    return current_account


# @router.get('/me')
# def read_users_me(current_user: schemas.project_status = Security(get_current_user, scopes=["me"])):
#     return current_user

@router.get('/me')
def get_current_information(account_id: str, db: Session = Depends(get_db)):
    obj = db.query(models.Employee).filter(models.Employee.account_id == account_id).first()
    return obj


@router.get('/')
def get_all_employee(db: Session = Depends(get_db)):
    obj = db.query(models.Employee).all()
    return obj


@router.get('/{id_employee}/task')
def get_task(id_employee: int, db: Session = Depends(get_db)):
    obj = db.query(models.task).filter(models.task.id_employee == id_employee).all()
    return obj

# @router.get('/project')
# def get_project(db: Session = Depends(get_db)):
#     obj = db.query(models.task).filter(models.task.id_employee == id_employee).all()
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
    # prefix="/",
    # tags=["admin"],
    # dependencies=None,
    # responses=None
)

get_db = database.get_db


@router.post('/roles')
def create_role(request: schemas.roles_input, db: Session = Depends(get_db)):
    new_obj = models.roles(
        role_id=request.role_id,
        role_name=request.role_name
    )
    db.add(new_obj)
    db.commit()
    db.refresh(new_obj)
    return new_obj


@router.post('/accounts')
def create_account(request: schemas.account_input, db: Session = Depends(get_db)):
    # check username existed or not?
    if db.query(models.accounts).filter(models.accounts.username == request.username).first():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username has existed",
        )

    new_account = models.accounts(
        account_id=db.query(models.accounts).count() +
        1,  # auto increment account_id
        role_id=request.role_id,
        username=request.username,
        password=Hash.get_password_hash(request.password)
    )
    # check role_id
    if request.role_id == 1:
        new_obj = models.Manager(
            id_manager=db.query(models.Manager).count()+1,
            email=request.email,
            account_id=db.query(models.accounts).count() + 1
        )
        db.add(new_obj)
        db.commit()
        db.refresh(new_obj)
    elif request.role_id == 2:
        new_obj = models.Employee(
            id_employee=db.query(models.Employee).count()+1,
            name=request.name,
            email=request.email,
            account_id=db.query(models.accounts).count() + 1
        )
        db.add(new_obj)
        db.commit()
        db.refresh(new_obj)
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    return new_obj


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
